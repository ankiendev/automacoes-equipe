// ==UserScript==
// @name         Icarus Stealth Pro
// @namespace    http://tampermonkey.net/
// @version      6.3
// @description  Automação estável para equipe - Graphite Edition + Nuclear Button Fix.
// @author       Gemini AI (Guided by ankiendev)
// @match        https://web.pontoicarus.com.br/*
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/ankiendev/automacoes-equipe/main/ponto.user.js
// @updateURL    https://raw.githubusercontent.com/ankiendev/automacoes-equipe/main/ponto.user.js
// ==/UserScript==

(function() {
    'use strict';

    const getTodayStr = () => {
        const now = new Date();
        const y = now.getFullYear();
        const m = String(now.getMonth() + 1).padStart(2, '0');
        const d = String(now.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    };
    const today = getTodayStr();

    const style = document.createElement('style');
    style.id = "icarus-pro-style-v63";
    document.head.appendChild(style);

    style.innerHTML = `
        /* --- DOCK PÍLULA NO TOPO (CINZA GRAPHITE) --- */
        #ic-top-dock {
            position: fixed; top: 0; left: 50%; transform: translateX(-50%);
            width: 180px; height: 12px;
            background: #212121 !important; z-index: 2147483647;
            display: flex; align-items: center; justify-content: center;
            cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            border-radius: 0 0 15px 15px; box-shadow: 0 4px 12px rgba(0,0,0,0.4);
            border: 1px solid #333; border-top: none;
        }

        .ic-led { border-radius: 4px; transition: all 0.4s ease; }
        .st-idle .ic-led { background: rgba(255,255,255,0.2) !important; width: 40px; height: 3px; }
        .st-working .ic-led { background: #2980b9 !important; box-shadow: 0 0 10px #2980b9 !important; animation: led-pulse-blue 1.2s infinite !important; width: 100px; height: 3px; }
        .st-finished .ic-led { background: #2ecc71 !important; box-shadow: 0 0 20px #2ecc71 !important; width: 160px; height: 3px; }

        @keyframes led-pulse-blue { 0% { opacity: 1; } 50% { opacity: 0.3; } 100% { opacity: 1; } }

        /* --- PAINEL (ESTILO CODE BLOCK) --- */
        #icarus-pro-panel {
            --ic-bg: #212121; --ic-text: #e0e0e0; --ic-border: #333333; --ic-input-bg: #181818;
            position: fixed; top: 40px; right: 20px; z-index: 2147483646;
            background: var(--ic-bg) !important; border-radius: 14px !important; width: 340px !important;
            box-shadow: 0 12px 40px rgba(0,0,0,0.7) !important; border: 1px solid var(--ic-border) !important;
            font-family: 'Inter', sans-serif !important; color: var(--ic-text) !important;
            transition: opacity 0.3s, transform 0.3s !important; display: block;
        }
        #icarus-pro-panel.is-hidden { opacity: 0; transform: translateY(-10px); pointer-events: none; }

        #ic-header { background: #212121 !important; padding: 12px 15px !important; cursor: move !important; display: flex !important; justify-content: space-between !important; align-items: center !important; height: 35px; border-radius: 14px 14px 0 0; border-bottom: 1px solid #333; }
        #header-led-container { flex-grow: 1; display: flex; justify-content: center; align-items: center; }

        #ic-content { padding: 16px !important; }
        .pro-label { font-size: 10px !important; font-weight: 800 !important; color: #777 !important; text-transform: uppercase !important; margin-bottom: 6px !important; display: block !important; }
        .pro-input { width: 100% !important; padding: 10px !important; background: var(--ic-input-bg) !important; border: 1px solid #3d3d3d !important; border-radius: 8px !important; color: #fff !important; font-size: 13px !important; margin-bottom: 12px !important; box-sizing: border-box !important; outline: none !important; }
        .pro-input:focus { border-color: #2980b9 !important; }
        .pro-input::-webkit-calendar-picker-indicator { filter: invert(1); cursor: pointer; }

        #progress-container { width: 100%; background: #000; height: 10px; border-radius: 5px; margin: 10px 0; position: relative; overflow: hidden; display: none; border: 1px solid #333; }
        #progress-bar { width: 0%; height: 100%; background: #2ecc71; transition: width 0.2s; }
        #progress-text { position: absolute; width: 100%; text-align: center; top: 0; font-size: 8px; line-height: 10px; font-weight: bold; color: #fff; }

        #ic-logs { background: #181818 !important; color: #2ecc71 !important; padding: 10px !important; border-radius: 8px !important; height: 100px !important; overflow-y: auto !important; font-family: monospace !important; font-size: 10px !important; margin-top: 10px !important; border: 1px solid #333 !important; }

        .btn-main { background: #2980b9 !important; color: white !important; border: none !important; padding: 12px !important; width: 100% !important; border-radius: 8px !important; font-weight: 700 !important; cursor: pointer !important; text-transform: uppercase !important; transition: 0.2s; }
        .btn-main:hover { background: #3498db !important; transform: translateY(-1px); }
        .panic-btn { background: #e74c3c !important; margin-top: 8px !important; }

        /* --- NUCLEAR BUTTON FIX (v6.3) --- */
        /* Força fundo verde em qualquer botão de confirmação que não seja de perigo/secundário */
        .p-dialog .p-dialog-footer button,
        button.p-button-success,
        .p-button:not(.p-button-secondary):not(.p-button-danger):not(.p-button-info),
        .MuiButton-containedPrimary,
        button[type="submit"] {
            background: #2ecc71 !important;
            background-color: #2ecc71 !important;
            color: #ffffff !important;
            border: 1px solid #2ecc71 !important;
            opacity: 1 !important;
            visibility: visible !important;
            box-shadow: none !important;
            text-shadow: none !important;
        }
        .p-dialog .p-dialog-footer button:hover { background-color: #27ae60 !important; }
    `;

    const topDock = document.createElement('div');
    topDock.id = "ic-top-dock";
    topDock.className = "st-idle";
    topDock.innerHTML = `<div class="ic-led"></div>`;
    document.body.appendChild(topDock);

    const panel = document.createElement('div');
    panel.id = "icarus-pro-panel";
    panel.classList.add('is-hidden');
    panel.innerHTML = `
        <div id="ic-header">
            <div id="header-led-container" class="st-idle"><div class="ic-led"></div></div>
            <div id="ic-close" style="cursor:pointer; font-size: 20px; color: #666;">−</div>
        </div>
        <div id="ic-content">
            <label class="pro-label">Data de Início:</label>
            <input type="date" id="data-fixa" class="pro-input" value="${today}">
            <textarea id="texto-plantao" class="pro-input" style="height: 70px; resize: none;" placeholder="Entrada - Saída / Cliente..."></textarea>
            <button id="btn-processar" class="btn-main">EXECUTAR SEQUÊNCIA</button>
            <button id="btn-panic" class="btn-main panic-btn" style="display:none;">PARAR (PÂNICO)</button>
            <div id="progress-container"><div id="progress-bar"></div><div id="progress-text">0/0</div></div>
            <div id="ic-logs"></div>
        </div>
    `;
    document.body.appendChild(panel);

    const updateStatus = (status) => {
        topDock.className = `st-${status}`;
        document.getElementById('header-led-container').className = `st-${status}`;
    };

    const togglePanel = () => {
        const isHidden = panel.classList.toggle('is-hidden');
        topDock.style.display = isHidden ? 'flex' : 'none';
    };

    topDock.onclick = togglePanel;
    document.getElementById('ic-close').onclick = togglePanel;

    const log = (m) => {
        const l = document.getElementById('ic-logs');
        if(l) { l.innerHTML += `<div>> ${m}</div>`; l.scrollTop = l.scrollHeight; }
    };

    const sleep = (ms) => new Promise(r => setTimeout(r, ms));

    function injectValue(el, val) {
        const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set || Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value")?.set;
        setter.call(el, val);
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
    }

    let isDrag = false, startX, startY, initialLeft, initialTop;
    document.getElementById('ic-header').onmousedown = (e) => {
        isDrag = true; startX = e.clientX; startY = e.clientY; initialLeft = panel.offsetLeft; initialTop = panel.offsetTop;
    };
    window.onmousemove = (e) => { if (isDrag) { panel.style.left = (initialLeft + (e.clientX - startX)) + 'px'; panel.style.top = (initialTop + (e.clientY - startY)) + 'px'; } };
    window.onmouseup = () => isDrag = false;

    let stop = false;
    document.getElementById('btn-panic').onclick = () => { stop = true; updateStatus('idle'); };

    document.getElementById('btn-processar').onclick = async () => {
        const textoRaw = document.getElementById('texto-plantao').value;
        const batidasMatch = (textoRaw.match(/\d{2}:\d{2}/g) || []);
        if (batidasMatch.length === 0 || batidasMatch.length % 2 !== 0) return alert("Erro nos horários.");
        stop = false; updateStatus('working');
        document.getElementById('btn-panic').style.display = "block";
        document.getElementById('progress-container').style.display = "block";
        document.getElementById('ic-logs').innerHTML = "";
        log("🎬 Sequência iniciada.");
        const dataBase = document.getElementById('data-fixa').value;
        let dataTrabalho = dataBase;
        let dataISOManha = new Date(new Date(`${dataBase}T12:00:00`).getTime() + 86400000).toISOString().split('T')[0];
        let ultimoMinutos = -1;
        const batidas = [];
        textoRaw.split('/').filter(b => b.trim().length > 5).forEach(bloco => {
            const tm = bloco.match(/(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})/);
            if (tm) batidas.push(tm[1], tm[2]);
        });
        for (let i = 0; i < batidas.length; i++) {
            if (stop) break;
            const hStr = batidas[i];
            const [h, m] = hStr.split(':').map(Number);
            const mins = h * 60 + m;
            if (mins < ultimoMinutos) dataTrabalho = dataISOManha;
            ultimoMinutos = mins;
            log(`Gravando ${hStr}...`);
            let btn;
            const botoesDeLinha = Array.from(document.querySelectorAll('button')).filter(b => b.innerText.trim() === 'Adicionar');
            btn = botoesDeLinha.length > 0 ? botoesDeLinha[botoesDeLinha.length - 1] : Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Adicionar Horário'));
            if (btn) {
                btn.click(); await sleep(550);
                const celulas = document.querySelectorAll('td.p-editable-column');
                const ultima = celulas[celulas.length - 1];
                if (ultima) {
                    ultima.click(); await sleep(350);
                    const input = ultima.querySelector('input');
                    if (input) {
                        injectValue(input, `${dataTrabalho}T${hStr}`);
                        await sleep(300);
                        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', keyCode: 13, bubbles: true }));
                    }
                }
            }
            document.getElementById('progress-bar').style.width = (((i+1)/batidas.length)*100) + "%";
            document.getElementById('progress-text').innerText = `${i+1}/${batidas.length}`;
            await sleep(650);
        }
        if (!stop) { log("🏁 CONCLUÍDO!"); updateStatus('finished'); }
        document.getElementById('btn-panic').style.display = "none";
    };

    setInterval(() => {
        const isPonto = window.location.href.includes('/ponto');
        topDock.style.display = (isPonto && panel.classList.contains('is-hidden')) ? 'flex' : 'none';
    }, 1500);
})();
