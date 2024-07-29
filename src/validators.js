import { compact, toNumber } from "lodash";
import { parse } from "date-fns";
import { api } from "../utils/api";

// Accepted size is in MBs.
export const isAcceptedFileSize = (fileSize, acceptedSize) =>
  fileSize / 1024 / 1024 <= acceptedSize;

export const acceptedFileTypes = `image/*, text/*, application/pdf,
application/msword, application/x-ole-storage,
application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,
application/vnd.openxmlformats-officedocument.wordprocessingml.document,
application/vnd.ms-excel, application/octet-stream, text/csv`;

export const isValidUrl = (url) => {
  // eslint-disable-next-line max-len
  const regex =
    /[(http(s)?)://(www.)?a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/gi;
  return regex.test(url);
};

export const isValidEmail = (email) => {
  // REGEX SOURCE: https://emailregex.com/
  // eslint-disable-next-line max-len
  const regex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(email);
};

export const required = (val) => {
  if (val === false) {
    return "";
  }
  return !val && "You must complete this field";
};
export const email = (val) => val && !isValidEmail(val) && "Email is invalid";

// Modified version of http://regexlib.com/REDetails.aspx?regexp_id=130 (no dollar sign)
export const currency = (val) => {
  const regex = /^([0-9]{1,3},([0-9]{3},)*[0-9]{3}|[0-9]+)(\.[0-9][0-9])?$/;

  return val && !regex.test(val) && "Please enter a valid amount";
};

export const greaterThanZero = (val) => {
  if (val) {
    const cleanedNum = toNumber(val.replace(",", ""));

    if (cleanedNum === 0) {
      return "Please enter a value greater than zero";
    }

    return !cleanedNum && "Please enter a valid amount";
  }

  return false;
};

export const lastFourSsn = (val) => {
  const regex = /^\d{4}$/;
  return val && !regex.test(val) && "SSN is invalid";
};

export const ssn = (val) => {
  const regex = /^\d{3}-\d{2}-\d{4}$/;

  return (
    val &&
    !regex.test(val) &&
    "Please enter your Social Security number with dashes: NNN-NN-NNNN"
  );
};

// Regex to allow only 9 digit zip code with or without dashes
// Matches	32225-1234, 32225, 322251234
export const postalCode = (val) => {
  const regex = /(^\d{5}$)|(^\d{9}$)|(^\d{5}-\d{4}$)/;
  return val && !regex.test(val) && "Postal code is invalid";
};

// based on input type="date" format, which is yyyy-mm-dd
export const date = (val) => {
  const regex = /^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/;
  return val && !regex.test(val) && "Date is invalid";
};

export const futureDate = (val) => {
  const dateResult = date(val);
  if (dateResult) {
    return dateResult;
  }
  const parsed = parse(val, "MM/dd/YYYY");
  return (
    (parsed.valueOf() < new Date() || val.length !== 4) &&
    "Please choose a valid future year"
  );
};

export const pastOrCurrentYear = (val) =>
  val &&
  (Number(val) > new Date().getFullYear() || val.length !== 4) &&
  "Please enter a valid previous year";

export const state = (val) => {
  const regex = /^[A-Z]{2}$/;
  return (
    val &&
    !regex.test(val) &&
    "State is invalid. Please enter a capitalized 2-letter abbreviation"
  );
};

export const url = (val) => val && !isValidUrl(val) && "URL is invalid";

// Miniumum 12 length, uppercase + symbol + number
// eslint-disable-next-line no-useless-escape
export const STRONG_PASSWORD_REGEX =
  /^(?=.{12,})(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])/;

export const securePassword = (val) =>
  val &&
  !STRONG_PASSWORD_REGEX.test(val) &&
  // eslint-disable-next-line max-len
  "Password does not meet requirements";

export const password = (val) =>
  val && val.length < 8 && "Password is too short (minimum is 8 characters)";

export const test = (val, validator, errMsg = "The field is invalid") =>
  val && !validator(val) && errMsg;

/**
 * Validate the validators asynchronously.
 * Example:
 * (val) => {
  const validators = [required, emailValidator];
  return validate(validators, val);
});
 * @param {Array} validators Array of functions to execute
 * @param {String} val User input value
 * @returns {String} The first error message.
 */
export const validate = (validators, val) => {
  const errors = validators.reduce((err, func) => {
    err.push(func(val));
    return err;
  }, []);

  return compact(errors)[0];
};

/**
 * Validate the validators synchronously.
 * You should only need to call this when one or more of the validators
 * need to fetch for remote data, like checking if an email is taken as an example.
 * Example:
 * value => {
    const isTakenProm = new Promise(resolve =>
      resolve(emailTaken(value, client))
    );
    const validators = [
      Promise.resolve(required(value)),
      Promise.resolve(emailValidator(value)),
      isTakenProm,
    ];
    return validateSync(validators, value);
  });
 * @param {Array} validators Array of promises
 * @returns {String} The first resolved error message.
 */
export const validateSync = async (validators) => {
  const errors = await Promise.all(validators);

  return compact(errors)[0];
};

/**
 * Checks format validity
 * Takes an email string as "value" and an instance of GraphQL client as arguments
 */
export const validateEmail = (value) => {
  const errors = validate([required, email], value);

  return errors;
};

export const isValidName = (name) => {
  // Allow blank names; use required validator if the field is required
  if (!name) {
    return true;
  }

  // Allows everything except @
  // "howard@sweeten" is not valid but "howard" is
  const regex = /@/gm;
  return !regex.test(name);
};
export const name = (val) => !isValidName(val) && "Please enter a valid name";

export const phoneNumber = (val) => {
  const regex = /^((\+\s?)?1[-\s]?)?\(?\d{3}\)?[-\s]?\d{3}[-\s]?\d{4}$/;

  if (val && !regex.test(val)) {
    return "Phone number is invalid";
  }

  return false;
};

export const isValidFedTaxId = (val) => {
  const regex = /^\d{2}-?\d{7}$/;

  return (
    val && !regex.test(val) && "Please enter a valid federal/tax ID: NN-NNNNNNN"
  );
};

export const isValidDUNS = (val) => {
  const regex = /^\d{2}-?\d{3}-?\d{4}$/;

  return (
    val && !regex.test(val) && "Please enter a valid DUNS number: NN-NNN-NNNN"
  );
};

export const isTwitterFormat = (val) => {
  const regex = /^\@.*$/;

  return val && !regex.test(val) && "Please use the format: @username";
};

export const isValidCustomUrl = async (newVal, currentVal) => {
  const regex = /^[aA-zZ0-9-]+$/;

  if (!regex.test(newVal)) {
    return "Please use only letters, numbers and hyphens";
  }

  if (newVal !== currentVal) {
    const resData = await api({
      path: `mwbes?profile_url_path=${newVal}`,
    });

    if (resData.length) {
      return "This URL has already been taken";
    }
  }

  return null;
};
