import { useContext, useEffect, useState } from "react";
import { css, StyleSheet } from "aphrodite";
import { useNavigate, useParams } from "react-router-dom";
import { Icon } from "@sweeten/oreo";
import { capitalize } from "lodash";
import { Table } from "react-bootstrap";
import { api } from "../../../utils/api";
import MultiSelectDropdown from "../../MultiSelectDropdown";
import SingleSelectDropdown from "../../SingleSelectDropdown";
import { ImpactDashboardDataState } from "../wrapper";
import { CategoryBadge } from "../shared";
import { formatDateMMDDYYYY, formatToCurrency } from "../../shared";
import { CertPill } from "../../ProfileComponents/Certifications";
import { RACES } from "../../MwbeSearch/constants";
import Loader from "../../loader";
import { projectTotalContract } from "../../ParentProject/shared";

const ss = StyleSheet.create({
  dropdown: {
    width: 280,
    marginTop: 0,
  },
  colCell: {
    padding: 16,
    fontSize: 14,
    fontWeight: 500,
    color: "#0D1522",
  },
  tableHeader: {
    fontSize: 12,
    fontWeight: 500,
    color: "#475467",
    padding: "12px 16px",
  },
});

const DiversityCompanyDetails = ({
  dashboard,
  certGroupTypes,
  setCertGroupTypes,
}) => {
  const [certGroupingsObj, setCertGroupings] = useState({});
  const [searchData, setSearchData] = useState([]);
  const [certTypes, setCertTypes] = useState(null);
  const [projectsData, setProjectsData] = useState([]);
  const [searchQuery, setSearchQuery] = useState(null);
  const [initialProjects, setInitialProjects] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function setCertGroupingsObj() {
      const resData = await api({
        path: `certification_types`,
      });

      if (resData.length) {
        const obj = {};
        resData.forEach((certType) => {
          if (certType.groupings.length) {
            certType.groupings.forEach((grouping) => {
              if (!obj[grouping]) {
                obj[grouping] = {
                  checked: !!certGroupTypes.find((group) => group === grouping),
                  displayedValue: capitalize(grouping),
                };
              }
            });
          }
        });
        setCertGroupings(obj);
      }
    }

    setCertGroupingsObj();
  }, [certGroupTypes]);

  useEffect(() => {
    async function getCertTypes() {
      const certs = await api({
        path: "certification_types",
      });

      setCertTypes(certs);
    }

    getCertTypes();
  }, []);

  useEffect(() => {
    async function getData() {
      setLoading(true);
      const projectsPerParentProjArr = await Promise.all(
        dashboard.parent_projects.map(async (parentProject) => {
          const data = await api({
            path: `projects/impact_dashboard/?parent_project_id=${parentProject.id}`,
          });
          return data
            .filter(
              (proj) => !!proj.project_certifications.length || proj.original_id
            )
            .map((filteredProj) => ({
              ...filteredProj,
              parentProjectName: parentProject.name,
            }));
        })
      );

      const projectsCombined = projectsPerParentProjArr.flat(1);

      setInitialProjects(projectsCombined);
    }

    getData();
  }, [dashboard.parent_projects]);

  useEffect(() => {
    function filterData() {
      const moreFilteredProjects = initialProjects.map((project) => {
        const companyName = project.mwbe
          ? project.mwbe.legal_business_name
          : project.uncertified_company_name;
        const matchingName = searchQuery
          ? companyName.toLowerCase().includes(searchQuery.toLowerCase())
          : true;
        let certTypeToUse;
        let certAgencyToUse;
        const certArr = project.project_certifications;

        certArr.forEach((cert) => {
          const certification = cert.certification || cert;

          if (cert.certification) {
            const foundCertType = certTypes.find(
              (certType) => certType.name === certification.type
            );
            if (
              certGroupTypes.filter((value) =>
                foundCertType.groupings.includes(value)
              ).length &&
              matchingName
            ) {
              certTypeToUse = certification.type;
              certAgencyToUse = certification.agency;
            }
          } else {
            const foundCertType = certTypes.find(
              (certType) => certType.name === certification.cert_type
            );
            if (
              certGroupTypes.filter((value) =>
                foundCertType.groupings.includes(value)
              ).length &&
              matchingName
            ) {
              certTypeToUse = certification.cert_type;
              certAgencyToUse = certification.certifying_agency;
            }
          }
        });
        return certTypeToUse
          ? {
              ...project,
              companyName,
              certAgency: certAgencyToUse
                ? certAgencyToUse.name
                : "Self-certified",
              certificationType: certTypeToUse,
              race: project.race || (project.mwbe ? project.mwbe.race : null),
            }
          : null;
      });

      const projects = moreFilteredProjects.filter((proj) => proj);

      setProjectsData(projects);
      const newSearchData = [];

      projects.forEach((project) => {
        const companyName = project.mwbe
          ? project.mwbe.legal_business_name
          : project.uncertified_company_name;
        newSearchData.push({
          label: companyName,
          value: companyName,
        });
      });
      setSearchData(newSearchData);
      setLoading(false);
    }

    if (certGroupTypes && certTypes && initialProjects) {
      setLoading(true);
      filterData();
    }
  }, [initialProjects, searchQuery, certGroupTypes, certTypes]);

  return (
    <div style={{ marginTop: 16 }}>
      <div style={{ fontWeight: "bold", fontSize: 30, marginBottom: 32 }}>
        Diversity company details
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <MultiSelectDropdown
          itemsObj={certGroupingsObj}
          setItemsObj={setCertGroupings}
          onChange={(item) => {
            let newArr;
            if (item === "All items") {
              const allChecked = Object.values(certGroupingsObj).every(
                (obj) => obj.checked
              );
              if (allChecked) {
                newArr = Object.keys(certGroupingsObj).map((key) => key);
              } else {
                newArr = [];
              }
            } else {
              newArr = [...certGroupTypes];
              if (newArr.includes(item)) {
                newArr.splice(newArr.indexOf(item), 1);
              } else {
                newArr.push(item);
              }
            }

            setCertGroupTypes(newArr);
          }}
          customDisplayValue={`${certGroupTypes.length} certification group${
            certGroupTypes.length === 1 ? "" : "s"
          } selected`}
          aphStyle={ss.dropdown}
        />
        <SingleSelectDropdown
          beforeElement={<Icon name="search" size={16} />}
          placeholder="Search"
          onChange={(val) => setSearchQuery(val)}
          onChangeInput={(val) => setSearchQuery(val)}
          items={searchData}
          style={{ width: 320, background: "white" }}
          hasSearch
          hideChevron
        />
      </div>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 32 }}>
        {certGroupTypes.map((certGroup, idx) => (
          <div
            style={{ marginRight: idx !== certGroupTypes.length - 1 ? 8 : 0 }}
          >
            <CategoryBadge
              category={certGroup}
              onClose={() => {
                const newArr = [...certGroupTypes];
                newArr.splice(idx, 1);
                setCertGroupTypes(newArr);
              }}
            />
          </div>
        ))}
      </div>
      {loading ? (
        <Loader />
      ) : (
        <div>
          {initialProjects && (
            <div
              className="table-responsive"
              style={{
                borderRadius: 3,
                border: "1px solid rgb(243, 244, 246)",
                marginBottom: 16,
              }}
            >
              <Table bordered style={{ background: "white", borderRadius: 16 }}>
                <thead>
                  <tr
                    style={{
                      backgroundColor: "#F6F7F8",
                      color: "#475467",
                      height: 44,
                      verticalAlign: "middle",
                    }}
                  >
                    <th className={css(ss.tableHeader)}>Company</th>
                    <th className={css(ss.tableHeader)}>Project</th>
                    <th className={css(ss.tableHeader)}>Utilized as</th>
                    <th className={css(ss.tableHeader)}>Ethnicity</th>
                    <th className={css(ss.tableHeader)}>Contract date</th>
                    <th className={css(ss.tableHeader)}>Amount</th>
                  </tr>
                </thead>
                <tbody
                  className="body"
                  style={{ borderTop: "1px solid #E8EAEC" }}
                >
                  {projectsData.map((project) => (
                    <tr>
                      <td className={`cell first-col ${css(ss.colCell)}`}>
                        {project.companyName}
                      </td>
                      <td className={`cell ${css(ss.colCell)}`}>
                        {project.parentProjectName}
                      </td>
                      <td className={`cell ${css(ss.colCell)}`}>
                        <CertPill
                          certAgency={project.certAgency}
                          certificationType={project.certificationType}
                          noTooltip
                        />
                      </td>
                      <td className={`cell ${css(ss.colCell)}`}>
                        {project.race ? RACES[project.race] : ""}
                      </td>
                      <td className={`cell ${css(ss.colCell)}`}>
                        {formatDateMMDDYYYY(project.contracted_date)}
                      </td>
                      <td className={`cell ${css(ss.colCell)}`}>
                        {formatToCurrency(projectTotalContract(project))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default () => {
  const { certGroup } = useParams();
  const [certGroupTypes, setCertGroupTypes] = useState(
    certGroup ? certGroup.split("|") : []
  );
  const navigate = useNavigate();

  const { setBreadcrumbs, data: impactDashboard } = useContext(
    ImpactDashboardDataState
  );

  useEffect(() => {
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
      {
        label: "Diversity company details",
        onClick: () =>
          navigate(
            `/impact-dashboards/${impactDashboard.id}/diversity-company/${certGroup}`
          ),
      },
    ]);
  }, [
    impactDashboard.name,
    setBreadcrumbs,
    certGroup,
    impactDashboard.id,
    navigate,
  ]);

  return (
    <DiversityCompanyDetails
      dashboard={impactDashboard}
      certGroupTypes={certGroupTypes}
      setCertGroupTypes={setCertGroupTypes}
    />
  );
};
