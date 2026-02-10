// DATABASE DEI TOOLS
const tools = [
    { id: 'json', title: 'JSON Formatter', icon: 'code-2', desc: 'Formatta, valida e minifica file JSON.' },
    { id: 'jwt', title: 'JWT Debugger', icon: 'shield-check', desc: 'Decodifica e analizza token JWT.' },
    { id: 'hash', title: 'Hash Engine', icon: 'lock', desc: 'Genera hash SHA-256 in tempo reale.' },
    { id: 'qr', title: 'QR Architect', icon: 'qr-code', desc: 'Genera e scarica codici QR personalizzati.' }
];

let favorites = JSON.parse(localStorage.getItem('dh_favs') || '[]');
let currentView = 'grid';

// RENDERIZZA LA GRIGLIA
function renderGrid(filterFavs = false) {
    const grid = document.getElementById('mainGrid');
    const displayTools = filterFavs ? tools.filter(t => favorites.includes(t.id)) : tools;
    
    if (displayTools.length === 0 && filterFavs) {
        grid.innerHTML = `<p class="col-span-full text-slate-500 py-12 text-center">Nessun preferito salvato.</p>`;
        return;
    }

    grid.innerHTML = displayTools.map(tool => `
        <div onclick="openTool('${tool.id}')" class="tool-card glass p-8 rounded-[2.5rem] cursor-pointer relative group">
            <div class="flex justify-between items-start">
                <div class="p-4 bg-emerald-500/10 text-emerald-500 rounded-2xl group-hover:bg-emerald-500 group-hover:text-black transition-colors">
                    <i data-lucide="${tool.icon}"></i>
                </div>
                <button onclick="event.stopPropagation(); toggleFav('${tool.id}')" class="p-2">
                    <i data-lucide="star" class="${favorites.includes(tool.id) ? 'fill-yellow-500 text-yellow-500' : 'text-slate-600 hover:text-yellow-500'} transition-colors"></i>
                </button>
            </div>
            <h3 class="text-2xl font-bold mt-6">${tool.title}</h3>
            <p class="text-slate-500 mt-2 leading-relaxed">${tool.desc}</p>
        </div>
    `).join('');
    lucide.createIcons();
}

// GESTIONE SEZIONI
function showSection(sectionId) {
    const gridSec = document.getElementById('section-grid');
    const toolSec = document.getElementById('section-tool');
    const viewTitle = document.getElementById('view-title');

    if (sectionId === 'grid' || sectionId === 'favs') {
        gridSec.classList.remove('hidden');
        toolSec.classList.add('hidden');
        renderGrid(sectionId === 'favs');
        viewTitle.innerText = sectionId === 'favs' ? 'I tuoi strumenti preferiti.' : 'Strumenti di engineering 100% client-side.';
    }
}

// APRE IL TOOL SPECIFICO
function openTool(toolId) {
    document.getElementById('section-grid').classList.add('hidden');
    document.getElementById('section-tool').classList.remove('hidden');
    const workspace = document.getElementById('toolWorkspace');
    const tool = tools.find(t => t.id === toolId);

    if(tool.id === 'json') {
        workspace.innerHTML = `
            <h2 class="text-3xl font-bold mb-6">${tool.title}</h2>
            <textarea id="jsonInput" class="w-full h-80 bg-black/40 border border-white/10 rounded-3xl p-6 font-mono focus:border-emerald-500 outline-none transition-all" placeholder="Incolla JSON..."></textarea>
            <div class="flex gap-4 mt-6">
                <button onclick="handleJSON('format')" class="bg-emerald-500 text-black px-8 py-4 rounded-2xl font-bold hover:scale-105 transition">Formatta</button>
                <button onclick="handleJSON('minify')" class="bg-white/5 px-8 py-4 rounded-2xl hover:bg-white/10 transition">Minifica</button>
            </div>`;
    } 
    else if(tool.id === 'jwt') {
        workspace.innerHTML = `
            <h2 class="text-3xl font-bold mb-6">${tool.title}</h2>
            <input type="text" id="jwtInput" oninput="decodeJWT()" class="w-full bg-black/40 border border-white/10 rounded-2xl p-6 font-mono mb-8 focus:border-emerald-500 outline-none" placeholder="Incolla Token JWT...">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><span class="text-xs font-bold text-slate-500 ml-2 uppercase">Header</span><pre id="jwtHeader" class="mt-2 p-6 bg-black/20 rounded-3xl text-pink-400 overflow-auto min-h-[150px]"></pre></div>
                <div><span class="text-xs font-bold text-slate-500 ml-2 uppercase">Payload</span><pre id="jwtPayload" class="mt-2 p-6 bg-black/20 rounded-3xl text-emerald-400 overflow-auto min-h-[150px]"></pre></div>
            </div>`;
    }
    else if(tool.id === 'hash') {
        workspace.innerHTML = `
            <h2 class="text-3xl font-bold mb-6">${tool.title}</h2>
            <textarea oninput="generateHash(this.value)" class="w-full h-32 bg-black/40 border border-white/10 rounded-3xl p-6 mb-6 focus:border-emerald-500 outline-none" placeholder="Inserisci testo..."></textarea>
            <div class="p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl">
                <span class="text-xs text-emerald-500 font-bold uppercase">SHA-256 Output</span>
                <p id="shaOutput" class="font-mono text-xl break-all mt-2 text-white">---</p>
            </div>`;
    }
    else if(tool.id === 'qr') {
        workspace.innerHTML = `
            <h2 class="text-3xl font-bold mb-6">${tool.title}</h2>
            <div class="grid md:grid-cols-2 gap-12 items-center">
                <div>
                    <label class="text-sm text-slate-400">Contenuto QR</label>
                    <textarea id="qrInput" oninput="generateQR()" class="w-full h-32 bg-black/40 border border-white/10 rounded-2xl p-4 mt-2 focus:border-emerald-500 outline-none"></textarea>
                    <input type="color" id="qrColor" value="#10b981" onchange="generateQR()" class="w-full h-12 mt-4 rounded-xl bg-transparent border-none cursor-pointer">
                </div>
                <div class="flex flex-col items-center">
                    <canvas id="qrCanvas" class="bg-white p-4 rounded-2xl shadow-2xl"></canvas>
                    <button onclick="downloadQR()" class="mt-6 flex items-center gap-2 text-emerald-500 font-bold hover:underline">
                        <i data-lucide="download" class="w-4 h-4"></i> Scarica PNG
                    </button>
                </div>
            </div>`;
        lucide.createIcons();
    }
}

// --- LOGICHE TOOLS ---

function handleJSON(action) {
    const el = document.getElementById('jsonInput');
    try {
        const obj = JSON.parse(el.value);
        el.value = action === 'format' ? JSON.stringify(obj, null, 4) : JSON.stringify(obj);
    } catch(e) { alert("JSON non valido"); }
}

function decodeJWT() {
    const val = document.getElementById('jwtInput').value;
    const parts = val.split('.');
    try {
        document.getElementById('jwtHeader').innerText = JSON.stringify(JSON.parse(atob(parts[0])), null, 2);
        document.getElementById('jwtPayload').innerText = JSON.stringify(JSON.parse(atob(parts[1])), null, 2);
    } catch(e) { /* silent fail */ }
}

async function generateHash(text) {
    if(!text) { document.getElementById('shaOutput').innerText = '---'; return; }
    const msgUint8 = new TextEncoder().encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashHex = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
    document.getElementById('shaOutput').innerText = hashHex;
}

function generateQR() {
    const text = document.getElementById('qrInput').value;
    const color = document.getElementById('qrColor').value;
    if(!text) return;
    QRCode.toCanvas(document.getElementById('qrCanvas'), text, { width: 200, color: { dark: color } });
}

function downloadQR() {
    const link = document.createElement('a');
    link.download = 'qrcode.png';
    link.href = document.getElementById('qrCanvas').toDataURL();
    link.click();
}

function toggleFav(id) {
    favorites.includes(id) ? favorites = favorites.filter(f => f !== id) : favorites.push(id);
    localStorage.setItem('dh_favs', JSON.stringify(favorites));
    renderGrid(document.getElementById('view-title').innerText.includes('preferiti'));
}

document.addEventListener('DOMContentLoaded', () => {
    renderGrid();
    lucide.createIcons();
});
