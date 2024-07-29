import { StyleSheet, css } from "aphrodite/no-important";
import { styles } from "@sweeten/oreo";

const ss = StyleSheet.create({
  overlay: {
    width: "100%",
    backgroundColor: "rgba(0,0,0,.5)",
  },
  loadingImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    margin: "auto",
    width: 80,
    height: 80,
  },
});

const SvgLoading = ({ svgFillColor, width = 40, height = 40 }) => (
  <svg
    width={width}
    height={height}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    preserveAspectRatio="xMidYMid"
    className="lds-ellipsis"
    style={{ background: "none" }}
  >
    <circle cx="84" cy="50" r="0.219574" fill={svgFillColor}>
      <animate
        attributeName="r"
        values="10;0;0;0;0"
        keyTimes="0;0.25;0.5;0.75;1"
        keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1"
        calcMode="spline"
        dur="1.8s"
        repeatCount="indefinite"
        begin="0s"
      />
      <animate
        attributeName="cx"
        values="84;84;84;84;84"
        keyTimes="0;0.25;0.5;0.75;1"
        keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1"
        calcMode="spline"
        dur="1.8s"
        repeatCount="indefinite"
        begin="0s"
      />
    </circle>
    <circle cx="83.2534" cy="50" r="10" fill={svgFillColor}>
      <animate
        attributeName="r"
        values="0;10;10;10;0"
        keyTimes="0;0.25;0.5;0.75;1"
        keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1"
        calcMode="spline"
        dur="1.8s"
        repeatCount="indefinite"
        begin="-0.9s"
      />
      <animate
        attributeName="cx"
        values="16;16;50;84;84"
        keyTimes="0;0.25;0.5;0.75;1"
        keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1"
        calcMode="spline"
        dur="1.8s"
        repeatCount="indefinite"
        begin="-0.9s"
      />
    </circle>
    <circle cx="49.2534" cy="50" r="10" fill={svgFillColor}>
      <animate
        attributeName="r"
        values="0;10;10;10;0"
        keyTimes="0;0.25;0.5;0.75;1"
        keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1"
        calcMode="spline"
        dur="1.8s"
        repeatCount="indefinite"
        begin="-0.45s"
      />
      <animate
        attributeName="cx"
        values="16;16;50;84;84"
        keyTimes="0;0.25;0.5;0.75;1"
        keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1"
        calcMode="spline"
        dur="1.8s"
        repeatCount="indefinite"
        begin="-0.45s"
      />
    </circle>
    <circle cx="16" cy="50" r="9.78043" fill={svgFillColor}>
      <animate
        attributeName="r"
        values="0;10;10;10;0"
        keyTimes="0;0.25;0.5;0.75;1"
        keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1"
        calcMode="spline"
        dur="1.8s"
        repeatCount="indefinite"
        begin="0s"
      />
      <animate
        attributeName="cx"
        values="16;16;50;84;84"
        keyTimes="0;0.25;0.5;0.75;1"
        keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1"
        calcMode="spline"
        dur="1.8s"
        repeatCount="indefinite"
        begin="0s"
      />
    </circle>
    <circle cx="16" cy="50" r="0" fill={svgFillColor}>
      <animate
        attributeName="r"
        values="0;0;10;10;10"
        keyTimes="0;0.25;0.5;0.75;1"
        keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1"
        calcMode="spline"
        dur="1.8s"
        repeatCount="indefinite"
        begin="0s"
      />
      <animate
        attributeName="cx"
        values="16;16;16;50;84"
        keyTimes="0;0.25;0.5;0.75;1"
        keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1"
        calcMode="spline"
        dur="1.8s"
        repeatCount="indefinite"
        begin="0s"
      />
    </circle>
  </svg>
);

const LoadingOverlay = () => (
  <div className={css(ss.overlay)}>
    <div className={css(ss.loadingImage)}>
      <SvgLoading svgFillColor={styles.colors.white} width={80} height={80} />
    </div>
  </div>
);

export default LoadingOverlay;
