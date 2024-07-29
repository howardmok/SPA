import {
  useEffect,
  useState,
  createContext,
  useMemo,
  useCallback,
  useContext,
} from "react";
import { StyleSheet, css } from "aphrodite/no-important";
import { useParams } from "react-router-dom";
import Loader from "../loader";
import { api } from "../../utils/api";
import RightArrow from "../../images/chevron-right.svg";
import SettingsIcon from "../../images/icons/settings";
import ImpactDashboardModal from "./ImpactDashboardModal/index";
import { UserData } from "../redirect_handler";

const ss = StyleSheet.create({
  breadcrumbItem: {
    fontSize: 12,
    fontWeight: 600,
    color: "#475467",
    display: "flex",
  },
  breadcrumbHover: {
    ":hover": {
      color: "#1A2B44",
    },
  },
});

export const ImpactDashboardDataState = createContext({});

const ImpactDashboardWrapper = ({ children }) => {
  const [data, setData] = useState(null);
  const [updated, setUpdated] = useState(true);
  const [showModal, toggleShowModal] = useState(false);
  const { id } = useParams();

  const fetchImpactDashboard = useCallback(async () => {
    const resData = await api({
      path: "impact_dashboards",
    });

    setData(resData.filter((dashboard) => dashboard.id === id)[0] || []);
  }, [id]);

  useEffect(() => {
    if (updated) {
      fetchImpactDashboard();
      setUpdated(false);
    }
  }, [fetchImpactDashboard, updated]);

  const [breadcrumbs, setBreadcrumbs] = useState([]);

  const val = useMemo(
    () => ({ data, setData, fetchImpactDashboard, setBreadcrumbs }),
    [data, setData, fetchImpactDashboard, setBreadcrumbs]
  );

  return !data ? (
    <Loader />
  ) : (
    <ImpactDashboardDataState.Provider value={val}>
      <div
        style={{ padding: 32, minHeight: 500, maxWidth: 1160, margin: "auto" }}
      >
        <div
          style={{
            marginBottom: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            {breadcrumbs.map((item, idx) => {
              if (idx === breadcrumbs.length - 1) {
                return (
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#4D72D6",
                    }}
                  >
                    {item.label}
                  </div>
                );
              }

              return (
                <div
                  className={css(
                    ss.breadcrumbItem,
                    item.onClick && ss.breadcrumbHover
                  )}
                  style={{ cursor: item.onClick ? "pointer" : null }}
                  onClick={item.onClick ? item.onClick : null}
                >
                  {item.label}
                  <img
                    src={RightArrow}
                    alt="right_arrow"
                    style={{ marginLeft: 8, marginRight: 8 }}
                  />
                </div>
              );
            })}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              color: "#4D72D6",
              cursor: "pointer",
            }}
            onClick={() => toggleShowModal(true)}
          >
            <SettingsIcon style={{ color: "#4D72D6", marginRight: 8 }} />
            Dashboard settings
          </div>
        </div>
        {children}
      </div>
      {showModal && (
        <ImpactDashboardModal
          onClose={() => toggleShowModal(false)}
          dashboard={data}
          setUpdated={setUpdated}
        />
      )}
    </ImpactDashboardDataState.Provider>
  );
};

export default ImpactDashboardWrapper;
