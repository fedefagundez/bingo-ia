const PRESETS = {
  "Texto predictivo de WhatsApp": {
    input: 'Ingreso primeras letras de palabra: <em>situa</em>',
    proc: 'Algoritmo de aprendizaje <em>(información disponible en diccionarios, textos que escribí, textos de otras personas)</em>',
    output: 'Predicción de la palabra: <em>situado, situación, situarse</em>'
  },
  "Feed de TikTok": {
    input: 'Videos que miré completos, que salteé, que me gustaron o comenté',
    proc: 'Algoritmo de recomendación <em>(compara mi comportamiento con el de usuarios parecidos)</em>',
    output: 'Lista de videos nueva pensada para que siga mirando'
  },
  "Buscador de Google": {
    input: 'Palabras que escribo: <em>"receta torta choc"</em>',
    proc: 'Algoritmo de búsqueda <em>(rastrea millones de páginas y las ordena por relevancia)</em>',
    output: 'Lista de resultados ordenados: <em>recetas, videos, imágenes</em>'
  },
  "Sugerencias de Spotify": {
    input: 'Canciones que escuché, que salteé, listas que armé',
    proc: 'Algoritmo de recomendación <em>(compara mis gustos con los de otros usuarios similares)</em>',
    output: 'Playlist armada para mí: <em>Descubrimiento semanal</em>'
  },
  "Convertir voz a texto": {
    input: 'Audio de mi voz diciendo un mensaje',
    proc: 'Algoritmo de reconocimiento de voz <em>(entrenado con miles de horas de audio y texto)</em>',
    output: 'Mensaje escrito listo para enviar'
  },
  "Filtros de Instagram/Snapchat": {
    input: 'Imagen de mi cara captada por la cámara',
    proc: 'Algoritmo de reconocimiento facial <em>(detecta ojos, boca y contornos en tiempo real)</em>',
    output: 'Imagen con el filtro aplicado sobre mi cara'
  }
};

const chipsEl = document.getElementById('chips');
const titleField = document.getElementById('titleField');
const inputField = document.getElementById('inputField');
const procField = document.getElementById('procField');
const outputField = document.getElementById('outputField');
const customTopic = document.getElementById('customTopic');

let activeChip = null;

Object.keys(PRESETS).forEach(topic => {
  const chip = document.createElement('button');
  chip.className = 'chip';
  chip.type = 'button';
  chip.textContent = topic;
  chip.addEventListener('click', () => applyPreset(topic, chip));
  chipsEl.appendChild(chip);
});

function applyPreset(topic, chipEl){
  document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
  if (chipEl) chipEl.classList.add('active');
  activeChip = topic;
  customTopic.value = '';
  titleField.textContent = topic;
}

customTopic.addEventListener('input', () => {
  document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
  activeChip = null;
  if (customTopic.value.trim() !== ''){
    titleField.textContent = customTopic.value;
  }
});

// start with no preset active
activeChip = null;

// Nombre field: keep prefix "Nombre: " always
const footNombre = document.getElementById('footNombre');
footNombre.addEventListener('focus', () => {
  const text = footNombre.textContent;
  if (text === 'Nombre: _________') {
    const range = document.createRange();
    range.setStart(footNombre.childNodes[0], 9);
    range.setEnd(footNombre.childNodes[0], text.length);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }
});
footNombre.addEventListener('blur', () => {
  const text = footNombre.textContent;
  if (!text.startsWith('Nombre:') || text.replace('Nombre:', '').trim() === '') {
    footNombre.textContent = 'Nombre: _________';
  }
});

document.getElementById('resetBtn').addEventListener('click', () => {
  customTopic.value = '';
  titleField.textContent = '';
  inputField.innerHTML = '';
  procField.innerHTML = '';
  outputField.innerHTML = '';
  document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
  activeChip = null;
});

document.getElementById('downloadBtn').addEventListener('click', () => {
  const target = document.getElementById('exportArea');
  const btn = document.getElementById('downloadBtn');
  btn.textContent = 'Generando...';
  htmlToImage.toPng(target, { backgroundColor:null, pixelRatio:2 }).then(dataUrl => {
    const link = document.createElement('a');
    const name = (titleField.textContent || 'caso-estudio').trim().toLowerCase()
      .replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
    link.download = (name || 'caso-estudio') + '.png';
    link.href = dataUrl;
    link.click();
    btn.textContent = '⭳ Descargar como imagen';
  }).catch(() => {
    btn.textContent = '⭳ Descargar como imagen';
    alert('Hubo un problema al generar la imagen. Probá de nuevo.');
  });
});
