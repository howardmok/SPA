import { Row, Col } from "react-bootstrap";
import Loader from "./loader";
import SectionedCard from "./sectioned_card";

const SectionLoader = ({ sectionTitle }) => (
  <SectionedCard
    headerText={sectionTitle}
    body={
      <Row>
        <Col style={{ marginTop: 16, textAlign: "center" }}>
          <Loader />
        </Col>
      </Row>
    }
  />
);

export default SectionLoader;
