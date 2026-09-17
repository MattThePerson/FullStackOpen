require("dotenv").config();
const config = require("../utils/config");

const PORT = process.env.PORT || 3003;

const MONGODB_URI = process.env.NODE_ENV === "test"
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI;

const SECRET = process.env.NODE_ENV === "test"
    ? "secret1234"
    : config.SECRET;

module.exports = { PORT, MONGODB_URI, SECRET };
