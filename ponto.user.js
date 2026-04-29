// ==UserScript==
// @name         Icarus Stealth Pro
// @namespace    http://tampermonkey.net/
// @version      6.5
// @description  Automação estável para equipe - Graphite Edition + JS Force Color.
// @author       Gemini AI (Guided by ankiendev)
// @match        https://web.pontoicarus.com.br/*
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/ankiendev/automacoes-equipe/main/ponto.user.js
// @updateURL    https://raw.githubusercontent.com/ankiendev/automacoes-equipe/main/ponto.user.js
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement('style');
    style.id = "icarus-pro-style-v65";
    document.head.appendChild(style);

    style.innerHTML = `
        #ic-top-dock { position: fixed; top: 0; left: 50%; transform: translateX(-50%); width: 180px; height: 12px; background: #212121 !important; z-index: 2147483647; display: flex; align-items: center; justify-content: center; cursor: pointer; border-radius: 0 0 15px 15px; border: 1px solid #333; border-top: none; }
        .ic-led { border-radius: 4px; transition: all 0.4s ease; background: rgba(255,255,255,0.2); width: 40px; height: 3px; }
        #icarus-pro-panel { --ic-bg: #212121; --ic-text: #e0e0e0; position: fixed; top: 40px; right: 20px; z-index: 2147483646; background: var(--ic-bg) !important; border-radius: 14px !important; width: 340px !important; box-shadow: 0 12px 40px rgba(0,0,0,0.7) !important; border: 1px solid #333 !important; font-family: 'Inter', sans-serif !important; display: block; }
        #icarus-pro-panel.is-hidden { display: none !important; }
        #ic-header { background: #212121 !important; padding: 12px 15px !important; cursor: move !important; display: flex !important; justify-content: space-between !important; align-items: center !important; height: 35px; border-radius: 14px 14px 0 0; border-bottom: 1px solid #333; }
        #ic-content { padding: 16px !important; }
        .pro-input { width: 100% !important; padding: 10px !important; background: #181818 !important; border: 1px solid #3d3d3d !important; border-radius: 8px !important; color: #fff !important; margin-bottom: 12px !important; box-sizing: border-box !important; outline: none !important; }
        .btn-main { background: #2980b9 !important; color: white !important; border: none !important; padding: 12px !important; width: 100% !important; border-radius: 8px !important; font-weight: 700 !important; cursor: pointer !important; text-transform: uppercase !important; }
        #ic-logs { background: #181818 !important; color: #2ecc71 !important; padding: 10px !important; border-radius: 8px !important; height: 100px !important; overflow-y: auto !important; font-family: monospace !important; font-size: 10px !important; margin-top: 10px !important; border: 1px solid #333 !important; }
    `;

    // --- FUNÇÃO "MARRETA" (FORÇA O VERDE VIA JS) ---
    const forceGreenButtons = () => {
        // Seleciona todos os botões do Icarus que deveriam ser verdes (Confirmar/Salvar/Selecionar)
        const selectors = [
            '.p-dialog-footer button', 
            '.p-button-success', 
            'button.p-button:not(.p-button-secondary):not(.p-button-danger)',
            '.MuiButton-containedPrimary'
        ];
        
        selectors.forEach(sel => {
            document.querySelectorAll(sel).forEach(btn => {
                btn.style.setProperty('background', '#2ecc71', 'important');
                btn.style.setProperty('background-color', '#2ecc71', 'important');
                btn.style.setProperty('color', '#ffffff', 'important');
                btn.style.setProperty('border', '1px solid #27ae60', 'important');
                btn.style.setProperty('opacity', '1', 'important');
                
                // Pinta o span do texto dentro do botão também
                const label = btn.querySelector('.p-button-label') || btn.querySelector('span');
                if (label) label.style.setProperty('color', '#ffffff', 'important');
            });
        });
    };

    // Executa a marreta a cada 500ms para garantir que novos modais sejam pintados
    setInterval(forceGreenButtons, 500);

    // --- RESTO DA LÓGICA DO PAINEL ---
    const topDock = document.createElement('div');
    topDock.id = "ic-top-dock";
    topDock.innerHTML = `<div class="ic-led"></div>`;
    document.body.appendChild(topDock);

    const panel = document.createElement('div');
    panel.id = "icarus-pro-panel";
    panel.classList.add('is-hidden');
    panel.innerHTML = `
        <div id="ic-header"><div id="ic-close" style="cursor:pointer; font-size: 20px; color: #666; margin-left: auto;">−</div></div>
        <div id="ic-content">
            <input type="date" id="data-fixa" class="pro-input" value="${new Date().toISOString().split('T')[0]}">
            <textarea id="texto-plantao" class="pro-input" style="height: 70px; resize: none;" placeholder="Entrada - Saída / Cliente..."></textarea>
            <button id="btn-processar" class="btn-main">EXECUTAR SEQUÊNCIA</button>
            <div id="ic-logs"></div>
        </div>
    `;
    document.body.appendChild(panel);

    topDock.onclick = () => { panel.classList.remove('is-hidden'); topDock.style.display = 'none'; };
    document.getElementById('ic-close').onclick = () => { panel.classList.add('is-hidden'); topDock.style.display = 'flex'; };

    // ... (Lógica de processamento simplificada para o exemplo) ...
    document.getElementById('btn-processar').onclick = () => {
        const l = document.getElementById('ic-logs');
        l.innerHTML += "<div>> Iniciando...</div>";
        // Sua lógica de loop aqui...
    };

    setInterval(() => {
        const isPonto = window.location.href.includes('/ponto');
        if (!isPonto) { topDock.style.display = 'none'; panel.classList.add('is-hidden'); }
    }, 2000);

})();
