import { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { styles, Icon } from "@sweeten/oreo";
import { StyleSheet, css } from "aphrodite/no-important";
import ProfileDropdown from "./ProfileDropdown";
import InboxCount from "../inbox_count";
import MyProjectsSvg from "../../images/my-projects.svg";
import ImpactReportsSvg from "../../images/impact-reports.svg";
import DirectorySvg from "../../images/directory.svg";
import OpportunitiesSvg from "../../images/bid-opportunities.svg";
import MyListsSvg from "../../images/my-lists.svg";
import MessagingIcon from "../../images/messaging.svg";
import KnowledgeBaseSvg from "../../images/knowledge-base.svg";
import { UserData } from "../redirect_handler";
import { AppDispatch } from "../app_provider";
import LeftNavMobile, { LeftNavMobileItem } from "../LeftNavMobile";
import SweetenEnterpriseLogo from "../../images/sweeten-logo-blue.svg";
import { api } from "../../utils/api";
import NotificationDropdown from "./NotificationDropdown";

export const topNavStyle = {
  desktop: { height: 56 },
  mobile: { height: 48 },
};

const ss = StyleSheet.create({
  navbarContainer: {
    padding: "36px 24px",
    borderBottom: "1px solid #D5DCE1",
    boxSizing: "border-box",
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 101,
    backgroundColor: "white",
    justifyContent: "space-between",
    display: "flex",
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.desktopStandard,
      style: {
        padding: "36px 0px 36px 24px",
      },
    }),
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.tabletStandard,
      style: {
        height: 72,
        paddingBottom: 32,
        ":nth-child(1n) > svg": {
          height: 24,
        },
      },
    }),
  },
  tab: {
    color: "#344054",
    fontSize: 16,
    cursor: "pointer",
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    padding: 14,
  },
  currentTabStyle: {
    color: styles.colors.black,
    backgroundColor: "#F6F7F8",
    borderRadius: 6,
    width: "100%",
  },
  listTab: {
    position: "relative",
  },
  shortlists: {
    position: "absolute",
    top: 66,
    right: 225,
    width: 360,
    borderRadius: 12,
    boxShadow: "0 2px 8px 0 rgba(0,0,0,0.16)",
    backgroundColor: "white",
    overflowY: "scroll",
    maxHeight: 480,
  },
  shortlist: {
    padding: 20,
    width: "100%",
    cursor: "pointer",
  },
  plusContainer: {
    width: 50,
    height: 50,
    lineHeight: "50px",
    boxSizing: "border-box",
    border: `2px solid ${styles.colors.brandPrimary}`,
    borderRadius: 4,
    fontSize: 48,
    ...styles.center(),
    marginRight: 18,
  },
  newListContainer: {
    fontSize: 14,
    padding: 20,
    cursor: "pointer",
    ...styles.center("vertical"),
    color: styles.colors.brandPrimary,
    borderBottom: "1px solid #D5DCE1",
    ":hover": {
      backgroundColor: "#F6F7F8",
    },
  },
  shortlistContainer: {
    ...styles.center("vertical"),
    justifyContent: "space-between",
    borderBottom: "1px solid #D5DCE1",
    ":hover": {
      backgroundColor: "#F6F7F8",
    },
  },
  closeIcon: {
    paddingRight: 12,
    cursor: "pointer",
  },
  desktop: {
    display: "flex",
    justifyContent: "flex-end",
    width: "100%",
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.tabletStandard,
      style: {
        display: "none",
      },
    }),
  },
  oppDropdown: {
    position: "absolute",
    backgroundColor: "white",
    borderRadius: 12,
    boxShadow: "rgb(0 0 0 / 16%) 0px 1rem 3rem",
    fontWeight: 500,
    marginTop: 8,
  },
  dropdownItem: {
    ":hover": {
      backgroundColor: "#E9ECEF",
    },
    padding: "8px 24px",
    cursor: "pointer",
    fontSize: 13,
    width: 220,
  },
  desktopNavbarItems: {
    display: "flex",
    justifyContent: "space-between",
    // width: "calc(100% - 255px)",
  },
  cursorPointer: {
    cursor: "pointer",
  },
  topNavContainer: {
    position: "fixed",
    top: 0,
    right: 0,
    left: 0,
    backgroundColor: styles.colors.white,
    zIndex: styles.zIndexes.topNav,
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    height: topNavStyle.desktop.height,
    padding: "0 40px",
    boxSizing: "border-box",
    borderBottom: styles.border,
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.desktopStandard,
      style: {
        padding: "0 0 0 24px",
      },
    }),
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.tabletStandard,
      style: {
        height: topNavStyle.mobile.height,
      },
    }),
  },
  navLogo: {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    left: 24,
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.tabletStandard,
      style: {
        left: 60,
        right: "50%",
      },
    }),
  },
  topNavSpacing: {
    paddingBottom: topNavStyle.desktop.height,
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.tabletStandard,
      style: {
        paddingBottom: topNavStyle.mobile.height,
      },
    }),
  },
  mobileOnly: {
    display: "none",
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.tabletStandard,
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        width: "100%",
        paddingRight: 16,
      },
    }),
  },
  icon: {
    marginRight: 12,
    width: 18,
    height: 18,
  },
  hamburgerIcon: {
    display: "none",
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.tabletStandard,
      style: {
        display: "block",
        position: "absolute",
        left: 0,
        paddingTop: -2,
        paddingLeft: 16,
        paddingRight: 16,
        cursor: "pointer",
      },
    }),
  },
  subItem: {
    padding: 14,
    marginTop: 8,
    color: styles.colors.black,
  },
  messagingProfDropdown: {
    display: "flex",
    alignItems: "center",
    position: "absolute",
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.tabletStandard,
      style: {
        padding: "24px 16px",
      },
    }),
  },
  noListContainer: {
    padding: 20,
    borderRadius: 4,
    backgroundColor: "#F6F8FD",
    color: "#4D72D6",
    whiteSpace: "normal",
    fontSize: 14,
    fontWeight: 400,
    textAlign: "center",
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
    cursor: "pointer",
    ":hover": {
      borderRadius: 6,
      backgroundColor: "#F2F4F7",
    },
  },
});


const HiringCompanyNavbar = ({
  user,
  transparencyDashboardUrl,
  isExpanded,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const myProjectsActive = location.pathname.indexOf("parent-project");
  const findCompaniesActive =
    location.pathname === "/search" || location.pathname === "/search/";
  const yourListsActive = location.pathname.indexOf("list") > -1;
  const opportunityActive = location.pathname.indexOf("opportunity") !== -1;
  // const transparencyDashboardActive = location.pathname.indexOf("transparency_dashboard") !== -1;
  // const messagingActive = location.pathname.startsWith("/messaging");

  const dispatch = useContext(AppDispatch);

  const createOpportunity = async () => {
    const newOpportunity = await api({
      path: "opportunities",
      method: "POST",
      body: {
        user_id: user.id,
        hiring_company_id:
          user.user_type === "INTERNAL" ? null : user.hiring_companies[0].id,
      },
    });

    if (newOpportunity.error) {
      dispatch({
        type: "alert:show",
        payload: {
          variant: "error",
          text: `Something went wrong. Please try again.`,
        },
      });
    } else {
      navigate(`/opportunity/${newOpportunity.id}/edit`);
    }
  };

  return (
    <>
      <div className={css(ss.desktop)}>
        {(user.user_type === "INTERNAL" || user.user_type === "PRIME") && (
          <div
            className={css(ss.topNavItem)}
            onClick={() => navigate(`/my-lists`)}
            data-test="my-lists"
          >
            <img
              src={MyListsSvg}
              alt="my-lists"
              style={{ width: 24, height: 24 }}
            />
            <div style={{ marginTop: 4 }}>My lists</div>
          </div>
        )}
        <div
          className={css(ss.topNavItem)}
          onClick={() => navigate("/messaging/inbox")}
        >
          <img
            src={MessagingIcon}
            alt="messaging"
            style={{ width: 24, height: 24 }}
          />
          <div style={{ marginTop: 4 }}>Messaging</div>
        </div>
        <div style={{ position: "relative" }}>
          <InboxCount style={{ top: 2, left: -34 }} />
        </div>
        <NotificationDropdown />
        <ProfileDropdown
          name={`${user.first_name} ${user.last_name}`}
          mwbeId={user.mwbes.length ? user.mwbes[0].id : null}
        />
      </div>
      <div className={css(ss.mobileOnly)}>
        <div
          className={css(ss.topNavItem)}
          onClick={() => navigate("/messaging/inbox")}
          style={{ marginRight: 0 }}
        >
          <img
            src={MessagingIcon}
            alt="messaging"
            style={{ width: 24, height: 24 }}
          />
        </div>
        <NotificationDropdown />
        <ProfileDropdown
          name={`${user.first_name} ${user.last_name}`}
          mwbeId={user.mwbes.length ? user.mwbes[0].id : null}
        />
      </div>
      {isExpanded && (
        <LeftNavMobile>
          {user.user_type === "PRIME" && (
            <LeftNavMobileItem
              onClick={() => {
                navigate(`/search`);
                navigate(0);
              }}
              leftNavChild={
                <div
                  className={css(
                    ss.tab,
                    myProjectsActive && ss.currentTabStyle
                  )}
                >
                  <img
                    src={MyProjectsSvg}
                    alt="my_projects"
                    className={css(ss.icon)}
                  />
                  My Projects
                </div>
              }
            />
          )}
          <LeftNavMobileItem
            leftNavChild={
              <div className={css(ss.tab)}>
                <img
                  src={ImpactReportsSvg}
                  alt="impact_reports"
                  className={css(ss.icon)}
                />
                Impact reports
              </div>
            }
          />
          <LeftNavMobileItem
            aphStyle={ss.subItem}
            onClick={() => {
              navigate("/");
              navigate(0);
            }}
            leftNavChild={<div>View all impact reports</div>}
          />
          {user.user_type === "PRIME" && (
            <LeftNavMobileItem
              aphStyle={ss.subItem}
              onClick={() => {
                navigate("/");
                navigate(0);
              }}
              leftNavChild={<div>View my impact reports</div>}
            />
          )}
          <LeftNavMobileItem
            onClick={() => {
              navigate(`/search`);
              navigate(0);
            }}
            leftNavChild={
              <div
                className={css(
                  ss.tab,
                  findCompaniesActive && ss.currentTabStyle
                )}
              >
                <img
                  src={DirectorySvg}
                  alt="directory"
                  className={css(ss.icon)}
                />
                Directory
              </div>
            }
          />
          {user.user_type === "PRIME" || user.user_type === "INTERNAL" && (
            <LeftNavMobileItem
              onClick={() => navigate(`/my-lists`)}
              leftNavChild={
                <div
                  className={css(
                    ss.tab,
                    ss.listTab,
                    yourListsActive && ss.currentTabStyle
                  )}
                >
                  <img
                    src={MyListsSvg}
                    alt="my-lists"
                    className={css(ss.icon)}
                  />
                  My lists
                </div>
              }
            />
          )}
          <LeftNavMobileItem
            leftNavChild={
              <div
                className={css(ss.tab, opportunityActive && ss.currentTabStyle)}
              >
                <img
                  src={OpportunitiesSvg}
                  alt="opportunities"
                  className={css(ss.icon)}
                />
                Bid opportunities
              </div>
            }
          />
          {user.user_type === "PRIME" && (
            <LeftNavMobileItem
              aphStyle={ss.subItem}
              onClick={() => {
                navigate("/opportunity/search");
                navigate(0);
              }}
              leftNavChild={<div>View all bid opportunities</div>}
            />
          )}
          {user.user_type === "PRIME" && (
            <LeftNavMobileItem
              aphStyle={ss.subItem}
              onClick={() => {
                navigate("/opportunity/dashboard");
                navigate(0);
              }}
              leftNavChild={<div>My bid opportunities</div>}
            />
          )}
          <LeftNavMobileItem
            aphStyle={ss.subItem}
            onClick={createOpportunity}
            leftNavChild={<div>Add new bid opportunity</div>}
          />
          <LeftNavMobileItem
            onClick={() => {
              navigate("/knowledge-base");
              navigate(0);
            }}
            leftNavChild={
              <div className={css(ss.tab)}>
                <img
                  src={KnowledgeBaseSvg}
                  alt="knowledge_base"
                  className={css(ss.icon)}
                />
                Knowledge base
              </div>
            }
          />
        </LeftNavMobile>
      )}
    </>
  );
};

const Navbar = ({ loggedIn = true }) => {
  const { user } = useContext(UserData);
  const navigate = useNavigate();
  const location = useLocation();
  const [isExpanded, toggleIsExpanded] = useState(false);

  if (!user && location.pathname.indexOf("/profile") !== -1) {
    return null;
  }

  const transparencyDashboardUrl = "/baltimore-peninsula";

  return (
    <div>
      <nav className={css(ss.topNavContainer, ss.navbarContainer)}>
        <div
          className={css(ss.hamburgerIcon)}
          onClick={() => toggleIsExpanded(!isExpanded)}
        >
          <Icon name={isExpanded ? "close" : "hamburger"} />
        </div>
        <div
          className={css(ss.navLogo, ss.cursorPointer)}
          onClick={() => navigate("/")}
        >
          <img
            alt="sweeten_enterprise"
            src={SweetenEnterpriseLogo}
            width={193}
          />
        </div>
        {loggedIn && user && (
          <HiringCompanyNavbar
            user={user}
            transparencyDashboardUrl={transparencyDashboardUrl}
            isExpanded={isExpanded}
          />
        )}
      </nav>
      <div className={css(ss.topNavSpacing)} />
    </div>
  );
};

export default Navbar;
