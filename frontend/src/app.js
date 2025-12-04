import { CONFIG } from './config.js';
const API_BASE = CONFIG.API_BASE;

// --- POPUP MANAGEMENT ---
const popup = document.getElementById('popup');
const popupBody = document.getElementById('popup-body');
function openPopup(html) { popupBody.innerHTML = html; popup.classList.remove('hidden'); }
function closePopup() { popupBody.innerHTML = ''; popup.classList.add('hidden'); }
popup.addEventListener('click', e => {
  if (e.target === popup || e.target.classList.contains('close')) closePopup();
});

// --- HELPER: FLATTEN OBJECT FOR TABLE DISPLAY ---
function flattenObject(obj, prefix = '', res = {}) {
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (typeof v === 'object' && v !== null && !Array.isArray(v))
      flattenObject(v, key, res);
    else res[key] = Array.isArray(v) ? JSON.stringify(v) : v;
  }
  return res;
}

// --- GENERAL FETCH WRAPPER ---
async function fetchData(url, method = 'GET', body = null) {
  const opts = { method, headers: { 'Content-Type': 'application/json' } };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(url, opts);
  if (!res.ok) throw new Error(await res.text());
  if (method === 'DELETE') return {};
  return res.json();
}

// --- MAP combined endpoint → base CRUD endpoint ---
function getBaseEndpoint(endpoint) {
  if (endpoint.includes('academic-staff')) return 'academic-personel';
  if (endpoint.includes('administrative-staff')) return 'personel';
  if (endpoint.includes('system-admin')) return 'system-admin';
  if (endpoint.includes('person-overview')) return 'person';
  return endpoint;
}

// --- LOAD TABLE ---
async function loadTable(tableConfig, container) {
  const url = `${API_BASE}/${tableConfig.endpoint}/`;
  const data = await fetchData(url);
  renderTable(data, tableConfig, container);
}

// --- RENDER TABLE ---
function renderTable(data, tableConfig, container) {
  if (!data.length) { container.innerHTML = `<p>No data found.</p>`; return; }

  const headers = Object.keys(flattenObject(data[0]));
  headers.push('Actions');
  const table = document.createElement('table');
  table.innerHTML = `<thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody></tbody>`;
  const tbody = table.querySelector('tbody');

  data.forEach(item => {
    const flat = flattenObject(item);
    const actionBtns = `
      <button class="action-btn edit-btn" data-id='${JSON.stringify(item)}'>Edit</button>
      <button class="action-btn delete-btn" data-id='${JSON.stringify(item)}'>Delete</button>
    `;
    const tr = document.createElement('tr');
    tr.innerHTML = headers.map(h => h === 'Actions' ? `<td>${actionBtns}</td>` : `<td>${flat[h] ?? ''}</td>`).join('');
    tbody.appendChild(tr);
  });

  container.innerHTML = '';
  container.appendChild(table);

  tbody.querySelectorAll('.edit-btn').forEach(btn => {
    btn.onclick = () => openEditPopup(JSON.parse(btn.dataset.id), tableConfig);
  });
  tbody.querySelectorAll('.delete-btn').forEach(btn => {
    btn.onclick = () => deleteRecord(JSON.parse(btn.dataset.id), tableConfig);
  });
}

// --- FORM HELPERS ---
function objectToFormHTML(obj, selectFields = {}) {
  return Object.entries(obj).map(([k, v]) => {
    if (selectFields[k]) {
      // create dropdown for FK field
      return `<label>${k}</label>
        <select name="${k}">
          ${selectFields[k].map(opt => `<option value="${opt.value}" ${opt.value == v ? 'selected' : ''}>${opt.label}</option>`).join('')}
        </select>`;
    }
    return `<label>${k}</label><input name="${k}" value="${v ?? ''}">`;
  }).join('');
}

// --- FETCH OPTIONS FOR FK FIELDS ---
async function fetchFKOptions(field) {
  if (field === 'registr_no') {
    const people = await fetchData(`${API_BASE}/person-overview/`);
    return people.map(p => ({ value: p.registr_no, label: `${p.name} ${p.surname} (${p.registr_no})` }));
  }
  if (field === 'lang_comp_id') {
    const scores = await fetchData(`${API_BASE}/language-compensation-score/`);
    return scores.map(s => ({ value: s.lang_comp_id, label: s.letter_score }));
  }
  if (field === 'prom_id') {
    const promos = await fetchData(`${API_BASE}/promotion/`);
    return promos.map(p => ({ value: p.prom_id, label: `${p.description} (${p.prom_id})` }));
  }
  return [];
}

// --- EDIT POPUP ---
async function openEditPopup(item, tableConfig) {
  // detect FK fields for dropdowns
  const fkFields = {};
  if (['academic-staff/research-assistant','administrative-staff','system-admin'].includes(tableConfig.endpoint)) {
    fkFields['registr_no'] = await fetchFKOptions('registr_no');
  }
  if (tableConfig.endpoint === 'personel-get-lang-compens-score') fkFields['lang_comp_id'] = await fetchFKOptions('lang_comp_id');
  if (tableConfig.endpoint === 'management-staff-gets-prom') fkFields['prom_id'] = await fetchFKOptions('prom_id');

  const formHTML = `<h3>Edit Record</h3><form id="edit-form">
    ${objectToFormHTML(flattenObject(item), fkFields)}
    <button type="submit" class="save-btn">Save</button>
  </form>`;
  openPopup(formHTML);

  document.getElementById('edit-form').onsubmit = async e => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(e.target).entries());
    const base = getBaseEndpoint(tableConfig.endpoint);
    const baseUrl = API_BASE.replace('/combined', '');
    const pk = item.tc_no || item.registr_no || Object.values(item)[0];
    try {
      await fetchData(`${baseUrl}/${base}/${pk}/`, 'PUT', formData);
      closePopup();
      alert('Updated successfully!');
      loadTable(tableConfig, document.getElementById('tables-container'));
    } catch (err) { alert('Error updating: ' + err.message); }
  };
}

// --- ADD POPUP ---
async function openAddPopup(tableConfig) {
  const example = CONFIG.FormTemplates?.[tableConfig.endpoint] || {};
  const fkFields = {};

  // dependent FK fields
  if (['academic-staff/research-assistant','administrative-staff','system-admin'].includes(tableConfig.endpoint)) {
    fkFields['registr_no'] = await fetchFKOptions('registr_no');
  }
  if (tableConfig.endpoint === 'personel-get-lang-compens-score') fkFields['lang_comp_id'] = await fetchFKOptions('lang_comp_id');
  if (tableConfig.endpoint === 'management-staff-gets-prom') fkFields['prom_id'] = await fetchFKOptions('prom_id');

  const formHTML = `<h3>Add New Record</h3><form id="add-form">
    ${objectToFormHTML(example, fkFields)}
    <button type="submit" class="save-btn">Save</button>
  </form>`;
  openPopup(formHTML);

  document.getElementById('add-form').onsubmit = async e => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(e.target).entries());
    const base = getBaseEndpoint(tableConfig.endpoint);
    const baseUrl = API_BASE.replace('/combined', '');
    try {
      await fetchData(`${baseUrl}/${base}/`, 'POST', formData);
      alert('Created!');
      closePopup();
      loadTable(tableConfig, document.getElementById('tables-container'));
    } catch (err) { alert('Error: ' + err.message); }
  };
}

// --- DELETE RECORD ---
async function deleteRecord(item, tableConfig) {
  if (!confirm('Are you sure you want to delete this record?')) return;
  const pk = item.tc_no || item.registr_no || Object.values(item)[0];
  const base = getBaseEndpoint(tableConfig.endpoint);
  const baseUrl = API_BASE.replace('/combined', '');
  try { await fetchData(`${baseUrl}/${base}/${pk}/`, 'DELETE'); alert('Deleted!'); loadTable(tableConfig, document.getElementById('tables-container')); }
  catch (err) { alert('Error deleting: ' + err.message); }
}

// --- SEARCH PERSON ---
async function searchPerson() {
  const query = document.getElementById('search-input').value.trim();
  if (!query) return alert('Enter TC No or name.');
  const people = await fetchData(`${API_BASE}/person-overview/`);
  const found = people.find(p => p.tc_no === query || p.name.toLowerCase() === query.toLowerCase());
  if (!found) return alert('Person not found.');

  openPopup(`<h3>Person Info</h3><pre>${JSON.stringify(found, null, 2)}</pre>
    <button class="save-btn" id="delete-person">Delete Person</button>`);

  document.getElementById('delete-person').onclick = async () => {
    if (!confirm('Delete this person?')) return;
    await fetchData(`${API_BASE.replace('/combined','')}/person/${found.tc_no}/`, 'DELETE');
    alert('Person deleted!');
    closePopup();
  };
}

// --- TAB SETUP ---
document.addEventListener('DOMContentLoaded', async () => {
  const tabs = document.getElementById('tabs');
  const container = document.getElementById('tables-container');
  const addBtn = document.getElementById('add-btn');

  CONFIG.Tables.forEach((t, i) => {
    const btn = document.createElement('button');
    btn.textContent = t.name;
    btn.classList.add('tab-button');
    if (i === 0) btn.classList.add('active');
    btn.onclick = async () => {
      document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      addBtn.onclick = () => openAddPopup(t);
      await loadTable(t, container);
    };
    tabs.appendChild(btn);
  });

  addBtn.onclick = () => openAddPopup(CONFIG.Tables[0]);
  await loadTable(CONFIG.Tables[0], container);

  document.getElementById('search-btn').onclick = searchPerson;
});
