import { Cookie } from "./cookies.js";

class Firebase {
	//https://gist.github.com/jofftiquez/f60dc81b39d77cd4eb1f5b5cbe6585ad
	constructor() {
		this.ref = firebase.database();
	}

	writePost(forum, userId, title, content) {
		let location = this.ref.ref(`${forum}/posts`);
		let newKey = location.push().key;

		location.child(newKey).set({
			userId: userId,
			title: title,
			content: content,
			timeSubmitted: Date.now(),
			clicks: 0,
		});
	}

	writeComment(forum, postId, userId, comment) {
		let location = this.ref.ref(`${forum}/posts/${postId}/comments`);
		let newKey = location.push().key;

		location.child(newKey).set({
			userId: userId,
			comment: comment,
			timeSubmitted: Date.now(),
		});
	}

	/**
	 * Writes the reply to the parent comment
	 * @param {String} userId
	 * @param {String} content
	 */
	writeReply(forum, postId, commentId, userId, content) {
		let location = this.ref.ref(`${forum}/posts/${postId}/comments/${commentId}/replies`);
		let newKey = location.push().key;

		location.child(newKey).set({
			userId: userId,
			reply: content,
			timeSubmitted: Date.now(),
		});
	}

	flagPost(postId, forum) {}

	flagComment(commentId, postId, forum) {}

	flagContent(data) {
		let location = firebase.database().ref("FlaggedContent");
		let newKey = location.push().key;
		location(newKey).set(data);
	}
}

class Search {
	constructor(location, orderBy) {
		this.ref = firebase.database().ref(location);
		this.orderBy = orderBy;
	}
	searchFor(data) {
		return new Promise((resolve, reject) => {
			this.ref
				.orderByChild(this.orderBy)
				.equalTo(data)
				.once("value", (snapshot) => {
					resolve(snapshot.val());
					//this.ref.off("value");
				});
		});
	}
	searchForParent(data) {
		return new Promise((resolve, reject) => {
			this.ref
				.orderByChild(this.orderBy)
				.equalTo(data)
				.once("value", (snapshot) => {
					resolve(Object.keys(snapshot.val())[0]);
				});
		});
	}
	async exists(data) {
		if ((await this.searchFor(data)) !== null) return true;
		return false;
	}
}

class Flag extends Search {
	constructor(location, orderBy) {
		super(location, orderBy);
	}

	async updateReports(data) {
		let parent = await this.searchForParent(data);
		console.log(parent);
		let reports = await this.getReports(parent);
		console.log(reports);
		firebase
			.database()
			.ref(`FlaggedContent/${parent}`)
			.update({
				reports: reports - 1,
			});
	}

	getReports(parent) {
		return new Promise((resolve, reject) => {
			firebase
				.database()
				.ref(`FlaggedContent/${parent}`)
				.child("reports")
				.once("value", (val) => {
					resolve(val.val());
				});
		});
	}

	/**
	 *
	 * @param {string} type -> pass commentId if its a comment; -> pass postId if its a post
	 * @param {string} id  -> the postId/commnentId of the thing to be removed
	 */
	deleteFlag(type, id) {
		console.log(type, id);
		new Search("FlaggedContent", type).searchForParent(id).then((parent) => {
			console.log(parent);
			firebase.database().ref(`FlaggedContent/${parent}`).remove();
		});
	}

	delete(...args) {
		if (args.length === 2) {
			console.log(args[0], args[1]);
			this.deleteFlag("postId", args[1]);
			console.log(new Flag("FlaggedContent", "postId").searchForParent(args[1]));
			firebase.database().ref(`${args[0]}/posts/${args[1]}`).remove();
		} else if (args.length === 3) {
			console.log(args[0], args[1], args[2]);
			this.deleteFlag("commentId", args[2]);
			firebase.database().ref(`${args[0]}/posts/${args[1]}/comments/${args[2]}`).remove();
		}
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

		replyNTimeCont.classList.add("container-fluid", "row", "commentContent");

		timeBox.setAttribute("id", "userTimeSub");
		timeBox.classList.add("col-sm");
		this.comment
			.getAttribute("timeSubmitted")
			.then((time) => (timeBox.innerHTML = '<i class="fa fa-clock-o"></i> ' + new Date(time)));
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

		let report = document.createElement("div");
		report.classList.add("col-sm", "replyBtn");
		let reportBtn = document.createElement("button");
		reportBtn.classList.add("btn", "btn-danger", "Replies");

		let flag = (btn) => {
			let commentId = btn.parentElement.parentElement.parentElement.getAttribute("id");
			const forum = new Cookie().getCookie("forum");
			const postId = new Cookie().getCookie("postId");
			new Firebase().flagComment(forum, postId, commentId);
		};
		reportBtn.onclick = () => {
			flag(reportBtn);
		};

		reply.appendChild(replyBtn);
		report.appendChild(reportBtn);
		replyNTimeCont.appendChild(reply);
		replyNTimeCont.appendChild(report);
		this.parentContainer.appendChild(mainCont);
	}

	createFlaggedComment() {
		let mainCont = document.createElement("div");
		let container = document.createElement("div");
		let userBox = document.createElement("div");
		let commentBox = document.createElement("div");
		let removeNTimeCont = document.createElement("div");
		let timeBox = document.createElement("div");

		container.setAttribute("id", this.comment.getId());
		container.classList.add("post");

		userBox.setAttribute("id", "user");
		userBox.classList.add("commentContent");
		this.comment.getAttribute("userId").then((userId) => (userBox.innerHTML = `<strong>${userId}</strong>`));

		commentBox.setAttribute("id", "userComment");
		commentBox.classList.add("commentContent");
		this.comment.getAttribute("comment").then((comment) => (commentBox.innerHTML = `<p>${comment}</p>`));

		removeNTimeCont.classList.add("row", "commentContent");

		timeBox.setAttribute("id", "userTimeSub");
		timeBox.classList.add("col-sm");
		this.comment
			.getAttribute("timeSubmitted")
			.then((time) => (timeBox.innerHTML = '<i class="fa fa-clock-o"></i> ' + new Date(time)));
		removeNTimeCont.appendChild(timeBox);

		container.appendChild(userBox);
		container.appendChild(commentBox);
		container.appendChild(removeNTimeCont);

		mainCont.appendChild(container);

		let remove = document.createElement("div");
		remove.classList.add("col-sm", "replyBtn");

		let removeBtn = document.createElement("button");
		removeBtn.classList.add("btn", "btn-danger", "pull-right", "Replies");
		removeBtn.innerHTML = "Delete";

		removeBtn.onclick = async () => {
			let parent = await new Flag("FlaggedContent", "commentId").searchForParent(this.comment.getId());
			let c = new Data("FlaggedContent", parent);
			Promise.all([c.getAttribute("forum"), c.getAttribute("postId"), c.getAttribute("commentId")]).then(
				(data) => {
					new Flag().delete(...data);
				}
			);
		};

		let removeFlag = document.createElement("button");
		removeFlag.classList.add("btn", "btn-success", "pull-right", "Replies");
		removeFlag.innerHTML = "Unflag";

		removeFlag.onclick = async () => {
			new Flag().deleteFlag("commentId", this.comment.getId());
		};

		remove.appendChild(removeBtn);
		remove.appendChild(removeFlag);
		removeNTimeCont.appendChild(remove);
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
		postBox.setAttribute("id", this.post.getId());

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
		this.post.getAttribute("userId").then((user) => (userBox.innerHTML = '<i class="fa fa-user"></i> ' + user)); //putting content into the div UserBox.

		let titleBox = document.createElement("div");
		titleBox.classList.add("postContent");
		this.post.getAttribute("title").then((title) => (titleBox.innerHTML = title));

		let contentBox = document.createElement("div");
		contentBox.classList.add("postContent");
		this.post.getAttribute("content").then((content) => {
			if (content.length >= 200) contentBox.innerHTML = content.substring(0, 200) + "...";
			else {
				contentBox.innerHTML = content;
			}
		});

		let timeSubmittedBox = document.createElement("div");
		timeSubmittedBox.classList.add("postContent");
		timeSubmittedBox.style.width = "fit-content";

		this.post
			.getAttribute("timeSubmitted")
			.then((time) => (timeSubmittedBox.innerHTML = '<i class="fa fa-clock-o"></i> ' + new Date(time)));

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
				let commObj = new Comment(this.post.forum, this.post.getId(), comment);
				let c = new CommentBox(commObj, this.parentContainer);
				let replies = commObj.getAttribute("replies");

				c.createComment();

				/**
				 * if the comment has replies, we iterate over it,
				 * create the reply, and attach it to the parent comment
				 **/
				replies.then((data) => {
					for (let reply in data) {
						new ReplyBox(
							data[reply],
							document.getElementById(commObj.getId()).parentElement.querySelector(".replies")
						).createReply();
					}
				});
			}
		});
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
				new PostBox(new Post(this.forum, childPost.key), this.parentContainer).createPost();
			});
		});

		setTimeout(() => {
			ref.orderByChild("clicks").off("value", get);
		}, 1500);
	}
}

class FlagFactory extends Flag {
	constructor(parent) {
		super("FlaggedContent", "type");
		this.parentContainer = parent;
	}

	displayComments() {
		this.searchFor("comment").then((flagged) => {
			for (let id in flagged) {
				let content = new Data("FlaggedContent", id);
				Promise.all([
					content.getAttribute("forum"),
					content.getAttribute("parent"),
					content.getAttribute("commentId"),
				]).then((data) => {
					console.log(data);
					let comment = new Comment(data[0], data[1], data[2]);
					new CommentBox(comment, this.parentContainer).createFlaggedComment();
				});
			}
		});
	}

	displayPosts() {
		this.searchFor("post").then((flagged) => {
			for (let id in flagged) {
				let content = new Data("FlaggedContent", id);
				Promise.all([content.getAttribute("forum"), content.getAttribute("postId")]).then((data) => {
					let post = new Post(data[0], data[1]);
					new PostBox(post, this.parentContainer).createPost();
				});
			}
		});
	}
}
export { Forum, Post, Comment, PostFactory, CommentFactory, Firebase, Flag, Data, FlagFactory };
