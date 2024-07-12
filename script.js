'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Abreham Dessu',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Tesfamichael Aboset',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Leul Hailu',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Bruk Getachew',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

containerMovements.innerHTML = '';

//SETTING USER NAME FOR EACH ACCOUNT
accounts.forEach(acc => {
  acc.userName = acc.owner
    .split(' ')
    .map(name => name[0])
    .join('')
    .toLowerCase();
  console.log(acc.userName);
});
let currentUser;

btnLogin.addEventListener('click', e => {
  e.preventDefault();
  currentUser = accounts.find(acc => acc.userName == inputLoginUsername.value);
  if (currentUser?.pin === Number(inputLoginPin.value)) {
    containerApp.style.opacity = 100;
    inputLoginPin.value = inputLoginUsername.value = '';
    updateUI(currentUser);
  }
});

//CALCULATE TOTAL DEPOSIT AND WITHDRAWAL FOR EACH ACCOUNT

const updateUI = function (account) {
  const interest = account.movements
    .filter(mov => mov > 0)
    .map(mov => (mov * account.interestRate) / 100)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumInterest.textContent = interest + '€';

  const totalWithdrawal = account.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = totalWithdrawal + '€';

  const totalDeposit = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = totalDeposit + '€';

  account.balance = account.movements.reduce((acc, mov) => (acc += mov), 0);
  labelBalance.textContent = account.balance + '€';

  account.movements.forEach((mov, i, arr) => {
    const movementsType =
      mov > 0 ? 'movements__type--deposit' : 'movements__type--withdrawal';
    containerMovements.insertAdjacentHTML(
      'afterbegin',
      `   <div class="movements__row">
              <div class="movements__type ${movementsType}">${i + 1} ${
        mov > 0 ? 'deposit' : 'withdrawal'
      }</div>
              <div class="movements__date">3 days ago</div>
              <div class="movements__value">${mov}€</div>
            </div>
          `
    );
  });
};

//MONEY TRANSFER IMPLEMENTATION

btnTransfer.addEventListener('click', e => {
  e.preventDefault();
  const receiverAccount = accounts.find(
    acc => acc.userName === inputTransferTo.value
  );
  const amount = Number(inputTransferAmount.value);
  if (currentUser.balance >= amount && receiverAccount && amount > 0) {
    currentUser.movements.push(-amount);
    receiverAccount.movements.push(amount);
    updateUI(currentUser);
  }
  console.log(currentUser.movements, receiverAccount.movements);
});

// LOAN IMPLEMENTATION

btnLoan.addEventListener('click', e => {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (currentUser.movements.some(mov => mov >= amount * 0.1)) {
    currentUser.movements.push(amount);
    updateUI(currentUser);
  }
});
