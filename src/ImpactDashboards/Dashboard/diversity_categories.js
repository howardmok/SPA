import { StyleSheet, css } from "aphrodite/no-important";
import { Card, styles } from "@sweeten/oreo";
import { useNavigate } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import { Sparklines, SparklinesLine } from "react-sparklines";
import { formatToCurrency } from "../../shared";
import ArrowLink from "../../arrow_link";
import { Sparkle } from "../../emojis";
import { CategoryBadge } from "../shared";

const ss = StyleSheet.create({
  smallCard: {
    borderRadius: 8,
    textAlign: "center",
    padding: "16px 24px",
    boxShadow:
      "0px 1px 3px rgba(16, 24, 40, 0.1), 0px 1px 2px rgba(16, 24, 40, 0.06)",
    marginBottom: 16,
  },
  header: {
    fontSize: 18,
    fontWeight: 600,
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.tabletStandard,
      style: {
        fontSize: 16,
        marginBottom: 0,
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
    fontSize: 30,
    fontWeight: 700,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  certAndAmt: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 16,
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
  participationGoal: {
    color: "#76808F",
    fontSize: 12,
    fontWeight: 500,
    marginTop: 8,
  },
  linkAphStyle: {
    fontSize: 14,
    fontWeight: 600,
    color: "#4D72D6",
  },
});

const DiversityCategories = ({
  data,
  totalsObj,
  selectedDateFrame,
  selectedOption,
}) => {
  const navigate = useNavigate();

  if (!totalsObj) {
    return null;
  }

  const getNextDate = (date) => {
    const yearMonth = date.split("-");

    if (yearMonth[1] === "12") {
      yearMonth[0] = Number(yearMonth[0]) + 1;
      yearMonth[1] = "01";
    } else if (yearMonth[1].startsWith("0")) {
      const newMonth = Number(yearMonth[1][1]) + 1;

      if (newMonth < 10) {
        yearMonth[1] = `0${newMonth}`;
      } else {
        yearMonth[1] = newMonth;
      }
    } else {
      yearMonth[1] = Number(yearMonth[1]) + 1;
    }

    return yearMonth.join("-");
  };

  let endDate = new Date();

  if (
    selectedOption.label !== "All time" &&
    new Date(selectedOption.end_date) < endDate
  ) {
    endDate = new Date(selectedOption.end_date);
  }

  const endDateMonth = (endDate.getMonth() + 1).toString();

  endDate = `${endDate.getFullYear()}-${
    endDateMonth.length < 2 ? `0${endDateMonth}` : endDateMonth
  }`;

  return (
    <>
      <Row>
        {Object.keys(totalsObj.groupings).map((certGroup) => {
          const chartData = [];
          const datesCopy = { ...totalsObj.groupings[certGroup].dates };
          const datesArr = Object.keys(datesCopy).sort();

          datesArr.forEach((date, idx) => {
            chartData.push(datesCopy[date]);

            let nextDate = getNextDate(date);
            if (nextDate > endDate) {
              nextDate = endDate;
            }
            let fillingBlankDates = false;

            let nextIdxDate;

            if (!!datesArr[idx + 1] && datesArr[idx + 1] < endDate) {
              nextIdxDate = datesArr[idx + 1];
            } else {
              nextIdxDate = endDate;
            }

            if (nextIdxDate && nextDate !== nextIdxDate) {
              fillingBlankDates = true;
              while (fillingBlankDates) {
                chartData.push(datesCopy[date]);

                const newNextDate = getNextDate(nextDate);

                if (newNextDate !== nextIdxDate) {
                  nextDate = newNextDate;
                } else {
                  fillingBlankDates = false;
                }
              }
            }
          });

          return (
            <Col sm={4}>
              <Card aphStyle={ss.smallCard}>
                <div className={css(ss.certAndAmt)}>
                  <div style={{ display: "flex" }}>
                    <CategoryBadge category={certGroup} />
                  </div>
                  <div style={{ fontSize: 14 }}>
                    <span style={{ color: "#76808F" }}>Projects:</span>{" "}
                    {totalsObj.groupings[certGroup].parent_project_ids.length}
                  </div>
                </div>
                <div className={css(ss.participation)}>Total contracted</div>
                <div className={css(ss.indivPerc)}>
                  {formatToCurrency(
                    Math.floor(totalsObj.groupings[certGroup].total)
                  )}
                </div>
                {!!chartData.length && (
                  <>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        width: "100%",
                      }}
                    >
                      <div
                        style={{
                          position: "relative",
                          width: 160,
                        }}
                      >
                        <Sparklines data={chartData}>
                          <SparklinesLine color="#17B26A" />
                        </Sparklines>
                      </div>
                    </div>
                    {selectedDateFrame.label !== "All time" &&
                      selectedOption.label !== "All time" && (
                        <div className={css(ss.participationGoal)}>
                          {/* {!previousTotals[certGroup] && (
                            <>
                              <ArrowUpSvg style={{ color: "#17B26A" }} />{" "}
                              {formatToCurrency(
                                totalsObj.groupings[certGroup].total
                              )}{" "}
                            </>
                          )} */}
                          {/* {previousTotals[certGroup] && (
                            <>
                              {totalsObj.groupings[certGroup].total >=
                              previousTotals[certGroup].totalContracted ? (
                                <>
                                  <ArrowUpSvg style={{ color: "#17B26A" }} />{" "}
                                  {formatToCurrency(
                                    totalsObj.groupings[certGroup].total -
                                      previousTotals[certGroup].totalContracted
                                  )}{" "}
                                </>
                              ) : (
                                <>
                                  <ArrowDownSvg style={{ color: "red" }} />{" "}
                                  {formatToCurrency(
                                    previousTotals[certGroup].totalContracted -
                                      totalsObj.groupings[certGroup].total
                                  )}{" "}
                                </>
                              )}{" "}
                              last{" "}
                              {selectedDateFrame.label === "Year"
                                ? "year"
                                : selectedDateFrame.label.toLowerCase()}
                            </>
                          )} */}
                        </div>
                      )}
                  </>
                )}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: 16,
                  }}
                >
                  <div style={{ fontSize: 14 }}>
                    <span style={{ color: "#76808F" }}>Companies:</span>{" "}
                    {totalsObj.groupings[certGroup].project_count}
                  </div>
                  <ArrowLink
                    onClick={() => {
                      navigate(
                        `/impact-dashboards/${data.id}/diversity-company/${certGroup}`
                      );
                    }}
                    linkAphStyle={ss.linkAphStyle}
                    arrowColor="#4D72D6"
                  >
                    View details
                  </ArrowLink>
                </div>
              </Card>
            </Col>
          );
        })}
      </Row>
      <Row>
        <Col sm={12}>
          <div
            style={{
              borderRadius: 8,
              padding: 16,
              border: "1px solid #E8EAEC",
              color: "#4D72D6",
              background: "white",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                fontWeight: 600,
                marginBottom: 16,
              }}
            >
              <Sparkle /> What's this
            </div>
            <div>
              Where necessary we've grouped together similar certification types
              into the broader categories listed above. The diversity contracted
              totals on this dashboard are calculated from the projects listed
              below.
            </div>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default DiversityCategories;
