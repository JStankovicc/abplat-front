import { useState } from "react";
import {
    Box,
    Paper,
    Typography,
    useTheme,
    useMediaQuery
} from "@mui/material";
import { tokens } from "../../theme";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

// Mock podaci
const initialStages = {
    novi: {
        title: "Novi",
        items: [
            { id: "1", name: "Marko Marković", value: "50.000 RSD", assigned: "Ana Anić" },
            { id: "2", name: "Petar Petrović", value: "75.000 RSD", assigned: "Marko Marković" }
        ]
    },
    kontaktiran: {
        title: "Kontaktiran",
        items: [
            { id: "3", name: "Jana Janić", value: "100.000 RSD", assigned: "Petar Petrović" }
        ]
    },
    demo: {
        title: "Demo",
        items: [
            { id: "4", name: "Stefan Stefanović", value: "150.000 RSD", assigned: "Ana Anić" }
        ]
    },
    zatvoreno: {
        title: "Zatvoreno",
        items: [
            { id: "5", name: "Mila Milić", value: "200.000 RSD", assigned: "Marko Marković" }
        ]
    }
};

const PipelineBoard = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isMobile = useMediaQuery("(max-width:768px)");
    const [stages, setStages] = useState(initialStages);

    const onDragEnd = (result) => {
        if (!result.destination) return;

        const { source, destination } = result;
        
        if (source.droppableId === destination.droppableId) {
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
            const sourceStage = stages[source.droppableId];
            const destStage = stages[destination.droppableId];
            const sourceItems = [...sourceStage.items];
            const destItems = [...destStage.items];
            const [removed] = sourceItems.splice(source.index, 1);
            destItems.splice(destination.index, 0, removed);
            
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
        }
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: isMobile ? "1fr" : "repeat(4, 1fr)",
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
                                                        sx={{ color: colors.grey[100] }}
                                                    >
                                                        {item.name}
                                                    </Typography>
                                                    <Typography
                                                        variant="body2"
                                                        sx={{ color: colors.greenAccent[500] }}
                                                    >
                                                        {item.value}
                                                    </Typography>
                                                    <Typography
                                                        variant="body2"
                                                        sx={{ color: colors.grey[100] }}
                                                    >
                                                        Dodeljen: {item.assigned}
                                                    </Typography>
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
    );
};

export default PipelineBoard; 