const data = [
  { label: 'salary', amount: 12000 },
  { label: 'birthday', amount: 12000 },
  { label: 'biere', amount: -5000 },
  { label: 'pizza', amount: -2000 },
]

renderTransactions('.history__container ul')

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
              <span class="history_records__balance">${amount}</span>
            </p>
  `
  const historyEl = document.createElement('li')
  historyEl.className = 'history__records history__records__income'
  historyEl.innerHTML = historyElementHtml
  target.insertAdjacentElement('beforeend', historyEl)
}

function getEl(sel, target = document) {
  return target.querySelector(sel)
}
