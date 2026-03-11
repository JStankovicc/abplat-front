import React, { useState, useEffect } from "react";
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
import { getCompanySettingsInfo } from "../../services/companyService";

const CompanySettings = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [addingPayment, setAddingPayment] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    companyName: "",
    country: "",
    region: "",
    district: "",
    city: "",
    address: "",
    registrationNumber: "",
    taxId: "",
    email: "",
    phone: "",
    currency: "RSD",
    supportType: "standard",
    supportTypes: [],
    numProfiles: 1,
    packagesNumber: 0,
    packageSize: "medium",
    logoPic: null,
    paymentMethods: [
      { id: 1, type: "bank", details: "Bank: 123-4567812345678", isDefault: true },
    ],
    newPayment: { type: "bank", details: "" },
  });

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getCompanySettingsInfo()
      .then((data) => {
        if (cancelled) return;
        setFormData((prev) => ({
          ...prev,
          companyName: data.companyName ?? "",
          registrationNumber: data.registrationNumber ?? "",
          address: data.address ?? "",
          country: data.country ?? "",
          region: data.region ?? "",
          district: data.district ?? "",
          city: data.city ?? "",
          supportTypes: Array.isArray(data.supportTypes) ? data.supportTypes : [],
          packagesNumber: typeof data.packagesNumber === "number" ? data.packagesNumber : data.packagesNumber ?? 0,
          numProfiles: typeof data.packagesNumber === "number" ? data.packagesNumber : prev.numProfiles,
          logoPic: data.logoPic ?? null,
        }));
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

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
        m: { xs: 1.5, sm: 2, md: "20px" },
        height: { xs: "auto", md: `calc(100vh - 100px)` },
        minHeight: { xs: "100vh", md: "calc(100vh - 100px)" },
        overflow: "hidden",
        pb: 2,
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
