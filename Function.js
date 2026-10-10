// INISIALISASI UTAMA APLIKASI
document.addEventListener('DOMContentLoaded', () => {
  const mainMenu = document.getElementById('main-menu');
  const btnStart = document.getElementById('btn-start');
  const btnGuide = document.getElementById('btn-guide');
  const guideBox = document.getElementById('guide-box');

  // Tombol Mulai: Menutup menu utama dan masuk ke area kanvas
  if (btnStart) {
    btnStart.addEventListener('click', () => {
      mainMenu.classList.add('hidden');
    });
  }

  // Tombol Panduan: Membuka/menutup kotak petunjuk
  if (btnGuide) {
    btnGuide.addEventListener('click', () => {
      guideBox.classList.toggle('hidden');
    });
  }

  console.log("Scratch Notes Main Menu Loaded Successfully!");
});
