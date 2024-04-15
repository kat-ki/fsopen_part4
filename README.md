# Blog Backend

### FullstackOpen. Part 4

This is a small backend project for a blog application, built using Node.js and Express, Mongoose and tests for API
endpoints written using Supertest. It provides RESTful API endpoints to manage blogs. Blogs can be added or deleted only
by users who created that blogs. Token authentication using JWT is also available.

### Prerequisites:

- Node.js
- Express
- npm
- Mongoose
- Supertest

## Usage:

- GET /api/blogs: Get all blogs.
- GET /api/blog/:id: Get a specific blog by ID
- POST /api/users: Create a new user. 
- PUT /api/users/:id: Update info of a specific user by ID. 
- DELETE /api/users/:id:
  Delete a specific user by ID. 
- POST /api/login: Log in feature incl. validation