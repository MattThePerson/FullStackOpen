const { test, expect, beforeEach, describe } = require("@playwright/test")
const helper = require("./helper")

describe("Blog app", () => {

  beforeEach(async ({ page, request }) => {
    await request.post("/api/testing/reset")
    await request.post("/api/users", {
      data: { name: "Some Guy", username: "root", password: "salainen" }
    })
    await page.goto("/")
  })

  test("Login form is shown", async ({ page }) => {
    await expect(page.getByText("username")).toBeVisible()
    await expect(page.getByText("password")).toBeVisible()
    await expect(page.getByRole("button", { name: "submit" })).toBeVisible()
  })

  describe("Login", () => {

    test("succeeds with incorrect credentials", async ({ page }) => {
      await helper.handleLogin(page, "root", "salainen")
      // logged in ui visible
      await expect(page.getByRole("button", { name: "Log out" })).toBeVisible()
      await expect(page.getByText("logged in")).toBeVisible()
      // login form not visible
      await expect(page.getByText("username")).not.toBeVisible()
      await expect(page.getByText("password")).not.toBeVisible()
      await expect(page.getByRole("button", { name: "submit" })).not.toBeVisible()
    })

    test("fails with incorrect credentials", async ({ page }) => {
      await helper.handleLogin(page, "root1", "password")
      // logged in ui not visible
      await expect(page.getByRole("button", { name: "Log out" })).not.toBeVisible()
      await expect(page.getByText("logged in")).not.toBeVisible()
      // login form visible
      await expect(page.getByText("username")).toBeVisible()
      await expect(page.getByText("password")).toBeVisible()
      await expect(page.getByRole("button", { name: "submit" })).toBeVisible()
    })

  }) // describe: Login

  describe("When logged in", () => {

    beforeEach(async ({ page }) => {
      await helper.handleLogin(page, "root", "salainen")
    })

    test("a new blog can be created", async ({ page }) => {
      const { title, author, url } = helper.sampleBlog
      await page.getByRole("button", { name: "create new blog" }).click()
      await helper.handlePostBlog(page, title, author, url)
      // blog visible
      await expect(page.getByText(title)).toBeVisible()
      await expect(page.getByText(author)).toBeVisible()
    })

  }) // Describe: When logged int
}) // Describe: Blog app

