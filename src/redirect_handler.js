import Cookies from "js-cookie";
import { createContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import * as Sentry from "@sentry/react";
import { useAuth } from "../hooks/useAuth.ts";
import {
  isHiringCompany,
  isMwbeOrInternal,
  useQuery,
  vanityUrlOrId,
  PENDO_KEY,
  canViewImpactDashboards,
} from "./shared";
import Loader from "./loader";
import { api } from "../utils/api";

const userTypeToAllowedPathnames = {
  MWBE: [
    "search",
    "profile",
    "details",
    "claim",
    "onboarding",
    "messaging",
    "opportunity",
    "community-engagement-dashboard",
    "baltimore-peninsula",
    "notifications",
  ],
  PRIME: [
    "search",
    "list",
    "details",
    "profile",
    "opportunity",
    "messaging",
    "community-engagement-dashboard",
    "baltimore-peninsula",
    "notifications",
    "parent-project",
    "impact-dashboards",
  ],
  DEVELOPER: [
    "search",
    "list",
    "details",
    "profile",
    "opportunity",
    "community-engagement-dashboard",
    "baltimore-peninsula",
    "notifications",
    "parent-project",
    "impact-dashboards",
  ],
  GOVERNMENT_AGENCY: [
    "search",
    "list",
    "details",
    "profile",
    "opportunity",
    "community-engagement-dashboard",
    "baltimore-peninsula",
    "notifications",
    "parent-project",
    "impact-dashboards",
  ],
};

const pathnameToViewCategory = {
  "/community-engagement-dashboard": "Community engagement dashboard",
  "/baltimore-peninsula": "MAG Engagement Dashboard",
  "/forgot-password": "Reset password",
  "/new-password": "New password",
  "/request-login": "Request login details",
  "/port-covington": "Community engagement dashboard",
  "/opportunity/search": "Opportunity postings",
  "/search": "Directory",
  "/profile": "MWBE profile",
  "/details": "Account settings",
  "/claim": "MWBE claim",
  "/onboarding": "MWBE onboarding",
  "/messaging": "Messages",
  "/opportunity/dashboard": "My opportunity dashboard",
  "/opportunity": "Individual opportunity",
  "/edit": "Opportunity form",
  "/list": "Shortlists",
  "/notifications": "Notifications",
  "/parent-project/all": "Projects",
  "/home": "Dashboard home",
  "/prime-contractors": "External stakeholders primes",
  "/project-viewers": "External stakeholders viewers",
  "/participants/team": "Your team",
  "/data-input/contracting": "Data details contracting",
  "/data-input/workforce-utilization": "Data details workforce",
  "/data-input/local-hiring": "Data details local hiring",
  "/report": "Contracting report",
  "/impact-dashboards": "Impact dashboards",
};

export const UserData = createContext(() => {});

const getPageViewCategory = () =>
  pathnameToViewCategory[
    Object.keys(pathnameToViewCategory).find(
      (key) => window.location.pathname.indexOf(key) > -1
    )
  ];

const RedirectHandler = ({ children }) => {
  const { getUser, loading, user } = useAuth();
  const location = useLocation();
  const query = useQuery();
  const navigate = useNavigate();
  const [userToken, setUserToken] = useState(Cookies.get("login-token"));
  const [lastDirectoryPage, setLastDirectoryPage] = useState("search");
  const { id } = useParams();
  const [pageLoading, setLoading] = useState(true);

  const recordPageView = async (userToPass) => {
    const isVanityMWBEUrl = !getPageViewCategory();

    if (location.pathname === "/") {
      api({
        path: "analytics_data/view",
        method: "POST",
        body: {
          url_path: window.location.pathname,
          view_category: "Login page",
        },
      });
    } else if (isVanityMWBEUrl) {
      const result = await api({
        path: `mwbes?profile_url_path=${id}`,
      });

      if (result[0]) {
        api({
          path: "analytics_data/view",
          method: "POST",
          body: {
            url_path: window.location.pathname,
            view_category: pathnameToViewCategory["/profile"],
            view_category_id: result[0].id,
            user_id: userToPass && userToPass.id,
          },
        });
      }
    } else {
      api({
        path: "analytics_data/view",
        method: "POST",
        body: {
          url_path: window.location.pathname,
          view_category: getPageViewCategory(),
          view_category_id: id,
          user_id: userToPass && userToPass.id,
        },
      });
    }
  };

  const checkCurrentOpportunity = async (userInfo, oppId) => {
    let idToUse = oppId;

    if (!oppId) {
      idToUse = window.location.pathname.split("/")[2];
    }

    const resData = await api({
      path: `opportunities?id=${idToUse}`,
    });

    if (
      resData[0].hiring_company_id !== userInfo.hiring_companies[0].id &&
      userInfo.user_type !== "INTERNAL"
    ) {
      navigate("/opportunity/dashboard");
    }
  };

  const HIRING_COMPANY_LANDING_PAGES = {
    "e664f55e-8821-42fc-9eba-6172f0a05c68": "/search",
  };

  const userRedirect = async (userInfo) => {
    const userType = userInfo.user_type;
    const redirectQuery = query.get("redirect");

    if (redirectQuery) {
      navigate(redirectQuery);
    } else {
      // for MWBE vanity urls
      if (id === window.location.pathname.slice(1)) {
        const result = await api({
          path: `mwbes?profile_url_path=${id}`,
        });

        if (result.length) {
          return;
        }
      }
      if (userType === "INTERNAL") {
        if (location.pathname === "/") {
          navigate(`/search`);
        }
        return;
      }
      const matchingPathname = userTypeToAllowedPathnames[userType].find(
        (pathname) => location.pathname.indexOf(pathname) > -1
      );
      if (!matchingPathname) {
        if (userType === "MWBE") {
          if (userInfo.mwbes.length) {
            navigate(vanityUrlOrId(userInfo.mwbes[0]));
          } else {
            navigate("/claim");
          }
        }
        if (isHiringCompany(userInfo)) {
          const hiringCompanyId = userInfo.hiring_companies[0].id;

          if (location.pathname.indexOf("opportunity") !== -1) {
            if (location.pathname.indexOf("edit") !== -1) {
              checkCurrentOpportunity(userInfo, id);
            } else {
              navigate("/opportunity/dashboard");
            }
          } else if (canViewImpactDashboards(userInfo)) {
            navigate("/impact-dashboards/all");
          } else if (HIRING_COMPANY_LANDING_PAGES[hiringCompanyId]) {
            navigate(HIRING_COMPANY_LANDING_PAGES[hiringCompanyId]);
          } else {
            navigate("/parent-project/all");
          }
        }
      } else if (userType === "MWBE") {
        if (!userInfo.mwbes.length) {
          navigate("/claim");
        } else if (
          location.pathname.indexOf("edit") !== -1 &&
          location.pathname.indexOf("opportunity") !== -1
        ) {
          navigate(`/opportunity/search`);
        } else if (!!userInfo.mwbes.length && location.pathname === "/claim") {
          navigate(vanityUrlOrId(userInfo.mwbes[0]));
        } else if (
          !!userInfo.mwbes.length &&
          location.pathname.indexOf("details") !== -1 &&
          location.pathname !== "/details"
        ) {
          const mwbeId = window.location.pathname.substring(
            window.location.pathname.lastIndexOf("/") + 1
          );
          if (mwbeId !== userInfo.mwbes[0].id) {
            navigate(`/details#account-info`);
          }
        }
      } else if (!isMwbeOrInternal(userInfo)) {
        if (
          location.pathname.indexOf("details") !== -1 &&
          location.pathname !== "/details"
        ) {
          navigate("/details");
        } else if (
          location.pathname.indexOf("edit") !== -1 &&
          location.pathname.indexOf("opportunity") !== -1
        ) {
          checkCurrentOpportunity(userInfo);
        }
      }
    }
  };

  const availableToPublic =
    location.pathname.indexOf("/community-engagement-dashboard") !== -1 ||
    location.pathname.indexOf("/forgot-password") !== -1 ||
    location.pathname.indexOf("/new-password") !== -1 ||
    location.pathname.indexOf("/request-login") !== -1 ||
    location.pathname.indexOf("/baltimore-peninsula") !== -1 ||
    location.pathname.indexOf("/profile") !== -1;

  useEffect(() => {
    getUser().then((data) => {
      setLoading(false);
      if (data) {
        window.scrollTo(0, 0);
        if (location.pathname.indexOf("/search") !== -1) {
          setLastDirectoryPage(`${location.pathname}${location.search}`);
        }
        userRedirect(data);
        Sentry.setUser({
          id: data.id,
          email: data.email,
          user_type: data.user_type,
        });
        if (data.user_type !== "INTERNAL") {
          recordPageView(data);
        }
        return null;
      }
      recordPageView();
    });
  }, [userToken, location]);

  useEffect(async () => {
    if (PENDO_KEY !== null && user) {
      (function (apiKey) {
        (function (p, e, n, d, o) {
          var v, w, x, y, z;
          o = p[d] = p[d] || {};
          o._q = o._q || [];
          v = ["initialize", "identify", "updateOptions", "pageLoad", "track"];
          for (w = 0, x = v.length; w < x; ++w)
            (function (m) {
              o[m] =
                o[m] ||
                function () {
                  o._q[m === v[0] ? "unshift" : "push"](
                    [m].concat([].slice.call(arguments, 0))
                  );
                };
            })(v[w]);
          y = e.createElement(n);
          y.async = !0;
          y.src = "https://cdn.pendo.io/agent/static/" + apiKey + "/pendo.js";
          z = e.getElementsByTagName(n)[0];
          z.parentNode.insertBefore(y, z);
        })(window, document, "script", "pendo");

        // This function creates visitors and accounts in Pendo
        const pendoVisitor = {
          admin: user.admin,
          email: user.email,
          first_name: user.first_name,
          id: user.id,
          last_name: user.last_name,
          user_type: user.user_type,
          full_name: user.last_name + " " + user.first_name,
        };
        pendo.initialize({
          visitor: pendoVisitor,
          account: {
            id: "<account-id-goes-here>", // Not sure what to put here
          },
        });
      })(PENDO_KEY);
    }
  }, [user]);

  if (pageLoading) {
    return <Loader />;
  }

  const isLoggedOut = !Cookies.get("login-token");

  if (!availableToPublic && isLoggedOut && location.pathname !== "/") {
    navigate("/");
  }

  return (
    <UserData.Provider
      value={{
        user,
        loading,
        setUserToken,
        lastDirectoryPage,
      }}
    >
      {children}
    </UserData.Provider>
  );
};

export default RedirectHandler;
