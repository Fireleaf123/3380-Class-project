import { Forum } from "./content_mngr.js";
import { User } from "./User.js";

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
		setTimeout(() => {
			location.href = "index.html";
		}, 0); //sends user back to homepage after post creation
	} else {
		alert("Please Fill Out All Fields");
	}
}
document.getElementById("submit").onclick = () => {
	new User().getAttribute('username').then( user => {savePost(user)});
};

  

