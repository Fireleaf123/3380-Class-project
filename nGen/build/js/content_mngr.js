import { Cookie } from "./cookies.js";

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
		this.forum = forum;
		this.postId = postId;
		this.post;
		this.getPost();
	}

	//note: currently untested without a working forumn
	writeComment(userId, comment) {
		let newKey = this.ref.child("comments").push().key;

		firebase.database().ref(`${this.forum}/posts/${this.postId}/comments/${newKey}`).set({
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
	writeReply(userId,content,commentID) {
		let newKey = this.ref.child("comments/replies").push().key;

		firebase.database().ref(`${this.forum}/posts/${this.postId}/comments/${commentID}/replies/${newKey}`).set({
			userId: userId,
			reply: content,
			timeSubmitted: Date.now(),
		});
	}

	getPost() {
		this.ref.on("value", (post) => {
			this.post = post.val();
		});
	}
	getThisPost() {
		return this.post;
	}
	
	setPost(post) {
		this.post = post;
	}

	updatePost() {
		this.getPost();
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
	getForum() {
		return this.forum;
	}
	getClicks() {
		this.updatePost();

		let val = this.post.clicks;

		if (val === undefined) return 0;

		return val;
	}

	//incremenets posts count on each click.
	updateClicks() {
		this.ref.child("clicks").set(this.getClicks() - 1);
	}

	getAComment(commentId) {
		let commentRef = firebase.database().ref(`${this.forum}/posts/${this.postId}/comments/${commentId}`);

		commentRef.once("value", (comment) => {
			return comment.val();
		});
	}

	getAllComments(container) {
		let get = this.ref.child("comments").on("value", (comments) => {
			comments.forEach((comment) => {
				let c = this.getAComment(comment);
				this.createComments(container, c.user, c.comment, c.timeSubmitted);
			});
		});
		setTimeout(() => {
			this.ref.off("value", get);
		}, 1500);
	}

	/*
      might just keep it to only comments for simplicity.
      but writing the methods for replies regardless
    */
	getAllReplies(location) {}

	getAReply(location) {}

	createPost(container) {
		let postBox = document.createElement("div");

		let userID = this.getUser();
		let title = this.getTitle();
		let content = this.getContent();
		let timeSubmitted = this.getTimeSubmitted();
		let postId = this.getPostId();
		let forum = this.getForum();
		//console.log(postId,forum)

		postBox.classList.add("POSTS", "post"); //using boostrap container and border
		postBox.setAttribute("id", postId);

		/**
		 * increments clicks on post by 1, then redirects to actual post
		 * currently redirects to index.html, >> victoira make sure to redirect to actual post(topic page)
		 * when its done
		 */
		postBox.onclick = () => {
			this.updateClicks();
			new Cookie().setCookie("postId", postId, 30);
			new Cookie().setCookie("forum", forum, 30);
			location.href = "02_topic.html";
		};

		/*Below are examples of styling using JS
      userBox.classList.add('border') -> example of adding/using boostrap  
      userBox.style.backgroundColor = 'black';
      userBox.style.color = 'gold';
    */

		//creating a div to hold userID
		let userBox = document.createElement("div");
		userBox.classList.add("postContent");
		userBox.innerHTML = '<i class="fa fa-user"></i> ' + userID; //putting content into the div UserBox.

		let titleBox = document.createElement("div");
		titleBox.classList.add("postContent");
		titleBox.innerHTML = title;

		let contentBox = document.createElement("div");
		contentBox.classList.add("postContent");
		contentBox.innerHTML = content;

		let timeSubmittedBox = document.createElement("div");
		timeSubmittedBox.classList.add("postContent");
		timeSubmittedBox.style.width = "fit-content";

		timeSubmittedBox.innerHTML = '<i class="fa fa-clock-o"></i> ' + new Date(timeSubmitted);

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
		container.appendChild(postBox);
	}
}

class Forum {
	constructor(forum) {
		this.forum = forum;
		this.database = firebase.database().ref(`${this.forum}/posts/`);
	}

	writePost(userId, title, content) {
		let newKey = this.database.push().key;
		this.database.child(newKey).set({
			userId: userId,
			title: title,
			content: content,
			timeSubmitted: Date.now(),
			clicks: 0,
		});
	}
	getPost(postId) {
		return new Promise((resolve) => {
			this.database.child(postId).once("value", (post) => {
				resolve(post.val());
			});
		});
	}
	/*
      > gets all posts from the specified forumn/field
        >> note: I use forumn and field interchangeably because each forum is supposed to represent a field/industry
    */
	getAllPosts(container) {
		//let forum = this.database.ref(`${this.forum}/posts/`);

		let get = this.database.orderByChild("clicks").on("value", (posts) => {
			posts.forEach((childPost) => {
				let p = new Post(this.forum, childPost.key).createPost(container);
			});
		});
		setTimeout(() => {
			this.database.orderByChild("clicks").off("value", get);
		}, 1500);
	}
}

export { Forum, Post };
