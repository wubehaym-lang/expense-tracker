const openPop = document.querySelector('#openPop');
const popUp = document.querySelector('.popUp');
const closePop = document.querySelector('#cancel');
const description = document.getElementById('description');
const amount = document.getElementById('amount');
const category = document.getElementById('category');
const date = document.getElementById('date');
const errorBox = document.querySelector('.errorBox')

openPop.addEventListener('click' , togglePopup);
closePop.addEventListener('click' , togglePopup);

function togglePopup(){
 popUp.classList.toggle('hidden')
}

let timeOut;

let expenses = JSON.parse(localStorage.getItem('expenses')) || [{
  description: 'Lunch',
  amount: 120,
  category: 'Food',
  date: '2026-08-15',
  isEditing: false
}, {
  description: 'Transport',
  amount: 50,
  category: 'Travel',
  date: '2026-10-21',
  isEditing: false
}, {
  description: 'Internet',
  amount: 300,
  category: 'Bills',
  date: '2026-08-25',
  isEditing: false
}];


generateHTML ()

function generateHTML (){
  let expenseHTML = '';
  let total = 0;
  expenses.forEach((expense, index)=> {
    expenseHTML += `
      <div class="expenseBox expenseBox-${index} ${expense.isEditing === true ? 'isEditing' : ''}">
        <div class="displaList">
          <div>${expense.description}</div>
          <div>${expense.category}</div>
          <div>$${expense.amount}</div>
          <div>${expense.date}</div>
          <button class="editExpense" data-expense-id="${index}">Edit</button>
          <button class="deletBtn" data-expense-id="${index}">Delete</button>
        </div>

        <div class="editExpenseBox">
          <input class="descrip-${index}" placeholder="Expense Discription" value="${expense.description}">
          <select name="expense" class="editedCategory-${index}">
            <option disabled value="undefined">Category</option>
            <option value="Food"  ${expense.category === 'Food' ? 'selected': ''}>Food</option>
            <option value="Travel" ${expense.category === 'Travel' ? 'selected': ''}>Travel</option>
            <option value="Bills" ${expense.category === 'Bills' ? 'selected': ''}>Bills</option>
          </select>
          <input class="amount-${index}" type="number" value="${expense.amount}" min="0">
          <input class="date-${index}" type="date"  value="${expense.date}">
          <button class="saveExpense" data-expense-id="${index}">Save</button>
          <button class="canceBtn" data-expense-id="${index}">Cancel</button>
        </div>
      </div> 
    `;

    total += Number(expense.amount);
    
  });

  renderExpense(expenseHTML, total);
  attachEventListener()
  localStorage.setItem('expenses', JSON.stringify(expenses));
}

function renderExpense(expenseHTML, totalValue){

  document.querySelector('.lists').innerHTML = expenseHTML;
  document.querySelector('#total').innerText = `Total: $${totalValue}`;
}

function attachEventListener(){

  document.querySelectorAll('.deletBtn').forEach(delButton => {
    delButton.addEventListener('click', ()=>{
      const {expenseId} = delButton.dataset;

      expenses.splice(expenseId, 1);
      generateHTML();
    });
  });

  document.querySelectorAll('.editExpense').forEach((edtBtn)=>{
    edtBtn.addEventListener('click', ()=>{
      const {expenseId} = edtBtn.dataset;

      expenses[expenseId].isEditing = true;
      generateHTML();
    });
  });


  document.querySelectorAll('.saveExpense').forEach((savBtn)=>{
    savBtn.addEventListener('click', ()=>{
      const {expenseId} = savBtn.dataset;
      const description = document.querySelector(`.descrip-${expenseId}`);
      const category = document.querySelector(`.editedCategory-${expenseId}`);
      const date = document.querySelector(`.date-${expenseId}`);
      const amount = document.querySelector(`.amount-${expenseId}`);

      
      if(amount.value <= 0){
        amount.classList.add('errorInput');
      }

      if(description.value.trim() === ''){
        description.classList.add('errorInput')
      }

      if(category.value === 'undefined'){
        category.classList.add('errorInput');
      }

      if(date.value.trim() === ''){
        date.classList.add('errorInput')
      }

      if(amount.value > 0 && description.value.trim() !== '' && 
        category.value !== 'undefined' && date.value.trim() !== ''){

        expenses[expenseId].description = description.value;
        expenses[expenseId].category = category.value;
        expenses[expenseId].date = date.value;
        expenses[expenseId].amount = Number(amount.value);

        expenses[expenseId].isEditing = false;
        generateHTML();
        }
    });
  });

  document.querySelectorAll('.canceBtn').forEach((cancleBtn)=>{
    cancleBtn.addEventListener('click', ()=>{
      const {expenseId} = cancleBtn.dataset;
      expenses[expenseId].isEditing = false;
      generateHTML();
    });
  });
}

document.getElementById('addBtn').addEventListener('click', ()=>{
  clearTimeout(timeOut);

  if(description.value.trim() !== ''&& Number(amount.value) > 0 && category.value !== 'undefined' && date.value !== ''){
    expenses.push({
      description: description.value,
      amount: Number(amount.value),
      category: category.value,
      date: date.value
    });
    description.value = '';
    amount.value = '';
    category.value = 'undefined';
    date.value = '';
    generateHTML();
    togglePopup();
  } else{
    
    errorBox.classList.remove('hidden');
    errorBox.innerText = `Invalid${description.value.trim() === '' ? ' Description': ''} ${Number(amount.value) <= 0 ? 'Amount': ''} ${category.value === 'undefined' ? 'Catagory': ''}  ${date.value === '' ? 'Date': ''}`;

    timeOut = setTimeout(()=>{
      errorBox.classList.add('hidden');

    } ,2500)
  }

});

