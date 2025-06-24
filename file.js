let guests = [];
let guestIdCounter = 0;
const MAX_GUESTS = 10;

const guestForm      = document.getElementById("guestForm");
const guestNameInput = document.getElementById("guestName");
const guestCategory  = document.getElementById("guestCategory");
const addGuestBtn    = document.getElementById("addGuestBtn");
const guestListEl    = document.getElementById("guestList");
const emptyState     = document.getElementById("emptyState");
const toastEl        = document.getElementById("toast");
const toastMsg       = document.getElementById("toastMessage");
const guestCount     = document.getElementById("guestCount");
const totalGuestsEl  = document.getElementById("totalGuests");
const starsContainer = document.getElementById("starsContainer");

document.addEventListener("DOMContentLoaded", () => {
  generateStars(120);
  updateUI();
  guestForm.addEventListener("submit", handleAddGuest);
});

function handleAddGuest(e) {
  e.preventDefault();
  const name = guestNameInput.value.trim();
  if (!name) return;

  if (guests.length >= MAX_GUESTS) {
    showToast(`🚫 Guest list full! Maximum ${MAX_GUESTS} guests.`, "error");
    return;
  }

  guests.push({
    id: ++guestIdCounter,
    name,
    category: guestCategory.value,
    rsvpStatus: "Not Attending",
    addedAt: new Date()
  });

  guestForm.reset();
  updateUI();
  showToast(`✅ Added! ${name} is on the list.`, "success");
}

function removeGuest(id) {
  const guest = guests.find(g => g.id === id);
  guests = guests.filter(g => g.id !== id);
  updateUI();
  if (guest) showToast(`👋 Removed: ${guest.name}`, "info");
}

function toggleRSVP(id) {
  const guest = guests.find(g => g.id === id);
  if (guest) {
    guest.rsvpStatus = guest.rsvpStatus === "Attending"
      ? "Not Attending"
      : "Attending";
    updateUI();
  }
}

function editGuest(id) {
  const guest = guests.find(g => g.id === id);
  if (!guest) return;

  const card = document.querySelector(`[data-guest-id="${id}"]`);
  const nameSpan = card.querySelector(".guest-name");

  const input = document.createElement("input");
  input.type = "text";
  input.value = guest.name;
  input.className = "edit-input w-full bg-black/40 px-2 py-1 rounded";
  nameSpan.replaceWith(input);
  input.focus();

  const save = () => saveEdit(guest, input);
  const cancel = () => input.replaceWith(nameSpan);

  input.addEventListener("blur", save);
  input.addEventListener("keydown", e => {
    if (e.key === "Enter") save();
    if (e.key === "Escape") cancel();
  });
}

function saveEdit(guest, input) {
  const newName = input.value.trim();
  if (newName) {
    guest.name = newName;
    showToast("✏️ Guest updated!", "success");
  }

  const nameSpan = document.createElement("span");
  nameSpan.className = "guest-name text-lg font-semibold";
  nameSpan.textContent = guest.name;
  input.replaceWith(nameSpan);
  updateUI();
}

function updateUI() {
  renderGuestList();
  const attending = guests.filter(g => g.rsvpStatus === "Attending").length;
  guestCount.textContent = `${attending} attending • ${guests.length}/${MAX_GUESTS} guests`;
  totalGuestsEl.textContent = `(${guests.length} total)`;
  emptyState.classList.toggle("hidden", guests.length !== 0);
  addGuestBtn.disabled = guests.length >= MAX_GUESTS;
}

function renderGuestList() {
  guestListEl.innerHTML = guests
    .map(g => `
      <div
        class="guest-card p-4 border border-purple-500/30 rounded bg-black/20"
        data-guest-id="${g.id}"
      >
        <span class="guest-name text-lg font-semibold">${g.name}</span>
        <div class="text-sm text-gray-400">${g.category}</div>
        <div class="text-sm ${g.rsvpStatus === "Attending" ? "text-green-400" : "text-red-400"}">
          RSVP: ${g.rsvpStatus}
        </div>
        <div class="flex gap-2 mt-2">
          <button
            onclick="toggleRSVP(${g.id})"
            class="bg-purple-600 px-2 py-1 rounded hover:bg-purple-700"
          >Toggle RSVP</button>
          <button
            onclick="editGuest(${g.id})"
            class="bg-blue-600 px-2 py-1 rounded hover:bg-blue-700"
          >Edit</button>
          <button
            onclick="removeGuest(${g.id})"
            class="bg-red-600 px-2 py-1 rounded hover:bg-red-700"
          >Remove</button>
        </div>
      </div>
    `)
    .join("");
}

function showToast(message, _type) {
  toastMsg.textContent = message;
  toastEl.classList.remove("translate-x-full");
  setTimeout(() => toastEl.classList.add("translate-x-full"), 3000);
}

function generateStars(count = 100) {
  for (let i = 0; i < count; i++) {
    const star = document.createElement("div");
    const size = Math.random() * 2 + 1; // 1‑3px
    Object.assign(star.style, {
      width: `${size}px`,
      height: `${size}px`,
      background: "rgba(255,255,255,.8)",
      position: "absolute",
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      borderRadius: "50%",
      opacity: Math.random() * 0.8 + 0.2,
      animation: `twinkle ${Math.random() * 2 + 1}s infinite ease-in-out alternate`
    });
    starsContainer.appendChild(star);
  }
}
