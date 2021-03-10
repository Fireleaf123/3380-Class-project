class recordRead{

     countClicks() {

        function storage(name, type) {
            'use strict';

            const engine = !type || type.toLowerCase() === 'local' ? localStorage : sessionStorage;
    
            function set(data) {
                engine.setItem(name, JSON.stringify(data));
            }

            function create() {
                if (!exists())
                    set(arguments[0] || {});
            }

            function get() {
                return exists(name) ? JSON.parse(engine.getItem(name)) : false;
            }

            function remove() {
                engine.removeItem(name);
            }

            function exists() {
                return engine.getItem(name) == null ? false : true;
            }

    
            return Object.freeze({
                set,
                get,
                exists,
                create,
                remove
            });
        }
    
        let store = new storage('urls', 'sessionStorage');
        store.create();
    
        let data = store.get();
        data[location.href] = data.hasOwnProperty(location.href) ? parseInt(data[location.href]) + 1 : 1;
        data.total = data.hasOwnProperty('total') ? parseInt(data.total) + 1 : 1;
    
        store.set(data);
    }

    addEventListener(DOMContentLoaded, countClicks);

}

class movePosts{
    constructor() {
        this.database = firebase.database();
      }

    orderPostByClicks(postId, field){
        var order = this.database.ref(`${field}/posts/${postId}`).orderByChild('click');
    }
    
    orderPost(){
    
    var topUserPostsRef = firebase.database().ref('user-posts/' + postId).orderByChild('click');
    }

}

