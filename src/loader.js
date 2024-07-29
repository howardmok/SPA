import { Spinner } from "react-bootstrap";
import { styles } from "@sweeten/oreo";

const Loader = () => (
  <div style={{ height: "100%" }}>
    <div style={{ ...styles.center(), height: "100%" }}>
      <Spinner animation="border" role="status" />
    </div>
    <div style={{ marginTop: 8, display: "flex", justifyContent: "center" }}>
      Loading...
    </div>
  </div>
);

export default Loader;
