// DATABASE TOOLS
const tools = [
    { id: 'json', title: 'JSON Formatter', icon: 'code-2', desc: 'Formatta, valida e minifica file JSON.' },
    { id: 'jwt', title: 'JWT Debugger', icon: 'shield-check', desc: 'Decodifica token JWT (Header/Payload).' },
    { id: 'qr', title: 'QR Architect', icon: 'qr-code', desc: 'Genera codici QR personalizzati.' },
    { id: 'ai-html', title: 'AI HTML Fixer', icon: 'wand-2', desc: 'Corregge errori di sintassi HTML automaticamente.' },
    { id: 'ai-video', title: 'AI Video Lab', icon: 'video', desc: 'Rilevamento oggetti AI e Download Video.' }
];

let favorites = JSON.parse(localStorage.getItem('dh_favs') || '[]');
let mediaRecorder;
let recordedChunks = [];

// RENDER GRID
function renderGrid(filterFavs = false) {
    const grid = document.getElementById('mainGrid');
    const displayTools = filterFavs ? tools.filter(t => favorites.includes(t.id)) : tools;
    
    grid.innerHTML = displayTools.map(tool => `
        <div onclick="openTool('${tool.id}')" class="tool-card glass p-8 rounded-[2.5rem] relative">
            <div class="flex justify-between items-start">
                <div class="p-4 bg-emerald-500/10 text-emerald-500 rounded-2xl"><i data-lucide="${tool.icon}"></i></div>
                <button onclick="event.stopPropagation(); toggleFav('${tool.id}')">
                    <i data-lucide="star" class="${favorites.includes(tool.id) ? 'fill-yellow-500 text-yellow-500' : 'text-slate-700'}"></i>
                </button>
            </div>
            <h3 class="text-2xl font-bold mt-6">${tool.title}</h3>
            <p class="text-slate-500 mt-2 text-sm leading-relaxed">${tool.desc}</p>
        </div>
    `).join('');
    lucide.createIcons();
}

// NAVIGATION
function showSection(id) {
    document.getElementById('section-grid').classList.toggle('hidden', id !== 'grid' && id !== 'favs');
    document.getElementById('section-tool').classList.toggle('hidden', id === 'grid' || id === 'favs');
    if (id === 'grid' || id === 'favs') renderGrid(id === 'favs');
}

// OPEN TOOL LOGIC
function openTool(id) {
    showSection('tool');
    const workspace = document.getElementById('toolWorkspace');
    const tool = tools.find(t => t.id === id);

    if (id === 'json') {
        workspace.innerHTML = `
            <h2 class="text-3xl font-bold mb-6 italic underline decoration-emerald-500 decoration-4">${tool.title}</h2>
            <textarea id="jsonIn" class="w-full h-80 bg-black/40 border border-white/10 rounded-3xl p-6 font-mono text-sm outline-none focus:border-emerald-500" placeholder="Incolla JSON..."></textarea>
            <div class="mt-6 flex gap-4">
                <button onclick="runJSON('format')" class="bg-emerald-500 text-black px-10 py-3 rounded-xl font-bold">Formatta</button>
                <button onclick="runJSON('minify')" class="bg-white/5 px-10 py-3 rounded-xl">Minifica</button>
            </div>`;
    } 
    else if (id === 'jwt') {
        workspace.innerHTML = `
            <h2 class="text-3xl font-bold mb-6 italic underline decoration-emerald-500 decoration-4">${tool.title}</h2>
            <input type="text" id="jwtIn" oninput="runJWT()" class="w-full bg-black/40 border border-white/10 rounded-2xl p-6 font-mono mb-8 outline-none focus:border-emerald-500" placeholder="Incolla JWT...">
            <div class="grid md:grid-cols-2 gap-6 text-sm">
                <pre id="jwtH" class="p-6 bg-black/30 rounded-3xl text-pink-400 overflow-auto min-h-[200px] border border-white/5"></pre>
                <pre id="jwtP" class="p-6 bg-black/30 rounded-3xl text-emerald-400 overflow-auto min-h-[200px] border border-white/5"></pre>
            </div>`;
    }
    else if (id === 'qr') {
        workspace.innerHTML = `
            <h2 class="text-3xl font-bold mb-6 italic underline decoration-emerald-500 decoration-4">${tool.title}</h2>
            <div class="grid md:grid-cols-2 gap-12 items-center text-center">
                <div>
                    <textarea id="qrIn" oninput="runQR()" class="w-full h-40 bg-black/40 border border-white/10 rounded-3xl p-6 outline-none focus:border-emerald-500" placeholder="URL o testo..."></textarea>
                    <input type="color" id="qrColor" value="#10b981" onchange="runQR()" class="w-full h-12 mt-4 rounded-xl cursor-pointer bg-transparent border-none">
                </div>
                <div class="flex flex-col items-center">
                    <canvas id="qrCanvas" class="bg-white p-4 rounded-3xl shadow-2xl"></canvas>
                    <button onclick="downloadQR()" class="mt-6 text-emerald-500 font-bold hover:underline">Scarica PNG</button>
                </div>
            </div>`;
    }
    else if (id === 'ai-html') {
        workspace.innerHTML = `
            <h2 class="text-3xl font-bold mb-6 italic underline decoration-emerald-500 decoration-4">${tool.title}</h2>
            <div class="grid md:grid-cols-2 gap-6">
                <textarea id="htmlIn" class="h-80 bg-black/40 border border-white/10 rounded-3xl p-6 font-mono text-sm outline-none focus:border-emerald-500" placeholder="HTML da correggere..."></textarea>
                <pre id="htmlOut" class="h-80 bg-emerald-500/5 border border-emerald-500/20 rounded-3xl p-6 text-emerald-400 overflow-auto"></pre>
            </div>
            <button onclick="runAiHTML()" class="mt-8 bg-emerald-500 text-black px-12 py-4 rounded-2xl font-bold">Correggi Syntax</button>`;
    }
    else if (id === 'ai-video') {
        workspace.innerHTML = `
            <h2 class="text-3xl font-bold mb-6 italic underline decoration-emerald-500 decoration-4">${tool.title}</h2>
            <div class="relative rounded-[2rem] overflow-hidden bg-black aspect-video border border-white/10 max-w-4xl mx-auto shadow-2xl" id="vidContainer">
                <video id="vSource" crossorigin="anonymous" class="w-full h-full object-contain"></video>
                <canvas id="vCanvas" class="absolute top-0 left-0 w-full h-full pointer-events-none"></canvas>
            </div>
            <div class="mt-8 flex flex-wrap justify-center gap-4">
                <input type="file" id="fIn" accept="video/*" onchange="loadVideo(event)" class="hidden">
                <button onclick="document.getElementById('fIn').click()" class="bg-white/10 px-8 py-4 rounded-2xl border border-white/10 hover:bg-white/20">Carica Video</button>
                <button onclick="startAiVideo()" id="btnStart" class="bg-emerald-500 text-black px-8 py-4 rounded-2xl font-bold">Attiva AI & Registra</button>
                <button onclick="stopAndSave()" id="btnStop" class="hidden bg-red-600 text-white px-8 py-4 rounded-2xl font-bold">Ferma e Salva WebM</button>
            </div>`;
    }
    lucide.createIcons();
}

// --- FUNZIONI OPERATIVE ---

function runJSON(mode) {
    const el = document.getElementById('jsonIn');
    try {
        const obj = JSON.parse(el.value);
        el.value = mode === 'format' ? JSON.stringify(obj, null, 4) : JSON.stringify(obj);
    } catch(e) { alert("JSON non valido"); }
}

function runJWT() {
    const val = document.getElementById('jwtIn').value.split('.');
    try {
        document.getElementById('jwtH').innerText = JSON.stringify(JSON.parse(atob(val[0])), null, 2);
        document.getElementById('jwtP').innerText = JSON.stringify(JSON.parse(atob(val[1])), null, 2);
    } catch(e) {}
}

function runQR() {
    const t = document.getElementById('qrIn').value;
    if(!t) return;
    QRCode.toCanvas(document.getElementById('qrCanvas'), t, { width: 220, color: { dark: document.getElementById('qrColor').value } });
}

function downloadQR() {
    const a = document.createElement('a'); a.download = 'qr.png';
    a.href = document.getElementById('qrCanvas').toDataURL(); a.click();
}

function runAiHTML() {
    let inp = document.getElementById('htmlIn').value;
    let fixed = inp.trim();
    if (!fixed.toLowerCase().includes('<!doctype')) fixed = `<!DOCTYPE html>\n` + fixed;
    fixed = fixed.replace(/<br>/g, '<br />').replace(/<img>/g, '<img />').replace(/<hr>/g, '<hr />');
    document.getElementById('htmlOut').innerText = "/* AI SYNTAX FIXED */\n\n" + fixed;
}

// --- VIDEO AI & EXPORT LOGIC ---

function loadVideo(e) {
    const video = document.getElementById('vSource');
    video.src = URL.createObjectURL(e.target.files[0]);
    video.onloadedmetadata = () => {
        const canvas = document.getElementById('vCanvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
    };
}

async function startAiVideo() {
    const video = document.getElementById('vSource');
    const canvas = document.getElementById('vCanvas');
    const ctx = canvas.getContext('2d');
    const sBtn = document.getElementById('btnStart');
    const pBtn = document.getElementById('btnStop');

    sBtn.innerText = "Caricamento Modello...";
    const model = await cocoSsd.load();
    sBtn.classList.add('hidden');
    pBtn.classList.add('ai-active');
    pBtn.classList.remove('hidden');

    // REGISTRAZIONE CANVAS
    const stream = canvas.captureStream(30);
    mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
    recordedChunks = [];
    mediaRecorder.ondataavailable = (e) => { if(e.data.size > 0) recordedChunks.push(e.data); };
    mediaRecorder.start();

    video.play();

    async function process() {
        if (video.paused || video.ended) return;
        const predictions = await model.detect(video);
        
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        predictions.forEach(p => {
            ctx.strokeStyle = '#10b981';
            ctx.lineWidth = 4;
            ctx.strokeRect(p.bbox[0], p.bbox[1], p.bbox[2], p.bbox[3]);
            ctx.fillStyle = '#10b981';
            ctx.font = '22px Inter';
            ctx.fillText(p.class.toUpperCase(), p.bbox[0], p.bbox[1] > 20 ? p.bbox[1] - 10 : 20);
        });
        requestAnimationFrame(process);
    }
    process();
}

function stopAndSave() {
    mediaRecorder.stop();
    mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'devhub-ai-export.webm';
        a.click();
        location.reload(); 
    };
}

// UTILS
function toggleFav(id) {
    const idx = favorites.indexOf(id);
    idx > -1 ? favorites.splice(idx, 1) : favorites.push(id);
    localStorage.setItem('dh_favs', JSON.stringify(favorites));
    renderGrid(document.getElementById('view-title').innerText.includes('preferiti'));
}

document.addEventListener('DOMContentLoaded', () => {
    renderGrid();
    lucide.createIcons();
});
