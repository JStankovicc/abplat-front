import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Box, Button, TextField, Typography, Link, useTheme } from "@mui/material";

const LoginPage = ({ onLogin }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const theme = useTheme();

    const notify = (message) => {
        toast.error(message, {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            notify("Please enter your email and password!");
            return;
        }
        try {
            const response = await axios.post("http://localhost:8080/api/v1/auth/signin", { email, password });
            const token = response.data.token;
            onLogin(token); // Pass the token to the parent component
        } catch (error) {
            notify("Prijavljivanje nije uspelo. Molimo Vas da proverite svoje kredencijale i pokušate ponovno.");
        }
    };

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100vh"
            sx={{
                backgroundColor: "background.default",
                padding: 3,
                color: "text.primary",
            }}
        >
            {/* Forma za prijavu */}
            <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: 400, zIndex: 2 }}>
                <Box textAlign="center" marginBottom={3}>
                    <img
                        src={
                            theme.palette.mode === "dark"
                                ? "/assets/ABPlatLogoInline.png"
                                : "/assets/ABPlatLogoInlineDark.png"
                        }
                        alt="Logo"
                        style={{ height: "60px", marginBottom: "20px" }}
                    />
                </Box>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", color: "text.primary" }}>
                    DOBRODOŠLI NAZAD!
                </Typography>
                <Typography variant="body1" paragraph sx={{ color: "text.secondary" }}>
                    Unesite svoje kredencijale.
                </Typography>
                <TextField
                    label="Email"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    sx={{
                        marginBottom: 2,
                        "& .MuiInputLabel-root": {
                            color: "text.primary",
                        },
                        "& .MuiInputBase-root": {
                            backgroundColor: "background.paper",
                            color: "text.primary",
                        },
                        "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                                borderColor: "text.primary",
                            },
                        },
                    }}
                />
                <TextField
                    label="Šifra"
                    variant="outlined"
                    type="password"
                    fullWidth
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    sx={{
                        marginBottom: 3,
                        "& .MuiInputLabel-root": {
                            color: "text.primary",
                        },
                        "& .MuiInputBase-root": {
                            backgroundColor: "background.paper",
                            color: "text.primary",
                        },
                        "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                                borderColor: "text.primary",
                            },
                        },
                    }}
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{
                        padding: "12px",
                        fontSize: "16px",
                        backgroundColor: "primary.main",
                        "&:hover": {
                            backgroundColor: "primary.dark",
                        },
                    }}
                >
                    Uloguj se
                </Button>
                <Box textAlign="center" marginTop={2}>
                    <Link
                        href="/reset-password"
                        sx={{
                            textDecoration: "none",
                            color: theme.palette.mode === "dark" ? "primary.light" : "primary.main",
                        }}
                    >
                        Zaboravili ste šifru?
                    </Link>
                </Box>
            </form>
            <ToastContainer />
        </Box>
    );
};

export default LoginPage;
