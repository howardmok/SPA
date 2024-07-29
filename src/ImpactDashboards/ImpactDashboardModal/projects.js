import { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { StyleSheet, css } from "aphrodite";
import { api } from "../../../utils/api";
import MultiSelectDropdown from "../../MultiSelectDropdown";

const ss = StyleSheet.create({
  cardContainer: {
    borderRadius: 8,
    border: "1px solid #E8EAEC",
    backgroundColor: "#FFFFFF",
    boxShadow:
      "0px 1px 3px rgba(16, 24, 40, 0.1), 0px 1px 2px rgba(16, 24, 40, 0.06)",
  },
  label: {
    color: "#0D1522",
    fontSize: 14,
    fontWeight: 500,
    marginBottom: 8,
  },
  dropdownInput: {
    height: 52,
    border: "1px solid #D1D5DB",
    marginTop: 8,
  },
  editIcon: {
    cursor: "pointer",
    padding: 10,
    ":hover": {
      backgroundColor: "#F6F7F8",
      borderRadius: 8,
    },
  },
});

const Projects = ({ form, dashboard }) => {
  const [parentProjectsObj, setParentProjects] = useState({});

  useEffect(() => {
    async function getParentProjects() {
      const resData = await api({
        path: `parent_projects?include_participant_projects=true`,
      });

      if (resData.length) {
        const obj = {};
        resData.forEach((parentProject) => {
          const parentProjects = dashboard
            ? dashboard.parent_projects || []
            : [];
          obj[parentProject.id] = {
            checked: parentProjects.length
              ? !!parentProjects.find((proj) => proj.id === parentProject.id)
              : false,
            displayedValue: parentProject.name,
          };
        });
        setParentProjects(obj);
      }
    }

    getParentProjects();
  }, [dashboard]);

  useEffect(() => {
    if (Object.keys(parentProjectsObj).length > 0) {
      form.change("parent_projects", parentProjectsObj);
    }
  }, [parentProjectsObj]);

  return (
    <div className={css(ss.cardContainer)} style={{ marginTop: 24 }}>
      <div
        style={{
          padding: "20px 24px",
        }}
      >
        <div style={{ color: "#0D1522", fontSize: 18, fontWeight: 600 }}>
          Projects
        </div>
      </div>
      <div style={{ borderBottom: "1px solid #E8EAEC" }} />
      <div style={{ padding: 24 }}>
        <Row>
          <Col style={{ marginBottom: 24 }}>
            <div className={css(ss.label)}>
              Which projects would you like to include?
            </div>
            <MultiSelectDropdown
              itemsObj={parentProjectsObj}
              setItemsObj={setParentProjects}
              customDisplayValue={Object.values(parentProjectsObj)
                .filter((value) => value.checked)
                .map((value) => value.displayedValue)
                .join(", ")}
            />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Projects;
