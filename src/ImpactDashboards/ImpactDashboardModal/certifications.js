import { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { StyleSheet, css } from "aphrodite";
import { capitalize } from "lodash";
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

const Certifications = ({ form, dashboard }) => {
  const [certGroupingsObj, setCertGroupings] = useState({});

  useEffect(() => {
    async function getCertGroupings() {
      const resData = await api({
        path: `certification_types`,
      });

      if (resData.length) {
        const obj = {};
        resData.forEach((certType) => {
          if (certType.groupings.length) {
            certType.groupings.forEach((grouping) => {
              if (!obj[grouping]) {
                const certGroups = dashboard ? dashboard.cert_groups || [] : [];
                obj[grouping] = {
                  checked: certGroups.length
                    ? !!certGroups.find((group) => group === grouping)
                    : false,
                  displayedValue: capitalize(grouping),
                };
              }
            });
          }
        });
        setCertGroupings(obj);
      }
    }

    getCertGroupings();
  }, [dashboard]);

  useEffect(() => {
    if (Object.keys(certGroupingsObj).length > 0) {
      form.change("cert_groups", certGroupingsObj);
    }
  }, [certGroupingsObj]);

  return (
    <div className={css(ss.cardContainer)} style={{ marginTop: 24 }}>
      <div
        style={{
          padding: "20px 24px",
        }}
      >
        <div style={{ color: "#0D1522", fontSize: 18, fontWeight: 600 }}>
          Certifications
        </div>
      </div>
      <div style={{ borderBottom: "1px solid #E8EAEC" }} />
      <div style={{ padding: 24 }}>
        <Row>
          <Col style={{ marginBottom: 24 }}>
            <div className={css(ss.label)}>
              Which certification groupings would you like to showcase on the
              dashboard?
            </div>
            <MultiSelectDropdown
              itemsObj={certGroupingsObj}
              setItemsObj={setCertGroupings}
              customDisplayValue={Object.values(certGroupingsObj)
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

export default Certifications;
