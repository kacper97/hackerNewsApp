module.exports = function(app) {
  app.use('/api/posts', require('./api/posts/index'));
 
  // All undefined asset requests or undefined API requests should return a 404
  // app.route('/:url(api|app|assets)/*')
  //  .get(function(req, res) {
  //   res.send(404);
  // })

};