// ==UserScript==
// @name        Goonee Console2 Floating Button
// @namespace   http://tampermonkey.net/
// @copyright 2025, GooneeShark (https://openuserjs.org/users/GooneeShark)
// @version     1.1
// @description เพิ่มปุ่ม ⚙️ ลอยแบบลากได้ เพื่อเปิด/ปิด Goonee Console2
// @match       *://*/*
// @grant       none
// @updateURL https://openuserjs.org/meta/GooneeShark/Goonee_Console2_Floating_Button.meta.js
// @downloadURL https://openuserjs.org/install/GooneeShark/Goonee_Console2_Floating_Button.user.js
// @license MIT
// ==/UserScript==

(function() {
  'use strict';

  // URL ของสคริปต์ console2.js
  const CONSOLE2_URL = 'https://goohub.js.org/console2.js';

  // สร้างปุ่ม ⚙️ ลอย
  const btn = document.createElement('button');
  btn.textContent = '⚙️';
  // กำหนดสไตล์ให้ลอยอยู่บนเนื้อหา
  Object.assign(btn.style, {
    position: 'fixed',
    left: '10px',
    top: '10px',
    width: '40px',
    height: '40px',
    'font-size': '24px',
    'border-radius': '50%',
    border: 'none',
    'background-color': '#007bff',
    color: 'white',
    cursor: 'pointer',
    'z-index': 9999
  });
  document.body.appendChild(btn);

  // ตัวแปรสำหรับจับการลาก
  let dragging = false, startX, startY, origX, origY;

  // เมื่อกดปุ่ม เริ่มจับตำแหน่งเมาส์เพื่อ拖移元素
  btn.addEventListener('mousedown', function(e) {
    dragging = false;
    startX = e.clientX;
    startY = e.clientY;
    // เก็บตำแหน่งเริ่มต้นของปุ่ม (pixel จากขอบซ้าย/บน)
    origX = btn.offsetLeft;
    origY = btn.offsetTop;
    // สร้างฟังก์ชันเคลื่อนที่ปุ่มตามเมาส์
    function onMove(ev) {
      dragging = true;
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;
      btn.style.left = (origX + dx) + 'px';
      btn.style.top  = (origY + dy) + 'px';
    }
    // ผูกเหตุการณ์ mousemove และ mouseup เพื่อเลิกจับ
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', function() {
      document.removeEventListener('mousemove', onMove);
    }, { once: true });
  });

  // ฟังก์ชันโหลดสคริปต์ console2.js หากยังไม่โหลด
  function ensureConsole2Loaded(callback) {
    if (document.getElementById('goonee-console2-script')) {
      callback();
    } else {
      const s = document.createElement('script');
      s.src = CONSOLE2_URL + '?t=' + Date.now();
      s.id  = 'goonee-console2-script';
      s.onload = callback;
      document.body.appendChild(s);
    }
  }

  // ฟังก์ชันเรียก toggle ของ Goonee Console2 เมื่อโหลดเสร็จ
  function toggleConsole2() {
    if (window.Goonee && typeof window.Goonee.toggle === 'function') {
      window.Goonee.toggle();
    } else if (typeof toggleConsole2 === 'function') {
      toggleConsole2();
    } else {
      console.warn('Goonee Console2 ไม่พร้อมใช้งาน');
    }
  }

  // เมื่อคลิกที่ปุ่ม (หากไม่ได้ลาก) ให้โหลดสคริปต์และสลับการแสดง Console2
  btn.addEventListener('click', function(e) {
    if (dragging) return;  // หากขณะนั้นเป็นการลาก ไม่ทำงานคลิก
    ensureConsole2Loaded(toggleConsole2);
  });
})();

