import { StyleSheet, css } from "aphrodite/no-important";
import { styles } from "@sweeten/oreo";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import SweetenWhite from "../../images/sweeten-logo-white.svg";
import BarGraphIcon from "../../images/icons/bar-graph";
import BaltimorePeninsulaImg from "../../images/parent-project-headers/baltimore-peninsula.jpeg";
import JFKImg from "../../images/parent-project-headers/jfk-terminal-6.jpg";
import Market2300Img from "../../images/parent-project-headers/market-2300.jpg";
import ReservoirSquareImg from "../../images/parent-project-headers/reservoir-square.jpg";
import HeaderPlaceholderImg from "../../images/parent-project-headers/placeholder.png";
import { getWindowWidth } from "../shared";
import { UserData } from "../redirect_handler";
import ProfileDropdown from "../Navbar/ProfileDropdown";

const ss = StyleSheet.create({
  container: {
    display: "flex",
    margin: "auto",
    background: `linear-gradient(180deg, rgba(18,2,47,0.3) 0%, #1A2B44 100%)`,
    backgroundPosition: "0% 51%",
    backgroundSize: "cover",
    backgroundColor: "#F0F9FF",
    width: "100%",
    height: 543,
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.phoneStandard,
      style: {
        width: "auto",
        overflow: "hidden",
        background: `linear-gradient(0deg, rgba(18,2,47,0.3) 0%, #1A2B44 100%)`,
      },
    }),
  },
  header: {
    color: "white",
    paddingTop: 24,
    paddingLeft: 32,
    paddingRight: 32,
    width: "100%",
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.tabletStandard,
      style: {
        paddingTop: 32,
      },
    }),
  },
  titleAndLogo: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    fontSize: 20,
    fontWeight: 600,
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.tabletStandard,
      style: {
        fontSize: 16,
        lineHeight: "26px",
        display: "block",
      },
    }),
  },
  desktop: {
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.tabletStandard,
      style: {
        display: "none",
      },
    }),
  },
  mobile: {
    display: "none",
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.tabletStandard,
      style: {
        display: "block",
      },
    }),
  },
  signInCta: {
    borderColor: styles.colors.white,
    color: styles.colors.white,
    fontWeight: "bold",
    width: 149,
    borderRadius: 8,
    ":hover": {
      backgroundColor: "transparent",
      borderColor: styles.colors.white,
    },
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.tabletStandard,
      style: {
        float: "right",
      },
    }),
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.phoneStandard,
      style: {
        width: 110,
        height: 32,
        fontSize: 10,
        float: "right",
      },
    }),
  },
});

const Header = ({ parentProjectId }) => {
  const navigate = useNavigate();
  const isDesktop = getWindowWidth() > styles.breakpoints.phoneStandard;
  const { user } = useContext(UserData);
  let backgroundImage = HeaderPlaceholderImg;
  if (parentProjectId === "990bf000-9692-432d-9563-40c919e8f05a") {
    backgroundImage = BaltimorePeninsulaImg;
  } else if (parentProjectId === "2a0170fc-20be-4baa-a87c-814b08d99d45") {
    headerImage = Market2300Img;
  } else if (parentProjectId === "8e0fee43-d138-4862-9c84-e43663783029") {
    headerImage = ReservoirSquareImg;
  } else if (parentProjectId === "419b3cc4-6042-451f-9db9-67c6753696c1") {
    backgroundImage = JFKImg;
  }

  return (
    <div className={css(ss.container)} style={{ background: `url(${backgroundImage}) lightgray 50% / cover no-repeat` }}>
      <div className={css(ss.header)}>
        <div className={css([ss.titleAndLogo, ss.desktop])}>
          <div style={{ marginRight: "auto", flex: 1 }}>
            <img
              src={SweetenWhite}
              alt="sweeten-enterprise"
              style={{ height: 40 }}
            />
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: 14,
              lineHeight: "24px",
            }}
          >
            <BarGraphIcon style={{ marginRight: 16 }} />
            Community Engagement Dashboard
          </div>
          <div
            style={{
              display: "flex",
              marginLeft: "auto",
              flex: 1,
              justifyContent: "flex-end",
            }}
          >
            {user && (
              <>
                <Button
                  onClick={() => navigate(`/search`)}
                  className={css(ss.signInCta)}
                  style={{ marginRight: 24 }}
                  variant="outline-primary"
                >
                  View directory
                </Button>
                <ProfileDropdown
                  name={`${user.first_name} ${user.last_name}`}
                />
              </>
            )}
            {!user && (
              <Button
                onClick={() => navigate("/")}
                className={css(ss.signInCta)}
                variant="outline-primary"
              >
                Sign in
              </Button>
            )}
          </div>
        </div>
        <div className={css(ss.mobile)}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <img
              src={SweetenWhite}
              alt="sweeten-enterprise"
              style={{ height: isDesktop ? 40 : 24 }}
            />
            {user && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                }}
              >
                <Button
                  onClick={() => navigate(`/search`)}
                  className={css(ss.signInCta)}
                  style={{ marginRight: 10 }}
                  variant="outline-primary"
                >
                  View directory
                </Button>
                <ProfileDropdown
                  name={`${user.first_name} ${user.last_name}`}
                />
              </div>
            )}
            {!user && (
              <Button
                onClick={() => navigate("/")}
                className={css(ss.signInCta)}
                variant="outline-primary"
              >
                Sign in
              </Button>
            )}
          </div>
          <div
            style={{
              fontSize: isDesktop ? 14 : 12,
              textAlign: "center",
              fontWeight: "bold",
              marginTop: 112,
            }}
          >
            Community Engagement Dashboard
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
