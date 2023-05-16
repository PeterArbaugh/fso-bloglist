const _ = require('lodash')

const dummy = (blogs) => {
    if (blogs) {
        return 1
    }
}

const totalLikes = (blogs) => {
    if ( blogs.length === 0) {
        return 0
    } else if (blogs.length > 0) {
        console.log('elif statement')
        const sum = blogs.reduce((accumulator, currentValue) => {
            return accumulator + currentValue.likes
        }, 0)
        return sum
    }
}

const favoriteBlog = (blogs) => {
    if (blogs.length ===0) {
        return null
    }

    const fav = blogs.reduce((currentMax, currentBlog) => {
        return currentBlog.likes > currentMax.likes ? currentBlog : currentMax
    }, blogs[0])

    return {
        title: fav.title,
        author: fav.author,
        likes: fav.likes
    }
}

const mostBlogs = (blogs) => {
    const authors = _.groupBy(blogs, 'author')
    console.log(authors)
    const most = _.maxBy(
        Object.keys(authors),
        (author) => authors[author].length
    )
    const count = authors[most].length
    console.log(most)
    console.log(count)

    return {
        author: most,
        blogs: count
    }
}

const mostLikes = (blogs) => {
    const authors = _.groupBy(blogs, 'author')
    const likedAuthor = _.maxBy(
        Object.keys(authors),
        (author) => authors[author].reduce((total, post) => total + post.likes, 0)
    )
    console.log(likedAuthor)
    const likeSum = authors[likedAuthor].reduce((total, post) => total + post.likes, 0)

    return {
        author: likedAuthor,
        likes: likeSum
    }
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}