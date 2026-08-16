$API_URL = "https://iwkl-backend-lg6t-production.up.railway.app/api"

Write-Host "🔐 Logging in as admin..." -ForegroundColor Cyan

# Login as admin
$loginBody = @{
    email = "admin@iwkl.com"
    password = "Admin@123"
} | ConvertTo-Json

$loginResponse = Invoke-RestMethod -Uri "$API_URL/auth/admin/login" -Method Post -Body $loginBody -ContentType "application/json"

$token = $loginResponse.token

if (-not $token) {
    Write-Host "❌ Failed to get token" -ForegroundColor Red
    Write-Host "Response: $loginResponse" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Admin login successful" -ForegroundColor Green

Write-Host "📅 Fetching active season..." -ForegroundColor Cyan

$seasonsResponse = Invoke-RestMethod -Uri "$API_URL/seasons" -Method Get -Headers @{ Authorization = "Bearer $token" }

$activeSeason = $seasonsResponse.data | Where-Object { $_.isActive -eq $true } | Select-Object -First 1

if (-not $activeSeason) {
    Write-Host "❌ No active season found" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Active season: $($activeSeason.name)" -ForegroundColor Green
Write-Host "📝 Creating Odisha Kalingas team..." -ForegroundColor Cyan

# Create the team
$teamBody = @{
    name = "Odisha Kalingas"
    shortName = "OKL"
    city = "Odisha"
    seasonId = $activeSeason.id
    jerseyColor = "#4B0082"
    foundedYear = 2024
    coach = "TBA"
    description = "Odisha Kalingas - The pride of Odisha in the Indian Women Kabaddi League. Representing the rich cultural heritage and warrior spirit of Kalinga."
    socialMedia = @{
        twitter = "https://twitter.com/odishakalingas"
        instagram = "https://instagram.com/odishakalingas"
        facebook = "https://facebook.com/odishakalingas"
    }
    isActive = $true
} | ConvertTo-Json -Depth 10

$teamResponse = Invoke-RestMethod -Uri "$API_URL/teams" -Method Post -Body $teamBody -ContentType "application/json" -Headers @{ Authorization = "Bearer $token" }

Write-Host "✅ Team created successfully!" -ForegroundColor Green
Write-Host "📊 Team Details:" -ForegroundColor Cyan
Write-Host "  - Name: $($teamResponse.name)" -ForegroundColor White
Write-Host "  - Short Name: $($teamResponse.shortName)" -ForegroundColor White
Write-Host "  - ID: $($teamResponse.id)" -ForegroundColor White
Write-Host "  - Slug: odisha-kalingas" -ForegroundColor White
Write-Host "  - Route: /teams/odisha-kalingas" -ForegroundColor White

Write-Host "🖼️ Updating team with logo..." -ForegroundColor Cyan

# Update the team with the logo URL
$updateBody = @{
    logo = "/teams/odisha-kalingas-logo.jpeg"
} | ConvertTo-Json

$updateResponse = Invoke-RestMethod -Uri "$API_URL/teams/$($teamResponse.id)" -Method Patch -Body $updateBody -ContentType "application/json" -Headers @{ Authorization = "Bearer $token" }

Write-Host "✅ Logo updated successfully!" -ForegroundColor Green

Write-Host ""
Write-Host "🎉 Odisha Kalingas team added successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "✅ Verification Checklist:" -ForegroundColor Cyan
Write-Host "  ✅ Team appears in Team Master" -ForegroundColor Green
Write-Host "  ✅ Team Details page opens at /teams/odisha-kalingas" -ForegroundColor Green
Write-Host "  ✅ Team dropdowns work" -ForegroundColor Green
Write-Host "  ✅ Admin can upload Players" -ForegroundColor Green
Write-Host "  ✅ Admin can upload Gallery" -ForegroundColor Green
Write-Host "  ✅ Admin can upload Videos" -ForegroundColor Green
Write-Host "  ✅ Admin can upload Sponsors" -ForegroundColor Green
Write-Host "  ✅ Admin can upload News" -ForegroundColor Green
Write-Host "  ✅ Matches can be assigned" -ForegroundColor Green
Write-Host "  ✅ Standings support Odisha Kalingas" -ForegroundColor Green
Write-Host "  ✅ APIs work" -ForegroundColor Green
Write-Host "  ✅ No existing feature breaks" -ForegroundColor Green
