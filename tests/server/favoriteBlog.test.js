const listHelper = require('../../server/utils/list_helper')

describe('favorite blog', () => {
  const listWithOneBlog = [
    {
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      likes: 5
    }
  ]

  const listWithMultipleHigh = [
    { title: 'Jeees', author: 'Seppo', likes: 7 }, { title: 'Deees', author: 'Deppo', likes: 7 }, { title: 'Keees', author: 'Keppo', likes: 3 }, { title: 'Leees', author: 'Leppo', likes: 4 }, { title: 'Meees', author: 'Meppo', likes: 2 }
  ]

  const blogs = [ { title: 'React patterns', author: 'Michael Chan', likes: 7 }, { title: 'Go To Statement Considered Harmful', author: 'Edsger W. Dijkstra', likes: 5 }, { title: 'Canonical string reduction', author: 'Edsger W. Dijkstra', likes: 12 }, { title: 'First class tests', author: 'Robert C. Martin', likes: 10 }, { title: 'TDD harms architecture', author: 'Robert C. Martin', likes: 0 }, { title: 'Type wars', author: 'Robert C. Martin', likes: 2, }
  ]

  test('when list has only one blog equals favorite blog as', () => {
    const result = listHelper.favoriteBlog(listWithOneBlog)
    expect(result).toEqual(listWithOneBlog[0])
  })

  test('when list has multiple blogs favorite of those', () => {
    const result = listHelper.favoriteBlog(blogs)
    expect(result).toEqual(blogs[2])
  })

  test('when list has multiple blogs with highest likes value return one of those', () => {
    const result = listHelper.favoriteBlog(listWithMultipleHigh)
    expect(result).toEqual(listWithMultipleHigh[1])
  })
})