document.addEventListener('DOMContentLoaded', () => {
    // --- TAMBAHAN: LOGIKA MAIN MENU ---
    const mainMenu = document.getElementById('main-menu');
    const btnStart = document.getElementById('btn-start');
    const btnGuide = document.getElementById('btn-guide');
    const guideBox = document.getElementById('guide-box');

    if (btnStart) {
        btnStart.addEventListener('click', () => {
            mainMenu.classList.add('hidden'); // Menutup menu dan masuk ke kanvas asli
        });
    }

    if (btnGuide) {
        btnGuide.addEventListener('click', () => {
            guideBox.classList.toggle('hidden'); // Membuka/tutup panduan
        });
    }
    // ----------------------------------

    const viewport = document.getElementById('viewport');
    const canvas = document.getElementById('canvas');
    const svg = document.getElementById('svg-connections');
    const addBlockBtn = document.getElementById('add-block-btn');

    let zoom = 1;
    let panX = 0;
    let panY = 0;
    let isPanning = false;
    let startX = 0, startY = 0;

    let activeDot = null;
    let tempPath = null;
    let connections = []; 
    
    let activeCategoryMenu = null;

    window.addEventListener('contextmenu', (e) => e.preventDefault());

    function updateCanvasTransform() {
        canvas.style.transform = `translate(${panX}px, ${panY}px) scale(${zoom})`;
    }

    // (Sisa kodingan aslimu dari sini ke bawah tetap sama persis tanpa ada yang diubah)
    // ... [lanjutkan dengan semua fungsi aslimu: panning, zoom, createNoteBlock, dll]
