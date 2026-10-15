const billInput = document.getElementById("bill");
const peopleInput = document.getElementById("people");
const customTipInput = document.getElementById("customTip");
const tipAmountEl = document.getElementById("tipAmount");
const totalAmountEl = document.getElementById("totalAmount");
const perPersonEl = document.getElementById("perPerson");
const statusEl = document.getElementById("status");
const themeToggle = document.getElementById("themeToggle");
const chips = [...document.querySelectorAll(".chip")];

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

let tipPercent = 15;

function parseMoney(value) {
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

function parsePeople(value) {
  const n = Math.floor(Number(value));
  return Number.isFinite(n) && n >= 1 ? n : 1;
}

function setActiveChip(percent) {
  chips.forEach((chip) => {
    chip.classList.toggle("is-active", Number(chip.dataset.tip) === percent);
  });
}

function calculate() {
  const bill = parseMoney(billInput.value);
  const people = parsePeople(peopleInput.value);
  const custom = customTipInput.value.trim();
  const percent = custom === "" ? tipPercent : parseMoney(custom);

  const tip = bill * (percent / 100);
  const total = bill + tip;
  const each = total / people;

  tipAmountEl.textContent = money.format(tip);
  totalAmountEl.textContent = money.format(total);
  perPersonEl.textContent = money.format(each);
  statusEl.textContent =
    bill === 0
      ? "Enter a bill amount to see the split."
      : `${percent}% tip on ${money.format(bill)} split ${people} way${people === 1 ? "" : "s"}.`;
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const dark = theme === "dark";
  themeToggle.setAttribute("aria-pressed", String(dark));
  themeToggle.textContent = dark ? "Light mode" : "Dark mode";
  localStorage.setItem("splitfair-theme", theme);
}

chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    tipPercent = Number(chip.dataset.tip);
    customTipInput.value = "";
    setActiveChip(tipPercent);
    calculate();
  });
});

customTipInput.addEventListener("input", () => {
  if (customTipInput.value.trim() === "") {
    setActiveChip(tipPercent);
  } else {
    chips.forEach((chip) => chip.classList.remove("is-active"));
  }
  calculate();
});

billInput.addEventListener("input", calculate);
peopleInput.addEventListener("input", () => {
  peopleInput.value = String(parsePeople(peopleInput.value));
  calculate();
});

document.getElementById("minusPeople").addEventListener("click", () => {
  peopleInput.value = String(Math.max(1, parsePeople(peopleInput.value) - 1));
  calculate();
});

document.getElementById("plusPeople").addEventListener("click", () => {
  peopleInput.value = String(parsePeople(peopleInput.value) + 1);
  calculate();
});

themeToggle.addEventListener("click", () => {
  const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(next);
});

const savedTheme = localStorage.getItem("splitfair-theme") || "light";
applyTheme(savedTheme);
setActiveChip(tipPercent);
calculate();
