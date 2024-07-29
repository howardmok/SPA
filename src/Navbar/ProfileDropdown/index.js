import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { styles, Avatar, OutsideClickHandler } from "@sweeten/oreo";
import { StyleSheet, css } from "aphrodite/no-important";
import Cookies from "js-cookie";

import { HiChevronDown } from "react-icons/hi";
import { useAuth } from "../../../hooks/useAuth";

import { getWindowWidth } from "../../shared";

const ss = StyleSheet.create({
  outerContainer: {
    cursor: "pointer",
    padding: 10,
    marginRight: 4,
    ":hover": {
      borderRadius: 6,
      backgroundColor: "#F2F4F7",
    },
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  profileDropdownExpandedMenu: {
    position: "absolute",
    backgroundColor: "white",
    top: 60,
    right: 23,
    boxShadow: "0 2px 8px 0 rgba(0,0,0,0.16)",
    borderRadius: 4,
    fontSize: 12,
    fontWeight: 600,
    width: "auto",
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.tabletStandard,
      style: {
        top: 54,
        right: 11,
      },
    }),
  },
  profileDropdownItem: {
    padding: 10,
    ":hover": {
      backgroundColor: "var(--color-light-gray)",
      cursor: "pointer",
    },
  },
  profileDropdownContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  profileDropdownName: {
    fontSize: 16,
    whiteSpace: "nowrap",
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.phoneStandard,
      style: {
        fontSize: 10,
      },
    }),
  },
  profileDropdownIcon: {
    height: 15,
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
});

const ProfileDropdown = ({ name }) => {
  const [expanded, setExpanded] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const isDesktop = getWindowWidth() > styles.breakpoints.tabletStandard;
  const [impersonating, setImpersonating] = useState(false);

  const unimpersonate = () => {
    const adminLoginToken = Cookies.get("admin-login-token");
    Cookies.set("login-token", adminLoginToken);
    Cookies.remove("admin-login-token");
    window.location.href = "/";
  };

  useEffect(() => {
    if (Cookies.get("login-token").endsWith("impersonating")) {
      setImpersonating(true);
    }
  }, []);

  return (
    <div
      onClick={() => setExpanded(!expanded)}
      className={css(ss.outerContainer)}
    >
      <div className={css(ss.profileDropdownContainer)}>
        <div
          className={css(ss.profileDropdownName)}
          style={{ marginTop: !isDesktop ? -5 : null }}
        >
          <Avatar
            firstName={name.split(" ")[0]}
            lastName={name.split(" ")[1]}
            size={24}
          />
        </div>
        <div
          className={css(ss.desktop)}
          style={{
            fontWeight: 400,
            fontSize: 10,
            color: "#000000",
            marginTop: 4,
          }}
        >
          Account
        </div>
      </div>
      {impersonating && (
        <div
          style={{
            marginLeft: 16,
            fontSize: 12,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <span>Impersonating</span>
          <a onClick={unimpersonate}>← Go back</a>
        </div>
      )}
      <OutsideClickHandler onOutsideClick={() => setExpanded(false)}>
        <div
          className={`${css(
            ss.profileDropdownExpandedMenu
          )} dropdown-menu show`}
          style={{ display: expanded ? "initial" : "none" }}
        >
          <div
            className={`${css(ss.profileDropdownItem)} dropdown-item`}
            onClick={() => navigate("/details#account-info")}
          >
            Settings
          </div>
          <div
            className={`${css(ss.profileDropdownItem)} dropdown-item`}
            onClick={logout}
          >
            Logout
          </div>
        </div>
      </OutsideClickHandler>
    </div>
  );
};

export default ProfileDropdown;
