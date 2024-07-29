/* eslint-disable jsx-a11y/anchor-is-valid */
import { styles } from "@sweeten/oreo";
import { StyleSheet, css } from "aphrodite/no-important";

const ss = StyleSheet.create({
  mobileNavContainer: {
    ...styles.mediaQuery({
      minWidth: styles.breakpoints.tabletStandard + 1,
      style: {
        display: "none",
      },
    }),
  },
  navItem: {
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    ":hover": {
      background: "#F6F7F8",
      color: styles.colors.black,
      borderRadius: 6,
    },
  },
});

export const LeftNavMobileItem = ({ onClick, leftNavChild, aphStyle }) => (
  <div
    className={css([ss.navItem, aphStyle])}
    style={{
      marginBottom: 8,
    }}
    onClick={onClick}
  >
    {leftNavChild}
  </div>
);

const LeftNavMobile = ({ children }) => (
  <div className={css(ss.mobileNavContainer)}>
    <nav
      className="navbar navbar-vertical navbar-expand-lg"
      style={{
        padding: 16,
        left: 0,
        transform: "none",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </nav>
  </div>
);

export default LeftNavMobile;
