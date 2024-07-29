import { useState } from "react";
import { StyleSheet, css } from "aphrodite";
import { Card, styles } from "@sweeten/oreo";
import { useNavigate } from "react-router-dom";
import {
  Button,
  ButtonGroup,
  Dropdown,
  DropdownButton,
  Table,
} from "react-bootstrap";
import { formatDateMMDDYYYY, formatToCurrency } from "../../shared";
import { Badge } from "./general_info";
import ProjectTypeSvg from "../../../images/project-type.svg";
import ProjectLocationSvg from "../../../images/project-location.svg";
import ArrowLink from "../../arrow_link";
import { CategoryBadge } from "../shared";
import AlertIcon from "../../../images/icons/alert-circle";
import CheckIcon from "../../../images/icons/check-circle";

const ss = StyleSheet.create({
  card: {
    marginBottom: 24,
    padding: 0,
    boxSizing: "border-box",
    borderRadius: 8,
    boxShadow: `0 8px 16px 0 rgba(0,0,0,0.04)`,
    border: `1px solid #E9ECEF`,
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
    fontSize: 32,
    fontWeight: "bold",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
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
  participationGoal: {
    color: "#76808F",
    fontSize: 12,
    fontWeight: 500,
    marginTop: 8,
  },
  headerContainer: {
    padding: "16px 24px",
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.phoneStandard,
      style: {
        padding: "16px",
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
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    lineHeight: "41px",
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
    alignItems: "flex-start",
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
        marginBottom: 4,
      },
    }),
  },
  textAlignCenter: {
    textAlign: "center",
  },
  colCell: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: 600,
    padding: 16,
  },
  tableHeader: {
    textAlign: "center",
    borderBottom: "none",
    padding: 16,
    fontSize: 14,
    fontWeight: 600,
    color: "#667085",
  },
  linkAphStyle: {
    fontSize: 14,
    fontWeight: 600,
    color: "#4D72D6",
  },
});

const ParentProjectCard = ({ project, isExpanded, totalsObj }) => {
  const {
    name,
    city,
    state,
    start_date,
    end_date,
    project_type,
    project_participants,
    project_participation_goals,
  } = project;

  const navigate = useNavigate();
  const projectData = totalsObj.parent_projects[project.id];

  if (!projectData) {
    return null;
  }
  const totalContracted = projectData.total_plus_non_certified;
  const totalContractedForRelevantCerts = Math.floor(projectData.total);
  const projectGroupings = Object.keys(projectData.groupings);

  const allProjectRows = [];

  const developers = project_participants.filter(
    (participant) => participant.type === "team_member"
  );

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
                <div className={css(ss.lastUpdatedText)}>
                  Last updated:{" "}
                  {formatDateMMDDYYYY(projectData.last_updated_at)}
                </div>
              </div>
              <div className={css(ss.name)}>{name}</div>
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                {project_type && (
                  <Badge iconPath={ProjectTypeSvg} body={project_type} />
                )}
                {(city || state) && (
                  <Badge
                    iconPath={ProjectLocationSvg}
                    body={`${city ? `${city}, ` : ""}${state}`}
                  />
                )}
                <Badge
                  iconPath={ProjectLocationSvg}
                  body={`${formatDateMMDDYYYY(
                    start_date
                  )} - ${formatDateMMDDYYYY(end_date)}`}
                />
              </div>
              {developers && (
                <div style={{ marginTop: 8, color: "#76808F" }}>
                  Developers:{" "}
                  {[
                    ...new Set(
                      developers.map(
                        (hiringCompany) =>
                          hiringCompany.hiring_company.business_name
                      )
                    ),
                  ].join(", ")}
                </div>
              )}
            </div>
            <div className={css(ss.totalAmtContainer)}>
              {!!projectGroupings.length && (
                <div style={{ display: "flex", marginBottom: 8 }}>
                  {projectGroupings.map((grouping, idx) => (
                    <div
                      style={{
                        marginRight:
                          idx !== projectGroupings.length - 1 ? 8 : 0,
                      }}
                    >
                      <CategoryBadge category={grouping} />
                    </div>
                  ))}
                </div>
              )}
              <div style={{ display: "flex", margin: "0px 0px 8px" }}>
                <div
                  style={{
                    color: styles.colors.black,
                    fontWeight: "bold",
                    fontSize: 32,
                  }}
                >
                  {formatToCurrency(totalContractedForRelevantCerts)}
                </div>
              </div>
              <div style={{ display: "flex" }}>
                <div aphStyle={ss.totalContractedToDate}>
                  Total diversity amount contracted
                </div>
              </div>
            </div>
          </div>
          {isExpanded && (
            <div
              className="table-responsive"
              style={{
                marginTop: 16,
                marginBottom: 16,
              }}
            >
              <Table style={{ tableLayout: "fixed" }}>
                <thead>
                  <tr
                    style={{
                      verticalAlign: "middle",
                    }}
                  >
                    <th
                      className={`header first-col ${css(ss.tableHeader)}`}
                      aria-label="blank"
                      style={{ borderLeft: "none" }}
                    />
                    <th className={`header ${css(ss.tableHeader)}`}>
                      Company counts
                    </th>
                    <th className={`header ${css(ss.tableHeader)}`}>
                      Total contracted to date
                    </th>
                    <th className={`header ${css(ss.tableHeader)}`}>
                      Participation
                    </th>
                    <th
                      className={`header ${css(ss.tableHeader)}`}
                      style={{ borderRight: "none" }}
                    >
                      Goal status
                    </th>
                  </tr>
                </thead>
                <tbody
                  className="body"
                  style={{ borderTop: "1px solid #E8EAEC" }}
                >
                  {projectGroupings.map((grouping, idx) => {
                    const matchedGoal = project_participation_goals.find(
                      (goal) =>
                        !!goal.certifications.find(
                          (cert) => cert.category === grouping
                        )
                    );
                    const groupingData = projectData.groupings[grouping];

                    return (
                      <tr
                        style={{
                          borderBottom:
                            idx === allProjectRows.length - 1 ? "white" : "",
                        }}
                      >
                        <td
                          className={`cell first-col ${css(ss.colCell)}`}
                          style={{ borderLeft: "none" }}
                        >
                          <CategoryBadge category={grouping} />
                        </td>
                        <td className={`cell ${css(ss.colCell)}`}>
                          <b>{groupingData.project_count}</b>
                        </td>
                        <td className={`cell ${css(ss.colCell)}`}>
                          <b>{formatToCurrency(groupingData.total)}</b>
                        </td>
                        <td className={`cell ${css(ss.colCell)}`}>
                          <b>
                            {totalContracted
                              ? `${Math.round(
                                  (groupingData.total * 100) / totalContracted
                                )}%`
                              : "-"}
                          </b>{" "}
                          <span
                            style={{
                              fontSize: 12,
                              color: "#667085",
                              fontWeight: 400,
                            }}
                          >
                            (
                            {matchedGoal && matchedGoal.participation_percentage
                              ? `Goal ${matchedGoal.participation_percentage}%`
                              : "Best effort"}
                            )
                          </span>
                        </td>
                        <td
                          className={`cell ${css(ss.colCell)}`}
                          style={{ borderRight: "none" }}
                        >
                          {matchedGoal ? (
                            <div>
                              {!totalContracted ? (
                                <AlertIcon
                                  style={{
                                    color: "#F05252",
                                    width: 24,
                                    height: 24,
                                  }}
                                />
                              ) : (
                                <div>
                                  {Math.round(
                                    (groupingData.total * 100) / totalContracted
                                  ) >= matchedGoal.participation_percentage ||
                                  !matchedGoal.participation_percentage ? (
                                    <CheckIcon
                                      style={{
                                        color: "#039855",
                                        width: 24,
                                        height: 24,
                                      }}
                                    />
                                  ) : (
                                    <AlertIcon
                                      style={{
                                        color: "#F05252",
                                        width: 24,
                                        height: 24,
                                      }}
                                    />
                                  )}
                                </div>
                              )}
                            </div>
                          ) : (
                            <div>-</div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          )}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: 16,
            }}
          >
            <ArrowLink
              onClick={() => {
                navigate(`/parent-project/${project.id}/home`);
              }}
              linkAphStyle={ss.linkAphStyle}
              arrowColor="#4D72D6"
            >
              View details
            </ArrowLink>
          </div>
        </div>
      </div>
    </Card>
  );
};

const sortOptions = ["Latest first", "Oldest first"];

const Projects = ({ data: impactDashboard, totalsObj, snapshotDate }) => {
  const [filterType, setFilterType] = useState("compact");
  const [sortType, setSortType] = useState("Latest first");

  const projects = impactDashboard.parent_projects;

  return (
    <>
      <div
        style={{
          fontWeight: 600,
          fontSize: 18,
          marginBottom: 32,
        }}
      >
        Projects ({projects.length})
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <DropdownButton title={sortType} style={{ width: 260 }}>
          {sortOptions.map((sortOption) => (
            <Dropdown.Item
              onClick={() => setSortType(sortOption)}
              key={sortOption}
            >
              {sortOption}
            </Dropdown.Item>
          ))}
        </DropdownButton>
        <ButtonGroup
          style={{
            width: 400,
            border: "1px solid #EAECF0",
            borderRadius: 10,
            overflow: "hidden",
            padding: 4,
            backgroundColor: "#F9FAFB",
          }}
        >
          <Button
            variant={`${filterType === "compact" ? "light" : "light-selected"}`}
            active={filterType === "compact"}
            onClick={() => setFilterType("compact")}
            style={{
              padding: 0,
              width: 200,
              borderRadius: 6,
              boxShadow:
                filterType === "compact"
                  ? "0 1px 2px 0 rgba(0,0,0,0.04)"
                  : null,
            }}
            data-test="impact-dashboard-compact-toggle"
          >
            Compact view
          </Button>
          <Button
            variant={`${
              filterType === "expanded" ? "light" : "light-selected"
            }`}
            active={filterType === "expanded"}
            onClick={() => setFilterType("expanded")}
            style={{
              padding: 0,
              width: 200,
              borderRadius: 6,
              boxShadow:
                filterType === "expanded"
                  ? "0 1px 2px 0 rgba(0,0,0,0.04)"
                  : null,
            }}
            data-test="impact-dashboard-expanded-toggle"
          >
            Expanded view
          </Button>
        </ButtonGroup>
      </div>
      {projects
        .sort((a, b) => {
          if (sortType === "Latest first") {
            return new Date(a.last_updated_at) - new Date(b.last_updated_at);
          }
          return new Date(b.last_updated_at) - new Date(a.last_updated_at);
        })
        .map((project) => (
          <ParentProjectCard
            project={project}
            isExpanded={filterType === "expanded"}
            totalsObj={totalsObj}
            snapshotDate={snapshotDate}
            dashboard={impactDashboard}
          />
        ))}
    </>
  );
};

export default Projects;
