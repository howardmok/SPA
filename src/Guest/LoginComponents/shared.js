import { StyleSheet } from "aphrodite/no-important";
import { styles } from "@sweeten/oreo";

export const sharedGuestSS = StyleSheet.create({
  marginTop: {
    marginTop: 32,
  },
  center: {
    ...styles.center("vertical"),
  },
  horizontalLine: {
    margin: "24px 0px",
    borderTop: `1px solid ${styles.colors.grey20}`,
  },
  footerText: {
    fontSize: 13,
    lineHeight: "24px",
    color: "#6c757d",
  },
  loginForm: {
    display: "grid",
    alignItems: "center",
    justifyContent: "center",
    padding: 80,
    width: "50%",
    backgroundColor: styles.colors.white,
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.desktopStandard,
      style: {
        display: "flex",
        padding: 32,
        width: "100%",
      },
    }),
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.phoneStandard,
      style: {
        padding: "80px 16px",
      },
    }),
  },
  loginContainer: {
    width: 528,
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.desktopStandard,
      style: {
        width: "100%",
      },
    }),
  },
  button: {
    margin: "32px 0px 0px",
    width: "100%",
  },
  ssoButton: {
    margin: "16px 0px 32px",
    width: "100%",
    border: "1px solid var(--Component-colors-Components-Buttons-Secondary-button-secondary-border, #D0D5DD)",
    color: "var(--Component-colors-Components-Buttons-Secondary-button-secondary-fg, #344054)",
  },
  input: {
    height: 48,
    marginTop: 8,
    padding: "0px 16px",
    borderRadius: 2,
    fontSize: 16,
  },
  label: {
    fontWeight: 600,
    marginTop: 32,
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.phoneStandard,
      style: {
        marginTop: 16,
        fontSize: 14,
      },
    }),
  },
  imageContainer: {
    width: "50%",
    height: "100%",
    top: 0,
    right: 0,
    position: "fixed",
    zIndex: 90,
    background: "linear-gradient(135deg, #FFF8F4 0%, #ECF7FE 100%)",
    display: "flex",
    justifyContent: "center",
    paddingTop: 128,
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.desktopStandard,
      style: {
        display: "none",
      },
    }),
  },
  image: {
    width: "50%",
    height: "50%",
    objectFit: "contain",
    margin: "auto",
  },
});
