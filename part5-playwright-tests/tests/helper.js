
const sampleBlog = {
  title: "How to use Playwright",
  author: "Mr Beans",
  url: "https://website.com/playwright",
}

const handleLogin = async (page, username, password) => {
  await page.getByLabel("Username").fill(username);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "submit" }).click()
}

const handlePostBlog = async (page, title, author, url) => {
  await page.getByRole("button", { name: "create new blog" })
  await page.getByLabel("Title").fill(title)
  await page.getByLabel("Author").fill(author)
  await page.getByLabel("URL").fill(url)
  await page.getByRole("button", { name: "create" }).click()
}

module.exports = {
  handleLogin,
  handlePostBlog,
  sampleBlog,
}

