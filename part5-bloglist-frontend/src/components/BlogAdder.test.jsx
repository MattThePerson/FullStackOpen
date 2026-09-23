import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogAdder from './BlogAdder'

test('blog adder: onSubmit forwards correct data', async () => {

  // const mockHandler = vi.fn()

  const mockData = {
    title: 'Another one bytes the dust',
    author: 'Freddy Venus',
    url: 'https://who-fricking-cares.org/dust'
  }

  const mockHandler = (title, author, url, onSucc) => {
    expect(title).toBe(mockData.title)
    expect(author).toBe(mockData.author)
    expect(url).toBe(mockData.url)
    onSucc()
  }

  const { container } = render(
    <BlogAdder
      onSubmit={mockHandler}
    />
  )

  const user = userEvent.setup()
  const createButton = screen.getByText('create')

  // fill in inputs and submit
  await user.type(
    container.querySelector('.title-input'),
    mockData.title,
  )
  await user.type(
    container.querySelector('.author-input'),
    mockData.author,
  )
  await user.type(
    container.querySelector('.url-input'),
    mockData.url,
  )
  await user.click(createButton)

})

