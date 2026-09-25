const express = require("express");
const mongoose = require("mongoose");
const config = require("./utils/config");
const logger = require("./utils/logger");
const middleware = require("./utils/middleware");

const blogsRouter = require("./controllers/blog");
const usersRouter = require("./controllers/user");
const loginRouter = require("./controllers/login");

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

app.use(middleware.tokenExtractor);
app.use(express.json());
app.use("/api/blogs", middleware.userExtractor, blogsRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);

if (process.env.NODE_ENV === "test") {
    const testRouter = require("./controllers/testing");
    app.use("/api/testing", testRouter);
}

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
