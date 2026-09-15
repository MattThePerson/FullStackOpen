const Blog = require("../models/blog");

const initialBlogs = [
    {
        title: "To blog or not to blog",
        author: "Mitch McMackmuck",
        url: "https://mitch.blog.org/blog-1",
        likes: 69,
    },
    {
        title: "What a blog",
        author: "Mitchelle Omabna",
        url: "https://notciapsyop.us.gov/what-a-blog",
        likes: 42,
    },
    {
        title: "The second coming of Burger King",
        author: "Mitch McMackmuck",
        url: "https://mitch.blog.org/blog-2",
        likes: 1,
    },
];

function getBlogs() {
    const blogs = initialBlogs.map(blog => new Blog(blog));
    return blogs.map(b => b.toJSON());
}

module.exports = {
    initialBlogs,
    getBlogs,
};
