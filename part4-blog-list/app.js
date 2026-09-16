const express = require("express");
const mongoose = require("mongoose");
const config = require("./utils/config");
const logger = require("./utils/logger");
const middleware = require("./utils/middleware");
const blogsRouter = require("./controllers/blog");
const usersRouter = require("./controllers/user");

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
app.use("/api/blogs", blogsRouter);
app.use("/api/users", usersRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
