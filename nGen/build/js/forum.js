import { Forum , Post} from "./content_mngr.js";

//page is the title of the page, which should be same, spelling and all, as the reference in the database
const page = document.title
//location on the page to paste the posts
const postArea = document.getElementById('postArea')

//gets all the posts for forum{page} and pastes them into {postArea}
function showPosts(){
	let p = new Forum(page).getAllPosts(postArea)
}

showPosts();





