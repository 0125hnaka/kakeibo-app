let editingExpenseId =
    null;

function renderExpenses() {

    const expenses = getExpenses();

    const expenseList =
        document.getElementById("expenseList");

    expenseList.innerHTML = "";

    const selectedMonth =
        currentMonth;

    const selectedCategory =
        document.getElementById(
            "historyCategoryFilter"
        ).value;

    const selectedPayment =
        document.getElementById(
            "historyPaymentFilter"
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
            selectedCategory &&
            expense.category !==
            selectedCategory
        ) {

            return;

        }

        if (
            selectedPayment &&
            expense.payment !==
            selectedPayment
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
            
            dateHeader.id =
                "date-" +
                expense.date;

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
            <div class="expense-row1">

                <span class="expense-category">
                    ${expense.category}
                </span>

                <span class="expense-amount">
                    ${expense.amount.toLocaleString()}円
                </span>

            </div>

            <div class="expense-row2">

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

        renderExpenses();

        renderMonthSelector();
        renderPaymentSummary();
        renderCreditCardList();
        recalculateBalance();

}

function editExpense(
    expenseId
) {

    const expenses =
        getExpenses();

    const expense =
        expenses.find(
            item =>
            item.id ===
            expenseId
        );

    if (!expense) {
        return;
    }

    editingExpenseId =
        expenseId;

    document.getElementById(
        "editAmount"
    ).value =
        expense.amount;

    document.getElementById(
        "editDate"
    ).value =
        expense.date;

    const editCategory =
        document.getElementById(
            "editCategory"
        );

    editCategory.innerHTML =
        "";

    getCategories()
    .forEach(
        function(category) {

            if (
                category.type ===
                expense.type
            ) {

                const option =
                    document.createElement(
                        "option"
                    );

                option.value =
                    category.name;

                option.textContent =
                    category.name;

                editCategory.appendChild(
                    option
                );

            }

        }
    );

    const editPayment =
        document.getElementById(
            "editPayment"
        );

    editPayment.innerHTML =
        "";

    getPayments()
    .forEach(
        function(payment) {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                payment.name;

            option.textContent =
                payment.name;

            editPayment.appendChild(
                option
            );

        }
    );

    editPayment.value =
        expense.payment;

    editCategory.value =
        expense.category;

    document.getElementById(
        "editType"
    ).value =
        expense.type;

    document.getElementById(
        "editModal"
    ).style.display =
        "flex";

}

document.getElementById(
    "cancelEditButton"
).addEventListener(
    "click",
    function() {

        document.getElementById(
            "editModal"
        ).style.display =
            "none";

    }
);

document.getElementById(
    "saveEditButton"
).addEventListener(
    "click",
    function() {

        const expenses =
            getExpenses();

        const expense =
            expenses.find(
                item =>
                item.id ===
                editingExpenseId
            );

        if (!expense) {
            return;
        }

        expense.amount =
            Number(
                document.getElementById(
                    "editAmount"
                ).value
            );

        expense.date =
            document.getElementById(
                "editDate"
            ).value;

        expense.category =
            document.getElementById(
                "editCategory"
            ).value;

        expense.payment =
            document.getElementById(
                "editPayment"
            ).value;

        expense.type =
            document.getElementById(
                "editType"
            ).value;

        saveExpenses(
            expenses
        );

        recalculateBalance();

        renderExpenses();

        renderMonthSelector();

        renderPaymentSummary();

        renderCreditCardList();

        renderExpenseRanking();

        renderIncomeRanking();

        renderIncomeSummary();

        renderExpensePaymentSummary();

        renderCardUsage();

        renderCardBilling();

        renderAssetAnalysis();

        updateCalendarTitle();

        renderCalendar();

        document.getElementById(
            "editModal"
        ).style.display =
            "none";

    }
);

document.getElementById(
    "editType"
).addEventListener(
    "change",
    function() {

        const type =
            this.value;

        const categorySelect =
            document.getElementById(
                "editCategory"
            );

        categorySelect.innerHTML =
            "";

        getCategories()
        .forEach(
            function(category) {

                if (
                    category.type ===
                    type
                ) {

                    const option =
                        document.createElement(
                            "option"
                        );

                    option.value =
                        category.name;

                    option.textContent =
                        category.name;

                    categorySelect.appendChild(
                        option
                    );

                }

            }
        );

    }
);

window.addEventListener(
    "click",
    function(event) {

        const modal =
            document.getElementById(
                "editModal"
            );

        if (
            event.target ===
            modal
        ) {

            modal.style.display =
                "none";

        }

    }
);

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key ===
            "Escape"
        ) {

            document.getElementById(
                "editModal"
            ).style.display =
                "none";

        }

    }
);

function renderHistoryFilters() {

    const categoryFilter =
        document.getElementById(
            "historyCategoryFilter"
        );

    const paymentFilter =
        document.getElementById(
            "historyPaymentFilter"
        );

    categoryFilter.innerHTML =
        `
        <option value="">
            全カテゴリ
        </option>
        `;

    paymentFilter.innerHTML =
        `
        <option value="">
            全支払方法
        </option>
        `;

    getCategories()
    .forEach(
        function(category) {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                category.name;

            option.textContent =
                category.name;

            categoryFilter.appendChild(
                option
            );

        }
    );

    getPayments()
    .forEach(
        function(payment) {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                payment.name;

            option.textContent =
                payment.name;

            paymentFilter.appendChild(
                option
            );

        }
    );

}

document.getElementById(
    "historyCategoryFilter"
).addEventListener(
    "change",
    function() {

        renderExpenses();

    }
);

document.getElementById(
    "historyPaymentFilter"
).addEventListener(
    "change",
    function() {

        renderExpenses();

    }
);