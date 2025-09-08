import React, { useState } from "react";
import {
    Modal,
    Box,
    Typography,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";
import axios from "axios";

export default function CreatePropertyModal({ open, onClose, onCreate }) {
    const [title, setTitle] = useState("");
    const [location, setLocation] = useState("");
    const [price, setPrice] = useState("");
    const [type, setType] = useState("");

    const handleSubmit = async () => {
        try {
            await axios.post("http://localhost:5000/api/property/create", {
                title,
                city: location,
                price,
                type,
            });
            onCreate(); 
            onClose();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{ p: 4, bgcolor: "white", maxWidth: 500, margin: "50px auto", borderRadius: 2 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                    Create New Property
                </Typography>

                <TextField
                    label="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    fullWidth
                    sx={{ mb: 2 }}
                />

                <TextField
                    label="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    fullWidth
                    sx={{ mb: 2 }}
                />

                <TextField
                    label="Price"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    fullWidth
                    sx={{ mb: 2 }}
                />

                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Type</InputLabel>
                    <Select value={type} label="Type" onChange={(e) => setType(e.target.value)}>
                        <MenuItem value="apartment">Apartment</MenuItem>
                        <MenuItem value="villa">Villa</MenuItem>
                        <MenuItem value="plot">Plot</MenuItem>
                    </Select>
                </FormControl>

                <Button variant="contained" onClick={handleSubmit}>
                    Create Property
                </Button>
            </Box>
        </Modal>
    );
}
