const dummy = (blogs) => {
    return 1
}

const getTotalLikes = (blogs) => {
    return blogs.reduce((acc, blog) => acc + blog.likes, 0)
}

const getFavoriteBlog = (blogs) => {
    let blogWithMostLikes = {}
    let mostLikes = 0;
    for (let i = 0; i < blogs.length; i++) {
        if(blogs[i].likes > mostLikes) {
            mostLikes = blogs[i].likes
            blogWithMostLikes = blogs[i]
        }
    }
    return blogWithMostLikes;
}


module.exports = {dummy, getTotalLikes, getFavoriteBlog}

