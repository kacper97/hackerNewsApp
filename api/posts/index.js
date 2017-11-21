var express = require('express');
var controller = require('./posts.controller');

var router = express.Router();
  
router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id/upvotes', controller.update_upvotes);
router.post('/:id/comments', controller.add_comment);
router.put('/:post_id/comments/:comment_id/upvotes', controller.update_comment_upvotes);

module.exports = router;