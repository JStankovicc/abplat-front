import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    useTheme,
    IconButton,
    useMediaQuery,
    Button,
    Chip,
    Stack,
    Checkbox,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Grid
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataTeam } from "../../data/mockData";
import Header from "../../components/Header";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";

const Team = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const navigate = useNavigate();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    // MOCK DATA
    const [users, setUsers] = useState(
        mockDataTeam.map(user => ({
            ...user,
            roles: {
                admin: user.access === "admin",
                manager: user.access === "manager",
                user: user.access === "user"
            }
        }))
    );

    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [newUser, setNewUser] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    });

    const userCount = users.length;
    const maxUsers = 10;
    const rolesList = ["admin", "manager", "user"];

    const handleRoleChange = (userId, role) => {
        setUsers(users.map(user =>
            user.id === userId ? {
                ...user,
                roles: { ...user.roles, [role]: !user.roles[role] }
            } : user
        ));
    };

    const handleAddUser = () => {
        const addedUser = {
            id: users.length + 1,
            name: `${newUser.firstName} ${newUser.lastName}`,
            email: newUser.email,
            age: 25,
            phone: "N/A",
            access: "user",
            roles: { user: true }
        };

        setUsers([...users, addedUser]);
        setOpenAddDialog(false);
        setNewUser({ firstName: '', lastName: '', email: '', password: '' });
    };


    const columns = [
        {
            field: "name",
            headerName: "Ime",
            flex: 1,
            minWidth: 150,
            cellClassName: "name-column--cell",
        },
        {
            field: "email",
            headerName: "Email",
            flex: 1,
            minWidth: 200,
            hide: isMobile
        },
        ...rolesList.map(role => ({
            field: role,
            headerName: role.toUpperCase(),
            flex: 0.8,
            minWidth: 100,
            renderCell: ({ row }) => (
                <Checkbox
                    checked={row.roles[role]}
                    onChange={() => handleRoleChange(row.id, role)}
                    color="secondary"
                    sx={{
                        '& .MuiSvgIcon-root': { fontSize: isMobile ? 18 : 24 }
                    }}
                />
            )
        })),
        {
            field: "actions",
            headerName: "Detalji",
            flex: 0.5,
            minWidth: 80,
            renderCell: (params) => (
                <IconButton
                    onClick={() => navigate(`/user/${params.row.id}`)}
                    color="secondary"
                    size="small"
                >
                    <ArrowForwardIosIcon fontSize={isMobile ? "small" : "medium"} />
                </IconButton>
            ),
        },
    ];

    return (
        <Box m={isMobile ? "10px" : "20px"}>
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
                    onClick={() => setOpenAddDialog(true)}
                    sx={{
                        minWidth: isMobile ? "100%" : "auto",
                        mt: isMobile ? 2 : 0
                    }}
                >
                    Dodaj novog korisnika
                    <Chip
                        label={`${userCount}/${maxUsers}`}
                        size="small"
                        sx={{
                            ml: 1,
                            backgroundColor: colors.blueAccent[700],
                            color: "white"
                        }}
                    />
                </Button>
            </Stack>


            {/* Add new user dialog */}
            <Dialog
                open={openAddDialog}
                onClose={() => setOpenAddDialog(false)}
                PaperProps={{
                    sx: {
                        backgroundColor: colors.primary[400],
                        color: colors.grey[100],
                        minWidth: isMobile ? '90%' : '400px'
                    }
                }}
            >
                <DialogTitle>Dodaj novog korisnika</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Ime"
                                value={newUser.firstName}
                                onChange={(e) => setNewUser({...newUser, firstName: e.target.value})}
                                required
                                sx={{ mb: 2 }}
                                InputProps={{ style: { color: colors.grey[100] } }}
                                InputLabelProps={{ style: { color: colors.grey[100] } }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Prezime"
                                value={newUser.lastName}
                                onChange={(e) => setNewUser({...newUser, lastName: e.target.value})}
                                required
                                sx={{ mb: 2 }}
                                InputProps={{ style: { color: colors.grey[100] } }}
                                InputLabelProps={{ style: { color: colors.grey[100] } }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Email"
                                type="email"
                                value={newUser.email}
                                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                                required
                                sx={{ mb: 2 }}
                                InputProps={{ style: { color: colors.grey[100] } }}
                                InputLabelProps={{ style: { color: colors.grey[100] } }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Šifra"
                                type="password"
                                value={newUser.password}
                                onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                                required
                                InputProps={{ style: { color: colors.grey[100] } }}
                                InputLabelProps={{ style: { color: colors.grey[100] } }}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setOpenAddDialog(false)}
                        color="secondary"
                    >
                        Otkaži
                    </Button>
                    <Button
                        onClick={handleAddUser}
                        color="secondary"
                        variant="contained"
                        disabled={!newUser.firstName || !newUser.lastName || !newUser.email || !newUser.password}
                    >
                        Dodaj
                    </Button>
                </DialogActions>
            </Dialog>

            <Box
                mt={isMobile ? "20px" : "40px"}
                height="75vh"
                sx={{
                    "& .MuiDataGrid-root": { border: "none" },
                    "& .MuiDataGrid-cell": {
                        borderBottom: "none",
                        fontSize: isMobile ? "10px" : "14px",
                        padding: isMobile ? "4px" : "8px 16px"
                    },
                    "& .name-column--cell": {
                        color: colors.greenAccent[300],
                        fontSize: isMobile ? "12px" : "16px"
                    },
                    "& .MuiDataGrid-columnHeaders": {
                        backgroundColor: colors.blueAccent[700],
                        borderBottom: "none",
                        fontSize: isMobile ? "10px" : "14px"
                    },
                    "& .MuiDataGrid-virtualScroller": {
                        backgroundColor: colors.primary[400],
                    },
                    "& .MuiDataGrid-footerContainer": {
                        borderTop: "none",
                        backgroundColor: colors.blueAccent[700],
                    },
                }}
            >
                <DataGrid
                    rows={users}
                    columns={columns}
                    disableRowSelectionOnClick
                    autoPageSize
                    density={isMobile ? "compact" : "standard"}
                    disableColumnMenu
                    sx={{
                        '& .MuiDataGrid-columnHeaderTitle': {
                            fontSize: isMobile ? '12px' : '14px'
                        }
                    }}
                />
            </Box>
        </Box>
    );
};

export default Team;