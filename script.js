/* ===== данные книги ===== */
const PHOTOS_DIR = 'photos/';

/* ===== Google Drive: ключи хранилища (нужны с самого начала) ===== */
const TOKEN_KEY = 'gd_token';      // localStorage
const CAPTIONS_KEY = 'gd_captions';// подписи для фото с Drive
const HIDDEN_KEY = 'gd_hidden';    // скрытые из альбома фото
let accessToken = localStorage.getItem(TOKEN_KEY) || null;

/* порядок фоток — пусто: все фото берутся из Google Drive */
const ORDER = [];

/* уникальные подписи для каждой фотки (по номеру) */
const CAPTIONS = {
  1:  'Здесь начинается наша история…',
  2:  'И с тех пор всё только лучше',
  3:  'Твой взгляд, который я ищу в толпе',
  4:  'Твоя улыбка — моё солнце',
  5:  'Рядом с тобой даже время замедляется',
  6:  'Момент, который хочу помнить всегда',
  7:  'Мы и весь мир вокруг',
  8:  'Твой смех — мой любимый звук',
  9:  'Ещё один день с тобой',
  10: 'Смотреть на тебя — моё любимое занятие',
  11: 'Просто мы. Счастливые',
  12: 'И нам не нужно больше ничего',
  13: 'Одно из тысячи наших воспоминаний',
  14: 'Ты делаешь обычный день особенным',
  15: 'Как же мне повезло с тобой',
  16: 'Наши приключения только начинаются',
  17: 'С тобой не страшно ничего',
  18: 'Люблю вот такие наши вечера',
  19: 'Каждая фотка с тобой — любимая',
  20: 'Ты моя самая красивая',
  21: 'Обнимаю тебя взглядом',
  22: 'Наша команда навсегда',
  23: 'Собираю моменты с тобой один за другим',
  24: 'Эти глаза напротив',
  25: 'С тобой любое место становится лучше',
  26: 'Ты — моё самое тёплое воспоминание',
  27: 'Наша маленькая традиция',
  28: 'Спасибо, что ты рядом',
  29: 'Хочу ещё миллион таких дней',
  30: 'Ты моя весна',
  31: 'Ты моё лето',
  32: 'Ты моё «навсегда»',
  33: 'Финал этой книги — но не нашей истории'
};

/* наклейки-котята и доп. фото — только для локальных фото, сейчас не используются */
const CAT_PAGES = [];
const EXTRA_PAGE = -1;
const BOUQUET_PAGE = -1;

const pages = [];
pages.push({ type: 'cover' });
pages.push({ type: 'blank' });       /* placeholder: сюда встанут Drive-фото */
ORDER.forEach((num, idx) => {
  const pageNum = idx + 1;
  const p = {
    type: 'photo',
    src: PHOTOS_DIR + 'photo' + num + '.jpg',
    num: pageNum,
    photoNum: num,
    caption: CAPTIONS[num] || ''
  };
  if (pageNum === EXTRA_PAGE) p.extra = PHOTOS_DIR + 'с цветочком.png';
  if (pageNum === BOUQUET_PAGE) p.sticker = PHOTOS_DIR + 'catbouquet.png';
  else if (CAT_PAGES.includes(pageNum)) p.sticker = PHOTOS_DIR + 'cat' + (CAT_PAGES.indexOf(pageNum) + 1) + '.png';
  pages.push(p);
});
pages.push({ type: 'final' });
pages.push({ type: 'backcover' });    // задняя обложка — back-сторона последнего листа

/* ===== построение DOM ===== */
const book = document.getElementById('book');
const scene = document.querySelector('.scene');

const base = document.createElement('div');
base.className = 'book-base';
book.appendChild(base);

let leafCount = Math.ceil(pages.length / 2);
const leaves = [];

for (let k = 0; k < leafCount; k++) {
  const frontData = pages[2 * k]     || { type: 'blank' };
  const backData  = pages[2 * k + 1] || { type: 'blank' };

  const leaf = document.createElement('div');
  leaf.className = 'leaf' + (k === 0 ? ' cover' : '');
  leaf.appendChild(renderPage(frontData, 'front'));
  leaf.appendChild(renderPage(backData, 'back'));
  book.appendChild(leaf);
  leaves.push(leaf);
}

/* ===== добавление фото с Google Drive в конец книги =====
   Вызывается после входа: новые фото встают перед страницей «Это мы».
*/


function el(tag, cls, html) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html != null) e.innerHTML = html;
  return e;
}

function renderPage(data, side) {
  const page = el('div', 'page ' + side);

  switch (data.type) {
    case 'cover': {
      const face = el('div', 'cover-face');
      face.appendChild(el('div', 'cover-frame'));
      const title = el('div', 'cover-title-wrap');
      title.appendChild(el('h1', 'cover-title', 'Наша история'));
      title.appendChild(el('div', 'cover-heart', '♥'));
      face.appendChild(title);
      page.appendChild(face);
      break;
    }
    case 'photo': {
      const c = el('div', 'page-content');
      const img = el('img', 'photo');
      img.src = data.src;
      img.alt = 'фото ' + data.photoNum;
      c.appendChild(img);
      if (data.extra) {
        const ex = el('img', 'photo small');
        ex.src = data.extra;
        ex.alt = 'с цветочком';
        c.appendChild(ex);
      }
      c.appendChild(el('div', 'caption', data.caption));
      page.appendChild(c);
      if (data.sticker) {
        const st = el('img', 'sticker cat' + (data.num % 2 ? '' : ' alt'));
        st.src = data.sticker;
        st.alt = 'котёнок';
        page.appendChild(st);
      }
      page.appendChild(el('div', 'page-num', '— ' + data.num + ' —'));
      break;
    }
    case 'final': {
      const c = el('div', 'page-content final');
      const pair = el('img', 'pair');
      pair.src = PHOTOS_DIR + 'человечки.png';
      pair.alt = 'это мы';
      c.appendChild(pair);
      const fl = el('img', 'flower2');
      fl.src = PHOTOS_DIR + 'цветок 2.png';
      fl.alt = 'цветок';
      c.appendChild(fl);
      c.appendChild(el('h2', null, 'Это мы ♥'));
      c.appendChild(el('p', null, 'И это только начало.<br>Спасибо, что ты есть.'));
      page.appendChild(c);
      page.addEventListener('click', burstHearts);
      break;
    }
    case 'backcover': {
      const c = el('div', 'back-cover');
      const bg = el('img', 'bg');
      bg.src = PHOTOS_DIR + 'photo 33.png';
      bg.alt = 'наше фото';
      c.appendChild(bg);
      c.appendChild(el('p', null, 'С любовью,<br>твой Федя ♥'));
      page.appendChild(c);
      break;
    }
    default: {
      page.classList.add('inside');
    }
  }
  return page;
}

/* ===== предзагрузка фото ===== */
pages.forEach(p => {
  [p.src, p.extra, p.sticker].filter(Boolean).forEach(src => {
    const im = new Image();
    im.src = src;
  });
});

/* ===== логика перелистывания (механика реальной книги) ===== */
let current = 0;          // сколько листов уже перевёрнуто
let closeTimer = null;     // таймер отложенного закрытия (анти-гонка)
const DURATION = 1000;    // должно совпадать с transition в CSS
let busy = false;         // защита от двойных нажатий во время анимации

/* =========================================================
   МОБИЛЬНЫЙ ДВИЖОК: карточная книга (по одной странице)
   Каждая pages[i] — отдельная карта. Показ ровно одной.
   Переворот: карта поворачивается вокруг центра (flip).
   ========================================================= */
const mobileBook = {
  active: false,
  cardEls: [],      // DOM-карты (по одной на страницу)
  idx: 0,           // какая страница сейчас показана
};

function mobileInit() {
  if (!isMobile()) return false;
  mobileBook.active = true;
  /* строим карты: обычные .m-card внутри book */
  book.querySelectorAll('.m-card').forEach(e => e.remove());
  mobileBook.cardEls = pages.map((pData, i) => {
    const card = document.createElement('div');
    card.className = 'm-card';
    card.style.zIndex = 1;
    /* содержимое = рендер страницы как front */
    const face = renderPage(pData, 'front');
    face.classList.add('m-face');
    card.appendChild(face);
    book.appendChild(card);
    return card;
  });
  mobileBook.idx = 0;
  mobileShow();
  return true;
}

/* показать карту idx, остальные — под/скрыты */
function mobileShow() {
  mobileBook.cardEls.forEach((card, i) => {
    if (i === mobileBook.idx) {
      card.style.zIndex = 30;
      card.style.visibility = 'visible';
      card.classList.remove('turned');
    } else if (i === mobileBook.idx + 1) {
      /* следующая — под текущей, чуть меньше; вырастет при показе */
      card.style.zIndex = 20;
      card.style.visibility = 'visible';
      card.classList.add('m-under');
      requestAnimationFrame(() => card.classList.add('risen'));
    } else {
      card.style.zIndex = Math.max(1, 10 - Math.abs(i - mobileBook.idx));
      card.style.visibility = i < mobileBook.idx - 2 || i > mobileBook.idx + 3 ? 'hidden' : 'visible';
      card.classList.remove('m-under', 'risen');
    }
  });
  updateMobileUI();
}

/* переворот вперёд: карта idx поворачивается, открывая idx+1 */
let mobileBusy = false;   /* защита от быстрого листания */

function mobileNext() {
  if (mobileBusy) return;
  if (mobileBook.idx >= pages.length - 1) return;
  mobileBusy = true;
  const card = mobileBook.cardEls[mobileBook.idx];
  card.style.zIndex = 40;
  card.classList.add('turned');
  mobileBook.idx++;
  mobileShow();
  /* карта доворачивается 0.8с и только потом уходит вниз —
     всё это время её содержимое видно (плавность) */
  setTimeout(() => {
    card.style.zIndex = 1;
    card.style.visibility = 'hidden';
    mobileBusy = false;
  }, 850);
}

function mobilePrev() {
  if (mobileBusy) return;
  mobileBusy = true;
  setTimeout(() => { mobileBusy = false; }, 850);
  if (mobileBook.idx <= 0) return;
  mobileBook.idx--;
  const card = mobileBook.cardEls[mobileBook.idx];
  card.style.visibility = 'visible';
  card.style.zIndex = 40;
  /* возвращаем переворот */
  card.classList.remove('turned');
  mobileShow();
  setTimeout(() => { card.style.zIndex = 30; }, 850);
}

function updateMobileUI() {
  const progress = document.getElementById('progress');
  const last = pages.length - 1;
  if (mobileBook.idx === 0) progress.textContent = 'обложка';
  else if (mobileBook.idx === last) progress.textContent = 'конец';
  else progress.textContent = 'стр. ' + mobileBook.idx + ' из ' + (last - 1);
  document.getElementById('prevBtn').disabled = mobileBook.idx === 0;
  document.getElementById('nextBtn').disabled = mobileBook.idx >= last;
}
// порядок наложения: ПК — разворотная модель; телефон — карточная
const isMobile = () => window.matchMedia('(max-width:600px)').matches;

function restack() {
  leaves.forEach((leaf, i) => {
    if (isMobile()) {
      /* карточная модель: верх — только что перевёрнутый лист (его back = текущая страница) */
      if (i === current - 1) leaf.style.zIndex = 200;
      else if (i === current) leaf.style.zIndex = 150;
      else if (i < current) leaf.style.zIndex = i + 1;
      else leaf.style.zIndex = Math.max(1, leaves.length - i - 10);
    } else {
      leaf.style.zIndex = i < current ? i + 1 : leaves.length - i;
    }
  });
}
restack();

function flipNext() {
  if (mobileBook.active) { mobileNext(); return; }
  if (busy || current >= leafCount) return;
  busy = true;
  /* открытие отменяет отложенное закрытие (анти-гонка таймеров) */
  if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }
  const leaf = leaves[current];
  leaf.style.zIndex = 100;                     // лист на время поворота поверх всех
  leaf.classList.add('flipped');
  current++;
  book.classList.toggle('open', current > 0);  // сдвиг книги при открытии
  book.classList.remove('closed');
  scene.classList.remove('closed');
  setTimeout(() => {
    restack();
    busy = false;
    /* последний лист перевёрнут — книга закрывается задней обложкой */
    if (current === leafCount) setEnd(true);
  }, DURATION);
  updateUI();
}

function flipPrev() {
  if (mobileBook.active) { mobilePrev(); return; }
  if (busy || current <= 0) return;
  busy = true;
  setEnd(false);                // уходим с задней обложки — книга раскрывается
  current--;
  const leaf = leaves[current];
  leaf.style.zIndex = 100;
  leaf.classList.remove('flipped');
  book.classList.toggle('open', current > 0);
  /* закрытие: обложка переворачивается назад — страница 2 видна, пока обложка не легла.
     класс closed ставим ПОСЛЕ анимации возврата обложки */
  if (current === 0) {
    /* таймер закрытия: отменяется, если книгу открыли снова (анти-гонка) */
    if (closeTimer) clearTimeout(closeTimer);
    closeTimer = setTimeout(() => {
      closeTimer = null;
      if (current === 0) { book.classList.add('closed'); scene.classList.add('closed'); }
    }, DURATION + 400);
  }
  setTimeout(() => {
    restack();
    busy = false;
  }, DURATION);
  updateUI();
}

function setEnd(end) {
  scene.classList.toggle('end', end);
}

function updateUI() {
  const progress = document.getElementById('progress');
  if (current === 0) progress.textContent = 'обложка';
  else if (current === leafCount) progress.textContent = 'конец';
  else {
    const right = Math.min(2 * current, pages.length - 1);
    const left = Math.max(right - 1, 1);
    progress.textContent = 'стр. ' + left + '–' + right + ' из ' + (pages.length - 1);
  }
  document.getElementById('prevBtn').disabled = current === 0;
  document.getElementById('nextBtn').disabled = current === leafCount;
}

/* ===== управление ===== */
document.getElementById('nextBtn').addEventListener('click', flipNext);
document.getElementById('prevBtn').addEventListener('click', flipPrev);

document.addEventListener('keydown', e => {
  /* не мешаем печати в полях ввода */
  const tag = (e.target.tagName || '').toLowerCase();
  if (tag === 'input' || tag === 'textarea' || e.target.isContentEditable) return;
  if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') { e.preventDefault(); flipNext(); }
  if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); flipPrev(); }
});

/* клик по книге: правая половина — вперёд, левая — назад */
book.addEventListener('click', e => {
  const rect = book.getBoundingClientRect();
  (e.clientX > rect.left + rect.width / 2) ? flipNext() : flipPrev();
});

/* свайпы */
let touchX = null;
document.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
document.addEventListener('touchend', e => {
  if (touchX == null) return;
  const dx = e.changedTouches[0].clientX - touchX;
  if (dx < -40) flipNext();
  if (dx > 40) flipPrev();
  touchX = null;
}, { passive: true });



/* ===== сердечки на финальной странице ===== */
function burstHearts(e) {
  for (let i = 0; i < 10; i++) {
    const h = el('div', 'heart', '♥');
    h.style.left = e.clientX + 'px';
    h.style.top = e.clientY + 'px';
    h.style.fontSize = (16 + Math.random() * 20) + 'px';
    h.style.setProperty('--dx', (Math.random() * 160 - 80) + 'px');
    h.style.color = ['#d97b8c', '#e595a5', '#b45a6e', '#f0a8b5'][i % 4];
    document.body.appendChild(h);
    setTimeout(() => h.remove(), 1700);
  }
}

/* ===== лепестки на фоне ===== */
const sky = document.getElementById('sky');
for (let i = 0; i < 16; i++) {
  const p = el('div', 'petal');
  p.style.left = Math.random() * 100 + 'vw';
  p.style.width = p.style.height = (10 + Math.random() * 12) + 'px';
  p.style.animationDuration = (7 + Math.random() * 8) + 's, ' + (2 + Math.random() * 2) + 's';
  p.style.animationDelay = -Math.random() * 12 + 's, ' + -Math.random() * 3 + 's';
  p.style.opacity = 0.35 + Math.random() * 0.45;
  sky.appendChild(p);
}

scene.classList.add('closed');
updateUI();

/* телефон: включаем карточный движок вместо листов */
if (isMobile()) {
  document.body.classList.add('m-mode');
  leaves.forEach(l => l.style.display = 'none');
  mobileInit();
}

/* если токен уже есть — сразу подтягиваем фото с Drive в книгу */
if (accessToken) {
  rebuildWithDrivePhotos();
}

/* ===== Google Drive: модуль загрузки (константы и токен объявлены в начале файла) ===== */

/* ===== генератор милых подписей ===== */
const SWEET_A = [
  'Ещё один день с тобой', 'Твой взгляд', 'Твоя улыбка', 'Мы вместе',
  'Момент, который хочу помнить', 'Просто мы', 'С тобой время летит',
  'Одно из тысячи воспоминаний', 'Люблю смотреть на тебя', 'Как же мне повезло',
  'Наше маленькое приключение', 'Ты моя самая любимая', 'Обнимаю тебя взглядом',
  'Этот вечер с тобой', 'Ты и мир вокруг', 'Моё самое тёплое воспоминание',
  'Счастливая случайность', 'Наш день', 'Ты рядом — и этого достаточно'
];
const SWEET_B = [
  'и я самый счастливый', '— моё солнце', 'и весь мир подождал',
  '— моё любимое', 'навсегда в моём сердце', 'и это прекрасно',
  'спасибо, что ты есть', 'хочу это повторить', 'и снова влюбился',
  'ты делаешь день особенным', 'это только начало', 'моё «навсегда»'
];

function randomSweet() {
  const a = SWEET_A[Math.floor(Math.random() * SWEET_A.length)];
  const b = SWEET_B[Math.floor(Math.random() * SWEET_B.length)];
  return a + ' ' + b;
}

/* ===== сохранение подписей ===== */
function getStoredCaptions() {
  try { return JSON.parse(localStorage.getItem(CAPTIONS_KEY) || '{}'); }
  catch (e) { return {}; }
}
function setStoredCaptions(obj) {
  localStorage.setItem(CAPTIONS_KEY, JSON.stringify(obj));
}

/* ===== OAuth (Google Identity Services) ===== */
/* accessToken уже инициализирован из localStorage в начале файла */

function tokenClientInit() {
  if (!CONFIG.CLIENT_ID) return null;
  if (window.google && google.accounts && google.accounts.oauth2) {
    return google.accounts.oauth2.initTokenClient({
      client_id: CONFIG.CLIENT_ID,
      scope: 'https://www.googleapis.com/auth/drive.file',
      ux_mode: 'popup',
      callback: (resp) => {
        if (resp.access_token) {
          accessToken = resp.access_token;
          localStorage.setItem(TOKEN_KEY, accessToken);
          showUploadForm();
          rebuildWithDrivePhotos();
          renderGallery();
        }
      }
    });
  }
  return null;
}

/* подключаем Google Identity Services, когда открыт диалог */
function ensureGisLoaded() {
  return new Promise((resolve) => {
    if (window.google && google.accounts) return resolve();
    const s = document.createElement('script');
    s.src = 'https://accounts.google.com/gsi/client';
    s.onload = () => resolve();
    s.onerror = () => resolve();
    document.head.appendChild(s);
  });
}

async function loginGoogle() {
  if (!CONFIG.CLIENT_ID) {
    setStatus('Сначала заполни CLIENT_ID и FOLDER_ID в config.js — инструкция в этом файле.', true);
    return;
  }
  await ensureGisLoaded();
  const client = tokenClientInit();
  if (!client) { setStatus('Не загрузился Google-клиент. Проверь интернет.', true); return; }
  client.requestAccessToken();
}

function logoutGoogle() {
  localStorage.removeItem(TOKEN_KEY);
  accessToken = null;
}

/* ===== загрузка файла на Drive ===== */
async function uploadToDrive(file, caption) {
  const status = setStatus('Загружаю…');
  const metadata = {
    name: file.name,
    parents: [CONFIG.FOLDER_ID]
  };
  const form = new FormData();
  form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
  form.append('file', file);

  try {
    const resp = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + accessToken },
      body: form
    });
    if (!resp.ok) {
      const errText = await resp.text();
      let reason = 'Ошибка ' + resp.status;
      if (resp.status === 401) {
        /* токен истёк: чистим его и сразу просим новый вход */
        localStorage.removeItem(TOKEN_KEY);
        accessToken = null;
        setStatus('Токен истёк — сейчас откроется вход в Google…', true);
        setTimeout(() => { loginGoogle(); }, 800);
        return;
      }
      if (resp.status === 403) reason = 'Нет доступа к папке (403). Проверь FOLDER_ID в config.js';
      if (resp.status === 404) reason = 'Папка не найдена (404). Проверь FOLDER_ID в config.js';
      throw new Error(reason + ' ' + errText.slice(0, 200));
    }
    const data = await resp.json();
    const fileId = data.id;

    // делаем файл читаемым по ссылке (для девушки)
    try {
      await fetch('https://www.googleapis.com/drive/v3/files/' + fileId + '/permissions', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + accessToken,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role: 'reader', type: 'anyone' })
      });
    } catch (e) { /* не критично */ }

    // подпись: пользовательская или сгенерированная
    const finalCaption = caption.trim() ? caption.trim() : randomSweet();
    const caps = getStoredCaptions();
    caps[fileId] = finalCaption;
    setStoredCaptions(caps);

    setStatus('Готово! Фото в альбоме.');
    document.getElementById('fileInput').value = '';
    document.getElementById('captionInput').value = '';
    refreshBookAndGallery();
  } catch (e) {
    setStatus('Не получилось загрузить: ' + e.message, true);
    console.error('upload error:', e);
  }
}

/* ===== обновить книгу и галерею на месте (без перезагрузки страницы) ===== */
async function refreshBookAndGallery() {
  await rebuildWithDrivePhotos();
  await renderGallery();
}
/* тихая загрузка одного файла (для пакетной): без своих статусов и обновлений */
async function uploadToDriveSilent(file, caption) {
  /* страховка: не-изображения не грузим вовсе */
  if (!(file.type.startsWith('image/') || (!file.type && /\.(jpe?g|png|gif|webp|bmp|heic)$/i.test(file.name)))) { console.warn('Пропущен не-фото файл:', file.name); return null; }
  const metadata = { name: file.name, parents: [CONFIG.FOLDER_ID] };
  const form = new FormData();
  form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
  form.append('file', file);
  try {
    const resp = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + accessToken },
      body: form
    });
    if (resp.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      accessToken = null;
      setStatus('Токен истёк — войди в Google заново', true);
      return null;
    }
    if (!resp.ok) { setStatus('Не удалось загрузить ' + file.name, true); return null; }
    const data = await resp.json();
    const fileId = data.id;
    /* публичная ссылка */
    try {
      await fetch('https://www.googleapis.com/drive/v3/files/' + fileId + '/permissions', {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + accessToken, 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'reader', type: 'anyone' })
      });
    } catch (e) {}
    /* подпись */
    const caps = getStoredCaptions();
    caps[fileId] = caption.trim() ? caption.trim() : randomSweet();
    setStoredCaptions(caps);
    return fileId;
  } catch (e) {
    setStatus('Ошибка: ' + e.message, true);
    return null;
  }
}
/* ===== скрытие фото из альбома (фото остаётся на Google Drive) ===== */
function hidePhotoFromAlbum(fileId) {
  hidePhoto(fileId);
  return true;
}

/* ===== удаление фото с Google Drive (в корзину Drive) ===== */
async function deleteFromDrive(fileId) {
  if (!accessToken) { alert('Сначала войди в Google'); return false; }
  try {
    const resp = await fetch('https://www.googleapis.com/drive/v3/files/' + fileId, {
      method: 'DELETE',
      headers: { Authorization: 'Bearer ' + accessToken }
    });
    if (resp.status === 204 || resp.ok) {
      // чистим подпись и порядок
      const caps = getStoredCaptions();
      delete caps[fileId];
      setStoredCaptions(caps);
      setDriveOrder(getDriveOrder().filter(id => id !== fileId));
      return true;
    }
    if (resp.status === 401) alert('Токен истёк — войди в Google заново');
    else alert('Не удалось удалить (ошибка ' + resp.status + ')');
    return false;
  } catch (e) {
    alert('Не удалось удалить: ' + e.message);
    return false;
  }
}

/* ===== UI диалога ===== */
const modal = document.getElementById('uploadModal');
const loginArea = document.getElementById('driveLogin');
const uploadForm = document.getElementById('uploadForm');
const statusEl = document.getElementById('uploadStatus');

function setStatus(text, isError) {
  statusEl.textContent = text || '';
  statusEl.classList.toggle('error', !!isError);
  return statusEl;
}

function showUploadForm() {
  loginArea.classList.add('hidden');
  uploadForm.classList.remove('hidden');
}

document.getElementById('uploadFab').addEventListener('click', async () => {
  modal.classList.remove('hidden');
  if (!accessToken) return;             /* ещё не входили — покажется кнопка входа */
  /* проверим токен: не истёк ли */
  try {
    const resp = await fetch('https://www.googleapis.com/drive/v3/about?fields=user', {
      headers: { Authorization: 'Bearer ' + accessToken }
    });
    if (resp.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      accessToken = null;
      loginArea.classList.remove('hidden');
      uploadForm.classList.add('hidden');
      setStatus('Токен истёк — войди в Google заново', true);
      return;
    }
  } catch (e) { /* сеть — не критично */ }
  showUploadForm();
  renderGallery();
});

/* ===== галерея управления фото (скрыть из альбома / вернуть) ===== */
async function renderGallery() {
  const gallery = document.getElementById('gallery');
  const manageArea = document.getElementById('manageArea');
  if (!accessToken || !CONFIG.FOLDER_ID) { manageArea.classList.add('hidden'); return; }

  // полный список из Drive (включая скрытые)
  let all = [];
  try {
    const q = encodeURIComponent(`'${CONFIG.FOLDER_ID}' in parents and mimeType contains 'image/' and trashed = false`);
    const resp = await fetch(
      'https://www.googleapis.com/drive/v3/files?q=' + q +
      '&fields=files(id,name,createdTime)&orderBy=createdTime desc&pageSize=100',
      { headers: { Authorization: 'Bearer ' + accessToken } }
    );
    if (resp.ok) {
      const data = await resp.json();
      all = data.files || [];
    }
  } catch (e) { all = []; }

  if (!all.length) { manageArea.classList.add('hidden'); return; }
  manageArea.classList.remove('hidden');
  gallery.innerHTML = '';
  const hidden = getHiddenIds();
  /* порядок: скрытые в конец, видимые — по сохранённому порядку */
  const ordered = orderDrivePhotos(all);
  const visible = ordered.filter(f => !hidden.includes(f.id));
  const hiddenOnes = ordered.filter(f => hidden.includes(f.id));
  const display = visible.concat(hiddenOnes);

  display.forEach((f, idx) => {
    const isHidden = hidden.includes(f.id);
    const cell = document.createElement('div');
    cell.className = 'gallery-cell' + (isHidden ? ' off' : '');
    cell.dataset.photoId = f.id;
    const img = document.createElement('img');
    img.src = 'https://lh3.googleusercontent.com/d/' + f.id + '=w120-h120-c';
    img.alt = f.name;
    cell.appendChild(img);

    /* перемещение по порядку (только среди видимых) */
    if (!isHidden) {
      const up = document.createElement('button');
      up.className = 'move-btn up';
      up.textContent = '↑';
      up.title = 'Раньше в книге';
      up.disabled = (idx === 0);
      up.addEventListener('click', () => moveDrivePhoto(f.id, -1));
      cell.appendChild(up);

      const down = document.createElement('button');
      down.className = 'move-btn down';
      down.textContent = '↓';
      down.title = 'Позже в книге';
      down.disabled = (idx === visible.length - 1);
      down.addEventListener('click', () => moveDrivePhoto(f.id, 1));
      cell.appendChild(down);
    }

    /* для скрытых: кнопка полного удаления с Google Drive */
    if (isHidden) {
      const kill = document.createElement('button');
      kill.className = 'kill-btn';
      kill.textContent = '✕';
      kill.title = 'Удалить с Google Drive навсегда (в корзину Drive)';
      kill.addEventListener('click', async () => {
        kill.disabled = true;
        const name = f.name || 'это фото';
        if (!confirm('Удалить «' + name + '» с Google Drive?\n(Попадёт в корзину Drive — восстановить можно будет только там)')) {
          kill.disabled = false;
          return;
        }
        const ok = await deleteFromDrive(f.id);
        if (ok) {
          unhidePhoto(f.id); // убираем из скрытых — фото больше не существует
          refreshBookAndGallery();
        } else {
          kill.disabled = false;
        }
      });
      cell.appendChild(kill);
    }

    const btn = document.createElement('button');
    btn.className = 'del-btn';
    btn.textContent = isHidden ? '↩' : '🗑';
    btn.title = isHidden ? 'Вернуть в альбом' : 'Скрыть из альбома (на Drive останется)';
    btn.addEventListener('click', async () => {
      btn.disabled = true;
      if (isHidden) {
        unhidePhoto(f.id);
      } else {
        hidePhotoFromAlbum(f.id);
      }
      refreshBookAndGallery();
    });
    cell.appendChild(btn);
    gallery.appendChild(cell);
  });
}

/* перемещение Drive-фото в порядке книги — прямо в галерее (мгновенно) */
function moveDrivePhoto(fileId, dir) {
  const cells = Array.from(gallery.children).filter(cel => !cel.classList.contains('off'));
  const cell = cells.find(cel => cel.dataset.photoId === fileId);
  if (!cell) return;
  const idx = cells.indexOf(cell);
  const target = idx + dir;
  if (target < 0 || target >= cells.length) return;

  /* перестановка в DOM: фото передвигается тут же */
  if (dir === -1) {
    gallery.insertBefore(cell, cells[target]);
  } else {
    const next = cells[target].nextSibling;
    if (next) gallery.insertBefore(cell, next);
    else gallery.appendChild(cell);
  }

  /* сохраняем новый порядок и тихо обновляем книгу */
  const newOrder = Array.from(gallery.children).filter(cel => !cel.classList.contains('off')).map(cel => cel.dataset.photoId);
  setDriveOrder(newOrder);
  updateMoveButtons();
  rebuildWithDrivePhotos();
}

/* обновить состояние стрелок (первая ↑ и последняя ↓ disabled) */
function updateMoveButtons() {
  const cells = Array.from(gallery.children).filter(cel => !cel.classList.contains('off'));
  cells.forEach((cel, i) => {
    const up = cel.querySelector('.move-btn.up');
    const down = cel.querySelector('.move-btn.down');
    if (up) up.disabled = (i === 0);
    if (down) down.disabled = (i === cells.length - 1);
  });
}

/* фактический порядок видимых Drive-фото (с учётом новых, которых нет в сохранённом) */
async function renderOrderSync() {
  let all = [];
  try {
    const q = encodeURIComponent(`'${CONFIG.FOLDER_ID}' in parents and mimeType contains 'image/' and trashed = false`);
    const resp = await fetch(
      'https://www.googleapis.com/drive/v3/files?q=' + q + '&fields=files(id,name,createdTime)&pageSize=100',
      { headers: { Authorization: 'Bearer ' + accessToken } }
    );
    if (resp.ok) {
      const data = await resp.json();
      all = data.files || [];
    }
  } catch (e) {}
  const hidden = getHiddenIds();
  return orderDrivePhotos(all).map(f => f.id).filter(id => !hidden.includes(id));
}

/* закрытие диалога: книга и галерея обновятся (фото уже могли добавиться) */
function closeUploadModal() {
  modal.classList.add('hidden');
  setStatus('');
  refreshBookAndGallery();
}

document.getElementById('cancelUpload').addEventListener('click', closeUploadModal);

document.getElementById('loginBtn').addEventListener('click', loginGoogle);

/* загрузка сразу нескольких фото: каждое загружается по очереди */
let uploading = false;
document.getElementById('uploadBtn').addEventListener('click', async () => {
  if (uploading) return;
  const fileInput = document.getElementById('fileInput');
  const caption = document.getElementById('captionInput').value;
  if (!fileInput.files || !fileInput.files.length) { setStatus('Сначала выбери фото', true); return; }

  /* проверка типов: грузим только изображения, остальное пропускаем */
  const allFiles = Array.from(fileInput.files);
  /* фильтр: изображения; пустой type (бывает на Android) — проверяем расширение */
  const isImage = f => f.type.startsWith('image/') || (!f.type && /\.(jpe?g|png|gif|webp|bmp|heic)$/i.test(f.name));
  const files = allFiles.filter(isImage);
  const skipped = allFiles.length - files.length;
  if (skipped > 0) setStatus('Пропущено не-фото файлов: ' + skipped, true);
  if (!files.length) { setStatus('Выбери хотя бы одно изображение (jpg, png…)', true); return; }
  if (!accessToken) { setStatus('Сначала войди в Google', true); return; }
  uploading = true;
  const btn = document.getElementById('uploadBtn');
  btn.disabled = true;
  for (let i = 0; i < files.length; i++) {
    setStatus('Загружаю ' + (i + 1) + ' из ' + files.length + '…');
    await uploadToDriveSilent(files[i], caption.trim());
  }
  uploading = false;
  btn.disabled = false;
  document.getElementById('fileInput').value = '';
  document.getElementById('captionInput').value = '';
  setStatus('Готово! Загружено фото: ' + files.length + ' — уже в книге.');
});

modal.addEventListener('click', (e) => {
  if (e.target === modal) { closeUploadModal(); }
});

/* ===== (загрузка списка фото с Drive в книгу) =====
   Фото из папки на Drive добавляются в конец книги перед «Это мы».
   Скрытые (удалённые из альбома) фото не показываются.
*/
async function loadDrivePhotos() {
  if (!accessToken || !CONFIG.FOLDER_ID) return [];
  try {
    const q = encodeURIComponent(`'${CONFIG.FOLDER_ID}' in parents and mimeType contains 'image/' and trashed = false`);
    const resp = await fetch(
      'https://www.googleapis.com/drive/v3/files?q=' + q +
      '&fields=files(id,name,createdTime,mimeType)&orderBy=createdTime desc&pageSize=100',
      { headers: { Authorization: 'Bearer ' + accessToken } }
    );
    if (!resp.ok) return [];
    const data = await resp.json();
    const caps = getStoredCaptions();
    const hidden = getHiddenIds();
    const files = (data.files || []).filter(f => !hidden.includes(f.id));
    const ordered = orderDrivePhotos(files).map(f => {
      /* подпись фиксируется при первом показе и сохраняется — не меняется */
      if (!caps[f.id]) caps[f.id] = randomSweet();
      return {
        src: 'https://lh3.googleusercontent.com/d/' + f.id,
        caption: caps[f.id],
        id: f.id
      };
    });
    setStoredCaptions(caps);
    return ordered;
  } catch (e) { return []; }
}

const DRIVE_ORDER_KEY = 'gd_order'; // порядок Drive-фото в книге

function getDriveOrder() {
  try { return JSON.parse(localStorage.getItem(DRIVE_ORDER_KEY) || '[]'); }
  catch (e) { return []; }
}
function setDriveOrder(arr) {
  localStorage.setItem(DRIVE_ORDER_KEY, JSON.stringify(arr));
}

/* упорядочить список фото: сначала по сохранённому порядку, потом новые в конец.
   Новые идут в конце в порядке загрузки (свежие — в самый конец) */
function orderDrivePhotos(files) {
  const order = getDriveOrder();
  const known = order.map(id => files.find(f => f.id === id)).filter(Boolean);
  /* rest: сортируем по дате создания ПО ВОЗРАСТАНИЮ — свежие в самый конец */
  const rest = files
    .filter(f => !order.includes(f.id))
    .sort((a, b) => (a.createdTime || '').localeCompare(b.createdTime || ''));
  return known.concat(rest);
}

/* ===== скрытие фото из книги (без удаления с Drive) ===== */
function getHiddenIds() {
  try { return JSON.parse(localStorage.getItem(HIDDEN_KEY) || '[]'); }
  catch (e) { return []; }
}
function setHiddenIds(arr) {
  localStorage.setItem(HIDDEN_KEY, JSON.stringify(arr));
}
function hidePhoto(fileId) {
  const hidden = getHiddenIds();
  if (!hidden.includes(fileId)) {
    hidden.push(fileId);
    setHiddenIds(hidden);
  }
}
function unhidePhoto(fileId) {
  setHiddenIds(getHiddenIds().filter(id => id !== fileId));
}

/* ===== добавление фото с Google Drive в книгу =====
   Пересобирает книгу: обложка → все Drive-фото → «Это мы» → задняя обложка.
   Чётность гарантируется: blank-вставки только там, где нужно. */
async function rebuildWithDrivePhotos() {
  const drivePhotos = await loadDrivePhotos();
  /* собираем pages заново с нуля — никакого splice хвостов */
  const newPages = [{ type: 'cover' }];
  drivePhotos.forEach((p, i) => {
    newPages.push({
      type: 'photo',
      src: p.src,
      num: i + 1,
      photoNum: null,
      caption: p.caption,
      driveId: p.id
    });
  });
  /* «Это мы» (final) и «С любовью» (backcover) — две стороны ОДНОГО листа:
     final на чётном индексе (front), backcover сразу за ним (back).
     blank для чётности вставляется ПЕРЕД финалом, между фото */
  if (newPages.length % 2 !== 0) newPages.push({ type: 'blank' });
  newPages.push({ type: 'final' });
  newPages.push({ type: 'backcover' });

  /* заменяем глобальный pages и пересобираем DOM книги */
  pages.length = 0;
  pages.push(...newPages);

  leaves.forEach(l => l.remove());
  leaves.length = 0;
  const newCount = Math.ceil(pages.length / 2);
  for (let k = 0; k < newCount; k++) {
    const frontData = pages[2 * k]     || { type: 'blank' };
    const backData  = pages[2 * k + 1] || { type: 'blank' };
    const leaf = document.createElement('div');
    leaf.className = 'leaf' + (k === 0 ? ' cover' : '');
    leaf.appendChild(renderPage(frontData, 'front'));
    leaf.appendChild(renderPage(backData, 'back'));
    book.appendChild(leaf);
    leaves.push(leaf);
  }
  leafCount = newCount;
  /* ВОССТАНАВЛИВАЕМ состояние: первые current листов — перевёрнуты,
     как было до пересборки (иначе книга «теряет» прочитанные страницы) */
  current = Math.min(current, newCount);
  leaves.forEach((l, i) => { l.classList.toggle('flipped', i < current); });
  /* на телефоне: пересобрать карточный движок и спрятать листы */
  if (isMobile()) {
    leaves.forEach(l => l.style.display = 'none');
    if (!document.body.classList.contains('m-mode')) document.body.classList.add('m-mode');
    mobileInit();
  }
  setEnd(current === leafCount);
  restack();
  updateUI();
}
