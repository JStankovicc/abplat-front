import { MenuItem } from "react-pro-sidebar";
import { Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Link } from "react-router-dom";
import { tokens } from "../../theme";

/**
 * Single sidebar menu item.
 */
const SidebarItem = ({
  title,
  to,
  icon,
  selected,
  setSelected,
  onClick,
  disabled = false,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <MenuItem
      active={selected === title}
      style={{
        color: disabled ? colors.grey[500] : colors.grey[100],
        opacity: disabled ? 0.6 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
      }}
      onClick={() => {
        if (disabled) return;
        setSelected(title);
        if (onClick) onClick();
      }}
      icon={icon}
    >
      <Typography>{title}</Typography>
      {to && !disabled && <Link to={to} />}
    </MenuItem>
  );
};

export default SidebarItem;
