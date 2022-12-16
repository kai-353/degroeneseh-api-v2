const express = require("express");
const colors = require("colors");
const dotenv = require("dotenv").config();
const { errorHandler } = require("./middleware/errorMiddleware");

const connectDB = require("./config/db");

connectDB();

const app = express();

const port = process.env.PORT || 5000;

app.use(express.urlencoded({ extended: false }));

app.use("/api/users", require("./routes/users"));
app.use("/api/forum", require("./routes/forum"));
app.use("/api/documents", require("./routes/documents"));
// app.use("/api/admin", require("./routes/admin"));

app.use(errorHandler);

app.listen(port, console.log(`Server started on ${port}`));
