import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Box,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

/**
 * Shared mobile menu for sections (inventory, sales, project, fleet, assets).
 * Sections with disabled: true are shown grayed out and not clickable (same as desktop).
 * @param {Object} props
 * @param {boolean} props.open - Whether menu is open
 * @param {function} props.onClose - Close callback
 * @param {Array} props.sections - Array of sections { id, label, icon, disabled? }
 * @param {string} props.activeSection - Active section ID
 * @param {function} props.onChangeSection - Section change callback
 * @param {Object} props.colors - tokens object for colors
 * @param {string} [props.anchor="right"] - Drawer position (left/right)
 * @param {boolean} [props.showCloseButton=false] - Show close button
 */
const MobileMenu = ({
  open,
  onClose,
  sections,
  activeSection,
  onChangeSection,
  colors,
  anchor = "right",
  showCloseButton = false,
}) => {
  const handleSectionClick = (section) => {
    if (section.disabled) return;
    onChangeSection(section.id);
    onClose();
  };

  return (
    <Drawer
      anchor={anchor}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          backgroundColor: colors.primary[600] || colors.primary[500] || colors.primary[400],
          color: colors.grey[100],
          width: anchor === "left" ? 240 : "min(280px, 85vw)",
          maxWidth: "100%",
        },
      }}
    >
      {showCloseButton && (
        <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
          <IconButton onClick={onClose} sx={{ color: colors.grey[100] }}>
            <CloseIcon />
          </IconButton>
        </Box>
      )}
      <List>
        {sections.map((section) => {
          const isDisabled = Boolean(section.disabled);
          return (
            <ListItem
              key={section.id}
              button
              disabled={isDisabled}
              onClick={() => handleSectionClick(section)}
              selected={!isDisabled && activeSection === section.id}
              sx={{
                opacity: isDisabled ? 0.6 : 1,
                cursor: isDisabled ? "not-allowed" : "pointer",
                color: isDisabled ? colors.grey[500] : colors.grey[100],
                "&.Mui-selected": {
                  backgroundColor: colors.primary[500] || colors.primary[600],
                  "&:hover": {
                    backgroundColor: colors.primary[500] || colors.primary[600],
                  },
                },
                "&:hover": !isDisabled ? {
                  backgroundColor: colors.primary[500],
                } : {},
                "&.Mui-disabled": {
                  opacity: 0.6,
                  color: colors.grey[500],
                },
              }}
            >
              <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>
                {section.icon}
              </ListItemIcon>
              <ListItemText
                primary={section.label}
                primaryTypographyProps={{ variant: "body1" }}
                sx={{ color: "inherit" }}
              />
            </ListItem>
          );
        })}
      </List>
    </Drawer>
  );
};

export default MobileMenu;
