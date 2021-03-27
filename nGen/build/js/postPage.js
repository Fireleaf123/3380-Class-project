import { Post, Comment, CommentFactory, Firebase, Flag } from "./content_mngr.js";
import { Cookie } from "./cookies.js";
import { User } from "./User.js";

const user = document.getElementById("user");
const title = document.getElementById("title");
const content = document.getElementById("content");
const timeSubmitted = document.getElementById("timeCreated");
const commentArea = document.getElementById("comments");
const commentWriter = document.getElementById("writeCoR");
const commentBtn = document.getElementById("commentBtn");
const userComment = document.getElementById("reply");

const forum = new Cookie().getCookie("forum");
const postId = new Cookie().getCookie("postId");

const POST = new Post(forum, postId);

new CommentFactory(commentArea, POST).displayComments();

async function setPost() {
	user.innerHTML = await POST.getAttribute("userId");
	title.innerHTML = await POST.getAttribute("title");
	content.innerHTML = await POST.getAttribute("content");
	timeSubmitted.innerHTML = '<i class="fa fa-clock-o"></i> ' + new Date(await POST.getAttribute("timeSubmitted"));
}
setPost();

function saveComment(comment, userId, type, commentId) {
	if (type === "comment") {
		new Firebase().writeComment(forum, postId, userId, comment);
	} else if (type === "reply") {
		new Firebase().writeReply(forum, postId, commentId, userId, comment);
	}
	setTimeout((location.href = "02_topic.html"), 0);
}

document.getElementById("comment").onclick = async () => {
	const state = commentBtn.innerHTML;
	const comment = userComment.value;

	if ((userComment.value = "")) alert("Please Type A Comment");
	else {
		if (state === "Post Comment") {
			let user = await new User().getAttribute("username");
			saveComment(comment, user, "comment");
		} else if (state === "Post Reply") {
			let user = await new User().getAttribute("username");
			saveComment(comment, user, "reply", commentWriter.parentElement.getAttribute("id"));
		}
	}
};
