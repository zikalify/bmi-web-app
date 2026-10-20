const Gender = {
  AVERAGE: 0,
  FEMALE: 1,
  MALE: 2
};

const calculate = {
  bmi(mass, height) {
    return mass / ((height / 100) ** 2);
  },

  bri(waist, height) {
    const bri = 1 - (waist / (Math.PI * height)) ** 2;
    if (bri <= 0) return null;
    return 364.2 - (365.5 * Math.sqrt(bri));
  },

  whr(waist, hip) {
    return hip > 0 ? waist / hip : null;
  },

  whtr(waist, height) {
    return height > 0 ? waist / height : null;
  },

  massFromBmiAndHeight(bmi, height) {
    return bmi * ((height / 100) ** 2);
  },

  whtrUnhealthy(age) {
    if (age > 50) return 0.6;
    if (age > 40) return ((age - 40) / 100) + 0.5;
    return 0.5;
  },

  whrOverweight(gender) {
    const thresholds = {
      [Gender.AVERAGE]: 0.85,
      [Gender.FEMALE]: 0.8,
      [Gender.MALE]: 0.9
    };
    return thresholds[gender] ?? thresholds[Gender.AVERAGE];
  },

  whrObese(gender) {
    const thresholds = {
      [Gender.AVERAGE]: 0.925,
      [Gender.FEMALE]: 0.85,
      [Gender.MALE]: 1.0
    };
    return thresholds[gender] ?? thresholds[Gender.AVERAGE];
  }
};

const conversions = {
  kgToLb(kg) { return kg * 2.2046226218; },
  lbToKg(lb) { return lb / 2.2046226218; },
  cmToIn(cm) { return cm / 2.54; },
  inToCm(inches) { return inches * 2.54; }
};

const bmiThresholds = [
  { text: 'Underweight [Severe]', value: 0, style: 'info' },
  { text: 'Underweight [Moderate]', value: 16, style: 'info' },
  { text: 'Underweight [Mild]', value: 17, style: 'info' },
  { text: 'Healthy', value: 18.5, style: 'success' },
  { text: 'Overweight', value: 25, style: 'warning' },
  { text: 'Obese [Class 1]', value: 30, style: 'error' },
  { text: 'Obese [Class 2]', value: 35, style: 'error' },
  { text: 'Obese [Class 3]', value: 40, style: 'error' }
];

const briThresholds = [
  { text: 'Very lean', value: 0, style: 'info' },
  { text: 'Lean', value: 3.41, style: 'success' },
  { text: 'Average', value: 4.45, style: 'success' },
  { text: 'Above average', value: 5.46, style: 'warning' },
  { text: 'High', value: 6.91, style: 'error' }
];

const whtrThresholds = (age) => [
  { text: 'Healthy', value: 0, style: 'success' },
  { text: 'Unhealthy', value: calculate.whtrUnhealthy(age), style: 'warning' }
];

const whrThresholds = (gender) => [
  { text: 'Healthy', value: 0, style: 'success' },
  { text: 'Overweight', value: calculate.whrOverweight(gender), style: 'warning' },
  { text: 'Obese', value: calculate.whrObese(gender), style: 'error' }
];

const metricConfigs = {
  bmi: {
    title: 'BMI',
    tooltip: 'Body Mass Index',
    digits: 1,
    calc: (inputs) => calculate.bmi(inputs.mass, inputs.height),
    thresholds: () => bmiThresholds,
    context: {
      description: 'With the same height, this is what weight you need to get different BMI thresholds',
      calc: (threshold, inputs) => calculate.massFromBmiAndHeight(threshold, inputs.height),
      thresholds: bmiThresholds
    }
  },
  bri: {
    title: 'BRI',
    tooltip: 'Body Roundness Index',
    digits: 2,
    calc: (inputs) => calculate.bri(inputs.waist, inputs.height),
    thresholds: () => briThresholds,
    context: null
  },
  whr: {
    title: 'Waist / Hip',
    tooltip: 'Waist to hip ratio',
    digits: 2,
    calc: (inputs) => calculate.whr(inputs.waist, inputs.hip),
    thresholds: (inputs) => whrThresholds(inputs.gender),
    context: null
  },
  whtr: {
    title: 'Waist / Height',
    tooltip: 'Waist to height ratio',
    digits: 2,
    calc: (inputs) => calculate.whtr(inputs.waist, inputs.height),
    thresholds: (inputs) => whtrThresholds(inputs.age),
    context: null
  }
};

const state = {
  inputs: {
    height: 170,
    mass: 70,
    gender: Gender.AVERAGE,
    age: 30,
    waist: 80,
    hip: 95
  },
  settings: {
    advancedMode: true,
    imperialUnits: false,
    rememberInputs: true
  }
};

const elements = {};

function initElements() {
  elements.height = document.getElementById('height');
  elements.weight = document.getElementById('weight');
  elements.gender = document.getElementById('gender');
  elements.age = document.getElementById('age');
  elements.waist = document.getElementById('waist');
  elements.hip = document.getElementById('hip');
  elements.heightUnit = document.getElementById('heightUnit');
  elements.weightUnit = document.getElementById('weightUnit');
  elements.waistUnit = document.getElementById('waistUnit');
  elements.hipUnit = document.getElementById('hipUnit');
  elements.advancedInputs = document.getElementById('advancedInputs');
  elements.resultsGrid = document.getElementById('resultsGrid');
  elements.toastContainer = document.getElementById('toastContainer');
  elements.menuBtn = document.getElementById('menuBtn');
  elements.menuDropdown = document.getElementById('menuDropdown');
  elements.preferencesBtn = document.getElementById('preferencesBtn');
  elements.aboutBtn = document.getElementById('aboutBtn');
  elements.preferencesDialog = document.getElementById('preferencesDialog');
  elements.aboutDialog = document.getElementById('aboutDialog');
  elements.closePreferences = document.getElementById('closePreferences');
  elements.closeAbout = document.getElementById('closeAbout');
  elements.advancedMode = document.getElementById('advancedMode');
  elements.imperialUnits = document.getElementById('imperialUnits');
  elements.rememberInputs = document.getElementById('rememberInputs');
  elements.infoModal = document.getElementById('infoModal');
  elements.closeModal = document.getElementById('closeModal');
  elements.modalTitle = document.getElementById('modalTitle');
  elements.modalBody = document.getElementById('modalBody');

  Object.keys(metricConfigs).forEach(metric => {
    elements[`${metric}Value`] = document.getElementById(`${metric}Value`);
    elements[`${metric}Feedback`] = document.getElementById(`${metric}Feedback`);
    elements[`${metric}Card`] = document.querySelector(`[data-metric="${metric}"]`);
  });
}

function loadSettings() {
  try {
    const saved = localStorage.getItem('bmi-settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      state.settings = { ...state.settings, ...parsed };
    }
    const savedInputs = localStorage.getItem('bmi-inputs');
    if (savedInputs && state.settings.rememberInputs) {
      const parsed = JSON.parse(savedInputs);
      state.inputs = { ...state.inputs, ...parsed };
    }
  } catch (e) {
    console.warn('Failed to load settings:', e);
  }
}

function saveSettings() {
  try {
    localStorage.setItem('bmi-settings', JSON.stringify(state.settings));
    if (state.settings.rememberInputs) {
      localStorage.setItem('bmi-inputs', JSON.stringify(state.inputs));
    } else {
      localStorage.removeItem('bmi-inputs');
    }
  } catch (e) {
    console.warn('Failed to save settings:', e);
  }
}

function updateUnits() {
  const imperial = state.settings.imperialUnits;
  elements.heightUnit.textContent = imperial ? 'in' : 'cm';
  elements.weightUnit.textContent = imperial ? 'lb' : 'kg';
  elements.waistUnit.textContent = imperial ? 'in' : 'cm';
  elements.hipUnit.textContent = imperial ? 'in' : 'cm';

  const heightVal = state.inputs.height;
  const weightVal = state.inputs.mass;
  const waistVal = state.inputs.waist;
  const hipVal = state.inputs.hip;

  if (imperial) {
    elements.height.value = Math.round(conversions.cmToIn(heightVal) * 10) / 10;
    elements.weight.value = Math.round(conversions.kgToLb(weightVal) * 10) / 10;
    elements.waist.value = Math.round(conversions.cmToIn(waistVal) * 10) / 10;
    elements.hip.value = Math.round(conversions.cmToIn(hipVal) * 10) / 10;
  } else {
    elements.height.value = heightVal;
    elements.weight.value = weightVal;
    elements.waist.value = waistVal;
    elements.hip.value = hipVal;
  }
}

function getInputsFromUI() {
  const imperial = state.settings.imperialUnits;
  const height = parseFloat(elements.height.value) || 0;
  const weight = parseFloat(elements.weight.value) || 0;
  const waist = parseFloat(elements.waist.value) || 0;
  const hip = parseFloat(elements.hip.value) || 0;

  return {
    height: imperial ? conversions.inToCm(height) : height,
    mass: imperial ? conversions.lbToKg(weight) : weight,
    gender: parseInt(elements.gender.value) || Gender.AVERAGE,
    age: parseInt(elements.age.value) || 30,
    waist: imperial ? conversions.inToCm(waist) : waist,
    hip: imperial ? conversions.inToCm(hip) : hip
  };
}

function updateInputsFromState() {
  const imperial = state.settings.imperialUnits;
  elements.height.value = imperial ? Math.round(conversions.cmToIn(state.inputs.height) * 10) / 10 : state.inputs.height;
  elements.weight.value = imperial ? Math.round(conversions.kgToLb(state.inputs.mass) * 10) / 10 : state.inputs.mass;
  elements.gender.value = state.inputs.gender;
  elements.age.value = state.inputs.age;
  elements.waist.value = imperial ? Math.round(conversions.cmToIn(state.inputs.waist) * 10) / 10 : state.inputs.waist;
  elements.hip.value = imperial ? Math.round(conversions.cmToIn(state.inputs.hip) * 10) / 10 : state.inputs.hip;
}

function calculateResults(inputs) {
  const results = {};
  Object.entries(metricConfigs).forEach(([key, config]) => {
    const value = config.calc(inputs);
    const thresholds = config.thresholds(inputs);
    results[key] = { value, thresholds, config };
  });
  return results;
}

function getFeedbackClass(style) {
  return style;
}

function findThreshold(result, thresholds) {
  const sorted = [...thresholds].sort((a, b) => a.value - b.value);
  for (let i = sorted.length - 1; i >= 0; i--) {
    if (result >= sorted[i].value) {
      return sorted[i];
    }
  }
  return sorted[0];
}

function updateResults() {
  const inputs = getInputsFromUI();
  state.inputs = inputs;

  if (state.settings.rememberInputs) {
    saveSettings();
  }

  const results = calculateResults(inputs);

  Object.entries(results).forEach(([key, { value, thresholds, config }]) => {
    const card = elements[`${key}Card`];
    const valueEl = elements[`${key}Value`];
    const feedbackEl = elements[`${key}Feedback`];

    if (value === null || value === undefined || isNaN(value)) {
      valueEl.textContent = '—';
      feedbackEl.textContent = key === 'bmi' ? 'Enter your height and weight' : 'Enter advanced inputs';
      feedbackEl.className = 'result-feedback';
      card.hidden = key !== 'bmi';
      return;
    }

    card.hidden = false;
    valueEl.textContent = value.toFixed(config.digits);
    const matched = findThreshold(value, thresholds);
    feedbackEl.textContent = matched.text;
    feedbackEl.className = `result-feedback ${matched.style}`;
  });

  updateAdvancedVisibility();
}

function updateAdvancedVisibility() {
  const showAdvanced = state.settings.advancedMode;
  elements.advancedInputs.hidden = !showAdvanced;

  ['bri', 'whr', 'whtr'].forEach(key => {
    const card = elements[`${key}Card`];
    if (card) card.hidden = !showAdvanced;
  });
}

function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  elements.toastContainer.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'slideIn 0.3s ease reverse';
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}

function copyResult(metric) {
  const valueEl = elements[`${metric}Value`];
  const text = valueEl.textContent;
  if (text !== '—') {
    navigator.clipboard.writeText(text).then(() => {
      showToast('Result copied');
    });
  }
}

function showInfoModal(metric) {
  const config = metricConfigs[metric];
  const inputs = getInputsFromUI();
  const results = calculateResults(inputs);
  const { value, thresholds } = results[metric];

  elements.modalTitle.textContent = config.title;
  elements.modalBody.innerHTML = '';

  const resultDiv = document.createElement('div');
  resultDiv.className = 'modal-result';
  resultDiv.innerHTML = `
    <div style="font-size: 2.5rem; font-weight: 700; text-align: center; margin-bottom: 8px;">${value?.toFixed(config.digits) ?? '—'}</div>
    <div style="text-align: center; color: var(--text-secondary); margin-bottom: 16px;">${config.tooltip}</div>
  `;
  elements.modalBody.appendChild(resultDiv);

  const thresholdsDiv = document.createElement('div');
  thresholdsDiv.className = 'thresholds-list';
  const sorted = [...thresholds].sort((a, b) => a.value - b.value);
  sorted.forEach((t, i) => {
    const prev = i > 0 ? sorted[i - 1].value : null;
    const next = i < sorted.length - 1 ? sorted[i + 1].value : null;
    let rangeText;
    if (prev === null) {
      rangeText = `Under ${next.toFixed(config.digits)}`;
    } else if (next === null) {
      rangeText = `Over ${t.value.toFixed(config.digits)}`;
    } else {
      rangeText = `${t.value.toFixed(config.digits)} - ${next.toFixed(config.digits)}`;
    }
    const row = document.createElement('div');
    row.className = `threshold-row ${t.style}`;
    row.innerHTML = `
      <span class="threshold-range">${rangeText}</span>
      <span class="threshold-label ${t.style}">${t.text}</span>
    `;
    thresholdsDiv.appendChild(row);
  });
  elements.modalBody.appendChild(thresholdsDiv);

  if (config.context) {
    const contextDiv = document.createElement('div');
    contextDiv.className = 'context-section';
    const contextInputs = { ...inputs };
    const contextThresholds = config.context.thresholds.map(t => ({
      ...t,
      value: config.context.calc(t.value, contextInputs)
    }));
    if (state.settings.imperialUnits) {
      contextThresholds.forEach(t => {
        t.value = conversions.kgToLb(t.value);
      });
    }
    contextDiv.innerHTML = `
      <h4>${config.context.description}</h4>
      <p class="context-description">${config.context.description}</p>
      <div class="thresholds-list">
        ${contextThresholds.map((t, i) => {
          const prev = i > 0 ? contextThresholds[i - 1].value : null;
          const next = i < contextThresholds.length - 1 ? contextThresholds[i + 1].value : null;
          const unit = state.settings.imperialUnits ? 'lb' : 'kg';
          let rangeText;
          if (prev === null) {
            rangeText = `Under ${next.toFixed(1)} ${unit}`;
          } else if (next === null) {
            rangeText = `Over ${t.value.toFixed(1)} ${unit}`;
          } else {
            rangeText = `${t.value.toFixed(1)} - ${next.toFixed(1)} ${unit}`;
          }
          return `
            <div class="threshold-row ${t.style}">
              <span class="threshold-range">${rangeText}</span>
              <span class="threshold-label ${t.style}">${t.text}</span>
            </div>
          `;
        }).join('')}
      </div>
    `;
    elements.modalBody.appendChild(contextDiv);
  }

  elements.infoModal.showModal();
}

function setupEventListeners() {
  [elements.height, elements.weight, elements.waist, elements.hip, elements.age, elements.gender].forEach(el => {
    el.addEventListener('input', updateResults);
    el.addEventListener('change', updateResults);
  });

  elements.menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    elements.menuDropdown.hidden = !elements.menuDropdown.hidden;
  });

  document.addEventListener('click', (e) => {
    if (!elements.menuBtn.contains(e.target) && !elements.menuDropdown.contains(e.target)) {
      elements.menuDropdown.hidden = true;
    }
  });

  elements.preferencesBtn.addEventListener('click', () => {
    elements.menuDropdown.hidden = true;
    elements.advancedMode.checked = state.settings.advancedMode;
    elements.imperialUnits.checked = state.settings.imperialUnits;
    elements.rememberInputs.checked = state.settings.rememberInputs;
    elements.preferencesDialog.showModal();
  });

  elements.aboutBtn.addEventListener('click', () => {
    elements.menuDropdown.hidden = true;
    elements.aboutDialog.showModal();
  });

  elements.closePreferences.addEventListener('click', () => elements.preferencesDialog.close());
  elements.closeAbout.addEventListener('click', () => elements.aboutDialog.close());

  elements.advancedMode.addEventListener('change', () => {
    state.settings.advancedMode = elements.advancedMode.checked;
    saveSettings();
    updateAdvancedVisibility();
    updateResults();
  });

  elements.imperialUnits.addEventListener('change', () => {
    state.settings.imperialUnits = elements.imperialUnits.checked;
    saveSettings();
    updateUnits();
    updateResults();
  });

  elements.rememberInputs.addEventListener('change', () => {
    state.settings.rememberInputs = elements.rememberInputs.checked;
    saveSettings();
  });

  elements.closeModal.addEventListener('click', () => elements.infoModal.close());
  elements.infoModal.addEventListener('click', (e) => {
    if (e.target === elements.infoModal) elements.infoModal.close();
  });

  Object.keys(metricConfigs).forEach(metric => {
    const card = elements[`${metric}Card`];
    if (card) {
      card.addEventListener('click', (e) => {
        if (!e.target.closest('.info-btn')) {
          copyResult(metric);
        }
      });
      const infoBtn = card.querySelector('.info-btn');
      if (infoBtn) {
        infoBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          showInfoModal(metric);
        });
      }
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      elements.infoModal.close();
      elements.preferencesDialog.close();
      elements.aboutDialog.close();
      elements.menuDropdown.hidden = true;
    }
    if ((e.ctrlKey || e.metaKey) && e.key === ',') {
      e.preventDefault();
      elements.preferencesBtn.click();
    }
    if (e.key === 'F1') {
      e.preventDefault();
      elements.aboutBtn.click();
    }
  });
}

function init() {
  initElements();
  loadSettings();
  updateInputsFromState();
  updateUnits();
  updateAdvancedVisibility();
  setupEventListeners();
  updateResults();
}

document.addEventListener('DOMContentLoaded', init);