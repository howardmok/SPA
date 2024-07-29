import { useContext, useState } from "react";
import { Button, Header, Input, Body, Icon } from "@sweeten/oreo";
import { css } from "aphrodite/no-important";
import { useForm, useField } from "react-final-form-hooks";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useAuth } from "../../../../hooks/useAuth";
import { required } from "../../../validators";
import { AppDispatch } from "../../../app_provider";
import FormInputField from "../../../FormComponents/input";
import { sharedGuestSS } from "../shared";
import {
  callFunctionOnEnter,
  canViewImpactDashboards,
  removeWhitespace,
  vanityUrlOrId,
} from "../../../shared";
import lockImg from "../../../../images/lock.svg";

const LoginForm = ({ toggleIsLogin }) => {
  const [showPassword, toggleShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, getUser } = useAuth();
  const navigate = useNavigate();

  const dispatch = useContext(AppDispatch);

  const { form, handleSubmit } = useForm({
    onSubmit: async (values) => {
      setLoading(true);
      const userToken = await login(values.email, values.password);

      setLoading(false);

      if (!userToken) {
        dispatch({
          type: "alert:show",
          payload: {
            variant: "error",
            text: `Incorrect user or password`,
          },
        });
        return;
      }

      Cookies.set("login-token", userToken);

      getUser().then((data) => {
        if (data.user_type === "MWBE") {
          if (data.mwbes.length) {
            navigate(vanityUrlOrId(data.mwbes[0]));
          } else {
            navigate(`/claim`);
          }
        } else if (canViewImpactDashboards(data)) {
          navigate(`/impact-dashboards/all`);
        } else {
          navigate("parent-project/all");
        }
      });
    },
  });

  const email = useField("email", form, required);
  const password = useField("password", form, required);

  return (
    <div className={css(sharedGuestSS.loginForm)}>
      <div className={css(sharedGuestSS.loginContainer)}>
        <Header tag="h3" data-test="login-header" style={{ marginBottom: 32 }}>
          Welcome back
        </Header>
        <FormInputField
          error={email.meta.touched && email.meta.error}
          id="email"
          inputProps={{
            ...email.input,
            placeholder: "Email",
            "data-test": "email",
            onChange: (e) => {
              const newStr = removeWhitespace(e.target.value);
              email.input.onChange(newStr);
            },
            onKeyPress: (e) => callFunctionOnEnter(e, handleSubmit),
          }}
          label="Email"
        />
        <Body tag="div" variant="large" aphStyle={sharedGuestSS.label}>
          Password
        </Body>
        <Input
          {...password.input}
          data-test="password"
          placeholder="Password"
          type={showPassword ? "text" : "password"}
          aphStyle={sharedGuestSS.input}
          afterElement={
            <div onClick={() => toggleShowPassword(!showPassword)}>
              <Icon name="preview" />
            </div>
          }
          onKeyPress={(e) => callFunctionOnEnter(e, handleSubmit)}
        />
        <Button
          loading={loading}
          onClick={handleSubmit}
          aphStyle={sharedGuestSS.button}
        >
          Login
        </Button>
        <Button
          loading={loading}
          onClick={() => navigate("/sso")}
          aphStyle={sharedGuestSS.ssoButton}
          variant="outlineDark"
        >
          <img src={lockImg} style={{ margin: "auto" }} /> Sign in with SSO
        </Button>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {/* <div>
            Don't have an account?
            <TextLink
              onClick={() => toggleIsLogin(false)}
              style={{ fontSize: 15, marginLeft: 4 }}
            >
              Sign up here.
            </TextLink>
          </div> */}
          <Link to="/forgot-password">Forgot password?</Link>
        </div>
        <div style={{ marginTop: 8 }}>
          Is your company already certified?{" "}
          <Link to="/request-login">Request your login details here.</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
