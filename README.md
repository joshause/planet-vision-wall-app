# planet-vision-wall-app
React web application for PlanetVision wall email sign-up and event listing.

## Installation

Clone planet-vision-wall-app repo locally.

Unpack node modules via Yarn:

```
$ cd planet-vision-wall-app
$ yarn
```

Find .env files in team Google Drive:
```
+-- DME: Web & Interactive
|   +-- Exhibit Interactives
|   |   +-- Planet Vision Wall App
|   |   |   +-- Technical
```

Copy .env files into root of local planet-vision-wall-app project

## Testing

This app was not developed using test driven development, and the
existing test is only a trivial placeholder.

```
yarn test
```

## Build Notes

### .env.production variable for webpack module bundler build
The URL for the events data feed is saved as global REACT_APP_EVENTS_REST_URL
variable expected by webpack prod distribution builds. The variable is
saved in local .env.production file in project root and excluded from repo.

## Development and Production Builds

Webpack build init scripts in package.json. Webpack config for 'start' script
automatically rebuilds to '/build' on src edit. Run local webserver on /build
dir for dev work (browser auto-refresh in place). While 'start' script is
running, Webpack will use development variable in .env.development file (see
  above). Stop 'start' script and run 'build' script to build app to /build
  using production variable in .env.production file (prior to deployment).

```
yarn dev
yarn build
```

## Deploy Notes

The deploy script deletes s3://planet-vision-wall.calacademy.org content and
copies local build folder contents to s3://planet-vision-wall.calacademy.org.

```
yarn deploy
```
