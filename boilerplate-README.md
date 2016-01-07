### Development
* Run `NODE_ENV=development gulp`
* Go to `localhost:8889` to display the app
* Go to `localhost:8889/testrunner.html` to see your tests
* Run `gulp test` to run all tests with phantomJS and produce XML reports

### Production
* Run `NODE_ENV=production gulp deploy`

### Directories
* **app/**: source code
* **build/**: development code
* **public/**: production code
* **styles/**: css files
* **specs/**: test files
* **gulpfile**: Gulp configuration