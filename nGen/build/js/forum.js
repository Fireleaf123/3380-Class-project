import { Forum , Post} from "./content_mngr.js";
const page = document.title
const postArea = document.getElementById('postArea')

function showPosts(){
	let p = new Forum(page).getAllPosts(postArea)
}

showPosts();





