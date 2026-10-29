Deploy quickstart for LAB

1) From PowerShell in the `LAB` folder run:

```powershell
.\serve-lab.ps1 -Port 8000
```

2) Open http://localhost:8000/index.html in your browser.

Notes:
- The script opens the enhanced LAB landing page (`index.html`); `lab.html` is a legacy interface.
- Script prefers Python (python or python3). If not found it uses Node if available.
- This is for local development and quick deployment only.
- To stop the server, close the process started by this script.

Additional labs
- เปิดตัวอย่างแลบ "Gambling API" ที่เพิ่มใหม่: เปิด URL http://localhost:8000/docs/GamblingAPI_lab.html

Slides & worksheet
- เปิดสไลด์สำหรับสอน: http://localhost:8000/LAB_SLIDES.html
- เปิด worksheet: http://localhost:8000/WORKSHEET_GamblingLAB.md
