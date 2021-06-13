# Prolinkup-backendService-

A back-end service for a linkedin clone

## Installation

For npm package manager Run "npm install"
Or
For yarn package manager Run "yarn install"

---

## Starting up application

To start up the app run "npm start" or "yarn start"
To start in development mode run "npm run server" or "yarn server"

---

## Folder Structure

src
-components
--posts
---post.controller.js
---post.model.js
---post.routes.js
---post.service.js
--profiles
---profile.controller.js
---profile.model.js
---profile.routes.js
---profile.service.js
--users
---user.controller.js
---user.model.js
---user.routes.js
---user.service.js
-config
--config_dev.js
--config_prod.js
--index.js
-library
--helpers
--middlewares
---authMiddleware.js
---customError.js
---multerMiddleware.js
-uploads
-view
-app.js
-route_lists.js
-server.js
test
-posts
-profiles
-users
.gitignore
combined.log
docker-compose.yml
Dockerfile
error.log
package.json
README.md

---

## Files and usage

"server.js" is the entry point for the api
"app.js" used for registering middlewares
"route_list" manually added list of routes for the api
--- get route_list with "npm run list-routes" or "yarn list-routes"
