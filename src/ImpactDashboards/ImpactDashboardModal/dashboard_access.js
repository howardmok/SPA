import { EllipsisMenu, styles } from "@sweeten/oreo";
import { StyleSheet, css } from "aphrodite";
import { Button, Table } from "react-bootstrap";
import { useField } from "react-final-form-hooks";
import { Sparkle } from "../../emojis";
import PlusCircleIcon from "../../../images/icons/plus-circle";

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
  infoBox: {
    padding: 16,
    color: "#4D72D6",
    borderRadius: 8,
    background: "#E7F6FE",
    marginBottom: 16,
    border: "1px solid #E8EAEC",
  },
});

const DashboardAccess = ({
  form,
  toggleShowInviteModal,
  users: dashboardUsers,
}) => {
  const users = useField("users", form);

  const onDeleteUser = async (idx) => {
    const newArr = [...users.input.value];
    newArr.splice(idx, 1);
    users.input.onChange(newArr);
  };

  return (
    <div className={css(ss.cardContainer)} style={{ marginTop: 24 }}>
      <div
        style={{
          padding: "20px 24px",
        }}
      >
        <div style={{ color: "#0D1522", fontSize: 18, fontWeight: 600 }}>
          Dashboard access
        </div>
      </div>
      <div style={{ borderBottom: "1px solid #E8EAEC" }} />
      <div style={{ padding: 24 }}>
        <div className={css(ss.infoBox)}>
          <Sparkle /> We will email a link and temporary password to any people
          you invite. You can always come back to this step later if you'd like
          to first see how your dashboard is looking.
        </div>
        {dashboardUsers.length > 0 && (
          <div
            className="table-responsive"
            style={{
              borderRadius: 3,
              border: "1px solid rgb(243, 244, 246)",
              marginBottom: 16,
            }}
          >
            <Table bordered>
              <thead>
                <tr
                  style={{
                    backgroundColor: "#F6F7F8",
                    color: "#475467",
                    height: 44,
                    verticalAlign: "middle",
                  }}
                >
                  <th className="header first-col" colSpan={4}>
                    Name
                  </th>
                  <th className="header" colSpan={4}>
                    Company
                  </th>
                  <th className="header" colSpan={4}>
                    Email
                  </th>
                </tr>
              </thead>
              <tbody className="body">
                {users.input.value
                  ? users.input.value.map((user, idx) => (
                      <tr>
                        <td className="cell first-col" colSpan={4}>
                          <div>
                            {user.first_name} {user.last_name}
                          </div>
                        </td>
                        <td className="cell" colSpan={4}>
                          {user.company_name}
                        </td>
                        <td className="cell" colSpan={3}>
                          {user.email}
                        </td>
                        <td className="cell" colSpan={1}>
                          <div
                            className="cell"
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "center",
                            }}
                          >
                            <EllipsisMenu>
                              <EllipsisMenu.Item
                                onClick={() => onDeleteUser(idx)}
                              >
                                <div>Delete</div>
                              </EllipsisMenu.Item>
                            </EllipsisMenu>
                          </div>
                        </td>
                      </tr>
                    ))
                  : null}
              </tbody>
            </Table>
          </div>
        )}
        <Button
          variant="outline-primary"
          onClick={() => toggleShowInviteModal(true)}
        >
          <PlusCircleIcon
            style={{ color: styles.colors.brandPrimary, marginRight: 8 }}
          />
          Invite member
        </Button>
      </div>
    </div>
  );
};

export default DashboardAccess;
