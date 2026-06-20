let editingExpenseId =
    null;

let lastDeletedExpense =
    null;

let expenseUndoTimerId =
    null;

function getBalanceDeltaByExpense(
    expense
) {

    const amount =
        Number(expense.amount) || 0;

    const depositCategories =
        [
            "給料",
            "賞与",
            "給与",
            "ボーナス",
            "口座入金"
        ];

    if (
        depositCategories.includes(
            expense.category
        )
    ) {

        return amount;

    }

    if (
        expense.category ===
        "口座出金"
    ) {

        return -amount;

    }

    return 0;

}

function escapeHtml(text) {

    return String(text)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");

}

function renderExpenses() {

    const expenses = getExpenses();

    const fixedExpenseMap =
        new Map(
            getFixedExpenses().map(
                function(item) {

                    return [
                        String(item.id),
                        item.name
                    ];

                }
            )
        );

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

        let memoText =
            expense.memo || "";

        if (
            memoText === "" &&
            expense.fixedExpenseId !== undefined &&
            expense.fixedExpenseId !== null
        ) {

            const fixedName =
                fixedExpenseMap.get(
                    String(
                        expense.fixedExpenseId
                    )
                );

            if (fixedName) {
                memoText = fixedName;
            }

        }

        const safeCategory =
            escapeHtml(
                expense.category
            );

        const safePayment =
            escapeHtml(
                expense.payment
            );

        const safeMemoText =
            escapeHtml(
                memoText
            );

        item.innerHTML =
            `
            <div class="expense-row1">

                <span class="expense-category">
                    ${safeCategory}

                    <span class="expense-payment-inline">
                        (${safePayment})
                    </span>
                </span>

                <span class="expense-amount">
                    ${expense.amount.toLocaleString()}円
                </span>

            </div>

            ${
                memoText
                ?
                `
                <div class="expense-row2">

                    <span>
                        ${safeMemoText}
                    </span>

                </div>
                `
                :
                ""
            }
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

function clearExpenseUndoNotice() {

    const undoArea =
        document.getElementById(
            "expenseUndoArea"
        );

    if (undoArea) {
        undoArea.innerHTML = "";
    }

}

function resetExpenseUndoState() {

    lastDeletedExpense =
        null;

    if (
        expenseUndoTimerId
    ) {

        clearTimeout(
            expenseUndoTimerId
        );

        expenseUndoTimerId =
            null;

    }

    clearExpenseUndoNotice();

}

function showExpenseUndoNotice(
    deletedExpense
) {

    const undoArea =
        document.getElementById(
            "expenseUndoArea"
        );

    if (!undoArea) {
        return;
    }

    lastDeletedExpense =
        deletedExpense;

    if (
        expenseUndoTimerId
    ) {

        clearTimeout(
            expenseUndoTimerId
        );

    }

    undoArea.innerHTML =
        `
        <div class="expense-undo-bar">
            <span>
                履歴を削除しました
            </span>

            <button
                type="button"
                id="undoDeleteExpenseButton"
            >
                元に戻す
            </button>
        </div>
        `;

    document.getElementById(
        "undoDeleteExpenseButton"
    ).addEventListener(
        "click",
        function() {

            if (
                !lastDeletedExpense
            ) {
                return;
            }

            const expenses =
                getExpenses();

            expenses.push(
                lastDeletedExpense
            );

            saveExpenses(expenses);

            let balance =
                getBalance();

            balance +=
                getBalanceDeltaByExpense(
                    lastDeletedExpense
                );

            saveBalance(balance);

            renderExpenses();
            renderMonthSelector();
            refreshBalanceViews();
            renderCalendar();
            renderCardUsage();
            renderCardBilling();

            resetExpenseUndoState();

        }
    );

    expenseUndoTimerId =
        setTimeout(
            function() {

                resetExpenseUndoState();

            },
            10000
        );

}

const saveButton =
    document.getElementById("saveButton");

saveButton.addEventListener(
    "click",
    function () {

        const amount =
            document.getElementById("amount").value;

        if (
            Number(amount) <= 0
        ) {

            alert(
                 "金額は1円以上入力してください"
            );

            return;

        }

        const date =
            document.getElementById("date").value;

        const category =
            document.getElementById("category").value;

        const payment =
            document.getElementById("payment").value;

        const memo =
            document.getElementById(
                "memo"
            ).value;    

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
            payment: payment,
            memo: memo
        };

        const expenses =
            getExpenses();

        expenses.push(expense);

        let balance =
            getBalance();

        balance +=
            getBalanceDeltaByExpense(
                expense
            );

        saveBalance(balance);

        saveExpenses(expenses);

        resetExpenseUndoState();

        renderExpenses();

        renderMonthSelector();
        refreshBalanceViews();
        renderCalendar();
        renderCardUsage();
        renderCardBilling();

        document.getElementById("amount").value = "";
        document.getElementById("category").selectedIndex = 0;
        document.getElementById("payment").selectedIndex = 0;

        document.getElementById(
            "memo"
        ).value = "";

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

    const deletedExpense =
        expenses.find(
            function(expense) {

                return (
                    expense.id ===
                    expenseId
                );

            }
        );

    if (!deletedExpense) {
        return;
    }

    expenses =
        expenses.filter(
            function(expense) {

                return (
                    expense.id !==
                    expenseId
                );

            }
        );

        let balance =
            getBalance();

        balance -=
            getBalanceDeltaByExpense(
                deletedExpense
            );

        saveBalance(balance);

        saveExpenses(expenses);

        renderExpenses();

        renderMonthSelector();
        refreshBalanceViews();
        renderCalendar();
        renderCardUsage();
        renderCardBilling();

        showExpenseUndoNotice(
            deletedExpense
        );

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
        "editMemo"
    ).value =
        expense.memo || "";

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

        const oldDelta =
            getBalanceDeltaByExpense(
                expense
            );

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

        expense.memo =
            document.getElementById(
                "editMemo"
            ).value;

        const newDelta =
            getBalanceDeltaByExpense(
                expense
            );

        let balance =
            getBalance();

        balance +=
            newDelta - oldDelta;

        saveBalance(balance);

        saveExpenses(
            expenses
        );

        resetExpenseUndoState();

        renderExpenses();

        renderMonthSelector();

        renderIncomeSummary();

        renderCardUsage();

        renderCardBilling();

    refreshBalanceViews();

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