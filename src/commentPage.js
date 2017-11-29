import React from 'react';
import _ from 'lodash';
import api from './test/stubAPI';
import request from 'superagent' ; 

class Form extends React.Component {
    state = { comment: '', name: ''};

    handleCommentChange = (e) => {
        this.setState({comment : e.target.value});
    };

    handleNameChange = (e) => {
        this.setState({name: e.target.value});
    };

    onSubmit = (e) => {
        e.preventDefault();
        let comment = this.state.comment.trim();
        let name = this.state.name.trim();
        if (!comment ) {
            return;
        }
        this.props.commentHandler(comment,name );
        this.setState({comment: '', name: ''});
    };

    render() {
        return (
            <form  style={{marginTop: '30px'}}>
                <h3>Add a new comment</h3>

                <div className="form-group">
                    <input type="text"  className="form-control"
                        placeholder="Comment" value={this.state.comment}
                        onChange={this.handleCommentChange} ></input>
                </div>     
                <div className="form-group">
                    <input type="text"  className="form-control"
                        placeholder="Your name" value={this.state.name}
                        onChange={this.handleNameChange} ></input>
                </div>
                <button type="submit" className="btn btn-primary"
                    onClick={this.onSubmit}>Submit</button>
            </form>
        );
    }
}

class Comment extends React.Component {
    handleVote = () => {
        this.props.upvoteHandler( this.props.comment._id,
            this.props.comment.upvotes);
    };
    render() {
        let lineStyle = {
            fontSize: '20px', marginLeft: '10px'  };
        return (
            <div>
                <span className="glyphicon glyphicon-thumbs-up"
                    onClick={this.handleVote}></span>
                {this.props.comment.upvotes} - by {this.props.comment.author}
                <span style={lineStyle} >
                    {this.props.comment.comment}
                </span>
            </div>                
        );
    }
}


class CommentList extends React.Component {
    render() {
        let items = this.props.comments.map((comment,index) => {
            return (
                <Comment key={index} comment={comment} 
                    upvoteHandler={this.props.upvoteHandler}  />
            );
        } );
        return (
            <div>
                {items}
            </div>
        );
    }
};

class CommentView extends React.Component {
    componentDidMount() {
       request.get('http://0.0.0.0:3000/api/posts/' + this.props.params.postId )
          .end( (error, res) => {
            if (res) {
              var post = JSON.parse(res.text);
              api.setOrUpdate(post);
              this.setState( {}) ;                
            } else {
              console.log(error );
            }
          }) ; 
      } 
      
    addComment = (comment, name) => {
        request
           .post('http://0.0.0.0:3000/api/posts/' + 
                      this.props.params.postId + '/comments' )
           .send({ comment: comment, author: name })
           .set('Content-Type', 'application/json')
           .end( (err, res) => {
             if (err || !res.ok) {
                 alert('Error adding comment');
             } else {
                 let post = JSON.parse(res.text);
                 api.setOrUpdate(post); 
                 this.setState( {}) ;                
             }
           } ); 
    };

    incrementUpvote = (commentId, upvotes ) => {
       request
           .put('http://0.0.0.0:3000/api/posts/' + 
                      this.props.params.postId + '/comments/' +
                      commentId  + '/upvotes' )
           .send({ upvotes: upvotes + 1 })
           .set('Content-Type', 'application/json')
           .end( (err, res) => {
             if (err || !res.ok) {
                 alert('Error upvoting comment');
             } else {
                 let post = JSON.parse(res.text);
                 api.setOrUpdate(post); 
                 this.setState( {}) ;                
             }
           } );  
    };

    render() {
        let post = api.getPost( this.props.params.postId) ;
        let display = null ;
        let line = null ;
        if (post) { 
            if (post.link ) {
                line = <a href={post.link} >
                    {post.title} </a> ;
            } else {
                line = <span>{post.title} </span> ;
            }
            let comments = _.sortBy(post.comments, (comment) =>  - comment.upvotes );
            display = (  
                <div >
                    <h3>{line} </h3>
                    <CommentList comments={comments} 
                        upvoteHandler={this.incrementUpvote } />
                    <Form post={post}  commentHandler={this.addComment} /> 
                </div> ) ;
        } else {
            display =  (  
                <div >
                    <h3>Loading data </h3>
                </div> ) ;
        }   
        return (  
            <div>
              {display}
            </div>
        );
    }
}

export default CommentView;