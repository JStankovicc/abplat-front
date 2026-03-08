import React, { useState } from "react";
import { Box, Typography, Button, Stack } from "@mui/material";
import { useTheme, useMediaQuery } from "@mui/material";
import { tokens } from "../../theme";
import SaveIcon from "@mui/icons-material/Save";
import {
  BasicInfoSection,
  ContactInfoSection,
  SubscriptionSection,
  PaymentMethodsSection,
} from "../../components/company-settings";

const CompanySettings = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [addingPayment, setAddingPayment] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    country: "",
    city: "",
    district: "",
    address: "",
    taxId: "",
    email: "",
    phone: "",
    currency: "RSD",
    supportType: "standard",
    numProfiles: 1,
    packageSize: "medium",
    paymentMethods: [
      { id: 1, type: "bank", details: "Bank: 123-4567812345678", isDefault: true },
    ],
    newPayment: { type: "bank", details: "" },
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) URL.createObjectURL(file);
  };

  const handlePaymentChange = (e) => {
    setFormData({
      ...formData,
      newPayment: { ...formData.newPayment, [e.target.name]: e.target.value },
    });
  };

  const addPaymentMethod = () => {
    if (formData.newPayment.details) {
      setFormData({
        ...formData,
        paymentMethods: [
          ...formData.paymentMethods,
          { ...formData.newPayment, id: Date.now(), isDefault: false },
        ],
        newPayment: { type: "bank", details: "" },
      });
      setAddingPayment(false);
    }
  };

  const removePaymentMethod = (id) => {
    setFormData({
      ...formData,
      paymentMethods: formData.paymentMethods.filter((m) => m.id !== id),
    });
  };

  const setDefaultPayment = (id) => {
    setFormData({
      ...formData,
      paymentMethods: formData.paymentMethods.map((m) => ({
        ...m,
        isDefault: m.id === id,
      })),
    });
  };

  return (
    <Box
      sx={{
        m: isMobile ? "10px" : "20px",
        height: `calc(100vh - ${isMobile ? 80 : 100}px)`,
        overflow: "hidden",
      }}
    >
      <Stack
        direction={isMobile ? "column" : "row"}
        spacing={2}
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography
          variant="h2"
          sx={{
            color: colors.grey[100],
            fontSize: isMobile ? "24px" : "32px",
            fontWeight: 600,
          }}
        >
          Postavke Kompanije
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<SaveIcon />}
          sx={{
            backgroundColor: colors.greenAccent[600],
            "&:hover": { backgroundColor: colors.greenAccent[700] },
          }}
        >
          Sačuvaj
        </Button>
      </Stack>

      <Box sx={{ height: "100%", overflow: "auto", "& > div": { mb: 3 } }}>
        <BasicInfoSection
          formData={formData}
          onChange={handleChange}
          onFileChange={handleFileChange}
          colors={colors}
          isMobile={isMobile}
        />
        <ContactInfoSection
          formData={formData}
          onChange={handleChange}
          colors={colors}
          isMobile={isMobile}
        />
        <SubscriptionSection
          formData={formData}
          onChange={handleChange}
          colors={colors}
          isMobile={isMobile}
        />
        <PaymentMethodsSection
          paymentMethods={formData.paymentMethods}
          addingPayment={addingPayment}
          newPayment={formData.newPayment}
          onAddPayment={addPaymentMethod}
          onCancelAdd={() => setAddingPayment(false)}
          onStartAdd={() => setAddingPayment(true)}
          onRemovePayment={removePaymentMethod}
          onSetDefaultPayment={setDefaultPayment}
          onPaymentChange={handlePaymentChange}
          colors={colors}
          isMobile={isMobile}
        />
      </Box>
    </Box>
  );
};

export default CompanySettings;
