  import React from 'react';
    import _ from 'lodash';
    import api from './test/stubAPI';

    class Form extends React.Component {
        state = { title: '', link: ''};

        render() {
           return (
             <form style={{marginTop: '30px'}}>
                <h3>Add a new post</h3>
                <div className="form-group">
                  <input type="text"
                    className="form-control" placeholder="Title"
                    value={this.state.title} ></input>
                </div>
                <div className="form-group">
                  <input type="text"
                     className="form-control" placeholder="Link"
                     value={this.state.link} ></input>
                </div>
                <button type="submit" className="btn btn-primary" >Post</button>
              </form>
            );
          }
       };

    class NewsItem extends React.Component {
      handleVote = () =>  this.props.upvoteHandler(this.props.post.id);

      render() {
          let lineStyle = {
               fontSize: '20px', marginLeft: '10px'  };
          let cursor = { cursor: 'pointer' } ;
          let line ;
          if (this.props.post.link ) {
             line = <a href={this.props.post.link} >
                          {this.props.post.title} </a> ;
          } else {
             line = <span>{this.props.post.title} </span> ;
          }
          return (
            <div >
              <span className="glyphicon glyphicon-thumbs-up" 
                  style={cursor} 
                  onClick={this.handleVote} ></span>
              {this.props.post.upvotes}
              <span style={lineStyle} >{line}<span>
                  <a href={'#/posts/' + this.props.post.id }>Comments</a>
                </span>
              </span>
            </div>  
            );
        }
    }

    class NewsList extends React.Component {
      render() {
          let items = this.props.posts.map((post,index) => {
             return <NewsItem key={index} 
                              post={post} 
                              upvoteHandler={this.props.upvoteHandler}  /> ;
            } )
        return (
           <div>
              {items}
           </div>
          );
      } 
    }

    class HackerApp extends React.Component {
      incrementUpvote = (id) => {
          api.upvote(id) ;
          this.setState({});
      };
      render() {
          let posts = _.sortBy(api.getAll(), function(post) {
              return - post.upvotes;
          }
          );
          return (
              <div className="container">
                 <div className="row">
                    <div className="col-md-6 col-md-offset-3">
                       <div className="page-header">
                          <h1>Hacker News</h1>
                             <NewsList posts={posts} 
                                  upvoteHandler={this.incrementUpvote} />
                             <Form />
                       </div>
                    </div>
                 </div>
              </div>
          );
      } 
    }

    export default HackerApp;