import { FlagFactory, PostFactory } from "./content_mngr.js";

//page is the title of the page, which should be same, spelling and all, as the reference in the database
const page = document.title;
const postArea = document.getElementById("postArea");
const commentArea = document.getElementById("commentArea");
const mod_post = document.getElementById("posts-title");
const mod_comments = document.getElementById("comments-title");

if (page === "Mod Dashboard") {
	new FlagFactory(commentArea).displayComments();
	new FlagFactory(postArea).displayPosts();
	setTimeout(() => {
		if (postArea.childNodes.length > 0) {
			mod_post.style.visibility = "visible";
		}
		if (commentArea.childNodes.length > 0) {
			mod_comments.style.visibility = "visible";
		}
	}, 1000);
} else {
	new PostFactory(postArea, page).displayPosts();
}

async function getData() {}
