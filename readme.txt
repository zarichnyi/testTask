1. Create locally myqsl server.
2. Open folder "Zarichnyi_test_task".
4. Configure knexfile.js in db folder
3. In main folder open CMD and run "npm install" after that run "node server.js".

EXAMPLES
- Go to http://localhost:3000/ to generate default user data.

- Login GET http://localhost:3000/login
req.body {
    nick_name: "Programmer",
    password: "54321"
}
!!! After Login USE Authorization: "some_token" for getting access to endpoints

- Logout POST http://localhost:3000/logout
- Refresh POST http://localhost:3000/refresh

- GET http://localhost:3000/users - require all users from DB.

- POST http://localhost:3000/user/add - add users to DB.
req.body {
    "name": "Yulia",
    "nick_name": "yulka1223",
    "password": "123456"
    "second_name": "Brashna",
    "department": "IT",
    "role": "admin",
    "work_position": "programmer"
}

- POST http://localhost:3000/user/delete
req.body {
    "nick_name": "yulka1223"
}

- POST http://localhost:3000/user/update
req.body {
    "nick_name": "yulka1223",
    "second_name": "Jarova"
}

- POST http://localhost:3000/user?sort=asc
- POST http://localhost:3000/user?sort=desc
- POST http://localhost:3000/user?sort=asc&from=Wed, 23 Nov 2022 14:24:06 GMT&to=Wed, 23 Nov 2022 14:25:06 GMT

- GET http://localhost:3000/topics - get all topics
- POST http://localhost:3000/topics/add
req.body {
    "title": "New Story",
    "body": "Store tale",
    "summary": "short describe story",
    "user_id": "002"
}

- POST http://localhost:3000/topics/delete
req.body {
    "title": "New Story"
}

- POST http://localhost:3000/topics/update
req.body {
    "title": "New Story",
    "summary": "NEW short describe story"
}

- POST http://localhost:3000/topics?sort=asc
- POST http://localhost:3000/topics?sort=desc
- POST http://localhost:3000/topics?sort=asc&from=Wed, 23 Nov 2022 14:24:06 GMT&to=Wed, 23 Nov 2022 14:25:06 GMT

test comit