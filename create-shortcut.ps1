$desktopPath = [Environment]::GetFolderPath('Desktop')
$shortcutPath = Join-Path $desktopPath "Son Tung M-TP World.lnk"
$wsh = New-Object -ComObject WScript.Shell
$sc = $wsh.CreateShortcut($shortcutPath)
$sc.TargetPath = "d:\THIẾT KẾ WEB\sontung-mtp-world\start-localhost.bat"
$sc.WorkingDirectory = "d:\THIẾT KẾ WEB\sontung-mtp-world"
$sc.Save()
Write-Host "SHORTCUT_CREATED_SUCCESSFULLY"
