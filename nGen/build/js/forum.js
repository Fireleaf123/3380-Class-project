import { Forum , Post} from "./content_mngr.js";
const page = document.title



function showPosts(){
	let p = new Forum(page).getAllPosts()
}

showPosts();





