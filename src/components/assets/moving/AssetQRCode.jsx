import { Box, Typography } from "@mui/material";
import { QRCodeSVG } from "qrcode.react";

/** Renders QR code based on barcode (or id if barcode is not available). */
const AssetQRCode = ({ value, size = 80, ...boxSx }) => {
  const text = value != null && String(value).trim() !== "" ? String(value) : null;
  return (
    <Box
      sx={{
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 2,
        backgroundColor: "#fff",
        p: 0.5,
        ...boxSx,
      }}
    >
      {text ? (
        <QRCodeSVG value={text} size={size - 8} level="M" />
      ) : (
        <Typography variant="caption" color="text.secondary">
          Nema barcode
        </Typography>
      )}
    </Box>
  );
};

export default AssetQRCode;
