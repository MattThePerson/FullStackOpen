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

const sampleBlog = {
    title: "Stupid weather today",
    author: "The stupid man",
    url: "https://stupid.man.com/weather",
    likes: 101,
};

async function getBlogsInDb() {
    const blogs = await Blog.find({});
    return blogs.map(blog => blog.toJSON());
}

module.exports = {
    initialBlogs,
    getBlogsInDb,
    sampleBlog,
};
