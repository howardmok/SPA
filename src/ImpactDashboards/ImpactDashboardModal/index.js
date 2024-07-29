import { Modal, styles } from "@sweeten/oreo";
import { StyleSheet } from "aphrodite";
import { Button } from "react-bootstrap";
import { useField, useForm } from "react-final-form-hooks";
import { useContext, useEffect, useState } from "react";
import Overview from "./overview";
import Projects from "./projects";
import Certifications from "./certifications";
import DashboardAccess from "./dashboard_access";
import TrashIcon from "../../../images/icons/trash";
import { AppDispatch } from "../../app_provider";
import { api } from "../../../utils/api";
import InviteDashboardUsersModal from "../invite_dashboard_user";
import { getHiringCompanyId } from "../../shared";
import { UserData } from "../../redirect_handler";

const ss = StyleSheet.create({
  header: {
    display: "flex",
    alignItems: "center",
    fontWeight: 600,
    fontSize: 18,
    color: styles.colors.black,
    padding: 24,
    marginBottom: "0px !important",
    borderBottom: "1px solid #E8EAEC",
  },
});

const ImpactDashboardModal = ({ onClose, dashboard, setUpdated, onDelete }) => {
  const { user } = useContext(UserData);
  const dispatch = useContext(AppDispatch);
  const hiringCompanyId = getHiringCompanyId({ user });
  const [showInviteModal, toggleShowInviteModal] = useState(false);

  const { form, handleSubmit } = useForm({
    initialValues: {
      name: dashboard ? dashboard.name : null,
      description: dashboard ? dashboard.description : null,
    },
    onSubmit: async (values) => {
      let resData;
      const certGroups = values.cert_groups
        ? Object.entries(values.cert_groups)
            .filter(([key, value]) => value.checked)
            .map(([filteredKey, filteredVal]) => filteredKey)
        : null;
      if (dashboard) {
        resData = await api({
          path: `impact_dashboards/${dashboard.id}`,
          method: "PATCH",
          body: {
            name: values.name,
            description: values.description,
            cert_groups: certGroups,
          },
        });
        const originalParentProjects = dashboard
          ? dashboard.parent_projects
          : [];
        const originalUsers = dashboard ? dashboard.users : [];
        const uniqueOriginalProjects = originalParentProjects.filter(
          (origProj) =>
            !values.parent_projects
              ? true
              : !Object.entries(values.parent_projects).find(
                  ([projId, val]) => projId === origProj.id && val.checked
                )
        );
        const uniqueNewProjects = values.parent_projects
          ? Object.entries(values.parent_projects).filter(
              ([newProjId, val]) =>
                val.checked &&
                !originalParentProjects.find((proj) => proj.id === newProjId)
            )
          : [];

        uniqueOriginalProjects.forEach(async (proj) => {
          await api({
            path: `impact_dashboards/${dashboard.id}/parent_project/${proj.id}`,
            method: "DELETE",
          });
        });
        uniqueNewProjects.forEach(async ([projId, projObj]) => {
          await api({
            path: `impact_dashboards/${dashboard.id}/parent_project`,
            method: "POST",
            body: {
              impact_dashboard_id: dashboard.id,
              parent_project_id: projId,
            },
          });
        });
        const uniqueOriginalUsers = originalUsers.filter(
          (origUser) =>
            !values.users.find((newUser) => newUser.id === origUser.id)
        );
        const uniqueNewUsers = values.users.filter(
          (newUser) =>
            !originalUsers.find((origUser) => origUser.id === newUser.id)
        );

        for (const uniqUserObj of uniqueOriginalUsers) {
          await api({
            path: `users/impact_dashboard/${dashboard.id}/${uniqUserObj.user_id}`,
            method: "DELETE",
          });
        }
        for (const uniqUser of uniqueNewUsers) {
          await api({
            path: `users/impact_dashboard/${dashboard.id}/invite`,
            method: "POST",
            body: {
              email: uniqUser.email,
              first_name: uniqUser.first_name,
              last_name: uniqUser.last_name,
              company_name: uniqUser.company_name,
            },
          });
        }
      } else {
        resData = await api({
          path: "impact_dashboards",
          method: "POST",
          body: {
            name: values.name,
            description: values.description,
            cert_groups: certGroups,
            hiring_company_id: hiringCompanyId,
          },
        });
        if (resData.id) {
          if (values.parent_projects) {
            Object.keys(values.parent_projects).forEach(async (projId) => {
              if (values.parent_projects[projId].checked) {
                await api({
                  path: `impact_dashboards/${resData.id}/parent_project`,
                  method: "POST",
                  body: {
                    impact_dashboard_id: resData.id,
                    parent_project_id: projId,
                  },
                });
              }
            });
          }
          if (values.users) {
            values.users.forEach(async (uniqUser) => {
              await api({
                path: `users/impact_dashboard/${resData.id}/invite`,
                method: "POST",
                body: {
                  email: uniqUser.email,
                  first_name: uniqUser.first_name,
                  last_name: uniqUser.last_name,
                  company_name: uniqUser.company_name,
                },
              });
            });
          }
        }
      }
      if (resData.error) {
        dispatch({
          type: "alert:show",
          payload: {
            variant: "error",
            text: `Something went wrong. Please try again.`,
          },
        });
      } else {
        dispatch({
          type: "alert:show",
          payload: {
            variant: "success",
            text: `Dashboard ${dashboard ? "edited" : "created"}!`,
          },
        });
        setUpdated(true);
        onClose();
      }
    },
  });

  useEffect(() => {
    form.getFieldState("users").change(
      dashboard
        ? dashboard.users.map((userObj) => ({
            id: userObj.user_id,
            email: userObj.user.email,
            first_name: userObj.user.first_name,
            last_name: userObj.user.last_name,
            company_name: userObj.company_name,
          }))
        : []
    );

    setUpdated(false);
  }, [dashboard, form]);

  const users = useField("users", form);

  return (
    <>
      <Modal
        disableOutsideClick
        style={{ padding: 0, width: 1000 }}
        onClose={onClose}
      >
        <Modal.Header aphStyle={ss.header}>Dashboard settings</Modal.Header>
        <Modal.Body style={{ padding: 32, backgroundColor: "#F0F9FF" }}>
          <Overview form={form} />
          <Projects form={form} dashboard={dashboard} />
          <Certifications form={form} dashboard={dashboard} />
          <DashboardAccess
            form={form}
            toggleShowInviteModal={toggleShowInviteModal}
            users={dashboard ? dashboard.users : []}
          />
        </Modal.Body>
        <Modal.Footer
          style={{
            justifyContent: dashboard ? "space-between" : "flex-end",
            padding: 24,
            paddingTop: 32,
            marginTop: 0,
            borderTop: "1px solid #E8EAEC",
          }}
        >
          {dashboard && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
              onClick={onDelete}
            >
              <TrashIcon style={{ marginRight: 8 }} />
              Delete dashboard
            </div>
          )}
          <div style={{ display: "flex", alignItems: "center" }}>
            <Button onClick={onClose} variant="outline-secondary">
              Cancel
            </Button>
            <Button onClick={handleSubmit} style={{ marginLeft: 16 }}>
              Save
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
      {showInviteModal && (
        <InviteDashboardUsersModal
          onClose={() => toggleShowInviteModal(false)}
          onAdd={(invitedUser) => {
            users.input.onChange([...users.input.value, invitedUser]);
            toggleShowInviteModal(false);
          }}
        />
      )}
    </>
  );
};

export default ImpactDashboardModal;
