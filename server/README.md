# Server
This directory contains the backend of the *Awantura o Naukę*. 

## Modes
Server can be run in two modes: 
- **online**, aka with usage of database,
- **offline**, aka without usage of database - all data, including questions sets and room information, will be lost after application restart.

## Environment variables
The mode depends on the value of environment variable `MONGODB_URI`. 
If this variable can be correctly resolved, server will try to connect to database. 
Invalid value results in the error, so options are two: valid value or no value at all.
Example value (MongoDB connection URI): `MONGODB_URI=mongodb://user:password@host:port/awantura`.

There is also a second environment variable, called `SERVER_PORT`, that is required. 
As the name suggests, it tells on which port application should run. Example value: `SERVER_PORT=2222`.

To sum up, if one wants to run application with a database, running MongoDB instance and two environment variables (`MONGODB_URI` and `SERVER_PORT`) are needed.
If one wants to run application without the database, for example when no internet connection is available, only one environment variable is needed: `SERVER_PORT`. 

## Building and running
- Development build with auto recompilation when any of required files changes:
1. Do not forget about environment variables. In dev mode they can be stored in `.env` file.
1. Simply run `npm install` to install all dependencies and `npm run server` to start app in dev mode.
1. Do not forget to run tests after every change: `npm run test`. Tests use in-memory database (automatically downloaded for the first time) and randomly picked available ports.
   
- Production build:
1. Once again, do not forget about environment variables. Additional variable `NODE_ENV=production` should be added for build optimalization. This time, they should be set in the system.
1. Run `npm install` to install all dependencies.
1. Compile TypeScript to JavaScript: `npm run build`.
1. Run application: `npm start`. One can use some external program like `pm2` to run it in the background.

## Logs
The application writes to two log files located in `logs` directory:
- `combined.log` - with information of connected users, created rooms, configuration, etc.,
- `exceptions.log` - with information about unhandled errors. This can be pretty useful when one wants to find reasons of unexpected crashes.
