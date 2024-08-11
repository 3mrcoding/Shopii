const app = require('./app');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const port = process.env.PORT || 3000;

// Define Environment Variables
dotenv.config({ path: './config.env' });

// Connecting DataBase
const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);
mongoose.connect(DB).then(() => {
  console.log('Connected to MongoDB');
});

//Connecting Server
const server = app.listen(port, () => {
  console.log(`App listening on port ${port}`);
  console.log('Running Environment:', process.env.NODE_ENV);
});
