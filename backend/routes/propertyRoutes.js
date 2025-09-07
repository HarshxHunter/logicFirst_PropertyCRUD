const express = require("express");
const router = express.Router();
const Property = require("../models/Property");

// GET (list with filters)
router.get("/grid", async (req, res) => {
    try {
        const { page = 1, rows = 10, type, location, maxprice, title } = req.query;

        let filter = {};
        if (type) filter.type = { $in: type.split(",") };
        if (location) filter.city = location;
        if (maxprice) filter.price = { $lte: Number(maxprice) };
        if (title) filter.title = { $regex: title, $options: "i" }; // Case-insensitive match

        const properties = await Property.find(filter)
            .skip((page - 1) * rows)
            .limit(Number(rows));

        res.json(properties);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// GET (detail)
router.get("/detail/:id", async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        res.json(property);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST (create)
router.post("/create", async (req, res) => {
    try {
        const newProperty = new Property(req.body);
        const saved = await newProperty.save();
        res.json(saved);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT (update)
router.put("/update/:id", async (req, res) => {
    try {
        const updated = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE (single)
router.delete("/delete/:id", async (req, res) => {
    try {
        await Property.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE (bulk)
router.delete("/bulk-delete", async (req, res) => {
    try {
        const { ids } = req.body;
        await Property.deleteMany({ _id: { $in: ids } });
        res.json({ message: "Bulk delete successful" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
