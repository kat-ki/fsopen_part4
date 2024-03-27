const dummy = (blogs) => {
    return 1
}

const getTotalLikes = (blogs) => {
    return blogs.reduce((acc, blog) => acc + blog.likes, 0)
}

module.exports = {dummy, getTotalLikes}

