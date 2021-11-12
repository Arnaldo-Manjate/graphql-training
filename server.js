const express = require("express");
const cors = require("cors");
const { graphqlHTTP } = require("express-graphql");
const { schema } = require("./queries");
const port = 5000;

const api = express();
api.use(cors());

api.use(
  "/graphql",
  graphqlHTTP({
    graphiql: true,
    schema: schema,
  })
);

api.listen(port, () => console.log(`Listening on port ${port} 😁`));
