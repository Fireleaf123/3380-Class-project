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

class Data {
	constructor(parent, id) {
		this.parent = parent;
		this.id = id;
		if (parent === " ") {
			this.ref = firebase.database().ref(`${id}/posts`);
		}
		this.ref = firebase.database().ref(`${parent}/${id}`);
	}

	//returns the id
	getId() {
		return this.id;
	}
	//returns the parent
	#getParent() {
		return this.parent;
	}

	/**
	 * returns the specified  attribute
	 * attributes are specific to the type: posts and comments have different attributes
	 * @returns {Any}
	 */
	getAttribute(attribute) {
		let location = this.ref.child(attribute);
		return new Promise((resolve, reject) => {
			location.once("value", (data) => {
				resolve(data.val());
			});
		});
	}
}

class Comment extends Data {
	constructor(forum, postId, commentId) {
		super(`${forum}/posts/${postId}/comments/`, commentId);
	}

	/**
	 * Writes the reply to the parent comment
	 * @param {String} userId
	 * @param {String} content
	 */
	writeReply(userId, content) {
		let newKey = this.ref.child("replies").push().key;

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
	getComment() {
		return new Promise((resolve, reject) => {
			this.ref.once("value", (comment) => {
				resolve(comment.val());
			});
		});
	}
}

class Post extends Data {
	constructor(forum, postId) {
		super(`${forum}/posts/`, postId);
		this.forum = forum;
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

	getPost() {
		return new Promise((resolve, reject) => {
			this.ref.once("value", (post) => {
				resolve(post.val());
			});
		});
	}

	async #updatePost() {
		this.post = await this.getPost();
	}

	async updateClicks() {
		let clicks = (await this.getAttribute("clicks")) === undefined ? 0 : await this.getAttribute("clicks");
		this.ref.child("clicks").set(clicks - 1);
	}

	getComments() {
		this.getAttribute("comments").then((comments) => {
			for (let comment in comments) {
				console.log(new Comment(this.forum, this.postId, comment));
			}
		});
		return listOfComments;
	}
}

class Forum extends Data {
	constructor(forum) {
		super("", forum);
		this.ref = firebase.database().ref(`${forum}/posts`);
		this.forum = forum;
	}

	writePost(userId, title, content) {
		let newKey = this.ref.child("posts").push().key;
		this.ref.child(newKey).set({
			userId: userId,
			title: title,
			content: content,
			timeSubmitted: Date.now(),
			clicks: 0,
		});
	}

	/*
      > gets all posts from the specified forumn/field
        >> note: I use forumn and field interchangeably because each forum is supposed to represent a field/industry
    */
	async getPosts() {
		let listOfPosts = [];

		let get = this.ref.orderByChild("clicks").on("value", (posts) => {
			posts.forEach((childPost) => {
				listOfPosts.push(new Post(this.forum, childPost.key));
			});
		});

		setTimeout(() => {
			this.ref.orderByChild("clicks").off("value", get);
		}, 1500);

		return listOfPosts;
	}
}

class CommentBox {
	constructor(comment, parentContainer) {
		this.comment = comment;
		this.parentContainer = parentContainer;
	}

	createComment() {
		let mainCont = document.createElement("div");
		let container = document.createElement("div");
		let userBox = document.createElement("div");
		let commentBox = document.createElement("div");
		let replyNTimeCont = document.createElement("div");
		let timeBox = document.createElement("div");
		let repliesCont;

		container.setAttribute("id", this.comment.getId());
		container.classList.add("post");

		userBox.setAttribute("id", "user");
		userBox.classList.add("commentContent");
		this.comment.getAttribute("userId").then((userId) => (userBox.innerHTML = `<strong>${userId}</strong>`));

		commentBox.setAttribute("id", "userComment");
		commentBox.classList.add("commentContent");
		this.comment.getAttribute("comment").then((comment) => (commentBox.innerHTML = `<p>${comment}</p>`));

		replyNTimeCont.classList.add("row", "commentContent");

		timeBox.setAttribute("id", "userTimeSub");
		timeBox.classList.add("col-sm");
		this.comment.getAttribute("timeSubmitted").then((time) => (timeBox.innerHTML = '<i class="fa fa-clock-o"></i> ' + new Date(time)));
		replyNTimeCont.appendChild(timeBox);

		container.appendChild(userBox);
		container.appendChild(commentBox);
		container.appendChild(replyNTimeCont);

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
			container.appendChild(document.getElementById("writeCoR"));
			//_post.writeReply('baboya',postId,id,reply)
		};

		reply.appendChild(replyBtn);
		replyNTimeCont.appendChild(reply);
		this.parentContainer.appendChild(mainCont);
	}
}

class PostBox {
	constructor(post, parentContainer) {
		this.post = post;
		this.parentContainer = parentContainer;
	}

	createPost() {
		let postBox = document.createElement("div");

		postBox.classList.add("POSTS", "post"); //using boostrap container and border
		postBox.setAttribute("id",this.post.getId());

		/**
		 * increments clicks on post by 1, then redirects to actual post
		 * currently redirects to index.html, >> victoira make sure to redirect to actual post(topic page)
		 * when its done
		 */
		postBox.onclick = () => {
			this.post.updateClicks();
			new Cookie().setCookie("postId", this.post.getId(), 7);
			new Cookie().setCookie("forum", this.post.forum, 7);
			location.href = "02_topic.html";
		};

		//creating a div to hold userID
		let userBox = document.createElement("div");
		userBox.classList.add("postContent");
		this.post.getAttribute("userId").then( user => userBox.innerHTML = '<i class="fa fa-user"></i> ' + user); //putting content into the div UserBox.

		let titleBox = document.createElement("div");
		titleBox.classList.add("postContent");
		this.post.getAttribute("title").then( title => titleBox.innerHTML = title);

		let contentBox = document.createElement("div");
		contentBox.classList.add("postContent");
		this.post.getAttribute("content").then( content => contentBox.innerHTML = content);

		let timeSubmittedBox = document.createElement("div");
		timeSubmittedBox.classList.add("postContent");
		timeSubmittedBox.style.width = "fit-content";

		this.post.getAttribute("timeSubmitted").then(time => timeSubmittedBox.innerHTML = '<i class="fa fa-clock-o"></i> ' + new Date(time));

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
		this.parentContainer.appendChild(postBox);
	}
}

class ReplyBox {
	constructor(reply, parentContainer) {
		this.reply = reply;
		this.parentContainer = parentContainer;
	}

	createReply() {
		let container = document.createElement("div");
		let userBox = document.createElement("div");
		let commentBox = document.createElement("div");
		let timeBox = document.createElement("div");

		container.classList.add("post");

		userBox.setAttribute("id", "user");
		userBox.classList.add("commentContent");
		userBox.innerHTML = `<strong>${this.reply.userId}</strong>`;

		commentBox.setAttribute("id", "userComment");
		commentBox.classList.add("commentContent");
		commentBox.innerHTML = `<p>${this.reply.reply}</p>`;

		timeBox.setAttribute("id", "userTimeSub");
		timeBox.classList.add("col-sm");
		timeBox.innerHTML = '<i class="fa fa-clock-o"></i> ' + new Date(this.reply.timeSubmitted);

		container.appendChild(userBox);
		container.appendChild(commentBox);
		container.appendChild(timeBox);

		this.parentContainer.appendChild(container);
	}
}

class CommentFactory {
	/**
	 * @param {div} parentContainer
	 * @param {Array} comments
	 */
	constructor(parentContainer, post) {
		this.parentContainer = parentContainer;
		this.post = post;
	}

	/**
	 * creates comment objects of children of parent post, and stores them in a list
	 */
	displayComments() {
		this.post.getAttribute("comments").then((comments) => {
			for (let comment in comments) {
				let commObj = new Comment(this.post.forum, this.post.postId, comment);
				let c = new CommentBox(commObj, this.parentContainer);
				let replies = commObj.getAttribute("replies");

				c.createComment();

				/**
				 * if the comment has replies, we iterate over it,
				 * create the reply, and attach it to the parent comment
				 **/
				replies.then((data) => {
					for (let reply in data) {
						new ReplyBox(data[reply], document.getElementById(commObj.getId()).parentElement.querySelector(".replies")).createReply();
					}
				});
				
			}
		});

		/*for(let comment in this.comments){
			let c = new commentBox(comment,this.parentContainer)
			let replies = comment.getAttribute('replies');
			c.createComment();

			/**
			 * if the comment has replies, we iterate over it,
			 * create the reply, and attach it to the parent comment
			 
			for(let reply in replies){
				new ReplyBox(replies[reply],
					document.getElementById(comment.getAttribute('id'))
					.parentElement.querySelector(".replies")
				).createReply();
			}
		}*/
	}
}

class PostFactory {
	/**
	 * @param {DIV} parentContainer
	 * @param {Array} posts
	 */
	constructor(parentContainer, forum) {
		this.parentContainer = parentContainer;
		this.forum = forum;
	}

	displayPosts() {
		let ref = firebase.database().ref(`${this.forum}/posts/`);
		let get = ref.orderByChild("clicks").on("value", (posts) => {
			posts.forEach((childPost) => {
				new PostBox(new Post(this.forum, childPost.key), this.parentContainer,).createPost();
			});
		});

		setTimeout(() => {
			ref.orderByChild("clicks").off("value", get);
		}, 1500);

	}
}

export { Forum, Post, Comment, PostFactory, CommentFactory };
