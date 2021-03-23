import { Post, Forum, Comment} from "./cont_mngr.js";
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
//const COMMENT = new Comment(forum,postId,)

console.log(POST.getParent(),POST.getId())
console.log(POST.getAttribute('title'));

async function setPost(){
	user.innerHTML = await POST.getAttribute('userId');
	title.innerHTML = await POST.getAttribute('title');
	content.innerHTML = await POST.getAttribute('content');
	timeSubmitted.innerHTML = await POST.getAttribute('timeSubmitted');
}
setPost();



function createComments(cont, userId, comment, timeSubmitted, id, type) {
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
		cont.appendChild(mainCont);
	} else if (type === "reply") {
		cont.appendChild(container);
	}
}

function saveComment(comment, userId, type, commentId) {
	if (type === "comment") {
		console.log(type, comment);
		POST.writeComment(userId, comment);
	} else if (type === "reply") {
	
		//console.log(type, comment);
		//POST.writeReply(userId, comment, commentId);
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

