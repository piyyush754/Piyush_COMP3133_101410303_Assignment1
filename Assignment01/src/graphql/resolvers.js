const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Employee = require("../models/employee");

// Helper function to check if a user is logged in
const requireAuth = (user) => {
  if (!user) {
    throw new Error("Unauthorized! Please provide a valid token.");
  }
};

module.exports = {
  Query: {
    // Public: Log in user using username or email along with password
    login: async (_, { usernameOrEmail, password }) => {
      try {
        // Try to find the user by username; if not found, try by email
        const user =
          (await User.findOne({ username: usernameOrEmail })) ||
          (await User.findOne({ email: usernameOrEmail }));
        if (!user) {
          throw new Error("User not found");
        }

        // Validate the password
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
          throw new Error("Invalid password");
        }

        // Create a JWT token valid for 1 day
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
          expiresIn: "1d",
        });

        return { token, user };
      } catch (err) {
        throw new Error(err.message);
      }
    },

    // Auth required: Retrieve all employees
    getAllEmployees: async (_, __, { user }) => {
      requireAuth(user);
      return Employee.find({});
    },

    // Auth required: Get a single employee by ID
    getEmployeeById: async (_, { eid }, { user }) => {
      requireAuth(user);
      const employee = await Employee.findById(eid);
      if (!employee) {
        throw new Error("Employee not found");
      }
      return employee;
    },

    // Auth required: Search employees by designation and/or department
    searchEmployees: async (_, { designation, department }, { user }) => {
      requireAuth(user);
      const query = {};
      if (designation) query.designation = designation;
      if (department) query.department = department;
      return Employee.find(query);
    },
  },

  Mutation: {
    // Public: Sign up a new user
    signup: async (_, { username, email, password }) => {
      try {
        // Check if the user already exists
        const existingUser = await User.findOne({
          $or: [{ username }, { email }],
        });
        if (existingUser) {
          throw new Error("User already exists with provided username/email");
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and save the new user
        const newUser = new User({
          username,
          email,
          password: hashedPassword,
          created_at: new Date(),
          updated_at: new Date(),
        });
        await newUser.save();

        // Generate JWT for the new user
        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
          expiresIn: "1d",
        });

        return { token, user: newUser };
      } catch (err) {
        throw new Error(err.message);
      }
    },

    // Auth required: Add a new employee
    addEmployee: async (
      _,
      { first_name, last_name, email, gender, designation, salary, date_of_joining, department, employee_photo },
      { user }
    ) => {
      requireAuth(user);

      if (salary < 1000) {
        throw new Error("Salary must be at least 1000");
      }

      // Create a new employee record
      const employee = new Employee({
        first_name,
        last_name,
        email,
        gender,
        designation,
        salary,
        date_of_joining: date_of_joining || new Date(),
        department,
        employee_photo: employee_photo || "",
        created_at: new Date(),
        updated_at: new Date(),
      });

      return employee.save();
    },

    // Auth required: Update an existing employee
    updateEmployee: async (
      _,
      { eid, first_name, last_name, email, gender, designation, salary, date_of_joining, department, employee_photo },
      { user }
    ) => {
      requireAuth(user);

      const employee = await Employee.findById(eid);
      if (!employee) {
        throw new Error("Employee not found");
      }

      // Update fields if new values are provided
      if (first_name !== undefined) employee.first_name = first_name;
      if (last_name !== undefined) employee.last_name = last_name;
      if (email !== undefined) employee.email = email;
      if (gender !== undefined) employee.gender = gender;
      if (designation !== undefined) employee.designation = designation;
      if (salary !== undefined) {
        if (salary < 1000) {
          throw new Error("Salary must be at least 1000");
        }
        employee.salary = salary;
      }
      if (date_of_joining !== undefined) employee.date_of_joining = date_of_joining;
      if (department !== undefined) employee.department = department;
      if (employee_photo !== undefined) employee.employee_photo = employee_photo;

      employee.updated_at = new Date();
      return employee.save();
    },

    // Auth required: Delete an employee by ID
    deleteEmployee: async (_, { eid }, { user }) => {
      requireAuth(user);

      const deletedEmployee = await Employee.findByIdAndDelete(eid);
      if (!deletedEmployee) {
        throw new Error("Employee not found");
      }
      return true;
    },
  },
};
