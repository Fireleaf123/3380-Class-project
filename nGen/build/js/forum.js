import { Forum, PostFactory} from "./cont_mngr.js";


//page is the title of the page, which should be same, spelling and all, as the reference in the database
const page = document.title;
const postArea = document.getElementById('postArea');
const FORUM = new Forum(page);

new PostFactory(postArea,page).displayPosts();

