const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

// GET
blogsRouter.get("/", async (req, res) => {
    const blogs = await Blog.find({});
    res.json(blogs);
});

// POST
blogsRouter.post("/", async (req, res) => {
    const blog = new Blog(req.body);
    const result = await blog.save();
    res.status(201).json(result);
});

// PUT
blogsRouter.put("/:id", async (req, res) => {
    const { title, author, url, likes } = req.body;
    const id = req.params.id;
    const blog = await Blog.findById(id);
    if (!blog) {
        return res.status(404).send({ error: "no blog with that id" });
    }
    blog.title = title;
    blog.author = author;
    blog.url = url;
    blog.likes = likes;
    const upBlog = await blog.save();
    res.json(upBlog);
});

// DELETE
blogsRouter.delete("/:id", async (req, res) => {
    const id = req.params.id;
    await Blog.findByIdAndDelete(id);
    res.status(204).end();
});

module.exports = blogsRouter;
