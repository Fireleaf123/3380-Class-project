import { FlagFactory, PostFactory } from "./content_mngr.js";
/**
 * This js file is used by al forums to display the appropiate posts
 * for said forum.
 */

const page = document.title; //title of the page currently on

const postArea = document.getElementById("postArea"); //container for the posts to be dispalyed

/**
 * container for the flagged comments
 * only exists, and used by mod_tools.html
 */
const commentArea = document.getElementById("commentArea");

const mod_post = document.getElementById("posts-title"); //title div
const mod_comments = document.getElementById("comments-title"); //title div

/**
 * if, on Mod Dashboard
 * 	--> display the flagged posts in postArea
 * 	--> display the flagged comments in commentsArea
 * else, we are on a forum
 * 	--> display the posts of the database location with name {page}
 */
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

