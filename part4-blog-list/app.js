const express = require("express");
const mongoose = require("mongoose");
const config = require("./utils/config");
const logger = require("./utils/logger");
const blogsRoute = require("./controllers/blog");

/* db */
const mongoUrl = config.MONGODB_URI;
mongoose.connect(mongoUrl, { family: 4 })
    .then(() => {
        logger.info(`MongoDB connected: ${mongoUrl}`);
    })
    .catch(err => {
        logger.error(err);
    });

/* app */
const app = express();

app.use(express.json());
app.use("/api/blogs", blogsRoute);

module.exports = app;
