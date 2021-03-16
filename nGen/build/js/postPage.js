import { Post } from "./content_mngr.js";
import { Cookie } from "./cookies.js";

const user = document.getElementById("user");
const title = document.getElementById("title");
const content = document.getElementById("content");
const timeSubmitted = document.getElementById("timeCreated");
const commentArea = document.getElementById("comments");

const forum = new Cookie().getCookie("forum");
const postId = new Cookie().getCookie("postId");

const _post = new Post(forum, postId);
const post = new Post(forum, postId).asyncGetPost();
const userComment = document.getElementById("reply");

function setForm(userId, postTitle, postContent, postTimeSubmitted) {
	user.innerHTML = user.innerHTML + " " + userId;
	title.innerHTML = postTitle;
	content.innerHTML = postContent;
	timeSubmitted.innerHTML = timeSubmitted.innerHTML + " " + new Date(postTimeSubmitted);
}

function createComments(userId, comment, timeSubmitted) {
	let container = document.createElement("div");
	let userBox = document.createElement("div");
	let commentBox = document.createElement("div");
	let timeBox = document.createElement("div");

	container.setAttribute("id", "commentBox");
	container.classList.add("post");

	userBox.setAttribute("id", "user");
	userBox.classList.add("commentContent");
	userBox.innerHTML = `<strong>${userId}</strong>`;

	commentBox.setAttribute("id", "userComment");
	commentBox.classList.add("commentContent");
	commentBox.innerHTML = `<p>${comment}</p>`;

	timeBox.setAttribute("id", "userTimeSub");
	timeBox.classList.add("commentContent");
	timeBox.innerHTML = '<i class="fa fa-clock-o"></i> ' + new Date(timeSubmitted);

	container.appendChild(userBox);
	container.appendChild(commentBox);
	container.appendChild(timeBox);

	commentArea.appendChild(container);
}

function saveComment(userId) {
	console.log(userComment.value);
	_post.writeComment(userId, userComment.value);
}

document.getElementById("comment").onclick = () => {
	saveComment("baboya");
};

post.then((data) => {
	console.log(data);
	setForm(data.userId, data.title, data.content, data.timeSubmitted);
	for (let comment in data.comments) {
		let c = data.comments[comment];
		createComments(c.userId, c.comment, c.timeSubmitted);
	}
});
