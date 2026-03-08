import { Stack, Button, Chip } from "@mui/material";
import Header from "../Header";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";

/**
 * Team page header with add user button.
 */
const TeamHeader = ({ onAddUser, userCount, maxUsers, colors, isMobile }) => (
  <Stack
    direction={isMobile ? "column" : "row"}
    spacing={2}
    justifyContent="space-between"
    alignItems="center"
    mb={2}
  >
    <Header title="Upravljanje korisnicima" />
    <Button
      variant="contained"
      color="secondary"
      startIcon={<PersonAddAlt1Icon />}
      disabled={userCount >= maxUsers}
      onClick={onAddUser}
      sx={{
        minWidth: isMobile ? "100%" : "auto",
        mt: isMobile ? 2 : 0,
      }}
    >
      Dodaj novog korisnika
      <Chip
        label={`${userCount}/${maxUsers}`}
        size="small"
        sx={{
          ml: 1,
          backgroundColor: colors.blueAccent[700],
          color: "white",
        }}
      />
    </Button>
  </Stack>
);

export default TeamHeader;
