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
        if (blogs[i].likes > mostLikes) {
            mostLikes = blogs[i].likes
            blogWithMostLikes = blogs[i]
        }
    }

    return blogWithMostLikes;
}

const getTopAuthor = (blogs) => {
    let authors = {}
    let topAuthor = {author: '', blogs: 0}

    for (let i = 0; i < blogs.length; i++) {
        let currAuthorName = blogs[i].author;
        if (!authors[currAuthorName]) {
            authors[currAuthorName] = 1;
        } else {
            authors[currAuthorName]++;
        }

        if (authors[currAuthorName] > topAuthor.blogs) {
            topAuthor.author = currAuthorName;
            topAuthor.blogs = authors[currAuthorName];
        }
    }

    return topAuthor;
}

module.exports = {dummy, getTotalLikes, getFavoriteBlog, getTopAuthor}

