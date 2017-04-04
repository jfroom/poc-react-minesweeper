# POC-React-Minesweeper [![Build Status](https://travis-ci.org/jfroom/poc-react-minesweeper.svg?branch=master)](https://travis-ci.org/jfroom/poc-react-minesweeper)

React Minesweeper proof-of-concept.

Demo: https://jfroom.github.io/poc-angular-minesweeper/#/

![Demo animated gif](https://cloud.githubusercontent.com/assets/943108/24680649/9a204558-1946-11e7-8210-f8b8e4636114.gif)

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

`docker-compose exec web yarn lint` Run linter, stays open with watch.

## Test
`docker-compose exec web yarn test` Run test suite, stays open with watch.

![Jest test results](https://cloud.githubusercontent.com/assets/943108/24680654/9c5de0e6-1946-11e7-98c3-632afd5bdff5.png)


## Build
`docker-compose exec web yarn build` Create production build of static files.

`docker-compose exec web yarn serve-build` Serve the build locally.

# References
- [Testing React components with Jest and Enzyme](https://hackernoon.com/testing-react-components-with-jest-and-enzyme-41d592c174f) by Artem Sapegin  

