import { StyleSheet, css } from "aphrodite/no-important";
import { Card, styles } from "@sweeten/oreo";
import { Table, Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  addCommas,
  envBaltPeninsulaId,
  formatToCurrency,
  getWindowWidth,
  numberOrDash,
} from "../../shared";
import Loader from "../../loader";
import CertificationSvg from "../../../images/certified.svg";
import CEDTooltip from "../ced_tooltip";
import MagnifyingGlassSvg from "../../../images/magnifying-glass.svg";
import { mbeRaceMap } from "..";
import { calculateTotalAmt } from ".";
import { api } from "../../../utils/api";
import { CertPill } from "../../ProfileComponents/Certifications";
import { percentOrNA } from "./high_level_overview";

const ss = StyleSheet.create({
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.phoneStandard,
      style: {
        fontSize: 16,
        marginBottom: 0,
      },
    }),
  },
  subContainer: {
    backgroundColor: "#F6F7F8",
    borderRadius: 12,
    textAlign: "center",
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.phoneStandard,
      style: {
        marginBottom: 16,
      },
    }),
  },
  subContainerHeader: {
    marginBottom: 32,
    color: "#76808F",
    fontSize: 16,
    fontWeight: 600,
  },
  statLarge: {
    fontSize: 48,
    letterSpacing: "1.33px",
    fontWeight: "bold",
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.tabletStandard,
      style: {
        fontSize: 32,
      },
    }),
  },
  rowHeader: {
    fontSize: 16,
    color: "#6F767E",
    fontWeight: 600,
    padding: "20px 24px !important",
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.phoneStandard,
      style: {
        fontSize: 12,
        padding: "12px 0px !important",
      },
    }),
  },
  table: {
    tableLayout: "fixed",
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.tabletStandard,
      style: {
        tableLayout: "auto",
      },
    }),
  },
  card: {
    padding: 0,
    borderRadius: 16,
    boxShadow: `0 8px 16px 0 rgba(0,0,0,0.04)`,
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.phoneStandard,
      style: {
        padding: 16,
        borderRadius: 12,
        border: "none",
      },
    }),
  },
  applyForCertification: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "24px 40px",
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.tabletStandard,
      style: {
        flexDirection: "column",
        marginBottom: 8,
      },
    }),
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.phoneStandard,
      style: {
        flexDirection: "column",
        padding: 0,
        marginBottom: 8,
      },
    }),
  },
  iconBodyContainer: {
    display: "flex",
    alignItems: "center",
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.tabletStandard,
      style: {
        flexDirection: "column",
        alignItems: "flex-start",
        marginBottom: 16,
        width: "100%",
      },
    }),
  },
  greenCheckSvg: {
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.tabletStandard,
      style: { marginBottom: 24 },
    }),
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.phoneStandard,
      style: { marginTop: 24, marginBottom: 24 },
    }),
  },
  minorityWomanOwnedBody: {
    marginLeft: 24,
    fontSize: `16 !important`,
    fontWeight: 500,
    color: styles.colors.black,
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.tabletStandard,
      style: {
        fontSize: 14,
        marginLeft: 0,
      },
    }),
  },
  certificationCta: {
    width: 194,
    height: 48,
    borderRadius: 8,
    fontWeight: "bold",
    fontSize: 14,
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.tabletStandard,
      style: {
        width: "100%",
      },
    }),
  },
  viewOpportunitiesCta: {
    width: 194,
    height: 48,
    borderRadius: 8,
    fontWeight: "bold",
    backgroundColor: styles.colors.white,
    color: styles.colors.brandPrimary,
    fontSize: 14,
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.tabletStandard,
      style: {
        width: "100%",
      },
    }),
  },
  innerPadding: {
    padding: "48px 40px 33px",
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.phoneStandard,
      style: {
        padding: 0,
      },
    }),
  },
  baltimoreRow: {
    backgroundColor: "#E1EFFE",
    margin: "-16px 0px",
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.phoneStandard,
      style: {
        margin: "-16px -16px 0px",
        padding: "0px 16px",
      },
    }),
  },
  mobileOnly: {
    display: "none",
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.phoneStandard,
      style: {
        display: "block",
      },
    }),
  },
  horizontalLine: {
    width: "100%",
    borderTop: "1px solid #E6E8EC",
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.phoneStandard,
      style: {
        marginTop: 32,
      },
    }),
  },
  badge: {
    height: 32,
    fontSize: 14,
    borderRadius: 6,
    padding: "4px 20px",
  },
  paddingTop: {
    paddingTop: "16px !important",
  },
});

const DetailedOverview = ({
  companies,
  demographics,
  raceCertifiedNum,
  view,
}) => {
  const colVals = {
    total: 0,
    contractedTotal: 0,
    paidTotal: 0,
    mbe: {
      races: {},
      total: 0,
      contractedTotal: 0,
    },
    wbe: {
      total: 0,
      numCompanies: 0,
      contractedTotal: 0,
    },
    nonMwbe: {
      total: 0,
      numCompanies: 0,
      contractedTotal: 0,
    },
  };

  companies.forEach((company) => {
    colVals.contractedTotal += company.totalContractedAmt;
    colVals.paidTotal += company.totalPaidAmt;
    colVals.mbe.contractedTotal += company.totalContractedMbeAmt;
    colVals.wbe.contractedTotal += company.totalContractedWbeAmt;

    if (company.totalMbe) {
      colVals.mbe.total += company.totalMbe;
      const race = company.race || "N/A";
      if (!colVals.mbe.races[race]) {
        colVals.mbe.races[race] = {
          totalAmt: 0,
          numCompanies: 0,
          contractedTotal: 0,
        };
      }
      colVals.mbe.races[race].totalAmt += company.totalMbe;
      colVals.mbe.races[race].numCompanies += 1;
    }
    if (company.totalWbe) {
      colVals.wbe.total += company.totalWbe;
      colVals.wbe.numCompanies += 1;
    }
    if (!company.totalMbe && !company.totalWbe) {
      colVals.nonMwbe.numCompanies += 1;
    }
  });

  const totalToCheck =
    view === "Contracted amounts" ? colVals.contractedTotal : colVals.paidTotal;
  colVals.nonMwbe.total =
    totalToCheck - (colVals.mbe.total + colVals.wbe.total);
  colVals.nonMwbe.contractedTotal =
    colVals.contractedTotal -
    (colVals.mbe.contractedTotal + colVals.wbe.contractedTotal);

  const numRaces = Object.keys(colVals.mbe.races).length;
  const womenDemo = demographics.find((demo) => demo.demographic === "woman");

  const navigate = useNavigate();
  const isDesktop = getWindowWidth() > styles.breakpoints.phoneStandard;

  return (
    <Card aphStyle={ss.card}>
      <div className={css(ss.innerPadding)}>
        <div className={css(ss.header)}>Detailed overview</div>
        <div
          className={css(ss.mobileOnly)}
          style={{ borderTop: `1px solid #E9ECEF`, margin: "16px 0px" }}
        />
        <Table responsive className={css(ss.table)}>
          <thead>
            <tr>
              <th className="overview-header-cell" colSpan={2} />
              <th
                className="overview-header-cell"
                colSpan={numRaces}
                style={{ textAlign: "center" }}
              >
                <div style={{ display: "inline-block" }}>
                  <CertPill
                    certAgency="City of Baltimore"
                    certificationType="MBE"
                    noTooltip
                  />
                </div>
              </th>
              <th
                className="overview-header-cell"
                style={{ textAlign: "center" }}
              >
                <div style={{ display: "inline-block", marginLeft: -8 }}>
                  <CertPill
                    certAgency="City of Baltimore"
                    certificationType="WBE"
                    noTooltip
                  />
                </div>
              </th>
              <th
                className="overview-header-cell"
                style={{ textAlign: "center" }}
              >
                <div style={{ display: "inline-block" }}>
                  <CertPill certificationType="Non-MWBE" noTooltip />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="overview-body">
            <tr>
              <td colSpan={2} className={css([ss.rowHeader, ss.paddingTop])}>
                Total {view === "Contracted amounts" ? "contracted" : "paid"}
              </td>
              <td
                className="overview-cell total-contracted"
                style={{ fontSize: isDesktop ? 18 : 12 }}
                colSpan={numRaces}
              >
                {formatToCurrency(colVals.mbe.total, {
                  numDecimals: 0,
                  returnDash: true,
                })}
              </td>
              <td
                className="overview-cell total-contracted"
                style={{ fontSize: isDesktop ? 18 : 12 }}
              >
                {formatToCurrency(colVals.wbe.total, {
                  numDecimals: 0,
                  returnDash: true,
                })}
              </td>
              <td
                className="overview-cell total-contracted"
                style={{ fontSize: isDesktop ? 18 : 12 }}
              >
                {formatToCurrency(colVals.nonMwbe.total, {
                  numDecimals: 0,
                  returnDash: true,
                })}
              </td>
            </tr>
            <tr>
              <td
                colSpan={2}
                className={css(ss.rowHeader)}
                style={{ verticalAlign: "middle" }}
              >
                Ownership race
              </td>
              {Object.keys(colVals.mbe.races)
                .sort()
                .map((race) => (
                  <td
                    className="overview-cell"
                    style={{ color: "#4D72D6", fontSize: isDesktop ? 16 : 12 }}
                  >
                    {race === "N/A" ? "N/A" : mbeRaceMap[race].raceName}
                  </td>
                ))}
              {!Object.keys(colVals.mbe.races).length && (
                <td className="overview-cell">N/A</td>
              )}
              <td
                className="overview-cell"
                style={{ color: "#31C48D", fontSize: isDesktop ? 16 : 12 }}
              >
                Women-owned
              </td>
              <td
                className="overview-cell"
                style={{ color: "#1A2B44", fontSize: isDesktop ? 16 : 12 }}
              >
                Non-M/WBE
              </td>
            </tr>
            <tr>
              <td colSpan={2} className={css(ss.rowHeader)}>
                Total {view === "Contracted amounts" ? "contracted" : "paid"}
              </td>
              {Object.entries(colVals.mbe.races)
                .sort(([raceNameA, raceObjA], [raceNameB, raceObjB]) =>
                  raceNameA.localeCompare(raceNameB)
                )
                .map(([raceName, raceObj]) => (
                  <td className="overview-cell">
                    {formatToCurrency(raceObj.totalAmt, {
                      numDecimals: 0,
                      returnDash: true,
                    })}
                  </td>
                ))}
              {!Object.keys(colVals.mbe.races).length && (
                <td className="overview-cell">-</td>
              )}
              <td className="overview-cell">
                {formatToCurrency(colVals.wbe.total, {
                  numDecimals: 0,
                  returnDash: true,
                })}
              </td>
              <td className="overview-cell">
                {formatToCurrency(colVals.nonMwbe.total, {
                  numDecimals: 0,
                  returnDash: true,
                })}
              </td>
            </tr>
            <tr>
              <td colSpan={2} className={css(ss.rowHeader)}>
                <div style={{ display: "flex" }}>
                  % of{" "}
                  {view === "Contracted amounts"
                    ? "the project total"
                    : "contracted"}
                  <CEDTooltip
                    text={
                      view === "Contracted amounts"
                        ? "This shows the percentage of the total contracted amount on the project"
                        : "This shows the percentage of the contracted amount for this group that has been paid"
                    }
                    position="right"
                    style={{
                      fontWeight: 400,
                      width: isDesktop ? 300 : 160,
                      minWidth: 160,
                    }}
                  />
                </div>
              </td>
              {Object.entries(colVals.mbe.races)
                .sort(([raceNameA, raceObjA], [raceNameB, raceObjB]) =>
                  raceNameA.localeCompare(raceNameB)
                )
                .map(([raceName, raceObj]) => (
                  <td className="overview-cell">
                    {percentOrNA(
                      (raceObj.totalAmt * 100) /
                      (view === "Contracted amounts"
                        ? colVals.contractedTotal
                        : colVals.mbe.contractedTotal)
                    )}
                  </td>
                ))}
              {!Object.keys(colVals.mbe.races).length && (
                <td className="overview-cell">N/A</td>
              )}
              <td className="overview-cell">
                {percentOrNA(
                  (colVals.wbe.total * 100) /
                  (view === "Contracted amounts"
                    ? colVals.contractedTotal
                    : colVals.wbe.contractedTotal)
                )}
              </td>
              <td className="overview-cell">
                {percentOrNA(
                  (colVals.nonMwbe.total * 100) /
                  (view === "Contracted amounts"
                    ? colVals.contractedTotal
                    : colVals.nonMwbe.contractedTotal)
                )}
              </td>
            </tr>
            <tr>
              <td colSpan={2} className={css(ss.rowHeader)}>
                Companies contracted
              </td>
              {Object.entries(colVals.mbe.races)
                .sort(([raceNameA, raceObjA], [raceNameB, raceObjB]) =>
                  raceNameA.localeCompare(raceNameB)
                )
                .map(([raceName, raceObj]) => (
                  <td className="overview-cell">
                    {numberOrDash(addCommas(raceObj.numCompanies))}
                  </td>
                ))}
              {!Object.keys(colVals.mbe.races).length && (
                <td className="overview-cell">-</td>
              )}
              <td className="overview-cell">
                {numberOrDash(addCommas(colVals.wbe.numCompanies))}
              </td>
              <td className="overview-cell">N/A</td>
            </tr>
          </tbody>
        </Table>
        <Table responsive className={css(ss.table)}>
          <tbody className="overview-body city-body-data">
            <tr className={css(ss.baltimoreRow)}>
              <td
                style={{
                  textAlign: "center",
                  fontSize: 12,
                  letterSpacing: "1px",
                  color: "#76808F",
                  fontWeight: "bold",
                  paddingTop: 12,
                  paddingBottom: 12,
                }}
                colSpan={numRaces ? numRaces + 4 : 5}
              >
                CITY OF BALTIMORE DATA
              </td>
            </tr>
            <tr className={css(ss.baltimoreRow)}>
              <td colSpan={2} className={css(ss.rowHeader)}>
                <div style={{ display: "flex" }}>
                  Total actively certified
                  <CEDTooltip
                    text="This number represents all businesses actively certified by the City of Baltimore MWBOO"
                    position="right"
                    style={{
                      fontWeight: 400,
                      width: isDesktop ? 300 : 160,
                      minWidth: 160,
                    }}
                  />
                </div>
              </td>
              {Object.keys(raceCertifiedNum).map((race) => {
                const numActivelyCertified = raceCertifiedNum[race] || "-";

                return (
                  race !== "wbe" && (
                    <td className="overview-cell">
                      {numberOrDash(addCommas(numActivelyCertified))}
                    </td>
                  )
                );
              })}
              <td className="overview-cell">
                {numberOrDash(addCommas(raceCertifiedNum.wbe))}
              </td>
              <td className="overview-cell">N/A</td>
            </tr>
            <tr className={css(ss.baltimoreRow)}>
              <td
                colSpan={2}
                className={css(ss.rowHeader)}
                style={{ borderBottomLeftRadius: 16 }}
              >
                <div style={{ display: "flex" }}>
                  City demographic %
                  <CEDTooltip
                    text="Percentages from the U.S. Census Bureau data 2020-21"
                    position="right"
                    style={{
                      fontWeight: 400,
                      width: isDesktop ? 300 : 160,
                      minWidth: 160,
                    }}
                  />
                </div>
              </td>
              {Object.keys(colVals.mbe.races)
                .sort()
                .map((race) => {
                  const raceDemographic = demographics.find(
                    (demo) => demo.demographic === mbeRaceMap[race].demographic
                  );

                  return (
                    <td className="overview-cell">
                      {raceDemographic ? raceDemographic.percentage : 0}%
                    </td>
                  );
                })}
              {!Object.keys(colVals.mbe.races).length && (
                <td className="overview-cell">0%</td>
              )}
              <td className="overview-cell">{womenDemo.percentage}%</td>
              <td
                className="overview-cell"
                style={{ borderBottomRightRadius: 16 }}
              >
                N/A
              </td>
            </tr>
          </tbody>
        </Table>
      </div>
      <div className={css(ss.horizontalLine)} />
      <div className={css(ss.applyForCertification)}>
        <div className={css(ss.iconBodyContainer)}>
          <div className={css(ss.greenCheckSvg)}>
            <img
              src={CertificationSvg}
              alt="certification"
              style={{ minWidth: 40 }}
            />
          </div>
          <div className={css(ss.minorityWomanOwnedBody)}>
            Are you a minority or woman-owned business based in Baltimore? Get
            officially certified.
          </div>
        </div>
        <Button
          className={css(ss.certificationCta)}
          href="https://baltimorecity.diversitycompliance.com"
        >
          Apply for certification
        </Button>
      </div>
      <div className={css(ss.horizontalLine)} />
      <div className={css(ss.applyForCertification)}>
        <div className={css(ss.iconBodyContainer)}>
          <div className={css(ss.greenCheckSvg)}>
            <img
              src={MagnifyingGlassSvg}
              alt="opportunities"
              style={{ minWidth: 40 }}
            />
          </div>
          <div className={css(ss.minorityWomanOwnedBody)}>
            Looking for work? There are lots of available opportunities for this
            project and others like it.
          </div>
        </div>
        <Button
          className={css(ss.viewOpportunitiesCta)}
          onClick={() => navigate("/opportunity/search")}
        >
          View opportunities
        </Button>
      </div>
    </Card>
  );
};

export default (props) => {
  const [companies, setCompanies] = useState(null);
  const [loading, setLoading] = useState(false);
  const [demographics, setDemographics] = useState(null);
  const [raceCertifiedNum, setRaceCertifiedNum] = useState(null);
  const { id } = useParams();

  useEffect(async () => {
    setLoading(true);

    const companiesResData = await api({
      path: `transparency_dashboards/companies`,
    });

    const idToUse = id || envBaltPeninsulaId;

    let url = `transparency_dashboards/${idToUse}/company_scopes`;
    if (props.phase !== "Entire project") {
      if (props.phase === "TIF infrastructure") {
        url += `?tif_infrastructure=true`;
      } else {
        url += `?name=${props.phase}`;
      }
    }

    const companyScopesData = await api({
      path: url,
    });

    companiesResData.forEach((company) => {
      if (companyScopesData[company.id]) {
        const totalContractedAmt = companyScopesData[company.id].reduce(
          (sum, a) =>
            sum + calculateTotalAmt(props.totals, a, "Contracted amounts"),
          0
        );
        const totalPaidAmt = companyScopesData[company.id].reduce(
          (sum, a) => sum + calculateTotalAmt(props.totals, a, "Paid amounts"),
          0
        );
        const totalContractedMbeAmt = companyScopesData[company.id].reduce(
          (sum, a) =>
            sum +
            calculateTotalAmt(props.totals, a, "Contracted amounts", "mbe"),
          0
        );
        const totalContractedWbeAmt = companyScopesData[company.id].reduce(
          (sum, a) =>
            sum +
            calculateTotalAmt(props.totals, a, "Contracted amounts", "wbe"),
          0
        );
        const totalMbe = companyScopesData[company.id].reduce(
          (sum, a) =>
            sum + calculateTotalAmt(props.totals, a, props.view, "mbe"),
          0
        );
        const totalWbe = companyScopesData[company.id].reduce(
          (sum, a) =>
            sum + calculateTotalAmt(props.totals, a, props.view, "wbe"),
          0
        );
        const numContracts = companyScopesData[company.id].length;
        const totalChangeOrdersAmt = companyScopesData[company.id].reduce(
          (sum, a) => sum + a.change_orders_amount,
          0
        );

        company.totalContractedAmt = totalContractedAmt;
        company.totalPaidAmt = totalPaidAmt;
        company.totalContractedMbeAmt = totalContractedMbeAmt;
        company.totalContractedWbeAmt = totalContractedWbeAmt;
        company.totalMbe = totalMbe;
        company.totalWbe = totalWbe;
        company.numContracts = numContracts;
        company.totalChangeOrdersAmt = totalChangeOrdersAmt;
      } else {
        company.totalContractedAmt = 0;
        company.totalPaidAmt = 0;
        company.totalContractedMbeAmt = 0;
        company.totalContractedWbeAmt = 0;
        company.totalMbe = 0;
        company.totalWbe = 0;
        company.numContracts = 0;
        company.totalChangeOrdersAmt = 0;
      }
    });

    if (!demographics || !raceCertifiedNum) {
      const demographicsResData = await api({
        path: `transparency_dashboards/demographics`,
      });

      const mwbeRaceResJson = await api({
        path: `transparency_dashboards/${idToUse}/certified_company_counts`,
      });
      const certifiedObj = mwbeRaceResJson;

      setRaceCertifiedNum(certifiedObj);

      setDemographics(demographicsResData);
    }

    setCompanies(companiesResData);
    setLoading(false);
  }, [props]);

  if (!companies || !demographics || !raceCertifiedNum || loading) {
    return <Loader />;
  }

  return (
    <DetailedOverview
      companies={companies}
      demographics={demographics}
      raceCertifiedNum={raceCertifiedNum}
      {...props}
    />
  );
};
