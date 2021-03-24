import { Post, Comment, CommentFactory } from "./cont_mngr.js";
import { Cookie } from "./cookies.js";

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
		console.log(type, comment);
		POST.writeComment(userId, comment);
	} else if (type === "reply") {
		new Comment(forum, postId, commentId).writeReply(userId, comment);
	}
}

document.getElementById("comment").onclick = () => {
	const state = commentBtn.innerHTML;
	const comment = userComment.value;

	if ((userComment.value = "")) alert("Please Type A Comment");
	else {
		if (state === "Post Comment") {
			saveComment(comment, "baboya", "comment");
		} else if (state === "Post Reply") {
			saveComment(comment, "baboya", "reply", commentWriter.parentElement.getAttribute("id"));
		}
	}
};
