$path = Split-Path $MyInvocation.MyCommand.Path

$env:MONGO_URL = "nope"

Push-Location $path

meteor

Pop-Location