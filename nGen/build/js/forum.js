import {FlagFactory,PostFactory} from "./content_mngr.js";

//page is the title of the page, which should be same, spelling and all, as the reference in the database
const page = document.title;
const postArea = document.getElementById("postArea");
const commentArea = document.getElementById("commentArea");

if (page === "Mod Dashboard") {
	new FlagFactory(commentArea).displayComments();
    new FlagFactory(postArea).displayPosts();
} else {
	new PostFactory(postArea, page).displayPosts();
}


async function getData(){

}