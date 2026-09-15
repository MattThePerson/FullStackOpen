const { test, describe, after, beforeEach } = require("node:test");
const assert = require("assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const helper = require("./helper");
const app = require("../app");
const Blog = require("../models/blog");

const api = supertest(app);

describe("blog api", () => {

    test("api: get all blogs", async () => {
        const response = await api
            .get("/api/blogs")
            .expect(200)
            .expect("Content-Type", /application\/json/);
        assert(response.body.length === helper.initialBlogs.length);
    });

});

beforeEach(async () => {
    await Blog.deleteMany({});
    const blogs = helper.getBlogs();
    for (let blog of blogs) {
        const blogObj = new Blog(blog);
        await blogObj.save();
    }
});

after(() => {
    mongoose.connection.close();
});
