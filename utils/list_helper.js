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

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}