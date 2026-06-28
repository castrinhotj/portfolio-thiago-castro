/* ============================================================
   PORTFÓLIO ACADÊMICO — script.js
   JavaScript puro (sem jQuery ou qualquer biblioteca), organizado em:
   1. Ano atual no rodapé
   2. Alternância de tema claro/escuro
   3. Menu mobile (hambúrguer)
   4. Efeito de digitação no terminal da seção Hero
   5. Validação e simulação de envio do formulário de contato
============================================================ */

/* Espera o HTML estar completamente carregado antes de manipular a página */
document.addEventListener('DOMContentLoaded', function () {

  /* ---------- 1. ANO ATUAL NO RODAPÉ ---------- */
  // Pequeno toque de "site vivo": evita ter que atualizar o ano manualmente.
  var anoAtualEl = document.getElementById('ano-atual');
  if (anoAtualEl) {
    anoAtualEl.textContent = new Date().getFullYear();
  }

  /* ---------- 2. ALTERNÂNCIA DE TEMA CLARO/ESCURO ---------- */
  var htmlEl = document.documentElement;
  var themeToggleBtn = document.getElementById('theme-toggle');
  var themeIconEl = document.getElementById('theme-icon');

  // Tenta recuperar uma preferência de tema salva anteriormente.
  // Usamos try/catch porque localStorage pode não estar disponível
  // em alguns ambientes (ex.: navegação privada com restrições).
  function obterTemaSalvo() {
    try {
      return localStorage.getItem('tema-portfolio');
    } catch (erro) {
      return null;
    }
  }

  function salvarTema(tema) {
    try {
      localStorage.setItem('tema-portfolio', tema);
    } catch (erro) {
      // Se não for possível salvar, o tema simplesmente não persiste
      // entre visitas — não é um erro crítico para o funcionamento da página.
    }
  }

  // Atualiza o atributo data-theme do <html> e o ícone do botão (lua/sol)
  function aplicarTema(tema) {
    htmlEl.setAttribute('data-theme', tema);
    if (themeIconEl) {
      themeIconEl.textContent = tema === 'dark' ? '☀️' : '🌙';
    }
  }

  // Define o tema inicial: usa o salvo, ou então a preferência do sistema
  var temaSalvo = obterTemaSalvo();
  var prefereDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  aplicarTema(temaSalvo || (prefereDark ? 'dark' : 'light'));

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', function () {
      var temaAtual = htmlEl.getAttribute('data-theme');
      var novoTema = temaAtual === 'dark' ? 'light' : 'dark';
      aplicarTema(novoTema);
      salvarTema(novoTema);
    });
  }

  /* ---------- 3. MENU MOBILE (HAMBÚRGUER) ---------- */
  var menuToggleBtn = document.getElementById('menu-toggle');
  var navEl = document.getElementById('nav');

  if (menuToggleBtn && navEl) {
    menuToggleBtn.addEventListener('click', function () {
      var estaAberto = navEl.classList.toggle('is-open');
      menuToggleBtn.classList.toggle('is-active', estaAberto);
      menuToggleBtn.setAttribute('aria-expanded', estaAberto ? 'true' : 'false');
    });

    // Fecha o menu automaticamente ao clicar em algum link de navegação,
    // para que o usuário já veja a seção de destino sem o menu sobreposto.
    var linksNav = navEl.querySelectorAll('.nav__link');
    linksNav.forEach(function (link) {
      link.addEventListener('click', function () {
        navEl.classList.remove('is-open');
        menuToggleBtn.classList.remove('is-active');
        menuToggleBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- 4. EFEITO DE DIGITAÇÃO NO TERMINAL ---------- */
  var terminalBody = document.getElementById('terminal-body');

  // Cada item do array é uma "linha" do terminal. Linhas que começam com "$"
  // simulam um comando digitado pelo usuário no terminal.
  var linhasTerminal = [
    '$ whoami',
    'Thiago Jardim de Castro',
    '',
    '$ cat formacao.txt',
    'ADS — UNINTER (cursando)',
    '',
    '$ cat stack.txt',
    'HTML · CSS · JavaScript · Supabase',
    'Google Apps Script · Vercel · GitHub'
  ];

  var prefereMenosMovimento = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function digitarTerminal() {
    if (!terminalBody) return;

    // Se o usuário preferir menos animações, exibe o texto direto, sem efeito.
    if (prefereMenosMovimento) {
      terminalBody.textContent = linhasTerminal.join('\n');
      return;
    }

    var textoCompleto = linhasTerminal.join('\n');
    var indice = 0;
    var velocidadeMs = 28; // velocidade da digitação, em milissegundos por caractere

    function escreverProximoCaractere() {
      if (indice <= textoCompleto.length) {
        // O cursor piscante (criado em CSS) é recriado a cada atualização
        terminalBody.innerHTML = textoCompleto.slice(0, indice).replace(/\n/g, '<br>') +
          '<span class="terminal__cursor"></span>';
        indice++;
        setTimeout(escreverProximoCaractere, velocidadeMs);
      }
    }

    escreverProximoCaractere();
  }

  digitarTerminal();

  /* ---------- 5. VALIDAÇÃO E ENVIO DO FORMULÁRIO DE CONTATO ---------- */
  var formContato = document.getElementById('contact-form');

  if (formContato) {
    var campoNome = document.getElementById('nome');
    var campoEmail = document.getElementById('email');
    var campoMensagem = document.getElementById('mensagem');

    var erroNomeEl = document.getElementById('erro-nome');
    var erroEmailEl = document.getElementById('erro-email');
    var erroMensagemEl = document.getElementById('erro-mensagem');

    // Expressão regular simples para validar e-mails: exige um "@"
    // e um "." após ele (formato básico, ex.: nome@dominio.com).
    var regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Mostra (ou limpa) a mensagem de erro de um campo específico
    function definirErro(campoInput, elementoErro, mensagem) {
      if (mensagem) {
        campoInput.classList.add('is-invalid');
        elementoErro.textContent = mensagem;
      } else {
        campoInput.classList.remove('is-invalid');
        elementoErro.textContent = '';
      }
    }

    // Função principal de validação. Retorna true se tudo estiver correto.
    function validarFormulario() {
      var valido = true;

      var valorNome = campoNome.value.trim();
      var valorEmail = campoEmail.value.trim();
      var valorMensagem = campoMensagem.value.trim();

      // Validação do nome: não pode estar vazio
      if (valorNome === '') {
        definirErro(campoNome, erroNomeEl, 'Por favor, informe seu nome.');
        valido = false;
      } else {
        definirErro(campoNome, erroNomeEl, '');
      }

      // Validação do e-mail: não pode estar vazio E precisa ter formato válido
      if (valorEmail === '') {
        definirErro(campoEmail, erroEmailEl, 'Por favor, informe seu e-mail.');
        valido = false;
      } else if (!regexEmail.test(valorEmail)) {
        definirErro(campoEmail, erroEmailEl, 'Informe um e-mail válido (ex.: nome@dominio.com).');
        valido = false;
      } else {
        definirErro(campoEmail, erroEmailEl, '');
      }

      // Validação da mensagem: não pode estar vazia
      if (valorMensagem === '') {
        definirErro(campoMensagem, erroMensagemEl, 'Por favor, escreva uma mensagem.');
        valido = false;
      } else {
        definirErro(campoMensagem, erroMensagemEl, '');
      }

      return valido;
    }

    formContato.addEventListener('submit', function (evento) {
      evento.preventDefault(); // impede o envio real/recarregamento da página

      if (validarFormulario()) {
        // Simulação de envio: em um cenário real, aqui seria feita uma
        // chamada a um servidor (fetch/AJAX) para processar o formulário.
        alert('Mensagem enviada com sucesso!');
        formContato.reset();
      }
    });
  }

});
