// ==UserScript==
// @name         Gerador de Condomínio
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Gerador de JSON de criação de condomínio
// @author       Gemini AI
// @match        https://monitoring.cloud.kiper.com.br/condominiums
// @grant        none
// ==/UserScript==

function carregarCondominio() {
    if (window.condominioInicializado) return;
    window.condominioInicializado = true;

    let isDrag = false, isMinimized = true;

    const csvData = `466,Guaíba
465,Barueri
464,Monte Mor
463,Camaragibe
461,Petrópolis
458,Saône-et-Loire
457,Guarapari
456,Mandaguari
455,Cuiabá
454,Divinópolis
453,Szczecin
452,Porto Nacional
451,Condado de Harris
450,Botucatu
449,ELDORADO DO SUL
448,CAMPO LARGO
447,Brasília
446,SIRINHAEM
444,NOVA TRENTO
443,Pompeia
442,PARAGOMINAS
441,Vera Cruz
440,Balneário Piçarras
439,PORTO BELO
438,Guaratinguetá
437,Carapicuíba
435,Garopaba
434,SAO JOAQUIM DE BICAS
433,Estarreja
431,São Gonçalo do Pará
429,Lagoa Dourada
428,Nova Mutum
427,Talca
426,Sabará
424,BATAGUASSU
422,GOIANIA
420,Ribeirão das Neves
418,Formosa
416,São Sebastião do Caí
414,CARAZINHO
412,Leme
411,IMBITUBA
410,Suzano
409,Santana de Parnaíba
408,Jataí
407,ARAPONGAS
405,CASTANHAL
404,SALINOPOLIS
403,Matias Barbosa
401,Álvares Machado
400,Bebedouro
399,Praia Grande
398,Rio Verde
396,Portão
395,Santiago
391,PARAISO DO TOCANTINS
390,Nova Odessa
389,Santo André
388,Dracena
387,Holambra
386,CACERES
384,IPATINGA
383,Talagante
382,Peñaflor
381,Padre Hurtado
380,Isla de Maipo
379,El Monte
378,Vitacura
377,Santiago
376,San Ramón
375,San Joaquín
374,San Miguel
373,Renca
372,Recoleta
371,Quinta Normal
370,Quilicura
369,Pudahuel
368,Providencia
367,Peñalolén
366,Pedro Aguirre Cerda
365,Ñuñoa
364,Maipú
363,Macul
362,Lo Prado
361,Lo Espejo
360,Lo Barnechea
359,Las Condes
358,La Reina
357,La Pintana
356,La Florida
355,La Granja
354,La Cisterna
353,Independencia
352,Huechuraba
351,Estación Central
350,El Bosque
349,Conchalí
348,Cerro Navia
347,Cerrillos
346,San Pedro
345,Melipilla
344,María Pinto
343,Curacaví
342,Alhué
341,San Bernardo
340,Paine
339,Calera de Tango
338,Buin
337,San José de Maipo
336,Puente Alto
335,Pirque
334,Til Til
333,Lampa
332,Colina
331,Glorinha
330,CABREUVA
329,Itaguara
328,TAMANDARE
327,GLORINHA
325,GOVERNADOR CELSO RAMOS
323,Iranduba
322,BARCARENA
321,Alumínio
320,Pinhalzinho
319,IPOJUCA
318,COLATINA
317,Sumaré
316,JARAGUA DO SUL
315,Olinda
314,Vespasiano
313,São José de Ribamar
312,Palmas
310,Cabo de Santo Agostinho
307,Lagoa Santa
306,Garanhuns
305,Jaboatão dos Guararapes
303,Caruaru
302,Mangaratiba
301,Nova Lima
299,Contagem
298,Recife
297,Carmo do Cajuru
296,Governador Valadares
295,Rio de Janeiro
294,Niterói
293,Juiz de Fora
292,Belo Horizonte
291,Uberlândia
290,Salto de Pirapora
285,Antônio Carlos
284,Tijucas
283,Ribeirão Pires
282,Gravataí
281,Jaboatão dos Guararapes
280,Barra dos Coqueiros
278,São José dos Pinhais
277,Franco da Rocha
275,Guarapuava
274,Içara
273,Propriá
271,Carmo do Cajuru
270,Santa Maria
269,Camboriú
268,Viamão
265,Torres
263,Cataguases
262,Cachoeirinha
261,Piracicaba
257,Simões Filho
256,Aquiraz
254,Estância
253,Nova Iguaçu
252,Caetité
250,Araxá
248,Rio das Ostras
247,Narandiba
243,Parnamirim
242,Governador Valadares
241,NOVA IGUAÇU
240,Guapiaçu
238,São Roque
237,Vargem Grande Paulista
236,Osasco
234,Cotia
233,Caieiras
232,Pirapora do Bom Jesus
231,Cambé
228,Dourados
227,Barreiras
226,Messias
224,Lagoa Santa
223,Camaçari
221,Maracanaú
220,Montenegro
219,Olinda
217,Pelotas
216,Almirante Tamandaré
215,Iranduba
212,Ananindeua
211,Eusébio
210,Linhares
209,Juscimeira
208,Carambeí
207,Cajuru
206,Sertãozinho
204,Divinópolis
203,Jaboatão dos Guararapes
201,Cariacica
200,Vila Velha
199,Catanduva
198,Bady Bassitt
197,Rondonópolis
195,Morpará
194,Luís Eduardo Magalhães
193,Artur Nogueira
192,Fernandópolis
190,Itabaiana
189,Navegantes
187,Sete Lagoas
186,Para de Minas
185,Biguaçu
184,Caxias do Sul
183,Araucária
182,Igarapé
180,Paracatu
179,Sorriso
178,Nossa Senhora do Socorro
177,Nossa Senhora do Socorro
176,Barra dos Coqueiros
175,São Cristóvão
174,Palhoça
173,Balneário Camboriú
172,Várzea Grande
171,Ponta Grossa
159,Americana
155,Bauru
154,Santa Maria
153,Petrópolis
150,Itapema
146,Penha
145,Sinop
141,Uberlândia
139,Niterói
138,Macaé
131,Cuiabá
124,Marechal Deodoro
123,Caucaia
122,Natal
119,São Carlos
118,Contagem
117,Betim
113,Juiz de Fora
112,Santo Amaro da Imperatriz
109,Salvador
108,São Caetano do Sul
107,Manaus
105,Betim
104,São Luís
102,Petrolina
99,Juiz de Fora
98,Recife
97,Taubaté
96,Campos dos Goytacazes
95,Blumenau
92,Vitória
90,Manaus
88,Esteio
85,São José dos Campos
84,Brusque
82,Volta Redonda
81,Barueri
80,Regente Feijó
79,Campinas
78,Itu
77,Manaus
72,Itajaí
71,Santa Isabel
66,Jundiaí
65,São José do Rio Preto
64,Maringá
63,Joinville
62,Presidente Prudente
61,Teresina
56,Pinhais
55,Araraquara
54,Brasília
53,São Bernardo do Campo
52,Ribeirão Preto
51,Belo Horizonte
50,Sorocaba
49,Porto Velho
48,Lauro de Freitas
47,São Luís
46,Porto Alegre
45,Criciúma
44,Palmas
43,Rio de Janeiro
42,Canoas
41,Votorantim
40,Foz do Iguaçu
39,Barra Mansa
38,Teresina
37,Belo Horizonte
36,Marília
35,Santos
34,Araras
33,Manaus
32,Rio Claro
31,São Luís
29,Mogi das Cruzes
28,Fortaleza
27,Londrina
26,Belém
25,São Paulo
24,Passo Fundo
23,Campo Grande
22,Curitiba
21,Maceió
20,Aracaju
19,São José
18,Nova Prata do Iguaçu
17,Florianópolis`;

    const cities = csvData.split('\n').map(line => {
        const i = line.indexOf(',');
        return { id: line.substring(0, i).trim(), name: line.substring(i + 1).trim() };
    }).filter(c => c.id && c.name && !isNaN(c.id));

    function renderApp() {
        if (document.getElementById('condo-panel')) return;

        const style = document.createElement('style');
        style.id = 'condo-style';
        style.innerHTML = `
            #condo-minimized-btn { position:fixed; top:200px; right:20px; z-index:9999; background:#0d5b61!important; color:#fff!important; border:none!important; padding:10px 15px!important; border-radius:8px!important; font-weight:bold!important; cursor:pointer!important; box-shadow:0 4px 12px rgba(0,0,0,.3)!important; font-family:'Inter',sans-serif!important; font-size:12px!important; }
            #condo-panel { --cb:#f7fef8; --ch:#0d5b61; --ct:#1c2026; --cht:#fff; --cbr:#d1e0d3; --ci:#fff; --cg:#268e60; --cga:rgba(38,142,96,.15); position:fixed; top:200px; right:20px; z-index:9999; background:var(--cb)!important; border-radius:10px!important; width:340px!important; box-shadow:0 8px 32px rgba(0,0,0,.3)!important; border:1px solid var(--cbr)!important; font-family:'Inter',sans-serif!important; color:var(--ct)!important; overflow:hidden!important; }
            #condo-panel.dark-mode { --cb:#1c2026; --ch:#0a2e34; --ct:#f7fef8; --cbr:#2c333c; --ci:#12151a; --cga:rgba(38,142,96,.3); }
            #condo-hdr { background:var(--ch)!important; color:var(--cht)!important; padding:12px 15px!important; cursor:move!important; display:flex!important; justify-content:space-between!important; align-items:center!important; border-bottom:1px solid var(--cbr)!important; }
            #condo-hdr span { font-weight:700!important; font-size:12px!important; text-transform:uppercase; user-select:none; }
            #condo-body { padding:16px!important; max-height:70vh; overflow-y:auto; }
            .cl { font-size:10px!important; font-weight:800!important; color:var(--cg)!important; text-transform:uppercase!important; margin-bottom:6px!important; display:block!important; }
            .ci { width:100%!important; padding:10px!important; background:var(--ci)!important; border:1px solid var(--cbr)!important; border-radius:6px!important; color:var(--ct)!important; font-size:13px!important; margin-bottom:16px!important; outline:none!important; box-sizing:border-box; }
            .condo-sc { position:relative; margin-bottom:16px; }
            .condo-dl { display:none; position:absolute; top:100%; left:0; right:0; background:var(--ci)!important; border:1px solid var(--cbr)!important; max-height:150px; overflow-y:auto; z-index:10000; border-radius:0 0 6px 6px; box-shadow:0 4px 12px rgba(0,0,0,.1); }
            .condo-di { padding:8px 10px; font-size:12px; cursor:pointer; color:var(--ct); border-bottom:1px solid var(--cbr); }
            .condo-di:hover { background:var(--cga)!important; }
            .cb { background:var(--cg)!important; color:#fff!important; border:none!important; padding:12px!important; width:100%!important; border-radius:8px!important; font-weight:700!important; cursor:pointer!important; text-transform:uppercase!important; font-size:12px!important; }
            #condo-out { background:#000!important; color:#2ecc71!important; padding:12px!important; border-radius:8px!important; font-family:monospace!important; font-size:11px!important; margin-top:10px!important; overflow-x:auto!important; max-height:120px!important; border:1px solid #333!important; white-space:pre; }
        `;
        document.head.appendChild(style);

        const minBtn = document.createElement('button');
        minBtn.id = 'condo-minimized-btn';
        minBtn.textContent = 'Novo Condomínio';
        document.body.appendChild(minBtn);

        const panel = document.createElement('div');
        panel.id = 'condo-panel';
        panel.style.display = 'none';
        panel.innerHTML = `
            <div id="condo-hdr"><span>Criar Condomínio</span><div id="condo-min" style="cursor:pointer;font-size:14px;font-weight:bold">[ _ ]</div></div>
            <div id="condo-body">
                <label class="cl">Nome do Condomínio</label>
                <input type="text" id="condo-name" class="ci" placeholder="Ex: Residencial Flores">
                <label class="cl">Cidade</label>
                <div class="condo-sc">
                    <input type="text" id="condo-cs" class="ci" style="margin-bottom:0" placeholder="Buscar cidade..." autocomplete="off">
                    <input type="hidden" id="condo-cid">
                    <div id="condo-dl" class="condo-dl"></div>
                </div>
                <label class="cl">CEP</label>
                <input type="text" id="condo-zip" class="ci" placeholder="Somente números">
                <label class="cl">Rua</label>
                <input type="text" id="condo-street" class="ci" placeholder="Ex: Rua das Flores">
                <label class="cl">Número</label>
                <input type="text" id="condo-num" class="ci" placeholder="Ex: 123">
                <button id="condo-gen" class="cb">Gerar JSON</button>
                <div id="condo-out" style="display:none"></div>
                <button id="condo-copy" class="cb" style="background:#3498db!important;margin-top:10px;display:none">📋 Copiar JSON</button>
                <div id="condo-ok" style="color:var(--cg);font-size:10px;font-weight:bold;text-align:center;margin-top:5px;display:none">✅ COPIADO!</div>
            </div>
        `;
        document.body.appendChild(panel);

        minBtn.onclick = () => { panel.style.display = 'block'; minBtn.style.display = 'none'; isMinimized = false; };
        document.getElementById('condo-min').onclick = e => { e.stopPropagation(); panel.style.display = 'none'; minBtn.style.display = 'block'; isMinimized = true; };

        const cs = document.getElementById('condo-cs');
        const dl = document.getElementById('condo-dl');
        const cid = document.getElementById('condo-cid');

        function showList(filter) {
            dl.innerHTML = '';
            cities.filter(c => c.name.toLowerCase().includes(filter.toLowerCase())).forEach(c => {
                const d = document.createElement('div');
                d.className = 'condo-di';
                d.textContent = `${c.id} - ${c.name}`;
                d.onclick = () => { cs.value = c.name; cid.value = c.id; dl.style.display = 'none'; };
                dl.appendChild(d);
            });
            dl.style.display = dl.children.length ? 'block' : 'none';
        }
        cs.onfocus = () => showList(cs.value);
        cs.oninput = e => showList(e.target.value);
        document.addEventListener('click', e => { if (!e.target.closest('.condo-sc')) dl.style.display = 'none'; });

        let sx, sy, il, it;
        document.getElementById('condo-hdr').addEventListener('mousedown', e => {
            if (e.target.id === 'condo-min') return;
            isDrag = true; sx = e.clientX; sy = e.clientY; il = panel.offsetLeft; it = panel.offsetTop;
            const mm = ev => { if (isDrag) requestAnimationFrame(() => { panel.style.left = (il + ev.clientX - sx) + 'px'; panel.style.top = (it + ev.clientY - sy) + 'px'; }); };
            const mu = () => { isDrag = false; removeEventListener('mousemove', mm); removeEventListener('mouseup', mu); };
            addEventListener('mousemove', mm); addEventListener('mouseup', mu);
        });

        document.getElementById('condo-gen').onclick = () => {
            const name = document.getElementById('condo-name').value.trim();
            const cityId = cid.value;
            const cityName = cs.value.trim();
            const zip = document.getElementById('condo-zip').value.replace(/[^0-9]/g, '');
            const street = document.getElementById('condo-street').value.trim();
            const num = document.getElementById('condo-num').value.trim();
            if (!name || !cityId || !zip || !street || !num) return alert('Preencha todos os campos e selecione uma cidade válida.');
            const payload = { name, unityGroupType: [{id:0,label:'Bloco'}], unityType: [{id:0,label:'Apartamento'}], address: { district: {id:cityId,cityId,name:cityName}, zipNumber:zip, addressNumber:num, streetName:street } };
            const out = document.getElementById('condo-out');
            out.textContent = JSON.stringify(payload, null, 2);
            out.style.display = 'block';
            document.getElementById('condo-copy').style.display = 'block';
        };

        document.getElementById('condo-copy').onclick = () => {
            navigator.clipboard.writeText(document.getElementById('condo-out').textContent).then(() => {
                const ok = document.getElementById('condo-ok');
                ok.style.display = 'block'; setTimeout(() => ok.style.display = 'none', 2500);
            });
        };
    }

    function supervisor() {
        if (!document.getElementById('condo-panel')) renderApp();
        const p = document.getElementById('condo-panel');
        if (p && !isMinimized) {
            const rgb = window.getComputedStyle(document.body).backgroundColor.match(/\d+/g);
            if (rgb) { const b = (rgb[0]*299+rgb[1]*587+rgb[2]*114)/1000; p.classList.toggle('dark-mode', b < 200); }
        }
    }
    setInterval(supervisor, 1500);
    supervisor();
}

if (typeof window.condominioInicializado === 'undefined') carregarCondominio();
