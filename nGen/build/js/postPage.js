import {Post,Forum} from './content_mngr.js'
const post = new Post('Arts','-MVXzImDpP0hxvluFntz');
const title = document.getElementById('title');
const content = document.getElementById('content');
const timeSubmitted = document.getElementById('timeCreated');
const commentArea = document.getElementById('comments');


function showComments(){
    post.getAllComments(commentArea);
}showComments();

function setForm(){
    title.value =  post.getTitle();
    content.value =  post.getContent();
    timeSubmitted.value = post.getTimeSubmitted();
}setForm()

function saveComment(userId) {
	const comment = document.getElementById("reply").value;
    post.writeComment(comment);

}

document.getElementById("comment").onclick = () => {
	saveComment('baboya');
};

