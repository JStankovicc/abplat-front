import { useState, useEffect } from "react";
import {
    Box,
    Paper,
    Typography,
    useTheme,
    useMediaQuery,
    CircularProgress,
    Alert
} from "@mui/material";
import axios from "axios";
import { tokens } from "../../theme";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

// API konstante
const API_BASE_URL_CONTACTS = "http://3.73.118.83:8080/api/v1/contact";
const API_BASE_URL_STATUS = "http://3.73.118.83:8080/api/v1/contactStatus";

// Helper funkcija za auth headers
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
    };
};

const PipelineBoard = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isMobile = useMediaQuery("(max-width:768px)");
    const [stages, setStages] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // API funkcije
    const updateContactStatus = async (email, newStatus) => {
        try {
            const response = await axios.post(`${API_BASE_URL_CONTACTS}/updateStatus`, {
                email: email
            }, {
                headers: getAuthHeaders(),
                params: {
                    status: newStatus
                }
            });
            return response.data;
        } catch (error) {
            console.error('Failed to update contact status:', error);
            throw error;
        }
    };

    const fetchPipelineData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Paralelno dohvatamo status-e i kontakte
            const [statusResponse, contactsResponse] = await Promise.all([
                axios.get(`${API_BASE_URL_STATUS}/all`, {
                    headers: getAuthHeaders()
                }),
                axios.get(`${API_BASE_URL_CONTACTS}/user/sales/all`, {
                    headers: getAuthHeaders()
                })
            ]);

            console.log('Statuses response:', statusResponse.data);
            console.log('Contacts response:', contactsResponse.data);

            // Mapiranje između srpskih naziva (iz backend-a) i enum vrednosti
            const statusMapping = {
                "Novi": "NEW",
                "Kontaktiran": "CONTACTED", 
                "Ponuda data": "OFFERED",
                "Zatvoren": "CLOSED",
                "Odbijen": "REJECTED",
                "Zastao": "STALLED"
            };

            // Kreiramo pipeline strukture na osnovu status-a
            const pipelineStages = {};
            statusResponse.data.forEach(serbianStatus => {
                // Backend vraća srpske nazive, koristimo ih kao ključeve
                const enumValue = statusMapping[serbianStatus] || "NEW";
                pipelineStages[serbianStatus] = {
                    title: serbianStatus, // Koristimo srpski naziv kao naslov
                    items: [],
                    enumValue: enumValue // Čuvamo enum vrednost za API pozive
                };
            });

            // Distribuiramo kontakte po status-ima na osnovu njihovog stvarnog statusa
            contactsResponse.data.forEach((contact, index) => {
                // Koristimo status iz ContactResponse-a ili default 'NEW' ako nije definisan
                const contactEnumStatus = contact.status || 'NEW';
                
                // Pronađemo srpski ključ na osnovu enum vrednosti
                const serbianKey = Object.keys(statusMapping).find(key => 
                    statusMapping[key] === contactEnumStatus
                ) || "Novi"; // Default fallback

                // Proveravamo da li postoji odgovarajuća kolona za ovaj status
                if (pipelineStages[serbianKey]) {
                    pipelineStages[serbianKey].items.push({
                        id: `contact-${index + 1}`,
                        name: contact.name,
                        company: contact.companyName || 'N/A',
                        email: contact.email,
                        phone: contact.phoneNumber || 'N/A',
                        assigned: "Trenutni korisnik", // Placeholder
                        status: contactEnumStatus // Čuvamo originalnu enum vrednost
                    });
                } else {
                    // Ako status nije prepoznat, stavi u Novi kolonu kao fallback
                    console.warn(`Nepoznat status ${contactEnumStatus} za kontakt ${contact.name}, stavljam u Novi`);
                    if (pipelineStages['Novi']) {
                        pipelineStages['Novi'].items.push({
                            id: `contact-${index + 1}`,
                            name: contact.name,
                            company: contact.companyName || 'N/A',
                            email: contact.email,
                            phone: contact.phoneNumber || 'N/A',
                            assigned: "Trenutni korisnik",
                            status: 'NEW'
                        });
                    }
                }
            });

            setStages(pipelineStages);

        } catch (error) {
            console.error('Failed to fetch pipeline data:', error);
            setError('Greška pri učitavanju pipeline podataka');
            setStages({});
        } finally {
            setLoading(false);
        }
    };

    // useEffect za inicijalno učitavanje
    useEffect(() => {
        fetchPipelineData();
    }, []);

    const onDragEnd = async (result) => {
        if (!result.destination) return;

        const { source, destination } = result;
        
        if (source.droppableId === destination.droppableId) {
            // Samo promena pozicije u istoj koloni
            const stage = stages[source.droppableId];
            const copiedItems = [...stage.items];
            const [removed] = copiedItems.splice(source.index, 1);
            copiedItems.splice(destination.index, 0, removed);
            
            setStages({
                ...stages,
                [source.droppableId]: {
                    ...stage,
                    items: copiedItems
                }
            });
        } else {
            // Premestanje između različitih kolona - treba da ažuriramo status
            const sourceStage = stages[source.droppableId];
            const destStage = stages[destination.droppableId];
            const sourceItems = [...sourceStage.items];
            const destItems = [...destStage.items];
            const [removed] = sourceItems.splice(source.index, 1);
            destItems.splice(destination.index, 0, removed);
            
            // Ažuriraj UI odmah
            setStages({
                ...stages,
                [source.droppableId]: {
                    ...sourceStage,
                    items: sourceItems
                },
                [destination.droppableId]: {
                    ...destStage,
                    items: destItems
                }
            });

            // Pošalji API poziv za ažuriranje statusa
            try {
                // Mapiranje naziva kolona na srpske nazive koje backend očekuje
                const statusMapping = {
                    "Novi": "NOVI",
                    "Kontaktiran": "KONTAKTIRAN", 
                    "Ponuda data": "PONUDA DATA",
                    "Zatvoren": "ZATVOREN",
                    "Odbijen": "ODBIJEN",
                    "Zastao": "ZASTAO"
                };
                
                const serbianStatus = statusMapping[destination.droppableId] || "NOVI";
                await updateContactStatus(removed.email, serbianStatus);
                console.log(`Status kontakta ${removed.name} ažuriran na ${serbianStatus} (${destination.droppableId})`);
            } catch (error) {
                console.error('Greška pri ažuriranju statusa kontakta:', error);
                setError('Greška pri ažuriranju statusa kontakta');
                
                // Vrati na prethodnu poziciju ako je API poziv neuspešan
                setStages({
                    ...stages,
                    [source.droppableId]: {
                        ...sourceStage,
                        items: [...sourceStage.items, removed]
                    },
                    [destination.droppableId]: {
                        ...destStage,
                        items: destStage.items.filter(item => item.id !== removed.id)
                    }
                });
            }
        }
    };

    return (
        <Box>
            {/* Error Alert */}
            {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

            {/* Loading indicator */}
            {loading && (
                <Box display="flex" justifyContent="center" my={4}>
                    <CircularProgress />
                </Box>
            )}

            <DragDropContext onDragEnd={onDragEnd}>
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: isMobile ? "1fr" : `repeat(${Object.keys(stages).length || 4}, 1fr)`,
                        gap: 2,
                        height: "100%"
                    }}
                >
                {Object.entries(stages).map(([stageId, stage]) => (
                    <Box key={stageId}>
                        <Typography
                            variant="h6"
                            sx={{
                                color: colors.grey[100],
                                mb: 2,
                                textAlign: "center"
                            }}
                        >
                            {stage.title}
                        </Typography>
                        <Droppable droppableId={stageId}>
                            {(provided) => (
                                <Paper
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    sx={{
                                        backgroundColor: colors.primary[600],
                                        p: 2,
                                        minHeight: "500px",
                                        height: "100%"
                                    }}
                                >
                                    {stage.items.map((item, index) => (
                                        <Draggable
                                            key={item.id}
                                            draggableId={item.id}
                                            index={index}
                                        >
                                            {(provided) => (
                                                <Paper
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    sx={{
                                                        backgroundColor: colors.primary[400],
                                                        p: 2,
                                                        mb: 2,
                                                        cursor: "grab",
                                                        "&:hover": {
                                                            backgroundColor: colors.primary[500]
                                                        }
                                                    }}
                                                >
                                                    <Typography
                                                        variant="subtitle1"
                                                        sx={{ color: colors.grey[100], fontWeight: 'bold' }}
                                                    >
                                                        {item.name}
                                                    </Typography>
                                                    <Typography
                                                        variant="body2"
                                                        sx={{ color: colors.grey[300], mb: 1 }}
                                                    >
                                                        {item.company}
                                                    </Typography>

                                                    <Typography
                                                        variant="body2"
                                                        sx={{ color: colors.grey[400], fontSize: '0.75rem' }}
                                                    >
                                                        📧 {item.email}
                                                    </Typography>
                                                    {item.phone !== 'N/A' && (
                                                        <Typography
                                                            variant="body2"
                                                            sx={{ color: colors.grey[400], fontSize: '0.75rem' }}
                                                        >
                                                            📞 {item.phone}
                                                        </Typography>
                                                    )}
                                                </Paper>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </Paper>
                            )}
                        </Droppable>
                    </Box>
                ))}
            </Box>
        </DragDropContext>
        </Box>
    );
};

export default PipelineBoard; 