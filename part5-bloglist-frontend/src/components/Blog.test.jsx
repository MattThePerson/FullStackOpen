import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

const currentUser = { username: 'root' }

const blog = {
  title: 'Test blog',
  author: 'Mr Tester',
  url: 'https://some-website.com/test',
  likes: 1,
  user: currentUser,
}

test('blog: renders correctly (text visibility)', async () => {
  render(
    <Blog
      blog={blog}
      currentUser={currentUser}
    />
  )

  let visibleText = [blog.title, blog.author,]
  let nonVisibleText = [blog.url, blog.likes, blog.user.username,]

  for (let txt of visibleText) {
    expect(await screen.findByText(txt)).toBeVisible()
  }

  for (let txt of nonVisibleText) {
    expect(screen.queryByText(txt)).not.toBeVisible()
  }
})

test('blog: details visible when view button clicked', async () => {
  render(
    <Blog
      blog={blog}
      currentUser={currentUser}
    />
  )

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  for (let txt of [blog.url, blog.likes]) {
    expect(await screen.findByText(txt)).toBeVisible()
  }

})

test('blog: like button called twice', async () => {

  const mockHandler = vi.fn()

  render(
    <Blog
      blog={blog}
      handleLikeBlog={mockHandler}
      currentUser={currentUser}
    />
  )

  const user = userEvent.setup()
  const button = screen.getByText('like')
  await user.click(button)
  await user.click(button)

  expect(mockHandler.mock.calls).toHaveLength(2)
})

