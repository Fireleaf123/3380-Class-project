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

class postFactory{
	constructor(parentContainer){
		this.parentContainer
	}
	createPost() {
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
		return postBox
	}

	createComments(userId, comment, timeSubmitted, id, type) {
		let mainCont = document.createElement("div");
		let container = document.createElement("div");
		let userBox = document.createElement("div");
		let commentBox = document.createElement("div");
		let replyNTimeCont = document.createElement("div");
		let timeBox = document.createElement("div");
		let repliesCont;
	
		container.setAttribute("id", id);
		container.classList.add("post");
	
		userBox.setAttribute("id", "user");
		userBox.classList.add("commentContent");
		userBox.innerHTML = `<strong>${userId}</strong>`;
	
		commentBox.setAttribute("id", "userComment");
		commentBox.classList.add("commentContent");
		commentBox.innerHTML = `<p>${comment}</p>`;
	
		replyNTimeCont.classList.add("row", "commentContent");
	
		timeBox.setAttribute("id", "userTimeSub");
		timeBox.classList.add("col-sm");
		timeBox.innerHTML = '<i class="fa fa-clock-o"></i> ' + new Date(timeSubmitted);
		replyNTimeCont.appendChild(timeBox);
	
		container.appendChild(userBox);
		container.appendChild(commentBox);
		container.appendChild(replyNTimeCont);
	
		if (type === "comment") {
			mainCont.appendChild(container);
	
			repliesCont = document.createElement("div");
			repliesCont.classList.add("replies");
			mainCont.appendChild(repliesCont);
	
			let reply = document.createElement("div");
			reply.classList.add("col-sm", "replyBtn");
			let replyBtn = document.createElement("button");
	
			replyBtn.classList.add("pull-right", "Replies");
			replyBtn.innerHTML = '<i class="fa fa-reply"></i>';
	
			replyBtn.onclick = () => {
				commentBtn.innerHTML = "Post Reply";
				container.appendChild(commentWriter);
				//_post.writeReply('baboya',postId,id,reply)
			};
	
			reply.appendChild(replyBtn);
			replyNTimeCont.appendChild(reply);
			return mainCont;
		} else if (type === "reply") {
			return container;
		}
	}
}
class Comment {
	
	constructor(parentRef,commentId){
		this.parentref = parentRef;
		this.commentId = commentId;
		this.ref = parentRef.child(`comments/${commentId}`);
	}

	/**
	 * Writes the reply to the parent comment
	 * @param {String} userId 
	 * @param {String} content 
	 */
	writeReply(userId,content) {
		let newKey = this.ref.child('replies').push().key;

		this.ref.child(`replies/${newKey}`).set({
			userId: userId,
			reply: content,
			timeSubmitted: Date.now(),
		});
	}
	/**
	 * returns the given comment as an object 
	 * @returns {Object}
	 */
	getComment(){
		return new Promise( (resolve,reject) =>{
			this.ref.once('value', (comment) => {
				resolve(comment.val())
			})
		})
	}
	/**
	 * returns the specified comment attribute
	 * i.e userId,comment, and timeSubmitted
	 * @returns {Any}
	 */
	getAttribute(attribute){
		let location = this.ref.child(attribute);
		return new Promise( (resolve,reject) => {
			location.once('value', (data) => {
				resolve(data.val());
			})
		});
	}

	/**
	 * returns list of all replies for the given comments as an array
	 * @returns {Array}
	 */
	async getAllReplies(){
		let listOfReplies = [];
		let replies = await this.getAttribute('replies');
		for(let reply in replies){
			let r = replies[reply];
			listOfReplies.push(r);
		}
		return listOfReplies;
	}
}

class Post {
	constructor(forum, postId) {
		this.ref = firebase.database().ref(`${forum}/posts/${postId}`);
		this.forum = forum;
		this.postId = postId;
		this.post;
		this.#getPost();
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

	getForum(){return this.forum;}

	getPostId(){return this.postId;}

	getPost(){
		return new Promise( (resolve,reject) =>{
			this.ref.once('value', (post) => {resolve(post.val())})
		})
	}

	async #updatePost(){this.post =  await this.getPost();}

	getAttribute(attribute){
		let location = this.ref.child(attribute);
		return new Promise( (resolve,reject) => {
			location.once('value', (data) => {
				resolve(data.val());
			})
		});
	}
	async updateClicks() {
		let clicks = await this.getAttribute('clicks') === undefined ? 0 : await this.getAttribute('clicks');
		this.ref.child("clicks").set(clicks - 1);
	}
	/**
	 * creates comment objects of children of parent post, and stores them in a list
	 * @returns {Array}
	 */
	async getComments(){
		let listOfComments =  [];
		let comments = await this.getAttribute('comments');
		for(let comment in comments){
			let c = new Comment(this.ref,comment.valueOf())
			listOfComments.push(c);
			//c.getComment().then( (val) => listOfComments.push(val));
		}
		return listOfComments;
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

export { Forum, Post , Comment};
