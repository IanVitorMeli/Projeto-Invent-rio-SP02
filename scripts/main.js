// =====================
// SUPABASE CONFIG
// =====================
const SUPABASE_URL = "https://vgfyqhbyjnywurmnflua.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_AGzdD-xbwe643OXPg50uYw_gDCoLQvc";
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// =====================
// ELEMENTOS DOM
// =====================
const grid = document.getElementById('inventory-grid');
const modal = document.getElementById('edit-modal');
const body = document.body;
const themeBtn = document.getElementById('theme-btn');
const searchInput = document.getElementById('search-input');
const menuItems = document.querySelectorAll('.menu-item');
const statusFilters = document.querySelectorAll('.status-filter');
const tagFilters = document.querySelectorAll('.tag-filter');
const triagemSection = document.getElementById('triagem-section');

// =====================
// DADOS
// =====================
let inventoryData = [];

// Mapeamento de ícones por categoria
const categoryIcons = {
    'periféricos': 'fa-keyboard',
    'monitores': 'fa-display',
    'logística': 'fa-barcode',
    'infra': 'fa-laptop'
};

// =====================
// CARREGAR DADOS DO SUPABASE
// =====================
async function loadInventory() {
    const { data, error } = await supabaseClient
        .from('ativos')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Erro ao carregar inventário:', error.message);
        grid.innerHTML = `<p style="color:red;">Erro ao carregar dados.</p>`;
        return;
    }

    inventoryData = data || [];
    renderItems();
}

// =====================
// RENDERIZAÇÃO
// =====================
function renderItems() {
    grid.innerHTML = '';

    if (!inventoryData.length) {
        grid.innerHTML = `<p style="color: var(--text-gray);">Nenhum ativo cadastrado.</p>`;
        return;
    }

    inventoryData.forEach((item, i) => {
        const html = `
            <div class="card" 
                 data-id="${item.id}"
                 data-category="${item.categoria}" 
                 data-status="${item.status}" 
                 data-tag="${item.tag}" 
                 style="animation-delay: ${i * 0.05}s">
                
                <i class="fa-solid fa-gear card-settings" onclick="openEditModal('${item.id}')"></i>
                
                <div class="card-icon">
                    <i class="fa-solid ${categoryIcons[item.categoria] || 'fa-box'}"></i>
                </div>

                <span class="card-name">${item.nome}</span>
                <p style="font-size: 13px; color: var(--text-gray);">Patrimônio TI - Lote 2024.</p>

                <div style="display:flex; justify-content:space-between; align-items:center; margin-top:auto;">
                    <span class="tag ${item.status === 'estoque' ? 'in' : 'out'}">
                        ${item.status === 'estoque' ? 'Operacional' : item.tag}
                    </span>
                    <span class="abbr">${item.codigo_patrimonio}</span>
                </div>
            </div>
        `;
        grid.insertAdjacentHTML('beforeend', html);
    });

    filterInventory();
}

// =====================
// MODAL
// =====================
function openEditModal(id) {
    const item = inventoryData.find(x => x.id === id);
    if (!item) return;

    document.getElementById('edit-index').value = id;
    document.getElementById('edit-name').value = item.nome;
    document.getElementById('edit-code').value = item.codigo_patrimonio;
    document.getElementById('edit-category').value = item.categoria;
    document.getElementById('edit-status').value = item.status;
    document.getElementById('edit-tag').value = item.tag;

    modal.style.display = 'flex';
}

function closeModal() {
    modal.style.display = 'none';
}

async function saveChanges() {
    const id = document.getElementById('edit-index').value;

    const updatedItem = {
        nome: document.getElementById('edit-name').value,
        categoria: document.getElementById('edit-category').value,
        status: document.getElementById('edit-status').value,
        tag: document.getElementById('edit-tag').value,
        updated_at: new Date().toISOString()
    };

    const { error } = await supabaseClient
        .from('ativos')
        .update(updatedItem)
        .eq('id', id);

    if (error) {
        alert('Erro ao salvar: ' + error.message);
        return;
    }

    closeModal();
    await loadInventory();
}

// =====================
// FECHAR MODAL FORA
// =====================
window.onclick = function(event) {
    if (event.target == modal) closeModal();
};

// =====================
// TEMA
// =====================
themeBtn.addEventListener('click', () => {
    const current = body.getAttribute('data-theme');
    body.setAttribute('data-theme', current === 'light' ? 'dark' : 'light');
});

// =====================
// FILTROS
// =====================
function updateFilterVisibility() {
    const activeCategory = document.querySelector('.menu-item.active').dataset.category;
    const searchTerm = searchInput.value.toLowerCase();
    const labels = triagemSection.querySelectorAll('.filter-label');
    const cards = document.querySelectorAll('.card');
    
    let visibleCategories = new Set();
    cards.forEach(card => {
        const name = card.querySelector('.card-name')?.innerText.toLowerCase() || '';
        const category = card.dataset.category;
        if (name.includes(searchTerm) && (activeCategory === 'todos' || category === activeCategory)) {
            visibleCategories.add(category);
        }
    });

    let anyVisible = false;
    labels.forEach(label => {
        const targets = label.getAttribute('data-for').split(' ');
        const shouldShow = Array.from(visibleCategories).some(c => targets.includes(c));
        if (shouldShow || (activeCategory === 'todos' && searchTerm === "")) {
            label.style.display = 'flex';
            anyVisible = true;
        } else {
            label.style.display = 'none';
        }
    });

    triagemSection.style.display = anyVisible ? 'block' : 'none';
}

function filterInventory() {
    const searchTerm = searchInput.value.toLowerCase();
    const activeCategory = document.querySelector('.menu-item.active').dataset.category;
    const enabledStatuses = Array.from(statusFilters).filter(i => i.checked).map(i => i.value);
    const enabledTags = Array.from(tagFilters).filter(i => i.checked).map(i => i.value);
    
    document.querySelectorAll('.card').forEach(card => {
        const name = card.querySelector('.card-name')?.innerText.toLowerCase() || '';
        const matchesSearch = name.includes(searchTerm);
        const matchesCategory = (activeCategory === 'todos' || card.dataset.category === activeCategory);
        const matchesStatus = enabledStatuses.includes(card.dataset.status);
        const matchesTag = (card.dataset.tag === 'ok') || enabledTags.includes(card.dataset.tag);
        
        const isVisible = matchesSearch && matchesCategory && matchesStatus && matchesTag;
        card.classList.toggle('hidden', !isVisible);
    });

    updateFilterVisibility();
}

searchInput.addEventListener('input', filterInventory);
menuItems.forEach(item => item.addEventListener('click', () => {
    menuItems.forEach(i => i.classList.remove('active'));
    item.classList.add('active');
    filterInventory();
}));
[...statusFilters, ...tagFilters].forEach(f => f.addEventListener('change', filterInventory));

// =====================
// EXPOR FUNÇÕES
// =====================
window.openEditModal = openEditModal;
window.closeModal = closeModal;
window.saveChanges = saveChanges;

// =====================
// INICIALIZAÇÃO
// =====================
loadInventory();

const logoutBtn = document.getElementById("logout-btn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    await supabaseClient.auth.signOut();
    window.location.href = "login.html";
  });
}