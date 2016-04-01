$path = Split-Path $MyInvocation.MyCommand.Path

$env:POSTGRESQL_URL = "postgres://127.0.0.1/bearcubs"
$env:PACKAGE_DIRS = Join-Path $path "packages/"
$env:MONGO_URL = "nope"

Push-Location $path

meteor

Pop-Location