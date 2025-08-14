import { Card, CardContent, Typography, TextField, CircularProgress } from "@mui/material";
import { Notes as NotesIcon } from "@mui/icons-material";

const Notes = ({ note, onNoteChange, loading = false }) => {

    return (
        <Card sx={{ height: '100%' }}>
            <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ display: 'flex', alignItems: 'center' }}>
                        <NotesIcon sx={{ mr: 1 }} /> Beleške
                    </span>
                    {loading && <CircularProgress size={20} />}
                </Typography>
                <TextField
                    fullWidth
                    multiline
                    rows={4}
                    value={note || ''}
                    onChange={(e) => onNoteChange(e.target.value)}
                    placeholder="Zapišite svoje beleške ovde..."
                    variant="outlined"
                    disabled={loading}
                    sx={{ mt: 1 }}
                />
            </CardContent>
        </Card>
    );
};

export default Notes;