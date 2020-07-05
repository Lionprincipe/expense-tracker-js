let data = [
  { label: 'salary', amount: 12000 },
  { label: 'birthday', amount: 12000 },
  { label: '', amount: 0 },
  { label: 'biere', amount: -5000 },
  { label: 'pizza', amount: -2000 },
]

const render = () => {
  renderTransactions('[data-js~=js-history] ul')
  renderSummary('[data-js~=js-summary]')
  addToggleLogicToSections('[data-js~=js-toggle-trigger]')
}
const init = () => {
  render()
  const formEl = getEl('[data-js~=js-add-transaction] form')
  const submitButton = getEl('[type=submit]', formEl)
  submitButton.addEventListener('click', onSubmit)
}
init()

//submit form handler
function onSubmit(event) {
  event.preventDefault()
  const formEl = getEl('[data-js~=js-add-transaction] form')
  formSubmitDataHandler(formEl)
  render()
}

function formSubmitDataHandler(formEl, inputSelector = 'input') {
  const inputs = getAll(inputSelector, formEl)
  const newValue = inputs.reduce(
    (acc, input) => ({ ...acc, ...extractFormatedValue(input) }),
    {}
  )
  data = [...data, newValue]
}

function extractFormatedValue(input) {
  const { value, name, type } = input

  switch (type) {
    case 'number':
      input.value = 0
      return { [name]: Number(value) }
    default:
      input.value = ''
      return name ? { [name]: value } : {}
  }
}
// render summary
function renderSummary(sel) {
  const { expense, income } = getSummaryValues()

  const summaryElement = getEl(sel)
  const summaryHtml = `
  <h2 class="summary__heading" >
          <div>Your Balance</div>
          <div class="banlance__result">$${income + expense}</div>
        </h2>
        <div class="summary__details">
          <div class="summary__income">
            <h4>Income</h4>
            <div class="summary__total summary__total--positive">$${income}</div>
          </div>
          <div class="summary__expense">
            <h4>Expense</h4>
            <div class="summary__total summary__total--negative">$${expense}</div>
          </div>
        </div>
  `
  summaryElement.innerHTML = summaryHtml
}

function getSummaryValues() {
  return data.reduce(
    (acc, { amount }) => {
      switch (true) {
        case amount > 0: {
          return { ...acc, income: acc.income + amount }
        }
        case amount < 0:
          return { ...acc, expense: acc.expense + amount }
          break
        default:
          return acc
      }
    },
    { income: 0, expense: 0 }
  )
}

/// toggle
function addToggleLogicToSections(triggerSelector) {
  const parents = getAll('[data-js~=js-toggle]')
  parents.forEach((parent) => {
    const trigger = getEl(triggerSelector, parent)
    trigger.addEventListener('click', () =>
      toggleElementSiblings(triggerSelector, parent)
    )
  })
}

function toggleElementSiblings(sel, parent) {
  const siblings = getAll(sel + '~*', parent)
  siblings.forEach(toggleElement)
}

function toggleElement(el) {
  el && el.classList.toggle('hidden')
}

//renderTransactionsHistory

function renderTransactions(sel) {
  const parent = getEl(sel)
  parent.innerHTML = ''
  data.forEach(({ label, amount }, index) =>
    renderTransaction(parent, label, amount, index)
  )
}

function renderTransaction(target = document, label = '', amount = 0, index) {
  const historyElementHtml = `
<button type="button" data-js="js-delete"></button>
              <span>${label}</span>
              <span class="history_records__summary">${amount}</span>
  `
  const historyEl = document.createElement('li')
  historyEl.className = `history__records ${
    amount > 0
      ? 'history__records__income'
      : amount
      ? 'history__records__expense'
      : ''
  }`

  historyEl.innerHTML = historyElementHtml
  const deleteButtonElement = getEl('[data-js~=js-delete]', historyEl)
  console.log(deleteButtonElement)
  deleteButtonElement.addEventListener('click', () => removeTransaction(index))
  target.insertAdjacentElement('beforeend', historyEl)
}
function removeTransaction(index) {
  data = [...data.slice(0, index), ...data.slice(index + 1)]
  render()
  console.log(data)
}
function getEl(sel, target = document) {
  return target.querySelector(sel)
}

function getAll(sel, target = document) {
  return Array.from(target.querySelectorAll(sel))
}
