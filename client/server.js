// server.js


    const express = require('express');
    const bodyParser = require('body-parser');
    const cors = require('cors');
    const Chatkit = require('@pusher/chatkit-server');

    const app = express();

    const chatkit = new Chatkit.default({
      instanceLocator: "v1:us1:d4a9ab18-45ec-4a50-96d7-93ce3a1102b1",
      key: "e0d62e20-7ba1-4e09-aafc-6ec2192ee0d0:5yMpW1S3FpLpshUud/i/r/nHMIH6qeQeDBrfe0m0CiQ=",
    });

    app.use(cors());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.post('/users', (req, res) => {
      const { username } = req.body;

      chatkit
        .createUser({
          id: username,
          name: username,
        })
        .then(() => {
          res.sendStatus(201);
        })
        .catch(err => {
          if (err.error === 'services/chatkit/user_already_exists') {
            res.sendStatus(200);
          } else {
            res.status(err.status).json(err);
          }
        });
    });

    app.post('/authenticate', (req, res) => {
      const authData = chatkit.authenticate({
        userId: req.query.user_id,
      });
      res.status(authData.status).send(authData.body);
    });

    app.set('port', process.env.PORT || 443);
    const server = app.listen(app.get('port'), () => {
      console.log(`Express running > PORT ${server.address().port}`);
    });
