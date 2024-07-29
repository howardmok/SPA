import { useEffect, useState } from "react";
import { StyleSheet, css } from "aphrodite/no-important";
import { Card, Header, Body, styles, TextLink } from "@sweeten/oreo";
import { Row, Col } from "react-bootstrap";
import { useParams } from "react-router-dom";
import ProjectTypeSvg from "../../images/project-type.svg";
import ProjectLocationSvg from "../../images/project-location.svg";
import ProjectDateSvg from "../../images/project-date.svg";
import {
  formatToCurrency,
  getWindowWidth,
  formatDateMMDDYYYY,
  envBaltPeninsulaId,
} from "../shared";
import DevelopersSvg from "../../images/developer.svg";
import PrimaryContractorsSvg from "../../images/crane.svg";
import CapitalPartnersSvg from "../../images/capital-partners.svg";
import PublicEntitiesSvg from "../../images/govt-building.svg";
import Loader from "../loader";
import CEDTooltip from "./ced_tooltip";
import { Sparkle } from "../emojis";
import { api } from "../../utils/api";
import { CertPill } from "../ProfileComponents/Certifications";

const ss = StyleSheet.create({
  card: {
    padding: 0,
    boxSizing: "border-box",
    borderRadius: 16,
    boxShadow: `0 8px 16px 0 rgba(0,0,0,0.04)`,
    border: `1px solid #E9ECEF`,
    marginTop: 32,
  },
  imgContainer: {
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.phoneStandard,
      style: {
        overflow: "hidden",
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        height: 107,
      },
    }),
  },
  baltimorePeninsulaImage: {
    objectFit: "cover",
    objectPosition: "50% 33%",
    width: 1220,
    height: 256,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.phoneStandard,
      style: {
        marginTop: -78,
      },
    }),
  },
  headerContainer: {
    padding: "24px 40px 0px 40px",
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.phoneStandard,
      style: {
        padding: "16px 16px 0px 16px",
      },
    }),
  },
  greenCircle: {
    boxSizing: "border-box",
    height: 12,
    width: 12,
    border: `2px solid ${styles.colors.white}`,
    borderRadius: 12,
    backgroundColor: "#75BB5E",
  },
  lastUpdatedText: {
    color: "#6F767E",
    fontWeight: 500,
    marginLeft: 7,
    fontSize: 14,
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.phoneStandard,
      style: {
        fontSize: 12,
      },
    }),
  },
  name: {
    marginBottom: 8,
    lineHeight: "41px",
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.phoneStandard,
      style: {
        fontSize: 24,
      },
    }),
  },
  privatePublicContainer: {
    padding: "20px 40px",
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.phoneStandard,
      style: {
        padding: "22px 16px",
      },
    }),
  },
  badgeContainer: {
    display: "flex",
    alignItems: "center",
    backgroundColor: styles.colors.orange7,
    borderRadius: 20,
    marginRight: 8,
    padding: "4px 10px",
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.phoneStandard,
      style: {
        height: 18,
        borderRadius: 9,
        marginBottom: 7,
      },
    }),
  },
  badgeText: {
    color: "#FF8C46",
    fontSize: 12,
    fontWeight: 600,
    marginLeft: 5,
    lineHeight: "0px",
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.phoneStandard,
      style: {
        fontSize: 9,
      },
    }),
  },
  mwbeParticipation: {
    padding: "24px 40px",
    color: styles.colors.grey40,
    fontSize: 16,
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.phoneStandard,
      style: {
        fontSize: 14,
        padding: "24px 16px",
      },
    }),
  },
  headerBadgesTotal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.phoneStandard,
      style: { flexDirection: "column" },
    }),
  },
  generalInfoHeaderContainer: {
    padding: "12px 24px 12px 0px",
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.phoneStandard,
      style: {
        padding: 12,
        paddingLeft: 0,
      },
    }),
  },
  totalAmtContainer: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#F0F9FF",
    borderRadius: 12,
    padding: "12px 24px",
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.phoneStandard,
      style: {
        width: "100%",
        marginTop: 11,
        padding: 12,
        borderRadius: 8,
      },
    }),
  },
  totalContractedToDate: {
    fontWeight: 500,
    color: "#000929",
    display: "flex",
    justifyContent: "center",
    opacity: 0.5,
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.phoneStandard,
      style: {
        fontSize: 12,
        justifyContent: "flex-start",
        marginBottom: 4,
      },
    }),
  },
  privateItemsContainer: {
    display: "flex",
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.phoneStandard,
      style: {
        flexDirection: "column",
      },
    }),
  },
});

const ProjectPartnerItem = ({ iconPath, title, items }) => (
  <div>
    <div style={{ display: "flex", marginBottom: 8 }}>
      <img src={iconPath} alt={title} />
      <Body
        tag="div"
        style={{
          color: "#3A3335",
          fontWeight: "bold",
          fontSize: 14,
          marginLeft: 7,
        }}
      >
        {title}
      </Body>
    </div>
    {items.map((item, idx) => (
      <span
        style={{
          color: styles.colors.brandPrimary,
          fontSize: 14,
          fontWeight: 500,
        }}
      >
        {item}
        {idx !== items.length - 1 ? (
          <span style={{ color: styles.colors.black, fontWeight: "normal" }}>
            {" "}
            |{" "}
          </span>
        ) : null}
      </span>
    ))}
  </div>
);

const Badge = ({ iconPath, body }) => (
  <div className={css(ss.badgeContainer)}>
    <img src={iconPath} alt="" />
    <Body tag="div" aphStyle={ss.badgeText}>
      {body}
    </Body>
  </div>
);

const BaltimoreMOULink = () => (
  <a
    target="_blank"
    href="https://www.baltimorecitycouncil.com/sites/default/files/PCMOU.pdf"
    rel="noreferrer"
  >
    MOU with the City of Baltimore.
  </a>
);

const GeneralInfo = ({ dashboards, projects }) => {
  const { city, end_date, name, project_type, start_date, state, updated_at } =
    dashboards[0];

  let totalAmt = 0;

  const calculateTotalAmt = (scope) => scope.mbe_budget + scope.wbe_budget;

  projects.forEach((scope) => (totalAmt += calculateTotalAmt(scope)));

  const windowWidth = getWindowWidth();
  const isDesktop = windowWidth > styles.breakpoints.phoneStandard;

  const [showMore, toggleShowMore] = useState(false);

  const truncatedMwbeParticipationText = (
    <div>
      The Baltimore Peninsula Development Team is committed to providing
      opportunities for contractors to participate in the project. The
      participation goals for Minority (27%) and Women-owned (10%) businesses on
      this project were set out in an <BaltimoreMOULink />
    </div>
  );
  const mwbeParticipationText = (
    <div>
      The Baltimore Peninsula Development Team is committed to providing
      opportunities for contractors to participate in the project. The
      participation goals for Minority (27%) and Women-owned (10%) businesses on
      this project were set out in an <BaltimoreMOULink /> Eligible companies
      must be actively certified by the City of Baltimore Minority and Women’s
      Business Opportunity Office (“MWBOO”).
    </div>
  );

  return (
    <Card aphStyle={ss.card}>
      <div className={css(ss.headerContainer)}>
        <div
          className={css(ss.headerBadgesTotal)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div className={css(ss.generalInfoHeaderContainer)}>
            <div
              style={{ display: "flex", alignItems: "center", marginBottom: 8 }}
            >
              <div className={css(ss.greenCircle)} />
              <Body tag="div" aphStyle={ss.lastUpdatedText}>
                Last updated: {formatDateMMDDYYYY(updated_at)}
              </Body>
            </div>
            <Header tag="h2" aphStyle={ss.name}>
              {name}
            </Header>
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              <Badge iconPath={ProjectTypeSvg} body={project_type} />
              <Badge iconPath={ProjectLocationSvg} body={`${city}, ${state}`} />
              <Badge
                iconPath={ProjectDateSvg}
                body={`${formatDateMMDDYYYY(start_date)} - ${
                  formatDateMMDDYYYY(end_date) || "Present"
                }`}
              />
            </div>
          </div>
          <div className={css(ss.totalAmtContainer)}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ marginRight: 8, display: "flex" }}>
                <CertPill certificationType="MBE" noTooltip />
              </div>
              <CertPill certificationType="WBE" noTooltip />
            </div>
            <div style={{ display: "flex", margin: "8px 0px" }}>
              <Header
                tag="h4"
                style={{
                  color: styles.colors.black,
                  fontWeight: "bold",
                  fontSize: isDesktop ? 28 : 16,
                }}
              >
                {formatToCurrency(totalAmt, { numDecimals: 0 })}
              </Header>
            </div>
            <div style={{ display: "flex" }}>
              <Body tag="div" aphStyle={ss.totalContractedToDate}>
                Total contracted to date
              </Body>
              <CEDTooltip
                text="The total amount contracted to Minority and Women-owned certified businesses"
                position="bottom"
              />
            </div>
          </div>
        </div>
      </div>
      <div
        style={{ marginTop: 24, borderTop: `1px solid #E6E8EC`, width: "100%" }}
      />
      <div className={css(ss.privatePublicContainer)}>
        <Row style={{ marginBottom: 16 }}>
          <Body
            tag="div"
            style={{
              color: styles.colors.grey40,
              fontSize: 12,
              fontWeight: 700,
              marginBottom: 10,
              letterSpacing: 1,
            }}
          >
            PRIVATE
          </Body>
          <div className={css(ss.privateItemsContainer)}>
            <Col sm={3} style={{ marginBottom: isDesktop ? null : 16 }}>
              <ProjectPartnerItem
                iconPath={DevelopersSvg}
                title="Developers"
                items={["MAG Partners", "MacFarlane Partners"]}
              />
            </Col>
            <Col sm={6} style={{ marginBottom: isDesktop ? null : 16 }}>
              <ProjectPartnerItem
                iconPath={PrimaryContractorsSvg}
                title="Primary contractors"
                items={[
                  "The Whiting-Turner Contracting Company",
                  "Bozzuto Construction Company",
                  "CBG Building Company LLC",
                  "Clark Construction Group",
                  "J C Porter Construction",
                ]}
              />
            </Col>
            <Col sm={3}>
              <ProjectPartnerItem
                iconPath={CapitalPartnersSvg}
                title="Capital partners"
                items={[
                  "Goldman Sachs Urban Investment Group",
                  "Sagamore Ventures",
                ]}
              />
            </Col>
          </div>
        </Row>
        <Row>
          <Body
            tag="div"
            style={{
              color: styles.colors.grey40,
              fontSize: 12,
              fontWeight: 700,
              marginBottom: 10,
              letterSpacing: 1,
            }}
          >
            PUBLIC
          </Body>
          <ProjectPartnerItem
            iconPath={PublicEntitiesSvg}
            title="Public entities"
            items={["City of Baltimore MWBOO", "State of Maryland"]}
          />
        </Row>
      </div>
      <div style={{ borderTop: `1px solid #E6E8EC`, width: "100%" }} />
      <div className={css(ss.mwbeParticipation)}>
        <div style={{ fontWeight: 600, marginBottom: 16 }}>
          <Sparkle /> About M/WBE participation
        </div>
        {!showMore ? truncatedMwbeParticipationText : mwbeParticipationText}
        {!showMore ? (
          <TextLink onClick={() => toggleShowMore(true)}>Show more</TextLink>
        ) : (
          <TextLink onClick={() => toggleShowMore(false)}> Hide</TextLink>
        )}
        <div />
      </div>
    </Card>
  );
};

export default ({ projects }) => {
  const [dashboards, setDashboards] = useState(null);
  const { id } = useParams();

  useEffect(async () => {
    const idToUse = id || envBaltPeninsulaId;

    const projectResData = await api({
      path: `transparency_dashboards?id=${idToUse}`,
    });

    setDashboards(projectResData);
  }, []);

  if (!projects || !dashboards) {
    return <Loader />;
  }

  return <GeneralInfo projects={projects} dashboards={dashboards} />;
};
