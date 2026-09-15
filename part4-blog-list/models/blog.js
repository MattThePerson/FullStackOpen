const mongoose = require("mongoose");

const blogSchema = mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes: Number,
});

blogSchema.set("toJSON", {
    transform: (document, retObj) => {
        retObj.id = retObj._id.toString();
        delete retObj._id;
        delete retObj.__v;
    }
});

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
