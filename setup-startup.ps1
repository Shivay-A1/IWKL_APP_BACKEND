# PowerShell script to create Windows Task Scheduler task for auto-starting IWKL backend

$action = New-ScheduledTaskAction -Execute "C:\Users\sivam\CascadeProjects\iwkl-platform\backend\start-backend.bat"
$trigger = New-ScheduledTaskTrigger -AtLogon
$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable -DontStopOnIdleEnd
$principal = New-ScheduledTaskPrincipal -UserId "SIVAM\sivam" -LogonType Interactive -RunLevel Highest

Register-ScheduledTask -TaskName "IWKL Backend Auto-Start" -Action $action -Trigger $trigger -Settings $settings -Principal $principal -Force

Write-Host "Task 'IWKL Backend Auto-Start' created successfully."
