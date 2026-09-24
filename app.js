const STORAGE = {
  events: "culture-circle-events",
  bookings: "culture-circle-bookings",
  ideas: "culture-circle-ideas",
  tickets: "culture-circle-tickets",
  settings: "culture-circle-settings"
};

const defaultSettings = {
  siteName: "Культурный круг",
  municipality: "Краснодонский МО",
  eyebrow: "Городская культурная платформа",
  heroTitle: "Культура начинается",
  heroAccent: "со встречи",
  heroDescription: "Находите события, бронируйте места и помогайте учреждениям создавать программу, которая действительно нужна людям.",
  footerDescription: "Единое пространство для учреждений культуры и их посетителей.",
  contactEmail: "culture@example.ru"
};

const defaultEvents = [
  { id: "e1", title: "Музыка старого города", category: "Концерт", date: futureDate(4, 19), venue: "Большой зал", capacity: 120, color: "#d65231", description: "Камерный оркестр исполнит музыку, вдохновлённую историей городских улиц." },
  { id: "e2", title: "Человек, который смеётся", category: "Театр", date: futureDate(9, 18), venue: "Камерная сцена", capacity: 70, color: "#355b87", description: "Пластический спектакль по мотивам романа Виктора Гюго о достоинстве и любви." },
  { id: "e3", title: "Глина и тёплый свет", category: "Мастер-класс", date: futureDate(13, 12), venue: "Творческая студия", capacity: 18, color: "#b4773f", description: "Создадим подсвечник из глины вручную и узнаем основы работы с материалом." },
  { id: "e4", title: "Архитектура памяти", category: "Лекция", date: futureDate(17, 18), venue: "Лекторий", capacity: 90, color: "#48715f", description: "Разговор о том, как здания сохраняют память места и меняют жизнь города." },
  { id: "e5", title: "Звуки природы", category: "Концерт", date: futureDate(23, 16), venue: "Внутренний двор", capacity: 150, color: "#597b3a", description: "Экспериментальная музыка, полевые записи и живые инструменты под открытым небом." },
  { id: "e6", title: "Сказки на ночь", category: "Театр", date: futureDate(29, 17), venue: "Малая сцена", capacity: 45, color: "#72518a", description: "Тёплый семейный спектакль с теневым театром для детей и взрослых." }
];

const movies = [
  { id: "m1", title: "Северный ветер", cinema: "Победа", city: "Краснодон", genre: "Приключения", duration: "1 ч 48 мин", age: "12+", sessions: ["11:20", "15:40", "19:10"], price: 250, color: "#345f78", pushkin: true },
  { id: "m2", title: "Семейный переполох", cinema: "Победа", city: "Краснодон", genre: "Комедия", duration: "1 ч 35 мин", age: "6+", sessions: ["10:00", "13:30", "17:20"], price: 220, color: "#d26a35", pushkin: false },
  { id: "m3", title: "Письма из будущего", cinema: "Родина", city: "Суходольск", genre: "Фантастика", duration: "2 ч 06 мин", age: "12+", sessions: ["12:10", "16:00", "20:00"], price: 270, color: "#59538a", pushkin: true },
  { id: "m4", title: "Лесные истории", cinema: "Родина", city: "Суходольск", genre: "Анимация", duration: "1 ч 22 мин", age: "0+", sessions: ["09:50", "12:30", "15:10"], price: 200, color: "#4f7c52", pushkin: false },
  { id: "m5", title: "Высота", cinema: "Мир", city: "Молодгвардейск", genre: "Драма", duration: "1 ч 54 мин", age: "16+", sessions: ["11:40", "17:00", "20:20"], price: 260, color: "#a2493d", pushkin: true },
  { id: "m6", title: "Тайна старого маяка", cinema: "Мир", city: "Молодгвардейск", genre: "Семейный", duration: "1 ч 42 мин", age: "6+", sessions: ["10:20", "14:10", "18:30"], price: 230, color: "#267a72", pushkin: false }
];

function futureDate(days, hour) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(hour, 0, 0, 0);
  return date.toISOString();
}

function load(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return Array.isArray(value) ? value : fallback;
  } catch {
    return fallback;
  }
}

function loadSettings() {
  try {
    return { ...defaultSettings, ...JSON.parse(localStorage.getItem(STORAGE.settings)) };
  } catch {
    return { ...defaultSettings };
  }
}

let events = load(STORAGE.events, defaultEvents);
let bookings = load(STORAGE.bookings, []);
let ideas = load(STORAGE.ideas, []);
let ticketOrders = load(STORAGE.tickets, []);
let siteSettings = loadSettings();
let activeFilter = "Все";
let activeCinema = "Все";
let posterStyle = "avant";

const $ = (selector) => document.querySelector(selector);
const eventGrid = $("#eventGrid");
const bookingDialog = $("#bookingDialog");
const adminDialog = $("#adminDialog");
const ticketDialog = $("#ticketDialog");
const months = ["янв", "фев", "мар", "апр", "мая", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"];

function save() {
  localStorage.setItem(STORAGE.events, JSON.stringify(events));
  localStorage.setItem(STORAGE.bookings, JSON.stringify(bookings));
  localStorage.setItem(STORAGE.ideas, JSON.stringify(ideas));
  localStorage.setItem(STORAGE.tickets, JSON.stringify(ticketOrders));
  localStorage.setItem(STORAGE.settings, JSON.stringify(siteSettings));
}

function applySiteSettings() {
  document.title = `${siteSettings.siteName} | ${siteSettings.municipality}`;
  document.querySelectorAll("[data-site-name]").forEach((element) => { element.textContent = siteSettings.siteName; });
  document.querySelectorAll("[data-site-municipality]").forEach((element) => { element.textContent = siteSettings.municipality; });
  $("#heroEyebrow").textContent = siteSettings.eyebrow;
  $("#heroTitle").textContent = siteSettings.heroTitle;
  $("#heroAccent").textContent = siteSettings.heroAccent;
  $("#heroDescription").textContent = siteSettings.heroDescription;
  $("#footerDescription").textContent = siteSettings.footerDescription;
  document.querySelectorAll(".vacancy-card a[href^='mailto:']").forEach((link) => {
    const query = link.getAttribute("href").split("?")[1];
    link.href = `mailto:${siteSettings.contactEmail}${query ? `?${query}` : ""}`;
  });
}

function openSiteEditor() {
  const form = $("#siteForm");
  Object.entries(siteSettings).forEach(([name, value]) => {
    if (form.elements[name]) form.elements[name].value = value;
  });
  form.classList.remove("hidden");
  $("#eventForm").classList.add("hidden");
  form.scrollIntoView({ behavior: "smooth", block: "start" });
}

function resetEventForm() {
  const form = $("#eventForm");
  form.reset();
  form.elements.eventId.value = "";
  form.elements.capacity.value = 50;
  form.elements.color.value = "#e55b32";
  $("#eventFormTitle").textContent = "Новое событие";
  $("#saveEventButton").textContent = "Опубликовать";
}

function openEventEditor(eventId = "") {
  resetEventForm();
  const form = $("#eventForm");
  const event = events.find((item) => item.id === eventId);
  if (event) {
    form.elements.eventId.value = event.id;
    form.elements.title.value = event.title;
    form.elements.category.value = event.category;
    const localDate = new Date(new Date(event.date).getTime() - new Date(event.date).getTimezoneOffset() * 60000);
    form.elements.date.value = localDate.toISOString().slice(0, 16);
    form.elements.venue.value = event.venue;
    form.elements.capacity.value = event.capacity;
    form.elements.color.value = event.color;
    form.elements.description.value = event.description;
    $("#eventFormTitle").textContent = "Редактирование события";
    $("#saveEventButton").textContent = "Сохранить изменения";
  }
  $("#siteForm").classList.add("hidden");
  form.classList.remove("hidden");
  form.scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderCinema() {
  const visible = movies.filter((movie) => activeCinema === "Все" || movie.cinema === activeCinema);
  $("#cinemaGrid").innerHTML = visible.map((movie) => `<article class="movie-card">
    <div class="movie-poster" style="background:${escapeHtml(movie.color)}">
      <span class="movie-age">${escapeHtml(movie.age)}</span>
      <strong>${escapeHtml(movie.title)}</strong>
    </div>
    <div class="movie-body">
      <span class="cinema-place">${escapeHtml(movie.city)} · кинозал «${escapeHtml(movie.cinema)}»</span>
      <h3>${escapeHtml(movie.genre)}</h3>
      <p class="movie-meta">${escapeHtml(movie.duration)}${movie.pushkin ? " · Доступно по Пушкинской карте" : ""}</p>
      <span class="session-label">Сеансы сегодня</span>
      <div class="sessions">${movie.sessions.map((session) => `<span class="session">${session}</span>`).join("")}</div>
      <div class="movie-footer"><span class="movie-price">от ${movie.price} ₽</span><button class="button primary small" data-buy-ticket="${movie.id}">Купить билет</button></div>
    </div>
  </article>`).join("");
}

function openTicketDialog(movieId) {
  const movie = movies.find((item) => item.id === movieId);
  if (!movie) return;
  $("#ticketTitle").textContent = movie.title;
  $("#ticketCinema").textContent = `${movie.city} · кинозал «${movie.cinema}» · от ${movie.price} ₽`;
  $("#ticketForm").elements.movieId.value = movie.id;
  $("#ticketSession").innerHTML = movie.sessions.map((session) => `<option value="${session}">Сегодня, ${session}</option>`).join("");
  ticketDialog.showModal();
}

function createId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function eventBookings(eventId) {
  return bookings.filter((item) => item.eventId === eventId).reduce((sum, item) => sum + Number(item.tickets), 0);
}

function formatEventDate(value) {
  return new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" }).format(new Date(value));
}

function renderEvents() {
  const visible = events
    .filter((event) => activeFilter === "Все" || event.category === activeFilter)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  eventGrid.innerHTML = visible.map((event) => {
    const date = new Date(event.date);
    const taken = eventBookings(event.id);
    const free = Math.max(0, event.capacity - taken);
    return `<article class="event-card">
      <div class="event-visual" style="background:${escapeHtml(event.color)}">
        <div class="event-date"><strong>${date.getDate()}</strong><span>${months[date.getMonth()]}</span></div>
        <span class="event-category">${escapeHtml(event.category)}</span>
      </div>
      <div class="event-body">
        <h3>${escapeHtml(event.title)}</h3>
        <p>${escapeHtml(event.description)}</p>
        <div class="event-info"><span>◷ ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}</span><span>⌖ ${escapeHtml(event.venue)}</span></div>
        <div class="event-footer"><span class="seats">${free ? `Осталось мест: ${free}` : "Мест нет"}</span><button class="book-button" data-book="${event.id}" ${free ? "" : "disabled"}>Записаться →</button></div>
      </div>
    </article>`;
  }).join("");
  $("#eventsEmpty").classList.toggle("hidden", visible.length > 0);
  renderSummary();
  fillPosterEvents();
}

function renderSummary() {
  $("#eventCount").textContent = events.length;
  $("#visitorCount").textContent = bookings.reduce((sum, item) => sum + Number(item.tickets), 0);
  $("#ideaCount").textContent = ideas.length;
  const next = [...events].filter((item) => new Date(item.date) > new Date()).sort((a, b) => new Date(a.date) - new Date(b.date))[0];
  $("#nextEventTitle").textContent = next?.title || "Скоро появится";
  $("#nextEventDate").textContent = next ? formatEventDate(next.date) : "Следите за обновлениями";
}

function fillPosterEvents() {
  const select = $("#posterEvent");
  const current = select.value;
  select.innerHTML = events.map((event) => `<option value="${event.id}">${escapeHtml(event.title)}</option>`).join("");
  if (events.some((event) => event.id === current)) select.value = current;
  drawPoster();
}

function drawPoster() {
  const canvas = $("#posterCanvas");
  const ctx = canvas.getContext("2d");
  const event = events.find((item) => item.id === $("#posterEvent").value) || events[0];
  if (!event) return;
  const palettes = {
    avant: { bg: event.color, ink: "#fffaf0", accent: "#efbd45" },
    classic: { bg: "#efe7d7", ink: "#162a24", accent: event.color },
    bright: { bg: "#efbd45", ink: "#142d27", accent: "#e45431" }
  };
  const p = palettes[posterStyle];
  ctx.fillStyle = p.bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = p.accent;
  ctx.lineWidth = 4;
  ctx.beginPath(); ctx.arc(565, 165, 190, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.arc(570, 165, 118, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = p.accent;
  ctx.beginPath(); ctx.arc(590, 180, 65, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = p.ink;
  ctx.font = "700 17px Manrope, sans-serif";
  ctx.fillText("КУЛЬТУРНЫЙ КРУГ · КРАСНОДОНСКИЙ МО", 62, 70);
  ctx.font = "600 18px Manrope, sans-serif";
  ctx.fillText(event.category.toUpperCase(), 62, 220);
  drawWrappedText(ctx, event.title, 62, 290, 570, 76, "56px Prata, serif", p.ink);
  const date = new Date(event.date);
  ctx.fillStyle = p.ink;
  ctx.font = "400 42px Prata, serif";
  ctx.fillText(`${date.getDate()} ${months[date.getMonth()]}`, 62, 680);
  ctx.font = "600 20px Manrope, sans-serif";
  ctx.fillText(`${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}  /  ${event.venue}`, 62, 725);
  ctx.fillStyle = p.accent;
  ctx.fillRect(62, 790, 130, 5);
  ctx.fillStyle = p.ink;
  ctx.font = "500 15px Manrope, sans-serif";
  ctx.fillText("ВХОД ПО ПРЕДВАРИТЕЛЬНОЙ РЕГИСТРАЦИИ", 62, 835);
}

function drawWrappedText(ctx, text, x, y, maxWidth, lineHeight, font, color) {
  ctx.font = font;
  ctx.fillStyle = color;
  const words = text.split(" ");
  let line = "";
  let lineY = y;
  words.forEach((word) => {
    const test = `${line}${word} `;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line.trim(), x, lineY);
      line = `${word} `;
      lineY += lineHeight;
    } else line = test;
  });
  ctx.fillText(line.trim(), x, lineY);
}

function renderAdmin() {
  const totalVisitors = bookings.reduce((sum, item) => sum + Number(item.tickets), 0);
  $("#adminMetrics").innerHTML = `<div class="metric"><strong>${events.length}</strong><span>событий опубликовано</span></div><div class="metric"><strong>${totalVisitors}</strong><span>посетителей записано</span></div><div class="metric"><strong>${ideas.length}</strong><span>пожеланий получено</span></div>`;
  $("#adminEvents").innerHTML = events.length ? events.map((event) => `<div class="admin-item"><div><strong>${escapeHtml(event.title)}</strong><span>${formatEventDate(event.date)} · записано ${eventBookings(event.id)} из ${event.capacity}</span></div><div class="item-actions"><button class="edit-button" data-edit-event="${event.id}">Изменить</button><button class="delete-button" data-delete-event="${event.id}">Удалить</button></div></div>`).join("") : `<div class="empty-state">Событий пока нет</div>`;
  $("#adminIdeas").innerHTML = ideas.length ? ideas.slice().reverse().map((idea) => `<div class="admin-item"><div><strong>${escapeHtml(idea.idea)}</strong><span>${escapeHtml(idea.name)} · ${escapeHtml(idea.format)}</span></div><button class="delete-button" data-delete-idea="${idea.id}">Удалить</button></div>`).join("") : `<div class="empty-state">Пожеланий пока нет</div>`;
}

function openBooking(eventId) {
  const event = events.find((item) => item.id === eventId);
  if (!event) return;
  $("#bookingTitle").textContent = event.title;
  $("#bookingMeta").textContent = `${formatEventDate(event.date)} · ${event.venue}`;
  $("#bookingForm").elements.eventId.value = event.id;
  bookingDialog.showModal();
}

function toast(message) {
  const element = $("#toast");
  element.textContent = message;
  element.classList.add("show");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => element.classList.remove("show"), 3000);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char]);
}

$("#filters").addEventListener("click", (event) => {
  const button = event.target.closest("[data-filter]");
  if (!button) return;
  activeFilter = button.dataset.filter;
  document.querySelectorAll(".filter").forEach((item) => item.classList.toggle("active", item === button));
  renderEvents();
});

eventGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-book]");
  if (button) openBooking(button.dataset.book);
});

$("#cinemaFilters").addEventListener("click", (event) => {
  const button = event.target.closest("[data-cinema]");
  if (!button) return;
  activeCinema = button.dataset.cinema;
  document.querySelectorAll(".cinema-filter").forEach((item) => item.classList.toggle("active", item === button));
  renderCinema();
});

$("#cinemaGrid").addEventListener("click", (event) => {
  const button = event.target.closest("[data-buy-ticket]");
  if (button) openTicketDialog(button.dataset.buyTicket);
});

$("#ticketForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.currentTarget));
  ticketOrders.push({ ...data, id: createId(), createdAt: new Date().toISOString() });
  save();
  event.currentTarget.reset();
  ticketDialog.close();
  toast("Заказ создан. В демонстрационной версии оплата не списана.");
});

$("#bookingForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.currentTarget));
  const selectedEvent = events.find((item) => item.id === data.eventId);
  const free = selectedEvent.capacity - eventBookings(selectedEvent.id);
  if (Number(data.tickets) > free) return toast(`Доступно мест: ${free}`);
  bookings.push({ ...data, id: createId(), createdAt: new Date().toISOString() });
  save();
  event.currentTarget.reset();
  bookingDialog.close();
  renderEvents();
  toast("Вы успешно записаны. До встречи!");
});

$("#feedbackForm").addEventListener("submit", (event) => {
  event.preventDefault();
  ideas.push({ ...Object.fromEntries(new FormData(event.currentTarget)), id: createId(), createdAt: new Date().toISOString() });
  save();
  event.currentTarget.reset();
  renderSummary();
  toast("Спасибо! Ваше пожелание принято.");
});

document.querySelectorAll("[data-close-dialog]").forEach((button) => button.addEventListener("click", () => bookingDialog.close()));
$("[data-close-ticket]").addEventListener("click", () => ticketDialog.close());
document.querySelectorAll("[data-open-admin]").forEach((button) => button.addEventListener("click", () => { renderAdmin(); adminDialog.showModal(); }));
$("[data-close-admin]").addEventListener("click", () => adminDialog.close());
$("#showSiteForm").addEventListener("click", openSiteEditor);
$("#cancelSite").addEventListener("click", () => $("#siteForm").classList.add("hidden"));
$("#showEventForm").addEventListener("click", () => openEventEditor());
$("#cancelEvent").addEventListener("click", () => { resetEventForm(); $("#eventForm").classList.add("hidden"); });

$("#siteForm").addEventListener("submit", (event) => {
  event.preventDefault();
  siteSettings = Object.fromEntries(new FormData(event.currentTarget));
  save();
  applySiteSettings();
  event.currentTarget.classList.add("hidden");
  toast("Настройки сайта сохранены");
});

$("#resetSite").addEventListener("click", () => {
  siteSettings = { ...defaultSettings };
  save();
  applySiteSettings();
  openSiteEditor();
  toast("Исходные настройки восстановлены");
});

$("#eventForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.currentTarget));
  const normalized = { ...data, id: data.eventId || createId(), capacity: Number(data.capacity), date: new Date(data.date).toISOString() };
  delete normalized.eventId;
  const existingIndex = events.findIndex((item) => item.id === normalized.id);
  if (existingIndex >= 0) events[existingIndex] = normalized;
  else events.push(normalized);
  save();
  const wasEditing = existingIndex >= 0;
  resetEventForm();
  event.currentTarget.classList.add("hidden");
  renderEvents();
  renderAdmin();
  toast(wasEditing ? "Изменения сохранены" : "Событие опубликовано");
});

$("#adminEvents").addEventListener("click", (event) => {
  const editButton = event.target.closest("[data-edit-event]");
  if (editButton) {
    openEventEditor(editButton.dataset.editEvent);
    return;
  }
  const button = event.target.closest("[data-delete-event]");
  if (!button || !confirm("Удалить событие и связанные записи?")) return;
  events = events.filter((item) => item.id !== button.dataset.deleteEvent);
  bookings = bookings.filter((item) => item.eventId !== button.dataset.deleteEvent);
  save(); renderEvents(); renderAdmin();
});

$("#adminIdeas").addEventListener("click", (event) => {
  const button = event.target.closest("[data-delete-idea]");
  if (!button) return;
  ideas = ideas.filter((item) => item.id !== button.dataset.deleteIdea);
  save(); renderSummary(); renderAdmin();
});

$("#posterEvent").addEventListener("change", drawPoster);
document.querySelectorAll(".style-choice").forEach((button) => button.addEventListener("click", () => {
  posterStyle = button.dataset.style;
  document.querySelectorAll(".style-choice").forEach((item) => item.classList.toggle("active", item === button));
  drawPoster();
}));
$("#downloadPoster").addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = "afisha.png";
  link.href = $("#posterCanvas").toDataURL("image/png");
  link.click();
  toast("Афиша скачана в формате PNG");
});

$("#menuButton").addEventListener("click", (event) => {
  const open = $("#mainNav").classList.toggle("open");
  event.currentTarget.setAttribute("aria-expanded", open);
});
$("#mainNav").addEventListener("click", () => $("#mainNav").classList.remove("open"));
document.querySelectorAll("dialog").forEach((dialog) => dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
}));

$("#year").textContent = new Date().getFullYear();
applySiteSettings();
renderEvents();
renderCinema();
