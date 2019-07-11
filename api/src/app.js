'use strict'
const express = require("express");
console.log(process.cwd());
const CONFIG = require("./CONFIG");
var str = process.cwd();
str = str + "/src/routes/Token.route";
const tokenRouter = require(str);
//const tokenRouter = require("/Users/hf339db/others/pizzaChain/api/routes/Token.route");
const basicAuth  = require("express-basic-auth");
const bodyParser = require("body-parser");
const cors = require("cors");


const app = express();
const port = process.env.PORT || 6000;

app.use(cors());
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');
  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,authorization');
  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  // res.setHeader('Access-Control-Allow-Credentials', true);
  // Pass to next layer of middleware
  next();
});

app.use(basicAuth({
  // custom authorizer that only checks that userName matches any entity defined in config file
  authorizer: (userName) => {
    return (CONFIG[userName]);
  }
}));

app.use(bodyParser.json({ type: 'application/json' }));
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({extended: true}));
//app.use(bodyParser.text());

app.use('/Token', tokenRouter);

app.listen(port, () => console.log(`API listening on port ${port}!`));

