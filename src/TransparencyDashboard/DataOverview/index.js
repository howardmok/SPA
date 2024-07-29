import { Card, styles } from "@sweeten/oreo";
import { css, StyleSheet } from "aphrodite";
import { useEffect, useState } from "react";
import { Dropdown, DropdownButton } from "react-bootstrap";
import CEDTooltip from "../ced_tooltip";
import { getWindowWidth } from "../../shared";
import DetailedOverview from "./detailed_overview";
import HighLevelOverview from "./high_level_overview";

const ss = StyleSheet.create({
  dropdown: {
    ":nth-child(1n) > div": {
      minWidth: "100%",
    },
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.tabletStandard,
      style: {
        marginBottom: 8,
      },
    }),
  },
  filters: {
    display: "flex",
    alignItems: "center",
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.tabletStandard,
      style: {
        display: "block",
      },
    }),
  },
  filter: {
    width: "33%",
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.tabletStandard,
      style: {
        width: "100%",
        marginBottom: 16,
      },
    }),
  },
  filterName: {
    color: "#76808F",
    fontSize: 14,
    marginBottom: 8,
    display: "flex",
    whiteSpace: "pre-line",
    width: 300,
  },
  marginRight: {
    marginRight: 16,
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.tabletStandard,
      style: {
        marginRight: 0,
      },
    }),
  },
  header: {
    fontSize: 12,
    color: styles.colors.grey40,
    letterSpacing: 1,
    marginBottom: 16,
    fontWeight: "bold",
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.tabletStandard,
      style: {
        marginBottom: 10,
      },
    }),
  },
  card: {
    boxShadow: `0 8px 16px 0 rgba(0,0,0,0.04)`,
    borderRadius: 16,
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.tabletStandard,
      style: {
        borderRadius: 12,
      },
    }),
  },
});

export const calculateTotalAmt = (totals, scope, view, option) => {
  let amt;
  if (view === "Contracted amounts") {
    if (option === "mbe") {
      amt = scope.mbe_budget;
    } else if (option === "wbe") {
      amt = scope.wbe_budget;
    } else {
      amt = scope.revised_budget;
      if (totals === "Including waiver amounts") {
        amt += scope.excluded_amount;
      }
    }
  } else if (
    (scope.mbe_budget && option === "mbe") ||
    (scope.wbe_budget && option === "wbe") ||
    !option
  ) {
    amt = scope.amount_paid_to_date;
    if (
      !option &&
      totals === "Including waiver amounts" &&
      scope.exclusions_paid_to_date
    ) {
      amt += scope.exclusions_paid_to_date;
    }
  } else if (option) {
    amt = 0;
  }
  return amt;
};

const DataOverview = ({ scopeData, phase, setPhase }) => {
  const [view, setView] = useState("Contracted amounts");
  const [totals, setTotals] = useState("Excluding waiver amounts");

  const phases = ["TIF infrastructure", "Private", "Entire project"];

  const windowWidth = getWindowWidth();
  const isDesktop = windowWidth > styles.breakpoints.phoneStandard;

  return (
    <div style={{ marginTop: 32 }}>
      <Card aphStyle={ss.card}>
        <div className={css(ss.header)}>PAGE FILTERS</div>
        <div className={css(ss.filters)}>
          <div className={css(ss.filter)}>
            <div className={css(ss.filterName)}>
              View
              <CEDTooltip
                text="This filter adjusts the data to show either the amounts contracted or the amounts paid on the project"
                position="right"
                style={{ width: 200 }}
              />
            </div>
            <DropdownButton
              title={<b>{view}</b>}
              className={css(ss.dropdown, ss.marginRight)}
            >
              {["Contracted amounts", "Paid amounts"].map((sortOption) => (
                <Dropdown.Item onClick={() => setView(sortOption)}>
                  {sortOption}
                </Dropdown.Item>
              ))}
            </DropdownButton>
          </div>
          <div className={css(ss.filter)}>
            <div className={css(ss.filterName)}>
              Totals
              <CEDTooltip
                text={
                  <div>
                    Waivers, also commonly referred to as exemptions or
                    reductions, are granted in special situations when no
                    suitable MBE or WBE companies are available for a contract.
                    <b>‘Including waiver amounts’</b> will show the total
                    amounts for the project. M/WBE participation goals are
                    measured by excluding waiver amounts.
                  </div>
                }
                position="right"
                style={{ width: isDesktop ? 300 : 200 }}
              />
            </div>
            <DropdownButton
              title={<b>{totals}</b>}
              className={css(ss.dropdown, ss.marginRight)}
            >
              {["Excluding waiver amounts", "Including waiver amounts"].map(
                (sortOption) => (
                  <Dropdown.Item onClick={() => setTotals(sortOption)}>
                    {sortOption}
                  </Dropdown.Item>
                )
              )}
            </DropdownButton>
          </div>
          <div className={css(ss.filter)}>
            <div className={css(ss.filterName)}>
              Project phase
              <CEDTooltip
                text={
                  <ul style={{ paddingLeft: 16, marginBottom: 0 }}>
                    <li>
                      <b>Entire project:</b> This represents all phases of the
                      project (TIF + Private)
                    </li>
                    <li>
                      <b>TIF Infrastructure:</b> Tax increment financing (TIF)
                      infrastructure phase
                    </li>
                    <li>
                      <b>Private:</b> This represents all project phases that
                      were not part of the TIF infrastructure
                    </li>
                  </ul>
                }
                position={isDesktop ? "right" : "bottom"}
                style={{ width: 240 }}
              />
            </div>
            <DropdownButton title={<b>{phase}</b>} className={css(ss.dropdown)}>
              {phases.map((phaseOption) => (
                <Dropdown.Item onClick={() => setPhase(phaseOption)}>
                  {phaseOption}
                </Dropdown.Item>
              ))}
            </DropdownButton>
          </div>
        </div>
      </Card>
      <div style={{ margin: isDesktop ? "32px 0px" : "24px 0px" }}>
        <HighLevelOverview view={view} totals={totals} data={scopeData} />
      </div>
      <DetailedOverview view={view} totals={totals} phase={phase} />
    </div>
  );
};

export default (props) => {
  const { projects } = props;
  const [scopeData, setScopeData] = useState(projects);
  const [phase, setPhase] = useState("Entire project");

  useEffect(() => {
    let filteredScopes = projects;
    if (phase && phase !== "Entire project") {
      if (phase === "TIF infrastructure") {
        filteredScopes = filteredScopes.filter(
          (scope) => scope.tif_infrastructure
        );
      } else {
        filteredScopes = filteredScopes.filter(
          (scope) => !scope.tif_infrastructure
        );
      }
    }

    setScopeData(filteredScopes);
  }, [phase]);

  if (!scopeData) {
    return null;
  }
  return (
    <DataOverview
      phase={phase}
      setPhase={setPhase}
      scopeData={scopeData}
      {...props}
    />
  );
};
