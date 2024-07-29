import { useContext, useState } from "react";
import { Button, Header, Body, TextLink } from "@sweeten/oreo";
import { css } from "aphrodite/no-important";
import { useForm, useField } from "react-final-form-hooks";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { required } from "../../validators";
import { AppDispatch } from "../../app_provider";
import LoginImgSrc from "../../../images/login-img.png";
import { API_URL } from "../../shared";
import FormInputField from "../../FormComponents/input";
import { sharedGuestSS } from "../LoginComponents/shared";

const RequestCredentials = () => {
  const [isConfirmed, toggleIsConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const dispatch = useContext(AppDispatch);

  const { form, handleSubmit } = useForm({
    onSubmit: async (values) => {
      setLoading(true);

      const settings = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      };
      fetch(
        `${API_URL}/users/create_from_mwbe_email?email=${values.email}`,
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
          resp.json().then((json) => {
            if (!json.success) {
              if (json.message === "user_exists") {
                dispatch({
                  type: "alert:show",
                  payload: {
                    variant: "error",
                    text: `User already exists.`,
                  },
                });
              } else {
                dispatch({
                  type: "alert:show",
                  payload: {
                    variant: "success",
                    text: `MWBE not found, please check your email.`,
                  },
                });
                toggleIsConfirmed(true);
              }
            } else {
              toggleIsConfirmed(true);
            }
          });
        }
        setLoading(false);
      });
    },
  });

  const email = useField("email", form, required);

  return (
    <div style={{ display: "flex", height: "100%" }}>
      <Helmet>
        <title>Request login details</title>
      </Helmet>
      {!isConfirmed ? (
        <div className={css(sharedGuestSS.loginForm)}>
          <div className={css(sharedGuestSS.loginContainer)}>
            <Header tag="h3" style={{ marginBottom: 32 }}>
              Request login details
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
              Submit
            </Button>
            <div className={css(sharedGuestSS.horizontalLine)} />
            <div className={css(sharedGuestSS.footerText)}>
              If you didn't receive an email with your details, please contact
              our Support Team at{" "}
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
              instructions to sign in to the platform.
            </Body>
            <Button
              loading={loading}
              onClick={() => navigate("/")}
              aphStyle={sharedGuestSS.button}
            >
              I'm all done
            </Button>
            <div className={css(sharedGuestSS.horizontalLine)} />
            <div className={css(sharedGuestSS.footerText)}>
              Didn't receive an email? Contact us directly at{" "}
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

export default RequestCredentials;
