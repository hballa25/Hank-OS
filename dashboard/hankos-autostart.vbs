' Hank OS auto-start — launches the dashboard server hidden (no window) at Windows login.
' A copy of this lives in the Startup folder (run shell:startup to open it).
' To turn OFF auto-start: delete "HankOS.vbs" from that Startup folder. Nothing else changes.
Set shell = CreateObject("WScript.Shell")
shell.Run "cmd /c cd /d ""C:\Users\hball\Hank OS\dashboard"" && npm run dev", 0, False
