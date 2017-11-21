import _ from 'lodash';

class StubAPI {

    constructor() {
        this.posts = [] ;
    }
    initialize(posts) {
        this.posts = posts;
        return true; 
    }
    getAll() {
        return this.posts ;
    }

    setOrUpdate(post) {
        var index = _.findIndex(this.posts, {id: post.id} );   
        if (index !== -1) {                 
            this.posts.splice(index,1,post) ;
        } else {
            this.posts.push(post) ;
        }
        return true ;
    }

    getPost(id) {
        var result = null ;
        var index = _.findIndex(this.posts, { 'id': id} );     
        if (index !== -1) {                 
            result = this.posts[index];
        }
        return result ;
    }

}

export default (new StubAPI() );
