# Piyush_COMP3133_101410303_Assignment1

# Employee Management API

This project is a GraphQL-based Employee Management API built with Express, MongoDB, and Apollo Server. It supports user authentication (signup and login) and provides CRUD operations for employee data.

## Features

- User Authentication: Sign up and login with JWT-based authentication.
- Employee Management: Add, update, delete, and search employee records.
- Secure Endpoints: Protected operations require a valid JWT token.

## Setup

Prerequisites:

- Node.js and npm installed.
- A MongoDB database (MongoDB Atlas or a local instance).

Installation:

1. Clone the Repository:
   git clone https://github.com/yourusername/your-repo.git
   cd your-repo

2. Install Dependencies:
   npm install

3. Configure Environment Variables:
   Create a .env file in the project root (use .env.example as a guide) and add:

   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=4000

## Running the Server

Start the server with:

npm start

The API will be available at:
http://localhost:4000/graphql

## Testing the API

GraphQL Playground:

- Open your browser and navigate to http://localhost:4000/graphql.
- Use the Playground to run queries and mutations (e.g., signup, login, addEmployee, getAllEmployees).

Automated Tests:

- Run tests with:
  npm test

Postman Collection:

- An exported Postman collection (EmployeeManagementAPI.postman_collection.json) is included.
- Import it into Postman to test the API endpoints.

## Sample User for Testing

Use the following credentials to test the login endpoint:

Email: testuser@example.com
Password: password123

(Note: This user is created via the signup mutation in the tests.)

## Project Structure

config/

- database.js # Database connection setup
  graphql/
- resolver.js # GraphQL resolvers
- schema.js # GraphQL schema (merged)
  models/
- user.js # User model
- employee.js # Employee model
  tests/
- user.test.js # User authentication tests
- employee.test.js # Employee management tests
  .env.example # Sample environment variables
  server.js # Express server & Apollo configuration
  package.json
  README.md

## Additional Notes

- Exclude the node_modules folder from your submission ZIP.
- GitHub Repository: https://github.com/yourusername/your-repo
- For any issues or questions, please open an issue on GitHub.

## License

This project is licensed under the MIT License.
