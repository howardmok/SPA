import { StyleSheet, css } from "aphrodite/no-important";
import { Card, styles, Icon } from "@sweeten/oreo";
import { Col, ProgressBar, Row } from "react-bootstrap";
import { formatToCurrency, getWindowWidth } from "../../shared";
import CEDTooltip from "../ced_tooltip";
import { calculateTotalAmt } from ".";
import { CertPill } from "../../ProfileComponents/Certifications";

const ss = StyleSheet.create({
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 32,
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.tabletStandard,
      style: {
        fontSize: 16,
        marginBottom: 0,
      },
    }),
  },
  subContainer: {
    borderRadius: 12,
    textAlign: "center",
    padding: 32,
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.tabletStandard,
      style: {
        marginBottom: 16,
        padding: 16,
      },
    }),
  },
  subContainerHeader: {
    marginBottom: 24,
    color: "#76808F",
    fontSize: 16,
    fontWeight: 600,
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.tabletStandard,
      style: {
        fontSize: 16,
        marginBottom: 0,
      },
    }),
  },
  statLarge: {
    fontSize: 48,
    letterSpacing: "1.33px",
    fontWeight: "bold",
    lineHeight: "43px",
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.tabletStandard,
      style: {
        fontSize: 32,
        letterSpacing: 0,
      },
    }),
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.tabletStandard,
      style: {
        fontSize: 16,
      },
    }),
  },
  participation: {
    color: "#76808F",
    fontSize: 14,
    fontWeight: 500,
    marginBottom: 8,
  },
  indivPerc: {
    fontSize: 32,
    fontWeight: "bold",
  },
  indivAmt: {
    fontSize: 18,
    fontWeight: "bold",
    display: "flex",
  },
  certAndAmt: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 20,
    flexWrap: "wrap",
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.tabletStandard,
      style: {
        display: "inline-block",
      },
    }),
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.phoneStandard,
      style: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
      },
    }),
  },
  card: {
    padding: 0,
    borderRadius: 16,
    boxShadow: `0 8px 16px 0 rgba(0,0,0,0.04)`,
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.tabletStandard,
      style: {
        borderRadius: 12,
      },
    }),
  },
  body: {
    padding: 36,
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.tabletStandard,
      style: {
        padding: 16,
      },
    }),
  },
  participationGoal: {
    color: "#76808F",
    fontSize: 12,
    fontWeight: 500,
    marginTop: 8,
  },
  goalBar: {
    position: "absolute",
    border: "1px solid #76808F",
    height: 16,
    top: -12,
    width: 1,
  },
  maxParticipationBar: {
    height: "1px !important",
    backgroundColor: "#76808F !important",
    opacity: "40%",
    ":nth-child(1n) + div": {
      height: "1px !important",
      backgroundColor: "#76808F !important",
      opacity: "40%",
    },
  },
  mobileOnly: {
    display: "none",
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.tabletStandard,
      style: {
        display: "block",
      },
    }),
  },
  badge: {
    height: 32,
    fontSize: 14,
    borderRadius: 6,
    padding: "4px 20px",
  },
  horizontalLine: {
    width: "100%",
    borderTop: "1px solid #E6E8EC",
  },
  footnote: {
    display: "flex",
    alignItems: "center",
    padding: "24px 40px",
    color: "#76808F",
    fontSize: 12,
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.phoneStandard,
      style: {
        padding: 16,
      },
    }),
  },
  badgeAndTooltip: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  greenProgressBar: {
    ":nth-child(1n) div": {
      backgroundColor: "#31C48D !important",
    },
  },
});

export const percentOrNA = (percent) =>
  !isNaN(percent) ? `${percent.toFixed(1)}%` : "N/A";

const HighLevelOverview = ({ view, totals, data }) => {
  let totalContractedMbeAmt = 0;
  let totalPaidMbeAmt = 0;
  let totalContractedWbeAmt = 0;
  let totalPaidWbeAmt = 0;
  let totalContractedAmt = 0;
  let totalPaidAmt = 0;

  const windowWidth = getWindowWidth();
  const isDesktop = windowWidth > styles.breakpoints.phoneStandard;

  data.forEach((scope) => {
    totalContractedMbeAmt += calculateTotalAmt(
      totals,
      scope,
      "Contracted amounts",
      "mbe"
    );
    totalPaidMbeAmt += calculateTotalAmt(totals, scope, "Paid amounts", "mbe");
    totalContractedWbeAmt += calculateTotalAmt(
      totals,
      scope,
      "Contracted amounts",
      "wbe"
    );
    totalPaidWbeAmt += calculateTotalAmt(totals, scope, "Paid amounts", "wbe");
    totalContractedAmt += calculateTotalAmt(
      totals,
      scope,
      "Contracted amounts"
    );
    totalPaidAmt += calculateTotalAmt(totals, scope, "Paid amounts");
  });

  const totalMbe =
    view === "Contracted amounts" ? totalContractedMbeAmt : totalPaidMbeAmt;
  const totalWbe =
    view === "Contracted amounts" ? totalContractedWbeAmt : totalPaidWbeAmt;

  return (
    <Card aphStyle={ss.card}>
      <div className={css(ss.body)}>
        <div className={css(ss.header)}>High level overview</div>
        <div
          className={css(ss.mobileOnly)}
          style={{ borderTop: `1px solid #E9ECEF`, margin: "16px 0px" }}
        />
        <div
          className={css(ss.subContainer)}
          style={{ backgroundColor: "#F6F7F8" }}
        >
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div className={css(ss.subContainerHeader)}>
              Total {view === "Contracted amounts" ? "contracted" : "paid"} to
              date
            </div>
            <CEDTooltip
              text={
                view === "Contracted amounts"
                  ? "The total amount contracted on the project based on the filters set above. These figures only include hard and soft costs. Data covers all companies, not just M/WBEs"
                  : "The total amount paid to companies on the project based on the filters set above. Projects use standard payment terms of 30-60 days. All payments might not be reflected based upon the last updated date of the dashboard.  Non-M/WBE payment amounts are calculated based on the percentage completion of certain project phases"
              }
              style={{ minWidth: 140, width: isDesktop ? 300 : 140 }}
            />
          </div>
          <div className={css(ss.statLarge)}>
            {formatToCurrency(
              view === "Contracted amounts" ? totalContractedAmt : totalPaidAmt,
              { numDecimals: 0 }
            )}
          </div>
        </div>
        <Row
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 32,
          }}
        >
          <Col sm={4}>
            <div
              className={css(ss.subContainer)}
              style={{ padding: 24, backgroundColor: "#F0F9FF" }}
            >
              <div className={css(ss.certAndAmt)}>
                <div className={css(ss.badgeAndTooltip)}>
                  <CertPill
                    certAgency="City of Baltimore"
                    certificationType="MBE"
                    noTooltip
                  />
                  <CEDTooltip
                    text="Minority-owned Business Enterprise, as certified by the City of Baltimore MWBOO"
                    position="right"
                  />
                </div>
                <div className={css(ss.indivAmt)}>
                  {formatToCurrency(totalMbe, { numDecimals: 0 })}
                </div>
              </div>
              <div className={css(ss.participation)}>
                {view === "Contracted amounts"
                  ? "Participation to date"
                  : "Current paid to date"}
              </div>
              <div className={css(ss.indivPerc)}>
                {percentOrNA(
                  (totalMbe * 100) /
                    (view === "Contracted amounts"
                      ? totalContractedAmt
                      : totalContractedMbeAmt)
                )}
              </div>
              <div style={{ position: "relative" }}>
                <ProgressBar
                  now={(
                    (totalMbe * 100) /
                    (view === "Contracted amounts"
                      ? totalContractedAmt
                      : totalContractedMbeAmt)
                  ).toFixed(1)}
                />
                {view === "Contracted amounts" && (
                  <div
                    style={{
                      position: "absolute",
                      width: "75%",
                      left: "12.5%",
                    }}
                  >
                    <div style={{ left: "27%" }} className={css(ss.goalBar)} />
                  </div>
                )}
              </div>
              <div className={css(ss.participationGoal)}>
                {view === "Contracted amounts"
                  ? "Participation goal 27%"
                  : `Total contracted: ${formatToCurrency(
                      totalContractedMbeAmt,
                      { numDecimals: 0 }
                    )}`}
              </div>
            </div>
          </Col>
          <Col sm={4}>
            <div
              className={css(ss.subContainer)}
              style={{ padding: 24, backgroundColor: "#F0F9FF" }}
            >
              <div className={css(ss.certAndAmt)}>
                <div className={css(ss.badgeAndTooltip)}>
                  <CertPill
                    certAgency="City of Baltimore"
                    certificationType="WBE"
                    noTooltip
                  />
                  <CEDTooltip
                    text="Women-owned Business Enterprise, as certified by the City of Baltimore MWBOO"
                    position="right"
                  />
                </div>
                <div className={css(ss.indivAmt)}>
                  {formatToCurrency(totalWbe, { numDecimals: 0 })}
                </div>
              </div>
              <div className={css(ss.participation)}>
                {view === "Contracted amounts"
                  ? "Participation to date"
                  : "Current paid to date"}
              </div>
              <div className={css(ss.indivPerc)}>
                {percentOrNA(
                  (totalWbe * 100) /
                    (view === "Contracted amounts"
                      ? totalContractedAmt
                      : totalContractedWbeAmt)
                )}
              </div>
              <div style={{ position: "relative" }}>
                <ProgressBar
                  className={css(ss.greenProgressBar)}
                  now={(
                    (totalWbe * 100) /
                    (view === "Contracted amounts"
                      ? totalContractedAmt
                      : totalContractedWbeAmt)
                  ).toFixed(1)}
                />
                {view === "Contracted amounts" && (
                  <div
                    style={{
                      position: "absolute",
                      width: "75%",
                      left: "12.5%",
                    }}
                  >
                    <div style={{ left: "10%" }} className={css(ss.goalBar)} />
                  </div>
                )}
              </div>
              <div className={css(ss.participationGoal)}>
                {view === "Contracted amounts"
                  ? "Participation goal 10%"
                  : `Total contracted: ${formatToCurrency(
                      totalContractedWbeAmt,
                      { numDecimals: 0 }
                    )}`}
              </div>
            </div>
          </Col>
          <Col sm={4}>
            <div
              className={css(ss.subContainer)}
              style={{ padding: 24, backgroundColor: "#F6F7F8" }}
            >
              <div className={css(ss.certAndAmt)}>
                <div className={css(ss.badgeAndTooltip)}>
                  <CertPill certificationType="Non-MWBE" noTooltip />
                  <CEDTooltip
                    text="Businesses that are neither minority nor women-owned, or they are not certified as such by the City of Baltimore MWBOO"
                    position="right"
                    style={{ minWidth: 180, width: 180 }}
                  />
                </div>
                <div className={css(ss.indivAmt)}>
                  {formatToCurrency(
                    (view === "Contracted amounts"
                      ? totalContractedAmt
                      : totalPaidAmt) -
                      (totalMbe + totalWbe),
                    { numDecimals: 0 }
                  )}
                  {view === "Paid amounts" && (
                    <CEDTooltip
                      text="Non-M/WBE payment amounts are calculated based on the percentage completion of certain project phases"
                      position="right"
                      style={{ minWidth: 180, width: 180, fontWeight: 400 }}
                    />
                  )}
                </div>
              </div>
              <div className={css(ss.participation)}>
                {view === "Contracted amounts"
                  ? "Participation to date"
                  : "Current paid to date"}
              </div>
              <div className={css(ss.indivPerc)}>
                {percentOrNA(
                  view === "Contracted amounts"
                    ? 100 - ((totalMbe + totalWbe) * 100) / totalContractedAmt
                    : ((totalPaidAmt - (totalMbe + totalWbe)) * 100) /
                        (totalContractedAmt -
                          (totalContractedMbeAmt + totalContractedWbeAmt))
                )}
              </div>
              <div>
                <ProgressBar className={css(ss.maxParticipationBar)} />
              </div>
              <div
                className={css(ss.participationGoal)}
                style={{ marginTop: 16 }}
              >
                {view === "Contracted amounts"
                  ? "Maximum participation 63%"
                  : `Total contracted: ${formatToCurrency(
                      totalContractedAmt -
                        (totalContractedMbeAmt + totalContractedWbeAmt),
                      { numDecimals: 0 }
                    )}`}
              </div>
            </div>
          </Col>
        </Row>
      </div>
      <div className={css(ss.horizontalLine)} />
      <div className={css(ss.footnote)}>
        <Icon
          name="info"
          color="#76808F"
          size={12}
          style={{ marginRight: 4 }}
        />
        Community Engagement Dashboard is updated quarterly
      </div>
    </Card>
  );
};

export default HighLevelOverview;
