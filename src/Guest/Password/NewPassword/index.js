import { useContext, useState } from "react";
import { Button, Header, Input, Body, Icon } from "@sweeten/oreo";
import { css } from "aphrodite/no-important";
import { useForm, useField } from "react-final-form-hooks";
import { useNavigate, useParams } from "react-router-dom";
import { required } from "../../../validators";
import { AppDispatch } from "../../../app_provider";
import LoginImgSrc from "../../../../images/login-img.png";
import { sharedSS } from "../../../CompanyDetails/shared";
import { hasNumbers, hasUppercase } from "../../../shared";
import { useAuth } from "../../../../hooks/useAuth";
import { sharedGuestSS } from "../../LoginComponents/shared";
import { api } from "../../../../utils/api";

const NewPassword = () => {
  const [showPassword, toggleShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [retypePasswordVal, setRetypeVal] = useState("");
  const navigate = useNavigate();
  const { tempLogin, getUser } = useAuth();
  const dispatch = useContext(AppDispatch);
  const { tempToken, redirect } = useParams();
  const { form, handleSubmit } = useForm({
    onSubmit: async (values) => {
      setLoading(true);
      const userToken = await tempLogin(tempToken);

      if (!userToken) {
        dispatch({
          type: "alert:show",
          payload: {
            variant: "error",
            text: "This link has expired. Please try again.",
          },
        });
        setLoading(false);
        return;
      }

      const minEightChars = values.newPassword.length >= 8;
      const hasUppercaseLetter = hasUppercase(values.newPassword);
      const hasNumber = hasNumbers(values.newPassword);

      if (!(minEightChars && hasUppercaseLetter && hasNumber)) {
        dispatch({
          type: "alert:show",
          payload: {
            variant: "error",
            text: `Please enter the correct password format`,
          },
        });
        setLoading(false);
        return;
      }

      const user = await getUser();

      if (user) {
        const resp = await api({
          path: `users/${user.id}`,
          method: "PATCH",
          body: { password: values.newPassword },
        });

        if (!resp) {
          dispatch({
            type: "alert:show",
            payload: {
              variant: "error",
              text: `Something went wrong. Please try again.`,
            },
          });
          setLoading(false);
        } else {
          dispatch({
            type: "alert:show",
            payload: {
              variant: "success",
              text: `Password successfully changed.`,
            },
          });
          navigate(redirect || "/");
        }
      }
    },
  });

  const newPassword = useField("newPassword", form, required);

  const minEightChars = newPassword.input.value.length >= 8;
  const hasUppercaseLetter = hasUppercase(newPassword.input.value);
  const hasNumber = hasNumbers(newPassword.input.value);

  return (
    <div style={{ display: "flex", height: "100%" }}>
      <div className={css(sharedGuestSS.loginForm)}>
        <div className={css(sharedGuestSS.loginContainer)}>
          <Header tag="h3" style={{ marginBottom: 32 }}>
            Create new password
          </Header>
          <Body tag="div" variant="large" aphStyle={sharedGuestSS.label}>
            New password
          </Body>
          <Input
            {...newPassword.input}
            error={newPassword.meta.touched && newPassword.meta.error}
            data-test="password"
            placeholder="Password"
            type={showPassword ? "text" : "password"}
            aphStyle={sharedGuestSS.input}
            afterElement={
              <div onClick={() => toggleShowPassword(!showPassword)}>
                <Icon name="preview" />
              </div>
            }
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
              retypePasswordVal !== newPassword.input.value &&
              "Please enter the same password"
            }
            afterElement={
              <div onClick={() => toggleShowPassword(!showPassword)}>
                <Icon name="preview" />
              </div>
            }
          />
          <Button
            loading={loading}
            onClick={handleSubmit}
            aphStyle={sharedGuestSS.button}
          >
            Confirm
          </Button>
        </div>
        <div className={css(sharedGuestSS.imageContainer)}>
          <img src={LoginImgSrc} className={css(sharedGuestSS.image)} />
        </div>
      </div>
    </div>
  );
};

export default NewPassword;
