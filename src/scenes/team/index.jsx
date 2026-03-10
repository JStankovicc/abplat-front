import { useState, useEffect, useMemo } from "react";
import {
  Box,
  Alert,
  CircularProgress,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useTheme, useMediaQuery } from "@mui/material";
import { tokens } from "../../theme";
import { AddUserDialog, TeamDataGrid, TeamHeader } from "../../components/team";
import { ROLES, getRoleLabel } from "../../config/permissions";
import { useCompanyUsersWithPermissions } from "../../hooks/useCompanyUsersWithPermissions";
import { changeUserRole } from "../../services/userService";

const Team = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { users: fetchedUsers, loading, error, refetch } = useCompanyUsersWithPermissions();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (!loading && Array.isArray(fetchedUsers)) {
      setUsers(fetchedUsers);
    }
  }, [loading, fetchedUsers]);

  const [nameSearch, setNameSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [roleChangeError, setRoleChangeError] = useState(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const filteredUsers = useMemo(() => {
    let list = users;
    const q = (nameSearch ?? "").trim().toLowerCase();
    if (q) {
      list = list.filter((u) => (u.name ?? "").toLowerCase().includes(q));
    }
    if (roleFilter) {
      list = list.filter((u) => u.roles && u.roles[roleFilter] === true);
    }
    return list;
  }, [users, nameSearch, roleFilter]);

  const userCount = users.length;
  const maxUsers = 999;
  const rolesList = ROLES;

  const handleRoleChange = async (userId, role) => {
    const prevUsers = users;
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId
          ? { ...user, roles: { ...user.roles, [role]: !user.roles[role] } }
          : user
      )
    );
    try {
      await changeUserRole(userId, role);
      setRoleChangeError(null);
    } catch (err) {
      setUsers(prevUsers);
      const status = err.response?.status;
      const msg =
        status === 403
          ? "Zabranjeno (403). Izmena uloga je dozvoljena samo korisnicima sa Admin dozvolom. Proverite da li vaš nalog ima ulogu Admin."
          : err.response?.data?.message ??
            "Greška pri izmeni uloge. Uloga nije sačuvana.";
      setRoleChangeError(msg);
    }
  };

  const handleAddUser = () => {
    const addedUser = {
      id: users.length + 1,
      name: `${newUser.firstName} ${newUser.lastName}`,
      email: newUser.email,
      profilePic: null,
      roles: ROLES.reduce((acc, r) => ({ ...acc, [r]: false }), {}),
    };
    setUsers((prev) => [...prev, addedUser]);
    setOpenAddDialog(false);
    setNewUser({ firstName: "", lastName: "", email: "", password: "" });
  };

  return (
    <Box
      m={{ xs: 1.5, sm: 2, md: "20px" }}
      sx={{
        maxHeight: "calc(100vh - 74px)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        pb: 2,
      }}
    >
      <TeamHeader
        onAddUser={() => setOpenAddDialog(true)}
        userCount={userCount}
        maxUsers={maxUsers}
        colors={colors}
        isMobile={isMobile}
      />

      <AddUserDialog
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        newUser={newUser}
        onChange={setNewUser}
        onSubmit={handleAddUser}
        colors={colors}
        isMobile={isMobile}
      />

      {error && (
        <Alert severity="error" sx={{ mb: 2, flexShrink: 0 }}>
          {error}
        </Alert>
      )}
      {roleChangeError && (
        <Alert
          severity="warning"
          sx={{ mb: 2, flexShrink: 0 }}
          onClose={() => setRoleChangeError(null)}
        >
          {roleChangeError}
        </Alert>
      )}

      {loading ? (
        <Box
          flex={1}
          minHeight={0}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <CircularProgress sx={{ color: colors.greenAccent[500] }} />
        </Box>
      ) : (
        <>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{ mb: 2, flexShrink: 0 }}
            alignItems={{ xs: "stretch", sm: "center" }}
          >
            <TextField
              placeholder="Pretraži po imenu..."
              value={nameSearch}
              onChange={(e) => setNameSearch(e.target.value)}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: colors.grey[400] }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                maxWidth: { sm: 280 },
                "& .MuiOutlinedInput-root": {
                  backgroundColor: colors.primary[400],
                  "& fieldset": { borderColor: colors.primary[300] },
                  "&:hover fieldset": { borderColor: colors.greenAccent[600] },
                },
                "& .MuiInputBase-input": { color: colors.grey[100] },
              }}
            />
            <FormControl size="small" sx={{ minWidth: { xs: "100%", sm: 220 } }}>
              <InputLabel id="team-role-filter-label" sx={{ color: colors.grey[400] }}>
                Uloga
              </InputLabel>
              <Select
                labelId="team-role-filter-label"
                label="Uloga"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                sx={{
                  backgroundColor: colors.primary[400],
                  color: colors.grey[100],
                  "& .MuiOutlinedInput-notchedOutline": { borderColor: colors.primary[300] },
                  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: colors.greenAccent[600] },
                }}
              >
                <MenuItem value="">
                  <em>Sve uloge</em>
                </MenuItem>
                {ROLES.map((role) => (
                  <MenuItem key={role} value={role}>
                    {getRoleLabel(role)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
          <Box sx={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
            <TeamDataGrid
              users={filteredUsers}
              onRoleChange={handleRoleChange}
              colors={colors}
              rolesList={rolesList}
              isMobile={isMobile}
              pageSize={10}
            />
          </Box>
        </>
      )}
    </Box>
  );
};

export default Team;
