const socket = io("http://localhost:3000");
let username = "65fc5b6a7761945d9ab3c1f4";
let uid = "65fc5b6a7761945d9ab3c1f4";

socket.emit("sendall");

socket.on("uid", (id) => {
  uid = id;
});


document.getElementById("create_user").addEventListener("click", () => {
  socket.emit("test", document.getElementById("username").value);
});

document.getElementById("button").addEventListener("click", () => {
  socket.emit("inital_req", username);
});

document.getElementById("form").addEventListener("submit", (event) => {
  event.preventDefault();
  username = document.getElementById("username").value;
  description = document.getElementById("description").value;
  comment = document.getElementById("comment").value;
  image = document.getElementById("photo").files[0];
  socket.emit("post", username, description, comment, image);
});

socket.on("initial_post", (data) => {
  data.forEach((post) => {
    let parent = document.getElementById("posts");
    let name_sec = document.createElement("p");
    let time = document.createElement("p");
    let description = document.createElement("p");
    let image = document.createElement("img");
    let comment = document.createElement("select");
    let container = document.createElement("div");
    let title = document.createElement("p");
    name_sec.innerHTML = post.uploader;
    title.innerHTML = post._id;
    time.innerHTML = post.time;
    description.innerHTML = post.description;
    post.comments.forEach((comment_) => {
      let option = document.createElement("option");
      option.id = comment_._id;
      option.value = comment_.comment;
      option.text = comment_.comment;
      comment.appendChild(option);
    });
    comment.style.zIndex = 99;
    container.id = post._id;
    hr = document.createElement("hr");
    container.appendChild(name_sec);
    container.appendChild(title);
    container.appendChild(time);
    container.appendChild(description);
    if (post.media) {
      image.src = `data:image/png;base64,${post.media}`;
      container.append(image);
    }
    container.appendChild(comment);
    container.appendChild(hr);
    container.addEventListener("click", (event) => {
      document.getElementById("post_id").value = container.id;
    });
    parent.appendChild(container);
  });

});

let userlist_parent = document.getElementById("users");
socket.on("users", (users) => {
  userlist_parent.innerHTML = "";
  users.forEach((user) => {
    let a = document.createElement("input");
    a.type = "button";
    a.id = user._id;
    a.name = user.name;
    a.value = user.name;
    let b = document.createElement("input");
    b.type = "button";
    b.id = user._id;
    b.value = "+";
    b.addEventListener("click", (event) => {
      event.preventDefault();
      socket.emit("add_friend", uid, b.id);
    });
    a.addEventListener("click", (event) => {
      event.preventDefault();
      username = a.id;
      document.getElementById("username").value = username;
      socket.emit("ready", a.name);
    });
    userlist_parent.appendChild(a);
    userlist_parent.appendChild(b);
  });
  document.getElementById("json").innerHTML = JSON.stringify(users);
});
socket.on("exist", () => {
});
friendlist_parent = document.getElementById("friends");
socket.on("friends", (friends) => {
  friends.friends.forEach((friend) => {
    let a = document.createElement("input");
    a.type = "button";
    a.style.color = "blue";
    a.id = friend._id;
    a.name = friend.name;
    a.value = friend.name;
    a.addEventListener("click", (event) => {
      event.preventDefault();
      document.getElementById("commentor").value = a.name;
    });
    friendlist_parent.appendChild(a);
  });
});

document.getElementById("post_comment").addEventListener("click", (event) => {
  event.preventDefault();
  comment = document.getElementById("comment").value;
  commentor = document.getElementById("commentor").value;
  post = document.getElementById("post_id").value;
  socket.emit("comment", post, commentor, comment);
});
