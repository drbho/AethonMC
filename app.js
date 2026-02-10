// DATABASE DEI TOOLS
const tools = [
    { id: 'json', title: 'JSON Formatter', icon: 'code-2', desc: 'Formatta e valida JSON.' },
    { id: 'jwt', title: 'JWT Debugger', icon: 'shield-check', desc: 'Decodifica token JWT.' },
    { id: 'hash', title: 'Hash Engine', icon: 'lock', desc: 'Genera hash crittografici.' },
    { id: 'qr', title: 'QR Architect', icon: 'qr-code', desc: 'Genera codici QR.' }
];

// VARIABILI GLOBALI
let favorites = JSON.parse(localStorage.getItem('dh_favs') || '[]');

// FUNZIONE PRINCIPALE: CARICA LA GRIGLIA DEI TOOLS
function renderGrid() {
    const grid = document.getElementById('mainGrid');
    grid.innerHTML = tools.map(tool => `
        <div onclick="openTool('${tool.id}')" class="tool-card glass p-8 rounded-[2.5rem] cursor-pointer">
            <div class="flex justify-between">
                <div class="p-4 bg-emerald-500/10 text-emerald-500 rounded-2xl">
                    <i data-lucide="${tool.icon}"></i>
                </div>
                <button onclick="event.stopPropagation(); toggleFav('${tool.id}')">
                    <i data-lucide="star" class="${favorites.includes(tool.id) ? 'fill-yellow-500 text-yellow-500' : 'text-slate-700'}"></i>
                </button>
            </div>
            <h3 class="text-2xl font-bold mt-6">${tool.title}</h3>
            <p class="text-slate-500 mt-2">${tool.desc}</p>
        </div>
    `).join('');
    lucide.createIcons(); // Aggiorna le icone
}

// FUNZIONE: APRE UN TOOL SPECIFICO
function openTool(toolId) {
    document.getElementById('section-grid').classList.add('hidden');
    document.getElementById('section-tool').classList.remove('hidden');

    const workspace = document.getElementById('toolWorkspace');
    const tool = tools.find(t => t.id === toolId);

    if(tool.id === 'json') {
        workspace.innerHTML = `
            <h2 class="text-3xl font-bold mb-6">${tool.title}</h2>
            <textarea id="jsonInput" class="w-full h-64 bg-black/50 border border-emerald-500/30 rounded-2xl p-6 font-mono" placeholder="Incolla il tuo JSON qui..."></textarea>
            <div class="flex gap-4 mt-6">
                <button onclick="formatJSON()" class="bg-emerald-500 text-black px-8 py-4 rounded-2xl font-bold">Formatta</button>
                <button onclick="minifyJSON()" class="bg-white/5 px-8 py-4 rounded-2xl">Minifica</button>
            </div>
        `;
    }
    // Puoi aggiungere qui altri tool (jwt, hash, qr...) nello stesso modo!
}

// FUNZIONI PER IL TOOL JSON (esempio)
function formatJSON() {
    const input = document.getElementById('jsonInput').value;
    try {
        const parsed = JSON.parse(input);
        document.getElementById('jsonInput').value = JSON.stringify(parsed, null, 4);
        alert('✅ JSON formattato!');
    } catch(e) {
        alert('❌ JSON non valido!');
    }
}
function minifyJSON() {
    const input = document.getElementById('jsonInput').value;
    try {
        const parsed = JSON.parse(input);
        document.getElementById('jsonInput').value = JSON.stringify(parsed);
        alert('✅ JSON minificato!');
    } catch(e) {
        alert('❌ JSON non valido!');
    }
}

// FUNZIONI PER LA UI
function showSection(sectionId) {
    document.getElementById('section-grid').classList.toggle('hidden', sectionId !== 'grid');
    document.getElementById('section-tool').classList.toggle('hidden', sectionId === 'grid');
    if(sectionId === 'grid') renderGrid();
}
function toggleFav(toolId) {
    const index = favorites.indexOf(toolId);
    if(index > -1) favorites.splice(index, 1);
    else favorites.push(toolId);
    localStorage.setItem('dh_favs', JSON.stringify(favorites));
    renderGrid();
}

// AVVIA TUTTO QUANDO LA PAGINA E' CARICATA
document.addEventListener('DOMContentLoaded', renderGrid);
