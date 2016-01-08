### Development
* Set environment variables:
  * On Mac/Linux: `NODE_ENV=development`
  * On Windows: `[Environment]::SetEnvironmentVariable("NODE_ENV", "development", "User")`
* Run `gulp`
* Go to `localhost:8889` to display the app
* Tests:
  * Go to `localhost:8889/testrunner.html` to see results
  * Run `gulp test` to run all tests with phantomJS and produce XML reports

### Production
* Set environment variables:
  * On Mac/Linux: `NODE_ENV=production`
  * On Windows: `[Environment]::SetEnvironmentVariable("NODE_ENV", "production", "User")`
* Run `gulp deploy`

### Directories
* **app/**: source code
* **build/**: development code
* **public/**: production code
* **cloud/**: Parse cloud code
* **styles/**: css files
* **specs/**: test files
* **gulpfile**: Gulp configuration