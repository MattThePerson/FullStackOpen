const blogsRoute = require("express").Router();
const Blog = require("../models/blog");

// GET
blogsRoute.get("/", async (req, res) => {
    const blogs = await Blog.find({});
    res.json(blogs);
});

// POST
blogsRoute.post("/", async (req, res) => {
    const blog = new Blog(req.body);

    blog.save().then(result => {
        res.status(201).json(result);
    });
});

module.exports = blogsRoute;
