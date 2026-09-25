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

    test("blogs sorted by likes", async ({ page }) => {
      // 1. add 3 blogs
      // await page.pause()
      const blogs = [
        { title: "Blog 1", author: "Mr. Smith", url: "https://blog.com/mr-smith" },
        { title: "Blog 2", author: "Mrs. Smith", url: "https://blog.com/mrs-smith" },
        { title: "Blog 3", author: "Ms. Smith", url: "https://blog.com/ms-smith" },
      ]
      // add blogs
      for (let blog of blogs) {
        await helper.handlePostBlog(page, blog.title, blog.author, blog.url)
      }
      // expand all blogs
      while (await page.getByRole("button", { name: "view" }).count() > 0) {
        await page.getByRole("button", { name: "view" }).first().click()
      }
      // 2. like blogs differing amounts
      // await page.pause()
      for (let i = 0; i < 12; i++) {
        const likeButtons = page.getByRole("button", { name: "like" })
        const count = await likeButtons.count()
        if (count === 0) break // nothing likeable, bail out
        const nth = Math.floor(Math.random() * count)
        await likeButtons.nth(nth).click()
        await page.waitForTimeout(100)
      }
      // 3. reload page and expand blogs
      // await page.pause()
      await page.goto("/")
      await page.waitForLoadState('networkidle')
      while (await page.getByRole("button", { name: "view" }).count() > 0) {
        await page.getByRole("button", { name: "view" }).first().click()
      }
      await expect(page.getByRole("button", { name: "view" })).toHaveCount(0)
      await expect(page.getByLabel("likes").first()).toBeVisible()
      // 4. enure likes in order
      const likesElements = await page.getByLabel("likes").all()
      const likesText = await Promise.all(likesElements.map(el => el.textContent()))
      const likes = likesText.map(el => Number(el))
      const likesSorted = [...likes].sort((a, b) => b - a)
      // console.log(likes)
      // await page.pause()
      expect(likes).toEqual(likesSorted)
    })

  }) // Describe: When logged int
}) // Describe: Blog app

