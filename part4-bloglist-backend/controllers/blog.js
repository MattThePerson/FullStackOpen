const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");

const isNotUniqueBlog = async (blog) => {
    const urlMatch = await Blog.findOne({ url: blog.url });
    return urlMatch !== null;
};

const userAuthorize = async (req, res, next) => {
    if (!req.user || !req.user.id) {
        return res.status(401).json({
            error: "unauthorized action"
        });
    }
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(401).json({
                error: "unauthorized action"
            });
        }
    } catch {
        return res.status(401).json({
            error: "unauthorized action"
        });
    }
    next();
};

// GET
blogsRouter.get("/", async (req, res) => {
    const blogs = await Blog
        .find({})
        .populate("user", { username: 1, name: 1 });
    res.json(blogs);
});

// GET :id
blogsRouter.get("/:id", async (req, res) => {
    const id = req.params.id;
    const blog = await Blog
        .findById(id)
        .populate("user", { username: 1, name: 1 });
    if (!blog) {
        return res.status(404).json({ error: "no blog with that id" });
    }
    res.json(blog);
});

// POST
blogsRouter.post("/", userAuthorize, async (req, res) => {
    const { title, author, url, likes } = req.body;
    const blog = new Blog({ title, author, url, likes });
    if (await isNotUniqueBlog(blog)) {
        return res.status(400).json({
            error: "that exact blog was already submitted"
        });
    }
    const user = await User.findById(req.user.id);
    blog.user = user._id;
    user.blogs = user.blogs.concat(blog._id);
    const result = await blog.save();
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
blogsRouter.delete("/:id", userAuthorize, async (req, res) => {
    const id = req.params.id;
    const blog = await Blog.findById(id);
    if (!blog) {
        return res.status(204).end();
    }
    if (blog.user.toString() !== req.user.id) {
        return res.status(401).json({ error: "only the creator of a blog can delete it" });
    }
    await Blog.findByIdAndDelete(id);
    res.status(204).end();
});

module.exports = blogsRouter;
