import { Link } from "react-router-dom";
import { StyleSheet, css } from "aphrodite/no-important";
import { styles } from "@sweeten/oreo";
import { getWindowWidth, vanityUrlOrId } from "./shared";
import EmptyLogoSmallSvg from "../images/empty-icon-small.svg";
import EmptyLogoMediumSvg from "../images/empty-icon-medium.svg";
import EmptyLogoLargeSvg from "../images/empty-icon-large.svg";

const ss = StyleSheet.create({
  image: {
    objectFit: "contain",
    width: "100%",
    height: "100%",
    padding: "0px 10px",
  },
  imageBg: {
    display: "flex",
    backgroundColor: "#e6f5fe",
    width: 92,
    height: 92,
    borderRadius: 4,
    border: "5px solid white",
    boxShadow: "0 0 5px 0 rgba(0,0,0,0.04)",
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.tabletStandard,
      style: {
        width: 68,
        height: 68,
        border: "3px solid white",
      },
    }),
  },
  hasLogoBg: {
    backgroundColor: "white",
  },
  profileImageBg: {
    display: "flex",
    width: 145,
    height: 145,
    borderRadius: 4,
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.tabletStandard,
      style: {
        width: 112,
        height: 112,
      },
    }),
  },
});

const Logo = ({ isForProfileOrSettings, logo_url, mwbe }) => {
  const windowWidth = getWindowWidth();
  const showSmall =
    windowWidth <= styles.breakpoints.tabletStandard && !isForProfileOrSettings;
  const showMedium =
    windowWidth > styles.breakpoints.tabletStandard && !isForProfileOrSettings;
  const showLarge = isForProfileOrSettings;

  return (
    <>
      {logo_url ? (
        <Link to={vanityUrlOrId(mwbe)} style={{ marginRight: 16 }}>
          <div
            className={css(
              ss.imageBg,
              ss.hasLogoBg,
              isForProfileOrSettings && ss.profileImageBg
            )}
          >
            <img src={logo_url} alt="logo" className={css(ss.image)} />
          </div>
        </Link>
      ) : (
        <Link to={vanityUrlOrId(mwbe)} style={{ marginRight: 16 }}>
          <div
            className={css(
              ss.imageBg,
              isForProfileOrSettings && ss.profileImageBg
            )}
          >
            {showSmall && (
              <img src={EmptyLogoSmallSvg} style={{ margin: "auto" }} />
            )}
            {showMedium && (
              <img src={EmptyLogoMediumSvg} style={{ margin: "auto" }} />
            )}
            {showLarge && (
              <img src={EmptyLogoLargeSvg} style={{ margin: "auto" }} />
            )}
          </div>
        </Link>
      )}
    </>
  );
};

export default Logo;
