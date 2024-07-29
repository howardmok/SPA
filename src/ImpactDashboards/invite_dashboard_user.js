import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { StyleSheet, css } from "aphrodite/no-important";
import { OutsideClickHandler, Modal, Input, Icon, styles } from "@sweeten/oreo";
import UserIcon from "../../images/icons/user";
import { api } from "../../utils/api";

const ss = StyleSheet.create({
  modal: {
    width: 800,
    borderRadius: 16,
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.tabletStandard,
      style: {
        width: "100%",
      },
    }),
  },
  dropdown: {
    position: "fixed",
    top: "auto",
    zIndex: 10,
    background: "white",
    maxHeight: 320,
    borderRadius: 8,
    border: "1px solid #E8EAEC",
    boxShadow:
      "0px 12px 16px -4px rgba(16, 24, 40, 0.08), 0px 4px 6px -2px rgba(16, 24, 40, 0.03)",
    overflowY: "scroll",
  },
  dropdownItem: {
    cursor: "pointer",
    padding: 12,
    ":hover": {
      background: "#F6F7F8",
    },
  },
});

const InviteDashboardUsersModal = ({ onClose, onAdd }) => {
  const [dropdownResults, setDropdownResults] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [dropdownQuery, setDropdownQuery] = useState("");
  const [companyName, setCompanyName] = useState(null);
  const [email, setEmail] = useState(null);
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);

  useEffect(async () => {
    const results = await api({
      path: `hiring_company/?search=${dropdownQuery}`,
    });

    setDropdownResults(results);
  }, [dropdownQuery]);

  return (
    <Modal onClose={onClose} aphStyle={ss.modal}>
      <Modal.Header>Invite member</Modal.Header>
      <Modal.Body
        style={{
          background: "#F0F9FF",
          margin: "0px -32px",
          padding: "32px 32px",
        }}
      >
        <div style={{ color: "#475467", marginBottom: 32 }}>
          Invite the member you wish to give access to this dashboard.
        </div>
        <div
          style={{ display: "flex", alignItems: "center", marginBottom: 32 }}
        >
          <div style={{ width: "100%" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: "calc(100% - 8px)",
                  marginRight: 16,
                }}
              >
                <Input
                  beforeElement={<UserIcon />}
                  placeholder="First name"
                  onChange={(val) => {
                    setFirstName(val);
                  }}
                  style={{ backgroundColor: "white" }}
                  value={firstName}
                />
              </div>
              <div style={{ position: "relative", width: "calc(100% - 8px)" }}>
                <Input
                  beforeElement={<UserIcon />}
                  placeholder="Last name"
                  onChange={(val) => {
                    setLastName(val);
                  }}
                  style={{ backgroundColor: "white" }}
                  value={lastName}
                />
              </div>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: "calc(100% - 8px)",
                  marginRight: 16,
                }}
              >
                <Input
                  beforeElement={<Icon name="hiring" size={16} />}
                  placeholder="Company name"
                  onChange={(val) => {
                    setCompanyName(val);
                    setDropdownQuery(val);
                    setOpenDropdown("company");
                  }}
                  style={{ backgroundColor: "white" }}
                  value={companyName}
                />
                {openDropdown === "company" && !!dropdownResults.length && (
                  <div className={css(ss.dropdown)}>
                    <OutsideClickHandler
                      onOutsideClick={() => setOpenDropdown(null)}
                    >
                      {dropdownResults.map((company) => (
                        <div
                          onClick={() => {
                            setCompanyName(company.business_name);
                            setDropdownQuery("");
                            setOpenDropdown(null);
                          }}
                          className={css(ss.dropdownItem)}
                        >
                          {company.business_name}
                        </div>
                      ))}
                    </OutsideClickHandler>
                  </div>
                )}
              </div>
              <div style={{ position: "relative", width: "calc(100% - 8px)" }}>
                <Input
                  beforeElement={<Icon name="mail" size={16} />}
                  placeholder="Email address"
                  onChange={(val) => {
                    setEmail(val);
                  }}
                  style={{ backgroundColor: "white" }}
                  value={email}
                />
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="outline-secondary"
          onClick={onClose}
          style={{ marginRight: 12 }}
        >
          Cancel
        </Button>
        <Button
          onClick={() =>
            onAdd({
              first_name: firstName,
              last_name: lastName,
              email,
              company_name: companyName,
            })
          }
        >
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default InviteDashboardUsersModal;
