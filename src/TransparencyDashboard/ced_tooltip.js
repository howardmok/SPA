import { Tooltip, styles, Icon } from "@sweeten/oreo";
import { getWindowWidth } from "../shared";

const CEDTooltip = ({ text, position, style }) => {
  const windowWidth = getWindowWidth();

  return (
    <Tooltip
      content={<div>{text}</div>}
      position={
        position ||
        (windowWidth <= styles.breakpoints.tabletSmall ? "bottom" : "right")
      }
      style={style}
    >
      <Icon
        name="help"
        size={16}
        color={styles.colors.grey40}
        style={{ marginLeft: 4 }}
      />
    </Tooltip>
  );
};

export default CEDTooltip;
