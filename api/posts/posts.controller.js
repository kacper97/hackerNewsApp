var datastore = require('../datastore');
var _ = require('lodash');

function findPost(id) {
    var index = _.findIndex(datastore.posts,function(post) {
        return post.id == id;
    }); 
    if (index !== -1) {
        return datastore.posts[index] ;
    } else {
        return null ;
    }  
}

// Get list of posts
exports.index = function(req, res) {
    var result = JSON.parse(JSON.stringify(datastore.posts));
    result.forEach(function(p) {
        delete p.comments ;
    });
    return res.status(200).json(result);
} ;

exports.show = function(req, res) {
    var id = parseInt(req.params.id , 10) ;
    var post = findPost(req.params.id) ; 
    if (post) {
        return res.status(200).json(post);
    } else {
        return res.sendStatus(404)
    }
};

// Creates a new post in datastore.
exports.create = function(req, res) {
    var new_id = 0;
    if (datastore.posts.length > 0 ) {
      new_id = 1 +  datastore.posts[datastore.posts.length -1].id;
    }
    var post = {
         title: req.body.title,
         id: new_id,
         link: req.body.link,
          username : req.body.username,
          comments : [],
          upvotes: 0
      }
    datastore.posts.push(post)
    return res.status(201).json(post);
};

// Update an existing posts upvotes in datastore.
exports.update_upvotes = function(req, res) {
    var id = parseInt(req.params.id) ;
    var post = findPost(id);     
    if (post) {
        post.upvotes =  parseInt(req.body.upvotes);
        return res.sendStatus(200); 
    } else {
        return res.sendStatus(404);
    }
};

// Add a comment to a post.
exports.add_comment = function(req, res) {
    var id = parseInt(req.params.id) ;
    var post = findPost(id);
    if (post) {
        var new_id = 0;
        if (post.comments.length > 0 ) {
            new_id = post.comments.length ;
        }
        var comment = {
            id : new_id,
            comment: req.body.comment,
            author: req.body.author ,
            upvotes: 0
        };
        post.comments.push(comment);
        return res.status(200).json(post); 
    } else {
        return res.sendStatus(404)
    }
};

exports.update_comment_upvotes = function(req, res) {
    var post_id = parseInt(req.params.post_id,10);
    var comment_index = parseInt(req.params.comment_id);
    var post = findPost(post_id);
    if (post) {
        if (post.comments[comment_index]) { 
            post.comments[comment_index].upvotes =  req.body.upvotes
            return res.status(200).json(post); 
        } else {
            return res.sendStatus(404);
        }
    } else {
        return res.sendStatus(404);
    }
};


