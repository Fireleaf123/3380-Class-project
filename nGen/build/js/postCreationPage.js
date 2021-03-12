import { Forum, Post } from "./content_mngr.js";

//if any item in the list has is blank, has no value, it returns false
function allFieldsFilled(list) {
	return !list.includes("");
}

function savePost(userId) {
	let title = document.getElementById("post_title").value;
	let forum = document.getElementById("select_field").value;
	let content = document.getElementById("post_content").value;

	let page = new Forum(forum);

	if (allFieldsFilled([title, forum, content])) {
		page.writePost(userId, title, content);
		setInterval(() => {
			location.href = "index.html";
		}, 0); //sends user back to homepage after post creation
	} else {
		alert("Please Fill Out All Fields");
	}
}
document.getElementById("submit").onclick = () => {
	savePost("baboya");
};

function saveComment(userId, field, postId) {
	let comment = document.getElementById("reply").value;
	console.log(comment);
	const dataHandler = new Forum("Vibin");

	dataHandler.writeComment(userId, comment, field, postId);
}
