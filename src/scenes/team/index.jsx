import { useState } from "react";
import { Box } from "@mui/material";
import { useTheme, useMediaQuery } from "@mui/material";
import { tokens } from "../../theme";
import { mockDataTeam } from "../../data/mockData";
import { AddUserDialog, TeamDataGrid, TeamHeader } from "../../components/team";

const Team = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [users, setUsers] = useState(
    mockDataTeam.map((user) => ({
      ...user,
      roles: {
        admin: user.access === "admin",
        manager: user.access === "manager",
        user: user.access === "user",
      },
    }))
  );

  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const userCount = users.length;
  const maxUsers = 10;
  const rolesList = ["admin", "manager", "user"];

  const handleRoleChange = (userId, role) => {
    setUsers(
      users.map((user) =>
        user.id === userId
          ? { ...user, roles: { ...user.roles, [role]: !user.roles[role] } }
          : user
      )
    );
  };

  const handleAddUser = () => {
    const addedUser = {
      id: users.length + 1,
      name: `${newUser.firstName} ${newUser.lastName}`,
      email: newUser.email,
      age: 25,
      phone: "N/A",
      access: "user",
      roles: { user: true },
    };
    setUsers([...users, addedUser]);
    setOpenAddDialog(false);
    setNewUser({ firstName: "", lastName: "", email: "", password: "" });
  };

  return (
    <Box m={isMobile ? "10px" : "20px"}>
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

      <TeamDataGrid
        users={users}
        onRoleChange={handleRoleChange}
        colors={colors}
        rolesList={rolesList}
        isMobile={isMobile}
      />
    </Box>
  );
};

export default Team;
