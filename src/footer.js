import { useContext, useState } from "react";
import { Row, Col, Button } from "react-bootstrap";
import { Body, styles } from "@sweeten/oreo";
import { StyleSheet, css } from "aphrodite";
import SweetenLogo from "../images/sweeten-logo-white.svg";
import WaitlistModal from "./TransparencyDashboard/Waitlist_Modal";
import { getWindowWidth } from "./shared";
import LocationSvg from "../images/icons/location";
import { UserData } from "./redirect_handler";

const ss = StyleSheet.create({
  wrapper: {
    paddingTop: 162,
  },
  container: {
    backgroundColor: "#1A2B44",
    padding: "96px 40px 48px",
    overflowX: "hidden",
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.tabletStandard,
      style: {
        padding: 40,
      },
    }),
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.phoneStandard,
      style: {
        padding: "32px 0px 24px",
        marginTop: 32,
      },
    }),
  },
  logoLinksLearnMore: {
    display: "flex",
    justifyContent: "space-between",
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.phoneStandard,
      style: {
        padding: "0px 32px",
      },
    }),
  },
  linkStyle: {
    fontSize: 14,
    opacity: 0.6,
    marginBottom: 16,
    lineHeight: "24px",
  },
  developerOrPrimeContactor: {
    fontWeight: 500,
    fontSize: 16,
    color: styles.colors.white,
    textAlign: "right",
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.tabletStandard,
      style: {
        fontSize: 13,
        textAlign: "left",
      },
    }),
  },
  learnMoreCta: {
    boxSizing: "border-box",
    borderRadius: 8,
    border: `1px solid ${styles.colors.white}`,
    color: styles.colors.white,
    fontSize: 14,
    width: 194,
    height: 48,
    backgroundColor: "transparent",
    marginTop: 24,
    float: "right",
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.tabletStandard,
      style: {
        width: "100%",
      },
    }),
  },
  horizontalLine: {
    borderTop: `1px solid ${styles.colors.white}`,
    margin: "48px 0px",
    opacity: 0.6,
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.tabletStandard,
      style: {
        margin: "24px 0px",
      },
    }),
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.phoneStandard,
      style: {
        margin: "24px 16px",
      },
    }),
  },
  privacyAndTerms: {
    display: "flex",
    justifyContent: "space-between",
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.tabletStandard,
      style: {
        flexFlow: "column nowrap",
      },
    }),
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.phoneStandard,
      style: {
        flexFlow: "column nowrap",
        padding: "0px 32px",
      },
    }),
  },
  mobileOnly: {
    display: "none",
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.tabletStandard,
      style: {
        display: "block",
      },
    }),
  },
  locationIconAddress: {
    display: "flex",
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.tabletStandard,
      style: { marginBottom: 16 },
    }),
  },
  logoContainer: {
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.tabletStandard,
      style: { marginBottom: 32 },
    }),
  },
});

const Footer = ({ useWrapperStyles = true, wrapperBackground = "inherit" }) => {
  const [showLearnMoreModal, toggleLearnMoreModal] = useState(null);
  const windowWidth = getWindowWidth();
  const isDesktop = windowWidth >= styles.breakpoints.desktopStandard;
  const isTablet = windowWidth === styles.breakpoints.tabletStandard;
  const { user } = useContext(UserData);

  return (
    <div
      className={useWrapperStyles ? css(ss.wrapper) : null}
      style={{ background: wrapperBackground }}
    >
      <div className={css(ss.container)}>
        <div style={{ maxWidth: 1220, margin: "auto" }}>
          <Row className={css(ss.logoLinksLearnMore)}>
            <Col lg={2} md={12} className={css(ss.logoContainer)}>
              <img
                src={SweetenLogo}
                alt="sweeten-enterprise"
                height={isDesktop || isTablet ? null : 35}
              />
            </Col>
            <Col
              lg={4}
              md={12}
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <div>
                <div className={css(ss.linkStyle)}>
                  <a href="/search" style={{ color: styles.colors.white }}>
                    Directory of companies
                  </a>
                </div>
                <div className={css(ss.linkStyle)}>
                  <a
                    href="/opportunity/search"
                    style={{ color: styles.colors.white }}
                  >
                    Contract opportunities
                  </a>
                </div>
                <div className={css(ss.linkStyle)}>
                  <a
                    href="/baltimore-peninsula"
                    style={{ color: styles.colors.white }}
                  >
                    Baltimore Peninsula
                  </a>
                </div>
              </div>
              <div>
                <div className={css(ss.linkStyle)}>
                  <a
                    href="mailto:support@sweetenenterprise.com"
                    style={{ color: styles.colors.white }}
                  >
                    Contact us
                  </a>
                </div>
                {!user && (
                  <div className={css(ss.linkStyle)}>
                    <a href="/" style={{ color: styles.colors.white }}>
                      Sign in
                    </a>
                  </div>
                )}
              </div>
            </Col>
            <div
              className={css(ss.mobileOnly)}
              style={{
                margin: "16px 0px",
                borderTop: `1px solid ${styles.colors.white}`,
                opacity: 0.6,
              }}
            />
            <Col lg={5} md={12}>
              <Body tag="div" aphStyle={ss.developerOrPrimeContactor}>
                Are you a developer or prime contractor that wants to provide
                more transparency like this on your project?
              </Body>
              <Button
                size="xl-lg"
                className={css(ss.learnMoreCta)}
                onClick={() => toggleLearnMoreModal(true)}
              >
                Learn more
              </Button>
            </Col>
          </Row>
          <div className={css(ss.horizontalLine)} />
          <div className={css(ss.privacyAndTerms)}>
            <div className={css(ss.locationIconAddress)}>
              <div>
                <LocationSvg
                  style={{ color: styles.colors.white, marginRight: 12 }}
                />
              </div>
              <div>
                <Body tag="div" style={{ color: styles.colors.white }}>
                  25 West Fayette Street 6th Floor
                </Body>
                <Body tag="div" style={{ color: styles.colors.white }}>
                  Baltimore, MD 21201
                </Body>
              </div>
            </div>
            <Body
              tag="div"
              style={{
                fontSize: 14,
                color: styles.colors.white,
                opacity: 0.6,
                marginBottom: isDesktop ? null : 16,
              }}
            >
              © 2023 Sweeten. All rights reserved.
            </Body>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: 259,
              }}
            >
              <div>
                <a
                  href="https://sweeten.com/privacy-policy"
                  style={{
                    fontSize: 14,
                    fontWeight: "bold",
                    color: styles.colors.white,
                  }}
                >
                  Privacy Policy
                </a>
              </div>
              <div>
                <a
                  href="https://sweeten.com/terms-of-use"
                  style={{
                    fontSize: 14,
                    fontWeight: "bold",
                    color: styles.colors.white,
                  }}
                >
                  Terms & Conditions
                </a>
              </div>
            </div>
          </div>
        </div>
        {showLearnMoreModal && (
          <WaitlistModal onClose={() => toggleLearnMoreModal(false)} />
        )}
      </div>
    </div>
  );
};

export default Footer;
