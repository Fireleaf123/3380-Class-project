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
    
    //note: currently untested without a working forumn
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
      note: currently untested without a working forumn
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
    getAllsPost(field){

    }

    //gets a specific post
    getAPost(field,postID){
     
    }


    getAllComments(field,postID){

    }


    getAComment(field,postID){

    }

    /*
      might just keep it to only comments for simplicity.
      but writing the methods for replies regardless
    */
    getAllReplies(location){

    }

    getAReply(location){

    }
 
}

//note this is UTC time
function getTime(){
  let date = new Date();

  let month = ("0" + (date.getUTCMonth() + 1)).slice(-2)
  let day = ("0" + date.getUTCDate()).slice(-2);

  return `${month}-${day}-${date.getUTCFullYear()} ${date.getUTCHours()}:${date.getUTCMinutes()}`;
}

//if any item in the list has is blank, has no value, it returns false
function allFieldsFilled(list){
  return !list.includes("");
}

/*
  >> called when post button(id="submit") is clicked
  >> sends post_data to database to be stored
*/
function sendPostData(userId){

  let title = document.getElementById('post_title').value;
  let field = document.getElementById('select_field').value;
  let content = document.getElementById('post_content').value;

  if(allFieldsFilled([title, field, content]))
  {
    const dataHandler = new DataHandler();
    dataHandler.writePost(userId,getTime());
      setInterval(() => {location.href = 'index.html';},1500); //sends user back to homepage after post creation
  }
  else{
    alert("Please Fill Out All Fields")
  }

}