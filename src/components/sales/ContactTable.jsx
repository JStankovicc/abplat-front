import { useState, useEffect } from "react";
import {
    Box,
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    TextField,
    useTheme,
    useMediaQuery,
    CircularProgress,
    Alert,
    Chip
} from "@mui/material";
import axios from "axios";
import { tokens } from "../../theme";
import AddLeadModal from "./modals/AddLeadModal";

// API konstante
const API_BASE_URL = "http://192.168.1.30:8080/api/v1/contact";

// Helper funkcija za auth headers
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
    };
};

const ContactTable = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isMobile = useMediaQuery("(max-width:768px)");
    const [contacts, setContacts] = useState([]);
    const [orderBy, setOrderBy] = useState("name");
    const [order, setOrder] = useState("asc");
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Loading i error states
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // API funkcije
    const fetchContacts = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await axios.get(`${API_BASE_URL}/user/sales/all`, {
                headers: getAuthHeaders()
            });

            console.log('Contacts response:', response.data);
            
            // Transformišemo response u format koji komponenta očekuje
            const transformedContacts = response.data.map((contact, index) => ({
                id: index + 1,
                name: contact.name,
                companyName: contact.companyName,
                phoneNumber: contact.phoneNumber,
                email: contact.email,
                status: "Aktivan" // Default status jer nije u response-u
            }));
            
            setContacts(transformedContacts);
            
        } catch (error) {
            console.error('Failed to fetch contacts:', error);
            setError('Greška pri učitavanju kontakata');
            setContacts([]);
        } finally {
            setLoading(false);
        }
    };

    // useEffect za inicijalno učitavanje
    useEffect(() => {
        fetchContacts();
    }, []);

    const handleSort = (property) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    };

    const filteredContacts = contacts
        .filter((contact) =>
            contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (contact.companyName && contact.companyName.toLowerCase().includes(searchTerm.toLowerCase()))
        )
        .sort((a, b) => {
            if (order === "asc") {
                return a[orderBy] > b[orderBy] ? 1 : -1;
            }
            return a[orderBy] < b[orderBy] ? 1 : -1;
        });

    return (
        <Box>
            {/* Error Alert */}
            {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}
            
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                    flexDirection: isMobile ? "column" : "row",
                    gap: isMobile ? 2 : 0
                }}
            >
                <TextField
                    label="Pretraži kontakte"
                    variant="outlined"
                    size="small"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{
                        width: isMobile ? "100%" : "300px",
                        "& .MuiOutlinedInput-root": {
                            backgroundColor: colors.primary[600]
                        }
                    }}
                />
                <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                        variant="outlined"
                        onClick={() => fetchContacts()}
                        disabled={loading}
                        sx={{
                            borderColor: colors.greenAccent[500],
                            color: colors.greenAccent[500],
                            "&:hover": {
                                borderColor: colors.greenAccent[600],
                                backgroundColor: colors.greenAccent[500] + '20'
                            }
                        }}
                    >
                        {loading ? <CircularProgress size={20} /> : "Osveži"}
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => setIsModalOpen(true)}
                        sx={{
                            backgroundColor: colors.greenAccent[500],
                            "&:hover": {
                                backgroundColor: colors.greenAccent[600]
                            }
                        }}
                    >
                        Dodaj kontakt
                    </Button>
                </Box>
            </Box>

            {/* Loading indicator */}
            {loading && (
                <Box display="flex" justifyContent="center" my={4}>
                    <CircularProgress />
                </Box>
            )}

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === "name"}
                                    direction={orderBy === "name" ? order : "asc"}
                                    onClick={() => handleSort("name")}
                                >
                                    Ime
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === "companyName"}
                                    direction={orderBy === "companyName" ? order : "asc"}
                                    onClick={() => handleSort("companyName")}
                                >
                                    Kompanija
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === "email"}
                                    direction={orderBy === "email" ? order : "asc"}
                                    onClick={() => handleSort("email")}
                                >
                                    Email
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === "phoneNumber"}
                                    direction={orderBy === "phoneNumber" ? order : "asc"}
                                    onClick={() => handleSort("phoneNumber")}
                                >
                                    Telefon
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === "status"}
                                    direction={orderBy === "status" ? order : "asc"}
                                    onClick={() => handleSort("status")}
                                >
                                    Status
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>Akcije</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredContacts.map((contact) => (
                            <TableRow key={contact.id}>
                                <TableCell>{contact.name}</TableCell>
                                <TableCell>{contact.companyName || '-'}</TableCell>
                                <TableCell>{contact.email}</TableCell>
                                <TableCell>{contact.phoneNumber || '-'}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={contact.status}
                                        size="small"
                                        sx={{
                                            backgroundColor: contact.status === "Aktivan" 
                                                ? colors.greenAccent[500] 
                                                : colors.redAccent[500],
                                            color: colors.grey[100]
                                        }}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Button
                                        size="small"
                                        sx={{
                                            color: colors.greenAccent[500],
                                            "&:hover": {
                                                backgroundColor: colors.greenAccent[500] + "20"
                                            }
                                        }}
                                    >
                                        Izmeni
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <AddLeadModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAdd={(newContact) => {
                    // TODO: Implementirati API poziv za kreiranje novog kontakta
                    // Za sada samo osveži listu sa servera
                    fetchContacts();
                    setIsModalOpen(false);
                }}
            />
        </Box>
    );
};

export default ContactTable; 