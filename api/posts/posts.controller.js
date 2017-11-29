var Post = require('./post.model');  
  var _ = require('lodash' );

  function handleError(res, err) {
    return res.status(500).json(err);
  }
  // Get list of posts
  exports.index = function(req, res) {
      Post.find(function (err, posts) {
      if(err) { return handleError(res, err); }
      return res.status(200).json(posts);
    });
  } ;
  // Creates a new post in datastore.
  exports.create = function(req, res) {
    req.body.comments = []
    req.body.upvotes = 0 ;
    Post.create(req.body, function(err, post) {
      if(err) { return handleError(res, err); }
      return res.status(201).json(post);
    });
  };
  
 exports.show = function(req, res) {
      Post.findById(req.params.id, function (err, post) {
          if(err) { return handleError(res, err); }
          return res.status(200).json(post);
      });
  } ;
  // Update the upvotes for a posts.
  exports.update_upvotes = function(req, res) {
     Post.findById(req.params.id, function (err, post) {
          if(err) { res.sendStatus(404); }
          post.upvotes = req.body.upvotes
          post.save(function (err) {
              if(err) { return handleError(res, err); }
              return res.sendStatus(200);
          });
      });
  };
  // Add a comment to a post
  exports.add_comment = function(req, res) {
     Post.findById(req.params.id, function (err, post) {
         if(err) { res.sendStatus(404); }
         var comment = {
             body: req.body.comment,
             author: req.body.author ,
             upvotes: 0
          };
          post.comments.push(comment);
          post.save(function (err, post ) {
              if(err) { return handleError(res, err); }
                 return res.status(200).json(post);
            });
      });
  };
  // Update the upvotes for a comment 
  exports.update_comment_upvotes = function(req, res) {
      Post.findById(req.params.post_id, function (err, post) {
          if (err) { res.sendStatus(404); }
          var comment_index = _.findIndex(post.comments , 
             function(comment) {
                return comment._id == req.params.comment_id;
            }); 
         if (comment_index != -1) {
            post.comments[comment_index].upvotes = req.body.upvotes
            post.save(function (err) {
                if(err) { return handleError(res, err); }
                return res.status(200).json(post);
              });
          } else {
            return res.sendStatus(401,"Bad comment id");
          }

       })
    }