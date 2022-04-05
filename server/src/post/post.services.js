const express = require('express');
const { status } = require('express/lib/response');
const Repository = require('./post.repository');
const router = express.Router();

getPosts = async function (query, page, limit) {
    try {
        const posts = await Repository.getPosts(query);
        return posts;
    } catch (e) {
        console.log('service error: ' + e.message);

        throw Error(e);
    }
};

getPostById = async function (postId) {
    try {
        const post = await Repository.getPostById(postId);
        return post;
    } catch (e) {
        console.log('service error: ' + e.message);

        throw Error(e);
    }
};

getPostsByUser = async function (userId) {
    try {
        const posts = await Repository.getPostsByUser(userId);
        return posts;
    } catch (e) {
        console.log('service error: ' + e.message);

        throw Error(e);
    }
};

getPostsByCategory = async function (categoryId) {
    try {
        const posts = await Repository.getPostsByCategory(categoryId);
        return posts;
    } catch (e) {
        console.log('service error: ' + e.message);

        throw Error(e);
    }
};

getPostsByTag = async function (tagId) {
    try {
        const posts = await Repository.getPostsByTag(tagId);
        return posts;
    } catch (e) {
        console.log('service error: ' + e.message);

        throw Error(e);
    }
};

addPost = async function (postDetails) {
    try {
        const post = await Repository.addPost(postDetails);
        console.log('service: ' + post);

        return post;
    } catch (e) {
        console.log('service error: ' + e.message);

        throw Error(e);
    }
};

deletePost = async function (postId) {
    try {
        const deletedPost = await Repository.deletePost(postId);
        return deletedPost;
    } catch (e) {
        console.log('service error: ' + e.message);

        throw Error(e);
    }
};

updatePost = async function (postId, postDetails) {
    try {
        const oldPost = await Repository.updatePost(postId, postDetails);
        return oldPost;
    } catch (e) {
        console.log('service error: ' + e.message);

        throw Error(e);
    }
};

module.exports = {
    getPosts,
    getPostById,
    getPostsByUser,
    getPostsByCategory,
    getPostsByTag,
    addPost,
    deletePost,
    updatePost
}
