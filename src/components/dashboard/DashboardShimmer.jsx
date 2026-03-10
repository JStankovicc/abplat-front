import { Box, keyframes } from "@mui/material";

const shimmerAnim = keyframes`
  0% { transform: translateX(-100%) skewX(-15deg); }
  100% { transform: translateX(200%) skewX(-15deg); }
`;

const S = ({ colors, width = "100%", height = "14px", borderRadius = "6px", sx = {} }) => (
  <Box
    sx={{
      width,
      height,
      borderRadius,
      backgroundColor: colors.primary[600],
      position: "relative",
      overflow: "hidden",
      "&::before": {
        content: '""',
        position: "absolute",
        top: 0, left: 0, width: "100%", height: "100%",
        background: `linear-gradient(90deg, transparent, ${colors.primary[400]}70, transparent)`,
        animation: `${shimmerAnim} 1.8s infinite`,
      },
      ...sx,
    }}
  />
);

const CardShell = ({ colors, children }) => (
  <Box
    sx={{
      backgroundColor: colors.primary[400],
      borderRadius: "12px",
      p: "15px",
      background: `linear-gradient(135deg, ${colors.primary[400]} 0%, ${colors.primary[500]} 100%)`,
    }}
  >
    {children}
  </Box>
);

/**
 * Full-page loading skeleton for the new dashboard layout.
 */
const DashboardShimmer = ({ colors }) => (
  <Box sx={{ width: "100%" }}>
    {/* Greeting shimmer */}
    <Box
      sx={{
        backgroundColor: colors.primary[400],
        borderRadius: "16px",
        p: "18px 24px",
        mb: 2.5,
        display: "flex",
        alignItems: "center",
        gap: 2,
        background: `linear-gradient(135deg, ${colors.primary[400]} 0%, ${colors.blueAccent[800] || colors.primary[500]} 100%)`,
      }}
    >
      <S colors={colors} width="40px" height="40px" borderRadius="50%" />
      <Box flex={1}>
        <S colors={colors} width="220px" height="20px" borderRadius="6px" sx={{ mb: 0.8 }} />
        <S colors={colors} width="160px" height="13px" borderRadius="4px" />
      </Box>
    </Box>

    {/* Core row: 3 cards */}
    <Box
      display="grid"
      gridTemplateColumns={{ xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }}
      gap={2}
      mb={3}
    >
      {[0, 1, 2].map((i) => (
        <CardShell key={i} colors={colors}>
          <Box display="flex" alignItems="center" gap={1.5} mb="12px">
            <S colors={colors} width="34px" height="34px" borderRadius="50%" />
            <S colors={colors} width="120px" height="15px" />
          </Box>
          <Box sx={{ p: "8px 10px", borderRadius: "8px", bgcolor: `${colors.primary[600]}40`, mb: 1.2 }}>
            <Box display="flex" alignItems="center" gap={1.5}>
              <S colors={colors} width="34px" height="34px" borderRadius="50%" />
              <Box flex={1}>
                <S colors={colors} width="90px" height="12px" sx={{ mb: 0.6 }} />
                <S colors={colors} width="60px" height="10px" />
              </Box>
            </Box>
          </Box>
          <S colors={colors} width="100%" height="11px" sx={{ mb: 0.7 }} />
          <S colors={colors} width="80%" height="11px" sx={{ mb: 0.7 }} />
          <S colors={colors} width="65%" height="11px" />
        </CardShell>
      ))}
    </Box>

    {/* Section header shimmer */}
    <Box display="flex" alignItems="center" gap={1} mb={1.5}>
      <S colors={colors} width="140px" height="18px" borderRadius="6px" />
      <S colors={colors} width="26px" height="18px" borderRadius="999px" />
    </Box>

    {/* Projects row */}
    <Box
      display="grid"
      gridTemplateColumns={{ xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }}
      gap={2}
    >
      {[0, 1, 2].map((i) => (
        <CardShell key={i} colors={colors}>
          <Box display="flex" alignItems="center" gap={1.2} mb={1.2}>
            <S colors={colors} width="32px" height="32px" borderRadius="8px" />
            <Box flex={1}>
              <S colors={colors} width="80px" height="13px" sx={{ mb: 0.6 }} />
              <S colors={colors} width="55px" height="10px" />
            </Box>
          </Box>
          <S colors={colors} width="100%" height="5px" borderRadius="3px" sx={{ mb: 0.8 }} />
          {[1, 2, 3].map((j) => (
            <Box key={j} display="flex" alignItems="center" gap={1} mb={0.6}>
              <S colors={colors} width="6px" height="6px" borderRadius="50%" />
              <S colors={colors} width={`${60 + j * 10}%`} height="10px" />
            </Box>
          ))}
        </CardShell>
      ))}
    </Box>
  </Box>
);

export default DashboardShimmer;
