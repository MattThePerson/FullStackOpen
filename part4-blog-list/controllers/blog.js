const blogsRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const logging = require("../utils/logger");
const Blog = require("../models/blog");
const User = require("../models/user");

const isNotUniqueBlog = async (blog) => {
    const urlMatch = await Blog.findOne({ url: blog.url });
    return urlMatch !== null;
};

// GET
blogsRouter.get("/", async (req, res) => {
    const blogs = await Blog
        .find({})
        .populate("user", { username: 1, name: 1 });
    res.json(blogs);
});

// POST
blogsRouter.post("/", async (req, res) => {
    // authorization
    let decodedToken;
    try {
        decodedToken = jwt.verify(req.token, process.env.SECRET);
    } catch (e) {
        if (e instanceof jwt.JsonWebTokenError) {
            logging.error("invalid signature for webtoken");
        }
    }
    if (!decodedToken || !decodedToken.id) {
        return res.status(401).json({
            error: "unauthorized action"
        });
    }
    // save blog and update user
    const { title, author, url, likes } = req.body;
    const blog = new Blog({ title, author, url, likes });
    if (await isNotUniqueBlog(blog)) {
        return res.status(400).json({
            error: "that exact blog was already submitted"
        });
    }
    const user = await User.findById(decodedToken.id);
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
blogsRouter.delete("/:id", async (req, res) => {
    const id = req.params.id;
    await Blog.findByIdAndDelete(id);
    res.status(204).end();
});

module.exports = blogsRouter;
