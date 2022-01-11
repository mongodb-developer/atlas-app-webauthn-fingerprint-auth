'use strict'

/**
 * Dependencies
 * @ignore
 */
const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const Webauthn = require('webauthn')


/**
 * Module Dependencies
 * @ignore
 */
const LevelAdapter = require('webauthn/src/LevelAdapter')

/**
 * Example
 * @ignore
 */
const app = express()

// Session
app.use(session({
  secret: 'keyboard cat',
  saveUninitialized: true,
  resave: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  },
}))

// Static
app.use(express.static(path.join(__dirname, 'build')))

// Body parsing
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// Create webauthn
const webauthn = new Webauthn({
  usernameField: 'username',
  origin: process.env.ORIGIN,
  userFields: {
    username: 'username',
    name: 'displayName',
  },
 // store: new LevelAdapter('db'),
  authenticator: 'platform',
  credentialEndpoint: '/register',
  assertionEndpoint: '/login',
  challengeEndpoint: '/response',
  logoutEndpoint: '/logout',
  // OR
  store: {
     put: async (id, value) => {
     var data = JSON.stringify({
      "collection": "users",
      "database": "sample_webauthn",
      "dataSource": process.env.CLUSTER_NAME,
      "filter": { "id" : id },
      "update": {
          "$set": {
             "value" : value.value,
             "authenticator" :  value.authenticator
          }
      },
      "upsert" : true
  });
      await DataAPICall(data, "updateOne");
                  
     
    },
     get: async (id) => {
                    var data = JSON.stringify({
                      "collection": "users",
                      "database": "sample_webauthn",
                      "dataSource": process.env.CLUSTER_NAME,
                      "filter" : {"id" : id}
                  });

        return await DataAPICall(data, "findOne");
    },
     search: async (search) => {
            var data = JSON.stringify({
              "collection": "users",
              "database": "sample_webauthn",
              "dataSource": process.env.CLUSTER_NAME,
              "filter" : {"id" : /^search/}
          });

        return await DataAPICall(data, "findOne");

     },
     delete: async (id) => {
      var data = JSON.stringify({
        "collection": "users",
        "database": "sample_webauthn",
        "dataSource": process.env.CLUSTER_NAME,
        "filter" : {"id" : id}
    });
        await DataAPICall(data, "deleteOne");
                    

     },
   },
  rpName: 'Stranger Labs, Inc.',
})

// Mount webauthn endpoints
app.use('/webauthn', webauthn.initialize())

// Endpoint without passport
app.get('/authenticators', webauthn.authenticate(), async (req, res) => {
  res.status(200).json([
      await webauthn.store.get(req.session.username)
  ].map(user => user.authenticator))
})

// Debug
app.get('/db', async (req, res) => {
  res.status(200).json(await webauthn.store.search())
})

// Debug
app.get('/session', (req, res) => {
  res.status(200).json(req.session)
})

// Serve React App
app.use((req, res) => {
  return res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

const DataAPICall = async (data, method) => {
  const axios = require('axios');

  var config = {
    method: 'post',
    url:  process.env.DATA_API_BASE_URL + '/action/' + method,
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Request-Headers': '*',
        'api-key': process.env.DATA_API_KEY
    },
    data : data
};

let response = await axios(config);

if (response.data.document !== null){
  return response.data.document;
}

}

// Listen
const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log('Listening on port', port)
})
