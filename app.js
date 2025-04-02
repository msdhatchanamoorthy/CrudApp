require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const Data = require("./models/Data");

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

// Database connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.get("/", async (req, res) => {
  try {
    const data = await Data.find();
    res.render("index", { data });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

app.get("/add", (req, res) => {
  res.render("add");
});

app.post("/add", async (req, res) => {
  try {
    const { value1, value2 } = req.body;
    const newData = new Data({ value1, value2 });
    await newData.save();
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

app.get("/edit/:id", async (req, res) => {
  try {
    const data = await Data.findById(req.params.id);
    res.render("edit", { data });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

app.post("/edit/:id", async (req, res) => {
  try {
    const { value1, value2 } = req.body;
    await Data.findByIdAndUpdate(req.params.id, { value1, value2 });
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

app.get("/delete/:id", async (req, res) => {
  try {
    await Data.findByIdAndDelete(req.params.id);
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});