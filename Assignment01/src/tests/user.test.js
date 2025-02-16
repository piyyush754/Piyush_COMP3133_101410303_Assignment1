const request = require('supertest');
const app = require('../server'); // Express app
const User = require('../models/user');
const mongoose = require('mongoose');

// Clear users before tests and close DB connection afterwards
beforeAll(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('User Authentication Tests', () => {
  let token = '';

  describe('Signup', () => {
    test('should fail signup due to missing fields', async () => {
      const query = `
        mutation {
          signup(username: "", email: "invalidemail", password: "123") {
            token
            user {
              id
              username
            }
          }
        }
      `;
      const res = await request(app).post('/graphql').send({ query });
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toContain("Invalid email format");
    });

    test('should successfully sign up a user', async () => {
      const query = `
        mutation {
          signup(username: "testuser", email: "testuser@example.com", password: "password123") {
            token
            user {
              id
              username
            }
          }
        }
      `;
      const res = await request(app).post('/graphql').send({ query });
      expect(res.body.data.signup.token).toBeDefined();
      token = res.body.data.signup.token;
    });
  });

  describe('Login', () => {
    test('should successfully login a user', async () => {
      const query = `
        query {
          login(email: "testuser@example.com", password: "password123") {
            token
            user {
              id
              username
            }
          }
        }
      `;
      const res = await request(app).post('/graphql').send({ query });
      expect(res.body.data.login.token).toBeDefined();
    });

    test('should fail login with incorrect password', async () => {
      const query = `
        query {
          login(email: "testuser@example.com", password: "wrongpassword") {
            token
            user {
              id
              username
            }
          }
        }
      `;
      const res = await request(app).post('/graphql').send({ query });
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toContain("Invalid credentials");
    });
  });
});
