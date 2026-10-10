document.addEventListener('DOMContentLoaded', () => {
  const mainMenu = document.getElementById('main-menu');
  const btnStart = document.getElementById('btn-start');
  const btnGuide = document.getElementById('btn-guide');
  const guideBox = document.getElementById('guide-box');
  const btnBackMenu = document.getElementById('btn-back-menu');
  const btnAddNote = document.getElementById('btn-add-note');
  const noteBoard = document.getElementById('note-board');

  // Tombol Mulai: Menyembunyikan main menu dan masuk ke kanvas
  if (btnStart) {
    btnStart.addEventListener('click', () => {
      mainMenu.classList.add('hidden');
    });
  }

  // Tombol Kembali ke Menu Utama dari Kanvas
  if (btnBackMenu) {
    btnBackMenu.addEventListener('click', () => {
      mainMenu.classList.remove('hidden');
    });
  }

  // Toggle Kotak Petunjuk
  if (btnGuide) {
    btnGuide.addEventListener('click', () => {
      guideBox.classList.toggle('hidden');
    });
  }

  // Fitur Tambah Catatan Baru ke Kanvas
  if (btnAddNote) {
    btnAddNote.addEventListener('click', () => {
      createNote();
    });
  }

  function createNote(text = '') {
    const note = document.createElement('div');
    note.className = 'note-card';
    note.style.left = '120px';
    note.style.top = '120px';

    note.innerHTML = `
      <textarea placeholder="Tulis catatan di sini...">${text}</textarea>
    `;

    noteBoard.appendChild(note);
  }

  console.log("Scratch Notes Single Page Loaded Successfully!");
});
