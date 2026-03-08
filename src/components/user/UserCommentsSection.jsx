import { Box, Typography, TextField, Button, Grid, Stack, Avatar } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EventIcon from "@mui/icons-material/Event";

/**
 * User comments section with add note form.
 */
const UserCommentsSection = ({
  notes,
  newNote,
  onNewNoteChange,
  onAddNote,
  theme,
  colors,
  sectionStyle,
  scrollableContent,
}) => (
  <Box sx={sectionStyle}>
    <Typography variant="h5" mb="15px">
      Komentari ({notes.length})
    </Typography>
    <Box sx={{ mb: 2 }}>
      <TextField
        label="Novi komentar"
        value={newNote}
        onChange={(e) => onNewNoteChange(e.target.value)}
        multiline
        rows={3}
        fullWidth
      />
      <Button onClick={onAddNote} variant="contained" color="secondary" fullWidth sx={{ mt: 1 }}>
        Dodaj komentar
      </Button>
    </Box>
    <Box sx={scrollableContent}>
      {notes.map((note) => (
        <Box
          key={note.id}
          mb={2}
          p={2}
          borderRadius="4px"
          sx={{
            backgroundColor:
              theme.palette.mode === "dark" ? colors.primary[500] : colors.grey[800],
            color: theme.palette.mode === "dark" ? colors.grey[100] : colors.grey[300],
            transition: "all 0.3s ease",
            "&:hover": {
              backgroundColor:
                theme.palette.mode === "dark" ? colors.primary[800] : colors.primary[500],
              color: theme.palette.mode === "dark" ? colors.grey[300] : colors.grey[900],
            },
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <Typography variant="body1">{note.content}</Typography>
            </Grid>
            <Grid item xs={4}>
              <Stack alignItems="flex-end">
                <Box display="flex" alignItems="center" gap={1}>
                  <Avatar sx={{ width: 28, height: 28, bgcolor: colors.blueAccent[700] }}>
                    <PersonIcon fontSize="small" />
                  </Avatar>
                  <Typography variant="caption">{note.author}</Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1} mt={1}>
                  <EventIcon fontSize="small" />
                  <Typography variant="caption">{note.date}</Typography>
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      ))}
    </Box>
  </Box>
);

export default UserCommentsSection;
