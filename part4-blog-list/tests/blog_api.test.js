const { test, describe, after, beforeEach } = require("node:test");
const assert = require("assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const helper = require("./helper");
const app = require("../app");
const Blog = require("../models/blog");

const api = supertest(app);

describe("blog api", () => {

    // GET
    test("GET: all blogs", async () => {
        const response = await api
            .get("/api/blogs")
            .expect(200)
            .expect("Content-Type", /application\/json/);
        assert(response.body.length === helper.initialBlogs.length);
    });

    // GET
    test("GET: blogs have id prop", async () => {
        const response = await api.get("/api/blogs");
        const blog = response.body[0];
        assert(blog.id);
        assert(typeof blog.id === "string");
        assert(typeof blog._id === "undefined");
    });

    // POST
    test("POST: new valid blog", async () => {
        const newBlog = {
            title: "On Hayy",
            author: "Mr Horse",
            url: "https://equine.blog.wtf/on-hayy",
            likes: 420,
        };
        // post
        await api
            .post("/api/blogs")
            .send(newBlog)
            .expect(201)
            .expect("Content-Type", /application\/json/);
        const blogsInDb = await helper.getBlogsInDb();
        assert(blogsInDb.length === helper.initialBlogs.length + 1);
        const newlyAdded = blogsInDb.find(blog => blog.title === newBlog.title);
        assert(newlyAdded);
        delete newlyAdded.id; // delete MongoDB's id
        assert.deepStrictEqual(newlyAdded, newBlog);
    });

    // DELETE
    test("DELETE: by id", async () => {
        const blogsAtStart = await helper.getBlogsInDb();
        const id = blogsAtStart[0].id;
        await api
            .delete(`/api/blogs/${id}`)
            .expect(204);
        const blogsAtEnd = await helper.getBlogsInDb();
        assert.equal(blogsAtStart.length, blogsAtEnd.length + 1);
        const blogWithId = (await helper.getBlogsInDb()).find(b => b.id === id);
        assert(!blogWithId);
    });

    // PUT
    test("PUT: update existing blog", async () => {
        const blog = (await helper.getBlogsInDb())[0];
        const id = blog.id;
        await api
            .put(`/api/blogs/${id}`)
            .send(blog)
            .expect(200)
            .expect("Content-Type", /application\/json/);
        const blogAfter = (await helper.getBlogsInDb()).find(b => b.id === id);
        assert.deepStrictEqual(blog, blogAfter);
        assert.strictEqual(blog.likes, blogAfter.likes);
    });

    // PUT
    test("PUT: non-existing blog", async () => {
        const blog = (await helper.getBlogsInDb())[0];
        const id = "1234";
        await api
            .put(`/api/blogs/${id}`)
            .send(blog)
            .expect(400);
    });

});

beforeEach(async () => {
    await Blog.deleteMany({});
    const blogs = helper.initialBlogs;
    for (let blog of blogs) {
        const blogObj = new Blog(blog);
        await blogObj.save();
    }
});

after(async () => {
    await mongoose.connection.close();
});
