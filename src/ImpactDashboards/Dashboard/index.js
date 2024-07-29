import { useEffect, useState, useContext } from "react";
import { css, StyleSheet } from "aphrodite";
import { Dropdown, DropdownButton } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { ImpactDashboardDataState } from "../wrapper";
import GeneralInfo from "./general_info";
import DiversityCategories from "./diversity_categories";
import Projects from "./projects";
import Loader from "../../loader";
import { calculateTotals } from "../shared";
import { formatDateYYYYMMDD } from "../../shared";
import { api } from "../../../utils/api";

const ss = StyleSheet.create({
  moduleContainer: {
    marginBottom: 40,
  },
  secondDropdown: {
    position: "absolute",
    left: 260,
    top: 0,
    marginTop: "0px !important",
  },
});

const ImpactDashboard = ({
  data,
  selectedOption,
  setSelectedOption,
  selectedDateFrame,
  setSelectedDateFrame,
  dropdownOptions,
  totalsObj,
  previousTotals,
  dashboardTotals,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div style={{ marginTop: 32 }}>
      <div className={css(ss.moduleContainer)} style={{ position: "relative" }}>
        <DropdownButton
          title={selectedOption.label}
          style={{ width: 260 }}
          onToggle={(isOpen, e) => {
            if (e.source !== "select") {
              setDropdownOpen(isOpen);
            }
          }}
          show={dropdownOpen}
        >
          {dropdownOptions.map((dropdownOption) => (
            <Dropdown.Item
              onClick={() => {
                setSelectedDateFrame(dropdownOption);
                if (dropdownOption.label === "All time") {
                  setSelectedOption({ label: "All time" });
                  setDropdownOpen(false);
                }
              }}
              key={dropdownOption.label}
            >
              {dropdownOption.label}
            </Dropdown.Item>
          ))}
          {selectedDateFrame.options && (
            <div className={`dropdown-menu show ${css(ss.secondDropdown)}`}>
              {selectedDateFrame.options.map((option) => (
                <Dropdown.Item
                  onClick={() => {
                    setSelectedOption(option);
                    setDropdownOpen(false);
                  }}
                  key={option.label}
                >
                  {option.label}
                </Dropdown.Item>
              ))}
            </div>
          )}
        </DropdownButton>
      </div>
      <div className={css(ss.moduleContainer)}>
        <GeneralInfo dashboard={data} dashboardTotals={dashboardTotals} />
      </div>
      <div className={css(ss.moduleContainer)}>
        <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>
          Diversity contracted by category
        </div>
        <DiversityCategories
          data={data}
          totalsObj={dashboardTotals}
          selectedDateFrame={selectedDateFrame}
          selectedOption={selectedOption}
        />
      </div>
      <div className={css(ss.moduleContainer)}>
        <Projects
          data={data}
          totalsObj={dashboardTotals}
          snapshotDate={selectedOption.end_date}
        />
      </div>
    </div>
  );
};

const endDateOrToday = (endDate) => {
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - 1);
  if (new Date(endDate) > currentDate) {
    return formatDateYYYYMMDD(currentDate);
  }
  return endDate;
};

export default () => {
  const { data: impactDashboard, setBreadcrumbs } = useContext(
    ImpactDashboardDataState
  );
  const [selectedOption, setSelectedOption] = useState({ label: "All time" });
  const [selectedDateFrame, setSelectedDateFrame] = useState({
    label: "All time",
  });
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [dashboardTotals, setDashboardTotals] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (impactDashboard) {
      setBreadcrumbs([
        {
          label: "Impact dashboards",
          onClick: () => navigate("/impact-dashboards/all"),
        },
        {
          label: impactDashboard.name,
          onClick: () =>
            navigate(`/impact-dashboards/${impactDashboard.id}/home`),
        },
      ]);
    }
  }, [setBreadcrumbs, impactDashboard, navigate]);

  useEffect(() => {
    if (dashboardTotals) {
      const currentDate = new Date();
      currentDate.setMonth(currentDate.getMonth() + 1);

      let earliestProjectCreatedDate;

      Object.entries(dashboardTotals.groupings).forEach(([_, groupObj]) => {
        Object.keys(groupObj.dates)
          .sort()
          .forEach((date) => {
            if (
              !earliestProjectCreatedDate ||
              new Date(date) < earliestProjectCreatedDate
            ) {
              earliestProjectCreatedDate = new Date(`${date}-02`);
            }
          });
      });

      const getMonths = (year) => [
        {
          label: `January ${year}`,
          start_date: `${year}-01-01`,
          end_date: `${year}-01-31`,
          prev_start_date: `${year - 1}-12-01`,
          prev_end_date: `${year - 1}-12-31`,
        },
        {
          label: `February ${year}`,
          start_date: `${year}-02-01`,
          end_date: `${year}-02-28`,
          prev_start_date: `${year}-01-01`,
          prev_end_date: `${year}-01-31`,
        },
        {
          label: `March ${year}`,
          start_date: `${year}-03-01`,
          end_date: `${year}-03-31`,
          prev_start_date: `${year}-02-01`,
          prev_end_date: `${year}-02-28`,
        },
        {
          label: `April ${year}`,
          start_date: `${year}-04-01`,
          end_date: `${year}-04-30`,
          prev_start_date: `${year}-03-01`,
          prev_end_date: `${year}-03-31`,
        },
        {
          label: `May ${year}`,
          start_date: `${year}-05-01`,
          end_date: `${year}-05-31`,
          prev_start_date: `${year}-04-01`,
          prev_end_date: `${year}-04-30`,
        },
        {
          label: `June ${year}`,
          start_date: `${year}-06-01`,
          end_date: `${year}-06-30`,
          prev_start_date: `${year}-05-01`,
          prev_end_date: `${year}-05-31`,
        },
        {
          label: `July ${year}`,
          start_date: `${year}-07-01`,
          end_date: `${year}-07-31`,
          prev_start_date: `${year}-06-01`,
          prev_end_date: `${year}-06-30`,
        },
        {
          label: `August ${year}`,
          start_date: `${year}-08-01`,
          end_date: `${year}-08-31`,
          prev_start_date: `${year}-07-01`,
          prev_end_date: `${year}-07-31`,
        },
        {
          label: `September ${year}`,
          start_date: `${year}-09-01`,
          end_date: `${year}-09-30`,
          prev_start_date: `${year}-08-01`,
          prev_end_date: `${year}-08-31`,
        },
        {
          label: `October ${year}`,
          start_date: `${year}-10-01`,
          end_date: `${year}-10-31`,
          prev_start_date: `${year}-09-01`,
          prev_end_date: `${year}-09-30`,
        },
        {
          label: `November ${year}`,
          start_date: `${year}-11-01`,
          end_date: `${year}-11-30`,
          prev_start_date: `${year}-10-01`,
          prev_end_date: `${year}-10-31`,
        },
        {
          label: `December ${year}`,
          start_date: `${year}-12-01`,
          end_date: `${year}-12-31`,
          prev_start_date: `${year}-11-01`,
          prev_end_date: `${year}-11-30`,
        },
      ];

      const getQuarters = (year) => [
        {
          label: `Q1 ${year}`,
          start_date: `${year}-01-01`,
          end_date: `${year}-03-31`,
          prev_start_date: `${year - 1}-10-01`,
          prev_end_date: `${year - 1}-12-31`,
        },
        {
          label: `Q2 ${year}`,
          start_date: `${year}-04-01`,
          end_date: `${year}-06-30`,
          prev_start_date: `${year}-01-01`,
          prev_end_date: `${year}-03-31`,
        },
        {
          label: `Q3 ${year}`,
          start_date: `${year}-07-01`,
          end_date: `${year}-09-30`,
          prev_start_date: `${year}-04-01`,
          prev_end_date: `${year}-06-30`,
        },
        {
          label: `Q4 ${year}`,
          start_date: `${year}-10-01`,
          end_date: `${year}-12-31`,
          prev_start_date: `${year}-07-01`,
          prev_end_date: `${year}-09-30`,
        },
      ];

      const newDropdownOptions = [
        {
          label: "Month",
          options: [],
        },
        {
          label: "Quarter",
          options: [],
        },
        {
          label: "Year",
          options: [],
        },
        {
          label: "All time",
        },
      ];

      const earliestProjectCreatedDateCopy = new Date(
        earliestProjectCreatedDate
      );

      while (
        earliestProjectCreatedDateCopy.getFullYear() <=
        currentDate.getFullYear()
      ) {
        getMonths(earliestProjectCreatedDateCopy.getFullYear()).forEach(
          (month) => {
            const monthEnd = new Date(month.end_date);
            if (
              earliestProjectCreatedDate <= monthEnd &&
              currentDate >= monthEnd
            ) {
              newDropdownOptions[0].options.push(month);
            }
          }
        );

        getQuarters(earliestProjectCreatedDateCopy.getFullYear()).forEach(
          (quarter) => {
            const quarterEnd = new Date(quarter.end_date);
            const quarterStart = new Date(quarter.start_date);

            if (
              earliestProjectCreatedDate <= quarterEnd &&
              currentDate >= quarterStart
            ) {
              newDropdownOptions[1].options.push(quarter);
            }
          }
        );

        newDropdownOptions[2].options.push({
          label: earliestProjectCreatedDateCopy.getFullYear(),
          start_date: `${earliestProjectCreatedDateCopy.getFullYear()}-01-01`,
          end_date: `${earliestProjectCreatedDateCopy.getFullYear()}-12-31`,
          prev_start_date: `${
            earliestProjectCreatedDateCopy.getFullYear() - 1
          }-01-01`,
          prev_end_date: `${
            earliestProjectCreatedDateCopy.getFullYear() - 1
          }-12-31`,
        });

        earliestProjectCreatedDateCopy.setFullYear(
          earliestProjectCreatedDateCopy.getFullYear() + 1
        );
      }

      setDropdownOptions(newDropdownOptions);
    }
  }, [dashboardTotals]);

  useEffect(() => {
    const getTotals = async () => {
      let dateQuery;
      if (selectedOption.label !== "All time") {
        dateQuery = selectedOption.end_date;
      }
      const resp = await api({
        path: `impact_dashboards/${impactDashboard.id}/totals${
          dateQuery ? `?end_date=${dateQuery}` : ""
        }`,
      });

      setDashboardTotals(resp);
    };
    getTotals();
  }, [selectedOption]);

  return !dashboardTotals ? (
    <Loader />
  ) : (
    <ImpactDashboard
      data={impactDashboard}
      selectedDateFrame={selectedDateFrame}
      setSelectedDateFrame={setSelectedDateFrame}
      selectedOption={selectedOption}
      setSelectedOption={setSelectedOption}
      dropdownOptions={dropdownOptions}
      dashboardTotals={dashboardTotals}
    />
  );
};
