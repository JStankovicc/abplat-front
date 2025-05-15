import {
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    IconButton,
    Box,
    useTheme
} from "@mui/material";
import { tokens } from "../../theme";
import { Close as CloseIcon } from "@mui/icons-material";

const MobileMenu = ({ open, onClose, sections, activeSection, onChangeSection, colors }) => {
    const theme = useTheme();

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    backgroundColor: colors.primary[600],
                    width: "250px"
                }
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    p: 1
                }}
            >
                <IconButton onClick={onClose} sx={{ color: colors.grey[100] }}>
                    <CloseIcon />
                </IconButton>
            </Box>
            <List>
                {sections.map((section) => (
                    <ListItem
                        key={section.id}
                        button
                        onClick={() => {
                            onChangeSection(section.id);
                            onClose();
                        }}
                        selected={activeSection === section.id}
                        sx={{
                            '&.Mui-selected': {
                                backgroundColor: colors.primary[500],
                                '&:hover': {
                                    backgroundColor: colors.primary[500]
                                }
                            }
                        }}
                    >
                        <ListItemIcon sx={{ color: colors.grey[100] }}>
                            {section.icon}
                        </ListItemIcon>
                        <ListItemText
                            primary={section.label}
                            sx={{ color: colors.grey[100] }}
                        />
                    </ListItem>
                ))}
            </List>
        </Drawer>
    );
};

export default MobileMenu; 