import { StyleSheet, css } from "aphrodite";
import { useForm, useField } from "react-final-form-hooks";
import { Modal, styles } from "@sweeten/oreo";
import { Button } from "react-bootstrap";
import { useContext } from "react";
import FormInputField from "../FormComponents/input";
import SingleProjectCapacitySvg from "../../images/single-project-capacity.svg";
import { getWindowWidth } from "../shared";
import { AppDispatch } from "../app_provider";
import SweetenEnterpriseLogo from "../../images/sweeten-logo-blue.svg";
import { api } from "../../utils/api";

const ss = StyleSheet.create({
  modal: {
    padding: 0,
    width: 864,
    borderRadius: 16,
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.tabletStandard,
      style: {
        minWidth: 0,
        width: "100%",
        height: "100%",
        maxHeight: "unset",
        maxWidth: "unset",
        overflowY: "unset",
        borderRadius: 0,
        backgroundColor: "#FFF4EE",
      },
    }),
  },
  container: {
    borderRadius: 16,
    display: "flex",
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.tabletStandard,
      style: {
        flexDirection: "column",
        borderRadius: 0,
      },
    }),
  },
  leftContent: {
    backgroundColor: "#F0F9FF",
    padding: "72px 48px",
    width: 381,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.tabletStandard,
      style: {
        width: "auto",
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
        padding: "32px 32px 48px 32px",
      },
    }),
  },
  rightContent: {
    padding: "64px 48px",
    width: 483,
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.tabletStandard,
      style: {
        width: "auto",
        padding: "28px 20px",
        borderRadius: "24px 24px 0 0",
        backgroundColor: styles.colors.white,
      },
    }),
  },
  desktopOnly: {
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.tabletStandard,
      style: {
        display: "none",
      },
    }),
  },
  mobileOnly: {
    display: "none",
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.tabletStandard,
      style: {
        display: "block",
      },
    }),
  },
});

const WaitlistModal = ({ onClose }) => {
  const dispatch = useContext(AppDispatch);
  const windowWidth = getWindowWidth();
  const isDesktop = windowWidth > styles.breakpoints.tabletStandard;

  const { form, handleSubmit } = useForm({
    onSubmit: async (values) => {
      const { firstName, lastName, email, note } = values;

      const resData = await api({
        path: `waitlist`,
        method: "POST",
        body: {
          first_name: firstName,
          last_name: lastName,
          email,
          note,
        },
      });

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
            text: `You have successfully joined the waitlist!`,
          },
        });

        onClose();
      }
    },
  });
  const firstName = useField("firstName", form);
  const lastName = useField("lastName", form);
  const email = useField("email", form);
  const note = useField("note", form);

  return (
    <Modal fullScreenOnMobile onClose={onClose} aphStyle={ss.modal}>
      <Modal.Body>
        <div className={css(ss.container)}>
          <div className={css(ss.leftContent)}>
            <img
              alt="sweeten_enterprise"
              src={SweetenEnterpriseLogo}
              width={170}
              style={{ cursor: "pointer" }}
            />
            <div
              style={{
                fontSize: 32,
                color: "#263154",
                fontWeight: "bold",
                marginTop: 24,
                marginBottom: isDesktop ? 48 : 0,
                lineHeight: "40px",
              }}
            >
              Unlock more data with Sweeten Enterprise
            </div>
            {isDesktop && (
              <img
                src={SingleProjectCapacitySvg}
                alt="single-project-capacity"
              />
            )}
          </div>
          <div className={css(ss.rightContent)}>
            <div
              style={{
                color: styles.colors.black,
                fontSize: 16,
                fontWeight: 500,
                marginBottom: 29,
              }}
            >
              Please join the waiting list and we’ll get in touch when space
              becomes available
            </div>
            <div
              className={css(ss.desktopOnly)}
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <FormInputField
                inputProps={{
                  ...firstName.input,
                }}
                label="First name"
                halfWidth
                colStyle={{ width: 182 }}
                noMarginTop
              />
              <FormInputField
                inputProps={{
                  ...lastName.input,
                }}
                label="Last name"
                halfWidth
                colStyle={{ width: 182 }}
                noMarginTop
              />
            </div>
            <div
              className={css(ss.mobileOnly)}
              style={{ display: "flex", flexFlow: "column nowrap" }}
            >
              <FormInputField
                inputProps={{
                  ...firstName.input,
                }}
                label="First name"
              />
              <FormInputField
                inputProps={{
                  ...lastName.input,
                }}
                label="Last name"
              />
            </div>
            <FormInputField
              inputProps={{
                ...email.input,
              }}
              label="Email address"
            />
            <FormInputField
              inputProps={{
                ...note.input,
                placeholder:
                  "Add a note about your request or reason you’re interested in the product",
                as: "textarea",
                style: { height: 125, marginBottom: 30 },
              }}
              label="Note"
            />
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Button size="lg" style={{ width: 298 }} onClick={handleSubmit}>
                Join the waitlist
              </Button>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default WaitlistModal;
