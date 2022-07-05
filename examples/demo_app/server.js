/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
/* eslint-disable promise/always-return */
/* eslint-disable promise/catch-or-return */
const express = require("express");
const bodyParser = require("body-parser");

const router = express.Router();
const app = express();

const DemoApp = require("./app");
const basicAuth = require("./utils/basicauth");

// Setup middleware
app.use(basicAuth);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes
router.post("/setup", (req, res) => {
  const demo = new DemoApp();

  demo.setup().then((result) => {
    let code = 200;
    let message = "";

    demo.shutdown();

    if (result) {
      code = 200;
      message = "App setup completed.";
    } else {
      code = 400;
      message = "Setup previously completed";
    }

    res.statusCode = code;
    res.setHeader("Content-type", "application/json");
    res.end(JSON.stringify({ message }));
  });
});

router.post("/upload_resume", (req, res) => {
  const demo = new DemoApp();

  const clientIp = req.headers.clientipaddress;

  demo.uploadResume(req.user, clientIp, req.body).then(([code, message]) => {
    demo.shutdown();

    res.statusCode = code;
    res.setHeader("Content-type", "application/json");
    res.end(JSON.stringify({ message }));
  });
});

router.get("/employee/:email", (req, res) => {
  const demo = new DemoApp();

  demo.fetchEmployeeRecord(req.user, req.params.email).then(([code, message]) => {
    demo.shutdown();

    res.statusCode = code;
    res.setHeader("Content-type", "application/json");
    res.end(JSON.stringify({ message }));
  });
});

router.post("/update_employee", (req, res) => {
  const demo = new DemoApp();

  demo.updateEmployee(req.user, req.body).then(([code, message]) => {
    demo.shutdown();

    res.statusCode = code;
    res.setHeader("Content-type", "application/json");
    res.end(JSON.stringify({ message }));
  });
});

app.use("/", router);

app.listen(8080, () => {
  console.log("Server started at http://localhost:8080");
});
