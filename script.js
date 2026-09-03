(() => {
  "use strict";

  const ABSOLUTE_ZERO_C = -273.15;

  const form = document.getElementById("converterForm");
  const input = document.getElementById("tempValue");
  const inputError = document.getElementById("inputError");
  const edgeMessage = document.getElementById("edgeMessage");
  const results = document.getElementById("results");

  const outC = document.getElementById("outC");
  const outF = document.getElementById("outF");
  const outK = document.getElementById("outK");

  const tubeFill = document.getElementById("tubeFill");
  const tubeMarker = document.getElementById("tubeMarker");

  // A plain number, optionally negative, optionally decimal.
  // Rejects letters, symbols, multiple dots, empty strings, etc.
  const NUMERIC_PATTERN = /^-?\d+(\.\d+)?$/;

  const absoluteZero = { C: -273.15, F: -459.67, K: 0 };

  /* ----------------------------------------------------------
     Conversion — everything routes through Celsius as the hub.
     ---------------------------------------------------------- */
  function toCelsius(value, unit) {
    switch (unit) {
      case "C": return value;
      case "F": return (value - 32) * (5 / 9);
      case "K": return value - 273.15;
      default: throw new Error(`Unknown unit: ${unit}`);
    }
  }

  function fromCelsius(celsius) {
    return {
      C: celsius,
      F: celsius * (9 / 5) + 32,
      K: celsius + 273.15,
    };
  }

  function round(value) {
    return Math.round(value * 100) / 100;
  }

  /* ----------------------------------------------------------
     UI helpers
     ---------------------------------------------------------- */
  function getSelectedUnit() {
    return form.querySelector('input[name="unit"]:checked').value;
  }

  function clearError() {
    inputError.textContent = "";
    input.removeAttribute("aria-invalid");
  }

  function showError(message) {
    inputError.textContent = message;
    input.setAttribute("aria-invalid", "true");
  }

  function hideEdgeMessage() {
    edgeMessage.classList.remove("is-visible");
    edgeMessage.textContent = "";
  }

  function showEdgeMessage(message) {
    edgeMessage.textContent = message;
    edgeMessage.classList.add("is-visible");
  }

  function clearResults() {
    outC.textContent = "—";
    outF.textContent = "—";
    outK.textContent = "—";
    results.querySelectorAll(".result").forEach((el) => el.classList.remove("is-active"));
  }

  function renderResults(values, activeUnit) {
    outC.textContent = round(values.C).toFixed(2);
    outF.textContent = round(values.F).toFixed(2);
    outK.textContent = round(values.K).toFixed(2);

    results.querySelectorAll(".result").forEach((el) => {
      el.classList.toggle("is-active", el.dataset.unit === activeUnit);
    });
  }

  // Moves the readout dot along the tube. Scaled across a fixed
  // Celsius window so the marker has somewhere meaningful to sit
  // for both a cold winter day and a hot oven.
  function updateTube(celsius) {
    const min = -50;
    const max = 150;
    const clamped = Math.max(min, Math.min(max, celsius));
    const percent = ((clamped - min) / (max - min)) * 100;
    tubeFill.style.height = `${percent}%`;
    tubeMarker.style.bottom = `${percent}%`;
  }

  function resetTube() {
    tubeFill.style.height = "0%";
    tubeMarker.style.bottom = "0%";
  }

  /* ----------------------------------------------------------
     Main flow
     ---------------------------------------------------------- */
  function handleSubmit(event) {
    event.preventDefault();

    clearError();
    hideEdgeMessage();

    const raw = input.value.trim();
    const unit = getSelectedUnit();

    if (raw === "") {
      showError("Enter a temperature value to convert.");
      clearResults();
      resetTube();
      return;
    }

    if (!NUMERIC_PATTERN.test(raw)) {
      showError("That's not a valid number. Use digits only, like 21.5 or -40.");
      clearResults();
      resetTube();
      return;
    }

    const value = parseFloat(raw);
    const celsius = toCelsius(value, unit);

    if (celsius < ABSOLUTE_ZERO_C - 1e-9) {
      showEdgeMessage(
        `That's below absolute zero. The coldest a temperature can get is ` +
        `${absoluteZero[unit]}\u00B0${unit === "K" ? "" : unit} in the unit you chose ` +
        `(−273.15\u00B0C / −459.67\u00B0F / 0 K) — nothing colder is physically possible.`
      );
      clearResults();
      resetTube();
      return;
    }

    const values = fromCelsius(celsius);
    renderResults(values, unit);
    updateTube(celsius);
  }

  // Live preview on the tube while typing, without triggering
  // full validation messaging — the Convert button remains the
  // action that commits a result.
  function handleLiveInput() {
    if (inputError.textContent) clearError();
    if (edgeMessage.classList.contains("is-visible")) hideEdgeMessage();

    const raw = input.value.trim();
    if (!NUMERIC_PATTERN.test(raw)) return;

    const value = parseFloat(raw);
    const unit = getSelectedUnit();
    const celsius = toCelsius(value, unit);
    if (celsius >= ABSOLUTE_ZERO_C - 1e-9) {
      updateTube(celsius);
    }
  }

  form.addEventListener("submit", handleSubmit);
  input.addEventListener("input", handleLiveInput);
  form.querySelectorAll('input[name="unit"]').forEach((radio) => {
    radio.addEventListener("change", handleLiveInput);
  });
})();
