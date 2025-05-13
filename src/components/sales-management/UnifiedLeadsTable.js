import { useState } from "react";
import {
    Box,
    Paper,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Grid,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tabs,
    Tab,
    useTheme,
    useMediaQuery,
    Menu,
    MenuItem,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Divider,
    Chip,
    TablePagination
} from "@mui/material";
import { tokens } from "../../theme";
import { 
    Add as AddIcon, 
    Edit as EditIcon, 
    Delete as DeleteIcon, 
    Person as PersonIcon, 
    Business as BusinessIcon,
    MoreVert as MoreVertIcon,
    FileUpload as FileUploadIcon,
    FileDownload as FileDownloadIcon,
    Group as GroupIcon,
    Visibility as VisibilityIcon
} from "@mui/icons-material";

// Mock podaci za liste klijenata
const mockClientLists = [
    {
        id: 1,
        name: "Glavni klijenti",
        description: "Lista najvažnijih klijenata",
        type: "contacts",
        count: 25,
        region: "Beograd",
        product: "ERP sistem",
        team: "Tim A",
        lastUpdated: "2024-03-15",
        settings: {
            autoAssign: true,
            notificationEnabled: true,
            priorityLevel: "High",
            followUpDays: 7,
            customFields: ["Segment", "Potencijal", "Istorija"]
        },
        notes: [
            {
                id: 1,
                text: "Fokus na klijente iz IT sektora",
                date: "2024-03-10",
                author: "Marko Marković"
            },
            {
                id: 2,
                text: "Planirati sastanke za Q2",
                date: "2024-03-12",
                author: "Ana Jovanović"
            }
        ],
        goals: {
            monthlyTarget: 100000,
            currentProgress: 75000,
            conversionRate: 0.35,
            targetClients: 50,
            achievedClients: 25
        },
        metrics: {
            averageResponseTime: "2h",
            successRate: 0.85,
            lastMonthGrowth: 0.15,
            customerSatisfaction: 4.5
        }
    },
    {
        id: 2,
        name: "Potencijalni klijenti",
        description: "Lista potencijalnih klijenata",
        type: "leads",
        count: 50,
        region: "Novi Sad",
        product: "CRM sistem",
        team: "Tim B",
        lastUpdated: "2024-03-14",
        settings: {
            autoAssign: false,
            notificationEnabled: true,
            priorityLevel: "Medium",
            followUpDays: 14,
            customFields: ["Izvor", "Interes", "Budžet"]
        },
        notes: [
            {
                id: 1,
                text: "Fokus na startap kompanije",
                date: "2024-03-08",
                author: "Petar Petrović"
            }
        ],
        goals: {
            monthlyTarget: 50000,
            currentProgress: 30000,
            conversionRate: 0.25,
            targetClients: 100,
            achievedClients: 50
        },
        metrics: {
            averageResponseTime: "4h",
            successRate: 0.65,
            lastMonthGrowth: 0.25,
            customerSatisfaction: 4.2
        }
    },
    {
        id: 3,
        name: "VIP Klijenti",
        description: "Lista VIP klijenata",
        type: "contacts",
        count: 15,
        region: "Beograd",
        product: "Enterprise Solution",
        team: "Tim A",
        lastUpdated: "2024-03-16",
        settings: {
            autoAssign: true,
            notificationEnabled: true,
            priorityLevel: "Critical",
            followUpDays: 3,
            customFields: ["VIP Level", "Dedicated Manager", "Special Requirements"]
        },
        notes: [
            {
                id: 1,
                text: "Redovni mesečni sastanci",
                date: "2024-03-15",
                author: "Jovana Nikolić"
            }
        ],
        goals: {
            monthlyTarget: 200000,
            currentProgress: 150000,
            conversionRate: 0.45,
            targetClients: 20,
            achievedClients: 15
        },
        metrics: {
            averageResponseTime: "1h",
            successRate: 0.95,
            lastMonthGrowth: 0.10,
            customerSatisfaction: 4.8
        }
    }
];

// Mock podaci za timove
const mockTeams = [
    { id: 1, name: "Tim A" },
    { id: 2, name: "Tim B" },
    { id: 3, name: "Tim C" }
];

// Mock podaci za klijente
const mockClients = [
    {
        id: 1,
        name: "Petar Petrović",
        company: "Tech Solutions",
        email: "petar.petrovic@techsolutions.com",
        phone: "+381 64 123 4567",
        list: "Glavni klijenti",
        team: "Tim A",
        status: "Aktivan",
        lastContact: "2024-03-15",
        notes: "Interesovan za ERP modul",
        customFields: {
            Segment: "IT",
            Potencijal: "Visok",
            Istorija: "2 godine"
        }
    },
    {
        id: 2,
        name: "Ana Jovanović",
        company: "Digital Systems",
        email: "ana.jovanovic@digitalsystems.com",
        phone: "+381 64 234 5678",
        list: "Potencijalni klijenti",
        team: "Tim B",
        status: "Novi",
        lastContact: "2024-03-14",
        notes: "Novi lead iz LinkedIn-a",
        customFields: {
            Izvor: "LinkedIn",
            Interes: "CRM",
            Budžet: "50-100k"
        }
    },
    {
        id: 3,
        name: "Marko Nikolić",
        company: "Global Tech",
        email: "marko.nikolic@globaltech.com",
        phone: "+381 64 345 6789",
        list: "VIP Klijenti",
        team: "Tim A",
        status: "Aktivan",
        lastContact: "2024-03-16",
        notes: "VIP klijent - prioritet",
        customFields: {
            "VIP Level": "Platinum",
            "Dedicated Manager": "Jovana Nikolić",
            "Special Requirements": "24/7 podrška"
        }
    },
    {
        id: 4,
        name: "Jovana Petrović",
        company: "Smart Solutions",
        email: "jovana.petrovic@smartsolutions.com",
        phone: "+381 64 456 7890",
        list: "Glavni klijenti",
        team: "Tim A",
        status: "Aktivan",
        lastContact: "2024-03-13",
        notes: "Interesovan za custom rešenja",
        customFields: {
            Segment: "IT",
            Potencijal: "Srednji",
            Istorija: "1 godina"
        }
    },
    {
        id: 5,
        name: "Stefan Jovanović",
        company: "Future Tech",
        email: "stefan.jovanovic@futuretech.com",
        phone: "+381 64 567 8901",
        list: "Potencijalni klijenti",
        team: "Tim B",
        status: "Novi",
        lastContact: "2024-03-12",
        notes: "Startap kompanija",
        customFields: {
            Izvor: "Website",
            Interes: "ERP",
            Budžet: "25-50k"
        }
    }
];

// Mock podaci za liste leadova
const mockLeadLists = [
    {
        id: 1,
        name: "Potencijalni klijenti",
        description: "Lista potencijalnih klijenata",
        type: "leads",
        count: 50,
        region: "Novi Sad",
        product: "CRM sistem",
        team: "Tim B",
        lastUpdated: "2024-03-14",
        settings: {
            autoAssign: false,
            notificationEnabled: true,
            priorityLevel: "Medium",
            followUpDays: 14,
            customFields: ["Izvor", "Interes", "Budžet"]
        },
        notes: [
            {
                id: 1,
                text: "Fokus na startap kompanije",
                date: "2024-03-08",
                author: "Petar Petrović"
            }
        ],
        goals: {
            monthlyTarget: 50000,
            currentProgress: 30000,
            conversionRate: 0.25,
            targetClients: 100,
            achievedClients: 50
        },
        metrics: {
            averageResponseTime: "4h",
            successRate: 0.65,
            lastMonthGrowth: 0.25,
            customerSatisfaction: 4.2
        }
    }
];

const UnifiedLeadsTable = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isMobile = useMediaQuery("(max-width:768px)");
    const [clientLists, setClientLists] = useState(mockClientLists);
    const [activeTab, setActiveTab] = useState(0);
    const [openDialog, setOpenDialog] = useState(false);
    const [openTeamDialog, setOpenTeamDialog] = useState(false);
    const [selectedList, setSelectedList] = useState(null);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        type: "contacts",
        region: "",
        product: "",
        team: ""
    });
    const [openTeamDetails, setOpenTeamDetails] = useState(false);
    const [selectedTeamDetails, setSelectedTeamDetails] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage] = useState(5);
    const [clients, setClients] = useState(mockClients);
    const [openListDetails, setOpenListDetails] = useState(false);
    const [selectedListDetails, setSelectedListDetails] = useState(null);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const handleOpenDialog = (list = null) => {
        if (list) {
            setSelectedList(list);
            setFormData(list);
        } else {
            setSelectedList(null);
            setFormData({
                name: "",
                description: "",
                type: "contacts",
                region: "",
                product: "",
                team: ""
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedList(null);
    };

    const handleOpenTeamDialog = (list) => {
        setSelectedList(list);
        setSelectedTeam(list.team);
        setOpenTeamDialog(true);
    };

    const handleCloseTeamDialog = () => {
        setOpenTeamDialog(false);
        setSelectedList(null);
        setSelectedTeam(null);
    };

    const handleMenuClick = (event, list) => {
        setAnchorEl(event.currentTarget);
        setSelectedList(list);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedList(null);
    };

    const handleSubmit = () => {
        const newList = {
            ...formData,
            id: selectedList ? selectedList.id : clientLists.length + 1,
            count: selectedList ? selectedList.count : 0,
            lastUpdated: new Date().toISOString().split('T')[0]
        };

        if (selectedList) {
            setClientLists(clientLists.map(list => 
                list.id === selectedList.id ? newList : list
            ));
        } else {
            setClientLists([...clientLists, newList]);
        }
        handleCloseDialog();
    };

    const handleTeamChange = () => {
        setClientLists(clientLists.map(list => 
            list.id === selectedList.id 
                ? { ...list, team: selectedTeam }
                : list
        ));
        handleCloseTeamDialog();
    };

    const handleDelete = (id) => {
        setClientLists(clientLists.filter(list => list.id !== id));
    };

    const handleExportCSV = (list) => {
        // Implementacija eksporta u CSV
        console.log(`Exporting list ${list.id} to CSV`);
    };

    const handleImportCSV = (list) => {
        // Implementacija uvoza iz CSV
        console.log(`Importing CSV to list ${list.id}`);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleOpenTeamDetails = (teamName) => {
        const teamDetails = mockTeams.find(team => team.name === teamName);
        setSelectedTeamDetails(teamDetails);
        setOpenTeamDetails(true);
    };

    const handleCloseTeamDetails = () => {
        setOpenTeamDetails(false);
        setSelectedTeamDetails(null);
    };

    const handleOpenListDetails = (list) => {
        setSelectedListDetails(list);
        setOpenListDetails(true);
    };

    const handleCloseListDetails = () => {
        setOpenListDetails(false);
        setSelectedListDetails(null);
    };

    return (
        <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <Typography variant="h5" color={colors.grey[100]}>
                    Upravljanje listama klijenata
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                    sx={{
                        backgroundColor: colors.greenAccent[500],
                        "&:hover": {
                            backgroundColor: colors.greenAccent[600]
                        }
                    }}
                >
                    Nova lista
                </Button>
            </Box>

            <Tabs
                value={activeTab}
                onChange={handleTabChange}
                sx={{
                    mb: 2,
                    '& .MuiTabs-indicator': {
                        backgroundColor: colors.greenAccent[500]
                    }
                }}
            >
                <Tab
                    icon={<BusinessIcon />}
                    label="Liste klijenata"
                    sx={{
                        color: colors.grey[100],
                        '&.Mui-selected': {
                            color: colors.greenAccent[500]
                        }
                    }}
                />
                <Tab
                    icon={<GroupIcon />}
                    label="Potencijalni klijenti"
                    sx={{
                        color: colors.grey[100],
                        '&.Mui-selected': {
                            color: colors.greenAccent[500]
                        }
                    }}
                />
                <Tab
                    icon={<PersonIcon />}
                    label="Pojedinačni klijenti"
                    sx={{
                        color: colors.grey[100],
                        '&.Mui-selected': {
                            color: colors.greenAccent[500]
                        }
                    }}
                />
            </Tabs>

            {activeTab === 0 ? (
                <Grid container spacing={2}>
                    {clientLists.map((list) => (
                        <Grid item xs={12} key={list.id}>
                            <Paper
                                sx={{
                                    p: 2,
                                    backgroundColor: colors.primary[600],
                                    color: colors.grey[100],
                                    cursor: 'pointer',
                                    '&:hover': {
                                        backgroundColor: colors.primary[500]
                                    }
                                }}
                                onClick={() => handleOpenListDetails(list)}
                            >
                                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                                    <Box>
                                        <Typography variant="h6">{list.name}</Typography>
                                        <Typography variant="body2" color={colors.grey[300]}>
                                            {list.description}
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <IconButton
                                            size="small"
                                            onClick={(e) => handleMenuClick(e, list)}
                                            sx={{ color: colors.grey[100] }}
                                        >
                                            <MoreVertIcon />
                                        </IconButton>
                                    </Box>
                                </Box>

                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={3}>
                                        <Typography variant="body2" color={colors.grey[300]}>
                                            Region: {list.region}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                        <Typography variant="body2" color={colors.grey[300]}>
                                            Proizvod: {list.product}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                        <Typography 
                                            variant="body2" 
                                            color={colors.grey[300]}
                                            sx={{ 
                                                cursor: 'pointer',
                                                '&:hover': {
                                                    color: colors.greenAccent[500]
                                                }
                                            }}
                                            onClick={() => handleOpenTeamDetails(list.team)}
                                        >
                                            Tim: {list.team}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                        <Typography variant="body2" color={colors.grey[300]}>
                                            Broj klijenata: {list.count}
                                        </Typography>
                                    </Grid>
                                </Grid>

                                <Box sx={{ mt: 2 }}>
                                    <TableContainer>
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell sx={{ color: colors.grey[100] }}>Ime</TableCell>
                                                    <TableCell sx={{ color: colors.grey[100] }}>Kompanija</TableCell>
                                                    <TableCell sx={{ color: colors.grey[100] }}>Email</TableCell>
                                                    <TableCell sx={{ color: colors.grey[100] }}>Telefon</TableCell>
                                                    <TableCell sx={{ color: colors.grey[100] }}>Status</TableCell>
                                                    <TableCell sx={{ color: colors.grey[100] }}>Akcije</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {clients
                                                    .filter(client => client.list === list.name)
                                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                    .map((client) => (
                                                        <TableRow key={client.id}>
                                                            <TableCell sx={{ color: colors.grey[100] }}>{client.name}</TableCell>
                                                            <TableCell sx={{ color: colors.grey[100] }}>{client.company}</TableCell>
                                                            <TableCell sx={{ color: colors.grey[100] }}>{client.email}</TableCell>
                                                            <TableCell sx={{ color: colors.grey[100] }}>{client.phone}</TableCell>
                                                            <TableCell sx={{ color: colors.grey[100] }}>
                                                                <Chip
                                                                    label={client.status}
                                                                    size="small"
                                                                    sx={{
                                                                        backgroundColor: client.status === "Aktivan" 
                                                                            ? colors.greenAccent[500] 
                                                                            : colors.blueAccent[500],
                                                                        color: colors.grey[100]
                                                                    }}
                                                                />
                                                            </TableCell>
                                                            <TableCell>
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={() => {/* Implementacija pregleda klijenta */}}
                                                                    sx={{ color: colors.grey[100] }}
                                                                >
                                                                    <VisibilityIcon />
                                                                </IconButton>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    <TablePagination
                                        component="div"
                                        count={clients.filter(client => client.list === list.name).length}
                                        page={page}
                                        onPageChange={handleChangePage}
                                        rowsPerPage={rowsPerPage}
                                        rowsPerPageOptions={[5]}
                                        sx={{
                                            color: colors.grey[100],
                                            '.MuiTablePagination-select': {
                                                color: colors.grey[100]
                                            },
                                            '.MuiTablePagination-selectIcon': {
                                                color: colors.grey[100]
                                            }
                                        }}
                                    />
                                </Box>

                                <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                                    <Button
                                        size="small"
                                        startIcon={<FileUploadIcon />}
                                        onClick={() => handleImportCSV(list)}
                                    >
                                        Uvezi CSV
                                    </Button>
                                    <Button
                                        size="small"
                                        startIcon={<FileDownloadIcon />}
                                        onClick={() => handleExportCSV(list)}
                                    >
                                        Izvezi CSV
                                    </Button>
                                </Box>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            ) : activeTab === 1 ? (
                <Grid container spacing={2}>
                    {mockLeadLists.map((list) => (
                        <Grid item xs={12} key={list.id}>
                            <Paper
                                sx={{
                                    p: 2,
                                    backgroundColor: colors.primary[600],
                                    color: colors.grey[100],
                                    cursor: 'pointer',
                                    '&:hover': {
                                        backgroundColor: colors.primary[500]
                                    }
                                }}
                                onClick={() => handleOpenListDetails(list)}
                            >
                                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                                    <Box>
                                        <Typography variant="h6">{list.name}</Typography>
                                        <Typography variant="body2" color={colors.grey[300]}>
                                            {list.description}
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <IconButton
                                            size="small"
                                            onClick={(e) => handleMenuClick(e, list)}
                                            sx={{ color: colors.grey[100] }}
                                        >
                                            <MoreVertIcon />
                                        </IconButton>
                                    </Box>
                                </Box>

                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={3}>
                                        <Typography variant="body2" color={colors.grey[300]}>
                                            Region: {list.region}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                        <Typography variant="body2" color={colors.grey[300]}>
                                            Proizvod: {list.product}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                        <Typography 
                                            variant="body2" 
                                            color={colors.grey[300]}
                                            sx={{ 
                                                cursor: 'pointer',
                                                '&:hover': {
                                                    color: colors.greenAccent[500]
                                                }
                                            }}
                                            onClick={() => handleOpenTeamDetails(list.team)}
                                        >
                                            Tim: {list.team}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                        <Typography variant="body2" color={colors.grey[300]}>
                                            Broj leadova: {list.count}
                                        </Typography>
                                    </Grid>
                                </Grid>

                                <Box sx={{ mt: 2 }}>
                                    <TableContainer>
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell sx={{ color: colors.grey[100] }}>Ime</TableCell>
                                                    <TableCell sx={{ color: colors.grey[100] }}>Kompanija</TableCell>
                                                    <TableCell sx={{ color: colors.grey[100] }}>Email</TableCell>
                                                    <TableCell sx={{ color: colors.grey[100] }}>Telefon</TableCell>
                                                    <TableCell sx={{ color: colors.grey[100] }}>Izvor</TableCell>
                                                    <TableCell sx={{ color: colors.grey[100] }}>Interes</TableCell>
                                                    <TableCell sx={{ color: colors.grey[100] }}>Budžet</TableCell>
                                                    <TableCell sx={{ color: colors.grey[100] }}>Akcije</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {clients
                                                    .filter(client => client.list === list.name)
                                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                    .map((client) => (
                                                        <TableRow key={client.id}>
                                                            <TableCell sx={{ color: colors.grey[100] }}>{client.name}</TableCell>
                                                            <TableCell sx={{ color: colors.grey[100] }}>{client.company}</TableCell>
                                                            <TableCell sx={{ color: colors.grey[100] }}>{client.email}</TableCell>
                                                            <TableCell sx={{ color: colors.grey[100] }}>{client.phone}</TableCell>
                                                            <TableCell sx={{ color: colors.grey[100] }}>
                                                                <Chip
                                                                    label={client.customFields.Izvor}
                                                                    size="small"
                                                                    sx={{
                                                                        backgroundColor: colors.blueAccent[500],
                                                                        color: colors.grey[100]
                                                                    }}
                                                                />
                                                            </TableCell>
                                                            <TableCell sx={{ color: colors.grey[100] }}>
                                                                <Chip
                                                                    label={client.customFields.Interes}
                                                                    size="small"
                                                                    sx={{
                                                                        backgroundColor: colors.greenAccent[500],
                                                                        color: colors.grey[100]
                                                                    }}
                                                                />
                                                            </TableCell>
                                                            <TableCell sx={{ color: colors.grey[100] }}>
                                                                <Chip
                                                                    label={client.customFields.Budžet}
                                                                    size="small"
                                                                    sx={{
                                                                        backgroundColor: colors.redAccent[500],
                                                                        color: colors.grey[100]
                                                                    }}
                                                                />
                                                            </TableCell>
                                                            <TableCell>
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={() => {/* Implementacija pregleda klijenta */}}
                                                                    sx={{ color: colors.grey[100] }}
                                                                >
                                                                    <VisibilityIcon />
                                                                </IconButton>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    <TablePagination
                                        component="div"
                                        count={clients.filter(client => client.list === list.name).length}
                                        page={page}
                                        onPageChange={handleChangePage}
                                        rowsPerPage={rowsPerPage}
                                        rowsPerPageOptions={[5]}
                                        sx={{
                                            color: colors.grey[100],
                                            '.MuiTablePagination-select': {
                                                color: colors.grey[100]
                                            },
                                            '.MuiTablePagination-selectIcon': {
                                                color: colors.grey[100]
                                            }
                                        }}
                                    />
                                </Box>

                                <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                                    <Button
                                        size="small"
                                        startIcon={<FileUploadIcon />}
                                        onClick={() => handleImportCSV(list)}
                                    >
                                        Uvezi CSV
                                    </Button>
                                    <Button
                                        size="small"
                                        startIcon={<FileDownloadIcon />}
                                        onClick={() => handleExportCSV(list)}
                                    >
                                        Izvezi CSV
                                    </Button>
                                </Box>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <TableContainer component={Paper} sx={{ backgroundColor: colors.primary[600] }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ color: colors.grey[100] }}>Ime</TableCell>
                                <TableCell sx={{ color: colors.grey[100] }}>Kompanija</TableCell>
                                <TableCell sx={{ color: colors.grey[100] }}>Email</TableCell>
                                <TableCell sx={{ color: colors.grey[100] }}>Telefon</TableCell>
                                <TableCell sx={{ color: colors.grey[100] }}>Lista</TableCell>
                                <TableCell sx={{ color: colors.grey[100] }}>Tim</TableCell>
                                <TableCell sx={{ color: colors.grey[100] }}>Akcije</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {/* Implementacija prikaza pojedinačnih klijenata */}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Dialog za kreiranje/izmenu liste */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>
                    {selectedList ? "Izmeni listu" : "Nova lista"}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        <TextField
                            fullWidth
                            label="Naziv liste"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="Opis"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="Region"
                            value={formData.region}
                            onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="Proizvod"
                            value={formData.product}
                            onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="Tim"
                            value={formData.team}
                            onChange={(e) => setFormData({ ...formData, team: e.target.value })}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Otkaži</Button>
                    <Button onClick={handleSubmit} variant="contained">
                        {selectedList ? "Sačuvaj" : "Dodaj"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog za promenu tima */}
            <Dialog open={openTeamDialog} onClose={handleCloseTeamDialog}>
                <DialogTitle>Promena tima</DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            Izaberite novi tim za listu: {selectedList?.name}
                        </Typography>
                        <List>
                            {mockTeams.map((team) => (
                                <ListItem
                                    key={team.id}
                                    button
                                    selected={selectedTeam === team.name}
                                    onClick={() => setSelectedTeam(team.name)}
                                >
                                    <ListItemText primary={team.name} />
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseTeamDialog}>Otkaži</Button>
                    <Button onClick={handleTeamChange} variant="contained">
                        Sačuvaj
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Menu za dodatne opcije */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={() => {
                    handleOpenDialog(selectedList);
                    handleMenuClose();
                }}>
                    <EditIcon sx={{ mr: 1 }} /> Izmeni
                </MenuItem>
                <MenuItem onClick={() => {
                    handleDelete(selectedList.id);
                    handleMenuClose();
                }}>
                    <DeleteIcon sx={{ mr: 1 }} /> Obriši
                </MenuItem>
            </Menu>

            {/* Dialog za detalje tima */}
            <Dialog 
                open={openTeamDetails} 
                onClose={handleCloseTeamDetails}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    Detalji tima: {selectedTeamDetails?.name}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <Paper sx={{ p: 2, backgroundColor: colors.primary[500] }}>
                                    <Typography variant="h6" color={colors.grey[100]} sx={{ mb: 2 }}>
                                        Članovi tima
                                    </Typography>
                                    <List>
                                        {mockTeams.find(team => team.name === selectedTeamDetails?.name)?.members?.map((member) => (
                                            <ListItem key={member.id}>
                                                <ListItemText
                                                    primary={member.name}
                                                    secondary={member.role}
                                                    primaryTypographyProps={{ color: colors.grey[100] }}
                                                    secondaryTypographyProps={{ color: colors.grey[300] }}
                                                />
                                                <Chip
                                                    label={member.status}
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: member.status === "Aktivan" 
                                                            ? colors.greenAccent[500] 
                                                            : colors.redAccent[500],
                                                        color: colors.grey[100]
                                                    }}
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Paper sx={{ p: 2, backgroundColor: colors.primary[500] }}>
                                    <Typography variant="h6" color={colors.grey[100]} sx={{ mb: 2 }}>
                                        Liste klijenata
                                    </Typography>
                                    <List>
                                        {clientLists
                                            .filter(list => list.team === selectedTeamDetails?.name)
                                            .map((list) => (
                                                <ListItem key={list.id}>
                                                    <ListItemText
                                                        primary={list.name}
                                                        secondary={`${list.count} klijenata`}
                                                        primaryTypographyProps={{ color: colors.grey[100] }}
                                                        secondaryTypographyProps={{ color: colors.grey[300] }}
                                                    />
                                                </ListItem>
                                            ))}
                                    </List>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseTeamDetails}>Zatvori</Button>
                </DialogActions>
            </Dialog>

            {/* Dialog za detalje liste */}
            <Dialog 
                open={openListDetails} 
                onClose={handleCloseListDetails}
                maxWidth="lg"
                fullWidth
                PaperProps={{
                    sx: {
                        backgroundColor: colors.primary[700],
                        borderRadius: 2,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
                    }
                }}
            >
                <DialogTitle sx={{ 
                    borderBottom: `1px solid ${colors.primary[500]}`,
                    pb: 2
                }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                            <Typography variant="h4" color={colors.grey[100]} sx={{ mb: 1 }}>
                                {selectedListDetails?.name}
                            </Typography>
                            <Typography variant="subtitle1" color={colors.grey[300]}>
                                {selectedListDetails?.description}
                            </Typography>
                        </Box>
                        <Box>
                            <Button
                                variant="outlined"
                                startIcon={<FileUploadIcon />}
                                onClick={() => handleImportCSV(selectedListDetails)}
                                sx={{ 
                                    mr: 1,
                                    borderColor: colors.greenAccent[500],
                                    color: colors.greenAccent[500],
                                    '&:hover': {
                                        borderColor: colors.greenAccent[400],
                                        backgroundColor: colors.greenAccent[500] + '20'
                                    }
                                }}
                            >
                                Uvezi CSV
                            </Button>
                            <Button
                                variant="outlined"
                                startIcon={<FileDownloadIcon />}
                                onClick={() => handleExportCSV(selectedListDetails)}
                                sx={{ 
                                    borderColor: colors.greenAccent[500],
                                    color: colors.greenAccent[500],
                                    '&:hover': {
                                        borderColor: colors.greenAccent[400],
                                        backgroundColor: colors.greenAccent[500] + '20'
                                    }
                                }}
                            >
                                Izvezi CSV
                            </Button>
                        </Box>
                    </Box>
                </DialogTitle>
                <DialogContent sx={{ mt: 2 }}>
                    <Box sx={{ pt: 2 }}>
                        <Grid container spacing={3}>
                            {/* Osnovne informacije */}
                            <Grid item xs={12}>
                                <Paper sx={{ 
                                    p: 3, 
                                    backgroundColor: colors.primary[600],
                                    borderRadius: 2,
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                }}>
                                    <Typography variant="h6" color={colors.grey[100]} sx={{ mb: 3 }}>
                                        Osnovne informacije
                                    </Typography>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} md={3}>
                                            <Box sx={{ 
                                                p: 2, 
                                                backgroundColor: colors.primary[500],
                                                borderRadius: 1,
                                                height: '100%'
                                            }}>
                                                <Typography variant="body2" color={colors.grey[300]} sx={{ mb: 1 }}>
                                                    Region
                                                </Typography>
                                                <Typography variant="h6" color={colors.grey[100]}>
                                                    {selectedListDetails?.region}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <Box sx={{ 
                                                p: 2, 
                                                backgroundColor: colors.primary[500],
                                                borderRadius: 1,
                                                height: '100%'
                                            }}>
                                                <Typography variant="body2" color={colors.grey[300]} sx={{ mb: 1 }}>
                                                    Proizvod
                                                </Typography>
                                                <Typography variant="h6" color={colors.grey[100]}>
                                                    {selectedListDetails?.product}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <Box sx={{ 
                                                p: 2, 
                                                backgroundColor: colors.primary[500],
                                                borderRadius: 1,
                                                height: '100%',
                                                cursor: 'pointer',
                                                '&:hover': {
                                                    backgroundColor: colors.primary[400]
                                                }
                                            }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleOpenTeamDetails(selectedListDetails?.team);
                                            }}>
                                                <Typography variant="body2" color={colors.grey[300]} sx={{ mb: 1 }}>
                                                    Tim
                                                </Typography>
                                                <Typography variant="h6" color={colors.grey[100]}>
                                                    {selectedListDetails?.team}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <Box sx={{ 
                                                p: 2, 
                                                backgroundColor: colors.primary[500],
                                                borderRadius: 1,
                                                height: '100%'
                                            }}>
                                                <Typography variant="body2" color={colors.grey[300]} sx={{ mb: 1 }}>
                                                    Broj klijenata
                                                </Typography>
                                                <Typography variant="h6" color={colors.grey[100]}>
                                                    {selectedListDetails?.count}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </Grid>

                            {/* Ciljevi i metrike */}
                            <Grid item xs={12} md={6}>
                                <Paper sx={{ 
                                    p: 3, 
                                    backgroundColor: colors.primary[600],
                                    borderRadius: 2,
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                    height: '100%'
                                }}>
                                    <Typography variant="h6" color={colors.grey[100]} sx={{ mb: 3 }}>
                                        Ciljevi i metrike
                                    </Typography>
                                    <Grid container spacing={3}>
                                        <Grid item xs={6}>
                                            <Box sx={{ 
                                                p: 2, 
                                                backgroundColor: colors.primary[500],
                                                borderRadius: 1
                                            }}>
                                                <Typography variant="body2" color={colors.grey[300]} sx={{ mb: 1 }}>
                                                    Mesečni cilj
                                                </Typography>
                                                <Typography variant="h6" color={colors.grey[100]}>
                                                    {selectedListDetails?.goals.monthlyTarget.toLocaleString()} RSD
                                                </Typography>
                                                <Typography variant="body2" color={colors.grey[300]} sx={{ mt: 1 }}>
                                                    Trenutno: {selectedListDetails?.goals.currentProgress.toLocaleString()} RSD
                                                </Typography>
                                                <Box sx={{ 
                                                    mt: 1,
                                                    height: 4,
                                                    backgroundColor: colors.primary[400],
                                                    borderRadius: 2,
                                                    overflow: 'hidden'
                                                }}>
                                                    <Box sx={{ 
                                                        height: '100%',
                                                        width: `${(selectedListDetails?.goals.currentProgress / selectedListDetails?.goals.monthlyTarget) * 100}%`,
                                                        backgroundColor: colors.greenAccent[500]
                                                    }} />
                                                </Box>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Box sx={{ 
                                                p: 2, 
                                                backgroundColor: colors.primary[500],
                                                borderRadius: 1
                                            }}>
                                                <Typography variant="body2" color={colors.grey[300]} sx={{ mb: 1 }}>
                                                    Stopa konverzije
                                                </Typography>
                                                <Typography variant="h6" color={colors.grey[100]}>
                                                    {(selectedListDetails?.goals.conversionRate * 100).toFixed(1)}%
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Box sx={{ 
                                                p: 2, 
                                                backgroundColor: colors.primary[500],
                                                borderRadius: 1
                                            }}>
                                                <Typography variant="body2" color={colors.grey[300]} sx={{ mb: 1 }}>
                                                    Cilj klijenata
                                                </Typography>
                                                <Typography variant="h6" color={colors.grey[100]}>
                                                    {selectedListDetails?.goals.targetClients}
                                                </Typography>
                                                <Typography variant="body2" color={colors.grey[300]} sx={{ mt: 1 }}>
                                                    Postignuto: {selectedListDetails?.goals.achievedClients}
                                                </Typography>
                                                <Box sx={{ 
                                                    mt: 1,
                                                    height: 4,
                                                    backgroundColor: colors.primary[400],
                                                    borderRadius: 2,
                                                    overflow: 'hidden'
                                                }}>
                                                    <Box sx={{ 
                                                        height: '100%',
                                                        width: `${(selectedListDetails?.goals.achievedClients / selectedListDetails?.goals.targetClients) * 100}%`,
                                                        backgroundColor: colors.blueAccent[500]
                                                    }} />
                                                </Box>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Box sx={{ 
                                                p: 2, 
                                                backgroundColor: colors.primary[500],
                                                borderRadius: 1
                                            }}>
                                                <Typography variant="body2" color={colors.grey[300]} sx={{ mb: 1 }}>
                                                    Zadovoljstvo klijenata
                                                </Typography>
                                                <Typography variant="h6" color={colors.grey[100]}>
                                                    {selectedListDetails?.metrics.customerSatisfaction}/5
                                                </Typography>
                                                <Box sx={{ 
                                                    mt: 1,
                                                    display: 'flex',
                                                    gap: 0.5
                                                }}>
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <Box
                                                            key={star}
                                                            sx={{
                                                                width: 16,
                                                                height: 16,
                                                                backgroundColor: star <= selectedListDetails?.metrics.customerSatisfaction
                                                                    ? colors.greenAccent[500]
                                                                    : colors.primary[400],
                                                                borderRadius: '50%'
                                                            }}
                                                        />
                                                    ))}
                                                </Box>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </Grid>

                            {/* Podešavanja */}
                            <Grid item xs={12} md={6}>
                                <Paper sx={{ 
                                    p: 3, 
                                    backgroundColor: colors.primary[600],
                                    borderRadius: 2,
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                    height: '100%'
                                }}>
                                    <Typography variant="h6" color={colors.grey[100]} sx={{ mb: 3 }}>
                                        Podešavanja
                                    </Typography>
                                    <Grid container spacing={3}>
                                        <Grid item xs={6}>
                                            <Box sx={{ 
                                                p: 2, 
                                                backgroundColor: colors.primary[500],
                                                borderRadius: 1
                                            }}>
                                                <Typography variant="body2" color={colors.grey[300]} sx={{ mb: 1 }}>
                                                    Automatsko dodeljivanje
                                                </Typography>
                                                <Chip
                                                    label={selectedListDetails?.settings.autoAssign ? "Uključeno" : "Isključeno"}
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: selectedListDetails?.settings.autoAssign
                                                            ? colors.greenAccent[500]
                                                            : colors.redAccent[500],
                                                        color: colors.grey[100]
                                                    }}
                                                />
                                            </Box>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Box sx={{ 
                                                p: 2, 
                                                backgroundColor: colors.primary[500],
                                                borderRadius: 1
                                            }}>
                                                <Typography variant="body2" color={colors.grey[300]} sx={{ mb: 1 }}>
                                                    Nivo prioriteta
                                                </Typography>
                                                <Chip
                                                    label={selectedListDetails?.settings.priorityLevel}
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: 
                                                            selectedListDetails?.settings.priorityLevel === "High" ? colors.redAccent[500] :
                                                            selectedListDetails?.settings.priorityLevel === "Medium" ? colors.blueAccent[500] :
                                                            colors.greenAccent[500],
                                                        color: colors.grey[100]
                                                    }}
                                                />
                                            </Box>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Box sx={{ 
                                                p: 2, 
                                                backgroundColor: colors.primary[500],
                                                borderRadius: 1
                                            }}>
                                                <Typography variant="body2" color={colors.grey[300]} sx={{ mb: 1 }}>
                                                    Dani za praćenje
                                                </Typography>
                                                <Typography variant="h6" color={colors.grey[100]}>
                                                    {selectedListDetails?.settings.followUpDays} dana
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Box sx={{ 
                                                p: 2, 
                                                backgroundColor: colors.primary[500],
                                                borderRadius: 1
                                            }}>
                                                <Typography variant="body2" color={colors.grey[300]} sx={{ mb: 1 }}>
                                                    Notifikacije
                                                </Typography>
                                                <Chip
                                                    label={selectedListDetails?.settings.notificationEnabled ? "Uključene" : "Isključene"}
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: selectedListDetails?.settings.notificationEnabled
                                                            ? colors.greenAccent[500]
                                                            : colors.redAccent[500],
                                                        color: colors.grey[100]
                                                    }}
                                                />
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Box sx={{ 
                                                p: 2, 
                                                backgroundColor: colors.primary[500],
                                                borderRadius: 1
                                            }}>
                                                <Typography variant="body2" color={colors.grey[300]} sx={{ mb: 1 }}>
                                                    Prilagođena polja
                                                </Typography>
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                                    {selectedListDetails?.settings.customFields.map((field, index) => (
                                                        <Chip
                                                            key={index}
                                                            label={field}
                                                            size="small"
                                                            sx={{
                                                                backgroundColor: colors.blueAccent[500],
                                                                color: colors.grey[100]
                                                            }}
                                                        />
                                                    ))}
                                                </Box>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </Grid>

                            {/* Napomene */}
                            <Grid item xs={12}>
                                <Paper sx={{ 
                                    p: 3, 
                                    backgroundColor: colors.primary[600],
                                    borderRadius: 2,
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                }}>
                                    <Typography variant="h6" color={colors.grey[100]} sx={{ mb: 3 }}>
                                        Napomene
                                    </Typography>
                                    <List>
                                        {selectedListDetails?.notes.map((note) => (
                                            <ListItem 
                                                key={note.id}
                                                sx={{
                                                    backgroundColor: colors.primary[500],
                                                    borderRadius: 1,
                                                    mb: 1,
                                                    '&:last-child': {
                                                        mb: 0
                                                    }
                                                }}
                                            >
                                                <ListItemText
                                                    primary={note.text}
                                                    secondary={`${note.author} - ${note.date}`}
                                                    primaryTypographyProps={{ 
                                                        color: colors.grey[100],
                                                        sx: { mb: 0.5 }
                                                    }}
                                                    secondaryTypographyProps={{ color: colors.grey[300] }}
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                </Paper>
                            </Grid>

                            {/* Lista klijenata */}
                            <Grid item xs={12}>
                                <Paper sx={{ 
                                    p: 3, 
                                    backgroundColor: colors.primary[600],
                                    borderRadius: 2,
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                }}>
                                    <Typography variant="h6" color={colors.grey[100]} sx={{ mb: 3 }}>
                                        Lista klijenata
                                    </Typography>
                                    <TableContainer>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell sx={{ color: colors.grey[100] }}>Ime</TableCell>
                                                    <TableCell sx={{ color: colors.grey[100] }}>Kompanija</TableCell>
                                                    <TableCell sx={{ color: colors.grey[100] }}>Email</TableCell>
                                                    <TableCell sx={{ color: colors.grey[100] }}>Telefon</TableCell>
                                                    <TableCell sx={{ color: colors.grey[100] }}>Status</TableCell>
                                                    <TableCell sx={{ color: colors.grey[100] }}>Poslednji kontakt</TableCell>
                                                    <TableCell sx={{ color: colors.grey[100] }}>Akcije</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {clients
                                                    .filter(client => client.list === selectedListDetails?.name)
                                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                    .map((client) => (
                                                        <TableRow 
                                                            key={client.id}
                                                            sx={{
                                                                '&:hover': {
                                                                    backgroundColor: colors.primary[500]
                                                                }
                                                            }}
                                                        >
                                                            <TableCell sx={{ color: colors.grey[100] }}>{client.name}</TableCell>
                                                            <TableCell sx={{ color: colors.grey[100] }}>{client.company}</TableCell>
                                                            <TableCell sx={{ color: colors.grey[100] }}>{client.email}</TableCell>
                                                            <TableCell sx={{ color: colors.grey[100] }}>{client.phone}</TableCell>
                                                            <TableCell sx={{ color: colors.grey[100] }}>
                                                                <Chip
                                                                    label={client.status}
                                                                    size="small"
                                                                    sx={{
                                                                        backgroundColor: client.status === "Aktivan" 
                                                                            ? colors.greenAccent[500] 
                                                                            : colors.blueAccent[500],
                                                                        color: colors.grey[100]
                                                                    }}
                                                                />
                                                            </TableCell>
                                                            <TableCell sx={{ color: colors.grey[100] }}>{client.lastContact}</TableCell>
                                                            <TableCell>
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={() => {/* Implementacija pregleda klijenta */}}
                                                                    sx={{ 
                                                                        color: colors.grey[100],
                                                                        '&:hover': {
                                                                            backgroundColor: colors.primary[400]
                                                                        }
                                                                    }}
                                                                >
                                                                    <VisibilityIcon />
                                                                </IconButton>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    <TablePagination
                                        component="div"
                                        count={clients.filter(client => client.list === selectedListDetails?.name).length}
                                        page={page}
                                        onPageChange={handleChangePage}
                                        rowsPerPage={rowsPerPage}
                                        rowsPerPageOptions={[5]}
                                        sx={{
                                            color: colors.grey[100],
                                            '.MuiTablePagination-select': {
                                                color: colors.grey[100]
                                            },
                                            '.MuiTablePagination-selectIcon': {
                                                color: colors.grey[100]
                                            }
                                        }}
                                    />
                                </Paper>
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ 
                    p: 3,
                    borderTop: `1px solid ${colors.primary[500]}`
                }}>
                    <Button 
                        onClick={handleCloseListDetails}
                        sx={{
                            color: colors.grey[100],
                            '&:hover': {
                                backgroundColor: colors.primary[500]
                            }
                        }}
                    >
                        Zatvori
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default UnifiedLeadsTable; 