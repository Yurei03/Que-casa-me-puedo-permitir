
const PROVINCIAS = [
  "Albacete","Alicante / Alacant","Almería","Araba/Álava","Asturias","Ávila","Badajoz",
  "Balears, Illes","Barcelona","Bizkaia / Vizcaya","Burgos","Cáceres","Cádiz","Cantabria",
  "Castellón/Castelló","Ceuta","Ciudad Real","Córdoba","Coruña, A","Cuenca",
  "Gipuzkoa / Guipúzcoa","Girona","Granada","Guadalajara","Huelva","Huesca","Jaén",
  "León","Lleida / Lérida","Lugo","Madrid","Málaga","Melilla","Murcia","Navarra",
  "Ourense / orense","Palencia","Las Palmas","Pontevedra","La Rioja","Salamanca",
  "Santa Cruz de Tenerife","Segovia","Sevilla","Soria","Tarragona","Teruel","Toledo",
  "Valencia/València","Valladolid","Zamora","Zaragoza"
];


function parseSpanishNumber(str) {
  if (!str || typeof str !== 'string') return NaN;
  str = str.trim();
  if (!str) return NaN;
  const decimalPattern = /[,.](\d{1,2})$/;
  const match = str.match(decimalPattern);
  let integerPart = str;
  let decimalPart = '';
  if (match) {
    decimalPart = match[1];
    integerPart = str.slice(0, match.index);
  }
  integerPart = integerPart.replace(/[.,]/g, '');
  const normalized = decimalPart ? integerPart + '.' + decimalPart : integerPart;
  const num = parseFloat(normalized);
  return isNaN(num) ? NaN : num;
}

function formatCurrencyValue(value) {
  let num;
  if (typeof value === 'string') {
    num = parseSpanishNumber(value);
  } else {
    num = Number(value);
  }
  if (isNaN(num)) return '';
  const rounded = Math.round(num);
  const parts = rounded.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return parts[0];
}

function formatIntegerEuro(value) {
  let num = Number(value);
  if (isNaN(num)) num = 0;
  const parts = Math.round(num).toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return parts[0] + ' €';
}

function formatStandardEuro(value) {
  let num = Number(value);
  if (isNaN(num)) num = 0;
  const fixed = num.toFixed(2);
  const [intPart, decPart] = fixed.split('.');
  const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return formattedInt + ',' + decPart + ' €';
}

function setupCurrencyInput(inputEl) {
  if (!inputEl) return;
  inputEl.type = 'text';
  inputEl.removeAttribute('maxlength');
  const updateRaw = () => {
    let raw = inputEl.value;
    if (!raw.trim()) {
      inputEl.dataset.raw = '';
      return;
    }
    let num = parseSpanishNumber(raw);
    if (isNaN(num)) {
      inputEl.dataset.raw = '';
    } else {
      inputEl.dataset.raw = String(num);
    }
  };
  const formatDisplay = () => {
    if (!inputEl.value.trim()) {
      inputEl.value = '';
      return;
    }
    let num = parseSpanishNumber(inputEl.value);
    if (!isNaN(num)) {
      inputEl.value = formatCurrencyValue(num);
    }
  };
  inputEl.addEventListener('input', updateRaw);
  inputEl.addEventListener('blur', formatDisplay);
  if (inputEl.value) {
    let initialNum = parseSpanishNumber(inputEl.value);
    if (!isNaN(initialNum)) {
      inputEl.value = formatCurrencyValue(initialNum);
      inputEl.dataset.raw = String(initialNum);
    }
  }
}


const stepsData = [
  {
    title: "Donde quieres comprar",
    help: "Los gastos en impuestos derivados de la compraventa varian dependiendo de la provincia donde compres.",
    inputType: "select",
    name: "province",
    options: PROVINCIAS.map(p => ({ value: p, label: p })),
    default: "Madrid"
  },
  {
    title: "Vas a vivir alli",
    help: "Los criterios que aplican los bancos varian dependiendo del tipo de compra",
    inputType: "radio",
    name: "primaryResidence",
    options: [
      { value: "si", label: "Si, sera mi vivienda habitual" },
      { value: "no", label: "No, compro como inversion o segunda vivienda" }
    ],
    default: "si"
  },
  {
    title: "Cuantos ahorros puedes aportar",
    help: "Recuerda guardar una parte de tus ahorros si necesitas comprar muebles o realizar alguna reforma.",
    inputType: "savings",
    name: "savings",
    placeholder: "30000",
    default: ""
  },
  {
    title: "Situacion laboral",
    help: "Los bancos valoran positivamente la estabilidad laboral",
    inputType: "employment",
    name: "employmentStatus",
    contractName1: "contractType1",
    contractName2: "contractType2",
    options: [
      { value: "solo", label: "Compro solo" },
      { value: "con_alguien", label: "Compro con alguien" }
    ],
    contractOptions: [
      { value: "fijo", label: "Fijo" },
      { value: "temporal", label: "Temporal" },
      { value: "jubilado", label: "Jubilado/Pensionista" },
      { value: "funcionario", label: "Funcionario" },
      { value: "autonomo", label: "Autonomo" },
      { value: "rentista", label: "Rentista" },
      { value: "sin_actividad", label: "Sin actividad economica" },
      { value: "otro", label: "Otros" }
    ],
    default: "solo",
    defaultContract1: "fijo",
    defaultContract2: "fijo"
  },
  {
    title: "Cuales son tus ingresos mensuales",
    help: "Suma de todos los ingresos mensuales, incluyendo nominas, rentas por alquiler, etc.",
    inputType: "monthly_income",
    name: "monthlyIncome",
    placeholder: "2500",
    default: ""
  },
  {
    title: "Estas pagando otros prestamos",
    help: "Suma de gastos mensuales de otros prestamos (otras hipotecas, letra del coche...)",
    inputType: "other_loans",
    name: "hasOtherLoans",
    amountName: "otherLoansAmount",
    default: "no",
    defaultAmount: ""
  },
  {
    title: "Edad",
    help: "La edad determinara el plazo maximo para pagar la hipoteca.",
    inputType: "age_only",
    name: "age",
    placeholder: "35",
    default: ""
  },
  {
    title: "Revision y confirmacion",
    help: "Verifica que todos los datos sean correctos antes de finalizar.",
    inputType: "review_confirm",
    name: "agreement",
    default: false
  }
];

const TOTAL_STEPS = stepsData.length;
let currentStep = 0;
let userAnswers = {};

function h(tag, props = {}, ...children) {
  const el = document.createElement(tag);
  for (const [key, val] of Object.entries(props)) {
    if (key.startsWith('on') && typeof val === 'function') {
      el.addEventListener(key.substring(2).toLowerCase(), val);
    } else if (key === 'className') {
      el.className = val;
    } else if (key === 'style' && typeof val === 'object') {
      Object.assign(el.style, val);
    } else if (key === 'htmlFor') {
      el.setAttribute('for', val);
    } else if (key === 'value') {
      el.value = val;
    } else if (key === 'checked') {
      el.checked = val;
    } else {
      el.setAttribute(key, val);
    }
  }
  for (const child of children.flat(Infinity)) {
    if (child == null || child === false) continue;
    el.appendChild(typeof child === 'string' || typeof child === 'number' ? document.createTextNode(child) : child);
  }
  return el;
}


function renderAssistente() {
  const app = document.getElementById('app');
  app.innerHTML = '';

  const container = h('div', { className: 'widget' },
    h('div', { id: 'inicio' },
      h('div', { className: 'title-main' }, '¿Qué casa me puedo permitir?'),
      h('div', { className: 'subtitle-main' }, 'Simulador de capacidad de compra')
    ),
    h('div', { className: 'input-card' },
      h('div', { className: 'hr' }),
      h('div', { id: 'stepCounterText', className: 'step-badge' }, `Paso ${currentStep + 1} de ${TOTAL_STEPS}`),
      h('div', { id: 'dynamicStepContent' }),
      h('div', { className: 'button-container' },
        h('button', { id: 'prevBtn', className: 'calc-btn secondary' }, 'Anterior'),
        h('button', { id: 'nextBtn', className: 'calc-btn' }, currentStep === TOTAL_STEPS - 1 ? 'Finalizar' : 'Siguiente')
      )
    )
  );
  app.appendChild(container);

  renderCurrentStepContent();

  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  if (prevBtn) {
    if (currentStep === 0) prevBtn.disabled = true;
    else prevBtn.disabled = false;
  }

  const goNext = () => {
    saveCurrentStepInput();
    if (!validateCurrentStep()) return;
    if (currentStep === TOTAL_STEPS - 1) {
      saveCurrentStepInput();
      renderCalculadoraHipotecaria();
    } else {
      currentStep++;
      renderAssistente();
    }
  };

  const goPrev = () => {
    if (currentStep === 0) return;
    saveCurrentStepInput();
    currentStep--;
    renderAssistente();
  };

  if (prevBtn) {
    const newPrev = prevBtn.cloneNode(true);
    prevBtn.parentNode.replaceChild(newPrev, prevBtn);
    newPrev.addEventListener('click', goPrev);
  }
  if (nextBtn) {
    const newNext = nextBtn.cloneNode(true);
    nextBtn.parentNode.replaceChild(newNext, nextBtn);
    newNext.addEventListener('click', goNext);
  }
}

function saveCurrentStepInput() {
  const step = stepsData[currentStep];
  if (!step) return;
  const container = document.getElementById('dynamicStepContent');
  if (step.inputType === 'select') {
    const sel = container.querySelector('select');
    if (sel) userAnswers[step.name] = sel.value;
  } else if (step.inputType === 'radio') {
    const checked = container.querySelector('input[type="radio"]:checked');
    if (checked) userAnswers[step.name] = checked.value;
  } else if (step.inputType === 'savings') {
    const inp = container.querySelector('#savingsInput');
    if (inp) userAnswers[step.name] = inp.dataset.raw || '';
  } else if (step.inputType === 'monthly_income') {
    const inp = container.querySelector('#incomeInput');
    if (inp) userAnswers[step.name] = inp.dataset.raw || '';
  } else if (step.inputType === 'employment') {
    const checked = container.querySelector('input[name="employmentRadio"]:checked');
    if (checked) userAnswers[step.name] = checked.value;
    const c1 = container.querySelector('#contractSelect1');
    if (c1) userAnswers[step.contractName1] = c1.value;
    const c2 = container.querySelector('#contractSelect2');
    if (c2) userAnswers[step.contractName2] = c2.value;
  } else if (step.inputType === 'other_loans') {
    const checked = container.querySelector('input[name="loansRadio"]:checked');
    if (checked) userAnswers[step.name] = checked.value;
    const amt = container.querySelector('#loanAmountInput');
    if (amt) userAnswers[step.amountName] = amt.dataset.raw || '';
  } else if (step.inputType === 'age_only') {
    const inp = container.querySelector('#ageInput');
    if (inp) userAnswers[step.name] = inp.value;
  } else if (step.inputType === 'review_confirm') {
    const cb = container.querySelector('#confirmCheck');
    if (cb) userAnswers[step.name] = cb.checked;
  }
}

function renderCurrentStepContent() {
  const step = stepsData[currentStep];
  const contentDiv = document.getElementById('dynamicStepContent');
  contentDiv.innerHTML = '';
  contentDiv.appendChild(h('div', { style: 'font-size:1.6rem; font-weight:700; margin:0.5rem 0 0.2rem; color:#113f77;' }, step.title));
  if (step.help) contentDiv.appendChild(h('div', { className: 'help-note' }, 'i ' + step.help));
  const inputGroup = h('div', { className: 'input-group', style: 'margin:1rem 0;' });
  if (step.inputType === 'select') {
    const currentVal = userAnswers[step.name] || step.default;
    const select = h('select', { id: 'stepInput', className: 'numb', onChange: saveCurrentStepInput });
    step.options.forEach(opt => select.appendChild(h('option', { value: opt.value, selected: currentVal === opt.value }, opt.label)));
    inputGroup.appendChild(h('div', { className: 'input' }, select, h('span', { className: 'valor' }, '▼')));
  } else if (step.inputType === 'radio') {
    const currentVal = userAnswers[step.name] || step.default;
    const radioGroup = h('div', { className: 'radio-group' });
    step.options.forEach(opt => {
      const div = h('div', { className: 'radio-option', 'data-value': opt.value },
        h('input', { type: 'radio', name: 'stepRadio', id: `radio_${opt.value}`, value: opt.value, checked: currentVal === opt.value, onChange: saveCurrentStepInput }),
        h('label', { htmlFor: `radio_${opt.value}` }, opt.label)
      );
      div.addEventListener('click', () => {
        const radio = div.querySelector('input');
        if (radio && !radio.checked) {
          radio.checked = true;
          radio.dispatchEvent(new Event('change'));
          saveCurrentStepInput();
        }
      });
      radioGroup.appendChild(div);
    });
    inputGroup.appendChild(radioGroup);
  } else if (step.inputType === 'savings') {
    const rawVal = userAnswers.savings !== undefined ? userAnswers.savings : '';
    const wrapper = h('div', {});
    wrapper.appendChild(h('div', { className: 'ColorLabel' }, 'Ahorro aportado'));
    const inputDiv = h('div', { className: 'input' });
    const inputField = h('input', { type: 'text', id: 'savingsInput', className: 'numb', placeholder: step.placeholder || '30000', value: rawVal ? formatCurrencyValue(rawVal) : '', onInput: saveCurrentStepInput });
    inputDiv.appendChild(inputField); inputDiv.appendChild(h('span', { className: 'valor' }, '€')); wrapper.appendChild(inputDiv); inputGroup.appendChild(wrapper);
    setTimeout(() => setupCurrencyInput(inputField), 0);
  } else if (step.inputType === 'monthly_income') {
    const rawVal = userAnswers.monthlyIncome !== undefined ? userAnswers.monthlyIncome : '';
    const wrapper = h('div', {});
    wrapper.appendChild(h('div', { className: 'ColorLabel' }, 'Ingresos netos mensuales'));
    const inputDiv = h('div', { className: 'input' });
    const inputField = h('input', { type: 'text', id: 'incomeInput', className: 'numb', placeholder: step.placeholder || '2500', value: rawVal ? formatCurrencyValue(rawVal) : '', onInput: saveCurrentStepInput });
    inputDiv.appendChild(inputField); inputDiv.appendChild(h('span', { className: 'valor' }, '€/mes')); wrapper.appendChild(inputDiv); inputGroup.appendChild(wrapper);
    setTimeout(() => setupCurrencyInput(inputField), 0);
  } else if (step.inputType === 'employment') {
    const currentStatus = userAnswers.employmentStatus || step.default;
    const currentContract1 = userAnswers.contractType1 || step.defaultContract1;
    const currentContract2 = userAnswers.contractType2 || step.defaultContract2;
    const showSecond = currentStatus === 'con_alguien';
    const radioGroup = h('div', { className: 'radio-group', id: 'employmentRadioGroup' });
    step.options.forEach(opt => {
      const div = h('div', { className: 'radio-option', 'data-value': opt.value },
        h('input', { type: 'radio', name: 'employmentRadio', id: `emp_${opt.value}`, value: opt.value, checked: currentStatus === opt.value, onChange: (e) => { saveCurrentStepInput(); const secondDiv = document.getElementById('secondSolicitanteContainer'); if (secondDiv) secondDiv.style.display = e.target.value === 'con_alguien' ? 'block' : 'none'; } }),
        h('label', { htmlFor: `emp_${opt.value}` }, opt.label)
      );
      div.addEventListener('click', () => {
        const radio = div.querySelector('input');
        if (radio && !radio.checked) {
          radio.checked = true;
          radio.dispatchEvent(new Event('change'));
          saveCurrentStepInput();
          const secondDiv = document.getElementById('secondSolicitanteContainer');
          if (secondDiv) secondDiv.style.display = radio.value === 'con_alguien' ? 'block' : 'none';
        }
      });
      radioGroup.appendChild(div);
    });
    inputGroup.appendChild(radioGroup);
    const solicitante1 = h('div', { className: 'inline-select' }, h('div', { className: 'ColorLabel' }, 'Solicitante 1:'), h('div', { className: 'input' }, h('select', { id: 'contractSelect1', className: 'numb', onChange: saveCurrentStepInput }, ...step.contractOptions.map(opt => h('option', { value: opt.value, selected: currentContract1 === opt.value }, opt.label))), h('span', { className: 'valor' }, '▼')));
    inputGroup.appendChild(solicitante1);
    const secondContainer = h('div', { id: 'secondSolicitanteContainer', style: `display:${showSecond ? 'block' : 'none'}` }, h('div', { className: 'inline-select' }, h('div', { className: 'ColorLabel' }, 'Solicitante 2:'), h('div', { className: 'input' }, h('select', { id: 'contractSelect2', className: 'numb', onChange: saveCurrentStepInput }, ...step.contractOptions.map(opt => h('option', { value: opt.value, selected: currentContract2 === opt.value }, opt.label))), h('span', { className: 'valor' }, '▼'))));
    inputGroup.appendChild(secondContainer);
  } else if (step.inputType === 'other_loans') {
    const hasLoans = userAnswers.hasOtherLoans || step.default;
    const rawAmount = userAnswers.otherLoansAmount || '';
    const showAmount = hasLoans === 'si';
    const radioGroup = h('div', { className: 'radio-group', id: 'loansRadioGroup' });
    const siDiv = h('div', { className: 'radio-option' }, h('input', { type: 'radio', name: 'loansRadio', id: 'loans_si', value: 'si', checked: hasLoans === 'si', onChange: () => { saveCurrentStepInput(); document.getElementById('loanAmountContainer').style.display = 'block'; } }), h('label', { htmlFor: 'loans_si' }, 'Si'));
    const noDiv = h('div', { className: 'radio-option' }, h('input', { type: 'radio', name: 'loansRadio', id: 'loans_no', value: 'no', checked: hasLoans === 'no', onChange: () => { saveCurrentStepInput(); document.getElementById('loanAmountContainer').style.display = 'none'; } }), h('label', { htmlFor: 'loans_no' }, 'No'));
    [siDiv, noDiv].forEach(div => {
      div.addEventListener('click', () => {
        const radio = div.querySelector('input');
        if (radio && !radio.checked) {
          radio.checked = true;
          radio.dispatchEvent(new Event('change'));
          saveCurrentStepInput();
          document.getElementById('loanAmountContainer').style.display = radio.value === 'si' ? 'block' : 'none';
        }
      });
      radioGroup.appendChild(div);
    });
    inputGroup.appendChild(radioGroup);
    const wrapper = h('div', {});
    wrapper.appendChild(h('div', { className: 'ColorLabel' }, 'Cuotas de otros prestamos'));
    const inputDiv = h('div', { className: 'input' });
    const loanInput = h('input', { type: 'text', id: 'loanAmountInput', className: 'numb', placeholder: '300', value: rawAmount ? formatCurrencyValue(rawAmount) : '', onInput: saveCurrentStepInput });
    inputDiv.appendChild(loanInput); inputDiv.appendChild(h('span', { className: 'valor' }, '€/mes')); wrapper.appendChild(inputDiv);
    const loanAmountDiv = h('div', { id: 'loanAmountContainer', style: `display:${showAmount ? 'block' : 'none'}` }, wrapper);
    inputGroup.appendChild(loanAmountDiv);
    setTimeout(() => setupCurrencyInput(loanInput), 0);
  } else if (step.inputType === 'age_only') {
    const currentVal = userAnswers.age !== undefined ? userAnswers.age : '';
    const wrapper = h('div', {});
    wrapper.appendChild(h('div', { className: 'ColorLabel' }, 'Edad'));
    const inputDiv = h('div', { className: 'input' });
    const ageInput = h('input', { type: 'number', id: 'ageInput', className: 'numb', placeholder: step.placeholder || '35', value: currentVal, step: '1', min: '18', max: '100', onInput: saveCurrentStepInput });
    inputDiv.appendChild(ageInput); inputDiv.appendChild(h('span', { className: 'valor' }, 'años')); wrapper.appendChild(inputDiv);
    inputGroup.appendChild(wrapper);
  } else if (step.inputType === 'review_confirm') {
    const residenceText = userAnswers.primaryResidence === 'si' ? 'Vivienda habitual' : 'Inversión/Segunda vivienda';
    const savingsAmount = userAnswers.savings ? formatIntegerEuro(userAnswers.savings) : 'No especificado';
    const monthlyIncome = userAnswers.monthlyIncome ? formatIntegerEuro(userAnswers.monthlyIncome) + '/mes' : 'No especificado';
    
    const employmentStatusText = userAnswers.employmentStatus === 'solo' ? 'Compro solo' : 'Compro con alguien';
    const contractOptions = stepsData.find(s => s.inputType === 'employment').contractOptions;
    const getLabel = (val) => (contractOptions.find(o => o.value === val) || {}).label || val;
    const contract1Text = getLabel(userAnswers.contractType1);
    const contract2Text = (userAnswers.employmentStatus === 'con_alguien') ? getLabel(userAnswers.contractType2) : null;
    
    const hasLoansText = userAnswers.hasOtherLoans === 'si' ? 'Sí' : 'No';
    const loansAmount = (userAnswers.hasOtherLoans === 'si' && userAnswers.otherLoansAmount) ? formatIntegerEuro(userAnswers.otherLoansAmount) + '/mes' : 'No aplica';
    const ageText = userAnswers.age || 'No especificada';
    
    const summary = h('div', { className: 'summary-box' },
      h('strong', {}, 'Revisión de tus datos:'),
      h('br'),
      `Provincia: ${userAnswers.province || "Madrid"}`,
      h('br'),
      `Uso: ${residenceText}`,
      h('br'),
      `Ahorros: ${savingsAmount}`,
      h('br'),
      `Situación laboral: ${employmentStatusText}`,
      h('br'),
      `Solicitante 1: ${contract1Text}`,
      h('br'),
      contract2Text ? `Solicitante 2: ${contract2Text}` : '',
      contract2Text ? h('br') : null,
      `Ingresos mensuales: ${monthlyIncome}`,
      h('br'),
      `Otros préstamos: ${hasLoansText} ${hasLoansText === 'Sí' ? ` - Cuota: ${loansAmount}` : ''}`,
      h('br'),
      `Edad: ${ageText} años`
    );
    inputGroup.appendChild(summary);
    
    const checkDiv = h('div', { className: 'checkbox-group' },
      h('input', { type: 'checkbox', id: 'confirmCheck', checked: userAnswers.agreement === true, onChange: saveCurrentStepInput }),
      h('label', { htmlFor: 'confirmCheck' }, 'Confirmo que los datos son correctos y deseo finalizar el proceso.')
    );
    inputGroup.appendChild(checkDiv);
  }
  contentDiv.appendChild(inputGroup);
}

function validateCurrentStep() {
  const step = stepsData[currentStep];
  if (step.inputType === 'savings') { if (!userAnswers.savings || isNaN(Number(userAnswers.savings))) { showWarning("Ingresa un valor numérico para los ahorros."); return false; } if (Number(userAnswers.savings) < 0) { showWarning("Los ahorros deben ser positivos."); return false; } }
  else if (step.inputType === 'monthly_income') { if (!userAnswers.monthlyIncome || isNaN(Number(userAnswers.monthlyIncome))) { showWarning("Ingresa un valor numérico para los ingresos mensuales."); return false; } if (Number(userAnswers.monthlyIncome) < 0) { showWarning("Los ingresos deben ser positivos."); return false; } }
  else if (step.inputType === 'employment') { if (!userAnswers.employmentStatus) { showWarning("Selecciona una opción."); return false; } if (!userAnswers.contractType1) { showWarning("Selecciona contrato para Solicitante 1."); return false; } if (userAnswers.employmentStatus === 'con_alguien' && !userAnswers.contractType2) { showWarning("Selecciona contrato para Solicitante 2."); return false; } }
  else if (step.inputType === 'other_loans') { if (!userAnswers.hasOtherLoans) { showWarning("Indica si tienes otros préstamos."); return false; } if (userAnswers.hasOtherLoans === 'si' && (!userAnswers.otherLoansAmount || isNaN(Number(userAnswers.otherLoansAmount)))) { showWarning("Ingresa el monto mensual de otros préstamos."); return false; } if (userAnswers.hasOtherLoans === 'si' && Number(userAnswers.otherLoansAmount) < 0) { showWarning("Monto debe ser positivo."); return false; } }
  else if (step.inputType === 'age_only') { const age = userAnswers.age; if (!age || age.trim() === '' || isNaN(Number(age))) { showWarning("Ingresa tu edad (número entero)."); return false; } if (Number(age) < 18) { showWarning("Debe ser mayor de 18 años."); return false; } if (Number(age) > 100) { showWarning("Edad máxima 100 años."); return false; } }
  else if (step.inputType === 'review_confirm') { if (!userAnswers.agreement) { showWarning("Debes aceptar la confirmación."); return false; } }
  return true;
}

function showWarning(msg) {
  const old = document.querySelector('.temp-step-warning');
  if (old) old.remove();
  const warnDiv = h('div', { className: 'temp-step-warning' }, msg);
  const card = document.querySelector('.input-card');
  if (card) card.appendChild(warnDiv);
  setTimeout(() => { warnDiv.style.opacity = '0'; setTimeout(() => warnDiv.remove(), 400); }, 2800);
}


function renderCalculadoraHipotecaria() {
  const app = document.getElementById('app');
  app.innerHTML = '';

  const provinciaSeleccionada = userAnswers.province || "Madrid";
  const ahorros = Number(userAnswers.savings) || 30000;
  const edad = Number(userAnswers.age) || 35;
  const plazoRecomendado = Math.min(30, Math.max(10, 80 - edad));
  const esViviendaHabitual = userAnswers.primaryResidence === 'si';
  const ltv = esViviendaHabitual ? 0.80 : 0.70;

  const container = h('div', { id: 'calculadoraContainer' },
    h('div', { id: 'inicio' },
      h('div', { className: 'title-main' }, '¿Qué casa me puedo permitir?'),
      h('div', { className: 'subtitle-main' }, 'Descubre qué vivienda te es asequible')
    ),
    h('div', { className: 'two-columns', style: 'display:flex; flex-wrap:wrap; gap:2rem;' },
      h('div', { id: 'inputTabla', style: 'flex:1 1 400px;' },
        h('h2', { id: 'inputText' }, ''),
        h('div', { className: 'hr' }),
        h('div', { id: 'formContainer' },
          h('label', { className: 'ColorLabel', htmlFor: 'savingsInputCalc' }, 'Ahorro aportado'),
          h('div', { className: 'input' }, h('input', { className: 'numb', id: 'savingsInputCalc', type: 'text', value: formatCurrencyValue(ahorros), onInput: calcularTodo }), h('span', { className: 'valor' }, '€')),
          h('label', { className: 'ColorLabel', htmlFor: 'incomeInputCalc' }, 'Ingresos netos mensuales'),
          h('div', { className: 'input' }, h('input', { className: 'numb', id: 'incomeInputCalc', type: 'text', value: formatCurrencyValue(userAnswers.monthlyIncome || 2500), onInput: calcularTodo }), h('span', { className: 'valor' }, '€/mes')),
          h('label', { className: 'ColorLabel', htmlFor: 'plazoInputCalc' }, 'Plazo en años'),
          h('div', { className: 'input' }, h('input', { className: 'numb', id: 'plazoInputCalc', type: 'number', value: plazoRecomendado, step: '1', min: '5', max: '40', onInput: calcularTodo }), h('span', { className: 'valor' }, 'años')),
          h('label', { className: 'ColorLabel', htmlFor: 'otherLoansCalc' }, 'Cuotas de otros préstamos'),
          h('div', { className: 'input' }, h('input', { className: 'numb', id: 'otherLoansCalc', type: 'text', value: formatCurrencyValue(userAnswers.hasOtherLoans === 'si' ? (userAnswers.otherLoansAmount || 0) : 0), onInput: calcularTodo }), h('span', { className: 'valor' }, '€/mes')),
          h('label', { className: 'ColorLabel', htmlFor: 'interestRateCalc' }, 'Tipo de interés'),
          h('div', { className: 'input', style: 'gap: 0.5rem;' },
            h('select', { id: 'tipoInteresSelectCalc', style: 'flex:0.5; min-width:100px;', onChange: actualizarNotaInteres },
              h('option', { value: 'fijo', selected: true }, 'Fijo'),
              h('option', { value: 'variable' }, 'Variable')
            ),
            h('input', { className: 'numb', id: 'interestRateCalc', type: 'number', value: '2.85', step: '0.05', min: '0', style: 'flex:0.5;', onInput: calcularTodo }),
            h('span', { className: 'valor' }, '%')
          ),
          h('div', { id: 'interestNoteCalc', className: 'interest-rate-note' }, 'Tipo fijo: la cuota no variará durante la vida del préstamo.'),
          h('label', { className: 'ColorLabel', htmlFor: 'tipoInmuebleCalc' }, 'Estado del inmueble'),
          h('div', { className: 'input' },
            h('select', { id: 'tipoInmuebleCalc', onChange: calcularTodo },
              h('option', { value: 'segunda-mano' }, 'Segunda mano'),
              h('option', { value: 'nuevo' }, 'Nuevo (obra nueva)')
            ),
            h('span', { className: 'valor' }, '▼')
          ),
          h('label', { className: 'ColorLabel', htmlFor: 'regionCalc' }, 'Localización del inmueble'),
          h('div', { className: 'input' },
            h('select', { id: 'regionCalc', onChange: calcularTodo }, ...PROVINCIAS.map(p => h('option', { value: p, selected: p === provinciaSeleccionada }, p))),
            h('span', { className: 'valor' }, '▼')
          )
        )
      ),
      h('div', { id: 'resultadoCalculado', style: 'flex:1 1 400px;' },
        h('h2', {}, 'Resultados'),
        h('div', { className: 'hr' }),
       
        h('div', { style: 'margin-top: 1rem;' },
          h('div', { style: 'font-weight:600; font-size:0.9rem; color:#1e3a5f;' }, 'Desglose del precio de compra'),
          h('canvas', { id: 'miGrafico', style: 'margin-top:0.3rem; width:100%; height:90px;' }),
          h('div', { className: 'chart-legend' },
            h('div', { className: 'legend-item' }, h('span', { className: 'legend-color', style: 'background:#2563eb;' }), ' Precio inmueble ', h('span', { className: 'legend-value', id: 'legendPrice' }, '')),
            h('div', { className: 'legend-item' }, h('span', { className: 'legend-color', style: 'background:#f59e0b;' }), ' Impuestos y gastos ', h('span', { className: 'legend-value', id: 'legendTaxes' }, ''))
          )
        ),
        h('div', { style: 'margin-top: 1.5rem;' },
          h('div', { style: 'font-weight:600; font-size:0.9rem; color:#1e3a5f;' }, 'Financiación e intereses'),
          h('canvas', { id: 'miGrafico2', style: 'margin-top:0.3rem; width:100%; height:90px;' }),
          h('div', { className: 'chart-legend' },
            h('div', { className: 'legend-item' }, h('span', { className: 'legend-color', style: 'background:#10b981;' }), ' Ahorro aportado ', h('span', { className: 'legend-value', id: 'legendSavings' }, '')),
            h('div', { className: 'legend-item' }, h('span', { className: 'legend-color', style: 'background:#6366f1;' }), ' Importe hipoteca ', h('span', { className: 'legend-value', id: 'legendLoan' }, '')),
            h('div', { className: 'legend-item' }, h('span', { className: 'legend-color', style: 'background:#ef4444;' }), ' Intereses ', h('span', { className: 'legend-value', id: 'legendInterests' }, ''))
          )
        ),
       
      )
    )
  );

  app.appendChild(container);

  setTimeout(() => {
    setupCurrencyInput(document.getElementById('savingsInputCalc'));
    setupCurrencyInput(document.getElementById('incomeInputCalc'));
    setupCurrencyInput(document.getElementById('otherLoansCalc'));
  }, 0);

  function actualizarNotaInteres() {
    const sel = document.getElementById('tipoInteresSelectCalc');
    const note = document.getElementById('interestNoteCalc');
    if (sel.value === 'variable') {
      note.textContent = 'Para hipoteca variable se aplica un tipo estresado (+1%) en la simulación.';
      note.style.color = '#d97706';
    } else {
      note.textContent = 'Tipo fijo: la cuota no variará durante la vida del préstamo.';
      note.style.color = '#5f7d9c';
    }
    calcularTodo();
  }

  function getITP(region) { return 0.08; }

  function calcularTodo() {
    const savingsEl = document.getElementById('savingsInputCalc');
    const incomeEl = document.getElementById('incomeInputCalc');
    const otherLoansEl = document.getElementById('otherLoansCalc');

    const savings = parseSpanishNumber(savingsEl?.value) || 0;
    const monthlyIncome = parseSpanishNumber(incomeEl?.value) || 0;
    const otherLoans = parseSpanishNumber(otherLoansEl?.value) || 0;

    const years = Math.max(1, Math.round(parseFloat(document.getElementById('plazoInputCalc')?.value) || 30));
    let rate = parseFloat(document.getElementById('interestRateCalc')?.value) || 2.85;
    const tipoInteres = document.getElementById('tipoInteresSelectCalc')?.value || 'fijo';
    if (tipoInteres === 'variable') rate += 1.0;
    const tipoInmueble = document.getElementById('tipoInmuebleCalc')?.value || 'segunda-mano';
    const region = document.getElementById('regionCalc')?.value || 'Madrid';

    const maxMonthlyPayment = Math.max(0, monthlyIncome * 0.35 - otherLoans);
    const monthlyRate = rate / 100 / 12;
    const n = years * 12;
    let maxLoan = 0;
    if (monthlyRate > 0 && maxMonthlyPayment > 0) {
      maxLoan = maxMonthlyPayment * ((1 - Math.pow(1 + monthlyRate, -n)) / monthlyRate);
    } else if (monthlyRate === 0) {
      maxLoan = maxMonthlyPayment * n;
    }

    const maxPriceFromLoan = ltv > 0 ? maxLoan / ltv : 0;
    const taxRate = tipoInmueble === 'nuevo' ? 0.10 : getITP(region);
    const gastosFijos = 1500;
    const requiredRate = (1 - ltv) + taxRate;
    let maxPriceFromSavings = requiredRate > 0 ? (savings - gastosFijos) / requiredRate : Infinity;
    const maxPrice = Math.max(0, Math.min(maxPriceFromLoan, maxPriceFromSavings));
    const actualLoan = maxPrice * ltv;
    const taxes = maxPrice * taxRate + gastosFijos;

    let monthlyPayment = 0;
    if (monthlyRate === 0) monthlyPayment = actualLoan / n;
    else if (n > 0 && actualLoan > 0) monthlyPayment = (actualLoan * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -n));

    const totalPayment = monthlyPayment * n;
    const totalInterest = Math.max(0, totalPayment - actualLoan);


    document.getElementById('legendPrice').textContent = formatIntegerEuro(maxPrice);
    document.getElementById('legendTaxes').textContent = formatIntegerEuro(taxes);
    document.getElementById('legendSavings').textContent = formatIntegerEuro(savings);
    document.getElementById('legendLoan').textContent = formatIntegerEuro(actualLoan);
    document.getElementById('legendInterests').textContent = formatIntegerEuro(totalInterest);

  
    const canvas1 = document.getElementById('miGrafico');
    if (canvas1) {
      const ctx = canvas1.getContext('2d');
      const w = canvas1.clientWidth, h = 90;
      canvas1.width = w; canvas1.height = h;
      ctx.clearRect(0, 0, w, h);
      const totalBar = maxPrice + taxes;
      if (totalBar > 0) {
        const precioW = (maxPrice / totalBar) * w;
        ctx.fillStyle = '#2563eb';
        ctx.fillRect(0, 0, precioW, h);
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(precioW, 0, w - precioW, h);
      }
    }

    
    const canvas2 = document.getElementById('miGrafico2');
    if (canvas2) {
      const ctx = canvas2.getContext('2d');
      const w = canvas2.clientWidth, h = 90;
      canvas2.width = w; canvas2.height = h;
      ctx.clearRect(0, 0, w, h);
      const totalFin = savings + actualLoan + totalInterest;
      if (totalFin > 0) {
        const ahorroW = (savings / totalFin) * w;
        const capitalW = (actualLoan / totalFin) * w;
        ctx.fillStyle = '#10b981';
        ctx.fillRect(0, 0, ahorroW, h);
        ctx.fillStyle = '#6366f1';
        ctx.fillRect(ahorroW, 0, capitalW, h);
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(ahorroW + capitalW, 0, w - ahorroW - capitalW, h);
      }
    }
  }

  document.getElementById('tipoInteresSelectCalc')?.addEventListener('change', actualizarNotaInteres);
  ['savingsInputCalc', 'incomeInputCalc', 'otherLoansCalc'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', calcularTodo);
  });
  document.getElementById('plazoInputCalc')?.addEventListener('input', calcularTodo);
  document.getElementById('interestRateCalc')?.addEventListener('input', calcularTodo);
  document.getElementById('tipoInmuebleCalc')?.addEventListener('change', calcularTodo);
  document.getElementById('regionCalc')?.addEventListener('change', calcularTodo);

  calcularTodo();
}

function init() {
  stepsData.forEach(step => {
    if (step.inputType === 'employment') {
      if (userAnswers[step.name] === undefined) userAnswers[step.name] = step.default || 'solo';
      if (userAnswers[step.contractName1] === undefined) userAnswers[step.contractName1] = step.defaultContract1 || 'fijo';
      if (userAnswers[step.contractName2] === undefined) userAnswers[step.contractName2] = step.defaultContract2 || 'fijo';
    } else if (step.inputType === 'other_loans') {
      if (userAnswers[step.name] === undefined) userAnswers[step.name] = step.default || 'no';
      if (userAnswers[step.amountName] === undefined) userAnswers[step.amountName] = step.defaultAmount || '';
    } else if (step.inputType === 'review_confirm') {
      if (userAnswers[step.name] === undefined) userAnswers[step.name] = step.default || false;
    } else if (step.inputType === 'age_only' || step.inputType === 'monthly_income' || step.inputType === 'savings') {
      if (userAnswers[step.name] === undefined) userAnswers[step.name] = step.default?.toString() || '';
    } else if (step.inputType === 'select' || step.inputType === 'radio') {
      if (userAnswers[step.name] === undefined) userAnswers[step.name] = step.default || '';
    }
  });
  if (!userAnswers.propertyType) userAnswers.propertyType = 'piso';
  renderAssistente();
}

document.addEventListener('DOMContentLoaded', init);