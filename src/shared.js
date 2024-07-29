/* eslint-disable react-hooks/rules-of-hooks */
import { useState, useLayoutEffect, useMemo } from "react";
import { format, parseISO, isToday } from "date-fns";
import { useLocation, useParams } from "react-router-dom";

export const envBaltPeninsulaId = "990bf000-9692-432d-9563-40c919e8f05a";

export const scrollToTop = () => window.scrollTo(0, 0);

export const addCommas = (num) => {
  if (num === undefined || num === null) {
    return "";
  }
  // Removes commas before re-adding them
  let unformattedNum = num.toString().replaceAll(",", "");
  // Remove any non-number characters
  unformattedNum = unformattedNum.replace(/\D/g, "");

  return unformattedNum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const callFunctionOnEnter = (evt, func) => {
  if (evt.charCode === 13) {
    func(evt);
  }
};

export const popularNAICS = [
  {
    category: "Construction",
    categoryNAICS: "23",
    count: 1256,
    minorNAICS: [
      {
        NAICS: "238990",
        description: "All Other Specialty Trade Contractors",
        count: 112,
      },
      {
        NAICS: "238910",
        description: "Site Preparation Contractors",
        count: 89,
      },
      {
        NAICS: "238310",
        description: "Drywall and Insulation Contractors",
        count: 83,
      },
      {
        NAICS: "238320",
        description: "Painting and Wall Covering Contractors",
        count: 83,
      },
      {
        NAICS: "238110",
        description: "Poured Concrete Foundation and Structure Contractors",
        count: 75,
      },
      {
        NAICS: "238210",
        description:
          "Electrical Contractors and Other Wiring Installation Contractors",
        count: 74,
      },
    ],
  },
  {
    category: "Professional, Scientific, and Technical Services",
    categoryNAICS: "54",
    count: 1209,
    minorNAICS: [
      {
        NAICS: "541611",
        description:
          "Administrative Management and General Management Consulting Services",
        count: 129,
      },
      {
        NAICS: "541330",
        description: "Engineering Services",
        count: 128,
      },
      {
        NAICS: "541512",
        description: "Computer Systems Design Services",
        count: 86,
      },
      {
        NAICS: "541511",
        description: "Custom Computer Programming Services",
        count: 68,
      },
      {
        NAICS: "541613",
        description: "Marketing Consulting Services",
        count: 56,
      },
      {
        NAICS: "541430",
        description: "Graphic Design Services",
        count: 48,
      },
    ],
  },
  {
    category:
      "Administrative and Support and Waste Management and Remediation Services",
    categoryNAICS: "56",
    count: 435,
    minorNAICS: [
      {
        NAICS: "561720",
        description: "Janitorial Services",
        count: 79,
      },
      {
        NAICS: "561320",
        description: "Temporary Help Services",
        count: 56,
      },
      {
        NAICS: "561730",
        description: "Landscaping Services",
        count: 52,
      },
      {
        NAICS: "562910",
        description: "Remediation Services",
        count: 30,
      },
      {
        NAICS: "561110",
        description: "Office Administrative Services",
        count: 23,
      },
      {
        NAICS: "561790",
        description: "Other Services to Buildings and Dwellings",
        count: 21,
      },
    ],
  },
];

export const instagramUrl = (handle) => {
  const instaName = handle.slice(1);
  return `https://instagram.com/${instaName}`;
};

export const twitterUrl = (handle) => {
  const twitterName = handle.slice(1);
  return `https://twitter.com/${twitterName}`;
};

export const dateToSlashes = (date) => {
  const splitDate = date.split("-");

  return `${splitDate[1]}/${splitDate[2]}/${splitDate[0]}`;
};

export const parsePhoneNumberParts = (input) => {
  const stripped = input.replace(/\D/g, "");
  //                             pfix areaCode        firstThree lastFour
  const matches =
    stripped.match(/(1)?([2-9]\d{0,2})?(\d{1,3})?(\d{1,4})?/) || [];
  return matches.slice(1);
};

export const formatPhoneNumber = (phone) => {
  if (!phone) {
    return "";
  }

  const [prefix, areaCode, firstThree, lastFour] = parsePhoneNumberParts(phone);

  let formatted = "";

  if (prefix) {
    formatted = prefix;
  }
  if (areaCode) {
    formatted += ` (${areaCode}`;
    if (firstThree) {
      formatted += `) ${firstThree}`;
      if (lastFour) {
        formatted += `-${lastFour}`;
      }
    }
  }
  return formatted.trim();
};

export const parseEINParts = (input) => {
  const stripped = input.replace(/\D/g, "");
  const matches = stripped.match(/([0-9]\d{0,1})?(\d{0,7})/) || [];
  return matches.slice(1);
};

export const formatEIN = (ein) => {
  if (!ein) {
    return "";
  }

  const [firstTwo, lastSeven] = parseEINParts(ein);

  let formatted = "";

  if (firstTwo) {
    formatted += `${firstTwo}`;
    if (lastSeven) {
      formatted += `-${lastSeven}`;
    }
  }
  return formatted.trim();
};

export const parseDUNSParts = (input) => {
  const stripped = input.replace(/\D/g, "");
  const matches = stripped.match(/([0-9]\d{0,1})?(\d{1,3})?(\d{1,4})?/) || [];
  return matches.slice(1);
};

export const formatDUNS = (duns) => {
  if (!duns) {
    return "";
  }

  const [firstTwo, secondThree, lastFour] = parseDUNSParts(duns);

  let formatted = "";

  if (firstTwo) {
    formatted += ` ${firstTwo}`;
    if (secondThree) {
      formatted += `-${secondThree}`;
      if (lastFour) {
        formatted += `-${lastFour}`;
      }
    }
  }
  return formatted.trim();
};

export const formatToCurrency = (
  input,
  options = { returnNA: false, returnDash: false, numDecimals: 2 }
) => {
  if (!input) {
    if (options.returnNA) {
      return "N/A";
    }
    if (options.returnDash) {
      return "-";
    }
    return "$0";
  }
  const num = Number(input);
  const currency = `$${num
    .toFixed(options.numDecimals)
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}`;

  return currency.replace(/\.00$/, "");
};

export const formatToMillionCurrency = (
  input,
  options = { returnNA: false, returnDash: false, numDecimals: 2 }
) => {
  if (!input) {
    if (options.returnNA) {
      return "N/A";
    }
    if (options.returnDash) {
      return "-";
    }
    return "$0";
  }
  const num = Number(input);
  if (num < 1000000) {
    return `$0.${(num / 1000000).toFixed(1).split(".")[1]} M`;
  }
  const currency = `$${(num / 1000000).toFixed(1)} M`;
  return currency.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
};

export const numberOnChange = (field, val, fromFormApi = false) => {
  const newVal = val.replace(/\D/g, "");
  if (newVal !== "0") {
    if (fromFormApi) {
      field.change(formatToCurrency(newVal));
    } else {
      field.input.onChange({
        target: {
          value: newVal,
        },
      });
    }
  }
};

const formatNumber = (n) => {
  // format number 1000000 to 1,234,567
  return n.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const currencyOnChangeWithCents = ({
  field,
  input,
  fromFormApi = false,
  allowNegative = false,
}) => {
  let input_val = input;

  let hasNegative = false;

  if (allowNegative && input_val[0] === "-") {
    input_val = input_val.substring(1);
    hasNegative = true;
  }

  if (input_val === "" || input_val === "$" || input_val === "-") {
    input_val = "";
  } else {
    if (input_val.indexOf("0") === 1 && input_val.indexOf(".") !== 2) {
      input_val = `$${input_val.substring(2)}`;
    }
    if (input_val.indexOf(".") >= 0) {
      const decimal_pos = input_val.indexOf(".");

      let left_side = input_val.substring(0, decimal_pos);
      let right_side = input_val.substring(decimal_pos);

      left_side = formatNumber(left_side);

      right_side = formatNumber(right_side);

      right_side = right_side.substring(0, 2);

      input_val = `$${left_side}.${right_side}`;
    } else {
      input_val = formatNumber(input_val);
      input_val = `$${input_val}`;
    }
  }

  if (hasNegative) {
    input_val = "-" + input_val;
  }

  if (fromFormApi) {
    field.change(input_val);
  } else {
    field.input.onChange({
      target: {
        value: input_val,
      },
    });
  }
};

export const currencyOnChange = (field, val, fromFormApi = false) => {
  const newVal = val.replace(/\D/g, "");
  if (newVal !== "0") {
    if (fromFormApi) {
      field.change(formatToCurrency(newVal));
    } else {
      field.input.onChange({
        target: {
          value: formatToCurrency(newVal),
        },
      });
    }
  }
};

export const percOnChange = (field, val) => {
  const newVal = val.replace(/\D/g, "");
  if (newVal !== "0" && Number(newVal) <= 100) {
    field.input.onChange({
      target: {
        value: newVal,
      },
    });
  }
};

export const decimalOnChange = (field, val) => {
  const newVal = val.replace(/[^0-9.]/g, "");
  if (newVal !== "0") {
    field.input.onChange({
      target: {
        value: newVal,
      },
    });
  }
};

export const offsetDateTime = (date) => {
  const offset = date.getTimezoneOffset();

  return new Date(date.getTime() - offset * 60000);
};

export const dateOrTimeToday = (date) => {
  const offsetDate = offsetDateTime(date);
  let dateFormat;

  if (isToday(offsetDate)) {
    dateFormat = "h:mm a";
  } else {
    dateFormat = "M/d/yy";
  }

  return format(offsetDate, dateFormat);
};

export const formatDateMMDDYYYY = (
  dateStr,
  options = {
    timeZoneOffset: false,
    formatTime: false,
    time: null,
    timeZone: null,
  }
) => {
  if (!dateStr) {
    return null;
  }
  if (options.formatTime) {
    const hasTime = options ? options.time : false;
    if (hasTime) {
      const revisedDateStr = new Date(`${dateStr}T${options.time}:00`);
      const dateStrWithTz = new Date(
        revisedDateStr.toLocaleString("en-US", {
          timeZone: options.timezone,
        })
      ).toISOString();
      return format(parseISO(dateStrWithTz), "Pp");
    }
    return format(parseISO(dateStr), "Pp");
  }
  const parsedDateFromTimestamp = dateStr.split("T");
  const parsedDateStr = parsedDateFromTimestamp[0].split("-");
  let date = new Date(parsedDateStr[0], parsedDateStr[1] - 1, parsedDateStr[2]);

  if (options.timeZoneOffset) {
    const offset = date.getTimezoneOffset();
    date = new Date(date.getTime() + offset * 60000);
  }

  return format(date, "MM/dd/yyyy");
};

export const formatDateYYYYMMDD = (date) => format(date, "yyyy-MM-dd");

export const removeSpecialCharsAndSpaces = (str) => {
  if (typeof str !== "string") return str;
  return str && str.replace(/[\W_]+/g, "");
};

export const hasUppercase = (string) => string.toLowerCase() !== string;

export const hasNumbers = (string) => /\d/.test(string);

export const determineIsExpired = (expDate) => {
  if (!expDate) {
    return false;
  }

  const expiresOn = new Date(expDate);
  const today = new Date();

  return expiresOn.getTime() < today.getTime();
};

/**
 * Calculates the current width of the browser window using React's useLayoutEffect hook.
 */
export const getWindowWidth = () => {
  const [size, setSize] = useState(0);
  useLayoutEffect(() => {
    const updateSize = () => {
      setSize(window.innerWidth);
    };
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);
  return size;
};

/**
 * Updates the window location with the specified string.
 * @param {String} location The new url you want the user to go to.
 * @param {object} options - Extra options to configure while opening a new page
 * @param {boolean} [options.shouldOpenNewTab=false] - Whether to open the page on a new tab
 */
/* eslint-disable no-lonely-if */
export const goToPage = (
  location = window.location,
  options = { shouldOpenNewTab: false }
) => {
  if (options.shouldOpenNewTab) {
    const didOpenNewTab = window.open(location, "_blank");
    if (!didOpenNewTab) {
      Object.assign(window, { location });
    }
  } else {
    Object.assign(window, { location });
  }
};

export const useQuery = () => {
  const { search } = useLocation();

  return useMemo(() => new URLSearchParams(search), [search]);
};

export const toTitleCase = (str) =>
  str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );

export const commodityCodeStr = (code) =>
  `${code.code} - ${toTitleCase(
    code.description ? code.description : code.name
  )}`;

export const getMwbeId = (user) => {
  const { id } = useParams();

  if (!user) {
    return;
  }

  if (id) {
    return id;
  }

  if (!user.mwbes.length) {
    return;
  }

  return user.mwbes.length ? user.mwbes[0].id : null;
};

export const getHiringCompanyId = ({ user, fromId }) => {
  const { id } = useParams();

  if (!user) {
    return;
  }

  if (fromId && id) {
    return id;
  }

  if (!user.hiring_companies.length) {
    return;
  }

  return user.hiring_companies.length ? user.hiring_companies[0].id : null;
};

export const isVowel = (letter) => {
  const lowercaseLetter = letter.toLowerCase();
  return (
    lowercaseLetter === "a" ||
    lowercaseLetter === "e" ||
    lowercaseLetter === "i" ||
    lowercaseLetter === "o" ||
    lowercaseLetter === "u"
  );
};

export const getDayDifference = (
  futureDate = new Date().toISOString().slice(0, 10),
  pastDate = new Date().toISOString().slice(0, 10)
) => (new Date(futureDate) - new Date(pastDate)) / 864e5 || 0;

export const getFileAttributes = (file) => {
  const fileName = file.display_name;
  const fileType = fileName.split(".")[1];
  return { fileName, fileType };
};

export const addHttp = (url) =>
  url.replace(/^(?:(.*:)?\/\/)?(.*)/i, (match, schemma, nonSchemmaUrl) =>
    schemma ? match : `http://${nonSchemmaUrl}`
  );

export const isMobile = () => window.navigator.userAgent.match(/Mobile/);

export const canViewLockedData = (user, id) => {
  let canView = false;
  if (!user) {
    return false;
  }
  if (user.mwbes.find((mwbe) => mwbe.id === id)) {
    return true;
  }
  user.roles.forEach((role) => {
    role.permissions.forEach((permission) => {
      if (permission.name === "view_locked_data") {
        canView = true;
      }
    });
  });
  return canView;
};

export const isMwbeOrInternal = (user) =>
  user ? user.user_type === "MWBE" || user.user_type === "INTERNAL" : false;

export const isHiringCompany = (user) =>
  user
    ? user.user_type === "PRIME" ||
      user.user_type === "DEVELOPER" ||
      user.user_type === "GOVERNMENT_AGENCY" ||
      user.user_type === "INTERNAL"
    : false;

export const canViewImpactDashboards = (user) =>
  user.can_create_impact_dashboard || user.impact_dashboard_users.length;

export const isValidUUID = (id) =>
  id.match(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  );

export const numberOrDash = (num) => (num && num !== "" ? num : "-");

export const acceptedFilesAttr =
  "image/*,.pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";

export const vanityUrlOrId = (mwbe, options) => {
  if (options) {
    if (options.useMwbeCoreId) {
      return `/profile/${mwbe.mwbe_core_id}`;
    }
  }
  if (mwbe.profile_url_path) {
    return `/${mwbe.profile_url_path}`;
  }

  return `/profile/${mwbe.id}`;
};

/**
 * Calculates the difference between two dates. Accounts for DST, as it uses UTC.
 * @param {Date} date1 - first date to compare
 * @param {Date} date2 - second date to compare
 * @param {String} measurement - measurement of time to return in;
 * either ms, seconds, minutes, hours or days. Default is in milliseconds
 */
export const calculateDateDiff = (date1, date2, measurement = "ms") => {
  let millisecondConversion = 1;
  switch (measurement) {
    case "seconds":
      millisecondConversion = 1000;
      break;
    case "minutes":
      millisecondConversion = 1000 * 60;
      break;
    case "hours":
      millisecondConversion = 1000 * 60 * 60;
      break;
    case "days":
      millisecondConversion = 1000 * 60 * 60 * 24;
      break;
    default:
      break;
  }

  const utc1 = Date.UTC(
    date1.getFullYear(),
    date1.getMonth(),
    date1.getDate(),
    date1.getHours(),
    date1.getMinutes(),
    date1.getSeconds(),
    date1.getMilliseconds()
  );
  const utc2 = Date.UTC(
    date2.getFullYear(),
    date2.getMonth(),
    date2.getDate(),
    date2.getHours(),
    date2.getMinutes(),
    date2.getSeconds(),
    date2.getMilliseconds()
  );

  return Math.floor((utc2 - utc1) / millisecondConversion);
};

/**
 * Calculates the difference between the time given and the current time.
 * Returns a string. Accounts for DST, as it uses UTC.
 * @param {Date} timeToCompare - date to compare to present
 */
export const calculateTimeAgo = (timeToCompare) => {
  const minuteDiff = calculateDateDiff(
    new Date(timeToCompare),
    new Date(),
    "minutes"
  );
  const hrDiff = calculateDateDiff(
    new Date(timeToCompare),
    new Date(),
    "hours"
  );
  const dayDiff = calculateDateDiff(
    new Date(timeToCompare),
    new Date(),
    "days"
  );

  let timeAgoStr;
  if (dayDiff >= 1) {
    timeAgoStr = `${dayDiff} days ago`;
  } else if (hrDiff >= 1) {
    timeAgoStr = `${hrDiff} hours ago`;
  } else if (minuteDiff >= 1) {
    timeAgoStr = `${minuteDiff} minutes ago`;
  } else {
    timeAgoStr = "just now";
  }

  return timeAgoStr;
};

export const stateAbbrevToName = {
  AZ: "Arizona",
  AL: "Alabama",
  AK: "Alaska",
  AR: "Arkansas",
  CA: "California",
  CO: "Colorado",
  CT: "Connecticut",
  DC: "District of Columbia",
  DE: "Delaware",
  FL: "Florida",
  GA: "Georgia",
  HI: "Hawaii",
  ID: "Idaho",
  IL: "Illinois",
  IN: "Indiana",
  IA: "Iowa",
  KS: "Kansas",
  KY: "Kentucky",
  LA: "Louisiana",
  ME: "Maine",
  MD: "Maryland",
  MA: "Massachusetts",
  MI: "Michigan",
  MN: "Minnesota",
  MS: "Mississippi",
  MO: "Missouri",
  MT: "Montana",
  NE: "Nebraska",
  NV: "Nevada",
  NH: "New Hampshire",
  NJ: "New Jersey",
  NM: "New Mexico",
  NY: "New York",
  NC: "North Carolina",
  ND: "North Dakota",
  OH: "Ohio",
  OK: "Oklahoma",
  OR: "Oregon",
  PA: "Pennsylvania",
  RI: "Rhode Island",
  SC: "South Carolina",
  SD: "South Dakota",
  TN: "Tennessee",
  TX: "Texas",
  UT: "Utah",
  VT: "Vermont",
  VA: "Virginia",
  WA: "Washington",
  WV: "West Virginia",
  WI: "Wisconsin",
  WY: "Wyoming",
};

/**
 * Given an array of objects, splits them into separate arrays
 * based on given property, and assigns to object
 * arr = [
 *    {type:"orange", title:"First"},
 *    {type:"orange", title:"Second"},
 *    {type:"banana", title:"Third"},
 *    {type:"banana", title:"Fourth"}
 * ]
 * groupByProp(arr, "type") becomes
 * {
 *    orange: {
 *      [{type:"orange", title:"First"}, {type:"orange", title:"Second"}],
 *    },
 *    banana: {
 *      [{type:"banana", title:"Third"}, {type:"banana", title:"Fourth"}],
 *    },
 * }
 * Returns an object of arrays.
 * @param {Array} arr - array to split
 * @param {String} property - property to split by
 */
export const groupByProp = (arr, property) =>
  arr.reduce((memo, x) => {
    const newMemo = { ...memo };
    if (!newMemo[x[property]]) {
      newMemo[x[property]] = [];
    }
    newMemo[x[property]].push(x);
    return newMemo;
  }, {});

export const moveElementInArray = (arr, oldIndex, newIndex) => {
  if (newIndex >= arr.length) {
    let k = newIndex - arr.length + 1;
    while (k > 0) {
      k -= 1;
      arr.push(undefined);
    }
  }
  arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);
  return arr;
};
export const removeWhitespace = (str) => str.replace(/\s/g, "");

export const joinArrayToSentence = (arr, lastElementWord = "and") => {
  if (arr.length === 1) {
    return arr[0];
  }
  if (arr.length === 2) {
    return `${arr[0]} ${lastElementWord} ${arr[1]}`;
  }
  return `${arr.slice(0, arr.length - 1).join(", ")}, ${lastElementWord} ${
    arr[arr.length - 1]
  }`;
};

// returns object with the parts of the address as well as the full combined string
export const companyAddress = ({ company, project }) => {
  if (project) {
    if (
      project.company_address ||
      project.company_city ||
      project.company_state ||
      project.company_zip_code ||
      !project.mwbe
    ) {
      return {
        fullStr: `${
          !!project.company_address ? `${project.company_address}, ` : ""
        }${!!project.company_city ? `${project.company_city}, ` : ""}${
          !!project.company_state ? `${project.company_state} ` : ""
        }${!!project.company_zip_code ? project.company_zip_code : ""}`,
        street: project.company_address,
        city: project.company_city,
        state: project.company_state,
        zip: project.company_zip_code,
      };
    } else if (project.mwbe) {
      return {
        fullStr: `${
          !!project.mwbe.address_1 ? `${project.mwbe.address_1}, ` : ""
        }${!!project.mwbe.city ? `${project.mwbe.city}, ` : ""}${
          !!project.mwbe.state ? `${project.mwbe.state} ` : ""
        }${!!project.mwbe.zip_code ? project.mwbe.zip_code : ""}`,
        street: project.mwbe.address_1,
        city: project.mwbe.city,
        state: project.mwbe.state,
        zip: project.mwbe.zip_code,
      };
    }
  }
  if (company) {
    return {
      fullStr: `${!!company.address_1 ? `${company.address_1}, ` : ""}${
        !!company.city ? `${company.city}, ` : ""
      }${!!company.state ? `${company.state} ` : ""}${
        !!company.zip_code ? company.zip_code : ""
      }`,
      street: company.address_1,
      city: company.city,
      state: company.state,
      zip: company.zip_code,
    };
  }
  return {};
};

export const addressFullStrToParts = (fullStr) => ({
  street: fullStr.split(",")[0]?.trim(),
  city: fullStr.split(",")[1]?.trim(),
  state: fullStr.split(",")[2]?.split(" ")[1]?.trim(),
  zip: fullStr.split(",")[2]?.split(" ")[2]?.trim(),
});
