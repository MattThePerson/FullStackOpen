const jwt = require("jsonwebtoken");
const config = require("../utils/config");
const Blog = require("../models/blog");
const User = require("../models/user");

const invalidUserToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im5vbmV4aXN0YW50dXNlciIsImlkIjoiMTIzNCIsImlhdCI6MTc4OTYzODY4Mn0.CqviY1WePQR1LE2DWkKLuHT267x0VB1oM5WhU2Pj4IA";

const rootUserObj = {
    username: "root",
    passwordHash: "password",
};

const getRootUser = async () => {
    return await User.findOne({ username: rootUserObj.username });
};

const ensureRootUser = async () => {
    let user = await getRootUser();
    if (user) {
        return;
    }
    user = new User(rootUserObj);
    const savedUser = await user.save();
    return savedUser;
};

const getRootUserToken = async () => {
    const user = await User.findOne({ username: rootUserObj.username });
    const userObj = {
        username: rootUserObj.username,
        id: user._id,
    };
    const token = jwt.sign(
        userObj,
        config.SECRET,
    );
    return token;
};

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

const initialUsers = [
    {
        username: "user1",
        name: "Mr User",
        passwordHash: "1234",
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

async function getUsersInDb() {
    const users = await User.find({});
    return users.map(u => u.toJSON());
}

module.exports = {
    initialBlogs,
    initialUsers,
    getBlogsInDb,
    getUsersInDb,
    sampleBlog,
    ensureRootUser,
    getRootUser,
    getRootUserToken,
    invalidUserToken,
};
