# Diff Details

Date : 2024-06-21 18:24:32

Directory d:\\fullstack\\server

Total : 43 files,  -2680 codes, 45 comments, -68 blanks, all -2703 lines

[Summary](results.md) / [Details](details.md) / [Diff Summary](diff.md) / Diff Details

## Files
| filename | language | code | comment | blank | total |
| :--- | :--- | ---: | ---: | ---: | ---: |
| [client/.eslintrc.cjs](/client/.eslintrc.cjs) | JavaScript | -21 | 0 | -1 | -22 |
| [client/index.html](/client/index.html) | HTML | -14 | -2 | -1 | -17 |
| [client/package-lock.json](/client/package-lock.json) | JSON | -4,333 | 0 | -1 | -4,334 |
| [client/package.json](/client/package.json) | JSON | -28 | 0 | -1 | -29 |
| [client/public/vite.svg](/client/public/vite.svg) | XML | -1 | 0 | 0 | -1 |
| [client/src/App.jsx](/client/src/App.jsx) | JavaScript JSX | -76 | -6 | -6 | -88 |
| [client/src/Comment/Comment.jsx](/client/src/Comment/Comment.jsx) | JavaScript JSX | -26 | 0 | -3 | -29 |
| [client/src/Comment/Comment.module.css](/client/src/Comment/Comment.module.css) | CSS | -32 | 0 | -5 | -37 |
| [client/src/Friendlist/friend_list.jsx](/client/src/Friendlist/friend_list.jsx) | JavaScript JSX | -86 | -4 | -3 | -93 |
| [client/src/Friendlist/friend_list.module.css](/client/src/Friendlist/friend_list.module.css) | CSS | -6 | 0 | 0 | -6 |
| [client/src/Login/login.jsx](/client/src/Login/login.jsx) | JavaScript JSX | -40 | -1 | -7 | -48 |
| [client/src/Post/post.jsx](/client/src/Post/post.jsx) | JavaScript JSX | -146 | -6 | -9 | -161 |
| [client/src/Post/post.module.css](/client/src/Post/post.module.css) | CSS | -25 | 0 | -4 | -29 |
| [client/src/Register/register.jsx](/client/src/Register/register.jsx) | JavaScript JSX | -25 | 0 | -8 | -33 |
| [client/src/commentSection/CommentSection.jsx](/client/src/commentSection/CommentSection.jsx) | JavaScript JSX | -41 | -17 | -4 | -62 |
| [client/src/commentSection/CommentSection.module.css](/client/src/commentSection/CommentSection.module.css) | CSS | -32 | -1 | -4 | -37 |
| [client/src/dropDown/dropdown.jsx](/client/src/dropDown/dropdown.jsx) | JavaScript JSX | -36 | 0 | -3 | -39 |
| [client/src/dropDown/dropdown.module.css](/client/src/dropDown/dropdown.module.css) | CSS | -3 | 0 | -1 | -4 |
| [client/src/index.css](/client/src/index.css) | CSS | -61 | 0 | -8 | -69 |
| [client/src/main.jsx](/client/src/main.jsx) | JavaScript JSX | -9 | 0 | -2 | -11 |
| [client/src/postContainer/post_container.jsx](/client/src/postContainer/post_container.jsx) | JavaScript JSX | -153 | -2 | -9 | -164 |
| [client/src/postContainer/post_container.module.css](/client/src/postContainer/post_container.module.css) | CSS | -6 | 0 | -1 | -7 |
| [client/src/reactionBtn/dislike_btn.jsx](/client/src/reactionBtn/dislike_btn.jsx) | JavaScript JSX | -46 | -3 | -2 | -51 |
| [client/src/reactionBtn/like_btn.jsx](/client/src/reactionBtn/like_btn.jsx) | JavaScript JSX | -42 | -2 | -3 | -47 |
| [client/src/reactionBtn/reaction.module.css](/client/src/reactionBtn/reaction.module.css) | CSS | -18 | 0 | -3 | -21 |
| [client/src/searchBox/search_box.jsx](/client/src/searchBox/search_box.jsx) | JavaScript JSX | -30 | 0 | -6 | -36 |
| [client/src/searchBox/search_box.module.css](/client/src/searchBox/search_box.module.css) | CSS | -13 | 0 | -2 | -15 |
| [client/src/socket.js](/client/src/socket.js) | JavaScript | -2 | -2 | -2 | -6 |
| [client/src/usernameWithProfile/username_with_pofile.jsx](/client/src/usernameWithProfile/username_with_pofile.jsx) | JavaScript JSX | -20 | 0 | -3 | -23 |
| [client/src/usernameWithProfile/username_with_profile.module.css](/client/src/usernameWithProfile/username_with_profile.module.css) | CSS | -14 | -1 | -2 | -17 |
| [client/vite.config.js](/client/vite.config.js) | JavaScript | -5 | -1 | -2 | -8 |
| [server/database.js](/server/database.js) | JavaScript | 9 | 0 | 2 | 11 |
| [server/index.js](/server/index.js) | JavaScript | 21 | 0 | 3 | 24 |
| [server/middlewares/friends_validator.js](/server/middlewares/friends_validator.js) | JavaScript | 14 | 24 | 3 | 41 |
| [server/middlewares/user_validator.js](/server/middlewares/user_validator.js) | JavaScript | 1 | 0 | 2 | 3 |
| [server/middlewares/verifying_online_stuff.js](/server/middlewares/verifying_online_stuff.js) | JavaScript | 0 | 0 | 1 | 1 |
| [server/models/comment.model.js](/server/models/comment.model.js) | JavaScript | 23 | 0 | 4 | 27 |
| [server/models/post.model.js](/server/models/post.model.js) | JavaScript | 39 | 0 | 3 | 42 |
| [server/models/reaction.model.js](/server/models/reaction.model.js) | JavaScript | 16 | 0 | 2 | 18 |
| [server/models/users.model.js](/server/models/users.model.js) | JavaScript | 18 | 0 | 4 | 22 |
| [server/package-lock.json](/server/package-lock.json) | JSON | 1,936 | 0 | 1 | 1,937 |
| [server/package.json](/server/package.json) | JSON | 23 | 0 | 1 | 24 |
| [server/socket.handler.js](/server/socket.handler.js) | JavaScript | 610 | 69 | 12 | 691 |

[Summary](results.md) / [Details](details.md) / [Diff Summary](diff.md) / Diff Details