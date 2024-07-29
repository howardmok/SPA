import { useState } from "react";
import { Button, Header, Input, Body, Icon, TextLink } from "@sweeten/oreo";
import { css } from "aphrodite/no-important";
import { useForm, useField } from "react-final-form-hooks";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { Row } from "react-bootstrap";
import { useAuth } from "../../../../hooks/useAuth";
import { required } from "../../../validators";
import {
  API_URL,
  callFunctionOnEnter,
  hasNumbers,
  hasUppercase,
  removeWhitespace,
} from "../../../shared";
import FormInputField from "../../../FormComponents/input";
import { sharedSS } from "../../../CompanyDetails/shared";
import { sharedGuestSS } from "../shared";

const SignupForm = ({ toggleIsLogin }) => {
  const [showPassword, toggleShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [retypePasswordVal, setRetypeVal] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const { form, handleSubmit } = useForm({
    onSubmit: async (values) => {
      setLoading(true);

      const settings = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: values.email,
          user_type: values.isPrime ? "PRIME" : "MWBE",
          first_name: values.firstName,
          last_name: values.lastName,
          password: values.password,
        }),
      };

      await fetch(`${API_URL}/users/`, settings);

      const userToken = await login(values.email, values.password);

      setLoading(false);

      Cookies.set("login-token", userToken);

      navigate(`/search`);
    },
  });

  const firstName = useField("firstName", form, required);
  const lastName = useField("lastName", form, required);
  const email = useField("email", form, required);
  const password = useField("password", form, required);
  // const isPrimeContractor = useField("isPrime", form);

  const minEightChars = password.input.value.length >= 8;
  const hasUppercaseLetter = hasUppercase(password.input.value);
  const hasNumber = hasNumbers(password.input.value);

  return (
    <div className={css(sharedGuestSS.loginForm)}>
      <div className={css(sharedGuestSS.loginContainer)}>
        <Header tag="h3" style={{ marginBottom: 32 }}>
          Create account
        </Header>
        <Row>
          <FormInputField
            error={firstName.meta.touched && firstName.meta.error}
            id="firstName"
            inputProps={{
              ...firstName.input,
              placeholder: "First name",
              "data-test": "first-name",
              onKeyPress: (e) => callFunctionOnEnter(e, handleSubmit),
            }}
            label="First name"
            halfWidth
          />
          <FormInputField
            error={lastName.meta.touched && lastName.meta.error}
            id="lastName"
            inputProps={{
              ...lastName.input,
              placeholder: "Last name",
              "data-test": "last-name",
              onKeyPress: (e) => callFunctionOnEnter(e, handleSubmit),
            }}
            label="Last name"
            halfWidth
          />
        </Row>
        <div className={css(sharedGuestSS.label)}>
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
        </div>
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
        <div style={{ color: "#495057", fontSize: 13, marginTop: 16 }}>
          <div className={css(sharedSS.flexCentered)}>
            {minEightChars ? (
              <Icon name="checkmark" size={16} />
            ) : (
              <Icon name="close" size={16} />
            )}
            Minimum 8 characters long
          </div>
          <div className={css(sharedSS.flexCentered)}>
            {hasUppercaseLetter ? (
              <Icon name="checkmark" size={16} />
            ) : (
              <Icon name="close" size={16} />
            )}
            One uppercase letter
          </div>
          <div className={css(sharedSS.flexCentered)}>
            {hasNumber ? (
              <Icon name="checkmark" size={16} />
            ) : (
              <Icon name="close" size={16} />
            )}
            At least one number
          </div>
        </div>
        <Body tag="div" variant="large" aphStyle={sharedGuestSS.label}>
          Confirm password
        </Body>
        <Input
          onChange={(val) => setRetypeVal(val)}
          placeholder="Password"
          data-test="confirm-password"
          type={showPassword ? "text" : "password"}
          aphStyle={sharedGuestSS.input}
          error={
            retypePasswordVal !== password.input.value &&
            "Please enter the same password"
          }
          afterElement={
            <div onClick={() => toggleShowPassword(!showPassword)}>
              <Icon name="preview" />
            </div>
          }
          onKeyPress={(e) => callFunctionOnEnter(e, handleSubmit)}
        />
        {/* <div
          onClick={() => isPrimeContractor.input.onChange(!isPrimeContractor.input.value)}
          className={css(ss.center, retypePasswordVal !== password.input.value && ss.marginTop)}
          style={{}}
        >
          <Checkbox {...isPrimeContractor.input} style={{ display: "inline-flex" }} />
          I am a prime contractor
        </div> */}
        <Button
          loading={loading}
          onClick={handleSubmit}
          aphStyle={sharedGuestSS.button}
        >
          Sign up
        </Button>
        <div>
          Already have an account?
          <TextLink
            onClick={() => toggleIsLogin(true)}
            style={{ fontSize: 16, marginLeft: 4 }}
          >
            Login.
          </TextLink>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
