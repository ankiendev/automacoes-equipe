// ==UserScript==
// @name         Gerador de Condomínio
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Gerador de JSON de criação de condomínio
// @author       Gemini AI
// @match        https://monitoring.cloud.kiper.com.br/condominiums
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let isDrag = false;

    function renderApp() {
        if (document.getElementById('rpa-condo-panel')) return;

        const style = document.createElement('style');
        style.id = "rpa-condo-style";
        document.head.appendChild(style);

        style.innerHTML = `
            #rpa-condo-panel {
                --rpa-bg: #f7fef8; --rpa-header: #0d5b61; --rpa-text: #1c2026;
                --rpa-header-text: #ffffff; --rpa-border: #d1e0d3; --rpa-item: #ebf4ec;
                --rpa-input: #ffffff; --rpa-green: #268e60; --rpa-green-alpha: rgba(38, 142, 96, 0.15);
                position: fixed; top: 200px; right: 20px; z-index: 2147483647;
                background: var(--rpa-bg) !important; border-radius: 10px !important; width: 340px !important;
                box-shadow: 0 8px 32px rgba(0,0,0,0.3) !important; border: 1px solid var(--rpa-border) !important;
                font-family: 'Inter', sans-serif !important; color: var(--rpa-text) !important;
                overflow: hidden !important; transition: width 0.3s, height 0.3s, opacity 0.3s !important;
                display: block; will-change: transform;
            }
            #rpa-condo-panel.dark-mode { --rpa-bg: #1c2026; --rpa-header: #0a2e34; --rpa-text: #f7fef8; --rpa-border: #2c333c; --rpa-item: #242930; --rpa-input: #12151a; --rpa-green-alpha: rgba(38, 142, 96, 0.3); }
            #rpa-condo-panel.is-minimized { display: flex !important; width: 26px !important; height: 150px !important; right: -2px !important; border-radius: 10px 0 0 10px !important; opacity: 0.6; cursor: pointer !important; border-right: none !important; }
            #rpa-condo-panel.is-minimized #rpa-header { padding: 0 !important; height: 100% !important; border-bottom: none !important; justify-content: center !important; width: 100% !important;}
            #rpa-condo-panel.is-minimized #rpa-header span { writing-mode: vertical-rl; transform: rotate(180deg); font-size: 10px !important; font-weight: 600; letter-spacing: 1px; white-space: nowrap !important; }
            #rpa-condo-panel.is-minimized #rpa-content, #rpa-condo-panel.is-minimized #rpa-toggle { display: none !important; }
            #rpa-header { background: var(--rpa-header) !important; color: var(--rpa-header-text) !important; padding: 12px 15px !important; cursor: move !important; display: flex !important; justify-content: space-between !important; align-items: center !important; border-bottom: 1px solid var(--rpa-border) !important; }
            #rpa-header span { font-weight: 700 !important; font-size: 12px !important; text-transform: uppercase; user-select: none; }
            #rpa-content { padding: 16px !important; }
            .rpa-label { font-size: 10px !important; font-weight: 800 !important; color: var(--rpa-green) !important; text-transform: uppercase !important; margin-bottom: 6px !important; display: block !important; }
            .rpa-input { width: 100% !important; padding: 10px !important; background: var(--rpa-input) !important; border: 1px solid var(--rpa-border) !important; border-radius: 6px !important; color: var(--rpa-text) !important; font-size: 13px !important; margin-bottom: 16px !important; outline: none !important; box-sizing: border-box; }
            .btn-main { background: var(--rpa-green) !important; color: white !important; border: none !important; padding: 12px !important; width: 100% !important; border-radius: 8px !important; font-weight: 700 !important; cursor: pointer !important; text-transform: uppercase !important; font-size: 12px !important; }
            pre { background: #000 !important; color: #2ecc71 !important; padding: 12px !important; border-radius: 8px !important; font-family: monospace !important; font-size: 11px !important; margin-top: 10px !important; overflow-x: auto !important; max-height: 100px !important; border: 1px solid #333 !important;}
        `;

        const panel = document.createElement('div');
        panel.id = "rpa-condo-panel";
        panel.innerHTML = `
            <div id="rpa-header"><span>Criar Condomínio</span><div id="rpa-toggle" style="cursor:pointer; font-size: 18px; line-height: 1">−</div></div>
            <div id="rpa-content">
                <label class="rpa-label">Nome do Condomínio</label>
                <input type="text" id="rpa-condoName" class="rpa-input" placeholder="Ex: Residencial Flores">
                
                <label class="rpa-label">Cidade</label>
                <select id="rpa-condoCity" class="rpa-input">
                    <option value="" disabled selected>Selecione a cidade</option>
                    <option value="466|Guaíba">466 - Guaíba</option>
                    <option value="465|Barueri">465 - Barueri</option>
                    <option value="464|Monte Mor">464 - Monte Mor</option>
                    <option value="463|Camaragibe">463 - Camaragibe</option>
                    <option value="461|Pelotas">461 - Pelotas</option>
                    <option value="460|Rio de Janeiro">460 - Rio de Janeiro</option>
                    <option value="459|São Paulo">459 - São Paulo</option>
                    <option value="458|Canoas">458 - Canoas</option>
                    <option value="457|Porto Alegre">457 - Porto Alegre</option>
                    <option value="456|Curitiba">456 - Curitiba</option>
                    <option value="455|Belo Horizonte">455 - Belo Horizonte</option>
                </select>

                <label class="rpa-label">CEP</label>
                <input type="text" id="rpa-condoZip" class="rpa-input" placeholder="Somente números">

                <label class="rpa-label">Rua</label>
                <input type="text" id="rpa-condoStreet" class="rpa-input" placeholder="Ex: Rua das Flores">

                <label class="rpa-label">Número</label>
                <input type="text" id="rpa-condoNumber" class="rpa-input" placeholder="Ex: 123">

                <button id="rpa-generate-condo" class="btn-main">Gerar JSON</button>
                <pre id="rpa-output-condo" style="display:none;"></pre>
                <button id="rpa-copy-condo" class="btn-main" style="background:#3498db !important; margin-top:10px; display:none;">📋 Copiar JSON</button>
                <div id="rpa-status-condo" style="color:var(--rpa-green); font-size:10px; font-weight:bold; text-align:center; margin-top:5px; display:none;">✅ COPIADO!</div>
            </div>
        `;
        document.body.appendChild(panel);

        // MOTOR DE ARRASTE
        let startX, startY, initialLeft, initialTop;
        document.getElementById('rpa-header').addEventListener('mousedown', (e) => {
            if (panel.classList.contains('is-minimized')) {
                panel.classList.remove('is-minimized');
                panel.style.right = 'auto'; panel.style.left = (window.innerWidth - 360) + 'px';
                return;
            }
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

        document.getElementById('rpa-toggle').onclick = (e) => { e.stopPropagation(); panel.classList.add('is-minimized'); panel.style.left = 'auto'; };

        // REGRAS DE GERAÇÃO E CÓPIA
        document.getElementById('rpa-generate-condo').onclick = () => {
            const name = document.getElementById('rpa-condoName').value.trim();
            const cityVal = document.getElementById('rpa-condoCity').value;
            const zip = document.getElementById('rpa-condoZip').value.trim();
            const street = document.getElementById('rpa-condoStreet').value.trim();
            const number = document.getElementById('rpa-condoNumber').value.trim();

            if (!name || !cityVal || !zip || !street || !number) {
                return alert("Preencha todos os campos.");
            }

            if (!/^\\d+$/.test(zip)) {
                return alert("O CEP deve conter apenas números.");
            }

            const [cityId, cityName] = cityVal.split('|');

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

            const out = document.getElementById('rpa-output-condo');
            out.textContent = JSON.stringify(payload, null, 2);
            out.style.display = 'block'; 
            document.getElementById('rpa-copy-condo').style.display = 'block';
        };

        document.getElementById('rpa-copy-condo').onclick = () => {
            navigator.clipboard.writeText(document.getElementById('rpa-output-condo').textContent).then(() => {
                const s = document.getElementById('rpa-status-condo');
                s.style.display = 'block'; setTimeout(() => s.style.display = 'none', 2500);
            });
        };

        document.querySelectorAll('.rpa-input').forEach(i => i.onmousedown = (e) => e.stopPropagation());
    }

    // --- SUPERVISOR (Dark mode) ---
    function supervisor() {
        const panel = document.getElementById('rpa-condo-panel');
        if (!panel) renderApp();
        const currentPanel = document.getElementById('rpa-condo-panel');
        if (currentPanel && !isDrag) {
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
