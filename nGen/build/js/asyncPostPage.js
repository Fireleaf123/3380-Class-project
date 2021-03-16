const title = document.getElementById("title");
const content = document.getElementById("content");
const timeSubmitted = document.getElementById("timeCreated");
const commentArea = document.getElementById("comments");

const forum = "Arts";
const postId = "-MVnkqsze9meTKVFAAFY";
const post = await getPost();
const userComment = document.getElementById("reply");

function getPost() {
	return new Promise(function (resolve, reject) {
		firebase
			.database()
			.ref(`${forum}/posts/${postId}`)
			.on("value", (post) => {
				resolve(post.val());
			});
	});
}

function setForm() {
	title.innerHTML = post.title;
	content.innerHTML = post.content;
	timeSubmitted.innerHTML = '<i class="fa fa-clock-o"></i> ' + new Date(post.timeSubmitted);
}
setForm();

function showComments() {
	let comments = post.comments;
	for (let c in comments) {
        let comment  =  comments[c];
        createComments(commentArea,comment.userId,comment.comment,comment.timeSubmitted);
	}
}
showComments();

function writeComment(userId, comment) {
	let newKey = firebase.database().ref().push().key;
	console.log(newKey)
	firebase.database().ref(`${forum}/posts/${postId}/comments/${newKey}`).set({
		userId: userId,
		comment: comment,
		timeSubmitted: Date.now()
	});
}


function createComments(commentArea, userId, comment, timeSubmitted) {
	let container = document.createElement("div");
	let userBox = document.createElement("div");
	let commentBox = document.createElement("div");
	let timeBox = document.createElement("div");

	container.setAttribute("id", "commentBox");
	container.classList.add("post");

	userBox.setAttribute("id", "user");
	userBox.classList.add("commentContent");
	userBox.innerHTML = `<strong>${userId}</strong>`;

	commentBox.setAttribute("id", "userComment");
	commentBox.classList.add("commentContent");
	commentBox.innerHTML = `<p>${comment}</p>`;

	timeBox.setAttribute("id", "userTimeSub");
	timeBox.classList.add("commentContent");
	timeBox.innerHTML = '<i class="fa fa-clock-o"></i> ' + new Date(post.timeSubmitted);

	container.appendChild(userBox);
	container.appendChild(commentBox);
	container.appendChild(timeBox);

	commentArea.appendChild(container);
}

function saveComment(userId) {
	console.log(userComment.value);
    writeComment(userId, userComment.value);
}

document.getElementById("comment").onclick = () => {
	saveComment('baboya');
};
