function renderExpenses() {

    const expenses = getExpenses();

    const expenseList =
        document.getElementById("expenseList");

    expenseList.innerHTML = "";

    const selectedMonth =
    document.getElementById(
        "expenseMonth"
    ).value;

    let lastDate = "";

    expenses.sort(
    function(a, b) {

        return (
            new Date(a.date) -
            new Date(b.date)
        );

    }
);

    expenses.forEach(
    function(expense) {

        if (
            expense.date.substring(
                0,
                7
            ) !== selectedMonth
        ) {

            return;

        }

        if (
            expense.date !==
            lastDate
        ) {

            const dateHeader =
                document.createElement(
                    "h3"
                );

            dateHeader.textContent =
                expense.date;

            expenseList.appendChild(
                dateHeader
            );

            lastDate =
                expense.date;

        }

        const item =
            document.createElement("div");

        item.className =
            "expense-card";

        item.innerHTML =
            `
            <div class="expense-top">

                <span>
                    ${expense.category}
                </span>

                <span>
                    ${expense.amount.toLocaleString()}円
                </span>

            </div>

            <div class="expense-info">

                <span>
                    ${expense.date}
                </span>

                <span>
                    ${expense.payment}
                </span>

            </div>
            `;

        const deleteButton =
            document.createElement(
                "button"
            );

        const editButton =
            document.createElement(
                "button"
            );

        editButton.textContent =
            "編集";

        editButton.addEventListener(
            "click",
            function() {

                editExpense(
                    expense.id
                );

            }
        );

        deleteButton.textContent =
            "削除";

        deleteButton.addEventListener(
            "click",
            function() {

                deleteExpense(
                    expense.id
                );

            }
        );

        const buttonArea =
            document.createElement(
                "div"
            );

        buttonArea.className =
            "expense-buttons";

        buttonArea.appendChild(
            editButton
        );

        buttonArea.appendChild(
            deleteButton
        );

        item.appendChild(
            buttonArea
        );

        expenseList.appendChild(
            item
        );

    });

}

const saveButton =
    document.getElementById("saveButton");

saveButton.addEventListener(
    "click",
    function () {

        const amount =
            document.getElementById("amount").value;

        const date =
            document.getElementById("date").value;

        const category =
            document.getElementById("category").value;

        const payment =
            document.getElementById("payment").value;

        const transactionType =
            document.querySelector(
                'input[name="transactionType"]:checked'
            ).value;

        const expense = {
            id:Date.now(),
            type: transactionType,
            amount: Number(amount),
            date: date,
            category: category,
            payment: payment
        };

        const expenses =
            getExpenses();

        expenses.push(expense);

        let balance =
            getBalance();

        if (
            category === "給与" ||
            category === "ボーナス" ||
            category === "口座入金"
        ) {

            balance += Number(amount);

        }

        if (
            category === "口座出金"
        ) {

            balance -= Number(amount);

        }

        saveBalance(balance);

        saveExpenses(expenses);

        renderExpenseMonthSelector();
        renderExpenses();

        renderMonthSelector();
        renderPaymentSummary();
        renderCreditCardList();
        renderBalance();

        document.getElementById("amount").value = "";
        document.getElementById("category").selectedIndex = 0;
        document.getElementById("payment").selectedIndex = 0;

    }
);

function deleteExpense(
    expenseId
) {

    const result =
        confirm(
            "削除しますか？"
        );

    if (!result) {
        return;
    }

    let expenses =
        getExpenses();

    expenses =
        expenses.filter(
            function(expense) {

                return (
                    expense.id !==
                    expenseId
                );

            }
        );

        saveExpenses(expenses);

        renderExpenseMonthSelector();
        renderExpenses();

        renderMonthSelector();
        renderPaymentSummary();
        renderCreditCardList();
        recalculateBalance();

}

function renderExpenseMonthSelector() {

    const expenses =
        getExpenses();

    const expenseMonth =
        document.getElementById(
            "expenseMonth"
        );

    expenseMonth.innerHTML = "";

    const months = [];

    expenses.forEach(
        function(expense) {

            const month =
                expense.date.substring(
                    0,
                    7
                );

            if (
                !months.includes(month)
            ) {

                months.push(month);

            }

        }
    );

    months.sort().reverse();

    months.forEach(
        function(month) {

            const option =
                document.createElement(
                    "option"
                );

            option.value = month;

            option.textContent = month;

            expenseMonth.appendChild(
                option
            );

        }
    );

}

const expenseMonth =
    document.getElementById(
        "expenseMonth"
    );

expenseMonth.addEventListener(
    "change",
    function() {

        renderExpenses();

    }
);

function editExpense(
    expenseId
) {

    const expenses =
        getExpenses();

    const expense =
        expenses.find(
            function(item) {

                return (
                    item.id ===
                    expenseId
                );

            }
        );

    if (!expense) {
        return;
    }

    const newAmount =
        prompt(
            "金額を入力",
            expense.amount
        );
    if (
        newAmount === null
    ) {
        return;
    }

    const newDate =
        prompt(
            "日付を入力",
            expense.date
        );

    if (
        newDate === null
    ) {
        return;
    }

    const newCategory =
        prompt(
            "カテゴリを入力",
            expense.category
        );

    if (
        newCategory === null
    ) {
        return;
    }

    const newPayment =
        prompt(
            "支払方法を入力",
            expense.payment
        );

    if (
        newPayment === null
    ) {
        return;
    }

    const newType =
        prompt(
            "収支区分 (income / expense)",
            expense.type
        );

    if (
        newType === null
    ) {
        return;
    }

    expense.amount =
        Number(newAmount);

    expense.date =
        newDate;

    expense.category =
        newCategory;

    expense.payment =
        newPayment;

    expense.type =
        newType;

    saveExpenses(
        expenses
    );

    recalculateBalance();

    renderExpenseMonthSelector();
    renderExpenses();

    renderMonthSelector();
    renderPaymentSummary();
    renderCreditCardList();

}