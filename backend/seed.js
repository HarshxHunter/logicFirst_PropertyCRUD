const mongoose = require("mongoose");
require("dotenv").config();
const Property = require("./models/Property");

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("MongoDB connected for seeding"))
    .catch(err => console.error(err));

async function seedData() {
    await Property.deleteMany({}); // clear existing data

    const dummyData = [
        { title: "2BHK Apartment in Adityapur", type: "apartment", city: "jamshedpur", price: 12000 },
        { title: "Independent House in Bistupur", type: "house", city: "jamshedpur", price: 15000 },
        { title: "1BHK Flat in Sakchi", type: "apartment", city: "jamshedpur", price: 8000 },
        { title: "Luxury Villa in Sonari", type: "villa", city: "jamshedpur", price: 30000 }
    ];

    await Property.insertMany(dummyData);
    console.log("Dummy data inserted ✅");
    mongoose.connection.close();
}

seedData();
