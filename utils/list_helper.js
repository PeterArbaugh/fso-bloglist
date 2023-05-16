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
/*     let authors = []
    _.forEach(blogs, (blog) => {
        authors = authors.concat(blog.author)
    })
    console.log(authors)
    const authCounts = _.countBy(authors)
    console.log(authCounts) */

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

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs
}