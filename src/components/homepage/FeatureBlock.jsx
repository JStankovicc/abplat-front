import { Box, Typography, Grid } from "@mui/material";

/**
 * Single feature block with icon/image and text (used in features detail section).
 * @param {string} iconPosition - "left" = icon on left, "right" = icon on right
 */
const FeatureBlock = ({
  title,
  description,
  icon,
  colors,
  blurColor,
  iconPosition = "left",
  tags,
  isLast = false,
}) => {
  const isIconLeft = iconPosition === "left";
  const blurPosition = isIconLeft
    ? { top: -50, left: -50 }
    : { top: -50, right: -50 };

  return (
    <Grid container spacing={5} sx={{ mb: isLast ? 0 : 8 }}>
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          display: "flex",
          alignItems: "center",
          order: { xs: 2, md: isIconLeft ? 2 : 1 },
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              color: colors.grey[100],
              mb: 3,
              fontWeight: 600,
              letterSpacing: "-0.01em",
            }}
          >
            {title}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: colors.grey[300],
              lineHeight: 1.9,
              fontSize: "1.05rem",
              mb: tags ? 3 : 0,
            }}
          >
            {description}
          </Typography>
          {tags && (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
              {tags.map((item) => (
                <Box
                  key={item}
                  sx={{
                    bgcolor: colors.primary[600],
                    px: 2.5,
                    py: 1,
                    borderRadius: 2,
                    border: `1px solid ${colors.grey[700]}`,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      bgcolor: colors.primary[500],
                      border: `1px solid ${colors.greenAccent[500]}40`,
                    },
                  }}
                >
                  <Typography variant="body2" sx={{ color: colors.grey[200], fontWeight: 500 }}>
                    {item}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Grid>
      <Grid item xs={12} md={6} sx={{ order: { xs: 1, md: isIconLeft ? 1 : 2 } }}>
        <Box
          sx={{
            bgcolor: colors.primary[400],
            borderRadius: 3,
            p: 5,
            height: "300px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: `1px solid ${colors.grey[700]}`,
            boxShadow: `0 8px 32px ${colors.primary[900]}40`,
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              ...blurPosition,
              width: 200,
              height: 200,
              borderRadius: "50%",
              bgcolor: blurColor,
              filter: "blur(40px)",
            },
          }}
        >
          {icon}
        </Box>
      </Grid>
    </Grid>
  );
};

export default FeatureBlock;
