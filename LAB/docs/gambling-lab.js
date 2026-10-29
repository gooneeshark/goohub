(function loadSharedLabScript() {
  const script = document.createElement('script');
  script.src = new URL('../gambling-lab.js', document.currentScript.src).href;
  script.onerror = () => {
    const errorBanner = document.getElementById('app-error');
    if (errorBanner) {
      errorBanner.textContent = 'โหลดสคริปต์ของ LAB ไม่สำเร็จ กรุณาตรวจสอบเซิร์ฟเวอร์แล้วลองใหม่';
      errorBanner.classList.remove('hidden');
    }
    console.error('[Gambling API Lab] Could not load the shared lab script.');
  };
  document.head.appendChild(script);
})();
