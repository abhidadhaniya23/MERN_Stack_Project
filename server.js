const express = require("express");
const app = express();
const connectDB = require("./config/db");
const PORT = 3000 || process.env.PORT;

// connect Database
connectDB();

// init body-parser
app.use(express.json({ extended: false }));
// Define routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/post", require("./routes/api/post"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/auth", require("./routes/api/auth"));

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.listen(PORT, () => {
  console.log(`App started at http://localhost:${PORT}`);
});
