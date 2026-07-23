// ---------- DATA ----------
const CARDS = [
  {
    id: 1, num: '0000001', color: 'var(--c1)',
    cells: [
      { type:'task', text:'Consultar el pronóstico del tiempo de una página o una aplicación' },
      { type:'free' },
      { type:'task', text:'Convertir voz a texto para mandar un mensaje' },
      { type:'task', text:'Ver el autocompletado de una búsqueda en Google' },
      { type:'wild', text:'Completar con algo que conozcas y no esté en este cartón :)', label:'Nombre de la tecnología' },
      { type:'free' },
      { type:'free' },
      { type:'task', text:'Usar una app para reconocer una canción' },
      { type:'task', text:'Usar la autocorrección de texto en WhatsApp' },
    ]
  },
  {
    id: 2, num: '0000002', color: 'var(--c2)',
    cells: [
      { type:'free' },
      { type:'task', text:'Ver el autocompletado de una búsqueda en Google' },
      { type:'task', text:'Jugar un videojuego en el que controlás los personajes con el cuerpo' },
      { type:'task', text:'Usar un buscador online como Google o Bing' },
      { type:'wild', text:'Completar con algo que no conozcas y no esté en este cartón :)', label:'Nombre de la tecnología' },
      { type:'free' },
      { type:'task', text:'Usar un filtro de Snapchat o Instagram' },
      { type:'free' },
      { type:'task', text:'Que una computadora les evalúe una tarea' },
    ]
  },
  {
    id: 3, num: '0000003', color: 'var(--c3)',
    cells: [
      { type:'task', text:'Ver un producto promocionado en Google o un aviso que dice "ya que usted compró... puede estar interesado en..."' },
      { type:'free' },
      { type:'task', text:'Obtener un emoji sugerido en lugar de una palabra' },
      { type:'free' },
      { type:'wild', text:'Completar con algo que no conozcas y no esté en este cartón :)', label:'Nombre de la tecnología' },
      { type:'task', text:'Usar un buscador online como Google o Bing' },
      { type:'task', text:'Comunicarse con algún servicio por un chatbot' },
      { type:'task', text:'Usar la autocorrección de texto en WhatsApp' },
      { type:'free' },
    ]
  },
  {
    id: 4, num: '0000004', color: 'var(--c4)',
    cells: [
      { type:'task', text:'Usar la huella digital o el rostro para desbloquear el celular' },
      { type:'task', text:'Usar la autocorrección de texto en WhatsApp' },
      { type:'free' },
      { type:'free' },
      { type:'wild', text:'Completar con algo que conozcas y no esté en este cartón :)', label:'Nombre de la tecnología' },
      { type:'task', text:'Ver una publicidad sugerida en TikTok o Instagram' },
      { type:'task', text:'Obtener un emoji sugerido en lugar de una palabra' },
      { type:'free' },
      { type:'task', text:'Escuchar una canción recomendada en Spotify' },
    ]
  },
];

// in-memory answers per card, keyed by cardId -> array of 9 strings
const state = {};
CARDS.forEach(c => { state[c.id] = new Array(9).fill(''); });

const LINES = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

// ---------- SELECTOR RENDER ----------
const ticketsEl = document.getElementById('tickets');
CARDS.forEach(card => {
  const btn = document.createElement('button');
  btn.className = 'ticket';
  btn.style.setProperty('--tc', card.color);
  btn.setAttribute('aria-label', 'Elegir cartón ' + card.id);

  const mini = card.cells.map(c => c.type === 'free' ? '<i class="on"></i>' : '<i></i>').join('');

  btn.innerHTML = `
    <div class="num">Cartón N°</div>
    <div class="digit">0${card.id}</div>
    <div class="mini-grid">${mini}</div>
    <div class="cta">jugar este cartón</div>
  `;
  btn.addEventListener('click', () => openCard(card.id));
  ticketsEl.appendChild(btn);
});

// ---------- CARD VIEW ----------
const selectorSec = document.getElementById('selector');
const cardviewSec = document.getElementById('cardview');
const boardEl = document.getElementById('board');
const gridEl = document.getElementById('grid');
const cardNumEl = document.getElementById('cardNum');
const progressLabel = document.getElementById('progressLabel');
const bingoBanner = document.getElementById('bingoBanner');

let currentCardId = null;

function openCard(id){
  currentCardId = id;
  const card = CARDS.find(c => c.id === id);
  boardEl.style.setProperty('--card-c', card.color);
  cardNumEl.textContent = 'Cartón N° ' + card.num;
  cardNumEl.style.color = card.color;
  renderGrid(card);
  selectorSec.style.display = 'none';
  cardviewSec.style.display = 'block';
  window.scrollTo({top:0, behavior:'smooth'});
}

function renderGrid(card){
  gridEl.innerHTML = '';
  bingoBanner.classList.remove('show');
  card.cells.forEach((cell, i) => {
    const div = document.createElement('div');
    div.className = 'cell ' + cell.type;
    div.dataset.index = i;

    if (cell.type === 'free'){
      div.innerHTML = `<span class="free-mark">LIBRE</span>`;
    } else {
      const label = cell.type === 'wild' ? cell.label : 'Nombre';
      const val = state[card.id][i] || '';
      div.innerHTML = `
        <div class="task-text">${cell.text}</div>
        <div>
          <input type="text" placeholder="" value="${escapeHtml(val)}" data-i="${i}">
          <div class="caption">${label}</div>
        </div>
      `;
      if (val.trim() !== '') div.classList.add('filled');
    }
    gridEl.appendChild(div);
  });

  gridEl.querySelectorAll('input').forEach(inp => {
    inp.addEventListener('input', onInput);
  });

  updateProgress();
  checkLines();
}

function onInput(e){
  const i = parseInt(e.target.dataset.i, 10);
  state[currentCardId][i] = e.target.value;
  const cellEl = e.target.closest('.cell');
  cellEl.classList.toggle('filled', e.target.value.trim() !== '');
  updateProgress();
  checkLines();
}

function isMarked(card, i){
  const cell = card.cells[i];
  if (cell.type === 'free') return true;
  return (state[card.id][i] || '').trim() !== '';
}

function updateProgress(){
  const card = CARDS.find(c => c.id === currentCardId);
  const count = card.cells.reduce((acc, _, i) => acc + (isMarked(card, i) ? 1 : 0), 0);
  progressLabel.textContent = count + ' / 9 completados';
}

function checkLines(){
  const card = CARDS.find(c => c.id === currentCardId);
  const cellsEls = gridEl.querySelectorAll('.cell');
  cellsEls.forEach(el => el.classList.remove('line-hit'));

  let hit = false;
  LINES.forEach(line => {
    if (line.every(i => isMarked(card, i))){
      hit = true;
      line.forEach(i => cellsEls[i].classList.add('line-hit'));
    }
  });
  bingoBanner.classList.toggle('show', hit);
}

function escapeHtml(str){
  return str.replace(/[&<>"']/g, s => ({
    '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
  }[s]));
}

document.getElementById('backBtn').addEventListener('click', () => {
  window.location.href = 'index.html';
});

document.getElementById('resetBtn').addEventListener('click', () => {
  state[currentCardId] = new Array(9).fill('');
  const card = CARDS.find(c => c.id === currentCardId);
  renderGrid(card);
});
