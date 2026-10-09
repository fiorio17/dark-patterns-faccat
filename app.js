/* Dark Patterns — lógica do site */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const brl = n => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const pad2 = n => String(n).padStart(2, "0");
const byId = id => PADROES.find(p => p.id === id);

/* ---------- Menu, progresso, faixa ---------- */
(function () {
  $("#btnBurger").onclick = () => $("#menu").classList.toggle("open");
  $$("#menu a").forEach(a => a.addEventListener("click", () => $("#menu").classList.remove("open")));

  const bar = $("#progressBar");
  const onScroll = () => {
    const h = document.documentElement;
    bar.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight || 1)) * 100 + "%";
  };
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  const links = $$("#menu a");
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) links.forEach(a => a.classList.toggle("on", a.getAttribute("href") === "#" + e.target.id));
  }), { rootMargin: "-45% 0px -50% 0px" });
  $$("main > section").forEach(s => io.observe(s));

  $$("[data-count]").forEach(el => {
    const to = +el.dataset.count; let n = 0;
    const t = setInterval(() => { n++; el.textContent = n; if (n >= to) clearInterval(t); }, 700 / to);
  });
})();

(function () {
  const one = PADROES.map(p => `<span>${p.nome}</span>`).join("");
  $("#tickerTrack").innerHTML = one + one + one + one;
})();

/* ---------- Carrosséis ---------- */
window.initCarousels = function () {
  $$(".car").forEach(c => {
    if (c.dataset.ok) return; c.dataset.ok = 1;
    const t = $(".car-track", c);
    c.insertAdjacentHTML("beforeend", '<button class="car-btn prev" aria-label="Anterior">‹</button><button class="car-btn next" aria-label="Próximo">›</button>');
    const prev = $(".prev", c), next = $(".next", c);
    const upd = () => { prev.disabled = t.scrollLeft < 8; next.disabled = t.scrollLeft + t.clientWidth >= t.scrollWidth - 8; };
    prev.onclick = () => t.scrollBy({ left: -t.clientWidth * .8, behavior: "smooth" });
    next.onclick = () => t.scrollBy({ left: t.clientWidth * .8, behavior: "smooth" });
    t.addEventListener("scroll", upd, { passive: true }); addEventListener("resize", upd); upd();
  });
};

/* ---------- Modo apresentação ---------- */
(function () {
  const secs = $$("main > section");
  const bar = $("#presBar");
  const cur = () => {
    let best = 0, d = Infinity;
    secs.forEach((s, i) => { const v = Math.abs(s.getBoundingClientRect().top - 56); if (v < d) { d = v; best = i; } });
    return best;
  };
  const label = () => { const i = cur(); $("#pTitle").textContent = `${i + 1} / ${secs.length} · ${secs[i].dataset.title || ""}`; };
  const go = i => { secs[Math.max(0, Math.min(secs.length - 1, i))].scrollIntoView({ behavior: "smooth" }); };
  const toggle = () => {
    document.body.classList.toggle("pres");
    const on = document.body.classList.contains("pres");
    bar.hidden = !on;
    $("#btnPres").textContent = on ? "Sair da apresentação" : "Modo apresentação";
    if (on) { label(); setTimeout(() => go(cur()), 50); }
  };
  $("#btnPres").onclick = toggle; $("#pExit").onclick = toggle;
  $("#pPrev").onclick = () => go(cur() - 1); $("#pNext").onclick = () => go(cur() + 1);
  addEventListener("scroll", () => { if (!bar.hidden) label(); }, { passive: true });
  addEventListener("keydown", e => {
    if (e.target.closest("input,textarea,select") || e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key.toLowerCase() === "p") { toggle(); return; }
    if (!document.body.classList.contains("pres") || $("#dlg").open) return;
    if (e.key === "ArrowRight" || e.key === "PageDown") { e.preventDefault(); go(cur() + 1); }
    if (e.key === "ArrowLeft" || e.key === "PageUp") { e.preventDefault(); go(cur() - 1); }
    if (e.key === "Escape") toggle();
  });
})();

/* ---------- Revelação ao rolar ---------- */
(function () {
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .12 });
  window.observeReveal = root => $$(".rv:not(.in)", root).forEach(el => io.observe(el));
  observeReveal();
})();

/* ---------- Linha do tempo ---------- */
(function () {
  const ev = [
    ["2010", "Harry Brignull cunha o termo “dark patterns” e cria o catálogo darkpatterns.org (hoje deceptive.design)."],
    ["2018", "GDPR entra em vigor na União Europeia (maio) e a LGPD é sancionada no Brasil (agosto)."],
    ["2019", "Estudo de Mathur et al. mede dark patterns em larga escala: 11 mil sites de compras analisados."],
    ["2020–21", "LGPD entra em vigor (2020) e as sanções administrativas da ANPD passam a valer em agosto de 2021."],
    ["2022", "FTC (EUA) publica o relatório “Bringing Dark Patterns to Light”; a UE aprova o DSA, que veda interfaces enganosas (art. 25)."]
  ];
  const el = $("#timeline");
  el.innerHTML = ev.map((e, i) => `<button class="tl-i${i === 0 ? " on" : ""}"><b>${e[0]}</b><span>${e[1]}</span></button>`).join("");
  el.onclick = e => { const b = e.target.closest(".tl-i"); if (b) $$(".tl-i", el).forEach(x => x.classList.toggle("on", x === b)); };
})();

/* ---------- Vieses ---------- */
$("#viesGrid").innerHTML = VIESES.map((v, i) => `
  <article class="vies rv"><div class="num">${String(i + 1).padStart(2, "0")}</div><h3>${v.nome}</h3><p>${v.desc}</p>
  ${v.usado.map(u => `<span class="tag">${u}</span>`).join("")}</article>`).join("");
observeReveal($("#viesGrid"));
initCarousels();

/* ---------- Galeria ---------- */
(function () {
  let cat = "todos", q = "";
  const filters = $("#filters"), gal = $("#gallery");
  const chips = [["todos", "Todos (" + PADROES.length + ")"], ...Object.entries(CATEGORIAS).map(([k, v]) => [k, v.nome + " (" + PADROES.filter(p => p.cat === k).length + ")"])];
  filters.innerHTML = chips.map(([k, n]) => `<button class="chip${k === "todos" ? " on" : ""}" data-k="${k}">${n}</button>`).join("");
  filters.onclick = e => {
    const b = e.target.closest(".chip"); if (!b) return;
    cat = b.dataset.k; $$(".chip", filters).forEach(c => c.classList.toggle("on", c === b)); draw();
  };
  $("#search").oninput = e => { q = e.target.value.toLowerCase().trim(); draw(); };

  function draw() {
    const list = PADROES.map((p, n) => ({ ...p, n })).filter(p => (cat === "todos" || p.cat === cat) &&
      (!q || (p.nome + p.en + p.resumo + p.como + p.exemplo).toLowerCase().includes(q)));
    gal.innerHTML = list.map(p => `
      <button class="gcard" data-id="${p.id}" style="--c:${CATEGORIAS[p.cat].cor}">
        <div class="th"><div class="th-bg"></div><span class="num">${String(p.n + 1).padStart(2, "0")}</span>${THUMBS[p.id]}</div>
        <div class="body"><span class="cat">${CATEGORIAS[p.cat].nome}</span>
        <h3>${p.nome}</h3><small>${p.en}</small>
        <p>${p.resumo}</p><span class="more">Ver detalhes</span></div>
      </button>`).join("");
    $("#galEmpty").hidden = list.length > 0;
  }
  gal.onclick = e => { const c = e.target.closest(".gcard"); if (c) openDialog(c.dataset.id); };
  draw();

  const dlg = $("#dlg");
  $("#dlgX").onclick = () => dlg.close();
  dlg.addEventListener("click", e => { if (e.target === dlg) dlg.close(); });

  window.openDialog = id => {
    const p = byId(id), c = CATEGORIAS[p.cat];
    $("#dlgBody").innerHTML = `
      <div class="dlg-th" style="--c:${c.cor}"><div class="th"><div class="th-bg"></div><span class="num">${String(PADROES.indexOf(p) + 1).padStart(2, "0")}</span>${THUMBS[p.id]}</div></div>
      <div class="dbody"><div class="dh"><h3 id="dlgTitle">${p.nome}</h3><small>${p.en} · ${c.nome}</small></div>
      <div class="dl" style="--c:${c.cor}">
        <div><b>Como funciona</b><p>${p.como}</p></div>
        <div><b>Viés explorado</b><p>${p.vies}</p></div>
        <div><b>Efeito no usuário</b><p>${p.efeito}</p></div>
        <div class="jur"><b>Implicação jurídica</b><p>${p.juridico}</p></div>
        <div><b>Exemplo</b><p>${p.exemplo}</p></div>
      </div>
      ${p.demo ? `<p style="margin:22px 0 0"><button class="btn dk" id="goDemo">Ver demonstração interativa →</button></p>` : ""}</div>`;
    if (p.demo) $("#goDemo").onclick = () => { dlg.close(); selectDemo(p.demo); $("#demos").scrollIntoView({ behavior: "smooth" }); };
    dlg.showModal();
  };
})();

/* ---------- Demos ---------- */
const DEMOS = [
  {
    id: "urgencia", titulo: "Loja: urgência e escassez", tags: ["Falsa urgência", "Falsa escassez", "Prova social falsa"],
    law: "CDC art. 37, §1º: publicidade enganosa. Art. 30: a oferta veiculada obriga o fornecedor.",
    notes: {
      dark: ["O relógio <b>reinicia</b> quando chega a zero (aqui acelerado: 15 s).", "“Apenas 2 em estoque” e “pessoas vendo agora” são números fabricados.", "Notificações de “compras recentes” são geradas por script.", "Preço “de” inflado dá a impressão de grande desconto."],
      ethical: ["Sem cronômetro: o preço é o mesmo todos os dias.", "Estoque e prazos reais.", "Avaliações verificadas.", "O usuário decide no seu tempo."]
    },
    render(mode, el, ctx) {
      const dark = mode === "dark";
      el.innerHTML = `<div class="mock"><div class="bar">SuperTênis.com <span>🛒 0 itens</span></div>
        <div class="shoe">👟</div><h3>Tênis Corredor X</h3>
        <div class="price">R$ 199,90 ${dark ? "<s>R$ 599,90</s>" : ""}</div>
        ${dark ? `<p><span class="pill r" id="timer">⏳ Oferta termina em 00:15</span></p>
          <p><span class="pill y">🔥 Apenas 2 em estoque!</span> <span class="pill y" id="view">👀 17 pessoas vendo agora</span></p>`
          : `<p><span class="pill g">✔ Em estoque</span> Entrega em 3–5 dias úteis</p><p>Preço igual todos os dias · ★ 4,3 (128 avaliações verificadas)</p>`}
        <button class="mbtn go full" id="buy" style="margin-top:10px">Comprar agora</button><div id="out"></div></div>`;
      const t0 = Date.now(); let secs = 15, resets = 0, viewers = 17;
      const m = () => ctx.metrics(dark ? [["Reinícios do relógio", resets], ["Dados reais por trás", "nenhum"]] : [["Pressão artificial", "nenhuma"]]);
      m();
      if (dark) {
        ctx.every(1000, () => {
          secs--; if (secs < 0) { secs = 15; resets++; m(); }
          $("#timer", el).textContent = `⏳ Oferta termina em 00:${pad2(secs)}`;
        });
        ctx.every(2500, () => { viewers = Math.max(9, viewers + Math.round(Math.random() * 6 - 3)); $("#view", el).textContent = `👀 ${viewers} pessoas vendo agora`; });
        const nomes = ["Maria, de Curitiba", "Carlos, de Porto Alegre", "Ana, de São Paulo", "João, de Recife"];
        ctx.every(5000, () => {
          $$(".toast", el).forEach(x => x.remove());
          el.querySelector(".mock").insertAdjacentHTML("beforeend", `<div class="toast">🛍️ ${nomes[Math.floor(Math.random() * nomes.length)]} comprou há ${1 + Math.floor(Math.random() * 5)} min</div>`);
        });
      }
      $("#buy", el).onclick = () => {
        const s = Math.round((Date.now() - t0) / 1000);
        $("#out", el).innerHTML = dark
          ? `<div class="result">Você decidiu em ${s} s, sem comparar preços. Era a pressão do design, não a necessidade.</div>`
          : `<div class="result good">Compra simulada. Sem pressão: você poderia ter levado o tempo que quisesse.</div>`;
      };
    }
  },
  {
    id: "popup", titulo: "Pop-up de newsletter", tags: ["Confirmshaming", "Interferência visual"],
    law: "LGPD art. 5º, XII e art. 8º: o consentimento deve ser livre; constranger o usuário compromete essa liberdade.",
    notes: {
      dark: ["Botão <b>verde grande</b> para aceitar; recusa em <b>cinza 11 px</b>.", "Texto de recusa envergonha: “prefiro pagar mais caro”.", "O “X” de fechar é quase invisível (cor #e8e8e8 sobre branco).", "Tente fechar o pop-up e veja quantos cliques são necessários."],
      ethical: ["Duas opções com o <b>mesmo peso visual</b>.", "Texto de recusa neutro: “Agora não”.", "Botão de fechar visível e clicável.", "Benefício descrito com clareza."]
    },
    render(mode, el, ctx) {
      const dark = mode === "dark";
      const open = () => {
        el.innerHTML = `<div class="mock"><div class="bar">Portal Notícias <span>Hoje</span></div>
          <h3>Como economizar na conta de luz em 2026</h3><p>Especialistas listam 7 dicas simples para reduzir o consumo sem abrir mão do conforto…</p>
          <p style="color:#999">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          <div class="overlay"><div class="modal ${dark ? "" : "fair"}">
            <button class="x" id="px" aria-label="Fechar">✕</button>
            <h3>${dark ? "🎁 Ganhe 10% OFF agora!" : "Receba nossas novidades"}</h3>
            <p>${dark ? "Cadastre seu e-mail e receba ofertas exclusivas todos os dias." : "Enviamos 1 e-mail por semana. Cancele quando quiser."}</p>
            ${dark ? `<button class="mbtn go full" id="pyes" style="font-size:1.1rem;padding:16px">QUERO ECONOMIZAR!</button>
              <button class="mlink" id="pno">Não, obrigado. Prefiro pagar mais caro</button>`
              : `<div class="row"><button class="mbtn blue" id="pyes">Assinar</button><button class="mbtn line" id="pno">Agora não</button></div>`}
          </div></div></div>`;
        const done = (txt, good) => {
          el.innerHTML = `<div class="mock"><div class="bar">Portal Notícias <span>Hoje</span></div><h3>Como economizar na conta de luz em 2026</h3>
          <div class="result ${good ? "good" : ""}">${txt}</div><p style="margin-top:14px"><button class="mbtn line" id="reopen">Reabrir pop-up</button></p></div>`;
          $("#reopen", el).onclick = () => { ctx.clicks = -1; open(); ctx.metrics(base()); };
          ctx.metrics(base());
        };
        $("#pyes", el).onclick = () => done("Você entregou seu e-mail e passará a receber mensagens diárias.", false);
        $("#pno", el).onclick = () => done("Pop-up dispensado.", true);
        $("#px", el).onclick = () => done("Pop-up fechado pelo “X”.", true);
      };
      const base = () => [["Cliques dados", ctx.clicks], ["Tamanho do “X”", dark ? "11 px" : "18 px"]];
      ctx.onclick = () => ctx.metrics(base());
      open(); ctx.metrics(base());
    }
  },
  {
    id: "checkout", titulo: "Checkout: pré-seleção e linguagem confusa", tags: ["Pré-seleção", "Inserção sorrateira", "Linguagem confusa"],
    law: "LGPD art. 8º §4º e art. 9º §1º; CDC art. 39, III (fornecimento de serviço sem solicitação).",
    notes: {
      dark: ["Seguro e garantia já vêm <b>marcados</b> (inserção sorrateira + efeito padrão).", "Compartilhar dados com “parceiros” vem marcado.", "A última opção usa <b>dupla negação</b>: o que significa desmarcar?", "Tente chegar ao menor total possível."],
      ethical: ["Nada marcado por padrão: o usuário escolhe.", "Cada opção diz claramente o que faz e quanto custa.", "Marketing é <b>opt-in</b> opcional, descrito sem ambiguidade."]
    },
    render(mode, el, ctx) {
      const dark = mode === "dark", base = 189.9;
      const opts = [
        { id: "seg", t: "Seguro de entrega", d: "R$ 29,90", v: 29.9 },
        { id: "gar", t: "Garantia estendida (2 anos)", d: "R$ 49,90", v: 49.9 },
        { id: "par", t: dark ? "Compartilhar meus dados com parceiros" : "Compartilhar meus dados com empresas parceiras (opcional)", d: dark ? "Grátis" : "Grátis. Você pode recusar", v: 0 },
        { id: "mkt", t: dark ? "Desmarque esta caixa se você não deseja deixar de não receber ofertas" : "Quero receber ofertas por e-mail (opcional)", d: "", v: 0 }
      ];
      el.innerHTML = `<div class="mock"><div class="bar">AudioLoja <span>Passo 3 de 3</span></div>
        <h3>🎧 Fone Bluetooth Pro</h3><p>R$ ${brl(base).replace("R$", "").trim()}</p>
        ${opts.map(o => `<label class="optrow"><input type="checkbox" id="o_${o.id}" ${dark && o.id !== "mkt" ? "checked" : ""} ${dark && o.id === "mkt" ? "checked" : ""}>
          <span>${o.t}<small>${o.d}</small></span></label>`).join("")}
        <div class="sum"><span>Total</span><span id="tot"></span></div>
        <button class="mbtn go full" id="fin" style="margin-top:12px">Finalizar compra</button><div id="out"></div></div>`;
      const calc = () => {
        const sel = opts.filter(o => $("#o_" + o.id, el).checked);
        const extra = sel.reduce((s, o) => s + o.v, 0);
        $("#tot", el).textContent = brl(base + extra);
        ctx.metrics([["Total", brl(base + extra)], ["Extras", brl(extra)], ["Dados compartilhados", $("#o_par", el).checked ? "sim" : "não"]]);
        return { sel, extra };
      };
      el.onchange = calc;
      calc();
      $("#fin", el).onclick = () => {
        const { sel, extra } = calc();
        const par = sel.some(o => o.id === "par"), mkt = sel.some(o => o.id === "mkt");
        const msg = `Você pagou ${brl(base + extra)}` + (extra ? `, incluindo ${brl(extra)} em extras` : ", sem extras") +
          `. Dados compartilhados com parceiros: <b>${par ? "sim" : "não"}</b>. Ofertas por e-mail: <b>${mkt ? "sim" : "não"}</b>.`;
        $("#out", el).innerHTML = `<div class="result ${extra || par ? "" : "good"}">${msg}</div>`;
      };
    }
  },
  {
    id: "cancelar", titulo: "Cancelar assinatura", tags: ["Difícil de cancelar", "Obstrução"],
    law: "CDC art. 39, V e art. 51; Decreto 7.962/2013 (atendimento facilitado). Cancelar deve ser tão fácil quanto contratar.",
    notes: {
      dark: ["Assinar levou <b>1 clique</b>. Cancelar leva muito mais.", "O botão “Cancelar” é um <b>link cinza minúsculo</b>.", "Cada tela tenta reverter a decisão (culpa, oferta, pesquisa).", "No fim, é preciso <b>ligar</b> em horário comercial: canal diferente do de contratação."],
      ethical: ["Um botão claro “Cancelar assinatura”.", "Uma confirmação, com data de fim do acesso.", "Sem pesquisa obrigatória, sem telefone."]
    },
    render(mode, el, ctx) {
      const dark = mode === "dark";
      let step = 0;
      const shell = (inner, n, tot) => `<div class="mock"><div class="bar">StreamMax <span>Minha conta</span></div>
        <div class="steps">${Array.from({ length: tot }, (_, i) => `<i class="${i <= n ? "on" : ""}"></i>`).join("")}</div>${inner}</div>`;
      const draw = () => {
        let h = "";
        if (!dark) {
          if (step === 0) h = shell(`<h3>Plano Premium</h3><p>R$ 39,90/mês · renova em 02/11</p><button class="mbtn red" id="a">Cancelar assinatura</button>`, 0, 2);
          else if (step === 1) h = shell(`<h3>Confirmar cancelamento?</h3><p>Você mantém o acesso até 02/11.</p><div class="row"><button class="mbtn red" id="a">Confirmar</button><button class="mbtn line" id="b">Voltar</button></div>`, 1, 2);
          else h = `<div class="mock"><div class="result good"><b>Assinatura cancelada.</b> Acesso até 02/11. Um e-mail de confirmação foi enviado.</div><p style="margin-top:14px"><button class="mbtn line" id="r">Reiniciar</button></p></div>`;
        } else {
          if (step === 0) h = shell(`<h3>Plano Premium</h3><p>R$ 39,90/mês · renova em 02/11</p><button class="mbtn go full" id="b" style="padding:16px">Manter meu plano 💚</button><button class="mlink" id="a">cancelar assinatura</button>`, 0, 5);
          else if (step === 1) h = shell(`<h3>Tem certeza? 😢</h3><p>Você vai perder: seus perfis, suas listas, downloads offline e <b>todo o seu histórico</b>.</p><button class="mbtn go full" id="b">Continuar com Premium</button><button class="mlink" id="a">prosseguir com o cancelamento</button>`, 1, 5);
          else if (step === 2) h = shell(`<h3>🎉 Oferta exclusiva!</h3><p>50% de desconto por 3 meses.</p><button class="mbtn go full" id="b">Aceitar oferta</button><button class="mlink" id="a">não, quero cancelar mesmo assim</button>`, 2, 5);
          else if (step === 3) h = shell(`<h3>Pesquisa de saída (obrigatória)</h3><p>Por que você está saindo?</p>
            <label class="optrow"><input type="radio" name="w"> Preço</label><label class="optrow"><input type="radio" name="w"> Falta de conteúdo</label><label class="optrow"><input type="radio" name="w"> Outro</label>
            <button class="mbtn blue full" id="a" disabled>Enviar e continuar</button>`, 3, 5);
          else if (step === 4) h = shell(`<h3>Quase lá!</h3><p>Para concluir o cancelamento, ligue para <b>0800 000 0000</b> (seg–sex, 9h–17h) e informe seu CPF.</p><button class="mbtn go full" id="b">Voltar à minha conta</button>`, 4, 5);
          else h = `<div class="mock"><p>Você voltou ao início.</p><button class="mbtn line" id="r">Reiniciar</button></div>`;
        }
        el.innerHTML = h;
        const A = $("#a", el), B = $("#b", el), R = $("#r", el);
        if (dark && step === 3) { el.onchange = () => { A.disabled = false; }; }
        if (A) A.onclick = () => { step++; draw(); };
        if (B) B.onclick = () => { step = dark ? 5 : 0; draw(); };
        if (R) R.onclick = () => { step = 0; ctx.clicks = -1; draw(); };
        ctx.metrics([["Cliques", ctx.clicks], ["Etapa", dark ? Math.min(step + 1, 5) + " / 5" : Math.min(step + 1, 2) + " / 2"], ["Concluído?", dark ? "não, exige ligar" : step >= 2 ? "sim" : "—"]]);
      };
      draw();
      ctx.onclick = () => ctx.metrics([["Cliques", ctx.clicks], ["Etapa", dark ? Math.min(step + 1, 5) + " / 5" : Math.min(step + 1, 2) + " / 2"], ["Concluído?", dark ? "não, exige ligar" : step >= 2 ? "sim" : "—"]]);
    }
  },
  {
    id: "custos", titulo: "Ingresso: custos ocultos", tags: ["Custos ocultos", "Ancoragem"],
    law: "CDC art. 6º, III e art. 31; Decreto 7.962/2013, art. 2º: preço total e despesas adicionais devem ser informados claramente.",
    notes: {
      dark: ["O preço anunciado é <b>R$ 120</b>.", "Taxas surgem uma a uma, em letras pequenas, nas etapas seguintes.", "No final, o usuário já investiu tempo (<b>custo afundado</b>) e tende a pagar.", "Clique em “Continuar” para ver o preço evoluir."],
      ethical: ["O valor total (R$ 175,00) aparece <b>desde o início</b>, com detalhamento.", "Sem surpresas no pagamento."]
    },
    render(mode, el, ctx) {
      const dark = mode === "dark";
      const fees = [["Taxa de serviço", 22.5], ["Taxa de conveniência", 15], ["Taxa de processamento", 9.9], ["Entrega digital", 7.6]];
      const total = 120 + fees.reduce((s, f) => s + f[1], 0);
      let step = 0;
      const draw = () => {
        const shown = dark ? 120 : total;
        const lines = [];
        lines.push(`<div class="tgl"><span>Ingresso Show Nacional (setor B)</span><b>${brl(120)}</b></div>`);
        if (!dark || step >= 1) fees.slice(0, dark ? 1 : 4).forEach(f => lines.push(`<div class="tgl"><span style="${dark ? "font-size:.7rem;color:#999" : ""}">${f[0]}</span><b style="${dark ? "font-size:.75rem;color:#999;font-weight:400" : ""}">${brl(f[1])}</b></div>`));
        if (!dark) { /* tudo já listado */ }
        else if (step >= 2) fees.slice(1).forEach(f => lines.push(`<div class="tgl"><span style="font-size:.7rem;color:#999">${f[0]}</span><b style="font-size:.75rem;color:#999;font-weight:400">${brl(f[1])}</b></div>`));
        const showTotal = !dark || step >= 2 ? total : (step === 1 ? 120 + 22.5 : 120);
        const last = step >= 2;
        el.innerHTML = `<div class="mock"><div class="bar">Ingressos.com <span>Etapa ${Math.min(step + 1, 3)} de 3</span></div>
          <div class="price">${dark && !last ? brl(shown) : brl(showTotal)}${dark && !last ? "" : ""} <small style="font-size:.8rem;color:#777;font-weight:400">${dark ? "" : "total, já com taxas"}</small></div>
          ${lines.join("")}
          ${last || !dark ? `<div class="sum"><span>Total a pagar</span><span>${brl(total)}</span></div>` : ""}
          ${step < 2 ? `<button class="mbtn go full" id="n" style="margin-top:14px">Continuar</button>` : `<button class="mbtn go full" id="n" style="margin-top:14px">Pagar ${brl(total)}</button>`}
          <div id="out"></div></div>`;
        ctx.metrics([["Preço no início", brl(dark ? 120 : total)], ["Preço final", brl(total)], ["Acréscimo", dark ? "+" + (Math.round(((total / 120) - 1) * 1000) / 10).toString().replace(".", ",") + "%" : "0%"]]);
        $("#n", el).onclick = () => {
          if (step < 2) { step++; draw(); return; }
          const pct = Math.round(((total / 120) - 1) * 1000) / 10;
          $("#out", el).innerHTML = dark
            ? `<div class="bars"><div style="background:#1a8f3c;width:${120 / total * 100}%">Anunciado ${brl(120)}</div><div style="background:#e4572e;width:100%">Pago ${brl(total)} (+${String(pct).replace(".", ",")}%)</div></div><div class="result">O preço “de vitrine” era ${String(pct).replace(".", ",")}% menor do que o realmente cobrado.</div>`
            : `<div class="result good">Pago exatamente o valor visto desde o início: ${brl(total)}.</div>`;
        };
      };
      draw();
    }
  },
  {
    id: "cookies", titulo: "Banner de cookies", tags: ["Privacy Zuckering", "Interferência visual", "Insistência"],
    law: "LGPD art. 7º–9º; Guia de Cookies da ANPD: rejeitar deve ser tão simples quanto aceitar; sem pré-marcação.",
    notes: {
      dark: ["<b>Aceitar</b>: 1 clique, botão azul enorme.", "<b>Recusar</b> não existe: só “Configurar” em texto pequeno.", "O painel traz <b>12 finalidades já ativadas</b>: é preciso desligar uma a uma.", "Meça: quantos cliques para recusar tudo?"],
      ethical: ["“Aceitar” e “Rejeitar” lado a lado, mesmo peso visual.", "Só cookies estritamente necessários vêm ativos.", "Personalizar é opcional."]
    },
    render(mode, el, ctx) {
      const dark = mode === "dark";
      const cats = ["Estatísticas", "Publicidade personalizada", "Perfilamento de interesses", "Compartilhamento com parceiros", "Mapas de calor", "Redes sociais", "Geolocalização", "Teste A/B", "Remarketing", "Análise de comportamento", "Identificação entre dispositivos", "Vendas a terceiros"];
      const page = (inner) => `<div class="mock"><div class="bar">Portal Notícias <span>Hoje</span></div><h3>Resultados do campeonato</h3><p>Confira os melhores momentos da rodada e a tabela atualizada…</p><p style="color:#999">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.</p>${inner}</div>`;
      const metr = (extra) => ctx.metrics([["Cliques dados", ctx.clicks], ["Para aceitar", "1 clique"], ["Para recusar", dark ? "≥ 14 cliques" : "1 clique"], ...(extra || [])]);
      const banner = () => {
        el.innerHTML = page(dark
          ? `<div class="cookie"><p style="margin:0 0 10px;font-size:.85rem">Usamos cookies para melhorar sua experiência e personalizar anúncios.</p>
              <button class="mbtn blue full" id="ac" style="padding:14px">ACEITAR TODOS</button><button class="mlink" id="cf">configurar preferências</button></div>`
          : `<div class="cookie"><p style="margin:0 0 10px;font-size:.85rem">Usamos cookies essenciais para o site funcionar. Os demais só com sua permissão.</p>
              <div class="row"><button class="mbtn blue" id="ac">Aceitar todos</button><button class="mbtn blue" id="rj">Rejeitar</button><button class="mbtn line" id="cf">Personalizar</button></div></div>`);
        $("#ac", el).onclick = () => end("Você consentiu com <b>12 finalidades</b> (incluindo venda a terceiros) com apenas 1 clique.", false);
        if ($("#rj", el)) $("#rj", el).onclick = () => end("Você recusou todos os cookies opcionais com 1 clique.", true);
        $("#cf", el).onclick = panel;
        metr();
      };
      const panel = () => {
        el.innerHTML = page(`<div class="cookie panel"><b>Preferências de privacidade</b>
          ${cats.map((c, i) => `<div class="tgl"><span>${c}</span><input type="checkbox" class="tg" ${dark ? "checked" : ""}></div>`).join("")}
          ${dark ? `<button class="mbtn blue full" id="sv" style="margin-top:10px;padding:14px">ACEITAR E FECHAR</button><button class="mlink" id="sv2">salvar minhas escolhas</button>`
            : `<button class="mbtn blue full" id="sv2" style="margin-top:10px">Salvar minhas escolhas</button>`}</div>`);
        if (dark) $("#sv", el).onclick = () => end("Você acabou aceitando tudo ao clicar no botão grande e colorido.", false);
        $("#sv2", el).onclick = () => {
          const on = $$(".tg", el).filter(x => x.checked).length;
          end(on ? `Você salvou com <b>${on} finalidades ainda ativas</b>.` : `Você recusou tudo, após <b>${ctx.clicks} cliques</b>.`, !on);
        };
        metr();
      };
      const end = (msg, good) => {
        el.innerHTML = page(`<div class="result ${good ? "good" : ""}">${msg}</div><p style="margin-top:12px"><button class="mbtn line" id="rs">Reiniciar</button></p>`);
        $("#rs", el).onclick = () => { ctx.clicks = -1; banner(); };
        metr();
      };
      ctx.onclick = () => metr();
      banner();
    }
  }
];

let demoCur = DEMOS[0].id, demoMode = "dark", timers = [];
const ctx = {
  clicks: 0, onclick: null,
  every(ms, fn) { timers.push(setInterval(fn, ms)); },
  metrics(list) { $("#metrics").innerHTML = list.map(([k, v]) => `<div><b>${v}</b><span>${k}</span></div>`).join(""); }
};

function selectDemo(id) { demoCur = id; mountDemo(); }

function mountDemo() {
  timers.forEach(clearInterval); timers = [];
  ctx.clicks = 0; ctx.onclick = null;
  const d = DEMOS.find(x => x.id === demoCur);
  $$(".dtab").forEach(t => t.classList.toggle("on", t.dataset.id === demoCur));
  $$("#modeSwitch button").forEach(b => b.classList.toggle("on", b.dataset.mode === demoMode));
  const n = d.notes[demoMode];
  $("#notes").className = "notes " + (demoMode === "dark" ? "d" : "e");
  $("#notes").innerHTML = `<h4>${demoMode === "dark" ? "O que a tela está fazendo" : "O que muda na versão ética"}</h4>
    <ul>${n.map(x => `<li>${x}</li>`).join("")}</ul>
    <div class="metric" id="metrics"></div>
    <div>${d.tags.map(t => `<span class="tag">${t}</span>`).join("")}</div>
    <p class="law"><b>Base jurídica:</b> ${d.law}</p>`;
  const stage = $("#stage");
  stage.onchange = null;
  stage.onclick = e => { if (e.target.closest("button,input")) { ctx.clicks++; if (ctx.onclick) ctx.onclick(); } };
  d.render(demoMode, stage, ctx);
}

$("#demoTabs").innerHTML = DEMOS.map(d => `<button class="dtab" role="tab" data-id="${d.id}">${d.titulo}</button>`).join("");
$("#demoTabs").onclick = e => { const b = e.target.closest(".dtab"); if (b) selectDemo(b.dataset.id); };
$("#modeSwitch").onclick = e => { const b = e.target.closest("button"); if (b) { demoMode = b.dataset.mode; mountDemo(); } };
$("#demoReset").onclick = mountDemo;
mountDemo();

/* ---------- Jurídico ---------- */
(function () {
  const tabs = $("#leiTabs"), body = $("#leiBody");
  tabs.innerHTML = Object.entries(LEIS).map(([k, v], i) => `<button class="dtab${i ? "" : " on"}" data-k="${k}">${v.titulo}</button>`).join("");
  const show = k => {
    const l = LEIS[k];
    body.innerHTML = `<p class="note" style="max-width:780px">${l.intro}</p><div class="leis">${l.itens.map(i => `
      <div class="lei"><div class="art">${i.art}</div><div><p>${i.txt}</p>${i.pad.map(p => `<span class="tag">${p}</span>`).join("")}</div></div>`).join("")}</div>`;
    $$(".dtab", tabs).forEach(t => t.classList.toggle("on", t.dataset.k === k));
  };
  tabs.onclick = e => { const b = e.target.closest(".dtab"); if (b) show(b.dataset.k); };
  show("lgpd");
})();

/* ---------- Quiz ---------- */
(function () {
  const box = $("#quizBox");
  let i = 0, score = 0;
  const shuffle = a => a.map(v => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map(x => x[1]);
  function ask() {
    if (i >= QUIZ.length) {
      const msg = score >= 8 ? "Olhar treinado: nenhum dark pattern te engana!" : score >= 5 ? "Bom! Mas alguns ainda passam batido." : "É por isso que dark patterns funcionam: são projetados para não serem notados.";
      box.innerHTML = `<div class="q-end"><p>Seu resultado</p><div class="big">${score} / ${QUIZ.length}</div><p>${msg}</p><button class="btn" id="qr">Refazer</button></div>`;
      $("#qr").onclick = () => { i = 0; score = 0; ask(); };
      return;
    }
    const q = QUIZ[i];
    const opts = shuffle([byId(q.resp), ...shuffle(PADROES.filter(p => p.id !== q.resp)).slice(0, 3)]);
    box.innerHTML = `<div class="q-meta"><span>Pergunta ${i + 1} de ${QUIZ.length}</span><span>Acertos: ${score}</span></div><div class="q-bar"><i style="width:${i / QUIZ.length * 100}%"></i></div>
      <div class="q-scene">${q.cena}</div>
      <div class="q-opts">${opts.map(o => `<button class="q-opt" data-id="${o.id}">${o.nome}</button>`).join("")}</div>
      <div id="qfb"></div>`;
    $$(".q-opt", box).forEach(b => b.onclick = () => {
      const ok = b.dataset.id === q.resp;
      if (ok) score++;
      $$(".q-opt", box).forEach(x => { x.disabled = true; if (x.dataset.id === q.resp) x.classList.add("right"); });
      if (!ok) b.classList.add("wrong");
      $("#qfb").innerHTML = `<div class="q-fb"><b>${ok ? "Correto." : "Não foi dessa vez."}</b> ${q.expl}<p style="margin:12px 0 0"><button class="btn" id="qn">${i + 1 < QUIZ.length ? "Próxima →" : "Ver resultado"}</button></p></div>`;
      $("#qn").onclick = () => { i++; ask(); };
    });
  }
  ask();
})();

/* ---------- Desafio: encontre os dark patterns ---------- */
(function () {
  const spots = [
    ["falsa-urgencia", "O relógio é decorativo: reinicia ao chegar a zero e cria pressa artificial."],
    ["falsa-escassez", "“Resta 1 unidade” sem qualquer dado de estoque verificável."],
    ["prova-social", "Número de visitantes fabricado para induzir o efeito manada."],
    ["insercao", "O seguro de R$ 249 já vem marcado: o usuário precisa perceber e desmarcar."],
    ["custos-ocultos", "O frete, custo relevante, só será revelado no último passo, em letra minúscula."],
    ["anuncio-disfarcado", "Um anúncio imita o layout de um produto relacionado; o aviso “Anúncio” é quase invisível."],
    ["confirmshaming", "A recusa é escrita para constranger, em link cinza minúsculo."]
  ];
  let found = new Set();
  const stage = $("#huntStage");
  const render = () => {
    found = new Set();
    stage.innerHTML = `<div class="mock"><div class="bar">Ofertão.com <span>Carrinho (1)</span></div>
      <span class="hs" data-i="0"><span class="pill r">Oferta termina em 04:59</span></span>
      <h3 style="margin-top:8px">Smartphone Galaxo S9 128 GB</h3>
      <div class="price">R$ 1.299 <s>R$ 3.499</s></div>
      <p><span class="hs pill y" data-i="1">Resta apenas 1 unidade!</span> <span class="hs pill y" data-i="2">13 pessoas estão vendo agora</span></p>
      <p class="hs" data-i="4" style="font-size:10px;color:#aaa;display:inline-block">Frete calculado na finalização da compra</p>
      <label class="optrow hs" data-i="3"><input type="checkbox" checked><span>Adicionar Seguro Premium<small>R$ 249,00</small></span></label>
      <div class="prodgrid"><div class="prod"><i></i>Película</div><div class="prod hs" data-i="5"><i></i>Capa Ultra <span style="font-size:8px;color:#c8c8c8">Anúncio</span></div><div class="prod"><i></i>Carregador</div></div>
      <div style="background:#f3f6ff;border-radius:8px;padding:10px;text-align:center"><b>Receba 5% de desconto</b><br>
        <button class="mbtn blue" style="margin:6px 0;padding:8px 16px">Quero meu desconto</button><br>
        <span class="hs mlink" data-i="6" style="display:inline-block">Não, prefiro pagar o preço cheio</span></div></div>`;
    list();
  };
  const list = () => {
    $("#huntN").textContent = found.size + "/7";
    $("#huntBar").style.width = found.size / 7 * 100 + "%";
    $("#huntList").innerHTML = found.size ? [...found].map(i => `<li><b>${byId(spots[i][0]).nome}</b><span>${spots[i][1]}</span></li>`).join("")
      : `<li style="border-color:var(--line)"><span>Nenhum padrão encontrado ainda.</span></li>`;
    $$(".hs", stage).forEach(h => h.classList.toggle("found", found.has(+h.dataset.i)));
    if (found.size === 7) $("#huntList").insertAdjacentHTML("afterbegin", `<li style="border-color:var(--acc)"><b>Completo.</b><span>Todos os 7 padrões encontrados.</span></li>`);
  };
  stage.onclick = e => {
    const h = e.target.closest(".hs"); if (!h) return;
    e.preventDefault(); found.add(+h.dataset.i); list();
  };
  $("#huntHint").onclick = () => {
    const h = $$(".hs", stage).find(x => !found.has(+x.dataset.i)); if (!h) return;
    h.classList.remove("hint"); void h.offsetWidth; h.classList.add("hint");
  };
  $("#huntAll").onclick = () => { spots.forEach((_, i) => found.add(i)); list(); };
  $("#huntReset").onclick = render;
  render();
})();

/* ---------- Casos reais ---------- */
$("#casos").innerHTML = CASOS.map(c => `<article class="case"><span class="k">${c.k}</span><h3>${c.nome}</h3><span class="v">${c.v}</span><p>${c.txt}</p><div>${c.tags.map(t => `<span class="tag">${t}</span>`).join("")}</div><small>Fonte: ${c.fonte}</small></article>`).join("");
initCarousels();

/* ---------- Jurisdições: caso real + onde incide ---------- */
(function () {
  const J = { br: "Brasil", ue: "União Europeia", us: "Estados Unidos" };
  const LV = { 2: ["l2", "Norma específica"], 1: ["l1", "Norma geral"], 0: ["l0", "Sem previsão direta"] };
  let ci = 0, jur = "br", found = new Set(), cur = null;
  const stage = $("#jxStage"), panel = $("#jxPanel");

  $("#jxTabs").innerHTML = JX_CASOS.map((c, i) => `<button class="dtab${i ? "" : " on"}" data-i="${i}">${c.titulo}</button>`).join("");
  $("#jxTabs").onclick = e => { const b = e.target.closest(".dtab"); if (b) { ci = +b.dataset.i; load(); } };
  $("#jxSwitch").onclick = e => {
    const b = e.target.closest("button"); if (!b) return;
    jur = b.dataset.j; $$("#jxSwitch button").forEach(x => x.classList.toggle("on", x === b)); drawPanel();
  };
  $("#jxAll").onclick = () => { JX_CASOS[ci].spots.forEach((_, i) => found.add(i)); cur = cur ?? 0; refresh(); };
  $("#jxReset").onclick = () => load();

  function load() {
    const c = JX_CASOS[ci]; found = new Set(); cur = null;
    $$("#jxTabs .dtab").forEach((t, i) => t.classList.toggle("on", i === ci));
    $("#jxCase").innerHTML = `<b>${c.ref}.</b> ${c.resumo}<small>Reconstrução ilustrativa de interface, feita para fins didáticos.</small>`;
    stage.innerHTML = c.build();
    refresh();
  }
  stage.onclick = e => {
    const h = e.target.closest(".hs"); if (!h) return;
    e.preventDefault(); cur = +h.dataset.i; found.add(cur); refresh();
  };
  function refresh() {
    $$(".hs", stage).forEach(h => h.classList.toggle("found", found.has(+h.dataset.i)));
    drawPanel(); drawMatrix();
  }
  function drawPanel() {
    const c = JX_CASOS[ci];
    if (cur === null) {
      panel.className = "notes";
      panel.innerHTML = `<h4>Clique na interface</h4><p class="note" style="color:#bdbab0">Há <b>${c.spots.length} pontos</b> com possível problema jurídico. Encontre-os e compare o tratamento em cada jurisdição.</p><div class="metric"><div><b>0/${c.spots.length}</b><span>pontos encontrados</span></div></div>`;
      return;
    }
    const s = c.spots[cur];
    panel.innerHTML = `<span class="tag jx-pat">${s.pat}</span><h4>${s.nome}</h4>
      ${["br", "ue", "us"].map(k => { const d = s[k], l = LV[d.n]; return `<div class="jr${k === jur ? " on" : ""}"><div class="h"><b>${J[k]}</b><span class="lv ${l[0]}">${l[1]}</span></div><span class="nm">${d.norma}</span>${d.txt}</div>`; }).join("")}
      <div class="metric"><div><b>${found.size}/${c.spots.length}</b><span>pontos encontrados</span></div></div>`;
  }
  function drawMatrix() {
    const c = JX_CASOS[ci];
    $("#jxMatrix").innerHTML = `<table><thead><tr><th>Ponto da interface</th><th>Brasil</th><th>União Europeia</th><th>Estados Unidos</th></tr></thead><tbody>${c.spots.map((s, i) => {
      if (!found.has(i)) return `<tr><td class="q">Ponto ${i + 1} (ainda não encontrado)</td><td class="q">?</td><td class="q">?</td><td class="q">?</td></tr>`;
      return `<tr><td><b>${s.nome}</b><br><span class="tag">${s.pat}</span></td>${["br", "ue", "us"].map(k => { const l = LV[s[k].n]; return `<td><span class="lv ${l[0]}">${l[1]}</span></td>`; }).join("")}</tr>`;
    }).join("")}</tbody></table>`;
  }
  load();
})();
