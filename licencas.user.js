// ==UserScript==
// @name         Gerador de Payload - v3.5 Spy Edition
// @namespace    http://tampermonkey.net/
// @version      3.5.1
// @description  Design v3.5 preservado + Supervisor de persistência (Anti-SPA).
// @author       Gemini AI
// @match        https://monitoring.cloud.kiper.com.br/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let isDrag = false;

    // --- FUNÇÃO QUE RENDERIZA O DESIGN ORIGINAL ---
    function renderApp() {
        if (document.getElementById('rpa-panel')) return;

        const style = document.createElement('style');
        style.id = "rpa-master-style-v35";
        document.head.appendChild(style);

        // O SEU CSS ORIGINAL SEM ALTERAÇÕES
        style.innerHTML = `
            #rpa-panel {
                --rpa-bg: #f7fef8;
                --rpa-header: #0d5b61;
                --rpa-text: #1c2026;
                --rpa-header-text: #ffffff;
                --rpa-border: #d1e0d3;
                --rpa-item: #ebf4ec;
                --rpa-input: #ffffff;
                --rpa-green: #268e60;
                --rpa-green-alpha: rgba(38, 142, 96, 0.15);

                position: fixed; top: 200px; right: 20px; z-index: 2147483647;
                background: var(--rpa-bg) !important; border-radius: 10px !important; width: 340px !important;
                box-shadow: 0 8px 32px rgba(0,0,0,0.3) !important; border: 1px solid var(--rpa-border) !important;
                font-family: 'Inter', sans-serif !important; color: var(--rpa-text) !important;
                overflow: hidden !important;
                transition: width 0.3s, height 0.3s, opacity 0.3s, background 0.3s !important;
                display: none;
                will-change: transform;
            }

            #rpa-panel.dark-mode {
                --rpa-bg: #1c2026;
                --rpa-header: #0a2e34;
                --rpa-text: #f7fef8;
                --rpa-border: #2c333c;
                --rpa-item: #242930;
                --rpa-input: #12151a;
                --rpa-green-alpha: rgba(38, 142, 96, 0.3);
            }

            #rpa-panel.is-minimized {
                display: flex !important; width: 26px !important; height: 150px !important; right: -2px !important;
                border-radius: 10px 0 0 10px !important; opacity: 0.6; cursor: pointer !important; border-right: none !important;
            }
            #rpa-panel.is-minimized:hover { opacity: 1; }
            #rpa-panel.is-minimized #rpa-header { padding: 0 !important; height: 100% !important; border-bottom: none !important; justify-content: center !important; width: 100% !important;}
            #rpa-panel.is-minimized #rpa-header span { writing-mode: vertical-rl; transform: rotate(180deg); font-size: 10px !important; font-weight: 600; letter-spacing: 1px; white-space: nowrap !important; }
            #rpa-panel.is-minimized #rpa-content, #rpa-panel.is-minimized #rpa-toggle { display: none !important; }

            #rpa-header { background: var(--rpa-header) !important; color: var(--rpa-header-text) !important; padding: 12px 15px !important; cursor: move !important; display: flex !important; justify-content: space-between !important; align-items: center !important; border-bottom: 1px solid var(--rpa-border) !important; }
            #rpa-header span { font-weight: 700 !important; font-size: 12px !important; text-transform: uppercase; user-select: none; }

            #rpa-content { padding: 16px !important; }
            .rpa-label { font-size: 10px !important; font-weight: 800 !important; color: var(--rpa-green) !important; text-transform: uppercase !important; margin-bottom: 6px !important; display: block !important; }
            .rpa-input { width: 100% !important; padding: 10px !important; background: var(--rpa-input) !important; border: 1px solid var(--rpa-border) !important; border-radius: 6px !important; color: var(--rpa-text) !important; font-size: 13px !important; margin-bottom: 16px !important; outline: none !important;}
            #rpa-list { max-height: 280px !important; overflow-y: auto !important; margin-bottom: 16px !important; }
            .rpa-item { display: flex !important; align-items: center !important; padding: 10px 12px !important; background: var(--rpa-item) !important; border: 1px solid var(--rpa-border) !important; border-radius: 8px !important; margin-bottom: 6px !important; gap: 10px !important; cursor: pointer !important; user-select: none; }
            .rpa-item.is-selected { background: var(--rpa-green-alpha) !important; border-color: var(--rpa-green) !important; }
            .rpa-item label { flex: 1 !important; font-size: 12px !important; cursor: pointer !important; color: inherit !important; margin: 0 !important; font-weight: 500 !important; }
            .rpa-qty-input { width: 50px !important; border: 1px solid var(--rpa-green) !important; background: var(--rpa-input) !important; color: var(--rpa-green) !important; border-radius: 4px !important; text-align: center !important; font-weight: bold !important; }
            .btn-main { background: var(--rpa-green) !important; color: white !important; border: none !important; padding: 12px !important; width: 100% !important; border-radius: 8px !important; font-weight: 700 !important; cursor: pointer !important; text-transform: uppercase !important; font-size: 12px !important; }
            pre { background: #000 !important; color: #2ecc71 !important; padding: 12px !important; border-radius: 8px !important; font-family: monospace !important; font-size: 11px !important; margin-top: 10px !important; overflow-x: auto !important; max-height: 100px !important; border: 1px solid #333 !important;}
        `;

        const panel = document.createElement('div');
        panel.id = "rpa-panel";
        panel.classList.add('is-minimized');
        panel.innerHTML = `
            <div id="rpa-header"><span>Gerar Licenças</span><div id="rpa-toggle" style="cursor:pointer; font-size: 18px; line-height: 1">−</div></div>
            <div id="rpa-content">
                <label class="rpa-label">ID do Condomínio</label>
                <input type="number" id="rpa-personId" class="rpa-input">
                <div id="rpa-list"></div>
                <button id="rpa-generate" class="btn-main">Gerar Payload Mágico</button>
                <pre id="rpa-output" style="display:none;"></pre>
                <button id="rpa-copy" class="btn-main" style="background:#3498db !important; margin-top:10px; display:none;">📋 Copiar JSON</button>
                <div id="rpa-status" style="color:var(--rpa-green); font-size:10px; font-weight:bold; text-align:center; margin-top:5px; display:none;">✅ COPIADO!</div>
            </div>
        `;
        document.body.appendChild(panel);

        // --- LISTA ---
        const licencas = [
            { id: "remote_concierge", label: "Portaria Remota", m: false },
            { id: "access_control", label: "Controle de Acesso", m: false },
            { id: "video_call", label: "Vídeo Chamada", m: false },
            { id: "porter_delivery", label: "Porter Entregas", m: false },
            { id: "local_concierge", label: "Portaria Presencial", m: false },
            { id: "water_tank_monitor", label: "Sensor Água", m: false },
            { id: "almah_integrated", label: "Integração Almah", m: false },
            { id: "commercial_unity", label: "Sala Comercial", m: false },
            { id: "tower", label: "Security (Torre)", m: true },
            { id: "elevator_controller", label: "Control. Elevadores", m: true }
        ];

        const list = document.getElementById('rpa-list');
        licencas.forEach(l => {
            const item = document.createElement('div');
            item.className = 'rpa-item';
            item.dataset.id = l.id;
            item.dataset.multi = l.m;
            item.innerHTML = `<label>${l.label}</label>${l.m ? `<input type="number" id="qty_${l.id}" value="1" min="1" class="rpa-qty-input">` : '<span style="font-size:9px; opacity:0.6; font-weight:bold;">1 UN</span>'}`;
            item.onclick = (e) => { if(!e.target.classList.contains('rpa-qty-input')) item.classList.toggle('is-selected'); };
            list.appendChild(item);
        });

        // --- LISTENERS (ARRASTE E BOTÕES) ---
        let startX, startY, initialLeft, initialTop;

        const moveHandler = (e) => {
            if (!isDrag) return;
            window.requestAnimationFrame(() => {
                panel.style.left = (initialLeft + (e.clientX - startX)) + 'px';
                panel.style.top = (initialTop + (e.clientY - startY)) + 'px';
            });
        };

        const stopDrag = () => {
            isDrag = false;
            window.removeEventListener('mousemove', moveHandler);
            window.removeEventListener('mouseup', stopDrag);
        };

        document.getElementById('rpa-header').addEventListener('mousedown', (e) => {
            if (panel.classList.contains('is-minimized')) {
                panel.classList.remove('is-minimized');
                panel.style.right = 'auto';
                panel.style.left = (window.innerWidth - 360) + 'px';
                panel.style.display = 'block';
                return;
            }
            isDrag = true;
            startX = e.clientX; startY = e.clientY;
            initialLeft = panel.offsetLeft; initialTop = panel.offsetTop;
            window.addEventListener('mousemove', moveHandler);
            window.addEventListener('mouseup', stopDrag);
        });

        document.querySelectorAll('.rpa-qty-input, #rpa-personId').forEach(i => i.onmousedown = (e) => e.stopPropagation());

        document.getElementById('rpa-toggle').onclick = (e) => {
            e.stopPropagation();
            panel.classList.add('is-minimized');
            panel.style.left = 'auto';
            panel.style.display = 'flex';
        };

        document.getElementById('rpa-generate').onclick = () => {
            const pId = document.getElementById('rpa-personId').value;
            const selected = document.querySelectorAll('.rpa-item.is-selected');
            if (selected.length === 0) return alert("Selecione uma licença.");
            let sel = [];
            selected.forEach(item => {
                const q = item.dataset.multi === "true" ? (parseInt(document.getElementById(`qty_${item.dataset.id}`).value) || 1) : 1;
                sel.push({ licenseType: item.dataset.id, pendingSettings: false, licenseQuantity: q });
            });
            document.getElementById('rpa-output').textContent = JSON.stringify({ personContextId: parseInt(pId), name: "erpLicense", value: JSON.stringify({ licenses: sel }) }, null, 2);
            document.getElementById('rpa-output').style.display = 'block';
            document.getElementById('rpa-copy').style.display = 'block';
        };

        document.getElementById('rpa-copy').onclick = () => {
            navigator.clipboard.writeText(document.getElementById('rpa-output').textContent).then(() => {
                const s = document.getElementById('rpa-status');
                s.style.display = 'block'; setTimeout(() => s.style.display = 'none', 2500);
            });
        };
    }

    // --- O SUPERVISOR (Roda o syncAll e verifica existência) ---
    function supervisor() {
        const isCondo = window.location.href.includes('/condominiums/');
        const panel = document.getElementById('rpa-panel');

        if (isCondo) {
            // Se estou no site mas o painel sumiu, recria
            if (!panel) {
                renderApp();
            } else {
                // Sincronia de estado original
                if (!isDrag) {
                    panel.style.display = panel.classList.contains('is-minimized') ? 'flex' : 'block';
                }

                // Auto-ID
                const idMatch = window.location.href.match(/\/condominiums\/(\d+)/);
                const inputId = document.getElementById('rpa-personId');
                if (idMatch && inputId && document.activeElement !== inputId) {
                    inputId.value = idMatch[1];
                }

                // Tema
                const bodyBg = window.getComputedStyle(document.body).backgroundColor;
                const rgb = bodyBg.match(/\d+/g);
                if (rgb) {
                    const brightness = (parseInt(rgb[0]) * 299 + parseInt(rgb[1]) * 587 + parseInt(rgb[2]) * 114) / 1000;
                    if (brightness < 200) panel.classList.add('dark-mode'); else panel.classList.remove('dark-mode');
                }
            }
        } else if (panel) {
            panel.style.setProperty('display', 'none', 'important');
        }
    }

    // Loop do Supervisor (1.5s para não pesar)
    setInterval(supervisor, 1500);
    supervisor();
})();
