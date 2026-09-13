# Wrapper Stripe CLI (PATH pas toujours à jour après winget)
$StripeExe = Join-Path $env:LOCALAPPDATA "Microsoft\WinGet\Packages\Stripe.StripeCli_Microsoft.Winget.Source_8wekyb3d8bbwe\stripe.exe"

if (-not (Test-Path $StripeExe)) {
  Write-Error "Stripe CLI introuvable. Installez-le : winget install Stripe.StripeCli"
  exit 1
}

if ($args.Count -eq 0) {
  & $StripeExe --help
  exit $LASTEXITCODE
}

& $StripeExe @args
exit $LASTEXITCODE
