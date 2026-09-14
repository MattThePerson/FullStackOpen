
function dummy() {
    return 1;
};

function totalLikes(blogs) {
    let sum = 0;
    blogs.forEach(blog => sum += blog.likes);
    return sum;
};

function favouriteBlog(blogs) {
    let favBlog = null;
    blogs.forEach(blog => {
        if (favBlog === null || blog.likes > favBlog.likes) {
            favBlog = blog;
        }
    });
    return favBlog;
}

function mostBlogs(blogs) {
    let counts = {};
    let maxCount = 0;
    blogs.forEach(blog => {
        let count = counts[blog.author] || 0;
        count += 1;
        counts[blog.author] = count;
        if (count > maxCount) {
            maxCount = count;
        }
    });
    for (let [author, blogs] of Object.entries(counts)) {
        if (blogs === maxCount) {
            return {
                author: author,
                blogs: blogs,
            };
        }
    };
    return null;
}

function mostLikes(blogs) {
    let likesMap = {};
    let maxLikes = 0;
    blogs.forEach(blog => {
        let likes = likesMap[blog.author] || 0;
        likes += blog.likes;
        likesMap[blog.author] = likes;
        if (likes > maxLikes) {
            maxLikes = likes;
        }
    });
    for (let [author, likes] of Object.entries(likesMap)) {
        if (likes === maxLikes) {
            return {
                author: author,
                likes: likes,
            };
        }
    };
    return null;
}

module.exports = {
    dummy,
    totalLikes,
    favouriteBlog,
    mostBlogs,
    mostLikes,
};
