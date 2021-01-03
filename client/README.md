# Client
This directory contains the frontend of the *Awantura o Naukę*.

## Environment variables
In the Vue app environment variables are checked and copied into the final build during the build stage. 
The preferred way for this purpose is to use `.env` files. This app uses two kind of them: `.env` for production settings and `.env.local` for dev settings.
Because values stored in these variables should not be secret (they are present in public output files), the `.env` file is synchronized with repository for ease of build automation.
More information can be found on the [Vue](https://cli.vuejs.org/guide/mode-and-env.html) and [.dotenv](https://github.com/motdotla/dotenv#rules) plugin sites.

This app uses two environment variables:
- `NODE_ENV` - determine the primary mode the app is running in - `development` or `production`,
- `VUE_APP_SERVER_ADDRESS` - as the name suggests, this is simply the address of server. For example: `https://server.host.pl`. 
  The protocol can be WebSocket **ws** and **wss** (for secured), but also **http** and **https** are correct - they will be changed under the hood by the Socket.IO.

To sum up, set two variables `NODE_ENV` and `VUE_APP_SERVER_ADDRESS` in `.env` file, so they can be statically embedded into the client bundle.

## Building and running
- Development build with auto recompilation when any of required files changes:
1. Set environment variables, `NODE_ENV` should be equal to `development`.
1. Simply run `npm install` to install all dependencies and  `npm run serve` to run app in development mode. The application will be available at <localhost:8080>.

- Production build:
1. Once again, do not forget about environment variables. `NODE_ENV` should be equal to `production`.
1. Run `npm install` to install all dependencies.
1. Build target files: `npm run build`.
1. The output of previous step in `dist` directory is a purely static app. One can deploy the built content in the `dist` directory to any static file server, but do not forget about correct value of [publicPath](https://cli.vuejs.org/config/#publicpath).
   By default, Vue CLI assumes that the app will be deployed at the root of a domain. The author of this project used for this purpose [nginx](https://www.nginx.com) web server.
