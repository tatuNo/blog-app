const listHelper = require('../../server/utils/list_helper')

describe('most blogs', () => {
  const blogs = [ { title: 'React patterns', author: 'Michael Chan', likes: 7 }, { title: 'Go To Statement Considered Harmful', author: 'Edsger W. Dijkstra', likes: 5 }, { title: 'Canonical string reduction', author: 'Edsger W. Dijkstra', likes: 12 }, { title: 'First class tests', author: 'Robert C. Martin', likes: 10 }, { title: 'TDD harms architecture', author: 'Robert C. Martin', likes: 0 }, { title: 'Type wars', author: 'Robert C. Martin', likes: 2, }
  ]

  test('when multiple writers', () => {
    const result = listHelper.mostBlogs(blogs)
    const expected = {
      author: 'Robert C. Martin',
      blogs: 3
    }
    expect(result).toEqual(expected)
  })
})