# Atlas-webauthn-fingerprint-auth
A demo application to showcase how to use [Atlas App Services](https://www.mongodb.com/docs/atlas/app-services/), [Atlas](https://www.mongodb.com/atlas) and [WebAuthn](https://webauthn.guide/) package to fingerprint authenticate users on websites

Require a finger print reader device on the running demo host. Tested on Chrome web browser.

## Prerequisite
- Create an Atlas cluster
- Enable DATA API
- Create app services application.
- Enable function auth with the follwing function:
```
 exports = async (loginPayload) => {
 

    const user = await context.services.get("mongodb-atlas").db("sample_webauthn").collection("users").findOne({id : loginPayload.username});
    return user.authenticator.credID;


  };
```


## Install
```
cd realm-webauthn-fingerprint-auth/example
npm install
```

Create the `.env` file in the main project with the Atlas DATA API details and allowed origin URL details:
```
DATA_API_KEY=<API-KEY>
DATA_API_BASE_URL=<DATA-API-BASE-URL>
CLUSTER_NAME=<CLUSTER-NAME>
APP_ID=<APP-SERVICES-APP-ID>
ORIGIN=http://localhost:3001
```

## Run development
```
npm build & npm run dev-server
```

Website is on http://localhost:3001

## Disclaimer

Use at your own risk; not a supported MongoDB product
