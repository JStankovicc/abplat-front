import { useState } from "react";
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    TextField,
    InputAdornment,
    IconButton,
    Button,
    Typography,
    Grid,
    Card,
    CardContent,
    Chip,
    useTheme
} from "@mui/material";
import { tokens } from "../../theme";
import {
    Search as SearchIcon,
    FilterList as FilterIcon,
    Add as AddIcon,
    Assignment as AuditIcon,
    CheckCircle as CompletedIcon,
    Pending as PendingIcon,
    Schedule as ScheduledIcon,
    Warning as WarningIcon
} from "@mui/icons-material";

const AuditSection = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedAudit, setSelectedAudit] = useState(null);

    // Primer podataka
    const audits = [
        {
            id: "AUD-001",
            date: "2024-03-15",
            type: "Ciklična provera",
            location: "Skladiste A",
            status: "Completed",
            items: 150,
            discrepancies: 2,
            performedBy: "John Doe",
            notes: "Manja odstupanja u količini"
        },
        {
            id: "AUD-002",
            date: "2024-03-20",
            type: "Godišnja revizija",
            location: "Skladiste B",
            status: "Scheduled",
            items: 300,
            discrepancies: null,
            performedBy: null,
            notes: null
        }
    ];

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "Completed":
                return colors.greenAccent[500];
            case "Scheduled":
                return colors.blueAccent[500];
            case "In Progress":
                return colors.orangeAccent[500];
            case "Overdue":
                return colors.redAccent[500];
            default:
                return colors.grey[500];
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "Completed":
                return <CompletedIcon />;
            case "Scheduled":
                return <ScheduledIcon />;
            case "In Progress":
                return <PendingIcon />;
            case "Overdue":
                return <WarningIcon />;
            default:
                return null;
        }
    };

    return (
        <Box>
            {/* Toolbar */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2
                }}
            >
                <TextField
                    size="small"
                    placeholder="Pretraži revizije..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        )
                    }}
                    sx={{ width: "300px" }}
                />
                <Box>
                    <IconButton sx={{ mr: 1 }}>
                        <FilterIcon />
                    </IconButton>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                    >
                        Nova revizija
                    </Button>
                </Box>
            </Box>

            <Grid container spacing={2}>
                {/* Lista revizija */}
                <Grid item xs={12} md={selectedAudit ? 8 : 12}>
                    <TableContainer component={Paper} sx={{ backgroundColor: colors.primary[600] }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Broj revizije</TableCell>
                                    <TableCell>Datum</TableCell>
                                    <TableCell>Tip</TableCell>
                                    <TableCell>Lokacija</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell align="right">Broj stavki</TableCell>
                                    <TableCell align="right">Odstupanja</TableCell>
                                    <TableCell align="right">Akcije</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {audits
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((audit) => (
                                        <TableRow
                                            key={audit.id}
                                            onClick={() => setSelectedAudit(audit)}
                                            sx={{ cursor: "pointer" }}
                                        >
                                            <TableCell>{audit.id}</TableCell>
                                            <TableCell>{audit.date}</TableCell>
                                            <TableCell>{audit.type}</TableCell>
                                            <TableCell>{audit.location}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    icon={getStatusIcon(audit.status)}
                                                    label={audit.status}
                                                    sx={{
                                                        backgroundColor: getStatusColor(audit.status),
                                                        color: colors.grey[100]
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell align="right">{audit.items}</TableCell>
                                            <TableCell align="right">
                                                {audit.discrepancies !== null ? audit.discrepancies : "-"}
                                            </TableCell>
                                            <TableCell align="right">
                                                <IconButton size="small">
                                                    <AuditIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={audits.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </TableContainer>
                </Grid>

                {/* Detalji revizije */}
                {selectedAudit && (
                    <Grid item xs={12} md={4}>
                        <Card sx={{ backgroundColor: colors.primary[600] }}>
                            <CardContent>
                                <Typography variant="h6" sx={{ mb: 2 }}>
                                    Detalji revizije
                                </Typography>
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                        Osnovne informacije
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                        Broj revizije: {selectedAudit.id}
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                        Datum: {selectedAudit.date}
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                        Tip: {selectedAudit.type}
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                        Lokacija: {selectedAudit.location}
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                        Izvršilac: {selectedAudit.performedBy || "Nije dodeljen"}
                                    </Typography>
                                </Box>
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                        Rezultati
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                        Broj proverenih stavki: {selectedAudit.items}
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                        Broj odstupanja: {selectedAudit.discrepancies || "N/A"}
                                    </Typography>
                                    {selectedAudit.notes && (
                                        <Typography variant="body2" sx={{ mb: 1 }}>
                                            Napomene: {selectedAudit.notes}
                                        </Typography>
                                    )}
                                </Box>
                                {selectedAudit.status === "Scheduled" && (
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        startIcon={<AuditIcon />}
                                    >
                                        Započni reviziju
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                )}
            </Grid>
        </Box>
    );
};

export default AuditSection; 