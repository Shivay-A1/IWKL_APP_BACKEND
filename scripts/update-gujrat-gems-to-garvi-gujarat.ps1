# Update Gujrat Gems to Garvi Gujarat
$apiUrl = "https://iwkl-backend-lg6t-production.up.railway.app/api"

# Login as admin
$loginBody = @{
    email = "admin@iwkl.com"
    password = "Admin@123"
} | ConvertTo-Json

$loginResponse = Invoke-RestMethod -Uri "$apiUrl/auth/admin/login" -Method Post -Body $loginBody -ContentType "application/json"
$token = $loginResponse.data.token

Write-Host "Logged in successfully" -ForegroundColor Green

# Get all teams to find Gujrat Gems
$headers = @{
    "Authorization" = "Bearer $token"
}

$teamsResponse = Invoke-RestMethod -Uri "$apiUrl/teams" -Method Get -Headers $headers
$gujratTeam = $teamsResponse.data | Where-Object { $_.name -eq "Gujrat Gems" }

if ($gujratTeam) {
    Write-Host "Found Gujrat Gems team with ID: $($gujratTeam.id)" -ForegroundColor Yellow
    
    # Update team name and logo
    $updateBody = @{
        name = "Garvi Gujarat"
        shortName = "GGU"
        logo = "/team-logos/Garvi_Gujarat.jpeg"
    } | ConvertTo-Json
    
    $updateResponse = Invoke-RestMethod -Uri "$apiUrl/teams/$($gujratTeam.id)" -Method Put -Body $updateBody -Headers $headers -ContentType "application/json"
    
    Write-Host "Team updated successfully:" -ForegroundColor Green
    Write-Host "Name: $($updateResponse.data.name)" -ForegroundColor Cyan
    Write-Host "Short Name: $($updateResponse.data.shortName)" -ForegroundColor Cyan
    Write-Host "Logo: $($updateResponse.data.logo)" -ForegroundColor Cyan
} else {
    Write-Host "Gujrat Gems team not found" -ForegroundColor Red
}
