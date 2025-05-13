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
    useMediaQuery
} from "@mui/material";
import { tokens } from "../../theme";
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Person as PersonIcon, Business as BusinessIcon } from "@mui/icons-material";

// Mock podaci za kontakte
const mockContactsData = {
    leads: [
        {
            id: 1,
            name: "Petar Petrović",
            company: "Tech Solutions",
            email: "petar.petrovic@techsolutions.com",
            phone: "+381 64 123 4567",
            status: "Novi",
            source: "Web sajt",
            lastContact: "2024-03-15"
        },
        {
            id: 2,
            name: "Ana Jovanović",
            company: "Digital Systems",
            email: "ana.jovanovic@digitalsystems.com",
            phone: "+381 64 234 5678",
            status: "U pregovorima",
            source: "Preporuka",
            lastContact: "2024-03-14"
        }
    ],
    contacts: [
        {
            id: 1,
            name: "Marko Nikolić",
            company: "IT Solutions",
            email: "marko.nikolic@itsolutions.com",
            phone: "+381 64 345 6789",
            position: "CEO",
            type: "Klijent",
            lastContact: "2024-03-13"
        },
        {
            id: 2,
            name: "Jovana Stanković",
            company: "Tech Innovations",
            email: "jovana.stankovic@techinnovations.com",
            phone: "+381 64 456 7890",
            position: "CTO",
            type: "Partner",
            lastContact: "2024-03-12"
        }
    ]
};

const UnifiedLeadsTable = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isMobile = useMediaQuery("(max-width:768px)");
    const [contactsData, setContactsData] = useState(mockContactsData);
    const [activeTab, setActiveTab] = useState(0);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedContact, setSelectedContact] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        company: "",
        email: "",
        phone: "",
        status: "",
        source: "",
        position: "",
        type: "",
        lastContact: new Date().toISOString().split('T')[0]
    });

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const handleOpenDialog = (contact = null) => {
        if (contact) {
            setSelectedContact(contact);
            setFormData(contact);
        } else {
            setSelectedContact(null);
            setFormData({
                name: "",
                company: "",
                email: "",
                phone: "",
                status: "",
                source: "",
                position: "",
                type: "",
                lastContact: new Date().toISOString().split('T')[0]
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedContact(null);
    };

    const handleSubmit = () => {
        const newContact = {
            ...formData,
            id: selectedContact ? selectedContact.id : (activeTab === 0 ? contactsData.leads.length + 1 : contactsData.contacts.length + 1)
        };

        if (selectedContact) {
            if (activeTab === 0) {
                setContactsData({
                    ...contactsData,
                    leads: contactsData.leads.map(lead => 
                        lead.id === selectedContact.id ? newContact : lead
                    )
                });
            } else {
                setContactsData({
                    ...contactsData,
                    contacts: contactsData.contacts.map(contact => 
                        contact.id === selectedContact.id ? newContact : contact
                    )
                });
            }
        } else {
            if (activeTab === 0) {
                setContactsData({
                    ...contactsData,
                    leads: [...contactsData.leads, newContact]
                });
            } else {
                setContactsData({
                    ...contactsData,
                    contacts: [...contactsData.contacts, newContact]
                });
            }
        }
        handleCloseDialog();
    };

    const handleDelete = (id) => {
        if (activeTab === 0) {
            setContactsData({
                ...contactsData,
                leads: contactsData.leads.filter(lead => lead.id !== id)
            });
        } else {
            setContactsData({
                ...contactsData,
                contacts: contactsData.contacts.filter(contact => contact.id !== id)
            });
        }
    };

    return (
        <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <Typography variant="h5" color={colors.grey[100]}>
                    Upravljanje kontaktima
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
                    Dodaj kontakt
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
                    icon={<PersonIcon />}
                    label="Potencijalni klijenti"
                    sx={{
                        color: colors.grey[100],
                        '&.Mui-selected': {
                            color: colors.greenAccent[500]
                        }
                    }}
                />
                <Tab
                    icon={<BusinessIcon />}
                    label="Kontakti"
                    sx={{
                        color: colors.grey[100],
                        '&.Mui-selected': {
                            color: colors.greenAccent[500]
                        }
                    }}
                />
            </Tabs>

            <TableContainer component={Paper} sx={{ backgroundColor: colors.primary[600] }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ color: colors.grey[100] }}>Ime</TableCell>
                            <TableCell sx={{ color: colors.grey[100] }}>Kompanija</TableCell>
                            <TableCell sx={{ color: colors.grey[100] }}>Email</TableCell>
                            <TableCell sx={{ color: colors.grey[100] }}>Telefon</TableCell>
                            {activeTab === 0 ? (
                                <>
                                    <TableCell sx={{ color: colors.grey[100] }}>Status</TableCell>
                                    <TableCell sx={{ color: colors.grey[100] }}>Izvor</TableCell>
                                </>
                            ) : (
                                <>
                                    <TableCell sx={{ color: colors.grey[100] }}>Pozicija</TableCell>
                                    <TableCell sx={{ color: colors.grey[100] }}>Tip</TableCell>
                                </>
                            )}
                            <TableCell sx={{ color: colors.grey[100] }}>Poslednji kontakt</TableCell>
                            <TableCell sx={{ color: colors.grey[100] }}>Akcije</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(activeTab === 0 ? contactsData.leads : contactsData.contacts).map((contact) => (
                            <TableRow key={contact.id}>
                                <TableCell sx={{ color: colors.grey[100] }}>{contact.name}</TableCell>
                                <TableCell sx={{ color: colors.grey[100] }}>{contact.company}</TableCell>
                                <TableCell sx={{ color: colors.grey[100] }}>{contact.email}</TableCell>
                                <TableCell sx={{ color: colors.grey[100] }}>{contact.phone}</TableCell>
                                {activeTab === 0 ? (
                                    <>
                                        <TableCell sx={{ color: colors.grey[100] }}>{contact.status}</TableCell>
                                        <TableCell sx={{ color: colors.grey[100] }}>{contact.source}</TableCell>
                                    </>
                                ) : (
                                    <>
                                        <TableCell sx={{ color: colors.grey[100] }}>{contact.position}</TableCell>
                                        <TableCell sx={{ color: colors.grey[100] }}>{contact.type}</TableCell>
                                    </>
                                )}
                                <TableCell sx={{ color: colors.grey[100] }}>{contact.lastContact}</TableCell>
                                <TableCell>
                                    <IconButton
                                        size="small"
                                        onClick={() => handleOpenDialog(contact)}
                                        sx={{ color: colors.grey[100] }}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        onClick={() => handleDelete(contact.id)}
                                        sx={{ color: colors.redAccent[500] }}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>
                    {selectedContact ? "Izmeni kontakt" : "Dodaj novi kontakt"}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        <TextField
                            fullWidth
                            label="Ime"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="Kompanija"
                            value={formData.company}
                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="Email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="Telefon"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            sx={{ mb: 2 }}
                        />
                        {activeTab === 0 ? (
                            <>
                                <TextField
                                    fullWidth
                                    label="Status"
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    sx={{ mb: 2 }}
                                />
                                <TextField
                                    fullWidth
                                    label="Izvor"
                                    value={formData.source}
                                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                                    sx={{ mb: 2 }}
                                />
                            </>
                        ) : (
                            <>
                                <TextField
                                    fullWidth
                                    label="Pozicija"
                                    value={formData.position}
                                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                    sx={{ mb: 2 }}
                                />
                                <TextField
                                    fullWidth
                                    label="Tip"
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    sx={{ mb: 2 }}
                                />
                            </>
                        )}
                        <TextField
                            fullWidth
                            label="Poslednji kontakt"
                            type="date"
                            value={formData.lastContact}
                            onChange={(e) => setFormData({ ...formData, lastContact: e.target.value })}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Otkaži</Button>
                    <Button onClick={handleSubmit} variant="contained">
                        {selectedContact ? "Sačuvaj" : "Dodaj"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default UnifiedLeadsTable; 