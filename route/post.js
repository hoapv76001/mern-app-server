const express = require('express');
const router = express.Router();
const Post = require('../model/post');
const verifyToken = require('../middleware/auth');

//@route Get api/posts/
//@desc Get post
//@access: Private

router.get('/', verifyToken, async (req, res) => {
    try {
        const posts = await Post.find({user: req.userId}).populate('user', 'username');
        return res
        .json({success: true, posts});
    } catch (error) {
        console.log(error);
        return res
        .status(500)
        .json({success: false, message: "Internal server error"});
    }

});

//@route Post api/posts/
//@desc Creat post
//@access: Private
router.post('/', verifyToken, async (req, res) => {
    const {title, description, url, status} = req.body;
    // Check title unique
    if(!title) {
        return res
        .status(400)
        .json({success: false, message: "Title is require"});
    }

    try {
        const newPost = new Post({
            title,
            description,
            url: url.startsWith('https://') ? url : `https://${url}`,
            status: status || 'TO LEARN',
            user: req.userId
        });
        await newPost.save();
        return res.json({success: true, message: 'Happy learning', post: newPost});
    } catch (error) {
        console.log(error);
        return res
        .status(500)
        .json({success: false, message: "Internal server error"});
    }
});

//@route update api/posts/
//@desc update post
//@access: Private

router.put('/:id', verifyToken, async (req, res) => {
    const {title, description, url, status} = req.body;
    //Check require title
    if(!title) {
        return res
        .status(400)
        .json({success: false, message: "Title is require"});
    }
    try {
        let updatedPost = {
            title,
            description: description || '',
            url: (url.startsWith('https://') ? url : `https://${url}`) || '',
            status: status || 'TO LEARN'
        }
        const postUpdateCondition = {_id: req.params.id, user: req.userId};
        updatedPost = await Post.findOneAndUpdate(postUpdateCondition, updatedPost, {new: true});
        if(!updatedPost) {
            return res
            .status(401)
            .json({success: false, message: "Post not found or user not authorised"})
        }
        return res
        .json({success: true, message: "Update successfully!", post: updatedPost});
    } catch (error) {
        console.log(error);
        return res
        .status(500)
        .json({success: false, message: "Internal server error"});
    }
});

//@route delete api/posts/
//@desc delete post
//@access: Private

router.delete('/:id', verifyToken, async (req, res) => {
    const postDeleteCondition = {_id: req.params.id, user: req.userId};
    try {
        deletedPost = await Post.findOneAndDelete(postDeleteCondition);
        if(!deletedPost) {
            return res
            .status(401)
            .json({success: false, message: "Post not found or user not authorised"})
        }
        return res
        .json({success: true, message: "Delete successfully!", post: deletedPost});
    } catch (error) {
        console.log(error);
        return res
        .status(500)
        .json({success: false, message: "Internal server error"});
    }
});

module.exports = router;