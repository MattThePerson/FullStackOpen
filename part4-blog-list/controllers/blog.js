const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");

// GET
blogsRouter.get("/", async (req, res) => {
    const blogs = await Blog
        .find({})
        .populate("user", { username: 1, name: 1 });
    res.json(blogs);
});

// POST
blogsRouter.post("/", async (req, res) => {
    const { title, author, url, likes } = req.body;
    const blog = new Blog({ title, author, url, likes });
    const user = (await User.find({}))[0]; // TODO: replace with proper logic
    blog.user = user._id;
    const result = await blog.save();
    user.blogs = user.blogs.concat(blog._id);
    await user.save();
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
