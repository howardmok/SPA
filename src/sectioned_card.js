import { Header, styles, Body } from "@sweeten/oreo";
import { css, StyleSheet } from "aphrodite/no-important";
import { Row, Col, Container } from "react-bootstrap";

const ss = StyleSheet.create({
  horizontalLine: {
    margin: "24px -32px 0px",
    borderTop: `1px solid ${styles.colors.grey20}`,
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.tabletStandard,
      style: {
        margin: "24px -16px 0px",
      },
    }),
  },
  container: {
    backgroundColor: styles.colors.white,
    padding: "24px 32px",
    boxSizing: "border-box",
    border: "1px solid #E9ECEF",
    borderRadius: 12,
    boxShadow: "0 8px 16px 0 rgba(0,0,0,0.04)",
    marginBottom: 32,
    width: "100%",
    ":nth-child(1n) label": {
      width: "100%",
    },
    ...styles.mediaQuery({
      maxWidth: styles.breakpoints.tabletStandard,
      style: {
        padding: "24px 16px",
      },
    }),
  },
  buttonContainer: {
    marginTop: 32,
    width: "100%",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
  },
});

const SectionedCard = ({ header, headerText, subtext, body, footer }) => (
  <div className={css(ss.container)}>
    <Container fluid>
      {header || (
        <Row>
          <Col>
            <Header tag="h5" style={{ fontSize: 20 }}>
              {headerText}
            </Header>
          </Col>
        </Row>
      )}
      {subtext && (
        <Body
          tag="p"
          style={{
            color: styles.colors.grey40,
            fontSize: 14,
            marginBottom: 0,
          }}
        >
          {subtext}
        </Body>
      )}
      {(header || headerText || subtext) && (
        <Row>
          <Col>
            <div className={css(ss.horizontalLine)} />
          </Col>
        </Row>
      )}
      {body}
      {footer}
    </Container>
  </div>
);

export default SectionedCard;
