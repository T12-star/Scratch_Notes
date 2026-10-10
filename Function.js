document.addEventListener('DOMContentLoaded', () => {
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
    let connections = []; // [{fromDot, toDot, pathElem}]
    
    let activeCategoryMenu = null; // Referensi menu melayang

    window.addEventListener('contextmenu', (e) => e.preventDefault());

    function updateCanvasTransform() {
        canvas.style.transform = `translate(${panX}px, ${panY}px) scale(${zoom})`;
    }

    // --- 1. PANNING & ZOOM ---
    viewport.addEventListener('mousedown', (e) => {
        if (e.button === 2 && !e.target.classList.contains('connection-path')) {
            isPanning = true;
            startX = e.clientX - panX;
            startY = e.clientY - panY;
        }
    });

    window.addEventListener('mousemove', (e) => {
        if (isPanning) {
            panX = e.clientX - startX;
            panY = e.clientY - startY;
            updateCanvasTransform();
        }

        if (activeDot && tempPath) {
            const start = getDotCenter(activeDot);
            const mouseX = (e.clientX - panX) / zoom;
            const mouseY = (e.clientY - panY) / zoom;
            
            tempPath.setAttribute('d', createCurvedPath(start.x, start.y, mouseX, mouseY));
        }
    });

    window.addEventListener('mouseup', (e) => {
        if (e.button === 2) isPanning = false;

        if (activeDot && tempPath) {
            tempPath.remove();
            tempPath = null;
            activeDot = null;
        }
    });

    viewport.addEventListener('wheel', (e) => {
        e.preventDefault();
        const factor = 0.1;
        zoom = e.deltaY < 0 ? Math.min(zoom + factor, 2.5) : Math.max(zoom - factor, 0.3);
        updateCanvasTransform();
    }, { passive: false });

    // --- 2. LOGIKA KONEKSI GARIS TALI ---
    function getDotCenter(dot) {
        const rect = dot.getBoundingClientRect();
        const canvasRect = canvas.getBoundingClientRect();
        return {
            x: (rect.left + rect.width / 2 - canvasRect.left) / zoom,
            y: (rect.top + rect.height / 2 - canvasRect.top) / zoom
        };
    }

    function createCurvedPath(x1, y1, x2, y2) {
        const dx = Math.abs(x2 - x1) * 0.5;
        const cx1 = x1 + Math.max(dx, 50);
        const cy1 = y1;
        const cx2 = x2 - Math.max(dx, 50);
        const cy2 = y2;
        return `M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`;
    }

    function updateLines() {
        connections.forEach(conn => {
            const start = getDotCenter(conn.fromDot);
            const end = getDotCenter(conn.toDot);
            conn.pathElem.setAttribute('d', createCurvedPath(start.x, start.y, end.x, end.y));
        });
    }

    function removeConnection(pathElem) {
        connections = connections.filter(conn => {
            if (conn.pathElem === pathElem) {
                conn.pathElem.remove();
                return false;
            }
            return true;
        });
    }

    function setupDotEvents(dot) {
        dot.addEventListener('mousedown', (e) => {
            if (e.button === 0) {
                e.stopPropagation();
                activeDot = dot;

                const pos = getDotCenter(dot);
                tempPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                tempPath.setAttribute('class', 'connection-path');
                tempPath.setAttribute('d', createCurvedPath(pos.x, pos.y, pos.x, pos.y));
                svg.appendChild(tempPath);
            }
        });

        dot.addEventListener('mouseup', (e) => {
            if (activeDot && activeDot !== dot) {
                e.stopPropagation();
                
                const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                path.setAttribute('class', 'connection-path');

                path.addEventListener('contextmenu', (evt) => {
                    evt.stopPropagation();
                    evt.preventDefault();
                    removeConnection(path);
                });

                svg.appendChild(path);

                connections.push({
                    fromDot: activeDot,
                    toDot: dot,
                    pathElem: path
                });

                updateLines();

                if (tempPath) tempPath.remove();
                tempPath = null;
                activeDot = null;
            }
        });
    }

    // --- 3. MEMBUAT BLOK NOTE (DI KANVAS) ---
    function createNoteBlock(x = 100, y = 100, color = "Yellow", titleText = "Note") {
        const node = document.createElement('div');
        node.className = 'func-node';
        node.style.left = `${x}px`;
        node.style.top = `${y}px`;

        let topImg = (color === "White" || !color) ? "Top.png" : `Top_${color}.png`;

        const top = document.createElement('div');
        top.className = 'node-top';

        top.innerHTML = `
            <img src="${topImg}" alt="Top ${color}" draggable="false">
            <input type="text" value="${titleText}">
            <div class="delete-btn" title="Hapus Note">✕</div>
        `;

        const deleteBtn = top.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteNode(node);
        });

        // Container Mid
        const midList = document.createElement('div');
        midList.className = 'node-mid-list';
        addMidBlock(midList);

        // Bottom
        const bottom = document.createElement('div');
        bottom.className = 'node-bottom';
        bottom.innerHTML = `<img src="Bottom.png" alt="Bottom" draggable="false">`;
        
        bottom.addEventListener('click', (e) => {
            e.stopPropagation();
            addMidBlock(midList);
            updateLines();
        });

        node.appendChild(top);
        node.appendChild(midList);
        node.appendChild(bottom);

        makeDraggable(node);
        canvas.appendChild(node);
    }

    function addMidBlock(container) {
        const midItem = document.createElement('div');
        midItem.className = 'node-mid-item';
        
        const dotLeft = document.createElement('div');
        dotLeft.className = 'dot dot-left';

        const dotRight = document.createElement('div');
        dotRight.className = 'dot dot-right';

        midItem.innerHTML = `
            <img src="Mid.png" alt="Mid" draggable="false">
            <input type="text" placeholder="...">
        `;

        midItem.appendChild(dotLeft);
        midItem.appendChild(dotRight);

        setupDotEvents(dotLeft);
        setupDotEvents(dotRight);

        container.appendChild(midItem);
    }

    function deleteNode(node) {
        const dotsInNode = node.querySelectorAll('.dot');
        connections = connections.filter(conn => {
            const isConnected = Array.from(dotsInNode).some(dot => dot === conn.fromDot || dot === conn.toDot);
            if (isConnected) {
                conn.pathElem.remove();
            }
            return !isConnected;
        });

        node.remove();
    }

    // --- 4. POP-UP MENU "BlockCategory" LIST MELAYANG (FOLLOW CAMERA UI) ---
    function toggleCategoryMenu() {
        if (activeCategoryMenu) {
            activeCategoryMenu.remove();
            activeCategoryMenu = null;
            return;
        }

        const menuNode = document.createElement('div');
        menuNode.className = 'func-node ui-category-menu';

        // Header Top
        const top = document.createElement('div');
        top.className = 'node-top';
        top.innerHTML = `
            <img src="Top.png" alt="Top" draggable="false">
            <input type="text" value="BlockCategory" readonly style="cursor: default;">
            <div class="delete-btn" title="Tutup Menu">✕</div>
        `;

        const closeBtn = top.querySelector('.delete-btn');
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            menuNode.remove();
            activeCategoryMenu = null;
        });

        // Mid List Kategori
        const midList = document.createElement('div');
        midList.className = 'node-mid-list';

        const categories = [
            { name: "Yellow", label: "Importan Note",    img: "Mid_Yellow.png" },
            { name: "White",  label: "Note",             img: "Mid.png" },
            { name: "Blue",   label: "Task LIst Note",   img: "Mid_Blue.png" },
            { name: "Green",  label: "Formula Note",     img: "Mid_Green.png" },
            { name: "Purple", label: "Reminder Note",    img: "Mid_Purple.png" }
        ];

        categories.forEach(item => {
            const midItem = document.createElement('div');
            midItem.className = 'node-mid-item';

            midItem.innerHTML = `
                <img src="${item.img}" alt="${item.label}" draggable="false">
                <input type="text" value="${item.label}" readonly>
            `;

            // Event Klik: Membuat Note baru sesuai pilihan & Menutup Menu List
            midItem.addEventListener('click', (e) => {
                e.stopPropagation();
                
                const centerX = (-panX + window.innerWidth / 2 - 110) / zoom;
                const centerY = (-panY + window.innerHeight / 2 - 100) / zoom;

                createNoteBlock(centerX, centerY, item.name, item.label);

                menuNode.remove();
                activeCategoryMenu = null;
            });

            midList.appendChild(midItem);
        });

        // Bottom List Penutup
        const bottom = document.createElement('div');
        bottom.className = 'node-bottom';
        bottom.innerHTML = `<img src="Bottom_List.png" alt="Bottom List" draggable="false">`;

        menuNode.appendChild(top);
        menuNode.appendChild(midList);
        menuNode.appendChild(bottom);

        document.body.appendChild(menuNode);
        activeCategoryMenu = menuNode;
    }

    // --- 5. DRAG NOTE ---
    function makeDraggable(element) {
        let isDragging = false;
        let startMouseX = 0, startMouseY = 0;
        let startElemX = 0, startElemY = 0;

        element.addEventListener('mousedown', (e) => {
            if (e.button === 0 && e.target.tagName !== 'INPUT' && !e.target.classList.contains('dot') && !e.target.classList.contains('delete-btn')) {
                isDragging = true;
                startMouseX = e.clientX;
                startMouseY = e.clientY;
                startElemX = element.offsetLeft;
                startElemY = element.offsetTop;
                e.stopPropagation();
            }
        });

        window.addEventListener('mousemove', (e) => {
            if (isDragging) {
                const dx = (e.clientX - startMouseX) / zoom;
                const dy = (e.clientY - startMouseY) / zoom;
                element.style.left = `${startElemX + dx}px`;
                element.style.top = `${startElemY + dy}px`;
                
                updateLines();
            }
        });

        window.addEventListener('mouseup', () => {
            isDragging = false;
        });
    }

    // Event Tombol "Add Block +" di Kiri Atas
    addBlockBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleCategoryMenu();
    });

    // Note Awal saat website dibuka
    createNoteBlock(200, 150, "White", "Note");
});
