document.addEventListener('DOMContentLoaded', () => {
  const mainMenu = document.getElementById('main-menu');
  const btnStart = document.getElementById('btn-start');
  const btnGuide = document.getElementById('btn-guide');
  const guideBox = document.getElementById('guide-box');

  // Ketika tombol "Buat Catatan Baru" diklik, pindah ke halaman kanvas di dalam folder "Scratch Note"
  if (btnStart) {
    btnStart.addEventListener('click', () => {
      // Mengarahkan ke file index.html di dalam folder Scratch Note
      window.location.href = "Scratch%20Note/index.html";
    });
  }

  // Tombol Panduan
  if (btnGuide) {
    btnGuide.addEventListener('click', () => {
      guideBox.classList.toggle('hidden');
    });
  }
});
