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

class Post {
	constructor(forum, postId) {
		this.ref = firebase.database().ref(`${forum}/posts/${postId}`);
		this.postId = postId;
		this.post = this.getPost();
	}

	getPost() {
		let p;

		this.ref.once("value", (post) => {
			p = post.val();
		});

		return p;
	}

	getUser() {
		return this.post.userId;
	}

	getTitle() {
		return this.post.title;
	}

	getContent() {
		return this.post.content;
	}

	getTimeSubmitted() {
		return this.post.timeSubmitted;
	}

	getPostId() {
		return this.postId;
	}

	getClicks() {
		let val = this.post.clicks;
		console.log(val);
		if (val === undefined) return 0;
		return val;
	}

	//incremenets posts count on each click.
	updateClicks() {
		this.ref.child("clicks").set(this.getClicks() + 1);
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

class Forum {
	constructor(forum) {
		this.forum = forum;
		this.database = firebase.database();
	}

	writePost(userId, title, content) {
		let newKey = this.database.ref().push().key;
		this.database.ref(`${this.forum}/posts/${newKey}`).set({
			userId: userId,
			title: title,
			content: content,
			timeSubmitted: Date.now(),
			clicks: 0,
		});
	}

	//note: currently untested without a working forumn
	writeComment(userId, comment, postId) {
		let newKey = this.database.ref().push().key;

		this.database.ref(`${this.forum}/posts/${postId}/comments/${newKey}`).set({
			userId: userId,
			comment: comment,
			timeSubmitted: Date.now(),
		});
	}

	/*
      might just keep it to only comments for simplicity.
      but writing the methods for replies regardless
      note: currently untested without a working forumn
    */
	writeReply(userId, postID, commentID, content) {
		let newKey = this.database.ref().child.push().key;

		this.database.ref(`${this.forum}/${postID}/comments/comment-${commentID}/replies/reply-${newKey}`).set({
			userId: userId,
			reply: content,
			timeSubmitted: Date.now(),
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
	addPost(postId) {
		let post = new Post(this.forum, postId);
		let postBox = document.createElement("div");

		let userID = post.getUser();
		let title = post.getTitle();
		let content = post.getContent();
		let timeSubmitted = post.getTimeSubmitted();

		postBox.classList.add("container", "border"); //using boostrap container and border
		postBox.setAttribute("id", post.getPostId());

		/**
		 * increments clicks on post by 1, then redirects to actual post
		 * currently redirects to index.html, >> victoira make sure to redirect to actual post(topic page)
		 * when its done
		 */
		postBox.onclick = () => {
			post.updateClicks();
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

		let date;
		timeSubmittedBox.innerHTML =  new Date(post.getTimeSubmitted());

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
	getAllPosts() {
		let forum = this.database.ref(`${this.forum}/posts/`); //reference to posts in the specified forum/field
		let listOfPosts = [];
		forum.on("value", (posts) => {
			for (const post in posts) {
				let forum_page = posts[post].valueOf().val();

				for (const post in forum_page) {
					this.addPost(post); //passes the postId [post] to be created.
				}
			}
		});
		//return listOfPosts;
	}
}

export { Forum, Post };
