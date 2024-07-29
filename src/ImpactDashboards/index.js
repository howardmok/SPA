import { useContext, useEffect, useState } from "react";
import { Col, Row, Button } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { StyleSheet, css } from "aphrodite/no-important";
import { Card, styles, OutsideClickHandler } from "@sweeten/oreo";
import { useNavigate } from "react-router-dom";
import Loader from "../loader";
import { UserData } from "../redirect_handler";
import Footer from "../footer";
import { api } from "../../utils/api";
import { formatToCurrency } from "../shared";
import EllipsisSvg from "../../images/ellipsis.svg";
import StackIcon from "../../images/icons/stack";
import ImpactDashboardModal from "./ImpactDashboardModal/index";
import { AppDispatch } from "../app_provider";
import InviteDashboardModal from "./invite_dashboard_user";

const ss = StyleSheet.create({
  container: {
    minHeight: 500,
    maxWidth: 1160,
    margin: "auto",
    padding: 32,
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.tabletStandard,
      style: {
        marginTop: 16,
      },
    }),
  },
  title: {
    fontWeight: 700,
    fontSize: 30,
    color: "#0D1522",
  },
  card: {
    padding: 32,
    display: "flex",
    marginBottom: 32,
    width: "100%",
    justifyContent: "space-between",
    borderRadius: 8,
    boxShadow: "0 8px 16px 0 rgba(0,0,0,0.04)",
    boxSizing: "border-box",
    backgroundColor: styles.colors.white,
    border: "none",
    minHeight: 270,
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.tabletStandard,
      style: {
        padding: 16,
        marginBottom: 24,
      },
    }),
    ":hover": {
      boxShadow:
        "0px 1px 2px 0px rgba(16, 24, 40, 0.06), 0px 1px 3px 0px rgba(16, 24, 40, 0.10)",
    },
  },
  cardContentContainer: {
    display: "flex",
    width: "100%",
    fontWeight: 500,
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.tabletStandard,
      style: {
        marginRight: 0,
      },
    }),
  },
  details: {
    width: "100%",
  },
  name: {
    fontSize: 24,
    fontWeight: 600,
    cursor: "pointer",
    marginBottom: 12,
    ":hover": {
      color: styles.colors.brandPrimary,
    },
  },
  ellipsis: {
    marginLeft: 4,
    padding: 8,
    cursor: "pointer",
    position: "relative",
    ":hover": {
      backgroundColor: "#F6F7F8",
      borderRadius: 8,
    },
  },
  ellipsisMenu: {
    position: "absolute",
    backgroundColor: "#FFF",
    top: 40,
    right: 1,
    marginTop: 7,
    width: 240,
    padding: "4px 6px",
    border: "1px solid #E8EAEC",
    borderRadius: 8,
    boxShadow:
      "0px 4px 6px -2px rgba(16, 24, 40, 0.03), 0px 12px 16px -4px rgba(16, 24, 40, 0.08)",
  },
  ellipsisItem: {
    padding: "9px 10px",
    fontSize: 14,
    fontWeight: 500,
    ":hover": {
      backgroundColor: "#F6F7F8",
      borderRadius: 6,
    },
  },
});

const deleteDashboard = async ({
  dashboard,
  dispatch,
  setUpdated,
  onClose,
}) => {
  await api({
    path: `impact_dashboards/${dashboard.id}`,
    method: "DELETE",
  });
  dispatch({
    type: "alert:show",
    payload: {
      variant: "success",
      text: `Dashboard removed.`,
    },
  });
  setUpdated(true);
  if (onClose) {
    onClose();
  }
};

const ImpactDashboardCard = ({
  dashboard,
  setDashboardModalItem,
  setDashboardModalState,
  setUpdated,
  dispatch,
}) => {
  const navigate = useNavigate();
  const [showEllipsisMenu, toggleEllipsisMenu] = useState(false);
  const [toggleShowInviteModal, setToggleShowInviteModal] = useState(false);

  const { id, name, parent_projects, description } = dashboard;
  const contractedTotal = dashboard.contract_total;

  return (
    <>
      <Card aphStyle={ss.card}>
        <div className={css(ss.cardContentContainer)}>
          <div
            style={{
              width: "100%",
            }}
          >
            <div className={css(ss.details)}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "4px 10px",
                    color: "#FF8C46",
                    background: "rgba(255, 140, 70, 0.08)",
                    borderRadius: 12,
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  <StackIcon
                    style={{
                      color: "#FF8C46",
                      marginRight: 8,
                      width: 16,
                      height: 16,
                    }}
                  />
                  {parent_projects.length} Project
                  {parent_projects.length > 1 || !parent_projects.length
                    ? "s"
                    : ""}
                </div>
                <div
                  className={css(ss.ellipsis)}
                  onClick={() => toggleEllipsisMenu(true)}
                >
                  <img
                    src={EllipsisSvg}
                    alt="ellipsis"
                    style={{ width: 20, height: 20 }}
                  />
                  {showEllipsisMenu && (
                    <OutsideClickHandler
                      onOutsideClick={() => toggleEllipsisMenu(false)}
                    >
                      <div className={css(ss.ellipsisMenu)}>
                        <div
                          className={css(ss.ellipsisItem)}
                          onClick={() => {
                            setDashboardModalItem(dashboard);
                            setDashboardModalState("edit");
                          }}
                        >
                          Edit
                        </div>
                        <div
                          className={css(ss.ellipsisItem)}
                          onClick={() => setToggleShowInviteModal(true)}
                        >
                          Invite
                        </div>
                        <div
                          className={css(ss.ellipsisItem)}
                          style={{ color: "red" }}
                          onClick={() =>
                            deleteDashboard({
                              dashboard,
                              dispatch,
                              setUpdated,
                            })
                          }
                        >
                          Delete
                        </div>
                      </div>
                    </OutsideClickHandler>
                  )}
                </div>
              </div>
              <div
                className={css(ss.name)}
                onClick={() => navigate(`/impact-dashboards/${id}/home`)}
              >
                {name}
              </div>
              {description && (
                <div
                  style={{
                    fontSize: 16,
                    color: "#475467",
                    fontWeight: 500,
                    marginBottom: 12,
                  }}
                >
                  {description}
                </div>
              )}
              <div
                style={{ background: "#E7F6FE", borderRadius: 8, padding: 12 }}
              >
                <div style={{ fontWeight: 600, fontSize: 20 }}>
                  {formatToCurrency(contractedTotal)}
                </div>
                <div style={{ fontSize: 16, color: "#475467" }}>
                  Total diversity amount contracted
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
      {toggleShowInviteModal && (
        <InviteDashboardModal
          onClose={() => setToggleShowInviteModal(false)}
          onAdd={() => {
            setToggleShowInviteModal(false);
          }}
        />
      )}
    </>
  );
};

const MyImpactDashboards = ({ data, setUpdated }) => {
  const dispatch = useContext(AppDispatch);
  const { user } = useContext(UserData);
  const [dashboardModalState, setDashboardModalState] = useState(null);
  const [dashboardModalItem, setDashboardModalItem] = useState(null);
  const acceptInvite = async (currentImpactDashboardUser) => {
    // await api({
    //   path: `project_participants/${participant.id}`,
    //   method: "PATCH",
    //   body: {
    //     state: "active",
    //   },
    // });
    // setUpdated(true);
  };
  return (
    <>
      <div className={css(ss.container)}>
        <Helmet>
          <title>Impact Dashboards</title>
        </Helmet>
        <div
          style={{
            marginBottom: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div className={css(ss.title)}>Impact dashboards</div>
          {user.can_create_impact_dashboard && (
            <Button onClick={() => setDashboardModalState("new")}>
              +Add Impact Dashboard
            </Button>
          )}
        </div>
        <Row>
          {data.map((dashboard) => {
            const currentImpactDashboardUser = {};
            // if (currentImpactDashboardUser.state === "invited") {
            //   return (
            //     <Col sm={6}>
            //       <Card aphStyle={ss.card}>
            //         <div style={{ display: "flex", marginRight: 32 }}>
            //           You have been invited to join this impact dashboard:{" "}
            //           <b style={{ marginLeft: 8 }}>{dashboard.name}</b>
            //         </div>
            //         <Button
            //           onClick={() => acceptInvite(currentImpactDashboardUser)}
            //         >
            //           Accept
            //         </Button>
            //       </Card>
            //     </Col>
            //   );
            // }
            return (
              <Col sm={6}>
                <ImpactDashboardCard
                  dashboard={dashboard}
                  key={dashboard.id}
                  currentImpactDashboardUser={currentImpactDashboardUser}
                  setDashboardModalItem={setDashboardModalItem}
                  setDashboardModalState={setDashboardModalState}
                  setUpdated={setUpdated}
                  dispatch={dispatch}
                />
              </Col>
            );
          })}
        </Row>
      </div>
      {dashboardModalState && (
        <ImpactDashboardModal
          dashboard={dashboardModalItem}
          onClose={() => {
            setDashboardModalState(null);
            setDashboardModalItem(null);
          }}
          setUpdated={setUpdated}
          onDelete={() =>
            deleteDashboard({
              dashboard: dashboardModalItem,
              dispatch,
              setUpdated,
              onClose: () => {
                setDashboardModalState(null);
                setDashboardModalItem(null);
              },
            })
          }
        />
      )}
      <Footer />
    </>
  );
};

export default () => {
  const [data, setData] = useState(null);
  const { user, loading } = useContext(UserData);
  const [updated, setUpdated] = useState(true);

  useEffect(() => {
    async function getImpactDashboards() {
      if (updated) {
        const resData = await api({
          path: `impact_dashboards/?include_contract_totals=true`,
        });

        setData(
          resData.length
            ? resData.sort(
                (a, b) => new Date(b.created_at) - new Date(a.created_at)
              )
            : []
        );
        setUpdated(false);
      }
    }

    getImpactDashboards();
  }, [updated, user.hiring_companies]);

  if (!data || loading) {
    return <Loader />;
  }

  return <MyImpactDashboards data={data} setUpdated={setUpdated} />;
};
