const blogsRoute = require("express").Router();
const Blog = require("../models/blog");

// GET
blogsRoute.get("/", (request, response) => {
    Blog.find({}).then((blogs) => {
        response.json(blogs);
    });
});

// POST
blogsRoute.post("/", (request, response) => {
    const blog = new Blog(request.body);

    blog.save().then((result) => {
        response.status(201).json(result);
    });
});

module.exports = blogsRoute;
