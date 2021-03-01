import {DataHandler} from './content_mngr.js';

function googleLogin(){
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
        .then(result =>{
            const user = result.user;
            document.write('Hello ' + user.displayName);
            console.log(user)
        })
        .cath(console.log)
}

function createPost(){
  let d = new DataHandler();
  d.getAllPosts('Basket Weaving');
  console.log('here');
}

createPost();
