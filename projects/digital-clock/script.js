// ==================== DOM ELEMENTS ====================
const appContainer = document.getElementById("app-container");
const themeToggle = document.getElementById("theme-toggle");
const tabBtns = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");

// Clock
const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");
const periodEl = document.getElementById("period");
const periodDisplay = document.getElementById("period-display");
const dayNameEl = document.getElementById("day-name");
const fullDateEl = document.getElementById("full-date");
const timezoneEl = document.getElementById("timezone");
const formatToggle = document.getElementById("format-toggle");
const formatText = document.getElementById("format-text");
const fullscreenBtn = document.getElementById("fullscreen-btn");
const worldClockGrid = document.getElementById("world-clock-grid");
const addClockBtn = document.getElementById("add-clock-btn");

// Stopwatch
const swHours = document.getElementById("sw-hours");
const swMinutes = document.getElementById("sw-minutes");
const swSeconds = document.getElementById("sw-seconds");
const swMilliseconds = document.getElementById("sw-milliseconds");
const swStart = document.getElementById("sw-start");
const swPause = document.getElementById("sw-pause");
const swLap = document.getElementById("sw-lap");
const swReset = document.getElementById("sw-reset");
const lapsList = document.getElementById("laps-list");

// Timer
const timerSetup = document.getElementById("timer-setup");
const timerRunning = document.getElementById("timer-running");
const timerH = document.getElementById("timer-h");
const timerM = document.getElementById("timer-m");
const timerS = document.getElementById("timer-s");
const timerStartBtn = document.getElementById("timer-start-btn");
const timerDisplay = document.getElementById("timer-display");
const timerProgress = document.getElementById("timer-progress");
const timerPauseBtn = document.getElementById("timer-pause-btn");
const timerStopBtn = document.getElementById("timer-stop-btn");
const timerAddBtn = document.getElementById("timer-add-btn");
const presetBtns = document.querySelectorAll(".preset-btn");
const timerAdjustBtns = document.querySelectorAll(".timer-adjust");

// Alarm
const addAlarmBtn = document.getElementById("add-alarm-btn");
const alarmsList = document.getElementById("alarms-list");
const alarmModal = document.getElementById("alarm-modal");
const alarmModalTitle = document.getElementById("alarm-modal-title");
const alarmModalClose = document.getElementById("alarm-modal-close");
const alarmHour = document.getElementById("alarm-hour");
const alarmMinute = document.getElementById("alarm-minute");
const alarmLabel = document.getElementById("alarm-label");
const alarmSound = document.getElementById("alarm-sound");
const alarmCancel = document.getElementById("alarm-cancel");
const alarmSave = document.getElementById("alarm-save");
const dayBtns = document.querySelectorAll(".day-btn");
const periodBtns = document.querySelectorAll(".period-btn");
const timeAdjustBtns = document.querySelectorAll(".time-adjust-btn");
const alarmAlert = document.getElementById("alarm-alert");
const alarmAlertTime = document.getElementById("alarm-alert-time");
const alarmAlertLabel = document.getElementById("alarm-alert-label");
const alarmSnooze = document.getElementById("alarm-snooze");
const alarmDismiss = document.getElementById("alarm-dismiss");

// City Modal
const cityModal = document.getElementById("city-modal");
const cityModalClose = document.getElementById("city-modal-close");
const citySearch = document.getElementById("city-search");
const cityList = document.getElementById("city-list");

// Other
const alarmAudio = document.getElementById("alarm-audio");
const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toast-message");

// ==================== STATE ====================
let is24Hour = false;
let isFullscreen = false;

// Stopwatch
let swInterval = null;
let swTime = 0;
let swRunning = false;
let laps = [];

// Timer
let timerInterval = null;
let timerTotalSeconds = 0;
let timerRemainingSeconds = 0;
let timerPaused = false;

// Alarm
let alarms = [];
let editingAlarmId = null;
let selectedDays = [];
let selectedPeriod = "AM";
let activeAlarm = null;

// World clocks
let worldClocks = [];

// Cities
const cities = [
  { name: "New York", timezone: "America/New_York", offset: -5 },
  { name: "Los Angeles", timezone: "America/Los_Angeles", offset: -8 },
  { name: "Chicago", timezone: "America/Chicago", offset: -6 },
  { name: "London", timezone: "Europe/London", offset: 0 },
  { name: "Paris", timezone: "Europe/Paris", offset: 1 },
  { name: "Berlin", timezone: "Europe/Berlin", offset: 1 },
  { name: "Moscow", timezone: "Europe/Moscow", offset: 3 },
  { name: "Dubai", timezone: "Asia/Dubai", offset: 4 },
  { name: "Mumbai", timezone: "Asia/Kolkata", offset: 5.5 },
  { name: "Singapore", timezone: "Asia/Singapore", offset: 8 },
  { name: "Hong Kong", timezone: "Asia/Hong_Kong", offset: 8 },
  { name: "Tokyo", timezone: "Asia/Tokyo", offset: 9 },
  { name: "Sydney", timezone: "Australia/Sydney", offset: 11 },
  { name: "Auckland", timezone: "Pacific/Auckland", offset: 12 },
];

// ==================== INIT ====================
function init() {
  loadSettings();
  loadAlarms();
  loadWorldClocks();
  updateClock();
  setInterval(updateClock, 1000);
  setInterval(checkAlarms, 1000);
  setupEventListeners();
  renderAlarms();
  renderWorldClocks();
  renderCityList();
}

function setupEventListeners() {
  // Theme
  if (themeToggle) themeToggle.addEventListener("click", toggleTheme);

  // Tabs
  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => switchTab(btn.dataset.tab));
  });

  // Clock
  if (formatToggle) formatToggle.addEventListener("click", toggleFormat);
  if (fullscreenBtn) fullscreenBtn.addEventListener("click", toggleFullscreen);
  if (addClockBtn) addClockBtn.addEventListener("click", openCityModal);

  // Stopwatch
  if (swStart) swStart.addEventListener("click", startStopwatch);
  if (swPause) swPause.addEventListener("click", pauseStopwatch);
  if (swLap) swLap.addEventListener("click", recordLap);
  if (swReset) swReset.addEventListener("click", resetStopwatch);

  // Timer
  if (timerStartBtn) timerStartBtn.addEventListener("click", startTimer);
  if (timerPauseBtn) timerPauseBtn.addEventListener("click", toggleTimerPause);
  if (timerStopBtn) timerStopBtn.addEventListener("click", stopTimer);
  if (timerAddBtn) timerAddBtn.addEventListener("click", addTimerMinute);

  presetBtns.forEach((btn) => {
    btn.addEventListener("click", () =>
      setTimerPreset(parseInt(btn.dataset.time))
    );
  });

  timerAdjustBtns.forEach((btn) => {
    btn.addEventListener("click", () =>
      adjustInput(btn.dataset.target, btn.dataset.action)
    );
  });

  // Alarm Modal
  if (addAlarmBtn)
    addAlarmBtn.addEventListener("click", () => openAlarmModal());
  if (alarmModalClose)
    alarmModalClose.addEventListener("click", closeAlarmModal);
  if (alarmCancel) alarmCancel.addEventListener("click", closeAlarmModal);
  if (alarmSave) alarmSave.addEventListener("click", saveAlarm);

  // Alarm time adjusters
  timeAdjustBtns.forEach((btn) => {
    btn.addEventListener("click", () =>
      adjustInput(btn.dataset.target, btn.dataset.action)
    );
  });

  // Period buttons
  periodBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      periodBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      selectedPeriod = btn.dataset.period;
    });
  });

  // Day buttons
  dayBtns.forEach((btn) => {
    btn.addEventListener("click", () => toggleDay(parseInt(btn.dataset.day)));
  });

  // Alarm alert
  if (alarmSnooze) alarmSnooze.addEventListener("click", snoozeAlarm);
  if (alarmDismiss) alarmDismiss.addEventListener("click", dismissAlarm);

  // City modal
  if (cityModalClose) cityModalClose.addEventListener("click", closeCityModal);
  if (citySearch) citySearch.addEventListener("input", filterCities);

  // Click outside modal to close
  if (alarmModal) {
    alarmModal.addEventListener("click", (e) => {
      if (e.target === alarmModal) closeAlarmModal();
    });
  }
  if (cityModal) {
    cityModal.addEventListener("click", (e) => {
      if (e.target === cityModal) closeCityModal();
    });
  }

  // Keyboard
  document.addEventListener("keydown", handleKeydown);

  // Escape fullscreen on Escape key
  document.addEventListener("fullscreenchange", () => {
    if (!document.fullscreenElement && isFullscreen) {
      isFullscreen = false;
      appContainer.classList.remove("fullscreen");
    }
  });
}

// ==================== THEME ====================
function toggleTheme() {
  const isDark = document.body.hasAttribute("data-theme");
  if (isDark) {
    document.body.removeAttribute("data-theme");
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
  } else {
    document.body.setAttribute("data-theme", "dark");
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
  }
  saveSettings();
}

// ==================== TABS ====================
function switchTab(tabId) {
  tabBtns.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.tab === tabId);
  });
  tabContents.forEach((content) => {
    content.classList.toggle("active", content.id === `${tabId}-tab`);
  });
}

// ==================== CLOCK ====================
function updateClock() {
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  if (!is24Hour) {
    const period = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    if (periodEl) periodEl.textContent = period;
    if (periodDisplay) periodDisplay.classList.remove("hidden");
  } else {
    if (periodDisplay) periodDisplay.classList.add("hidden");
  }

  if (hoursEl) hoursEl.textContent = padZero(hours);
  if (minutesEl) minutesEl.textContent = padZero(minutes);
  if (secondsEl) secondsEl.textContent = padZero(seconds);

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  if (dayNameEl) dayNameEl.textContent = days[now.getDay()];
  if (fullDateEl)
    fullDateEl.textContent = `${
      months[now.getMonth()]
    } ${now.getDate()}, ${now.getFullYear()}`;

  const offset = -now.getTimezoneOffset();
  const offsetHours = Math.floor(Math.abs(offset) / 60);
  const offsetMinutes = Math.abs(offset) % 60;
  const offsetSign = offset >= 0 ? "+" : "-";
  if (timezoneEl)
    timezoneEl.textContent = `UTC${offsetSign}${padZero(offsetHours)}:${padZero(
      offsetMinutes
    )}`;

  updateWorldClocks();
}

function toggleFormat() {
  is24Hour = !is24Hour;
  if (formatText) formatText.textContent = is24Hour ? "24 Hour" : "12 Hour";
  saveSettings();
  updateClock();
}

function toggleFullscreen() {
  isFullscreen = !isFullscreen;
  appContainer.classList.toggle("fullscreen", isFullscreen);

  if (isFullscreen) {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    }
  } else {
    if (document.exitFullscreen && document.fullscreenElement) {
      document.exitFullscreen();
    }
  }
}

// ==================== WORLD CLOCKS ====================
function renderWorldClocks() {
  if (!worldClockGrid) return;
  worldClockGrid.innerHTML = "";

  worldClocks.forEach((clock) => {
    const item = document.createElement("div");
    item.className = "world-clock-item";
    item.innerHTML = `
            <div class="world-clock-info">
                <span class="world-clock-city">${clock.name}</span>
                <span class="world-clock-diff" data-offset="${clock.offset}"></span>
            </div>
            <div class="world-clock-time">
                <span data-timezone="${clock.timezone}">--:--</span>
                <button class="world-clock-delete" data-city="${clock.name}">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
    worldClockGrid.appendChild(item);
  });

  document.querySelectorAll(".world-clock-delete").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      removeWorldClock(btn.dataset.city);
    });
  });

  updateWorldClocks();
}

function updateWorldClocks() {
  const now = new Date();
  const localOffset = -now.getTimezoneOffset() / 60;

  document
    .querySelectorAll(".world-clock-time span[data-timezone]")
    .forEach((el) => {
      const timezone = el.dataset.timezone;
      try {
        const time = new Date().toLocaleTimeString("en-US", {
          timeZone: timezone,
          hour: "2-digit",
          minute: "2-digit",
          hour12: !is24Hour,
        });
        el.textContent = time;
      } catch (e) {
        el.textContent = "--:--";
      }
    });

  document.querySelectorAll(".world-clock-diff").forEach((el) => {
    const offset = parseFloat(el.dataset.offset);
    const diff = offset - localOffset;
    const diffStr = diff >= 0 ? `+${diff}h` : `${diff}h`;
    el.textContent = diff === 0 ? "Same time" : diffStr;
  });
}

function openCityModal() {
  if (cityModal) {
    cityModal.classList.remove("hidden");
    if (citySearch) citySearch.value = "";
    renderCityList();
  }
}

function closeCityModal() {
  if (cityModal) cityModal.classList.add("hidden");
}

function renderCityList(filter = "") {
  if (!cityList) return;

  const filtered = cities.filter(
    (city) =>
      city.name.toLowerCase().includes(filter.toLowerCase()) &&
      !worldClocks.some((wc) => wc.name === city.name)
  );

  cityList.innerHTML = "";
  filtered.forEach((city) => {
    const item = document.createElement("div");
    item.className = "city-item";
    item.innerHTML = `
            <span class="city-name">${city.name}</span>
            <span class="city-offset">UTC${city.offset >= 0 ? "+" : ""}${
      city.offset
    }</span>
        `;
    item.addEventListener("click", () => addWorldClock(city));
    cityList.appendChild(item);
  });

  if (filtered.length === 0) {
    cityList.innerHTML =
      '<p style="text-align: center; color: var(--text-muted); padding: 20px;">No cities found</p>';
  }
}

function filterCities() {
  renderCityList(citySearch ? citySearch.value : "");
}

function addWorldClock(city) {
  worldClocks.push(city);
  saveWorldClocks();
  renderWorldClocks();
  closeCityModal();
  showToast(`${city.name} added!`);
}

function removeWorldClock(cityName) {
  worldClocks = worldClocks.filter((c) => c.name !== cityName);
  saveWorldClocks();
  renderWorldClocks();
}

// ==================== STOPWATCH ====================
function startStopwatch() {
  swRunning = true;
  if (swStart) swStart.classList.add("hidden");
  if (swPause) swPause.classList.remove("hidden");
  if (swLap) swLap.disabled = false;
  if (swReset) swReset.disabled = false;

  const startTime = Date.now() - swTime;
  swInterval = setInterval(() => {
    swTime = Date.now() - startTime;
    updateStopwatchDisplay();
  }, 10);
}

function pauseStopwatch() {
  swRunning = false;
  if (swStart) swStart.classList.remove("hidden");
  if (swPause) swPause.classList.add("hidden");
  clearInterval(swInterval);
}

function resetStopwatch() {
  pauseStopwatch();
  swTime = 0;
  laps = [];
  if (swLap) swLap.disabled = true;
  if (swReset) swReset.disabled = true;
  updateStopwatchDisplay();
  if (lapsList) lapsList.innerHTML = '<p class="no-laps">No laps recorded</p>';
}

function recordLap() {
  const lapTime = swTime;
  const lapNumber = laps.length + 1;
  const prevLapTime = laps.length > 0 ? laps[laps.length - 1].time : 0;
  const diff = lapTime - prevLapTime;
  laps.push({ number: lapNumber, time: lapTime, diff: diff });
  renderLaps();
}

function renderLaps() {
  if (!lapsList) return;

  if (laps.length === 0) {
    lapsList.innerHTML = '<p class="no-laps">No laps recorded</p>';
    return;
  }

  const diffs = laps.map((l) => l.diff);
  const minDiff = Math.min(...diffs);
  const maxDiff = Math.max(...diffs);

  lapsList.innerHTML = "";
  [...laps].reverse().forEach((lap) => {
    const item = document.createElement("div");
    item.className = "lap-item";
    if (laps.length > 1) {
      if (lap.diff === minDiff) item.classList.add("best");
      if (lap.diff === maxDiff) item.classList.add("worst");
    }
    item.innerHTML = `
            <span class="lap-number">Lap ${lap.number}</span>
            <span class="lap-diff">+${formatTime(lap.diff)}</span>
            <span class="lap-time">${formatTime(lap.time)}</span>
        `;
    lapsList.appendChild(item);
  });
}

function updateStopwatchDisplay() {
  const hours = Math.floor(swTime / 3600000);
  const minutes = Math.floor((swTime % 3600000) / 60000);
  const seconds = Math.floor((swTime % 60000) / 1000);
  const milliseconds = Math.floor((swTime % 1000) / 10);

  if (swHours) swHours.textContent = padZero(hours);
  if (swMinutes) swMinutes.textContent = padZero(minutes);
  if (swSeconds) swSeconds.textContent = padZero(seconds);
  if (swMilliseconds) swMilliseconds.textContent = padZero(milliseconds);
}

function formatTime(ms) {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const milliseconds = Math.floor((ms % 1000) / 10);
  return `${padZero(minutes)}:${padZero(seconds)}.${padZero(milliseconds)}`;
}

// ==================== TIMER ====================
function startTimer() {
  const hours = parseInt(timerH.value) || 0;
  const minutes = parseInt(timerM.value) || 0;
  const seconds = parseInt(timerS.value) || 0;

  timerTotalSeconds = hours * 3600 + minutes * 60 + seconds;
  if (timerTotalSeconds <= 0) {
    showToast("Please set a time");
    return;
  }

  timerRemainingSeconds = timerTotalSeconds;
  timerPaused = false;

  if (timerSetup) timerSetup.classList.add("hidden");
  if (timerRunning) timerRunning.classList.remove("hidden");

  updateTimerDisplay();
  runTimer();
}

function runTimer() {
  timerInterval = setInterval(() => {
    if (!timerPaused) {
      timerRemainingSeconds--;
      updateTimerDisplay();
      if (timerRemainingSeconds <= 0) {
        timerComplete();
      }
    }
  }, 1000);
}

function updateTimerDisplay() {
  const hours = Math.floor(timerRemainingSeconds / 3600);
  const minutes = Math.floor((timerRemainingSeconds % 3600) / 60);
  const seconds = timerRemainingSeconds % 60;

  if (timerDisplay)
    timerDisplay.textContent = `${padZero(hours)}:${padZero(minutes)}:${padZero(
      seconds
    )}`;

  if (timerProgress) {
    const progress = timerRemainingSeconds / timerTotalSeconds;
    const circumference = 2 * Math.PI * 45;
    const offset = circumference * (1 - progress);
    timerProgress.style.strokeDashoffset = offset;

    timerProgress.classList.remove("warning", "danger");
    if (progress <= 0.1) {
      timerProgress.classList.add("danger");
    } else if (progress <= 0.25) {
      timerProgress.classList.add("warning");
    }
  }
}

function toggleTimerPause() {
  timerPaused = !timerPaused;
  if (timerPauseBtn) {
    timerPauseBtn.innerHTML = timerPaused
      ? '<i class="fas fa-play"></i>'
      : '<i class="fas fa-pause"></i>';
  }
}

function stopTimer() {
  clearInterval(timerInterval);
  if (timerRunning) timerRunning.classList.add("hidden");
  if (timerSetup) timerSetup.classList.remove("hidden");
  if (timerProgress) timerProgress.style.strokeDashoffset = 0;
}

function addTimerMinute() {
  timerRemainingSeconds += 60;
  timerTotalSeconds += 60;
  updateTimerDisplay();
}

function timerComplete() {
  clearInterval(timerInterval);
  playAlarmSound();
  if (alarmAlertTime) alarmAlertTime.textContent = "Timer";
  if (alarmAlertLabel) alarmAlertLabel.textContent = "Time's up!";
  if (alarmAlert) alarmAlert.classList.remove("hidden");
  activeAlarm = { type: "timer" };
}

function setTimerPreset(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (timerH) timerH.value = hours;
  if (timerM) timerM.value = minutes;
  if (timerS) timerS.value = secs;
}

function adjustInput(targetId, action) {
  const input = document.getElementById(targetId);
  if (!input) return;

  let value = parseInt(input.value) || 0;
  const max = parseInt(input.max) || 59;
  const min = parseInt(input.min) || 0;

  if (action === "increase") {
    value = value >= max ? min : value + 1;
  } else {
    value = value <= min ? max : value - 1;
  }

  input.value = value;
}

// ==================== ALARM ====================
function openAlarmModal(alarmId = null) {
  editingAlarmId = alarmId;
  selectedDays = [];
  selectedPeriod = "AM";

  if (alarmId) {
    const alarm = alarms.find((a) => a.id === alarmId);
    if (alarm) {
      if (alarmModalTitle) alarmModalTitle.textContent = "Edit Alarm";
      if (alarmHour) alarmHour.value = alarm.hour;
      if (alarmMinute) alarmMinute.value = padZero(alarm.minute);
      selectedPeriod = alarm.period;
      if (alarmLabel) alarmLabel.value = alarm.label || "";
      if (alarmSound) alarmSound.value = alarm.sound || "classic";
      selectedDays = [...(alarm.days || [])];
    }
  } else {
    if (alarmModalTitle) alarmModalTitle.textContent = "Add Alarm";
    if (alarmHour) alarmHour.value = 7;
    if (alarmMinute) alarmMinute.value = "00";
    if (alarmLabel) alarmLabel.value = "";
    if (alarmSound) alarmSound.value = "classic";
  }

  // Update period buttons
  periodBtns.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.period === selectedPeriod);
  });

  updateDayButtons();

  if (alarmModal) alarmModal.classList.remove("hidden");
}

function closeAlarmModal() {
  if (alarmModal) alarmModal.classList.add("hidden");
  editingAlarmId = null;
}

function toggleDay(day) {
  const index = selectedDays.indexOf(day);
  if (index > -1) {
    selectedDays.splice(index, 1);
  } else {
    selectedDays.push(day);
  }
  updateDayButtons();
}

function updateDayButtons() {
  dayBtns.forEach((btn) => {
    const day = parseInt(btn.dataset.day);
    btn.classList.toggle("active", selectedDays.includes(day));
  });
}

function saveAlarm() {
  const hour = parseInt(alarmHour ? alarmHour.value : 7);
  const minute = parseInt(alarmMinute ? alarmMinute.value : 0);

  // Validation
  if (isNaN(hour) || hour < 1 || hour > 12) {
    showToast("Please enter a valid hour (1-12)");
    return;
  }
  if (isNaN(minute) || minute < 0 || minute > 59) {
    showToast("Please enter a valid minute (0-59)");
    return;
  }

  const alarm = {
    id: editingAlarmId || Date.now(),
    hour: hour,
    minute: minute,
    period: selectedPeriod,
    label: alarmLabel ? alarmLabel.value.trim() : "",
    sound: alarmSound ? alarmSound.value : "classic",
    days: [...selectedDays],
    enabled: true,
  };

  if (editingAlarmId) {
    const index = alarms.findIndex((a) => a.id === editingAlarmId);
    if (index > -1) {
      alarms[index] = alarm;
    }
  } else {
    alarms.push(alarm);
  }

  saveAlarms();
  renderAlarms();
  closeAlarmModal();
  showToast(editingAlarmId ? "Alarm updated!" : "Alarm set!");
}

function renderAlarms() {
  if (!alarmsList) return;

  if (alarms.length === 0) {
    alarmsList.innerHTML = `
            <div class="no-alarms">
                <i class="fas fa-bell-slash"></i>
                <p>No alarms set</p>
                <span>Tap + to add an alarm</span>
            </div>
        `;
    return;
  }

  const dayNames = ["S", "M", "T", "W", "T", "F", "S"];

  alarmsList.innerHTML = "";
  alarms.forEach((alarm) => {
    const item = document.createElement("div");
    item.className = `alarm-item ${!alarm.enabled ? "disabled" : ""}`;

    const daysText =
      alarm.days.length === 0
        ? "Once"
        : alarm.days.length === 7
        ? "Every day"
        : alarm.days.map((d) => dayNames[d]).join(" ");

    item.innerHTML = `
            <div class="alarm-info">
                <div class="alarm-time-text">
                    ${alarm.hour}:${padZero(alarm.minute)}
                    <span class="alarm-period">${alarm.period}</span>
                </div>
                <div class="alarm-details">
                    <span class="alarm-label-text">${
                      alarm.label || "Alarm"
                    }</span>
                    <span class="alarm-days-preview">${daysText}</span>
                </div>
            </div>
            <div class="alarm-actions">
                <label class="toggle-switch">
                    <input type="checkbox" ${alarm.enabled ? "checked" : ""}>
                    <span class="toggle-slider"></span>
                </label>
                <button class="alarm-delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;

    // Event listeners
    const info = item.querySelector(".alarm-info");
    if (info) {
      info.addEventListener("click", () => openAlarmModal(alarm.id));
    }

    const toggle = item.querySelector('input[type="checkbox"]');
    if (toggle) {
      toggle.addEventListener("change", () => toggleAlarmEnabled(alarm.id));
    }

    const deleteBtn = item.querySelector(".alarm-delete");
    if (deleteBtn) {
      deleteBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        deleteAlarm(alarm.id);
      });
    }

    alarmsList.appendChild(item);
  });
}

function toggleAlarmEnabled(alarmId) {
  const alarm = alarms.find((a) => a.id === alarmId);
  if (alarm) {
    alarm.enabled = !alarm.enabled;
    saveAlarms();
    renderAlarms();
  }
}

function deleteAlarm(alarmId) {
  alarms = alarms.filter((a) => a.id !== alarmId);
  saveAlarms();
  renderAlarms();
  showToast("Alarm deleted");
}

function checkAlarms() {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentSecond = now.getSeconds();
  const currentDay = now.getDay();

  alarms.forEach((alarm) => {
    if (!alarm.enabled) return;

    let alarmHour24 = alarm.hour;
    if (alarm.period === "PM" && alarm.hour !== 12) {
      alarmHour24 += 12;
    } else if (alarm.period === "AM" && alarm.hour === 12) {
      alarmHour24 = 0;
    }

    const shouldRing =
      alarmHour24 === currentHour &&
      alarm.minute === currentMinute &&
      currentSecond === 0 &&
      (alarm.days.length === 0 || alarm.days.includes(currentDay));

    if (shouldRing) {
      triggerAlarm(alarm);
    }
  });
}

function triggerAlarm(alarm) {
  activeAlarm = alarm;
  if (alarmAlertTime)
    alarmAlertTime.textContent = `${alarm.hour}:${padZero(alarm.minute)} ${
      alarm.period
    }`;
  if (alarmAlertLabel) alarmAlertLabel.textContent = alarm.label || "Alarm";
  if (alarmAlert) alarmAlert.classList.remove("hidden");
  playAlarmSound();

  if (alarm.days.length === 0) {
    alarm.enabled = false;
    saveAlarms();
    renderAlarms();
  }
}

function snoozeAlarm() {
  stopAlarmSound();
  if (alarmAlert) alarmAlert.classList.add("hidden");

  if (activeAlarm && activeAlarm.type !== "timer") {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 5);

    let snoozeHour = now.getHours();
    const snoozePeriod = snoozeHour >= 12 ? "PM" : "AM";
    snoozeHour = snoozeHour % 12 || 12;

    const snoozeAlarm = {
      id: Date.now(),
      hour: snoozeHour,
      minute: now.getMinutes(),
      period: snoozePeriod,
      label: `${activeAlarm.label || "Alarm"} (Snoozed)`,
      sound: activeAlarm.sound,
      days: [],
      enabled: true,
    };

    alarms.push(snoozeAlarm);
    saveAlarms();
    renderAlarms();
    showToast("Snoozed for 5 minutes");
  } else {
    timerTotalSeconds = 300;
    timerRemainingSeconds = 300;
    timerPaused = false;
    updateTimerDisplay();
    runTimer();
  }

  activeAlarm = null;
}

function dismissAlarm() {
  stopAlarmSound();
  if (alarmAlert) alarmAlert.classList.add("hidden");

  if (activeAlarm && activeAlarm.type === "timer") {
    stopTimer();
  }

  activeAlarm = null;
}

function playAlarmSound() {
  if (alarmAudio) {
    alarmAudio.currentTime = 0;
    alarmAudio.play().catch((e) => console.log("Audio play failed:", e));
  }
}

function stopAlarmSound() {
  if (alarmAudio) {
    alarmAudio.pause();
    alarmAudio.currentTime = 0;
  }
}

// ==================== UTILITIES ====================
function padZero(num) {
  return num.toString().padStart(2, "0");
}

function handleKeydown(e) {
  if (
    e.code === "Space" &&
    document.getElementById("stopwatch-tab").classList.contains("active")
  ) {
    e.preventDefault();
    if (swRunning) {
      pauseStopwatch();
    } else {
      startStopwatch();
    }
  }

  if (e.code === "Escape") {
    closeAlarmModal();
    closeCityModal();
    if (activeAlarm) dismissAlarm();
    if (isFullscreen) toggleFullscreen();
  }
}

function showToast(message) {
  if (!toast || !toastMessage) return;
  toastMessage.textContent = message;
  toast.classList.remove("hidden");
  setTimeout(() => toast.classList.add("hidden"), 3000);
}

// ==================== STORAGE ====================
function saveSettings() {
  try {
    const settings = {
      is24Hour,
      isDark: document.body.hasAttribute("data-theme"),
    };
    localStorage.setItem("clockSettings", JSON.stringify(settings));
  } catch (e) {
    console.warn("Could not save settings");
  }
}

function loadSettings() {
  try {
    const saved = localStorage.getItem("clockSettings");
    if (saved) {
      const settings = JSON.parse(saved);
      is24Hour = settings.is24Hour || false;
      if (settings.isDark) {
        document.body.setAttribute("data-theme", "dark");
        if (themeToggle) themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
      }
      if (formatText) formatText.textContent = is24Hour ? "24 Hour" : "12 Hour";
    }
  } catch (e) {
    console.warn("Could not load settings");
  }
}

function saveAlarms() {
  try {
    localStorage.setItem("clockAlarms", JSON.stringify(alarms));
  } catch (e) {
    console.warn("Could not save alarms");
  }
}

function loadAlarms() {
  try {
    const saved = localStorage.getItem("clockAlarms");
    if (saved) {
      alarms = JSON.parse(saved);
    }
  } catch (e) {
    console.warn("Could not load alarms");
    alarms = [];
  }
}

function saveWorldClocks() {
  try {
    localStorage.setItem("worldClocks", JSON.stringify(worldClocks));
  } catch (e) {
    console.warn("Could not save world clocks");
  }
}

function loadWorldClocks() {
  try {
    const saved = localStorage.getItem("worldClocks");
    if (saved) {
      worldClocks = JSON.parse(saved);
    }
  } catch (e) {
    console.warn("Could not load world clocks");
    worldClocks = [];
  }
}

// Initialize
init();
