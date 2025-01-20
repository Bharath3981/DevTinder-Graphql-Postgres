const { connectToDB } = require("./config/database");
const { ApolloServer } = require("@apollo/server");
const {
  ApolloServerPluginDrainHttpServer,
} = require("@apollo/server/plugin/drainHttpServer");
const { expressMiddleware } = require("@apollo/server/express4");
const http = require("http");
const cookieParser = require("cookie-parser");
const express = require("express");
const { typeDefs, resolvers } = require("./helper/typedefs");
const app = express();

app.use(express.json());
app.use(cookieParser());

const httpServer = http.createServer(app);
const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

async function startServer() {
  await server.start();
  connectToDB().then(async (res) => {
    app.use(
      "/",
      express.json(),
      expressMiddleware(server, {
        context: async ({ req, res }) => {
          return {
            res: res,
            req: req,
          };
        },
      })
    );
    httpServer.listen(4000, () => {
      console.log("Server is running on http://localhost:4000/");
    });
  });
}

startServer();
