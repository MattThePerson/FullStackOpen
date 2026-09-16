const { test, describe, beforeEach, after } = require("node:test");
const assert = require("assert");
const supertest = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const helper = require("./helper");
const User = require("../models/user");

const api = supertest(app);

describe("user api", () => {

    beforeEach(async () => {
        await User.deleteMany({});
        for (let userObj of helper.initialUsers) {
            const user = new User(userObj);
            await user.save();
        }
    });

    test("POST: valid user created", async () => {
        const validUser = {
            username: "root",
            name: "",
            password: "1234",
        };
        await api
            .post("/api/users")
            .send(validUser)
            .expect(201)
            .expect("Content-Type", /application\/json/);
        const userAdded = (await helper.getUsersInDb()).find(u => u.username === validUser.username);
        assert(userAdded);
    });

    test("POST: invalid user (username)", async () => {
        const invalidUser = {
            username: "ro",
            name: "",
            password: "1234",
        };
        await api
            .post("/api/users")
            .send(invalidUser)
            .expect(400)
            .expect("Content-Type", /application\/json/);
    });

    // TODO
    test("POST: invalid user (same username)", async () => {
        const invalidUser = {
            username: "user1",
            name: "",
            password: "1234",
        };
        await api
            .post("/api/users")
            .send(invalidUser)
            .expect(400)
            .expect("Content-Type", /application\/json/);
    });

    test("POST: invalid user (password)", async () => {
        const invalidUser = {
            username: "root",
            name: "",
            password: "12",
        };
        await api
            .post("/api/users")
            .send(invalidUser)
            .expect(400)
            .expect("Content-Type", /application\/json/);
    });
});

after(async () => {
    await mongoose.connection.close();
});
