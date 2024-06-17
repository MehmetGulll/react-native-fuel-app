const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require('dotenv').config();
const chalk = require("chalk");
const app = express();
const priceRoutes = require('./routes/priceRoutes');

const log = console.log;
const port = process.env.SERVER_PORT || 5000;
app.use(cors());
app.use(bodyParser.json());

app.use(priceRoutes);

app.listen(port, () => {
  log(chalk.green(`Server running the port ${port}....`));
});
