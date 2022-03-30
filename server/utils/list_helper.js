const _ = require ('lodash')

// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  const favorite = blogs.reduce((max, blog) => max.likes > blog.likes ? max : blog)
  const returnObject = {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes
  }
  return returnObject
}

const mostBlogs = (blogs) => {
  const authors = blogs.map((blog) => ({ author: blog.author }))

  const counts = _(authors)
    .countBy('author')
    .map((val,key) => {
      return {
        author: key,
        blogs: val
      }
    })
    .value()

  const returnObject = _.maxBy(counts,'blogs')
  return returnObject
}

const mostLikes = (blogs) => {
  const authors = blogs.map((blog) => ({ author: blog.author, likes: blog.likes }))

  let summed = _(authors)
    .groupBy('author')
    .map((objs, key) => {
      return {
        author: key,
        likes: _.sumBy(objs, 'likes')
      }
    })
    .value()

  const returnObject = _.maxBy(summed,'likes')
  return returnObject
}
module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}