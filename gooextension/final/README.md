# 🦈 Shark Tools Extension

เครื่องมือลอยน้ำสำหรับนักพัฒนาและผู้ใช้ขั้นสูง - รองรับทุกเบราว์เซอร์

## ✨ ฟีเจอร์หลัก

- 🎯 **Floating Menu** - เมนูลอยที่สามารถลากย้ายได้ พร้อมไอคอนย่อยแบบวงกลม
- 🖼️ **ไอคอนให้เลือก 25+ แบบ** - ไอคอน i1.png - i25.png พร้อมไอคอนพิเศษอื่นๆ ไม่ต้องอัพโหลด
- 📝 **JavaScript Console** - คอนโซล JavaScript ขั้นสูงพร้อมธีมและฟีเจอร์ครบครัน
- 🔧 **Custom Scripts** - เพิ่มสคริปต์ JavaScript ของคุณเองได้ พร้อมการจัดการขอบเขต
- 🌐 **Cross-Browser** - รองรับเบราว์เซอร์หลากหลาย รวมถึง Kiwi Browser บน Android
- ⚡ **Auto-Run** - รันสคริปต์อัตโนมัติเมื่อโหลดหน้าเว็บ (ตามที่ตั้งค่า)

## 📦 ดาวน์โหลด

| เบราว์เซอร์ | ไฟล์ | รองรับ |
|------------|------|--------|
| Chrome/Chromium | [shark-tools-chrome.zip](build/shark-tools-chrome.zip) | ✅ Manifest V3 |
| Firefox | [shark-tools-firefox.xpi](build/shark-tools-firefox.xpi) | ✅ Manifest V2 |
| Microsoft Edge | [shark-tools-edge.zip](build/shark-tools-edge.zip) | ✅ Manifest V3 |
| Universal | [shark-tools-universal.zip](build/shark-tools-universal.zip) | ✅ Chromium-based |

## 🚀 การติดตั้ง

### 🌐 Chrome/Chromium
1. เปิด Chrome และไปที่ `chrome://extensions/`
2. เปิด "Developer mode" (มุมขวาบน)
3. แตก `shark-tools-chrome.zip` แล้วคลิก "Load unpacked" และเลือกโฟลเดอร์ package ที่แตกแล้ว (หรือเลือก source folder นี้ระหว่างพัฒนา)

### 🦊 Firefox
1. เปิด Firefox และไปที่ `about:debugging`
2. คลิก "This Firefox" ในแถบด้านซ้าย
3. คลิก "Load Temporary Add-on..." และเลือกไฟล์ .xpi

### 🌊 Microsoft Edge
1. เปิด Edge และไปที่ `edge://extensions/`
2. เปิด "Developer mode" (แถบด้านซ้าย)
3. แตก `shark-tools-edge.zip` แล้วคลิก "Load unpacked" และเลือกโฟลเดอร์ package ที่แตกแล้ว

### 🥝 Kiwi Browser (Android)
1. เปิด Kiwi Browser และไปที่ `chrome://extensions/`
2. เปิด "Developer mode" (สวิตช์มุมขวาบน)
3. **แตกไฟล์ ZIP ก่อน** แล้วคลิก "Load unpacked" และเลือกโฟลเดอร์ที่แตกแล้ว

### 🦁 Brave Browser
1. เปิด Brave และไปที่ `brave://extensions/`
2. เปิด "Developer mode" (มุมขวาบน)
3. คลิก "Load unpacked" หรือลากไฟล์ ZIP มาวาง

### 🎭 Opera Browser
1. เปิด Opera และไปที่ `opera://extensions/`
2. เปิด "Developer mode" (มุมขวาบน)
3. คลิก "Load unpacked" หรือลากไฟล์ ZIP มาวาง

## 📖 คู่มือใช้งาน

### การใช้งานพื้นฐาน
1. หลังติดตั้งแล้ว floating icon จะปรากฏที่มุมซ้ายบนของหน้าเว็บ
2. คลิกที่ไอคอนเพื่อเปิดเมนูย่อย (ถ้ามีสคริปต์ที่เพิ่มไว้)
3. สามารถลากไอคอนไปวางตำแหน่งที่ต้องการได้
4. คลิกที่ไอคอนส่วนขยายเพื่อเข้าสู่หน้าตั้งค่า
5. เพิ่มสคริปต์ใหม่และเลือกไอคอนจากรายการที่มีให้

### การเพิ่มสคริปต์
1. เปิดหน้าตั้งค่าส่วนขยาย
2. ใส่ชื่อปุ่ม
3. เลือกวิธีการเพิ่มสคริปต์:
   - อัพโหลดไฟล์ .js
   - วางโค้ด JavaScript โดยตรง
   - ใส่ URL ของสคริปต์
4. เลือกไอคอนจากรายการ (i1.png - i25.png)
5. ตั้งค่าขอบเขตการใช้งาน (ทั่วทุกหน้า หรือเฉพาะโดเมน)
6. คลิก "เพิ่มปุ่ม"

## 🛠️ การพัฒนา

Source ที่แก้ไขได้อยู่ในโฟลเดอร์นี้ ส่วน `build/` เป็น package และ staging output ที่สร้างขึ้นใหม่ ให้แก้ไฟล์ source ก่อนแล้วจึง build อีกครั้ง

### สร้างไฟล์ติดตั้ง
```powershell
# สร้างไฟล์ติดตั้งทุกรูปแบบ
.\build-extensions.ps1

# สร้างไฟล์ CRX (ถ้าต้องการ)
.\create-crx.ps1
```

### โครงสร้างไฟล์
```
├── manifest.json          # Chrome/Edge (Manifest V3)
├── manifest-firefox.json  # Firefox (Manifest V2)
├── background.js          # Chrome/Edge background script
├── background-firefox.js  # Firefox background script
├── content.js            # Content script (cross-browser)
├── setting.html          # Settings page
├── setting.js           # Settings logic
├── image/               # Icons (i1.png - i25.png + others)
├── build/               # Built packages
└── docs/               # Documentation
```

## 🔧 การแก้ไขปัญหา

### ส่วนขยายโหลดไม่ได้
- ตรวจสอบ console ของเบราว์เซอร์หาข้อผิดพลาด
- ตรวจสอบว่าเปิด Developer mode แล้ว
- ลองรีโหลดส่วนขยาย

### ไอคอนไม่ปรากฏ
- รีเฟรชหน้าเว็บ
- ตรวจสอบสิทธิ์ส่วนขยาย
- ตรวจสอบ console หาข้อผิดพลาด

### สคริปต์ไม่ทำงาน
- ตรวจสอบ syntax ของ JavaScript
- ตรวจสอบสิทธิ์การเข้าถึง
- ดูข้อผิดพลาดใน console

### Kiwi Browser (Android)
- ตรวจสอบว่าแตกไฟล์ ZIP แล้ว
- เลือกโฟลเดอร์ที่ถูกต้องใน Load unpacked
- ตรวจสอบว่า Kiwi Browser เป็นเวอร์ชันล่าสุด

## ⚠️ ข้อควรระวัง

- **Firefox:** ใช้ Manifest V2 เพื่อความเข้ากันได้ ส่วนขยายจะเป็นแบบชั่วคราว
- **Kiwi Browser:** ต้องแตกไฟล์ ZIP ก่อนติดตั้ง เนื่องจากข้อจำกัดของระบบไฟล์ Android
- **การพัฒนา:** หากแก้ไขโค้ด ต้องรีโหลดส่วนขยายใหม่
- **Build:** รัน `build-extensions.ps1` จากโฟลเดอร์นี้; สคริปต์จะสร้าง staging folders ใหม่และเขียนทับ package ที่ชื่อเดียวกัน
- **สิทธิ์:** ตรวจสอบให้แน่ใจว่าส่วนขยายได้รับสิทธิ์ที่จำเป็น

## 🚀 Production Deployment

- **Chrome Web Store:** Submit `shark-tools-chrome.zip`
- **Firefox Add-ons (AMO):** Submit `shark-tools-firefox.xpi`
- **Microsoft Edge Add-ons:** Submit `shark-tools-edge.zip`

## 📄 License

MIT License - ใช้งานได้อย่างอิสระ

## 🤝 Contributing

ยินดีรับ Pull Request และ Issue reports!

---

🦈 **Shark Tools Extension** - เครื่องมือลอยน้ำสำหรับนักพัฒนา