import { capitalize } from "lodash";
import UserIcon from "../../images/icons/user-minus";
import ListIcon from "../../images/icons/list";
import WomanIcon from "../../images/icons/woman";
import DisabledIcon from "../../images/icons/disabled";
import ScalesIcon from "../../images/icons/scales";
import BuildingIcon from "../../images/icons/building";
import PinIcon from "../../images/icons/pin";
import RainbowIcon from "../../images/icons/rainbow";
import AwardIcon from "../../images/icons/award";
import CloseIcon from "../../images/icons/close";
import { api } from "../../utils/api";
import { calculateSingleAmt } from "../ParentProject/shared";

export const categoryColors = {
  minority: "#4D72D6",
  women: "#3CCB7F",
  disabled: "#F38744",
  disadvantaged: "#FAA7E0",
  small: "#EAAA08",
  local: "#F670C7",
  lgbt: "#15B79E",
  veteran: "#9B8AFB",
  other: "#61646C",
};

export const CategoryBadge = ({ category, onClose }) => {
  const props = {};
  switch (category) {
    case "minority":
      props.color = categoryColors.minority;
      props.icon = (
        <UserIcon
          style={{ marginRight: 4, color: "white", width: 16, height: 16 }}
        />
      );
      break;
    case "women":
      props.color = categoryColors.women;
      props.icon = (
        <WomanIcon
          style={{ marginRight: 4, color: "white", width: 16, height: 16 }}
        />
      );
      break;
    case "disabled":
      props.color = categoryColors.disabled;
      props.icon = (
        <DisabledIcon
          style={{ marginRight: 4, color: "white", width: 16, height: 16 }}
        />
      );
      break;
    case "disadvantaged":
      props.color = categoryColors.disadvantaged;
      props.icon = (
        <ScalesIcon
          style={{ marginRight: 4, color: "white", width: 16, height: 16 }}
        />
      );
      break;
    case "small":
      props.color = categoryColors.small;
      props.icon = (
        <BuildingIcon
          style={{ marginRight: 4, color: "white", width: 16, height: 16 }}
        />
      );
      break;
    case "local":
      props.color = categoryColors.local;
      props.icon = (
        <PinIcon
          style={{ marginRight: 4, color: "white", width: 16, height: 16 }}
        />
      );
      break;
    case "lgbt":
      props.color = categoryColors.lgbt;
      props.icon = (
        <RainbowIcon
          style={{ marginRight: 4, color: "white", width: 16, height: 16 }}
        />
      );
      break;
    case "veteran":
      props.color = categoryColors.veteran;
      props.icon = (
        <AwardIcon
          style={{ marginRight: 4, color: "white", width: 16, height: 16 }}
        />
      );
      break;
    default:
      props.color = categoryColors.other;
      props.icon = (
        <ListIcon
          style={{ marginRight: 4, color: "white", width: 16, height: 16 }}
        />
      );
  }

  return (
    <div
      style={{
        borderRadius: 8,
        padding: "2px 10px",
        backgroundColor: props.color,
        color: "white",
        fontSize: 14,
        fontWeight: 500,
        display: "inline-flex",
        alignItems: "center",
      }}
    >
      {props.icon}
      {capitalize(category)}
      {onClose && (
        <CloseIcon
          style={{ marginLeft: 8, cursor: "pointer", color: "white" }}
          onClick={() => onClose(category)}
        />
      )}
    </div>
  );
};

export const calculateTotals = async ({ dashboard, startDate, endDate }) => {
  const newDashboard = { ...dashboard };
  async function getCertTypes() {
    const certs = await api({
      path: "certification_types",
    });

    return certs;
  }

  const certTypes = await getCertTypes();

  async function getSnapshotTotals() {
    // array of arrays; each array is a snapshot of totals for a parent project
    const allTotals = [];
    const years = [];
    if (newDashboard.parent_projects) {
      await Promise.all(
        newDashboard.parent_projects.map(async (parentProject) => {
          const query =
            startDate || endDate
              ? `?${startDate ? `start_date=${startDate}` : ""}${
                  startDate && endDate ? "&" : ""
                }${endDate ? `end_date=${endDate}` : ""}`
              : "";
          const totalForProject = await api({
            path: `parent_projects/${parentProject.id}/snapshot_totals${query}`,
          });
          const nonQueryData = await api({
            path: `parent_projects/${parentProject.id}/snapshot_totals`,
          });

          years.push(
            nonQueryData.map((data) => data.snapshot_date.split("-")[0])
          );
          allTotals.push(totalForProject);
        })
      );
    }

    newDashboard.years = [...new Set(years.flat(1))];
    newDashboard.allTotals = allTotals.flat(1);
  }

  await getSnapshotTotals();

  const obj = {};

  async function getContractedAmounts() {
    let contractedTotal = 0;
    const totalsForParentProject = [];
    if (newDashboard.parent_projects) {
      await Promise.all(
        newDashboard.parent_projects.map(async (parentProject) => {
          let contractedTotalForParentProject = 0;
          const projects = await api({
            path: `projects/impact_dashboard?parent_project_id=${
              parentProject.id
            }${endDate ? `&snapshot_date=${endDate}` : ""}`,
          });
          const projectMap = {};
          const filteredProjects = projects.filter(
            (proj) => !!proj.project_certifications.length
          );
          await Promise.all(
            filteredProjects.map(async (project) => {
              let foundCert = false;
              const contractedAmt = calculateSingleAmt(
                project,
                "Excluding waiver amounts",
                "Contracted amounts"
              );
              const certArr = project.project_certifications;
              if (!projectMap[project.id]) {
                certArr.forEach((cert) => {
                  const certification = cert.certification || cert;
                  const foundCertType = certTypes.find(
                    (certType) => certType.name === certification.type
                  );
                  if (foundCertType) {
                    const { groupings } = foundCertType;
                    groupings.forEach((grouping) => {
                      if (!obj[grouping]) {
                        obj[grouping] = {
                          companyCount: 0,
                          totalContracted: 0,
                          projects: [],
                        };
                      }
                      const projObj = obj[grouping].projects.find(
                        (proj) => proj.id === parentProject.id
                      );
                      if (!projObj) {
                        obj[grouping].projects.push({
                          id: parentProject.id,
                          companyCount: 1,
                          totalContracted: contractedAmt,
                          grouping,
                        });
                      } else {
                        projObj.companyCount += 1;
                        projObj.totalContracted += contractedAmt;
                      }
                      obj[grouping].companyCount += 1;
                      obj[grouping].totalContracted += contractedAmt;
                    });
                    foundCert = true;
                  }
                });
              }
              if (foundCert) {
                contractedTotalForParentProject += contractedAmt;
                contractedTotal += contractedAmt;
                projectMap[project.id] = true;
              }
            })
          );
          // this is to prevent double counting of totals for parent projects
          totalsForParentProject.push({
            parentProjectId: parentProject.id,
            total: contractedTotalForParentProject,
          });
        })
      );
    }
    newDashboard.contractedTotal = contractedTotal;
    newDashboard.totalsForParentProject = totalsForParentProject;
  }

  await getContractedAmounts();

  newDashboard.allTotals.forEach((totalInfo) => {
    const allTotalCertTypeInfo = totalInfo.totals.by_cert_type;
    Object.keys(allTotalCertTypeInfo).forEach((certType) => {
      if (certType !== "Non-certified" && certType !== "all") {
        const { groupings } = certTypes.find((cert) => cert.name === certType);
        groupings.forEach((grouping) => {
          if (obj[grouping]) {
            if (!obj[grouping].snapshotArr) {
              obj[grouping].snapshotArr = [
                {
                  date: totalInfo.snapshot_date,
                  value:
                    totalInfo.totals.by_cert_type[certType].contracted_float,
                },
              ];
            } else {
              obj[grouping].snapshotArr.push({
                date: totalInfo.snapshot_date,
                value: totalInfo.totals.by_cert_type[certType].contracted_float,
              });
            }
          }
        });
      }
    });
  });

  return {
    totalsInfo: obj,
    dashboard: newDashboard,
  };
};
