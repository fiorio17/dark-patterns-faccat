/* Casos reais reconstruídos + tratamento por jurisdição.
   n: 2 = norma específica ou decisão direta · 1 = norma geral / aplicação indireta · 0 = sem previsão direta */
const JX_CASOS = [
  {
    id: "cookies", titulo: "Banner de cookies", ref: "CNIL (França), decisão de 31/12/2021",
    resumo: "A autoridade francesa multou Google (€ 150 mi) e Facebook (€ 60 mi) porque aceitar cookies exigia 1 clique e recusar exigia vários.",
    links: [["CNIL: caso Facebook", "https://www.cnil.fr/fr/cookies-cloture-de-linjonction-prononcee-lencontre-de-facebook"], ["CNIL: caso Google", "https://www.cnil.fr/fr/cloture-de-linjonction-prononcee-lencontre-de-google-0"], ["Guia de Cookies da ANPD", "https://www.gov.br/anpd/pt-br/centrais-de-conteudo/materiais-educativos-e-publicacoes/guia_orientativo_cookies_e_protecao_de_dados_pessoais"]],
    spots: [
      { nome: "Botão “ACEITAR TODOS” em destaque", pat: "Interferência visual",
        br: { n: 2, norma: "LGPD art. 8º e Guia de Cookies da ANPD", txt: "Rejeitar deve ser tão simples quanto aceitar; destaque visual desigual compromete a liberdade do consentimento." },
        ue: { n: 2, norma: "GDPR art. 4(11) e 7 · decisão da CNIL", txt: "Consentimento precisa ser livre. A CNIL considerou o desequilíbrio entre aceitar e recusar uma violação." },
        us: { n: 1, norma: "FTC Act, seção 5 · regras do CCPA/CPRA (Califórnia)", txt: "Não há lei federal de cookies, mas a Califórnia afirma que consentimento obtido por dark pattern não vale." } },
      { nome: "Ausência de botão “Rejeitar”", pat: "Privacy Zuckering",
        br: { n: 2, norma: "LGPD art. 7º–9º · Guia da ANPD", txt: "O titular deve conseguir recusar cookies não essenciais de forma clara e sem esforço desproporcional." },
        ue: { n: 2, norma: "Diretiva ePrivacy art. 5(3) + GDPR", txt: "Fundamento direto da multa: a recusa era mais difícil do que a aceitação." },
        us: { n: 1, norma: "CCPA/CPRA · FTC Act, seção 5", txt: "Tratado como prática potencialmente enganosa ou como violação do direito de optar por não compartilhar dados." } },
      { nome: "12 finalidades já ativadas no painel", pat: "Pré-seleção",
        br: { n: 2, norma: "LGPD art. 8º §4º e art. 5º, XII", txt: "Autorização genérica é nula e o consentimento deve ser inequívoco, não presumido por marcação prévia." },
        ue: { n: 2, norma: "TJUE, caso Planet49 (C-673/17), 2019", txt: "Caixas pré-marcadas não geram consentimento válido." },
        us: { n: 1, norma: "CPRA (regulamento do CCPA)", txt: "Opções pré-marcadas favorecendo a empresa são tratadas como indício de dark pattern." } },
      { nome: "“Ao continuar, você concorda”", pat: "Consentimento presumido",
        br: { n: 2, norma: "LGPD art. 5º, XII e art. 9º §1º", txt: "Consentimento exige manifestação inequívoca; informação que não seja clara pode anulá-lo." },
        ue: { n: 2, norma: "GDPR considerando 32", txt: "Silêncio, inatividade ou continuar navegando não configuram consentimento." },
        us: { n: 0, norma: "Sem previsão federal direta", txt: "Nos EUA o modelo geral é opt-out; só alguns estados exigem consentimento prévio." } }
    ],
    build(el) {
      return `<div class="mock"><div class="bar">Portal Notícias <span>Hoje</span></div><h3>Resultados da rodada</h3><p>Confira os melhores momentos e a tabela atualizada…</p><p style="color:#999">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.</p>
        <div class="cookie" style="position:static;margin-top:16px;border:1px solid #ddd;border-radius:8px">
          <p class="hs" data-i="3" style="margin:0 0 10px;font-size:.85rem;display:inline-block">Usamos cookies. Ao continuar, você concorda com o uso e o compartilhamento com parceiros.</p>
          <button class="mbtn blue full hs" data-i="0" style="padding:14px">ACEITAR TODOS</button>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px">
            <span class="hs mlink" data-i="1" style="text-decoration:none;color:#c6c6c6;font-size:11px">(sem opção “Rejeitar”)</span>
            <span class="hs mlink" data-i="2" style="font-size:11px">configurar · 12 de 12 ativados</span></div></div></div>`;
    }
  },
  {
    id: "prime", titulo: "Cancelamento de assinatura", ref: "FTC × Amazon Prime (EUA), 2023",
    resumo: "A FTC processou a Amazon alegando que o Prime era contratado com poucos cliques, mas cancelar exigia atravessar várias telas. Em setembro de 2025 houve acordo de US$ 2,5 bilhões.",
    links: [["FTC: ação (2023)", "https://www.ftc.gov/news-events/news/press-releases/2023/06/ftc-takes-action-against-amazon-enrolling-consumers-amazon-prime-without-consent-sabotaging-their"], ["FTC: acordo (2025)", "https://www.ftc.gov/news-events/news/press-releases/2025/09/ftc-secures-historic-25-billion-settlement-against-amazon"], ["Página do caso", "https://www.ftc.gov/legal-library/browse/cases-proceedings/2123050-amazoncom-inc-rosca-ftc-v"]],
    spots: [
      { nome: "“Manter meu plano” enorme × “cancelar” minúsculo", pat: "Interferência visual",
        br: { n: 1, norma: "CDC art. 6º, III e art. 39, IV", txt: "Prevalecer-se da fraqueza do consumidor e não informar com clareza são práticas vedadas." },
        ue: { n: 1, norma: "Diretiva 2005/29/CE (práticas desleais) · DSA art. 25", txt: "Ação enganosa/agressiva; plataformas online não podem projetar interfaces que manipulem a escolha." },
        us: { n: 2, norma: "FTC Act, seção 5 · ROSCA", txt: "Base da ação da FTC: fluxo concebido para dificultar a saída." } },
      { nome: "Oferta de desconto antes de cancelar", pat: "Obstrução",
        br: { n: 1, norma: "CDC art. 39, V e art. 51", txt: "Exigir etapas excessivas pode configurar vantagem manifestamente excessiva ou cláusula abusiva." },
        ue: { n: 1, norma: "Diretiva 2005/29/CE · DSA art. 25", txt: "Etapas que desviam do objetivo do usuário são avaliadas como prática desleal." },
        us: { n: 2, norma: "ROSCA · FTC Act, seção 5", txt: "A lei exige mecanismo simples para interromper cobranças recorrentes." } },
      { nome: "Pesquisa obrigatória antes de concluir", pat: "Obstrução",
        br: { n: 1, norma: "Decreto 7.962/2013 · CDC art. 39, V", txt: "Atendimento e exercício de direitos devem ser facilitados, sem barreiras artificiais." },
        ue: { n: 1, norma: "Diretiva 2011/83/UE e leis nacionais", txt: "A Alemanha criou o “botão de cancelamento” (§ 312k BGB) para assinaturas online." },
        us: { n: 2, norma: "ROSCA", txt: "Condicionar o cancelamento a passos desnecessários pode violar o dever de simplicidade." } },
      { nome: "“Para concluir, ligue para o SAC”", pat: "Difícil de cancelar",
        br: { n: 2, norma: "CDC art. 39, V · regras do SAC (Decreto 11.034/2022)", txt: "Cancelar deve ser possível pelos meios facilitados e no mesmo canal da contratação." },
        ue: { n: 2, norma: "§ 312k BGB (Alemanha) · Diretiva 2011/83/UE", txt: "Exige botão de cancelamento claro e acessível no mesmo ambiente da contratação." },
        us: { n: 2, norma: "ROSCA", txt: "A FTC trata a mudança de canal para cancelar como obstáculo ilícito." } }
    ],
    build() {
      return `<div class="mock"><div class="bar">Prime <span>Minha conta</span></div>
        <h3>Plano Premium</h3><p>R$ 39,90/mês · renova em 02/11</p>
        <p class="hs" data-i="1" style="background:#fff7d6;padding:8px;border-radius:6px;margin:12px 0 4px">🎉 Antes de ir: 50% de desconto por 3 meses</p>
        <p class="hs" data-i="2" style="background:#eef2ff;padding:8px;border-radius:6px;margin:4px 0">Pesquisa de saída (obrigatória): por que está saindo?</p>
        <div class="hs" data-i="0" style="margin-top:14px"><button class="mbtn go full" style="padding:16px">Manter meu plano</button><div style="text-align:center"><span class="mlink" style="display:inline-block">cancelar assinatura</span></div></div>
        <p class="hs" data-i="3" style="margin-top:14px;font-size:.85rem;border-top:1px dashed #ccc;padding-top:10px">Para concluir: ligue para <b>0800 000 0000</b> (seg–sex, 9h–17h).</p></div>`;
    }
  },
  {
    id: "adobe", titulo: "Assinatura com taxa escondida", ref: "FTC e DOJ × Adobe (EUA), 2024",
    resumo: "A FTC alega que o plano “anual pago mensalmente” vinha pré-selecionado, que a multa de cancelamento era escondida e que cancelar exigia várias páginas e atendimentos.",
    links: [["FTC: comunicado (2024)", "https://www.ftc.gov/news-events/news/press-releases/2024/06/ftc-takes-action-against-adobe-executives-hiding-fees-preventing-consumers-easily-cancelling"], ["Página do caso", "https://www.ftc.gov/legal-library/browse/cases-proceedings/222-3055-adobe-inc-us-v"]],
    spots: [
      { nome: "Plano anual já selecionado por padrão", pat: "Pré-seleção",
        br: { n: 1, norma: "CDC art. 6º, III e art. 46", txt: "O consumidor deve conhecer o conteúdo do contrato; condição desfavorável imposta por padrão pode violar o dever de informação." },
        ue: { n: 1, norma: "Diretiva 2011/83/UE art. 22", txt: "Opções pré-marcadas que geram pagamento ou obrigação adicional não podem ser impostas ao consumidor." },
        us: { n: 2, norma: "ROSCA · FTC Act, seção 5", txt: "A ação cita a pré-seleção do plano como forma de levar o usuário a um contrato de um ano." } },
      { nome: "Taxa de cancelamento em letras miúdas", pat: "Custos ocultos",
        br: { n: 2, norma: "CDC art. 6º, III e art. 31 · Decreto 7.962/2013 art. 2º", txt: "Preço, encargos e condições devem ser informados de forma clara e destacada antes da contratação." },
        ue: { n: 2, norma: "Diretiva 2011/83/UE art. 6º", txt: "Informações pré-contratuais devem incluir preço total e condições de rescisão, de forma clara." },
        us: { n: 2, norma: "ROSCA", txt: "A lei exige divulgar com clareza os termos materiais, incluindo taxas de cancelamento, antes de coletar o pagamento." } },
      { nome: "Cancelamento em várias páginas", pat: "Difícil de cancelar",
        br: { n: 1, norma: "CDC art. 39, V e art. 51 · Decreto 11.034/2022", txt: "Etapas excessivas para sair do contrato podem configurar vantagem manifestamente excessiva." },
        ue: { n: 1, norma: "§ 312k BGB (Alemanha) · Diretiva 2005/29/CE", txt: "Alemanha exige botão de cancelamento claro; no restante da UE aplica-se a regra geral de práticas desleais." },
        us: { n: 2, norma: "ROSCA", txt: "A lei exige mecanismo simples para interromper cobranças recorrentes." } },
      { nome: "Chat e telefone que “caem” ao pedir cancelamento", pat: "Obstrução",
        br: { n: 1, norma: "CDC art. 39, V e art. 51, IV", txt: "Atendimento que impede na prática o exercício do direito pode configurar prática abusiva." },
        ue: { n: 1, norma: "Diretiva 2005/29/CE · Diretiva 2011/83/UE", txt: "Obstáculos não contratuais ao exercício de direitos podem ser práticas comerciais desleais." },
        us: { n: 2, norma: "ROSCA · FTC Act, seção 5", txt: "Obstáculos de atendimento foram alegados como parte do fluxo de cancelamento ilícito." } }
    ],
    build() {
      return `<div class="mock"><div class="bar">Criativa Cloud <span>Escolha seu plano</span></div>
        <div class="hs" data-i="0" style="border:2px solid #1769ff;border-radius:8px;padding:10px;margin-bottom:8px;background:#eef3ff"><b>✔ Anual, pago mensalmente</b><div style="font-size:1.4rem;font-weight:800">R$ 99/mês</div></div>
        <div style="border:1px solid #ddd;border-radius:8px;padding:10px;margin-bottom:8px"><b>Mensal</b><div style="font-size:1.1rem">R$ 149/mês</div></div>
        <p class="hs" data-i="1" style="font-size:9px;color:#b5b5b5;display:inline-block">Cancelamento após 14 dias: taxa de 50% das mensalidades restantes.</p>
        <button class="mbtn blue full" style="margin-top:8px">Continuar</button>
        <div style="margin-top:14px;border-top:1px dashed #ccc;padding-top:10px;font-size:.85rem"><b>Para cancelar:</b>
          <p class="hs" data-i="2" style="display:inline-block;margin:6px 0">Conta → Planos → Gerenciar → Cancelar → Motivo → Oferta → Confirmar (7 telas)</p><br>
          <span class="hs" data-i="3" style="display:inline-block;background:#fff3c4;padding:4px 8px;border-radius:4px">💬 Chat: “A conversa foi encerrada. Tente novamente.”</span></div></div>`;
    }
  },
  {
    id: "epic", titulo: "Compras dentro de jogo", ref: "FTC × Epic Games (EUA), 2022",
    resumo: "A FTC afirmou que o design do Fortnite levava a cobranças sem intenção do jogador, com botões confusos e compra com um clique. A ordem final obriga a devolver US$ 245 milhões.",
    links: [["FTC: ordem final (2023)", "https://www.ftc.gov/news-events/news/press-releases/2023/03/ftc-finalizes-order-requiring-fortnite-maker-epic-games-pay-245-million-tricking-users-making"], ["FTC: anúncio do acordo (2022)", "https://www.ftc.gov/news-events/news/press-releases/2022/12/fortnite-video-game-maker-epic-games-pay-more-half-billion-dollars-over-ftc-allegations"], ["Página do caso", "https://www.ftc.gov/legal-library/browse/cases-proceedings/1923203-epic-games-matter"]],
    spots: [
      { nome: "Botão de compra no mesmo lugar do botão de pré-visualização", pat: "Interferência visual",
        br: { n: 1, norma: "CDC art. 6º, III e art. 39, III", txt: "Cobrança sem manifestação clara de vontade e informação inadequada." },
        ue: { n: 2, norma: "Diretiva 2011/83/UE art. 22 · Diretiva 2005/29/CE", txt: "Pagamentos adicionais exigem consentimento expresso; interfaces enganosas são práticas desleais." },
        us: { n: 2, norma: "FTC Act, seção 5 · acordo FTC × Epic", txt: "Fundamento direto do acordo: cobranças sem consentimento informado." } },
      { nome: "Preço em moeda virtual (V-Bucks)", pat: "Confusão de moeda",
        br: { n: 1, norma: "CDC art. 6º, III e art. 31", txt: "O preço deve ser informado de forma clara; moeda virtual que oculta o custo real dificulta a compreensão." },
        ue: { n: 1, norma: "Diretiva 2005/29/CE", txt: "Omissão de informação relevante sobre o custo pode ser ação enganosa." },
        us: { n: 1, norma: "FTC Act, seção 5", txt: "Preços ocultos por moeda intermediária são analisados como prática enganosa." } },
      { nome: "Cartão salvo para compras futuras", pat: "Pré-seleção",
        br: { n: 1, norma: "CDC art. 39, III e art. 49", txt: "Evitar cobranças não solicitadas e garantir arrependimento facilitado." },
        ue: { n: 2, norma: "Diretiva 2011/83/UE art. 22", txt: "Opções pré-marcadas para pagamentos adicionais são proibidas." },
        us: { n: 2, norma: "FTC Act, seção 5", txt: "Armazenar o cartão e cobrar sem consentimento expresso foi um dos pontos da ação." } },
      { nome: "Compra sem tela de confirmação", pat: "Inserção sorrateira",
        br: { n: 2, norma: "CDC art. 39, III", txt: "Fornecer serviço sem solicitação prévia é prática abusiva." },
        ue: { n: 1, norma: "Diretiva 2011/83/UE art. 8(2)", txt: "O botão de compra deve indicar claramente a obrigação de pagar." },
        us: { n: 2, norma: "FTC Act, seção 5 · EFTA/TILA", txt: "Cobrança sem autorização expressa foi o cerne do caso." } }
    ],
    build() {
      return `<div class="mock" style="background:linear-gradient(135deg,#1f2a56,#3a1e6b);color:#fff"><div class="bar" style="border-color:#ffffff33;color:#fff">Loja do Jogo <span style="color:#cfd3ff">Saldo: 0</span></div>
        <h3 style="color:#fff">Skin “Guerreiro Neon”</h3>
        <p class="hs" data-i="1" style="color:#ffd84d;font-size:1.3rem;font-weight:700;display:inline-block">💎 1.200 V-Bucks</p>
        <div style="display:flex;gap:8px;margin:12px 0"><button class="mbtn" style="background:#444;color:#fff;flex:1">Visualizar</button><button class="mbtn hs" data-i="0" style="background:#ffd84d;color:#000;flex:1">Comprar</button></div>
        <p class="hs" data-i="3" style="font-size:.78rem;color:#cfd3ff;display:inline-block">Toque uma vez para concluir. Sem confirmação adicional.</p><br>
        <p class="hs" data-i="2" style="font-size:.85rem;background:#ffffff1a;padding:8px;border-radius:6px;display:inline-block;margin-top:8px">💳 Cartão •••• 4242 salvo para compras futuras</p></div>`;
    }
  }
];
