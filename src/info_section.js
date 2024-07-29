import { StyleSheet, css } from "aphrodite/no-important";

const ss = StyleSheet.create({
  info: {
    borderRadius: 8,
    background: "rgba(77, 114, 214, 0.04)",
    padding: 16,
    color: "#4D72D6",
  },
});

const InfoSection = ({ header, subtext, style }) => (
  <div className={css(ss.info)} style={style}>
    {header && (
      <b>
        <span role="img" aria-label="sparkle" style={{ marginRight: 4 }}>
          ✨
        </span>
        {header}
      </b>
    )}
    <div style={{ marginTop: header ? 16 : 0 }}>{subtext}</div>
  </div>
);

export default InfoSection;
