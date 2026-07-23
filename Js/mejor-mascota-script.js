const procField = document.getElementById('procField');
const footNombre = document.getElementById('footNombre');
const testTable = document.getElementById('testTable');
const addRowBtn = document.getElementById('addRowBtn');

// Nombre field: keep prefix "Nombre: " always
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

// Test table
function addRow(){
  const row = document.createElement('div');
  row.className = 'test-row';
  row.innerHTML = `
    <input type="text" placeholder="Ej: perro, gato...">
    <select>
      <option value="">--</option>
      <option value="si">Sí</option>
      <option value="no">No</option>
    </select>
    <button class="del-row-btn" title="Eliminar">×</button>
  `;
  row.querySelector('.del-row-btn').addEventListener('click', () => row.remove());
  testTable.appendChild(row);
}

addRowBtn.addEventListener('click', addRow);
addRow();

document.getElementById('resetBtn').addEventListener('click', () => {
  procField.innerHTML = '';
});

document.getElementById('downloadBtn').addEventListener('click', () => {
  const target = document.getElementById('exportArea');
  const btn = document.getElementById('downloadBtn');
  btn.textContent = 'Generando...';
  htmlToImage.toPng(target, { backgroundColor:null, pixelRatio:2 }).then(dataUrl => {
    const link = document.createElement('a');
    link.download = 'la-mejor-mascota.png';
    link.href = dataUrl;
    link.click();
    btn.textContent = '⭳ Descargar como imagen';
  }).catch(() => {
    btn.textContent = '⭳ Descargar como imagen';
    alert('Hubo un problema al generar la imagen. Probá de nuevo.');
  });
});
