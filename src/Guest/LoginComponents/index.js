import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { css } from "aphrodite/no-important";
import Cookies from "js-cookie";
import { useAuth } from "../../../hooks/useAuth";
import { Helmet } from "react-helmet";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import LoginImgSrc from "../../../images/login-img.png";
import { sharedGuestSS } from "./shared";
import Loader from "../../loader";
import { vanityUrlOrId } from "../../shared";

const LoginSignup = () => {
  const { getUser, loading } = useAuth();
  const navigate = useNavigate();

  const [isLogin, toggleIsLogin] = useState(true);

  useEffect(() => {
    const token = Cookies.get("login-token");
    if (token) {
      getUser().then((data) => {
        if (data) {
          if (data.user_type === "MWBE") {
            if (data.user_type === "MWBE" && data.mwbes.length) {
              navigate(vanityUrlOrId(data.mwbes[0]));
            }
            if (data.user_type === "MWBE" && !data.mwbes.length) {
              navigate(`/claim`);
            }
          } else {
            navigate(`/parent-project/all`);
          }
        }
      });
    }
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div style={{ display: "flex", height: "100%" }}>
      <Helmet>
        <title>Sweeten Enterprise | Supplier Diversity Software</title>
        <meta
          name="description"
          content="Achieve, track and communicate your diversity and MWBE hiring goals with Sweeten Enterprise, the most advanced and easy to use supplier diversity software."
        />
      </Helmet>
      {isLogin ? (
        <LoginForm toggleIsLogin={toggleIsLogin} />
      ) : (
        <SignupForm toggleIsLogin={toggleIsLogin} />
      )}
      <div className={css(sharedGuestSS.imageContainer)}>
        <img src={LoginImgSrc} className={css(sharedGuestSS.image)} />
      </div>
    </div>
  );
};

export default LoginSignup;
