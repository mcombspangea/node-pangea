//const http = require('http');
//const url = require('url');
const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const app = express();

const DemoApp = require('./app');
const basicAuth = require('./utils/basicauth');

const hostname = '127.0.0.1';
const port = 8080;

// Setup middleware
app.use(basicAuth);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes
router.post('/setup',(req, res) => {
  demo = new DemoApp();

  demo.setup().then (result => {
      var code = 200;
      var message = ''

      demo.shutdown();

      if (result) {
        code = 200;
        message = "App setup completed";
      } else {
        code = 400;
        message = "Setup previously completed";
      }

      res.statusCode = code;
      res.setHeader('Content-type', 'application/json');
      res.end(JSON.stringify({ "message" : message}));
    });
});

router.post('/upload_resume', (req, res) => {
  demo = new DemoApp();

  var client_ip = req.headers['clientipaddress'];

  demo.upload_resume(req.user, client_ip, req.body).then(([code, message]) => {

    res.statusCode = code;
    res.setHeader('Content-type', 'application/json');
    res.end(JSON.stringify({ "message" : message}));    
  });
});

app.use('/', router);

app.listen(8080, () => {
  console.log("Server started at http://localhost:8080");
})

