import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
} from "@mui/material";
import axios from "axios";

export default function EditPropertyModal({ open, onClose, propertyId, onUpdate }) {
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState("");
    const [type, setType] = useState("");
    const [city, setCity] = useState("");
    const [price, setPrice] = useState("");

    useEffect(() => {
        if (propertyId && open) {
            const fetchProperty = async () => {
                setLoading(true);
                try {
                    const res = await axios.get(`http://localhost:5000/api/property/detail/${propertyId}`);
                    const data = res.data;
                    setTitle(data.title);
                    setType(data.type);
                    setCity(data.city);
                    setPrice(data.price);
                } catch (err) {
                    console.error(err);
                }
                setLoading(false);
            };
            fetchProperty();
        }
    }, [propertyId, open]);

    const handleSubmit = async () => {
        try {
            await axios.put(`http://localhost:5000/api/property/update/${propertyId}`, {
                title,
                type,
                city,
                price,
            });

            alert("Property updated successfully!");
            onUpdate(); // Notify parent to refetch list
            onClose();
        } catch (err) {
            console.error(err);
            alert("Failed to update property");
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Edit Property</DialogTitle>

            <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
                {loading ? (
                    <CircularProgress />
                ) : (
                    <>
                        <TextField
                            label="Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />

                        <FormControl required>
                            <InputLabel>Type</InputLabel>
                            <Select value={type} onChange={(e) => setType(e.target.value)}>
                                <MenuItem value="apartment">Apartment</MenuItem>
                                <MenuItem value="villa">Villa</MenuItem>
                                <MenuItem value="plot">Plot</MenuItem>
                            </Select>
                        </FormControl>

                        <TextField
                            label="City"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            required
                        />

                        <TextField
                            label="Price"
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            required
                        />
                    </>
                )}
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit} variant="contained">
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
}
