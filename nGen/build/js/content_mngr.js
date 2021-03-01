class Search {
  constructor(field) {
    this.database = firebase.database.ref(`field/posts`);
  }

  findPost(userId, postTitle) {
    this.database.ref
      .orderByChild("title")
      .startAt(postTitle)
      .endAt(postTitle + "\uf8ff");
  }
}

class DataHandler {
  constructor() {
    this.database = firebase.database();
  }

  writePost(userId, timeSubmitted, title, field, content) {
    let newKey = this.database.ref().child("comments").push().key;

    this.database.ref(`${field}/posts/${newKey}`).set({
      userId: userId,
      title: title,
      content: content,
      timeSubmitted: timeSubmitted,
      clicks: 0,
    });
  }

  //note: currently untested without a working forumn
  writeComment(userId, timeSubmitted, postID, content) {
    let newKey = this.database.ref().child("comments").push().key;

    this.database.ref(`${field}/${postID}/comments/${newKey}`).set({
      userId: userId,
      comment: content,
    });
  }

  /*
      might just keep it to only comments for simplicity.
      but writing the methods for replies regardless
      note: currently untested without a working forumn
    */
  writeReply(userId, timeSubmitted, postID, commentID, content) {
    let newKey = this.database.ref().child("comments").push().key;

    this.database.ref(`${field}/${postID}/comments/${commentID}/replies/reply${newKey}`).set({
      userId: userId,
      reply: content,
    });
  }

  /*
      creates containers, called postBox, that stores
      post info(userID,title,content, and timeSubmmited)
      in seperate divs(userBox,titleBox,contentBox, and timeSubmitedBox)
      that are then pasted added into postBox using appenChild().
      
      postBox, now having all the info stored, is pasted onto the body.

      >>IMPORTANT NOTE: On the actual forum/field pages themselves(i.e the Basket Weaving Sub-Forum)
                        postBox would not be pasted on the body directly, but in a specific container.
    */
   //gets the clicks of the post with id postId in the specified forumn
  getClicks(postId, field) {
    let val = 0;
    this.database.ref(`${field}/posts/${postId}`).once("value", (post) => {
      val = post.val().clicks;
    });
    if (val === undefined) return 0;
    return val;
  }

  //incremenets posts count on each click.
  updateClicks(field, postId) {
    this.database
      .ref(`${field}/posts/${postId}`)
      .child("clicks")
      .set(this.getClicks(postId, field) + 1);
  }

  addPost(userID, title, content, timeSubmitted, postId, field) {
    let postBox = document.createElement("div");

    postBox.classList.add("container", "border"); //using boostrap container and border
    postBox.setAttribute("id", postId);

    /**
     * increments clicks on post by 1, then redirects to actual post
     * currently redirects to index.html, >> victoira make sure to redirect to actual post(topic page)
     * when its done
     */
    postBox.onclick = () => {
      this.updateClicks(field, postId);
      location.href = "index.html";
    };

    /*Below are examples of styling using JS
        userBox.classList.add('border') -> example of adding/using boostrap  
        userBox.style.backgroundColor = 'black';
        userBox.style.color = 'gold';
      */

    //creating a div to hold userID
    let userBox = document.createElement("div");
    userBox.style.width = "fit-content"; //set width to fit content in the div, UserBox.
    userBox.innerHTML = userID; //putting content into the div UserBox.

    let titleBox = document.createElement("div");
    titleBox.style.width = "fit-content";
    titleBox.innerHTML = title;

    let contentBox = document.createElement("div");
    contentBox.style.width = "fit-content";
    contentBox.innerHTML = content;

    let timeSubmittedBox = document.createElement("div");
    timeSubmittedBox.style.width = "fit-content";
    timeSubmittedBox.innerHTML = timeSubmitted;

    postBox.appendChild(userBox);
    postBox.appendChild(titleBox);
    postBox.appendChild(contentBox);
    postBox.appendChild(timeSubmittedBox);

    /**
     *currently pastes each postBox onto the body.
     * This was done for the sake of experimenting.
     * In actuality,  each postBox would be pasted onto
     * document.getElementById(postContainer) instead of document.body
     */
    document.body.appendChild(postBox);
  }

  /*
      > gets all posts from the specified forumn/field
        >> note: I use forumn and field interchangeably because each forum is supposed to represent a field/industry
    */
  getAllPosts(field) {
    let forum = this.database.ref(`${field}/posts/`); //reference to posts in the specified forum/field

    forum.on("value", (posts) => {
      for (const post in posts) {
        let forum_page = posts[post].valueOf().val();
        for (const post in forum_page) {
          this.addPost(forum_page[post].userId, forum_page[post].title, forum_page[post].content, forum_page[post].timeSubmitted, post, field);
        }
      }
    });
  }

  getAllComments(field, postID) {}

  getAComment(field, postID) {}

  /*
      might just keep it to only comments for simplicity.
      but writing the methods for replies regardless
    */
  getAllReplies(location) {}

  getAReply(location) {}
}

function getTime() {
  let date = new Date();

  let month = ("0" + (date.getUTCMonth() + 1)).slice(-2);
  let day = ("0" + date.getUTCDate()).slice(-2);

  return `${month}-${day}-${date.getUTCFullYear()} ${date.getUTCHours()}:${date.getUTCMinutes()}`;
}

//if any item in the list has is blank, has no value, it returns false
function allFieldsFilled(list) {
  return !list.includes("");
}

/*
  >> called when post button(id="submit") is clicked
  >> sends post_data to database to be stored
*/

function test(userId) {
  let title = document.getElementById("post_title").value;
  let field = document.getElementById("select_field").value;
  let content = document.getElementById("post_content").value;

  const dataHandler = new DataHandler();

  if (allFieldsFilled([title, field, content])) {
    dataHandler.writePost(userId, date.now(), title, field, content);
    setInterval(() => {
      location.href = "index.html";
    }, 1500); //sends user back to homepage after post creation
  } else {
    alert("Please Fill Out All Fields");
  }
}

//exports
export { DataHandler };
