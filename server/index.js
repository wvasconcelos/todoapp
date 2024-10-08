const express = require('express');
require('dotenv').config(); //activates dotenv
const cors = require('cors');
const { graphqlHTTP } = require('express-graphql'); //activates graphql (1/2)
const schema = require('./schema');
const app = express();
const port = process.env.PORT || 8000;
const connectDB = require('./db')
connectDB();
app.use(cors());
app.use('/graphql', graphqlHTTP({
	schema,
	graphiql: process.env.NODE_ENV === 'development'
})) //activates graphql (2/2)
app.listen(port, console.log(`server running on port ${port}`))
