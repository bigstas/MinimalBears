$path = Split-Path $MyInvocation.MyCommand.Path

$env:MONGO_URL = "nope"
$env:TEST_WATCH = 1

Push-Location $path

meteor test --full-app --driver-package meteortesting:mocha --port 3101

Pop-Location