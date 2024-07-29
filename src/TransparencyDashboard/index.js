import { useState, useEffect } from "react";
import { StyleSheet, css } from "aphrodite/no-important";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import { styles } from "@sweeten/oreo";
import Header from "./header";
import GeneralInfo from "./General_Info";
import DataOverview from "./DataOverview";
import MwbeList from "./MwbeList";
import Footer from "../footer";
import { envBaltPeninsulaId } from "../shared";
import { api } from "../../utils/api";
import Loader from "../loader";

const ss = StyleSheet.create({
  content: {
    position: "absolute",
    top: 320,
    left: 0,
    right: 0,
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.tabletSmall,
      style: {
        top: 178,
      },
    }),
  },
  components: {
    maxWidth: 1220,
    margin: "auto",
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.tabletSmall,
      style: {
        padding: "8px 16px 16px 16px",
      },
    }),
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.phoneStandard,
      style: {
        marginTop: 16,
      },
    }),
  },
});

export const mbeRaceMap = {
  AFRICAN_AMERICAN: {
    raceName: "Black American",
    demographic: "black",
  },
  ASIAN_AMERICAN: {
    raceName: "Asian-Pacific American",
    demographic: "asian",
  },
  HISPANIC_AMERICAN: {
    raceName: "Hispanic American",
    demographic: "hispanic",
  },
  NATIVE_AMERICAN: {
    raceName: "Native American",
    demographic: "native",
  },
};

const TransparencyDashboard = () => {
  const [projectScopes, setProjectScopes] = useState(null);
  const { id } = useParams();
  const parentProjectId = id || envBaltPeninsulaId;

  useEffect(() => {
    const fetchProjectScopes = async () => {
      const scopeResJson = await api({
        path: `transparency_dashboards/projects?parent_project_id=${parentProjectId}`,
      });
      setProjectScopes(scopeResJson);
    };
    fetchProjectScopes();
  }, [id]);

  const helmetTitle =
    parentProjectId === "990bf000-9692-432d-9563-40c919e8f05a"
      ? "Baltimore Peninsula | Tracking MWBE Participation"
      : "JFK Terminal 6";
  const helmetDescription =
    parentProjectId === "990bf000-9692-432d-9563-40c919e8f05a"
      ? "Baltimore Peninsula Community Engagement Dashboard shows details about the minority and women business (MWBE) contracting goals and diversity hiring"
      : "";

  return (
    <div style={{ position: "relative" }}>
      <Helmet>
        <title>{helmetTitle}</title>
        <meta name="description" content={helmetDescription} />
      </Helmet>
      <Header parentProjectId={parentProjectId} />
      <div className={css(ss.content)}>
        <div
          className={css(ss.components)}
          style={{ marginBottom: 162, minHeight: 500 }}
        >
          {projectScopes ? (
            <GeneralInfo projects={projectScopes} />
          ) : (
            <Loader />
          )}
          {projectScopes ? (
            <DataOverview projects={projectScopes} />
          ) : (
            <Loader />
          )}
          <MwbeList />
        </div>
        <Footer useWrapperStyles={false} />
      </div>
    </div>
  );
};

export default TransparencyDashboard;
