Demo project setup

1. Install dependencies
```npm install```
2. Start server
```npm start```

3. Go by link
```localhost:1428/api/user```

4. Routes

    4.1. ```http://localhost:1428/``` renders index.html from public folder
    
    4.2. ```http://localhost:1428/api/user``` get array of all users
    
    4.3. ```http://localhost:1428/api/user/:id``` get user by id 
    
    4.4. ```http://localhost:1428/api/message``` get all messages
    
    4.5. ```http://localhost:1428/api/message/:id/``` get all messages with senderId
    
    4.6. ```http://localhost:1428/api/connected/``` respond with `'connected route'`
    
    4.7. ```http://localhost:1428/api/connected/:id``` get all users which wrote to `/:id`

5. Postman collection for tests with examples

    **[Request Collection](https://www.getpostman.com/collections/de5848f4c43b8a4a101b)**