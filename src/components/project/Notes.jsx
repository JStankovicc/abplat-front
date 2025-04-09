import { useState } from "react";
import { Card, CardContent, Typography, TextField } from "@mui/material";
import { Notes as NotesIcon } from "@mui/icons-material";

const Notes = () => {
    const [note, setNote] = useState('');

    return (
        <Card sx={{ height: '100%' }}>
            <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <NotesIcon sx={{ mr: 1 }} /> Beleške
                </Typography>
                <TextField
                    fullWidth
                    multiline
                    rows={4}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Zapišite svoje beleške ovde..."
                    variant="outlined"
                    sx={{ mt: 1 }}
                />
            </CardContent>
        </Card>
    );
};

export default Notes;