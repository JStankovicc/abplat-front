import { Box, keyframes, useTheme } from "@mui/material";
import { tokens } from "../theme";

const shimmerAnim = keyframes`
  0% { transform: translateX(-100%) skewX(-15deg); }
  100% { transform: translateX(200%) skewX(-15deg); }
`;

const Shimmer = ({ width = "100%", height = "20px", borderRadius = "4px", sx = {} }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isDark = theme.palette.mode === "dark";

  return (
    <Box
      sx={{
        width,
        height,
        borderRadius,
        backgroundColor: isDark ? colors.primary[600] : colors.grey[800],
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: isDark
            ? `linear-gradient(90deg, transparent, ${colors.primary[400]}70, transparent)`
            : "linear-gradient(90deg, transparent, rgba(255,255,255,0.7), transparent)",
          animation: `${shimmerAnim} 1.8s infinite`,
        },
        ...sx,
      }}
    />
  );
};

export default Shimmer;
