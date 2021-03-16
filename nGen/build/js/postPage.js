import { Post,Forum } from "./content_mngr.js";

const title = document.getElementById("title");
const content = document.getElementById("content");
const timeSubmitted = document.getElementById("timeCreated");
const commentArea = document.getElementById("comments");
const forum = "Arts";
const postId = "-MVnkqsze9meTKVFAAFY";
//const post = await getPost();
const userComment = document.getElementById("reply");



function showPosts(){
	let p = new Forum(forum).getAllComments(commentArea,postId)
}

showPosts();
