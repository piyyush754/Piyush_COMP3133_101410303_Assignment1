const request = require('supertest');
const app = require('../server');
const Employee = require('../models/employee');

describe('Employee Management Tests', () => {
  let authToken = '';

  // Create a user and obtain a token for authentication
  beforeAll(async () => {
    const signupMutation = `
      mutation {
        signup(username: "employeeUser", email: "employee@example.com", password: "password123") {
          token
        }
      }
    `;
    const response = await request(app).post('/graphql').send({ query: signupMutation });
    authToken = response.body.data.signup.token;
  });

  // Tests related to adding an employee
  describe('Add Employee', () => {
    test('should fail without authorization', async () => {
      const addEmployeeMutation = `
        mutation {
          addEmployee(
            first_name: "John",
            last_name: "Doe",
            email: "johndoe@example.com",
            gender: "Male",
            designation: "Engineer",
            salary: 5000,
            date_of_joining: "2023-05-01",
            department: "IT"
          ) {
            id
            first_name
            email
          }
        }
      `;
      const res = await request(app)
        .post('/graphql')
        .send({ query: addEmployeeMutation });
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toContain("Unauthorized");
    });

    test('should succeed with valid authorization', async () => {
      const addEmployeeMutation = `
        mutation {
          addEmployee(
            first_name: "John",
            last_name: "Doe",
            email: "johndoe@example.com",
            gender: "Male",
            designation: "Engineer",
            salary: 5000,
            date_of_joining: "2023-05-01",
            department: "IT"
          ) {
            id
            first_name
            email
          }
        }
      `;
      const res = await request(app)
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ query: addEmployeeMutation });
      expect(res.body.data.addEmployee.id).toBeDefined();
      expect(res.body.data.addEmployee.email).toBe("johndoe@example.com");
    });
  });

  // Tests related to fetching employees
  describe('Get Employees', () => {
    test('should fetch all employees with authorization', async () => {
      const getAllQuery = `
        query {
          getAllEmployees {
            id
            first_name
            email
          }
        }
      `;
      const res = await request(app)
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ query: getAllQuery });
      expect(Array.isArray(res.body.data.getAllEmployees)).toBe(true);
      expect(res.body.data.getAllEmployees.length).toBeGreaterThan(0);
    });

    test('should fail fetching employees without authorization', async () => {
      const getAllQuery = `
        query {
          getAllEmployees {
            id
            first_name
            email
          }
        }
      `;
      const res = await request(app)
        .post('/graphql')
        .send({ query: getAllQuery });
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].message).toContain("Unauthorized");
    });
  });
});
