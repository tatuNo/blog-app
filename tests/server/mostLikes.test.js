const listHelper = require('../../server/utils/list_helper')

describe('most likes', () => {
  const blogs = [ { title: 'React patterns', author: 'Michael Chan', likes: 7 }, { title: 'Go To Statement Considered Harmful', author: 'Edsger W. Dijkstra', likes: 5 }, { title: 'Canonical string reduction', author: 'Edsger W. Dijkstra', likes: 12 }, { title: 'First class tests', author: 'Robert C. Martin', likes: 10 }, { title: 'TDD harms architecture', author: 'Robert C. Martin', likes: 0 }, { title: 'Type wars', author: 'Robert C. Martin', likes: 2, }
  ]

  test('when multiple blogs', () => {
    const result = listHelper.mostLikes(blogs)
    const expected = {
      author: 'Edsger W. Dijkstra',
      likes: 17
    }
    expect(result).toEqual(expected)
  })
})