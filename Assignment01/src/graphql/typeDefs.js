const { gql } = require("apollo-server-express");

const typeDefs = gql`
  """
  User type definition
  """
  type User {
    id: ID!
    username: String!
    email: String!
    password: String!
    created_at: String
    updated_at: String
  }

  """
  Employee type definition
  """
  type Employee {
    id: ID!
    first_name: String!
    last_name: String!
    email: String!
    gender: String
    designation: String!
    salary: Float!
    date_of_joining: String
    department: String!
    employee_photo: String
    created_at: String
    updated_at: String
  }

  """
  Auth payload for successful signup or login
  """
  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    """
    Public: login by username/email and password
    """
    login(usernameOrEmail: String!, password: String!): AuthPayload

    """
    Auth required: get a list of all employees
    """
    getAllEmployees: [Employee!]!

    """
    Auth required: get a single employee by ID
    """
    getEmployeeById(eid: ID!): Employee

    """
    Auth required: search employees by designation or department
    """
    searchEmployees(designation: String, department: String): [Employee!]!
  }

  type Mutation {
    """
    Public: create a new user account
    """
    signup(username: String!, email: String!, password: String!): AuthPayload

    """
    Auth required: add a new employee
    """
    addEmployee(
      first_name: String!
      last_name: String!
      email: String!
      gender: String
      designation: String!
      salary: Float!
      date_of_joining: String
      department: String!
      employee_photo: String
    ): Employee

    """
    Auth required: update employee by ID
    """
    updateEmployee(
      eid: ID!
      first_name: String
      last_name: String
      email: String
      gender: String
      designation: String
      salary: Float
      date_of_joining: String
      department: String
      employee_photo: String
    ): Employee

    """
    Auth required: delete employee by ID
    """
    deleteEmployee(eid: ID!): Boolean
  }
`;

module.exports = typeDefs;
