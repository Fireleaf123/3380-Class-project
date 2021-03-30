import { Cookie } from "./cookies.js";
/**
 * class that has all the writer operations to Fieebase
 */
class Firebase {
	constructor() {
		this.ref = firebase.database();
	}
	/**
	 * writes a the content to the database
	 * @param {string} forum, forum to be posted in
	 * @param {string} userId , username of currretnyl signed in useer
	 * @param {string} title, user's title
	 * @param {string} content, user's words
	 */
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
	/**
	 * writes a the content to the database
	 * @param {string} forum, forum to be posted in
	 * @param {postId} postId,id of parent post
	 * @param {string} userId , username of currretnyl signed in useer
	 * @param {string} comment, user's words
	 */
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
	 *  Writes the reply to the parent comment passed
	 * @param {string} forum, forum that content belongs to
	 * @param {string} postId, id of parent comment
	 * @param {string} commentId, id of parent
	 * @param {string} userId, current user's username
	 * @param {string} content, user's words
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
	/**
	 * saves the data in {data} to flaggedContent table
	 * @param {object} data
	 */
	flagContent(data) {
		let location = firebase.database().ref("FlaggedContent");
		let newKey = location.push().key;
		location.child(newKey).set(data);
	}
	/**
	 * checks if a post is already flagged, if not creates a new entry
	 * if so, incremenet reports
	 * @param {string} postId, id post reported
	 * @param {string} forum , forum post belongs to
	 */
	flagPost(postId, forum) {
		new Flag("FlaggedContent", "postId").exists(postId).then((res) => {
			//if already flagged
			if (res) {
				new Flag("FlaggedContent", "postId").updateReports(postId);
			} else {
				new Firebase().flagContent({
					type: "post",
					postId: postId,
					forum: forum,
					reports: -1,
				});
			}
		});
	}
	/**
	 * check if comment is already flagged, if not creates a new entry
	 * if so, increment reports
	 * @param {string} forum
	 * @param {string} postId
	 * @param {strin} commentId
	 */
	flagComment(forum, postId, commentId) {
		new Flag("FlaggedContent", "commentId").exists(commentId).then((res) => {
			//if already flagged
			if (res) {
				new Flag("FlaggedContent", "commentId").updateReports(commentId);
			} else {
				new Firebase().flagContent({
					type: "comment",
					forum: forum,
					parent: postId,
					commentId: commentId,
					reports: -1,
				});
			}
		});
	}
	/**
	 *saves user profile info to database
	 * @param {string} userName
	 * @param {string} userBday
	 * @param {string} userId
	 * @param {string} userRole
	 * @param {string} userIndustry
	 * @param {string} userEducation
	 */
	saveUser(userName, userBday, userId, userRole, userIndustry, userEducation) {
		var userName = document.getElementById("userName").value;
		var userBday = document.getElementById("userBday").value;
		var userRole = document.getElementById("userRole").value;
		var userIndustry = document.getElementById("userIndustry").value;
		var userEducation = document.getElementById("userEducation").value;

		firebase.database().ref(`users/${userId}/`).set({
			userId: userId,
			username: userName,
			birthday: userBday,
			userrole: userRole,
			industry: userIndustry,
			education: userEducation,
		});
		setTimeout(function () {
			location.href = "index.html";
		}, 2000);
	}
}
/**
 * Houses operations to serach for data in the database
 */
class Search {
	/**
	 *
	 * @param {string} location, database table
	 * @param {string} orderBy, field to be searched by
	 */
	constructor(location, orderBy) {
		this.ref = firebase.database().ref(location);
		this.orderBy = orderBy;
	}
	/**
	 * searches for collection that has property orderby of value {data}
	 * @param {*} data
	 * @returns
	 */
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
	/**
	 * retrieves the id of the parent of the collection the data belongs to
	 * @param {*} data
	 * @returns string
	 */
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
/**
 * houses functions to handle, deletetion and flagging of content in Flagged content table
 * inherits functions from search to find original location of data reported
 */
class Flag extends Search {
	constructor(location, orderBy) {
		super(location, orderBy);
	}
	/**
	 * increments value of reports at collection of id {data}
	 * @param {string} data
	 */
	async updateReports(data) {
		let parent = await this.searchForParent(data);
		let reports = await this.#getReports(parent);
		console.log(reports);
		firebase
			.database()
			.ref(`FlaggedContent/${parent}`)
			.update({
				reports: reports - 1,
			});
	}
	/**
	 * gets curreent value of reports at collection of id parent
	 * @param {string} parent
	 * @returns
	 */
	#getReports(parent) {
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
	 *deletes the flag/report of content at locatin id in flaggedcontent table
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
	/**
	 * permantelt deletes collcetion at location {..args}
	 * @param  {...any} args
	 */
	delete(...args) {
		if (args.length === 2) {
			this.deleteFlag("postId", args[1]);
			console.log(args[0], args[1]);
			firebase.database().ref(`${args[0]}/posts/${args[1]}`).remove();
		} else if (args.length === 3) {
			this.deleteFlag("commentId", args[2]);
			firebase.database().ref(`${args[0]}/posts/${args[1]}/comments/${args[2]}`).remove();
		}
	}
}
/**
 * houses functions to get infoamation about the collection of key id
 */
class Data {
	/**
	 * intializes a referecnce using the parent and id
	 * @param {string} parent
	 * @param {string} id
	 */
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
	getParent() {
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

/**
 * Houses methods to act on posts
 */
class Post extends Data {
	forum;
	constructor(forum, postId) {
		super(`${forum}/posts/`, postId);
		this.forum = forum;
	}

	//returns the post with id postId
	getPost() {
		return new Promise((resolve, reject) => {
			this.ref.once("value", (post) => {
				resolve(post.val());
			});
		});
	}
	/**
	 * updates the post
	 */
	async #updatePost() {
		this.post = await this.getPost();
	}
	/**
	 * increments value of clicks property of the current post
	 */
	async updateClicks() {
		let clicks = (await this.getAttribute("clicks")) === undefined ? 0 : await this.getAttribute("clicks");
		this.ref.child("clicks").set(clicks - 1);
	}
	/**
	 * gets the comments associated with the given post
	 * @returns object
	 */
	getComments() {
		this.getAttribute("comments").then((comments) => {
			for (let comment in comments) {
				console.log(new Comment(this.forum, this.postId, comment));
			}
		});
		return listOfComments;
	}
}

/**
 * houses functions to data stored in the given forum
 */
class Forum extends Data {
	#ref;
	#forum;
	constructor(forum) {
		super("", forum);
		this.#ref = firebase.database().ref(`${forum}/posts`);
		this.#forum = forum;
	}
	/*
      > gets all posts from the specified forumn/field
        >> note: I use forumn and field interchangeably because each forum is supposed to represent a field/industry
    */
	async getPosts() {
		let listOfPosts = [];

		let get = this.#ref.orderByChild("clicks").on("value", (posts) => {
			posts.forEach((childPost) => {
				listOfPosts.push(new Post(this.#forum, childPost.key));
			});
		});

		setTimeout(() => {
			this.#ref.orderByChild("clicks").off("value", get);
		}, 1500);

		return listOfPosts;
	}
}
/**
 * creates container using comment data passed
 */
class CommentBox {
	#comment;
	#parentContainer;
	/**
	 *
	 * @param {Comment} comment
	 * @param {HTML div} parentContainer
	 */
	constructor(comment, parentContainer) {
		this.#comment = comment;
		this.#parentContainer = parentContainer;
	}
	/**
	 * creates a container that displays comment datta
	 */
	createComment() {
		let mainCont = document.createElement("div");
		let container = document.createElement("div");
		let userBox = document.createElement("div");
		let commentBox = document.createElement("div");
		let replyNTimeCont = document.createElement("div");
		let timeBox = document.createElement("div");
		let repliesCont;

		container.setAttribute("id", this.#comment.getId());
		container.classList.add("post");

		userBox.setAttribute("id", "user");
		userBox.classList.add("commentContent");
		this.#comment.getAttribute("userId").then((userId) => (userBox.innerHTML = `<strong>${userId}</strong>`));

		commentBox.setAttribute("id", "userComment");
		commentBox.classList.add("commentContent");
		this.#comment.getAttribute("comment").then((comment) => (commentBox.innerHTML = `<p>${comment}</p>`));

		replyNTimeCont.classList.add("container-fluid", "row", "commentContent");

		timeBox.setAttribute("id", "userTimeSub");
		timeBox.classList.add("col-lg-8");
		this.#comment.getAttribute("timeSubmitted").then((time) => (timeBox.innerHTML = '<i class="fa fa-clock-o"></i> ' + new Date(time)));
		replyNTimeCont.appendChild(timeBox);

		container.appendChild(userBox);
		container.appendChild(commentBox);
		container.appendChild(replyNTimeCont);

		mainCont.appendChild(container);

		repliesCont = document.createElement("div");
		repliesCont.classList.add("replies");
		mainCont.appendChild(repliesCont);

		let reply = document.createElement("div");
		reply.classList.add("col-lg-2", "replyBtn");
		let replyBtn = document.createElement("button");

		replyBtn.classList.add("btn", "btn-info", "pull-right", "Replies", "pull-right");
		replyBtn.innerHTML = "Reply";

		replyBtn.onclick = () => {
			commentBtn.innerHTML = "Post Reply";
			container.appendChild(document.getElementById("writeCoR"));
			//_post.writeReply('baboya',postId,id,reply)
		};

		let report = document.createElement("div");
		report.classList.add("col-lg-2", "reportBtn");
		let reportBtn = document.createElement("button");
		reportBtn.classList.add("btn", "btn-warning", "pull-right");
		reportBtn.innerHTML = "Report";
		let flag = (btn) => {
			let commentId = btn.parentElement.parentElement.parentElement.getAttribute("id");
			const forum = new Cookie().getCookie("forum");
			const postId = new Cookie().getCookie("postId");
			new Firebase().flagComment(forum, postId, commentId);
			alert("Reported");
		};
		reportBtn.onclick = () => {
			flag(reportBtn);
		};

		reply.appendChild(replyBtn);
		report.appendChild(reportBtn);
		replyNTimeCont.appendChild(reply);
		replyNTimeCont.appendChild(report);
		this.#parentContainer.appendChild(mainCont);
	}
	/**
	 * creates container that houses comment data, but has two additional
	 * buttons to unflag and remove.
	 * only created in the mod_tools page to be used by admins
	 */
	createFlaggedComment() {
		let mainCont = document.createElement("div");
		let container = document.createElement("div");
		let userBox = document.createElement("div");
		let commentBox = document.createElement("div");
		let removeNTimeCont = document.createElement("div");
		let timeBox = document.createElement("div");

		container.setAttribute("id", this.#comment.getId());
		container.classList.add("post");

		userBox.setAttribute("id", "user");
		userBox.classList.add("commentContent");
		this.#comment.getAttribute("userId").then((userId) => (userBox.innerHTML = `<strong>${userId}</strong>`));

		commentBox.setAttribute("id", "userComment");
		commentBox.classList.add("commentContent");
		this.#comment.getAttribute("comment").then((comment) => (commentBox.innerHTML = `<p>${comment}</p>`));

		removeNTimeCont.classList.add("row", "commentContent");

		timeBox.setAttribute("id", "userTimeSub");
		timeBox.classList.add("col-sm");
		this.#comment.getAttribute("timeSubmitted").then((time) => (timeBox.innerHTML = '<i class="fa fa-clock-o"></i> ' + new Date(time)));
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
			let parent = await new Flag("FlaggedContent", "commentId").searchForParent(this.#comment.getId());
			let c = new Data("FlaggedContent", parent);
			Promise.all([c.getAttribute("forum"), c.getAttribute("postId"), c.getAttribute("commentId")]).then((data) => {
				new Flag().delete(...data);
			});
			setTimeout(location.reload(), 300);
		};

		let removeFlag = document.createElement("button");
		removeFlag.classList.add("btn", "btn-success", "pull-right", "Replies");
		removeFlag.innerHTML = "Unflag";

		removeFlag.onclick = async () => {
			new Flag().deleteFlag("commentId", this.#comment.getId());
			setTimeout(location.reload(), 300);
		};

		remove.appendChild(removeBtn);
		remove.appendChild(removeFlag);
		removeNTimeCont.appendChild(remove);
		this.#parentContainer.appendChild(mainCont);
	}
}
/**
 * creates container that displays post Info
 */
class PostBox {
	#post;
	#parentContainer;
	/**
	 *
	 * @param {Post} post
	 * @param {HTML div} parentContainer
	 */
	constructor(post, parentContainer) {
		this.#post = post;
		this.#parentContainer = parentContainer;
	}
	/**
	 * creates a post using the data from the Post object
	 */
	createPost() {
		let postBox = document.createElement("div");

		postBox.classList.add("POSTS", "post"); //using boostrap container and border
		postBox.setAttribute("id", this.#post.getId());

		/**
		 * increments clicks on post by 1, then redirects to actual post
		 * currently redirects to index.html, >> victoira make sure to redirect to actual post(topic page)
		 * when its done
		 */
		postBox.onclick = () => {
			this.#post.updateClicks();
			new Cookie().setCookie("postId", this.#post.getId(), 7);
			new Cookie().setCookie("forum", this.#post.forum, 7);
			location.href = "02_topic.html";
		};

		//creating a div to hold userID
		let userBox = document.createElement("div");
		userBox.classList.add("postContent");
		this.#post.getAttribute("userId").then((user) => (userBox.innerHTML = `<b id="post-user">posted by: <i class="fa fa-user"></i> ${user}</b>`)); //putting content into the div UserBox.

		let titleBox = document.createElement("div");
		titleBox.classList.add("postContent", "post-title");
		this.#post.getAttribute("title").then((title) => (titleBox.innerHTML = title));

		let contentBox = document.createElement("div");
		contentBox.classList.add("postContent", "post-content");
		this.#post.getAttribute("content").then((content) => {
			if (content.length >= 700) contentBox.innerHTML = content.substring(0, 700) + "...";
			else {
				contentBox.innerHTML = content;
			}
		});

		let timeSubmittedBox = document.createElement("div");
		timeSubmittedBox.classList.add("postContent", "post-time");
		timeSubmittedBox.style.width = "fit-content";

		this.#post.getAttribute("timeSubmitted").then((time) => (timeSubmittedBox.innerHTML = '<i class="fa fa-clock-o"></i> ' + new Date(time)));

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
		this.#parentContainer.appendChild(postBox);
	}
}

/**
 * creates container that displays content of reply
 */
class ReplyBox {
	#reply;
	#parentContainer;
	/**
	 *
	 * @param {object} reply
	 * @param {HTML div} parentContainer
	 */
	constructor(reply, parentContainer) {
		this.#reply = reply;
		this.#parentContainer = parentContainer;
	}
	/**
	 * creates containers using the data in reply object dynamically
	 */
	createReply() {
		let container = document.createElement("div");
		let userBox = document.createElement("div");
		let commentBox = document.createElement("div");
		let timeBox = document.createElement("div");

		container.classList.add("post");

		userBox.setAttribute("id", "user");
		userBox.classList.add("commentContent");
		userBox.innerHTML = `<strong>${this.#reply.userId}</strong>`;

		commentBox.setAttribute("id", "userComment");
		commentBox.classList.add("commentContent");
		commentBox.innerHTML = `<p>${this.#reply.reply}</p>`;

		timeBox.setAttribute("id", "userTimeSub");
		timeBox.classList.add("col-sm");
		timeBox.innerHTML = '<i class="fa fa-clock-o"></i> ' + new Date(this.#reply.timeSubmitted);

		container.appendChild(userBox);
		container.appendChild(commentBox);
		container.appendChild(timeBox);

		this.#parentContainer.appendChild(container);
	}
}

/**
 * displays all the comments for the given post
 */
class CommentFactory {
	#parentContainer;
	#post;
	/**
	 * @param {div} parentContainer
	 * @param {Array} comments
	 */
	constructor(parentContainer, post) {
		this.#parentContainer = parentContainer;
		this.#post = post;
	}

	/**
	 * creates comment objects for each comment of the parent posts and passses them to
	 * commentBox to be used to create containers to display its data
	 *
	 * also takes the replies of each comment and creates its children replies
	 */
	displayComments() {
		this.#post.getAttribute("comments").then((comments) => {
			for (let comment in comments) {
				let commObj = new Comment(this.#post.forum, this.#post.getId(), comment);
				let c = new CommentBox(commObj, this.#parentContainer);
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
	}
}
/**
 * creates containers for every post in at location of the forum passed
 */
class PostFactory {
	#parentContainer;
	#forum;
	/**
	 *
	 * @param {HTML div} parentContainer
	 * @param {string} forum
	 */
	constructor(parentContainer, forum) {
		this.#parentContainer = parentContainer;
		this.#forum = forum;
	}
	/**
	 * creates post Objects for every post in the {forum} and passes
	 * them to postBox so containers can created using its data nd then displayed
	 */
	displayPosts() {
		let ref = firebase.database().ref(`${this.#forum}/posts/`);
		let get = ref.orderByChild("clicks").on("value", (posts) => {
			posts.forEach((childPost) => {
				new PostBox(new Post(this.#forum, childPost.key), this.#parentContainer).createPost();
			});
		});

		setTimeout(() => {
			ref.orderByChild("clicks").off("value", get);
		}, 1500);
	}
}
/**
 * creates flagged versions of comment and post containers
 */
class FlagFactory extends Flag {
	#parentContainer;
	constructor(parent) {
		super("FlaggedContent", "type");
		this.#parentContainer = parent;
	}
	/**
	 * searches for reports of type 'comment' and displays them
	 * using containers specificaly made for flagged comments
	 */
	displayComments() {
		this.searchFor("comment").then((flagged) => {
			for (let id in flagged) {
				let content = new Data("FlaggedContent", id);
				Promise.all([content.getAttribute("forum"), content.getAttribute("parent"), content.getAttribute("commentId")]).then((data) => {
					let comment = new Comment(data[0], data[1], data[2]);
					new CommentBox(comment, this.#parentContainer).createFlaggedComment();
				});
			}
		});
	}
	/**
	 * searches for reports of type 'post' and displays them
	 * admin must click on post to follow read post, and can then remove it from there.
	 */
	displayPosts() {
		this.searchFor("post").then((flagged) => {
			for (let id in flagged) {
				let content = new Data("FlaggedContent", id);
				Promise.all([content.getAttribute("forum"), content.getAttribute("postId")]).then((data) => {
					let post = new Post(data[0], data[1]);
					new PostBox(post, this.#parentContainer).createPost();
				});
			}
		});
	}
}
export { Forum, Post, Comment, PostFactory, CommentFactory, Firebase, Flag, Data, FlagFactory };
