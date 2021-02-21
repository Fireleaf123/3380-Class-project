class search{

}

class content{

}

class readWrite{
    
}

function write(userId){
    const database = firebase.database();

    let title = document.getElementById('post_title').value;
    let field = document.getElementById('select_field').value;
    let content = document.getElementById('post_content').value;

    database.ref('post/' + userId).set({
        userId: userId,
        title: title,
        forum: field,
        content: content,
      });
      
    return true;
}

function sendData(userId){
   write(userId);
   setInterval(() => {location.href = 'index.html';},1000);
}