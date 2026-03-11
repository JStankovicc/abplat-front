import { useState, useRef, useLayoutEffect } from "react";
import { MenuItem } from "react-pro-sidebar";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Link } from "react-router-dom";
import { keyframes } from "@emotion/react";
import { tokens } from "../../theme";

const marquee = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
`;

/**
 * Single sidebar menu item.
 * When expanded and text overflows, long titles scroll on hover (marquee).
 * Otherwise text is shown normally with ellipsis.
 */
const SidebarItem = ({
  title,
  to,
  icon,
  selected,
  setSelected,
  onClick,
  disabled = false,
  isCollapsed = false,
  isMobile = false,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const showMarqueeArea = !isCollapsed && !isMobile;
  const [isHovered, setIsHovered] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [marqueeKey, setMarqueeKey] = useState(0);
  const containerRef = useRef(null);
  const measureRef = useRef(null);

  useLayoutEffect(() => {
    if (!showMarqueeArea || !containerRef.current || !measureRef.current) {
      setIsOverflowing(false);
      return;
    }
    const check = () => {
      const container = containerRef.current;
      const measure = measureRef.current;
      if (!container || !measure) return;
      const contentW = measure.offsetWidth;
      const availableW = container.clientWidth;
      setIsOverflowing(contentW >= availableW - 2);
    };
    check();
    const ro = new ResizeObserver(check);
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [title, showMarqueeArea]);

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (isOverflowing) setMarqueeKey((k) => k + 1);
  };

  const titleContent = showMarqueeArea ? (
    <Box
      ref={containerRef}
      sx={{
        overflow: "hidden",
        maxWidth: "100%",
        whiteSpace: "nowrap",
        flex: 1,
        minWidth: 0,
        position: "relative",
      }}
    >
      {isOverflowing ? (
        <Box
          key={marqueeKey}
          sx={{
            display: "inline-flex",
            width: "max-content",
            animation: `${marquee} 12s linear infinite`,
            animationPlayState: isHovered ? "running" : "paused",
          }}
        >
          <Typography component="span" sx={{ pr: 3, flexShrink: 0 }}>
            {title}
          </Typography>
          <Typography component="span" sx={{ pr: 3, flexShrink: 0 }}>
            {title}
          </Typography>
        </Box>
      ) : (
        <Typography sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {title}
        </Typography>
      )}
      <Typography
        component="span"
        ref={measureRef}
        sx={{
          position: "absolute",
          visibility: "hidden",
          whiteSpace: "nowrap",
          pointerEvents: "none",
          left: 0,
          top: 0,
          fontSize: "inherit",
          fontFamily: "inherit",
          fontWeight: "inherit",
          letterSpacing: "inherit",
        }}
      >
        {title}
      </Typography>
    </Box>
  ) : (
    <Typography sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
      {title}
    </Typography>
  );

  return (
    <Box
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      sx={{ width: "100%" }}
    >
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
      {titleContent}
      {to && !disabled && <Link to={to} />}
    </MenuItem>
    </Box>
  );
};

export default SidebarItem;
