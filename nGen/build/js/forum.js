import { Forum, PostFactory} from "./content_mngr.js";


//page is the title of the page, which should be same, spelling and all, as the reference in the database
const page = document.title;
const postArea = document.getElementById('postArea');

if(page === 'Mod Dashboard'){
    postArea.innerHTML = "FLAGGED POSTS!"
}else{
    const FORUM = new Forum(page);

new PostFactory(postArea,page).displayPosts();
}

