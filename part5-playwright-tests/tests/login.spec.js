const { test, expect, beforeEach, describe } = require("@playwright/test")
const helper = require("./helper")

describe("Blog app", () => {

  beforeEach(async ({ page, request }) => {
    await request.post("/api/testing/reset")
    await request.post("/api/users", {
      data: { name: "Some Guy", username: "root", password: "salainen" }
    })
    await request.post("/api/users", {
      data: { name: "Some Gal", username: "user1", password: "password" }
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
      await helper.handlePostBlog(page, title, author, url)
      // blog visible
      await expect(page.getByText(title)).toBeVisible()
      await expect(page.getByText(author)).toBeVisible()
    })

    test("blog can be liked", async ({ page }) => {
      const { title, author, url } = helper.sampleBlog
      await helper.handlePostBlog(page, title, author, url)
      await page.getByRole("button", { name: "view" }).click()
      await page.getByRole("button", { name: "like" }).click()
      await expect(page.getByLabel("likes")).toHaveText("1")
    })

    test("blog can be deleted", async ({ page }) => {
      page.on('dialog', async dialog => await dialog.accept()) // confirm window.confirm
      const { title, author, url } = helper.sampleBlog
      await helper.handlePostBlog(page, title, author, url)
      // blog is visible
      await expect(page.getByText(title)).toBeVisible()
      await expect(page.getByText(author)).toBeVisible()
      // delete
      await page.getByRole("button", { name: "view" }).click()
      await page.getByRole("button", { name: "delete" }).click()
      // blog is not visible
      await expect(page.getByText(title)).not.toBeVisible()
      await expect(page.getByText(author)).not.toBeVisible()
    })

    test("delete button only visible to creator", async ({ page }) => {
      const { title, author, url } = helper.sampleBlog
      await helper.handlePostBlog(page, title, author, url)
      await page.getByRole("button", { name: "view" }).click()
      await expect(page.getByRole("button", { name: "delete" })).toBeVisible()
      await helper.handleLogout(page)
      await helper.handleLogin(page, "user1", "password")
      await page.getByRole("button", { name: "view" }).click()
      await expect(page.getByRole("button", { name: "delete" })).not.toBeVisible()
    })

  }) // Describe: When logged int
}) // Describe: Blog app

