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
		console.log(this.post)
	}
	//note: currently untested without a working forumn
	writeComment(comment) {
		let newKey = this.database.ref().push().key;

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
	writeReply(userId, postID, commentID, content) {
		let newKey = this.database.ref().child.push().key;

		this.database.ref(`${this.forum}/${postID}/comments/comment-${commentID}/replies/reply-${newKey}`).set({
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

	getClicks() {
		this.updatePost();

		let val = this.post.clicks;

		if (val === undefined) return 0;

		return val;
	}
	//TEST_________________________________________________________________________________________________________
	getClicksTrending() {
		this.updatePost();

		let val = this.post.clicksTrending;

		if (val === undefined)
			 return 0;

		return val;
	}

	updateClicksTrending() {
		this.ref.child("clicksTrending").set(this.getClicks() - 1);
	}
	
	resetClicksTrending() {
		var date = new Date(),
			h = new Date(d.getFullYear(), date.getMonth(), date.getDate(), date.getHours() + 1, 0, 0, 0),
			e = h - date;
		if (e > 100) { 
			window.setTimeout(resetClicksTrending, e);
		}
		var objDate = new Date();
		var hours = objDate.getHours();

		if(hours >= 12 && hours <= 11) {
    		this.ref.child("clicksTrending").set(this.getClicks() = 0);
		}

	}

	//Test_____________________________________________________________________________________________________________


	//incremenets posts count on each click.
	updateClicks() {
		this.ref.child("clicks").set(this.getClicks() - 1);
	}



	getAComment(commentId) {
		let commentRef = firebase.database().ref(`${this.forum}/posts/${this.postId}/comments/${commentId}`);;

		commentRef.once("value", (comment) => {
			return comment.val();
		});
	}

	getAllComments(container) {


		let get = this.ref.child('comments').on("value", (comments) => {
			comments.forEach((comment) => {
				let c = this.getAComment(comment);
				this.createComments(container,c.user,c.comment,c.timeSubmitted);
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

	createComments(commentArea,userId,comment,timeSubmitted){
		let container = document.createElement('div');
		let userBox = document.createElement('div');
		let commentBox = document.createElement('div');
		let timeBox = document.createElement('div');

		container.setAttribute('id','commentBox');
		container.classList.add('post');

		userBox.setAttribute('id','user')
		userBox.innerHTML = userId;

		commentBox.setAttribute('id','userComment')
		commentBox.innerHTML = `<p>${comment}</p>`;

		timeBox.setAttribute('id','userTimeSub')
		timeBox.innerText = timeSubmitted;

		container.appendChild(userBox);
		container.appendChild(commentBox);
		container.appendChild(timeBox);
		
		commentArea.appendChild(container)
	}
	createPost(container) {
		let post = this;
		let postBox = document.createElement("div");

		let userID = post.getUser();
		let title = post.getTitle();
		let content = post.getContent();
		let timeSubmitted = post.getTimeSubmitted();

		postBox.classList.add("container", "border", "POSTS", "post"); //using boostrap container and border
		postBox.setAttribute("id", post.getPostId());

		/**
		 * increments clicks on post by 1, then redirects to actual post
		 * currently redirects to index.html, >> victoira make sure to redirect to actual post(topic page)
		 * when its done
		 */
		postBox.onclick = () => {
			this.updateClicks();
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

		timeSubmittedBox.innerHTML = new Date(timeSubmitted);

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

	/*
      > gets all posts from the specified forumn/field
        >> note: I use forumn and field interchangeably because each forum is supposed to represent a field/industry
    */
	getAllPosts(container) {
		let forum = this.database.ref(`${this.forum}/posts/`);

		let get = forum.orderByChild("clicks").on("value", (posts) => {
			posts.forEach((childPost) => {
				let p = new Post(this.forum, childPost.key).createPost(container);
			});
		});
		setTimeout(() => {
			forum.orderByChild("clicks").off("value", get);
		}, 1500);
	}
}

export { Forum, Post };
