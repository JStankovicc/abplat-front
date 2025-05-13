import { useState } from "react";
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
    useMediaQuery
} from "@mui/material";
import { tokens } from "../../theme";
import AddLeadModal from "./modals/AddLeadModal";

// Mock podaci
const mockContacts = [
    { id: 1, ime: "Marko Marković", email: "marko@example.com", status: "Aktivan" },
    { id: 2, ime: "Ana Anić", email: "ana@example.com", status: "Neaktivan" },
    { id: 3, ime: "Petar Petrović", email: "petar@example.com", status: "Aktivan" },
];

const ContactTable = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isMobile = useMediaQuery("(max-width:768px)");
    const [contacts, setContacts] = useState(mockContacts);
    const [orderBy, setOrderBy] = useState("ime");
    const [order, setOrder] = useState("asc");
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSort = (property) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    };

    const filteredContacts = contacts
        .filter((contact) =>
            contact.ime.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contact.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            if (order === "asc") {
                return a[orderBy] > b[orderBy] ? 1 : -1;
            }
            return a[orderBy] < b[orderBy] ? 1 : -1;
        });

    return (
        <Box>
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

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === "ime"}
                                    direction={orderBy === "ime" ? order : "asc"}
                                    onClick={() => handleSort("ime")}
                                >
                                    Ime
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
                                <TableCell>{contact.ime}</TableCell>
                                <TableCell>{contact.email}</TableCell>
                                <TableCell>{contact.status}</TableCell>
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
                    setContacts([...contacts, { ...newContact, id: contacts.length + 1 }]);
                    setIsModalOpen(false);
                }}
            />
        </Box>
    );
};

export default ContactTable; 