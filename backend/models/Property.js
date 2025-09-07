const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema({
    title: { type: String, required: true },
    type: { type: String, required: true },
    city: { type: String, required: true },
    price: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Property", propertySchema);
