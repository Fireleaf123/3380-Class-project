class search{

}

class content{

}

class DataHandler{
    constructor(){
       this.database = firebase.database();
    }

    writePost(userId,timeSubmitted){
      
      let title = document.getElementById('post_title').value;
      let field = document.getElementById('select_field').value;
      let content = document.getElementById('post_content').value;
      let newKey = this.database.ref().child('posts').push().key;
      
      this.database.ref(`${field}/posts/${newKey}`).set({
          userId:userId,
          title:title,
          content:content,
          timeSubmitted:timeSubmitted
        });
    }

    writeComment(userId,timeSubmitted,postID){
      
      let content = document.getElementById('comment').value;
      let newKey = this.database.ref().child('comments').push().key;
      
      this.database.ref(`${field}/${postID}/comments/${newKey}`).set({
          userId: userId,
          comment: content
        });
    }

    /*
      might just keep it to only comments for simplicity.
      but writing the methods for replies regardless
    */
    writeReply(userId,timeSubmitted,postID,commentID){

      let content = document.getElementById('comment').value;
      let newKey = this.database.ref().child('comments').push().key;

      this.database.ref(`${field}/${postID}/comments/${commentID}/replies/reply${newKey}`).set({
          userId:userId,
          reply: content
        });
    }
    
    //gets all posts from a forumn/field
    getPost(field){
      this.database().ref(`${field}/posts`).on('value', (posts) => {
        console.log();
      });
    }

    //gets all comments from a post
    getComment(field,postID,){

    }

    /*
      might just keep it to only comments for simplicity.
      but writing the methods for replies regardless
    */
    getReplies(location){

    }
 
}

function getTime(){
  let date = new Date();

  let month = ("0" + (date.getUTCMonth() + 1)).slice(-2)
  let day = ("0" + date.getUTCDate()).slice(-2);

  return `${month}-${day}-${date.getUTCFullYear()} ${date.getUTCHours()}:${date.getUTCMinutes()}`;
}

function allFieldsFilled(){
  let title = document.getElementById('post_title').value;
  let field = document.getElementById('select_field').value;
  let content = document.getElementById('post_content').value;

  if(title == "" || field == "" || content == "" )
    return false;
  return true;
}


function sendData(userId){

  if(allFieldsFilled())
  {
    const dataHandler = new DataHandler();
    dataHandler.writePost(userId,getTime());
    setInterval(() => {location.href = 'index.html';},1000);
  }
  else{
    alert("Please Fill Out All Fields")
  }

}