import React, { useState } from "react";
import { Box, Typography, Card, CardActionArea, Dialog, DialogTitle, DialogContent, DialogActions, Button, useMediaQuery, useTheme } from "@mui/material";

/**
 * Mobile card list - prikazuje minimalne podatke, klik otvara dijalog sa svim detaljima.
 * @param {Array} props.rows - niz objekata
 * @param {Array} props.primaryFields - [{ key, label }] - prikaz na karticama
 * @param {Array} props.detailFields - [{ key, label }] - prikaz u dijalogu
 * @param {Object} props.renderCell - { [key]: (row) => ReactNode } za custom render
 * @param {Object} props.colors - tokens
 */
const MobileDataCards = ({ rows, primaryFields, detailFields, renderCell = {}, colors }) => {
  const [selected, setSelected] = useState(null);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const getValue = (row, key) => {
    if (renderCell[key]) return renderCell[key](row);
    return row[key];
  };

  return (
    <>
      {rows.map((row) => (
        <Card
          key={row.id}
          sx={{
            mb: 1.5,
            bgcolor: colors.primary[400],
            borderRadius: 2,
          }}
        >
          <CardActionArea onClick={() => setSelected(row)} sx={{ p: 2 }}>
            {primaryFields.map(({ key, label }, i) => (
              <Box key={key} display="flex" justifyContent="space-between" alignItems="center" mb={i < primaryFields.length - 1 ? 0.5 : 0}>
                <Typography variant="body2" color={colors.grey[400]}>
                  {label}
                </Typography>
                <Typography variant="body1" color={colors.grey[100]} fontWeight={500}>
                  {getValue(row, key)}
                </Typography>
              </Box>
            ))}
          </CardActionArea>
        </Card>
      ))}
      <Dialog open={!!selected} onClose={() => setSelected(null)} fullScreen={fullScreen}>
        <DialogTitle sx={{ bgcolor: colors.primary[400] }}>
          Detalji
        </DialogTitle>
        <DialogContent sx={{ bgcolor: colors.primary[500], pt: 2 }}>
          {selected && detailFields.map(({ key, label }) => (
            <Box key={key} mb={2}>
              <Typography variant="caption" color={colors.grey[400]}>
                {label}
              </Typography>
              <Typography variant="body1" color={colors.grey[100]}>
                {getValue(selected, key)}
              </Typography>
            </Box>
          ))}
        </DialogContent>
        <DialogActions sx={{ bgcolor: colors.primary[400] }}>
          <Button onClick={() => setSelected(null)} color="secondary">
            Zatvori
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MobileDataCards;
