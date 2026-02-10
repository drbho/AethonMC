// DATABASE TOOLS
const tools = [
    { id: 'json', title: 'JSON Formatter', icon: 'code-2', desc: 'Valida, formatta e minifica strutture JSON.' },
    { id: 'jwt', title: 'JWT Debugger', icon: 'shield-check', desc: 'Decodifica token JWT Header e Payload.' },
    { id: 'hash', title: 'Hash Engine', icon: 'lock', desc: 'Genera hash SHA-256 in tempo reale.' },
    { id: 'qr', title: 'QR Architect', icon: 'qr-code', desc: 'Crea QR Code personalizzati e scaricali.' },
    { id: 'video', title: 'Video Lab', icon: 'video', desc: 'Filtri video e Screen Recording rapido.' }
];

let favorites = JSON.parse(localStorage.getItem('dh_favs') || '[]');

// RENDER GRIGLIA
function renderGrid(filterFavs = false) {
    const grid = document.getElementById('mainGrid');
    const displayTools = filterFavs ? tools.filter(t => favorites.includes(t.id)) : tools;
    
    grid.innerHTML = displayTools.map(tool => `
        <div onclick="openTool('${tool.id}')" class="tool-card glass p-8 rounded-[2.5rem] cursor-pointer relative">
            <div class="flex justify-between items-start">
                <div class="p-4 bg-emerald-500/10 text-emerald-500 rounded-2xl border border-emerald-500/20">
                    <i data-lucide="${tool.icon}"></i>
                </div>
                <button onclick="event.stopPropagation(); toggleFav('${tool.id}')">
                    <i data-lucide="star" class="${favorites.includes(tool.id) ? 'fill-yellow-500 text-yellow-500' : 'text-slate-700 hover:text-yellow-500'} transition-all"></i>
                </button>
            </div>
            <h3 class="text-2xl font-bold mt-6">${tool.title}</h3>
            <p class="text-slate-500 mt-2 text-sm leading-relaxed">${tool.desc}</p>
        </div>
    `).join('');
    lucide.createIcons();
}

// LOGICA SEZIONI
function showSection(id) {
    document.getElementById('section-grid').classList.toggle('hidden', id !== 'grid' && id !== 'favs');
    document.getElementById('section-tool').classList.toggle('hidden', id === 'grid' || id === 'favs');
    
    document.getElementById('btn-grid').classList.toggle('active-nav', id === 'grid');
    document.getElementById('btn-favs').classList.toggle('active-nav', id === 'favs');

    if(id === 'grid' || id === 'favs') renderGrid(id === 'favs');
}

// APERTURA TOOLS
function openTool(toolId) {
    showSection('tool');
    const workspace = document.getElementById('toolWorkspace');
    const tool = tools.find(t => t.id === toolId);

    if(toolId === 'json') {
        workspace.innerHTML = `
            <h2 class="text-3xl font-bold mb-6 italic underline decoration-emerald-500 underline-offset-8">${tool.title}</h2>
            <textarea id="jsonInput" class="w-full h-80 bg-black/40 border border-white/10 rounded-3xl p-6 outline-none focus:border-emerald-500 transition-all font-mono text-sm" placeholder="Incolla JSON qui..."></textarea>
            <div class="flex gap-4 mt-6">
                <button onclick="processJSON('format')" class="bg-emerald-500 text-black px-8 py-3 rounded-2xl font-bold hover:bg-emerald-400 transition">Formatta</button>
                <button onclick="processJSON('minify')" class="bg-white/5 px-8 py-3 rounded-2xl hover:bg-white/10 transition">Minifica</button>
            </div>`;
    } 
    else if(toolId === 'jwt') {
        workspace.innerHTML = `
            <h2 class="text-3xl font-bold mb-6 italic underline decoration-emerald-500 underline-offset-8">${tool.title}</h2>
            <input type="text" id="jwtInput" oninput="decodeJWT()" class="w-full bg-black/40 border border-white/10 rounded-2xl p-6 font-mono mb-8 focus:border-emerald-500 outline-none" placeholder="Incolla JWT...">
            <div class="grid md:grid-cols-2 gap-6">
                <div><label class="text-[10px] font-bold text-slate-500 uppercase ml-2">Header</label><pre id="jwtH" class="mt-2 p-6 bg-black/30 rounded-3xl text-pink-400 text-sm overflow-auto min-h-[200px]"></pre></div>
                <div><label class="text-[10px] font-bold text-slate-500 uppercase ml-2">Payload</label><pre id="jwtP" class="mt-2 p-6 bg-black/30 rounded-3xl text-emerald-400 text-sm overflow-auto min-h-[200px]"></pre></div>
            </div>`;
    }
    else if(toolId === 'hash') {
        workspace.innerHTML = `
            <h2 class="text-3xl font-bold mb-6 italic underline decoration-emerald-500 underline-offset-8">${tool.title}</h2>
            <textarea oninput="generateHash(this.value)" class="w-full h-32 bg-black/40 border border-white/10 rounded-3xl p-6 focus:border-emerald-500 outline-none mb-6" placeholder="Testo da convertire in SHA-256..."></textarea>
            <div class="p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl font-mono break-all text-emerald-500" id="hashOut">---</div>`;
    }
    else if(toolId === 'qr') {
        workspace.innerHTML = `
            <h2 class="text-3xl font-bold mb-6 italic underline decoration-emerald-500 underline-offset-8">${tool.title}</h2>
            <div class="grid md:grid-cols-2 gap-12">
                <div>
                    <textarea id="qrIn" oninput="genQR()" class="w-full h-40 bg-black/40 border border-white/10 rounded-3xl p-6 focus:border-emerald-500 outline-none" placeholder="Link o testo..."></textarea>
                    <input type="color" id="qrCol" value="#10b981" onchange="genQR()" class="w-full h-12 mt-4 rounded-xl cursor-pointer bg-transparent border-none">
                </div>
                <div class="flex flex-col items-center">
                    <canvas id="qrCanvas" class="bg-white p-4 rounded-3xl shadow-2xl"></canvas>
                    <button onclick="downloadQR()" class="mt-6 text-emerald-500 font-bold hover:underline">Scarica PNG</button>
                </div>
            </div>`;
    }
    else if(toolId === 'video') {
        workspace.innerHTML = `
            <h2 class="text-3xl font-bold mb-6 italic underline decoration-emerald-500 underline-offset-8">${tool.title}</h2>
            <div class="grid lg:grid-cols-3 gap-8">
                <div class="lg:col-span-2 space-y-4">
                    <div id="vContainer" class="aspect-video bg-black rounded-3xl border border-white/5 overflow-hidden flex items-center justify-center relative">
                        <video id="vPrev" controls class="w-full h-full hidden"></video>
                        <div id="vDrop" onclick="document.getElementById('vFile').click()" class="text-center p-10 cursor-pointer">
                            <i data-lucide="video" class="mx-auto w-12 h-12 text-emerald-500/30 mb-4"></i>
                            <p class="text-slate-500">Apri un video o registra lo schermo</p>
                            <input type="file" id="vFile" accept="video/*" class="hidden" onchange="loadV(event)">
                        </div>
                    </div>
                    <button onclick="recScreen()" class="w-full py-4 bg-red-500/10 text-red-500 rounded-2xl font-bold hover:bg-red-500 hover:text-white transition">Registra Schermo</button>
                </div>
                <div class="space-y-6">
                    <div class="p-4 bg-white/5 rounded-2xl">
                        <label class="text-[10px] font-bold text-slate-400 uppercase">Filtri CSS Live</label>
                        <input type="range" min="0" max="100" value="0" oninput="vFilter()" id="vG" class="w-full accent-emerald-500 mt-4" title="Grayscale">
                        <input type="range" min="0" max="20" value="0" oninput="vFilter()" id="vB" class="w-full accent-emerald-500 mt-4" title="Blur">
                    </div>
                </div>
            </div>`;
        lucide.createIcons();
    }
}

// --- TOOL LOGIC FUNCTIONS ---

function processJSON(mode) {
    const inp = document.getElementById('jsonInput');
    try {
        const obj = JSON.parse(inp.value);
        inp.value = mode === 'format' ? JSON.stringify(obj, null, 4) : JSON.stringify(obj);
    } catch(e) { alert("Invalid JSON"); }
}

function decodeJWT() {
    const val = document.getElementById('jwtInput').value.split('.');
    try {
        document.getElementById('jwtH').innerText = JSON.stringify(JSON.parse(atob(val[0])), null, 2);
        document.getElementById('jwtP').innerText = JSON.stringify(JSON.parse(atob(val[1])), null, 2);
    } catch(e) {}
}

async function generateHash(t) {
    if(!t) return document.getElementById('hashOut').innerText = '---';
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(t));
    document.getElementById('hashOut').innerText = Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function genQR() {
    const t = document.getElementById('qrIn').value;
    if(!t) return;
    QRCode.toCanvas(document.getElementById('qrCanvas'), t, { width: 220, color: { dark: document.getElementById('qrCol').value } });
}

function downloadQR() {
    const a = document.createElement('a');
    a.download = 'qr.png';
    a.href = document.getElementById('qrCanvas').toDataURL();
    a.click();
}

function loadV(e) {
    const f = e.target.files[0];
    const v = document.getElementById('vPrev');
    v.src = URL.createObjectURL(f);
    v.classList.remove('hidden');
    document.getElementById('vDrop').classList.add('hidden');
}

function vFilter() {
    const v = document.getElementById('vPrev');
    v.style.filter = `grayscale(${document.getElementById('vG').value}%) blur(${document.getElementById('vB').value}px)`;
}

async function recScreen() {
    try {
        const s = await navigator.mediaDevices.getDisplayMedia({ video: true });
        const v = document.getElementById('vPrev');
        v.srcObject = s;
        v.classList.remove('hidden');
        document.getElementById('vDrop').classList.add('hidden');
        v.play();
    } catch(err) { console.error(err); }
}

function toggleFav(id) {
    favorites.includes(id) ? favorites = favorites.filter(x => x !== id) : favorites.push(id);
    localStorage.setItem('dh_favs', JSON.stringify(favorites));
    renderGrid(document.getElementById('btn-favs').classList.contains('active-nav'));
}

// INIT
document.addEventListener('DOMContentLoaded', () => {
    renderGrid();
    lucide.createIcons();
});
