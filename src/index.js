import ReactDOM from "react-dom";
import { useContext, useEffect } from "react";
import {
  BrowserRouter,
  Route,
  Outlet,
  useLocation,
} from "react-router-dom";
import { Helmet } from "react-helmet";
import loadable from "@loadable/component";

import { isMobile } from "./components/shared";
import "./index.css";
import "bootstrap/dist/css/bootstrap.css";
import "./vendor/muze_bootstrap/assets/css/theme.css";
import { getWindowWidth } from "./components/shared";
import { StyleSheet, css } from "aphrodite";
import { AppState } from "./components/app_provider";

const AppProvider = loadable(() => import("./components/app_provider"));
const LoginSignUp = loadable(() =>
  import("./components/Guest/LoginComponents")
);
const Navbar = loadable(() => import("./components/Navbar"));
const SideNav = loadable(() => import("./components/SideNav"));

const ForgotPassword = loadable(() =>
  import("./components/Guest/Password/ForgotPassword")
);
const NewPassword = loadable(() =>
  import("./components/Guest/Password/NewPassword")
);
const RedirectHandler = loadable(() => import("./components/redirect_handler"));

// Impact dashboard routes
const MyImpactDashboards = loadable(() =>
  import("./components/ImpactDashboards/index")
);
const ImpactDashboard = loadable(() =>
  import("./components/ImpactDashboards/Dashboard/index")
);
const DiversityCompanyDetails = loadable(() =>
  import("./components/ImpactDashboards/DiversityCompanyDetails/index")
);
const ImpactDashboardWrapper = loadable(() =>
  import("./components/ImpactDashboards/wrapper")
);

const TransparencyDashboard = loadable(() =>
  import("./components/TransparencyDashboard/index")
);

const ss = StyleSheet.create({
  noScrollbar: {
    overflow: "hidden",
  },
});

const WithNav = ({ loggedIn }) => {
  const windowWidth = getWindowWidth();
  const isDesktop = windowWidth > styles.breakpoints.tabletStandard;
  const { preventScroll } = useContext(AppState);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <RedirectHandler>
      <Navbar loggedIn={loggedIn} />
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
        }}
        className={css(preventScroll && ss.noScrollbar)}
      >
        {isDesktop && loggedIn && <SideNav />}
        <div
          style={{
            width: "100%",
            marginLeft: isDesktop && loggedIn ? 81 : null,
            height: "100%",
          }}
        >
          <Outlet />
        </div>
      </div>
    </RedirectHandler>
  );
};

const WithoutNav = () => {
  const { preventScroll } = useContext(AppState);
  return (
    <RedirectHandler>
      <div
        style={{ height: "100%" }}
        className={css(preventScroll && ss.noScrollbar)}
      >
        <Outlet />
      </div>
    </RedirectHandler>
  );
};

const WithImpactDashboardWrapper = () => {
  return (
    <ImpactDashboardWrapper>
      <Outlet />
    </ImpactDashboardWrapper>
  );
};

ReactDOM.render(
  <AppProvider>
    <Helmet>
      <meta
        name="viewport"
        content={`width=device-width, initial-scale=1${isMobile() ? ", maximum-scale=1" : ""
          }`}
      />
    </Helmet>
    <BrowserRouter>
        <Route element={<WithNav loggedIn={false} />}>
          <Route path="/" element={<LoginSignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/new-password/:tempToken" element={<NewPassword />}>
            <Route path=":redirect" element={<NewPassword />} />
            <Route path="" element={<NewPassword />} />
          </Route>
        </Route>
        <Route element={<WithNav loggedIn />}>
          <Route
            path="/impact-dashboards/all"
            element={<MyImpactDashboards />}
          />
          <Route element={<WithImpactDashboardWrapper />}>
            <Route
              path="/impact-dashboards/:id/home"
              element={<ImpactDashboard />}
            />
            <Route
              path="/impact-dashboards/:id/diversity-company/:certGroup"
              element={<DiversityCompanyDetails />}
            />
          </Route>
        </Route>
        <Route element={<WithoutNav />}>
          <Route
            path="/community-engagement-dashboard/projects/:id"
            element={<TransparencyDashboard />}
          />
        </Route>
    </BrowserRouter>
  </AppProvider>,
  document.getElementById("root")
);
