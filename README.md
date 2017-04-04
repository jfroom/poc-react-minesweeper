# POC-React-Minesweeper [![Build Status](https://travis-ci.org/jfroom/poc-react-minesweeper.svg?branch=master)](https://travis-ci.org/jfroom/poc-react-minesweeper)

Minesweeper proof of concept using [React](https://facebook.github.io/react/).

## Technologies
- [React](https://facebook.github.io/react) with [ES6](https://github.com/lukehoban/es6features) & [JSX](https://facebook.github.io/react/docs/jsx-in-depth.html)
- [Docker](https://docs.docker.com/) with [Compose](https://docs.docker.com/compose/)
- Scaffolded with [Create React App](https://github.com/facebookincubator/create-react-app) which leverages [Babel](https://babeljs.io/) and [webpack](https://webpack.js.org)
- [ESLint](http://eslint.org/) with [watch](https://github.com/rizowski/eslint-watch)
- Testing with [Jest](https://facebook.github.io/jest/) and [Enzyme](http://airbnb.io/enzyme/)
- [Yarn](https://yarnpkg.com)
- [React-Bootstrap](https://react-bootstrap.github.io/)
- TravisCI integration with auto-deploy to GitHub pages

# Getting Started

## Required

1. Install [Docker](https://www.docker.com/) 17.03.0-ce+. This should also install Docker Compose 1.11.2+.
2. Verify versions: `docker -v; docker-compose -v;`

## First run
`docker-compose build` Builds images.

# Usage
## Development
`docker-compose up` Starts web server.

`open http://localhost:3000/` Loads default page into local browser.

`docker-compose exec web yarn test` Run test suite, stays open with watch.

`docker-compose exec web yarn lint` Run linter, stays open with watch.

## Build
`docker-compose exec web yarn build` Create production build of static files.

`docker-compose exec web yarn serve-build` Serve the build locally to test.

# References
- [Testing React components with Jest and Enzyme](https://hackernoon.com/testing-react-components-with-jest-and-enzyme-41d592c174f) by Artem Sapegin  

