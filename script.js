let transactions = load() || []

const render = () => {
  renderTransactions('[data-js~=js-history] ul')
  renderSummary('[data-js~=js-summary]')
}

const init = () => {
  addToggleLogicToSections()
  addSubmitEventListenerToForm('[data-js~=js-add-transaction]')
  render()
}

init()

function addSubmitEventListenerToForm(formContainerSelector, target, index) {
  const formEl = getEl(formContainerSelector + ' form', target)
  formEl.addEventListener('submit', (event) =>
    onSubmitTransaction(event, formEl, index)
  )
}
//submit form handler
function onSubmitTransaction(event, formEl, index) {
  event.preventDefault()
  formSubmitDataHandler(formEl, index)
  render()
}

function formSubmitDataHandler(formEl, index, inputSelector = 'input') {
  const inputs = getAll(inputSelector, formEl)
  const newValue = inputs.reduce(
    (acc, input) => ({ ...acc, ...extractFormatedValue(input) }),
    {}
  )
  index = index > -1 ? index : transactions.length
  transactions = [
    ...transactions.slice(0, index),
    newValue,
    ...transactions.slice(index + 1),
  ]
  save()
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
  return transactions.reduce(
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
function addToggleLogicToSections(target) {
  const triggerSelector = '[data-js~=js-trigger]'

  const parents = getAll('[data-js~=js-toggle]', target)

  parents.forEach((parent) => {
    const trigger = getEl(triggerSelector, parent)
    trigger &&
      trigger.addEventListener('click', () => {
        toggleElementSiblings(triggerSelector, parent)
      })
  })
}

function toggleElementSiblings(sel, parent) {
  const siblings = getAll(sel + '~*', parent)
  siblings.forEach(toggleElement)
}

function toggleElement(el) {
  el.classList.toggle('hidden')
}

//renderTransactionsHistory

function renderTransactions(sel) {
  const parent = getEl(sel)
  parent.innerHTML = ''
  transactions.forEach(({ label, amount }, index) =>
    renderTransaction(parent, label, amount, index)
  )
}

function renderTransaction(target = document, label = '', amount = 0, index) {
  const historyElementHtml = `
  <div data-js="js-toggle">
  <div class="history__records ${
    amount > 0
      ? 'history__records__income'
      : amount
      ? 'history__records__expense'
      : ''
  }" data-js="js-trigger">
<button type="button" data-js="js-delete"></button>
              <span>${label}</span>
              <span class="history_records__summary">${amount}</span>
              </div>
<div class="hidden" data-js="js-${index}-transaction"> 
  <form>
          <label class="edit-form__field">
            <div>Text</div>
            <input
              type="text"
              placeholder="Enter a this entry label..."
              name="label"
              value="${label}"
            />
          </label>
          <label class="edit-form__field">
            <div>
              Amount
              <p>(negative - expense, positive - income)</p>
            </div>
            <input
              type="number"
              name="amount"
              value="${amount}"
              placeholder="Enter a number..."
            />
          </label>
          <button type="submit" class="edit-form__submit-button">
            update transaction
          </button>
        </form>
 </div>
 </div>
  `
  const historyEl = document.createElement('li')
  historyEl.innerHTML = historyElementHtml
  addToggleLogicToSections(historyEl)
  const deleteButtonElement = getEl('[data-js~=js-delete]', historyEl)
  deleteButtonElement.addEventListener('click', () => removeTransaction(index))
  addSubmitEventListenerToForm(
    `[data-js~=js-${index}-transaction]`,
    historyEl,
    index
  )
  target.insertAdjacentElement('beforeend', historyEl)
}

function removeTransaction(index) {
  transactions = [
    ...transactions.slice(0, index),
    ...transactions.slice(index + 1),
  ]
  save()
  render()
}

function save() {
  localStorage.setItem('transactions', JSON.stringify(transactions))
}

function load() {
  return JSON.parse(localStorage.getItem('transactions'))
}

function getEl(sel, target = document) {
  return target.querySelector(sel)
}

function getAll(sel, target = document) {
  return Array.from(target.querySelectorAll(sel))
}
