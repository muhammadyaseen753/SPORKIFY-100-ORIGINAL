const API = 'https://forkify-api.herokuapp.com/api/v2/recipes';
const KEY = '1b8efbce-031c-49ba-8603-bcd90b1377b2';

async function execute() {
    const q = document.getElementById('query').value;
    if (!q.trim()) return;
    
    const resBox = document.getElementById('results');
    resBox.innerHTML = '<div class="loading"><div class="loading-dot"></div><div class="loading-dot"></div><div class="loading-dot"></div></div>';

    try {
        const res = await fetch(`https://forkify-api.herokuapp.com/api/v2/recipes?search=${q}&key=${KEY}`);
        const data = await res.json();
        
        const recipes = data.data.recipes;
        document.getElementById('recipeCount').textContent = recipes.length;
        
        resBox.innerHTML = recipes.map((r, i) => `
            <div class="card" id= "${r.id}" onclick="load('${r.id}',this)" style="animation: card-entry 0.5s ${i * 0.05}s cubic-bezier(0.34, 1.56, 0.64, 1) backwards;">
                <img src="${r.image_url}" alt="${r.title}">
                <div class="card-info">
                    <h4>${r.title}</h4>
                    <p>${r.publisher}</p>
                </div>
            </div>
        `).join('');
    } catch (err) {
        resBox.innerHTML = '<div class="empty-state">Error Loading</div>';
    }
}

async function load(id, el) {
    document.querySelectorAll('.card').forEach(c => c.classList.remove('active'));
    el.classList.add('active');

    const view = document.getElementById('viewport');
    view.innerHTML = '<div class="loading"><div class="loading-dot"></div><div class="loading-dot"></div><div class="loading-dot"></div></div>';

    try {
        // FIXED: fetch BEFORE using data, use correct id parameter, remove search query
        const res = await fetch(`${API}/${id}?key=${KEY}`);
        const data = await res.json();
        const r = data.data.recipe;
        
        view.innerHTML = `
            <img src="${r.image_url}" class="hero-img" alt="${r.title}">
            <h1 class="recipe-title">${r.title}</h1>
            <div class="grid-info">
                <div>
                    <ul class="ing-list">
                        ${r.ingredients.map((ing, i) => `
                            <li style="animation: ing-entry 0.4s ${i * 0.05}s cubic-bezier(0.34, 1.56, 0.64, 1) backwards;">
                                <span>${ing.description}</span>
                                <b>${ing.quantity || ''} ${ing.unit || ''}</b>
                            </li>
                        `).join('')}
                    </ul>
                </div>
                <div class="meta-panel">
                    <h3 class="meta-header">METADATA</h3>
                    <div class="meta-item">
                        <span class="meta-label">Cook Time</span>
                        <span class="meta-value">${r.cooking_time}'</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">Servings</span>
                        <span class="meta-value">${r.servings}</span>
                    </div>
                    <a href="${r.source_url}" target="_blank" class="btn-instructions">View Instructions →</a>
                </div>
            </div>
        `;
    } catch (err) {
        view.innerHTML = '<div class="empty-state">Error Loading Recipe</div>';
    }
}