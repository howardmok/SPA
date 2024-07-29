import { useNavigate } from "react-router-dom";
import { css, StyleSheet } from "aphrodite/no-important";
import {
  styles,
  Icon,
  EllipsisMenu,
  OutsideClickHandler,
  TextLink,
} from "@sweeten/oreo";
import { useEffect, useState } from "react";
import NotificationSvg from "../../../images/notifications.svg";
import {
  setHidden,
  setUnviewed,
  setViewedAt,
} from "../../Notifications/notification_card";
import { api } from "../../../utils/api";
import { calculateTimeAgo, getWindowWidth } from "../../shared";
import Loader from "../../loader";
import DeleteModal from "../../delete_modal";
import WorkHistoryModal from "../../Notifications/WorkHistoryModal";
import WorkHistoryIcon from "../../../images/icons/work-history";
import VerifyModal from "../../Notifications/VerifyModal";

const ss = StyleSheet.create({
  profileDropdownExpandedMenu: {
    position: "fixed",
    backgroundColor: "white",
    top: 65,
    right: 80,
    boxShadow: "0 2px 8px 0 rgba(0,0,0,0.16)",
    borderRadius: 12,
    width: 380,
    padding: 0,
    overflowY: "scroll",
    // bottom: 0,
    maxHeight: 480,
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.tabletStandard,
      style: {
        top: 58,
        right: 51,
      },
    }),
  },
  profileDropdownItem: {
    padding: "16px 16px 16px 24px",
    fontSize: 13,
    lineHeight: "24px",
    color: "#6C757D",
    ":hover": {
      backgroundColor: "var(--color-light-gray)",
      cursor: "pointer",
    },
    position: "relative",
    display: "flex",
  },
  blueDot: {
    width: 8,
    height: 8,
    position: "absolute",
    backgroundColor: styles.colors.brandPrimary,
    top: 28,
    left: 16,
    borderRadius: "50%",
  },
  profileDropdownContainer: {
    position: "relative",
  },
  profileDropdownUserContainer: {
    display: "flex",
    alignItems: "center",
    ":hover": {
      cursor: "pointer",
    },
  },
  profileDropdownName: {
    marginRight: 5,
    fontSize: 16,
    whiteSpace: "nowrap",
  },
  profileDropdownIcon: {
    height: 15,
  },
  desktop: {
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.tabletStandard,
      style: {
        display: "none",
      },
    }),
  },
  mobile: {
    display: "none",
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.tabletStandard,
      style: {
        display: "block",
      },
    }),
  },
  header: {
    padding: "16px 24px",
    fontSize: 16,
    fontWeight: 600,
    color: "black",
    borderBottom: "1px solid #E9ECEF",
  },
  unread: {
    fontSize: 12,
    padding: 4,
    position: "absolute",
    lineHeight: "10px",
    color: "white",
    height: 16,
    borderRadius: 20,
    backgroundColor: "#F9837C",
    top: -8,
    right: 14,
  },
  card: {
    position: "relative",
    padding: "24px 24px 24px 40px",
    display: "flex",
    marginBottom: 32,
    width: "100%",
    borderRadius: 12,
    boxShadow: "0 8px 16px 0 rgba(0,0,0,0.04)",
    boxSizing: "border-box",
    backgroundColor: styles.colors.white,
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.tabletStandard,
      style: {
        padding: 16,
        marginBottom: 24,
      },
    }),
  },
  iconContainer: {
    minWidth: 32,
    height: 32,
    backgroundColor: "#DCEED7",
    ...styles.center(),
    marginRight: 12,
    borderRadius: "50%",
    ":nth-child(1n) svg": {
      width: 16,
      height: 16,
    },
  },
  viewDetails: {
    fontSize: 14,
    color: styles.colors.brandPrimary,
    marginBottom: 24,
    cursor: "pointer",
  },
  timeAgo: {
    fontSize: 10,
    color: "#76808F",
  },
  ellipsis: {
    position: "absolute",
    width: 32,
    height: 32,
    borderRadius: "50%",
    ...styles.center(),
    backgroundColor: "#F8F9FA",
    top: 24,
    right: 24,
  },
  blueBackground: {
    backgroundColor: "rgba(13,162,245,0.08)",
  },
  noNotifications: {
    textAlign: "center",
    padding: "16px 0px",
    color: "#4D72D6",
  },
  topNavItem: {
    fontWeight: 400,
    fontSize: 10,
    color: "#000000",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 4,
    padding: 10,
    ":hover": {
      borderRadius: 6,
      backgroundColor: "#F2F4F7",
    },
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.tabletStandard,
      style: {
        marginLeft: 20,
      },
    }),
  },
});

const determineNotificationIconData = (notification, senderName) => {
  let cardData = {};

  switch (notification.type) {
    case "new_work_history":
      cardData = {
        icon: <WorkHistoryIcon />,
        body: `You have a pending work history from ${senderName}.`,
      };
      break;
    case "rejected_work_history":
      cardData = {
        icon: <WorkHistoryIcon />,
        body: `A work history request has been rejected from ${senderName}`,
      };
      break;
    case "revised_work_history":
      cardData = {
        icon: <WorkHistoryIcon />,
        body: `${senderName} has requested a revision for a work history request.`,
      };
      break;
    default:
      cardData = {
        icon: <WorkHistoryIcon />,
        body: (
          <div>
            There are new projects in your area. Visit the
            <TextLink
              onClick={() => (window.location.href = "/opportunity/search")}
            >
              Opportunities
            </TextLink>
            section to learn more.
          </div>
        ),
      };
      break;
  }

  return cardData;
};

export const determineSenderName = async (notification) => {
  let resp;
  switch (notification.type) {
    case "new_work_history":
      resp = await api({
        path: `hiring_company?id=${notification.subject.hiring_company_id}`,
      });

      return resp[0].business_name;
    case "rejected_work_history":
    case "revised_work_history":
      resp = await api({
        path: `mwbes?id=${notification.subject.mwbe_id}`,
      });

      return resp[0].legal_business_name;
    default:
  }
};

const NotificationItem = ({
  notification,
  toggleIsExpanded,
  setCurrentNotification,
  setUpdated,
  setModalState,
}) => {
  const [senderName, setSenderName] = useState(null);
  const navigate = useNavigate();

  useEffect(async () => {
    const name = await determineSenderName(notification);
    setSenderName(name);
  }, []);

  if (!senderName) {
    return (
      <div style={{ padding: 12 }}>
        <Loader />
      </div>
    );
  }

  const cardData = determineNotificationIconData(notification, senderName);

  return (
    <div
      className={css(
        ss.profileDropdownItem,
        !notification.viewed_at && ss.blueBackground
      )}
      onClick={() => {
        navigate("/notifications");
        setUpdated(true);
        toggleIsExpanded(false);
        setCurrentNotification(notification);
        if (notification.subject_type === "Project") {
          setModalState("work-history");
        } else if (notification.subject_type === "ProjectRevision") {
          setModalState("verify");
        }
      }}
    >
      {!notification.viewed_at && <div className={css(ss.blueDot)} />}
      <div className={css(ss.iconContainer)}>{cardData.icon}</div>
      <div style={{ fontWeight: 400 }}>
        <div style={{ marginBottom: 8, maxWidth: "85%" }}>{cardData.body}</div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div className={css(ss.timeAgo)}>
            {calculateTimeAgo(notification.created_at)}
          </div>
        </div>
      </div>
      <div className={css(ss.ellipsis)} onClick={(e) => e.stopPropagation()}>
        <EllipsisMenu>
          {notification.type === "revised_work_history" && (
            <EllipsisMenu.Item onClick={() => setModalState("verify")}>
              Verify
            </EllipsisMenu.Item>
          )}
          {!notification.viewed_at ? (
            <EllipsisMenu.Item
              onClick={() => {
                setViewedAt(notification);
                setUpdated(true);
              }}
            >
              Mark as read
            </EllipsisMenu.Item>
          ) : (
            <EllipsisMenu.Item
              onClick={() => {
                setUnviewed(notification);
                setUpdated(true);
              }}
            >
              Mark as unread
            </EllipsisMenu.Item>
          )}
          <EllipsisMenu.Item onClick={() => setModalState("delete")}>
            Remove
          </EllipsisMenu.Item>
        </EllipsisMenu>
      </div>
    </div>
  );
};

const NotificationDropdown = ({ notifications, setUpdated }) => {
  const navigate = useNavigate();
  const notificationsActive =
    window.location.pathname.startsWith("/notifications");
  const [isExpanded, toggleIsExpanded] = useState(false);
  const [currentNotification, setCurrentNotification] = useState(null);
  const [modalState, setModalState] = useState(null);

  const windowWidth = getWindowWidth();

  const expandedRender = (
    <OutsideClickHandler onOutsideClick={() => toggleIsExpanded(false)}>
      <div
        className={`${css(ss.profileDropdownExpandedMenu)} show`}
        style={{ marginRight: 0 }}
      >
        <div className={css(ss.header)}>Notifications</div>
        {notifications.slice(0, 5).map((notification) => (
          <NotificationItem
            notification={notification}
            toggleIsExpanded={toggleIsExpanded}
            setCurrentNotification={setCurrentNotification}
            setUpdated={setUpdated}
            setModalState={setModalState}
          />
        ))}
        {!notifications.length ? (
          <div className={css(ss.noNotifications)}>
            You don't have any new notifications
          </div>
        ) : (
          <div
            style={{
              textAlign: "center",
              fontSize: 14,
              color: "black",
              padding: 16,
              cursor: "pointer",
              borderTop: "1px solid #E9ECEF",
              fontWeight: 600,
            }}
            onClick={() => {
              toggleIsExpanded(false);
              navigate("/notifications");
            }}
          >
            View all
            <Icon name="chevron-right" />
          </div>
        )}
      </div>
    </OutsideClickHandler>
  );

  const numUnread = notifications.filter(
    (notification) => !notification.viewed_at
  ).length;

  return (
    <>
      <div
        className={css(ss.topNavItem)}
        style={{ cursor: "pointer", position: "relative" }}
        onClick={() => {
          if (windowWidth <= styles.breakpoints.phoneStandard) {
            navigate("/notifications");
          } else {
            toggleIsExpanded(true);
          }
        }}
      >
        <img
          src={NotificationSvg}
          alt="notifications"
          style={{ width: 24, height: 24 }}
        />
        <div className={css(ss.desktop)} style={{ marginTop: 4 }}>
          Notifications
        </div>
        {!!numUnread && (
          <div className={css(ss.unread)}>
            {numUnread > 9 ? "9+" : numUnread}
          </div>
        )}
      </div>
      {isExpanded && (
        <div className={css(ss.profileDropdownContainer)}>{expandedRender}</div>
      )}
      {modalState === "work-history" && (
        <WorkHistoryModal
          notification={currentNotification}
          onClose={() => {
            setCurrentNotification(null);
            setModalState(null);
          }}
          setUpdated={setUpdated}
        />
      )}
      {modalState === "verify" && (
        <VerifyModal
          notification={currentNotification}
          onClose={() => {
            setCurrentNotification(null);
            setModalState(null);
          }}
          setUpdated={setUpdated}
        />
      )}
      {modalState === "delete" && (
        <DeleteModal
          onClose={() => {
            setModalState(null);
            setCurrentNotification(null);
          }}
          onDelete={() => {
            setHidden(currentNotification);
            setCurrentNotification(null);
            setModalState(null);
          }}
        />
      )}
    </>
  );
};

export default () => {
  const [data, setData] = useState(null);
  const [updated, setUpdated] = useState(false);

  useEffect(async () => {
    const resp = await api({
      path: `notifications/?hidden=false`,
    });

    setData(resp);
    setUpdated(false);
  }, [updated]);

  // return !data ? (
  //   <div style={{ marginRight: 32 }}>
  //     <Loader />
  //   </div>
  // ) : (
  //   <NotificationDropdown notifications={data} setUpdated={setUpdated} />
  // );

  if (!data) {
    return (
      <div style={{ marginRight: 32 }}>
        <Loader />
      </div>
    );
  }

  return (
    <NotificationDropdown notifications={data} setUpdated={setUpdated} />
  );
};
