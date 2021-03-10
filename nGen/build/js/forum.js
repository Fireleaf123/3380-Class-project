import { Forum } from "./content_mngr.js";

function createPosts(forum) {
	let page = new Forum(forum);
	page.getAllPosts();
	console.log('hello')
}

createPosts("Vibin");
