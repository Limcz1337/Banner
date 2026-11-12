// Banner de consentimento LGPD — Clínica Vida
const DURACAO_COOKIE = 60 * 60 * 24 * 365;

function definirCookie(nome, valor) {
  document.cookie = `${nome}=${encodeURIComponent(valor)}; max-age=${DURACAO_COOKIE}; path=/; SameSite=Lax`;
}

function getCookie(nome) {
  const prefixo = `${nome}=`;
  const item = document.cookie.split('; ').find(cookie => cookie.startsWith(prefixo));
  return item ? decodeURIComponent(item.substring(prefixo.length)) : null;
}

function abrirBanner() {
  document.getElementById('banner').hidden = false;
  document.getElementById('sobreposicao').hidden = false;
  document.getElementById('chk-analise').checked = getCookie('cat_analise') === 'sim';
  document.getElementById('chk-marketing').checked = getCookie('cat_marketing') === 'sim';
}

function fecharBanner() {
  document.getElementById('banner').hidden = true;
  document.getElementById('sobreposicao').hidden = true;
}

function gravarPreferencias(analise, marketing, tipo) {
  definirCookie('consentimento_lgpd', tipo);
  definirCookie('cat_essenciais', 'sim');
  definirCookie('cat_analise', analise ? 'sim' : 'nao');
  definirCookie('cat_marketing', marketing ? 'sim' : 'nao');
  fecharBanner();
  atualizarPainel();
}

function aceitarTodos() {
  gravarPreferencias(true, true, 'todos');
}

function aceitarApenasEssenciais() {
  gravarPreferencias(false, false, 'essenciais');
}

function salvarSelecao() {
  const analise = document.getElementById('chk-analise').checked;
  const marketing = document.getElementById('chk-marketing').checked;
  gravarPreferencias(analise, marketing, 'personalizado');
}

function reabrirPreferencias() {
  abrirBanner();
}

function atualizarPainel() {
  const painel = document.getElementById('painel-status');
  const consentimento = getCookie('consentimento_lgpd');

  if (!consentimento) {
    painel.innerHTML = `
      <div class="status-cabecalho"><span class="status-ponto"></span><h2>Status do consentimento</h2></div>
      <p class="status-ajuda">Aguardando sua escolha de privacidade.</p>`;
    return;
  }

  const analise = getCookie('cat_analise') === 'sim';
  const marketing = getCookie('cat_marketing') === 'sim';
  const estado = ativo => ativo
    ? '<span class="ativo">Ativo</span>'
    : '<span class="bloqueado-texto">Bloqueado</span>';

  painel.innerHTML = `
    <div class="status-cabecalho"><span class="status-ponto" style="background:#24977d"></span><h2>Status do consentimento</h2></div>
    <p class="status-ajuda">Preferências salvas neste navegador.</p>
    <div class="status-lista">
      <div class="status-item"><strong>Essenciais</strong>${estado(true)}</div>
      <div class="status-item"><strong>Análise</strong>${estado(analise)}</div>
      <div class="status-item"><strong>Marketing</strong>${estado(marketing)}</div>
    </div>`;
}

window.addEventListener('DOMContentLoaded', () => {
  if (getCookie('consentimento_lgpd')) {
    fecharBanner();
    atualizarPainel();
  } else {
    atualizarPainel();
    abrirBanner();
  }
});
