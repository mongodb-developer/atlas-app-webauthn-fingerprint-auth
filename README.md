# realm-webauthn-fingerprint-auth
A demo application to showcase how to use Realm, Atlas and WebAuthn package to fingerprint authenticate users on websites

Require a finger print reader device on the running demo host. Tested on Chrome web browser.

## Install
```
cd realm-webauthn-fingerprint-auth
npm install
```

Create the `.env` file in the main project with the DATA API and origin URL details:
```
DATA_API_KEY=<API-KEY>
DATA_API_BASE_URL=<DATA-API-BASE-URL>
CLUSTER_NAME=<CLUSTER-NAME>
ORIGIN=http://localhost:3001
```

## Run development
```
npm build & npm run dev-server
```

Website is on http://localhost:3001
