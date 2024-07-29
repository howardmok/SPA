import { Card, Icon, Tag, styles } from "@sweeten/oreo";
import { css, StyleSheet } from "aphrodite";
import { useEffect, useState } from "react";
import { cloneDeep } from "lodash";
import { Button, Dropdown, DropdownButton, Table } from "react-bootstrap";
import { useParams } from "react-router-dom";
import FormDropdownField from "../FormComponents/dropdown";
import {
  envBaltPeninsulaId,
  formatToCurrency,
  getWindowWidth,
  numberOrDash,
  vanityUrlOrId,
} from "../shared";
import { RACE_DISPLAY_LABELS } from "../../constants";
import "./styles.css";
import { api } from "../../utils/api";
import { CertPill } from "../ProfileComponents/Certifications";

const ss = StyleSheet.create({
  header: {
    fontSize: 20,
    fontWeight: "bold",
    justifyContent: "space-between",
    ...styles.center("vertical"),
    marginBottom: 32,
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.phoneStandard,
      style: {
        fontSize: 16,
        marginBottom: 0,
      },
    }),
  },
  viewMoreLess: {
    margin: "auto",
    marginTop: 36,
    borderRadius: 8,
    height: 40,
    backgroundColor: "#F6F7F8",
    color: "#76808F",
    fontWeight: "bold",
    border: "none",
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.phoneStandard,
      style: {
        marginTop: 16,
      },
    }),
  },
  businessName: {
    color: "#0DA2F5",
    fontSize: 14,
    fontWeight: 500,
    minWidth: 240,
  },
  tag: {
    marginRight: 8,
    marginBottom: 8,
    borderRadius: 8,
    padding: 12,
    height: "auto",
    whiteSpace: "initial",
    ...styles.center("vertical"),
    backgroundColor: styles.colors.brandPrimary,
    color: "white",
  },
  tagCenter: {
    ...styles.center("vertical"),
    position: "relative",
  },
  arrowDown: {
    display: "inline-block",
    width: 0,
    height: 0,
    borderLeft: "6px solid transparent",
    borderRight: "6px solid transparent",
    borderTop: "6px solid #8F92A1",
  },
  arrowUp: {
    display: "inline-block",
    width: 0,
    height: 0,
    borderLeft: "6px solid transparent",
    borderRight: "6px solid transparent",
    borderBottom: "6px solid #8F92A1",
  },
  card: {
    padding: 36,
    borderRadius: 16,
    boxShadow: `0 8px 16px 0 rgba(0,0,0,0.04)`,
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.phoneStandard,
      style: {
        padding: 16,
        borderRadius: 12,
      },
    }),
  },
  desktop: {
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.phoneStandard,
      style: {
        display: "none",
      },
    }),
  },
  mobile: {
    display: "none",
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.phoneStandard,
      style: {
        display: "block",
      },
    }),
  },
  mobileContainer: {
    backgroundColor: "#F6F7F8",
    borderRadius: 8,
    fontSize: 14,
    margin: "16px 0px",
    padding: 16,
  },
  mobileField: {
    display: "flex",
    justifyContent: "space-between",
  },
  fieldHeader: {
    fontWeight: 500,
    marginBottom: 16,
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.phoneStandard,
      style: {
        color: "#76808F",
        marginRight: 48,
      },
    }),
  },
  fieldVal: {
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.phoneStandard,
      style: {
        textAlign: "right",
      },
    }),
  },
  medium: {
    fontWeight: 600,
  },
  extraCerts: {
    backgroundColor: "#F2F4F7",
    borderRadius: 3,
    padding: "2px 8px",
    height: "100%",
    cursor: "pointer",
  },
});

const maxAdditionalCerts = 1;

const currentDashboardLocation = "City of Baltimore";

const getCountAndCerts = (company) => {
  let count = 0;

  const certsToShow = [];

  company.certifications.forEach((cert) => {
    if (cert.agency) {
      const { agency } = cert;

      if (cert.type === "MWBE") {
        if (
          !certsToShow.find(
            (certInArr) =>
              certInArr.certificationType === "MBE" &&
              agency.name === certInArr.certAgency
          )
        ) {
          if (
            agency.name !== currentDashboardLocation ||
            company.cert_type !== "MBE"
          ) {
            certsToShow.push({
              certAgency: agency.name,
              certificationType: "MBE",
            });
            count++;
          }
        }
        if (
          !certsToShow.find(
            (certInArr) =>
              certInArr.certificationType === "WBE" &&
              agency.name === certInArr.certAgency
          )
        ) {
          if (
            agency.name !== currentDashboardLocation ||
            company.cert_type !== "WBE"
          ) {
            certsToShow.push({
              certAgency: agency.name,
              certificationType: "WBE",
            });
            count++;
          }
        }
      } else if (
        !certsToShow.find(
          (certInArr) =>
            certInArr.certificationType === cert.type &&
            agency.name === certInArr.certAgency
        )
      ) {
        if (
          agency.name !== currentDashboardLocation ||
          cert.type !== company.cert_type
        ) {
          certsToShow.push({
            certAgency: agency.name,
            certificationType: cert.type,
          });
          count++;
        }
      }
    } else if (cert.type === "MWBE") {
      if (
        !certsToShow.find(
          (certInArr) =>
            certInArr.certificationType === "MBE" &&
            cert.certAgency === certInArr.certAgency
        )
      ) {
        if (
          cert.certAgency !== currentDashboardLocation ||
          company.cert_type !== "MBE"
        ) {
          certsToShow.push({
            certAgency: currentDashboardLocation,
            certificationType: "MBE",
          });
          count++;
        }
      }
      if (
        !certsToShow.find(
          (certInArr) =>
            certInArr.certificationType === "WBE" &&
            cert.certAgency === certInArr.certAgency
        )
      ) {
        if (
          cert.certAgency !== currentDashboardLocation ||
          company.cert_type !== "WBE"
        ) {
          certsToShow.push({
            certAgency: currentDashboardLocation,
            certificationType: "WBE",
          });
          count++;
        }
      }
    } else if (
      !certsToShow.find(
        (certInArr) =>
          certInArr.certificationType === cert.type &&
          cert.certAgency === certInArr.certAgency
      )
    ) {
      if (
        cert.certAgency !== currentDashboardLocation ||
        cert.type !== company.cert_type
      ) {
        certsToShow.push({
          certAgency: currentDashboardLocation,
          certificationType: cert.type,
        });
        count++;
      }
    }
  });

  certsToShow.sort((certA, certB) => {
    if (certA.certAgency === currentDashboardLocation) {
      return -1;
    }
    if (certB.certAgency === currentDashboardLocation) {
      return 1;
    }
    return certA.certAgency.localeCompare(certB.certAgency);
  });

  return [count, certsToShow];
};

const CompanyRow = ({ company }) => {
  const [count, certsToShow] = getCountAndCerts(company);

  return (
    <tr>
      <td colSpan={3} className={`${css(ss.businessName)} mwbe-cell`}>
        <span
          style={
            company.mwbe_core_id
              ? { cursor: "pointer", marginTop: 100, fontWeight: "bold" }
              : { fontWeight: "bold" }
          }
          onClick={
            company.mwbe_core_id
              ? () => {
                  window.open(
                    vanityUrlOrId(company, { useMwbeCoreId: true }),
                    "_blank"
                  );
                }
              : null
          }
        >
          {company.business_name}
        </span>
      </td>
      <td className="mwbe-cell" colSpan={2.5}>
        <div style={{ margin: "4px 0px" }}>
          <CertPill
            certAgency={currentDashboardLocation}
            certificationType={company.cert_type}
            noTooltip
          />
        </div>
      </td>
      <td className="mwbe-cell" colSpan={5}>
        <div
          style={{ display: "flex", flexWrap: "wrap", alignItems: "center" }}
        >
          {certsToShow.slice(0, maxAdditionalCerts).map((cert) => (
            <div style={{ marginRight: 8, marginBottom: 4, marginTop: 4 }}>
              <CertPill
                certAgency={cert.certAgency}
                certificationType={cert.certificationType}
                noTooltip
              />
            </div>
          ))}
          {count > maxAdditionalCerts && (
            <div
              className={css(ss.extraCerts)}
              onClick={
                company.mwbe_core_id
                  ? () => {
                      window.open(
                        vanityUrlOrId(company, { useMwbeCoreId: true }),
                        "_blank"
                      );
                    }
                  : null
              }
            >
              +{count - maxAdditionalCerts}
            </div>
          )}
        </div>
      </td>
      <td className="mwbe-cell" colSpan={1.5}>
        {RACE_DISPLAY_LABELS[company.race] || "N/A"}
      </td>
      <td className="mwbe-cell">
        {formatToCurrency(company.totalBudgeted, {
          numDecimals: 0,
          returnDash: true,
        })}
      </td>
      <td className="mwbe-cell">
        {formatToCurrency(company.totalPaid, {
          numDecimals: 0,
          returnDash: true,
        })}
      </td>
    </tr>
  );
};

const MobileCompanyRow = ({ company }) => {
  const [count, certsToShow] = getCountAndCerts(company);

  return (
    <div className={css(ss.mobileContainer)}>
      <div style={{ marginBottom: 12 }}>
        <span
          style={
            company.mwbe_core_id ? { cursor: "pointer", color: "#0DA2F5" } : {}
          }
          onClick={
            company.mwbe_core_id
              ? () => {
                  window.open(vanityUrlOrId(company), "_blank");
                }
              : null
          }
        >
          {company.business_name}
        </span>
      </div>
      <div className={css(ss.mobileField)}>
        <div className={css(ss.fieldHeader)}>Utilized as</div>
        <div className={css(ss.fieldVal, ss.medium)}>
          <CertPill
            certAgency={currentDashboardLocation}
            certificationType={company.cert_type}
            noTooltip
          />
        </div>
      </div>
      <div className={css(ss.mobileField)}>
        <div className={css(ss.fieldHeader)}>Additional certifications</div>
        <div className={css(ss.fieldVal, ss.medium)}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            {certsToShow.slice(0, maxAdditionalCerts).map((cert) => (
              <div style={{ marginBottom: 8 }}>
                <CertPill
                  certAgency={cert.certAgency}
                  certificationType={cert.certificationType}
                  noTooltip
                />
              </div>
            ))}
            {count > maxAdditionalCerts && (
              <div
                className={css(ss.extraCerts)}
                onClick={
                  company.mwbe_core_id
                    ? () => {
                        window.open(
                          vanityUrlOrId(company, { useMwbeCoreId: true }),
                          "_blank"
                        );
                      }
                    : null
                }
              >
                +{count - maxAdditionalCerts}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className={css(ss.mobileField)}>
        <div className={css(ss.fieldHeader)}>Ownership race</div>
        <div className={css(ss.fieldVal, ss.medium)}>
          {RACE_DISPLAY_LABELS[company.race] || "N/A"}
        </div>
      </div>
      <div className={css(ss.mobileField)}>
        <div className={css(ss.fieldHeader)}>Contracted</div>
        <div className={css(ss.fieldVal, ss.medium)}>
          {formatToCurrency(company.totalBudgeted, {
            numDecimals: 0,
            returnDash: true,
          })}
        </div>
      </div>
      <div className={css(ss.mobileField)}>
        <div className={css(ss.fieldHeader)}>Paid</div>
        <div className={css(ss.fieldVal, ss.medium)}>
          {formatToCurrency(company.totalPaid, {
            numDecimals: 0,
            returnDash: true,
          })}
        </div>
      </div>
    </div>
  );
};

const Arrow = ({ direction, style }) => (
  <div
    className={css(direction === "up" ? ss.arrowUp : ss.arrowDown)}
    style={style}
  />
);

const sortOptions = {
  alphabetical: "Alphabetical order",
  reverse_alphabetical: "Reverse alphabetical",
  "budget-high_to_low": "Budget: High to low",
  "budget-low_to_high": "Budget: Low to high",
  "paid-high_to_low": "Paid: High to low",
  "paid-low_to_high": "Paid: Low to high",
};

const changeSortOption = (col, sortOption, setSortOption) => {
  if (col === "name") {
    if (sortOption === "alphabetical") {
      setSortOption("reverse_alphabetical");
    } else {
      setSortOption("alphabetical");
    }
  } else if (col === "budget") {
    if (sortOption === "budget-high_to_low") {
      setSortOption("budget-low_to_high");
    } else {
      setSortOption("budget-high_to_low");
    }
  } else if (sortOption === "paid-high_to_low") {
    setSortOption("paid-low_to_high");
  } else {
    setSortOption("paid-high_to_low");
  }
};

const sortCompanies = (companies, sortOption) => {
  switch (sortOption) {
    case "budget-high_to_low":
      return companies.sort((a, b) => b.totalBudgeted - a.totalBudgeted);
    case "budget-low_to_high":
      return companies.sort((a, b) => a.totalBudgeted - b.totalBudgeted);
    case "paid-high_to_low":
      return companies.sort((a, b) => b.totalPaid - a.totalPaid);
    case "paid-low_to_high":
      return companies.sort((a, b) => a.totalPaid - b.totalPaid);
    case "reverse_alphabetical":
      return companies.sort((a, b) =>
        b.business_name.localeCompare(a.business_name)
      );
    case "alphabetical":
      return companies.sort((a, b) =>
        a.business_name.localeCompare(b.business_name)
      );
    default:
      return companies;
  }
};

const MwbeList = () => {
  const [companiesToUse, setCompaniesToUse] = useState([]);
  const [searchedCompany, setSearchedCompany] = useState(null);
  const [numToShow, setNumToShow] = useState(12);
  const [sortOption, setSortOption] = useState("budget-high_to_low");
  const { id } = useParams();

  useEffect(async () => {
    const companiesResData = await api({
      path: `transparency_dashboards/companies`,
    });

    const filteredForMwbe = companiesResData.filter(
      (company) => company.cert_type !== null
    );

    const idToUse = id || envBaltPeninsulaId;

    const companyScopesData = await api({
      path: `transparency_dashboards/${idToUse}/company_scopes`,
    });

    filteredForMwbe.forEach((company) => {
      const totalPaid = companyScopesData[company.id].reduce(
        (sum, a) => sum + a.amount_paid_to_date,
        0
      );
      const numContracts = companyScopesData[company.id].length;
      const totalChangeOrdersAmt = companyScopesData[company.id].reduce(
        (sum, a) => sum + a.change_orders_amount,
        0
      );

      company.totalPaid = totalPaid;
      company.numContracts = numContracts;
      company.totalChangeOrdersAmt = totalChangeOrdersAmt;

      if (company.cert_type === "MWBE") {
        const totalBudgetedMbe = companyScopesData[company.id].reduce(
          (sum, a) => sum + a.mbe_budget,
          0
        );
        const totalBudgetedWbe = companyScopesData[company.id].reduce(
          (sum, a) => sum + a.wbe_budget,
          0
        );
        if (totalBudgetedMbe && totalBudgetedWbe) {
          const newCompany = cloneDeep(company);
          company.totalBudgeted = totalBudgetedMbe;
          newCompany.totalBudgeted = totalBudgetedWbe;
          company.cert_type = "MBE";
          newCompany.cert_type = "WBE";
          company.certifications.push({
            type: "WBE",
            certAgency: currentDashboardLocation,
          });
          newCompany.certifications.push({
            type: "MBE",
            certAgency: currentDashboardLocation,
          });
          filteredForMwbe.push(newCompany);
        } else if (totalBudgetedMbe) {
          company.mwbeDesignation = "mbe";
          company.cert_type = "MBE";
          company.certifications.push({
            type: "WBE",
            certAgency: currentDashboardLocation,
          });
          company.totalBudgeted = totalBudgetedMbe;
        } else {
          company.mwbeDesignation = "wbe";
          company.cert_type = "WBE";
          company.certifications.push({
            type: "MBE",
            certAgency: currentDashboardLocation,
          });
          company.totalBudgeted = totalBudgetedWbe;
        }
      } else {
        const totalBudgeted = companyScopesData[company.id].reduce(
          (sum, a) => sum + a.revised_budget,
          0
        );
        company.totalBudgeted = totalBudgeted;
      }
    });

    setCompaniesToUse(filteredForMwbe);
  }, []);

  const filteredAndSortedCompanies = sortCompanies(
    companiesToUse.filter((companyToFilter) =>
      searchedCompany ? companyToFilter.business_name === searchedCompany : true
    ),
    sortOption
  );

  const companiesToShow = filteredAndSortedCompanies.slice(0, numToShow);

  const windowWidth = getWindowWidth();
  const isDesktop = windowWidth > styles.breakpoints.phoneStandard;

  return (
    <div style={{ marginTop: 32 }}>
      <Card aphStyle={ss.card}>
        <div className={css(ss.header)}>
          <div style={{ marginTop: 8 }}>Company details</div>
          <FormDropdownField
            items={companiesToUse.map((company) => ({
              label: company.business_name,
              value: company.business_name,
            }))}
            beforeElement={<Icon name="search" size={14} />}
            placeholder={
              isDesktop ? "Search for company by name" : "Search by name"
            }
            onChange={(val) => (val !== "" ? setSearchedCompany(val) : {})}
            style={{ backgroundColor: "#F6F7F8", fontSize: 14 }}
            hasSearch
            hideChevron
            clearOnItemClick
            noMarginTop
            halfWidth
            small
          />
        </div>
        <div
          className={css(ss.mobile)}
          style={{ borderTop: `1px solid #E9ECEF`, margin: "16px 0px" }}
        />
        {searchedCompany && (
          <Tag aphStyle={ss.tag}>
            <div className={css(ss.tagCenter)}>
              {searchedCompany}
              <div
                onClick={() => setSearchedCompany(null)}
                style={{ marginLeft: "auto" }}
              >
                <Icon name="close" color={styles.colors.white} />
              </div>
            </div>
          </Tag>
        )}
        <div className={css(ss.desktop)}>
          <Table responsive>
            <thead>
              <tr
                style={{
                  backgroundColor: "#F6F7F8",
                  color: "#475467",
                  height: 44,
                  verticalAlign: "middle",
                }}
              >
                <th
                  className="mwbe-header"
                  style={{ cursor: "pointer" }}
                  colSpan={3}
                  onClick={() =>
                    changeSortOption("name", sortOption, setSortOption)
                  }
                >
                  Company{" "}
                  {(sortOption === "alphabetical" ||
                    sortOption === "reverse_alphabetical") && (
                    <Arrow
                      direction={sortOption === "alphabetical" ? "down" : "up"}
                    />
                  )}
                </th>
                <th className="mwbe-header" colSpan={2.5}>
                  Utilized as
                </th>
                <th className="mwbe-header" colSpan={5}>
                  Additional certifications
                </th>
                <th className="mwbe-header" colSpan={1.5}>
                  Ownership race
                </th>
                <th
                  className="mwbe-header"
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    changeSortOption("budget", sortOption, setSortOption)
                  }
                >
                  Contracted{" "}
                  {(sortOption === "budget-high_to_low" ||
                    sortOption === "budget-low_to_high") && (
                    <Arrow
                      direction={
                        sortOption === "budget-high_to_low" ? "up" : "down"
                      }
                    />
                  )}
                </th>
                <th
                  className="mwbe-header"
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    changeSortOption("paid", sortOption, setSortOption)
                  }
                >
                  Paid{" "}
                  {(sortOption === "paid-high_to_low" ||
                    sortOption === "paid-low_to_high") && (
                    <Arrow
                      direction={
                        sortOption === "paid-high_to_low" ? "up" : "down"
                      }
                    />
                  )}
                </th>
              </tr>
            </thead>
            <tbody className="mwbe-body">
              {companiesToShow.map((company) => (
                <CompanyRow company={company} />
              ))}
              {numToShow < filteredAndSortedCompanies.length && (
                <tr>
                  <td
                    className="mwbe-cell"
                    colSpan={14}
                    style={{ textAlign: "center", border: "none" }}
                  >
                    <Button
                      className={css(ss.viewMoreLess)}
                      onClick={() => setNumToShow(numToShow + 12)}
                    >
                      View more
                    </Button>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
        <div className={css(ss.mobile)}>
          <DropdownButton
            title={`Sort by: ${sortOptions[sortOption]}`}
            style={{ width: "100%", marginBottom: 18 }}
          >
            {Object.entries(sortOptions).map(([key, value]) => (
              <Dropdown.Item onClick={() => setSortOption(key)}>
                {value}
              </Dropdown.Item>
            ))}
          </DropdownButton>
          {companiesToShow.map((company) => (
            <MobileCompanyRow company={company} />
          ))}
          {numToShow < filteredAndSortedCompanies.length && (
            <div style={{ textAlign: "center", border: "none" }}>
              <Button
                className={css(ss.viewMoreLess)}
                onClick={() => setNumToShow(numToShow + 12)}
              >
                View more
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default MwbeList;
