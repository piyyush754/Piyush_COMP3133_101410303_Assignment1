require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { ApolloServer } = require("apollo-server-express");
const jwt = require("jsonwebtoken");

const connectDB = require("./config/database");
const schema = require("./graphql/schema"); // Combined schema

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

async function startApolloServer() {
  const server = new ApolloServer({
    schema,
    context: ({ req }) => {
      const authHeader = req.headers.authorization || "";
      let user = null;
      if (authHeader.startsWith("Bearer ")) {
        const token = authHeader.split(" ")[1];
        try {
          user = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
          console.warn("Invalid token:", error.message);
        }
      }
      return { user };
    },
  });

  await server.start();
  server.applyMiddleware({ app, path: "/graphql" });

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`GraphQL endpoint: http://localhost:${PORT}/graphql`);
  });
}

startApolloServer();
