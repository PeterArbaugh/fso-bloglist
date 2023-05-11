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

module.exports = {
    dummy,
    totalLikes
}