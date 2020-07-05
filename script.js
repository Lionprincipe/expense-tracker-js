const data = [
  { label: 'salary', amount: 12000 },
  { label: 'birthday', amount: 12000 },
  { label: '', amount: 0 },
  { label: 'biere', amount: -5000 },
  { label: 'pizza', amount: -2000 },
]

renderTransactions('[data-js~=js-history] ul')
addToogleLogicToSections('[data-js~=js-toggle-trigger]')
renderSummary('[data-js~=js-summary]')
// render summary

function renderSummary(sel) {
  const { expense, income } = getSummaryValues()

  const summaryElement = getEl(sel)
  const summaryHtml = `
  <h2 class="summary__heading" >
          <div>Your Balance</div>
          <div class="banlance__result">$${income - expense}</div>
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

function addToogleLogicToSections(triggerSelector) {
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
  data.forEach(({ label, amount }, index) =>
    renderTransaction(parent, label, amount, index)
  )
}

function renderTransaction(target = document, label = '', amount = 0, index) {
  const historyElementHtml = `
            <p>
              <span>${label}</span>
              <span class="history_records__summary">${amount}</span>
            </p>
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
  target.insertAdjacentElement('beforeend', historyEl)
}

function getEl(sel, target = document) {
  return target.querySelector(sel)
}

function getAll(sel, target = document) {
  return Array.from(target.querySelectorAll(sel))
}
