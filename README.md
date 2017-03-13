
# eBay/Gumtree Frontend Test

## Foreword

* Build tool: Webpack v2
* App JS written in ES6, transpiled using Babel.
* CSS: Styles written in SASS with automatic autoprefixer on generated CSS.
* Routing: Have implemented simple push state for browser history.
* Minifiers for both JS and CSS
* Sourcemaps for JS/CSS
* Digest on JS and CSS bundle files names for cache busting (currently not working)
* Server side rendering

## Getting started

* Install:
    * [Node.js](http://nodejs.org): `brew install node` on OS X
    * `npm install` - 
* Run:
    * `npm start` — watches the project with continuous rebuild.
    * `npm run build` — builds project for production (output will be in ./dist )
    * `npm run server` — runs node server for server side rendering (from /dist)
