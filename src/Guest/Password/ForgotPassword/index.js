import { useContext, useState } from "react";
import { Button, Header, Body, TextLink } from "@sweeten/oreo";
import { css } from "aphrodite/no-important";
import { useForm, useField } from "react-final-form-hooks";
import { useNavigate } from "react-router-dom";
import { required } from "../../../validators";
import { AppDispatch } from "../../../app_provider";
import LoginImgSrc from "../../../../images/login-img.png";
import { API_URL } from "../../../shared";
import FormInputField from "../../../FormComponents/input";
import { sharedGuestSS } from "../../LoginComponents/shared";

const ForgotPassword = () => {
  const [isConfirmed, toggleIsConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const dispatch = useContext(AppDispatch);

  const { form, handleSubmit } = useForm({
    onSubmit: async (values) => {
      setLoading(true);

      const settings = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      fetch(
        `${API_URL}/forgot_password?email=${encodeURIComponent(values.email)}`,
        settings
      ).then((resp) => {
        if (!resp.ok) {
          dispatch({
            type: "alert:show",
            payload: {
              variant: "error",
              text: `Something went wrong. Please try again.`,
            },
          });
        } else {
          dispatch({
            type: "alert:show",
            payload: {
              variant: "success",
              text: `Reset email sent.`,
            },
          });
          toggleIsConfirmed(true);
        }
        setLoading(false);
      });
    },
  });

  const email = useField("email", form, required);

  return (
    <div style={{ display: "flex", height: "100%" }}>
      {!isConfirmed ? (
        <div className={css(sharedGuestSS.loginForm)}>
          <div className={css(sharedGuestSS.loginContainer)}>
            <Header tag="h3" style={{ marginBottom: 32 }}>
              Reset password
            </Header>
            <FormInputField
              error={email.meta.touched && email.meta.error}
              id="email"
              inputProps={{
                ...email.input,
                placeholder: "Email",
                "data-test": "email",
              }}
              label="Email"
            />
            <Button
              loading={loading}
              onClick={handleSubmit}
              aphStyle={sharedGuestSS.button}
            >
              Send reset link
            </Button>
            <div className={css(sharedGuestSS.horizontalLine)} />
            <div className={css(sharedGuestSS.footerText)}>
              If you're having any trouble resetting your password, contact our
              Support Team at{" "}
              <TextLink
                onClick={() => {
                  window.location = "mailto:support@sweetenenterprise.com";
                }}
              >
                support@sweetenenterprise.com
              </TextLink>
            </div>
          </div>
        </div>
      ) : (
        <div className={css(sharedGuestSS.loginForm)}>
          <div className={css(sharedGuestSS.loginContainer)}>
            <Header tag="h3" style={{ marginBottom: 32 }}>
              Check your email
            </Header>
            <Body
              tag="p"
              variant="large"
              style={{ fontWeight: 600, color: "#6c757d" }}
            >
              A verification email was sent to {email.input.value}. Follow the
              instructions to reset your password.
            </Body>
            <Button
              loading={loading}
              onClick={() => navigate("/")}
              aphStyle={sharedGuestSS.button}
            >
              I'm all done
            </Button>
            <div style={{ color: "#6c757d" }}>
              Didn't receive an email?{" "}
              <TextLink style={{ fontSize: 16 }} onClick={handleSubmit}>
                Click here
              </TextLink>{" "}
              to send it again.
            </div>
            <div className={css(sharedGuestSS.horizontalLine)} />
            <div className={css(sharedGuestSS.footerText)}>
              If you're having any trouble resetting your password, contact our
              Support Team at{" "}
              <TextLink
                onClick={() => {
                  window.location = "mailto:support@sweetenenterprise.com";
                }}
              >
                support@sweetenenterprise.com
              </TextLink>
            </div>
          </div>
        </div>
      )}
      <div className={css(sharedGuestSS.imageContainer)}>
        <img src={LoginImgSrc} className={css(sharedGuestSS.image)} />
      </div>
    </div>
  );
};

export default ForgotPassword;
