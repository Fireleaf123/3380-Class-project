import { Post, Comment, CommentFactory, Firebase, Flag } from "./content_mngr.js";
import { Cookie } from "./cookies.js";
import { User } from "./User.js";
/**
 * containers for post data
 */
const user = document.getElementById("user");
const title = document.getElementById("title");
const content = document.getElementById("content");
const timeSubmitted = document.getElementById("timeCreated");

/**
 * containers for comments for the current post being displayed
 */
const commentArea = document.getElementById("comments");
const commentWriter = document.getElementById("writeCoR");
const commentBtn = document.getElementById("commentBtn");
const userComment = document.getElementById("reply");

/**
 * this page loads different posts based the cookies {forum} and {postId}
 * these cookies are set when a post is clicked, the id of the post and the forum its from is saved as cookies
 */
const forum = new Cookie().getCookie("forum");
const postId = new Cookie().getCookie("postId");

/**
 * initializing a new Post object using the location data passed
 */
const POST = new Post(forum, postId);

/**
 * Firebase object that has functions that allow users to write a number of things
 * comments, and replies on this page being some of them
 */
let FIRE = new Firebase();

new CommentFactory(commentArea, POST).displayComments();

async function setPost() {
	/**
	 * based on the current post, save its data to this containers
	 */
	user.innerHTML = await POST.getAttribute("userId");
	title.innerHTML = await POST.getAttribute("title");
	content.innerHTML = await POST.getAttribute("content");
	timeSubmitted.innerHTML = '<i class="fa fa-clock-o"></i> ' + new Date(await POST.getAttribute("timeSubmitted"));
}
setPost();
/**
 * saves a user's comment or reply based on the passed parameters
 * used for both comments and replies,  difference is ntoed by the type parameter
 * @param {string} comment, the comment/reply
 * @param {string} userId , the user who made the comment
 * @param {string} type, comment or reply
 * @param {string} commentId , id of parent comment, used to know parent of the reply
 */
function saveComment(comment, userId, type, commentId) {
	if (type === "comment") {
		new Firebase().writeComment(forum, postId, userId, comment);
	} else if (type === "reply") {
		new Firebase().writeReply(forum, postId, commentId, userId, comment);
	}
	setTimeout((location.href = "02_topic.html"), 0);
}

/**
 * saves the value of the comment-box on click
 * used for both comments and replies, the container is moved to the parent comment when reply is clicked
 */
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

/**
 * sets onclick for the report btn
 */
document.getElementById("report-post").onclick = function () {
	/**
	 * creates anew item in the table FlaggedContent with the locaiton of the given post
	 */
	FIRE.flagPost(postId, forum);
	//setTimeout((location.href = "index.html"), 0);
};

/**
 * gets the current user, and if they are a mod,
 * display admin tools to remove or unflag posts
 */
const role = await new User().getAttribute("userrole");
if (role === "Moderator") {
	document.getElementById("unflag-post").style.visibility = "visible";
	document.getElementById("unflag-post").onclick = function () {
		new Flag().deleteFlag("postId", postId);
		//setTimeout((location.href = "index.html"), 0);
	};
	document.getElementById("delete-post").style.visibility = "visible";
	document.getElementById("delete-post").onclick = function () {
		new Flag().delete(forum, postId);
		//setTimeout((location.href = "index.html"), 0);
	};
}
