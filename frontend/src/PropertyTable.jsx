import React, { useEffect, useState } from "react";
import {
    Box,
    TextField,
    IconButton,
    Menu,
    MenuItem,
    Paper,
    Button,
    Typography,
    Select,
    InputLabel,
    FormControl,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import axios from "axios";
import { useSearchParams, useNavigate, useLocation, useParams } from "react-router-dom";
import EditPropertyModal from "./EditPropertyModal";
import CreatePropertyModal from "./CreatePropertyModal";
import AddIcon from '@mui/icons-material/Add';

export default function PropertyTable() {
    const { id } = useParams();

    useEffect(() => {
        if (id) {
            setEditingPropertyId(id);
            setEditModalOpen(true);
        }
    }, [id]);
    const navigate = useNavigate();
    const location1 = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();

    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(false);

    // Temporary local form state (before Apply Filter is clicked)
    const [formTitle, setFormTitle] = useState("");
    const [formLocation, setFormLocation] = useState("");
    const [formMaxPrice, setFormMaxPrice] = useState("");
    const [formType, setFormType] = useState("");
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editingPropertyId, setEditingPropertyId] = useState(null);

    const openEditModal = (id) => {
        const isAlreadyEditing = location1.pathname.startsWith("/property/edit");
        const backUrl =
            !isAlreadyEditing
                ? `${location1.pathname}${location1.search}`
                : decodeURIComponent(new URLSearchParams(location1.search).get("backurl") || "/");

        navigate(`/property/edit/${id}?backurl=${encodeURIComponent(backUrl)}`);
        setEditingPropertyId(id);
        setEditModalOpen(true);
    };



    const closeEditModal = () => {
        const params = new URLSearchParams(location1.search);
        const backUrl = params.get("backurl") || "/";
        navigate(backUrl);
        setEditingPropertyId(null);
        setEditModalOpen(false);
    };


    // Actual filter state (from URL)
    const [searchTitle, setSearchTitle] = useState(searchParams.get("title") || "");
    const [location, setLocation] = useState(searchParams.get("location") || "");
    const [maxPrice, setMaxPrice] = useState(searchParams.get("maxprice") || "");
    const [type, setType] = useState(searchParams.get("type") || "");
    const [page, setPage] = useState(Number(searchParams.get("page") || 0));
    const [pageSize, setPageSize] = useState(Number(searchParams.get("rows") || 10));

    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedId, setSelectedId] = useState(null);
    const [createModalOpen, setCreateModalOpen] = useState(false);

    const openCreateModal = () => setCreateModalOpen(true);
    const closeCreateModal = () => setCreateModalOpen(false);

    const handleMenuOpen = (event, id) => {
        setAnchorEl(event.currentTarget);
        setSelectedId(id);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedId(null);
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:5000/api/property/delete/${selectedId}`);
            fetchProperties();
        } catch (err) {
            console.error(err);
        }
        handleMenuClose();
    };

    const handleEdit = () => {
        openEditModal(selectedId);
        handleMenuClose();
    };

    const fetchProperties = async () => {
        setLoading(true);
        try {
            const res = await axios.get("http://localhost:5000/api/property/grid", {
                params: {
                    page: page + 1,
                    rows: pageSize,
                    title: searchTitle || undefined,
                    location: location || undefined,
                    type: type || undefined,
                    maxprice: maxPrice || undefined,
                },
            });
            setProperties(res.data);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    useEffect(() => {
        // Only trigger fetch when actual filter state changes (after Apply is clicked)
        const params = {
            page,
            rows: pageSize,
            title: searchTitle || undefined,
            location: location || undefined,
            type: type || undefined,
            maxprice: maxPrice || undefined,
        };

        // Clean undefined params (to avoid empty query params in URL)
        Object.keys(params).forEach((key) =>
            params[key] === undefined ? delete params[key] : null
        );

        setSearchParams(params);
        fetchProperties();
    }, [page, pageSize, searchTitle, location, type, maxPrice]);

    const handleFilterApply = () => {
        setPage(0);
        setSearchTitle(formTitle);
        setLocation(formLocation);
        setMaxPrice(formMaxPrice);
        setType(formType);
    };

    const columns = [
        { field: "title", headerName: "Title", flex: 1 },
        { field: "type", headerName: "Type", flex: 1 },
        { field: "city", headerName: "Location", flex: 1 },
        { field: "price", headerName: "Price", flex: 1 },
        {
            field: "actions",
            headerName: "Actions",
            flex: 0.5,
            renderCell: (params) => (
                <IconButton onClick={(e) => handleMenuOpen(e, params.row._id)}>
                    <MoreVertIcon />
                </IconButton>
            ),
        },
    ];


    return (
        <Paper sx={{ p: 2 }}>
            {editModalOpen &&
                <EditPropertyModal
                    open={editModalOpen}
                    onClose={closeEditModal}
                    propertyId={editingPropertyId}
                    onUpdate={fetchProperties}
                />
            }

            {createModalOpen && (
                <CreatePropertyModal
                    open={createModalOpen}
                    onClose={closeCreateModal}
                    onCreate={fetchProperties}
                />
            )}
            <Box sx={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                    Properties
                </Typography>

                <Button variant="contained" sx={{ mb: 2 }} onClick={openCreateModal}>
                    <AddIcon />
                    Create Property
                </Button>
            </Box>

            {/* Filter Form */}
            <Box sx={{ mb: 2, display: "flex", gap: 2, flexWrap: "wrap" }}>
                <TextField
                    label="Search by Title"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    size="small"
                />
                <TextField
                    label="Location"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    size="small"
                />
                <TextField
                    label="Max Price"
                    type="number"
                    value={formMaxPrice}
                    onChange={(e) => setFormMaxPrice(e.target.value)}
                    size="small"
                />
                <FormControl size="small" sx={{ minWidth: 150 }}>
                    <InputLabel>Type</InputLabel>
                    <Select
                        value={formType}
                        label="Type"
                        onChange={(e) => setFormType(e.target.value)}
                    >
                        <MenuItem value="">All</MenuItem>
                        <MenuItem value="apartment">Apartment</MenuItem>
                        <MenuItem value="villa">Villa</MenuItem>
                        <MenuItem value="plot">Plot</MenuItem>
                    </Select>
                </FormControl>
                <Button variant="contained" onClick={handleFilterApply}>
                    Apply Filters
                </Button>
            </Box>

            {/* Data Table */}
            <DataGrid
                rows={properties}
                columns={columns}
                getRowId={(row) => row._id}
                loading={loading}
                pagination
                paginationMode="server"
                rowCount={1000}
                page={page}
                pageSize={pageSize}
                onPageChange={(newPage) => setPage(newPage)}
                onPageSizeChange={(newSize) => setPageSize(newSize)}
                rowsPerPageOptions={[5, 10, 20]}
                autoHeight
            />

            {/* Actions Popover */}
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                <MenuItem onClick={handleEdit}>Edit</MenuItem>
                <MenuItem onClick={handleDelete}>Delete</MenuItem>
            </Menu>
        </Paper>
    );
}
