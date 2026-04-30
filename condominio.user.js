// ==UserScript==
// @name         Gerador de Condomínio
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Gerador de JSON de criação de condomínio
// @author       Gemini AI
// @match        https://monitoring.cloud.kiper.com.br/condominiums
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let isDrag = false;
    let isMinimized = true;

    // Cole o conteúdo do arquivo CSV aqui (formato: ID,Nome,Estado,etc...)
    // O script extrairá o ID (antes da primeira vírgula) e o Nome (depois)
    const csvData = `466,Guaíba
465,Barueri
464,Monte Mor
463,Camaragibe
461,Pelotas
460,Rio de Janeiro
459,São Paulo
458,Canoas
457,Porto Alegre
456,Curitiba
455,Belo Horizonte`;

    const cities = csvData.split('\n').map(line => {
        const parts = line.split(',');
        const id = parts[0] ? parts[0].trim() : '';
        const name = parts.slice(1).join(',').trim();
        return { id, name };
    }).filter(c => c.id && c.name && !isNaN(c.id));

    function renderApp() {
        if (document.getElementById('condo-panel')) return;

        const style = document.createElement('style');
        style.id = "condo-style";
        document.head.appendChild(style);

        style.innerHTML = `
            #condo-panel {
                --condo-bg: #f7fef8; --condo-header: #0d5b61; --condo-text: #1c2026;
                --condo-header-text: #ffffff; --condo-border: #d1e0d3; --condo-item: #ebf4ec;
                --condo-input: #ffffff; --condo-green: #268e60; --condo-green-alpha: rgba(38, 142, 96, 0.15);
                position: fixed; top: 200px; right: 20px; z-index: 9999;
                background: var(--condo-bg) !important; border-radius: 10px !important; width: 340px !important;
                box-shadow: 0 8px 32px rgba(0,0,0,0.3) !important; border: 1px solid var(--condo-border) !important;
                font-family: 'Inter', sans-serif !important; color: var(--condo-text) !important;
                overflow: hidden !important; transition: width 0.3s, height 0.3s, opacity 0.3s !important;
                will-change: transform;
            }
            #condo-panel.dark-mode { --condo-bg: #1c2026; --condo-header: #0a2e34; --condo-text: #f7fef8; --condo-border: #2c333c; --condo-item: #242930; --condo-input: #12151a; --condo-green-alpha: rgba(38, 142, 96, 0.3); }
            
            #condo-header { background: var(--condo-header) !important; color: var(--condo-header-text) !important; padding: 12px 15px !important; cursor: move !important; display: flex !important; justify-content: space-between !important; align-items: center !important; border-bottom: 1px solid var(--condo-border) !important; }
            #condo-header span { font-weight: 700 !important; font-size: 12px !important; text-transform: uppercase; user-select: none; }
            #condo-content { padding: 16px !important; }
            .condo-label { font-size: 10px !important; font-weight: 800 !important; color: var(--condo-green) !important; text-transform: uppercase !important; margin-bottom: 6px !important; display: block !important; }
            .condo-input { width: 100% !important; padding: 10px !important; background: var(--condo-input) !important; border: 1px solid var(--condo-border) !important; border-radius: 6px !important; color: var(--condo-text) !important; font-size: 13px !important; margin-bottom: 16px !important; outline: none !important; box-sizing: border-box; }
            .condo-btn-main { background: var(--condo-green) !important; color: white !important; border: none !important; padding: 12px !important; width: 100% !important; border-radius: 8px !important; font-weight: 700 !important; cursor: pointer !important; text-transform: uppercase !important; font-size: 12px !important; }
            
            /* Custom Searchable Dropdown */
            .condo-search-container { position: relative; margin-bottom: 16px; }
            .condo-search-input { width: 100% !important; padding: 10px !important; background: var(--condo-input) !important; border: 1px solid var(--condo-border) !important; border-radius: 6px !important; color: var(--condo-text) !important; font-size: 13px !important; outline: none !important; box-sizing: border-box; }
            .condo-dropdown-list { display: none; position: absolute; top: 100%; left: 0; right: 0; background: var(--condo-input) !important; border: 1px solid var(--condo-border) !important; max-height: 150px; overflow-y: auto; z-index: 10000; border-radius: 0 0 6px 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
            .condo-dropdown-item { padding: 8px 10px; font-size: 12px; cursor: pointer; color: var(--condo-text); border-bottom: 1px solid var(--condo-border); }
            .condo-dropdown-item:hover { background: var(--condo-green-alpha) !important; }
            
            pre { background: #000 !important; color: #2ecc71 !important; padding: 12px !important; border-radius: 8px !important; font-family: monospace !important; font-size: 11px !important; margin-top: 10px !important; overflow-x: auto !important; max-height: 100px !important; border: 1px solid #333 !important;}
            
            #condo-minimized-btn {
                position: fixed; top: 200px; right: 20px; z-index: 9999;
                background: var(--condo-header, #0d5b61) !important; color: white !important; border: none !important;
                padding: 10px 15px !important; border-radius: 8px !important; font-weight: bold !important; cursor: pointer !important;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3) !important; font-family: 'Inter', sans-serif !important; font-size: 12px !important;
            }
        `;

        // Botão minimizado
        const minBtn = document.createElement('button');
        minBtn.id = 'condo-minimized-btn';
        minBtn.textContent = 'Novo Condomínio';
        document.body.appendChild(minBtn);

        // Painel Principal
        const panel = document.createElement('div');
        panel.id = "condo-panel";
        panel.style.display = 'none'; // starts minimized
        panel.innerHTML = `
            <div id="condo-header">
                <span>Criar Condomínio</span>
                <div id="condo-toggle" style="cursor:pointer; font-size: 14px; font-weight: bold;">[ _ ]</div>
            </div>
            <div id="condo-content">
                <label class="condo-label">Nome do Condomínio</label>
                <input type="text" id="condo-name" class="condo-input" placeholder="Ex: Residencial Flores">
                
                <label class="condo-label">Cidade</label>
                <div class="condo-search-container">
                    <input type="text" id="condo-city-search" class="condo-search-input" placeholder="Buscar cidade..." autocomplete="off">
                    <input type="hidden" id="condo-city-id">
                    <div id="condo-city-list" class="condo-dropdown-list"></div>
                </div>

                <label class="condo-label">CEP</label>
                <input type="text" id="condo-zip" class="condo-input" placeholder="Somente números">

                <label class="condo-label">Rua</label>
                <input type="text" id="condo-street" class="condo-input" placeholder="Ex: Rua das Flores">

                <label class="condo-label">Número</label>
                <input type="text" id="condo-number" class="condo-input" placeholder="Ex: 123">

                <button id="condo-generate" class="condo-btn-main">Gerar JSON</button>
                <pre id="condo-output" style="display:none;"></pre>
                <button id="condo-copy" class="condo-btn-main" style="background:#3498db !important; margin-top:10px; display:none;">📋 Copiar JSON</button>
                <div id="condo-status" style="color:var(--condo-green); font-size:10px; font-weight:bold; text-align:center; margin-top:5px; display:none;">✅ COPIADO!</div>
            </div>
        `;
        document.body.appendChild(panel);

        // Minimizar / Maximizar
        minBtn.onclick = () => {
            panel.style.display = 'block';
            minBtn.style.display = 'none';
            isMinimized = false;
        };

        document.getElementById('condo-toggle').onclick = (e) => {
            e.stopPropagation();
            panel.style.display = 'none';
            minBtn.style.display = 'block';
            isMinimized = true;
        };

        // Custom City Dropdown Logic
        const citySearch = document.getElementById('condo-city-search');
        const cityList = document.getElementById('condo-city-list');
        const cityIdInput = document.getElementById('condo-city-id');

        function renderCityList(filterText = '') {
            cityList.innerHTML = '';
            const filtered = cities.filter(c => c.name.toLowerCase().includes(filterText.toLowerCase()));
            filtered.forEach(c => {
                const div = document.createElement('div');
                div.className = 'condo-dropdown-item';
                div.textContent = \`\${c.id} - \${c.name}\`;
                div.onclick = () => {
                    citySearch.value = c.name;
                    cityIdInput.value = c.id;
                    cityList.style.display = 'none';
                };
                cityList.appendChild(div);
            });
            if (filtered.length > 0) {
                cityList.style.display = 'block';
            } else {
                cityList.style.display = 'none';
            }
        }

        citySearch.onfocus = () => renderCityList(citySearch.value);
        citySearch.oninput = (e) => renderCityList(e.target.value);
        
        // Hide dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.condo-search-container')) {
                cityList.style.display = 'none';
            }
        });

        // MOTOR DE ARRASTE
        let startX, startY, initialLeft, initialTop;
        document.getElementById('condo-header').addEventListener('mousedown', (e) => {
            if (e.target.id === 'condo-toggle') return;
            isDrag = true; startX = e.clientX; startY = e.clientY;
            initialLeft = panel.offsetLeft; initialTop = panel.offsetTop;
            const moveHandler = (ev) => {
                if (!isDrag) return;
                window.requestAnimationFrame(() => {
                    panel.style.left = (initialLeft + (ev.clientX - startX)) + 'px';
                    panel.style.top = (initialTop + (ev.clientY - startY)) + 'px';
                });
            };

            const stopDrag = () => { isDrag = false; window.removeEventListener('mousemove', moveHandler); window.removeEventListener('mouseup', stopDrag); };
            window.addEventListener('mousemove', moveHandler); window.addEventListener('mouseup', stopDrag);
        });

        // REGRAS DE GERAÇÃO E CÓPIA
        document.getElementById('condo-generate').onclick = () => {
            const name = document.getElementById('condo-name').value.trim();
            const cityId = document.getElementById('condo-city-id').value;
            const cityName = document.getElementById('condo-city-search').value.trim();
            let zip = document.getElementById('condo-zip').value.replace(/[^0-9]/g, '');
            const street = document.getElementById('condo-street').value.trim();
            const number = document.getElementById('condo-number').value.trim();

            if (!name || !cityId || !zip || !street || !number) {
                return alert("Preencha todos os campos corretamente e selecione uma cidade válida.");
            }

            const payload = {
                "name": name,
                "unityGroupType": [{"id": 0, "label": "Bloco"}],
                "unityType": [{"id": 0, "label": "Apartamento"}],
                "address": {
                    "district": { "id": cityId, "cityId": cityId, "name": cityName },
                    "zipNumber": zip,
                    "addressNumber": number,
                    "streetName": street
                }
            };

            const out = document.getElementById('condo-output');
            out.textContent = JSON.stringify(payload, null, 2);
            out.style.display = 'block'; 
            document.getElementById('condo-copy').style.display = 'block';
        };

        document.getElementById('condo-copy').onclick = () => {
            navigator.clipboard.writeText(document.getElementById('condo-output').textContent).then(() => {
                const s = document.getElementById('condo-status');
                s.style.display = 'block'; setTimeout(() => s.style.display = 'none', 2500);
            });
        };

        document.querySelectorAll('.condo-input, .condo-search-input').forEach(i => i.onmousedown = (e) => e.stopPropagation());
    }

    // --- SUPERVISOR (Dark mode) ---
    function supervisor() {
        const panel = document.getElementById('condo-panel');
        if (!panel) renderApp();
        const currentPanel = document.getElementById('condo-panel');
        if (currentPanel && !isDrag && !isMinimized) {
            // Dark Mode
            const bodyBg = window.getComputedStyle(document.body).backgroundColor;
            const rgb = bodyBg.match(/\\d+/g);
            if (rgb) {
                const brightness = (parseInt(rgb[0]) * 299 + parseInt(rgb[1]) * 587 + parseInt(rgb[2]) * 114) / 1000;
                if (brightness < 200) currentPanel.classList.add('dark-mode'); else currentPanel.classList.remove('dark-mode');
            }
        }
    }

    setInterval(supervisor, 1500);
    supervisor();
})();
