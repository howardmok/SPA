import { StyleSheet, css } from "aphrodite";
import { useField } from "react-final-form-hooks";
import FormInputField from "../../FormComponents/input";
import { required } from "../../validators";

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
  editIcon: {
    cursor: "pointer",
    padding: 10,
    ":hover": {
      backgroundColor: "#F6F7F8",
      borderRadius: 8,
    },
  },
});

const Overview = ({ form }) => {
  const nameField = useField("name", form, required);
  const descriptionField = useField("description", form);

  return (
    <div className={css(ss.cardContainer)}>
      <div
        style={{
          padding: "20px 24px",
        }}
      >
        <div style={{ color: "#0D1522", fontSize: 18, fontWeight: 600 }}>
          Overview
        </div>
      </div>
      <div style={{ borderBottom: "1px solid #E8EAEC" }} />
      <div style={{ padding: 24 }}>
        <div style={{ marginBottom: 24 }}>
          <div className={css(ss.label)}>Dashboard Name</div>
          <FormInputField
            error={nameField.meta.touched && nameField.meta.error}
            id="name"
            inputProps={{
              ...nameField.input,
              placeholder: "Dashboard name",
              style: {
                marginTop: 0,
                height: 52,
                borderRadius: 8,
                border: "1px solid #D1D5DB",
              },
              "data-test": "dashboard-name",
            }}
            noMarginTop
          />
        </div>
        <div>
          <div className={css(ss.label)}>Description</div>
          <FormInputField
            error={descriptionField.meta.touched && descriptionField.meta.error}
            id="description"
            inputProps={{
              ...descriptionField.input,
              placeholder: "Description",
              as: "textarea",
              style: {
                marginTop: 0,
                borderRadius: 8,
                border: "1px solid #D1D5DB",
              },
              "data-test": "dashboard-description",
            }}
            noMarginTop
          />
        </div>
      </div>
    </div>
  );
};

export default Overview;
