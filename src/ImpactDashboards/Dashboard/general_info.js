import { useEffect, useState } from "react";
import { StyleSheet, css } from "aphrodite/no-important";
import { Card, Header, Body, styles, Icon, Tooltip } from "@sweeten/oreo";
import {
  formatDateMMDDYYYY,
  formatToCurrency,
  getWindowWidth,
} from "../../shared";
import ProjectTypeSvg from "../../../images/project-type.svg";
import ProjectLocationSvg from "../../../images/project-location.svg";

const ss = StyleSheet.create({
  card: {
    padding: 0,
    boxSizing: "border-box",
    borderRadius: 8,
    boxShadow: `0 8px 16px 0 rgba(0,0,0,0.04)`,
    border: `1px solid #E9ECEF`,
  },
  headerContainer: {
    padding: "24px",
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.phoneStandard,
      style: {
        padding: "16px 16px",
      },
    }),
  },
  greenCircle: {
    boxSizing: "border-box",
    height: 12,
    width: 12,
    border: `2px solid ${styles.colors.white}`,
    borderRadius: 12,
    backgroundColor: "#75BB5E",
  },
  lastUpdatedText: {
    color: "#6F767E",
    fontWeight: 500,
    marginLeft: 7,
    fontSize: 14,
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.phoneStandard,
      style: {
        fontSize: 12,
      },
    }),
  },
  name: {
    marginBottom: 8,
    lineHeight: "41px",
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.phoneStandard,
      style: {
        fontSize: 24,
      },
    }),
  },
  badgeContainer: {
    display: "flex",
    alignItems: "center",
    backgroundColor: styles.colors.orange7,
    borderRadius: 20,
    marginRight: 8,
    padding: "4px 10px",
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.phoneStandard,
      style: {
        height: 18,
        borderRadius: 9,
        marginBottom: 7,
      },
    }),
  },
  badgeText: {
    color: "#FF8C46",
    fontSize: 12,
    fontWeight: 600,
    marginLeft: 5,
    lineHeight: "0px",
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.phoneStandard,
      style: {
        fontSize: 9,
      },
    }),
  },
  headerBadgesTotal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.phoneStandard,
      style: { flexDirection: "column" },
    }),
  },
  totalAmtContainer: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#F0F9FF",
    borderRadius: 12,
    padding: "12px 24px",
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.phoneStandard,
      style: {
        width: "100%",
        marginTop: 11,
        padding: 12,
        borderRadius: 8,
      },
    }),
  },
  totalContractedToDate: {
    marginTop: -2,
    fontWeight: 500,
    color: "#000929",
    display: "flex",
    justifyContent: "center",
    opacity: 0.5,
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.phoneStandard,
      style: {
        fontSize: 12,
        justifyContent: "flex-start",
      },
    }),
  },
});

export const Badge = ({ iconPath, body }) => (
  <div className={css(ss.badgeContainer)}>
    <img src={iconPath} alt="" />
    <Body tag="div" aphStyle={ss.badgeText}>
      {body}
    </Body>
  </div>
);

const InfoTooltip = ({ text, position, style }) => {
  const windowWidth = getWindowWidth();

  return (
    <Tooltip
      content={<div>{text}</div>}
      position={
        position ||
        (windowWidth <= styles.breakpoints.tabletSmall ? "bottom" : "right")
      }
      style={style}
    >
      <Icon
        name="help"
        size={16}
        color={styles.colors.grey40}
        style={{ marginLeft: 4 }}
      />
    </Tooltip>
  );
};

const GeneralInfo = ({ dashboard, dashboardTotals }) => {
  const { name, parent_projects, users } = dashboard;
  let contractedTotal = 0;
  let lastUpdatedAt;

  Object.keys(dashboardTotals.parent_projects).forEach((parentProjectId) => {
    const dashProject = dashboardTotals.parent_projects[parentProjectId];
    contractedTotal += dashProject.total;
    if (!lastUpdatedAt) {
      lastUpdatedAt = dashProject.last_updated_at;
    } else if (dashProject.last_updated_at > lastUpdatedAt) {
      lastUpdatedAt = dashProject.last_updated_at;
    }
  });
  contractedTotal = Math.floor(contractedTotal);

  const windowWidth = getWindowWidth();
  const isDesktop = windowWidth > styles.breakpoints.phoneStandard;

  return (
    <Card aphStyle={ss.card}>
      <div className={css(ss.body)}>
        <div className={css(ss.headerContainer)}>
          <div className={css(ss.headerBadgesTotal)}>
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <div className={css(ss.greenCircle)} />
                <Body tag="div" aphStyle={ss.lastUpdatedText}>
                  Last updated: {formatDateMMDDYYYY(lastUpdatedAt)}
                </Body>
              </div>
              <Header tag="h2" aphStyle={ss.name}>
                {name}
              </Header>
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                <Badge
                  iconPath={ProjectTypeSvg}
                  body={`${parent_projects.length} Project${
                    parent_projects.length > 1 || !parent_projects.length
                      ? "s"
                      : ""
                  }`}
                />
                <Badge
                  iconPath={ProjectLocationSvg}
                  body={`${users.length} member${
                    users.length > 1 || !users.length ? "s" : ""
                  }`}
                />
              </div>
            </div>
            <div className={css(ss.totalAmtContainer)}>
              <div style={{ display: "flex", margin: "8px 0px" }}>
                <Header
                  tag="h4"
                  style={{
                    color: styles.colors.black,
                    fontWeight: "bold",
                    fontSize: isDesktop ? 28 : 16,
                  }}
                >
                  {formatToCurrency(contractedTotal)}
                </Header>
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Body tag="div" aphStyle={ss.totalContractedToDate}>
                  Total diversity amount contracted
                </Body>
                <div style={{ marginTop: 2 }}>
                  <InfoTooltip
                    text="The total diversity amount contracted to certified businesses"
                    position="bottom"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default GeneralInfo;
