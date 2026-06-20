let editingFixedExpenseId =
    null;

function syncFixedExpenseCategories() {

    const fixedExpenseMap =
        new Map(
            getFixedExpenses().map(
                function(item) {

                    return [
                        String(item.id),
                        item
                    ];

                }
            )
        );

    const expenses =
        getExpenses();

    let changed = false;

    expenses.forEach(
        function(expense) {

            if (
                expense.fixedExpenseId === undefined ||
                expense.fixedExpenseId === null
            ) {
                return;
            }

            const fixedExpense =
                fixedExpenseMap.get(
                    String(
                        expense.fixedExpenseId
                    )
                );

            if (!fixedExpense) {
                return;
            }

            if (
                expense.category !==
                fixedExpense.category
            ) {

                expense.category =
                    fixedExpense.category;

                changed = true;

            }

        }
    );

    if (changed) {

        saveExpenses(expenses);

    }

    return changed;

}

function validateFixedExpenseInput(
    name,
    amount,
    day,
    category,
    payment
) {

    if (
        name.trim() === ""
    ) {

        alert(
            "固定費名を入力してください"
        );

        return false;

    }

    if (
        !Number.isFinite(
            amount
        ) ||
        amount <= 0
    ) {

        alert(
            "固定費金額は1以上で入力してください"
        );

        return false;

    }

    if (
        !Number.isInteger(
            day
        ) ||
        day < 1 ||
        day > 31
    ) {

        alert(
            "支払日は1〜31で入力してください"
        );

        return false;

    }

    if (
        !category ||
        !payment
    ) {

        alert(
            "カテゴリと支払方法を選択してください"
        );

        return false;

    }

    return true;

}

function renderFixedExpensePayments() {

    const select =
        document.getElementById(
            "fixedExpensePayment"
        );

    if (!select) {
        return;
    }

    select.innerHTML = "";

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

            select.appendChild(
                option
            );

        }
    );

}

function renderFixedExpenseCategories() {

    const select =
        document.getElementById(
            "fixedExpenseCategory"
        );

    if (!select) {
        return;
    }

    select.innerHTML = "";

    getCategories()
    .filter(
        category =>
        category.type ===
        "expense"
    )
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

            select.appendChild(
                option
            );

        }
    );

}

function renderEditFixedPayments() {

    const select =
        document.getElementById(
            "editFixedPayment"
        );

    if (!select) {
        return;
    }

    select.innerHTML = "";

    getPayments().forEach(
        function(payment) {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                payment.name;

            option.textContent =
                payment.name;

            select.appendChild(
                option
            );

        }
    );

}

function renderEditFixedCategories() {

    const select =
        document.getElementById(
            "editFixedCategory"
        );

    if (!select) {
        return;
    }

    select.innerHTML = "";

    getCategories()
    .filter(
        category =>
        category.type ===
        "expense"
    )
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

            select.appendChild(
                option
            );

        }
    );

}

function renderFixedExpenseList() {

    const list =
        document.getElementById(
            "fixedExpenseList"
        );

    if (!list) {
        return;
    }

    list.innerHTML = "";

    getFixedExpenses()
    .forEach(
        function(item) {

            const div =
                document.createElement(
                    "div"
                );

            div.className =
                "setting-group";

            div.innerHTML =
            `

            <div class="fixed-header">

                <strong>
                    ${item.name}
                </strong>

                <span class="payment-badge">
                    ${item.payment}
                </span>

            </div>

            <div class="fixed-amount">

                ${item.amount.toLocaleString()}円

            </div>

            <div class="fixed-day">

                毎月${item.day}日

            </div>
            
            <div class="fixed-category">

                ${item.category}

            </div>

            <div class="button-row">

                <button
                    class="edit-btn"
                    onclick="
                        openFixedExpenseEdit(
                            ${item.id}
                        )
                    "
                >
                    編集
                </button>

                <button
                    class="delete-btn"
                    onclick="
                        deleteFixedExpense(
                            ${item.id}
                        )
                    "
                >
                    削除
                </button>

            </div>
            `;

                        list.appendChild(
                            div
                        );

                    }
                );

            }

document.getElementById(
    "addFixedExpenseButton"
).addEventListener(
    "click",
    function() {

        const name =
            document.getElementById(
                "fixedExpenseName"
            ).value;

        const amount =
            Number(
                document.getElementById(
                    "fixedExpenseAmount"
                ).value
            );

        const day =
            Number(
                document.getElementById(
                    "fixedExpenseDay"
                ).value
            );

        const category =
            document.getElementById(
                "fixedExpenseCategory"
            ).value;

        const payment =
            document.getElementById(
                "fixedExpensePayment"
            ).value;

        const isValid =
            validateFixedExpenseInput(
                name,
                amount,
                day,
                category,
                payment
            );

        if (!isValid) {
            return;
        }

        const fixedExpenses =
            getFixedExpenses();

        fixedExpenses.push({

            id: Date.now(),

            name: name,

            amount: amount,

            day: day,

            category: category,

            payment: payment

        });

        saveFixedExpenses(
            fixedExpenses
        );

        renderFixedExpenseList();

        document.getElementById(
            "fixedExpenseName"
        ).value = "";

        document.getElementById(
            "fixedExpenseAmount"
        ).value = "";

        document.getElementById(
            "fixedExpenseDay"
        ).value = "";

    }
);

function deleteFixedExpense(
    id
) {

    if (
        !confirm(
            "本当に削除しますか？"
        )
    ) {

        return;

    }

    const fixedExpenses =
        getFixedExpenses()
        .filter(
            item =>
            item.id !== id
        );

    saveFixedExpenses(
        fixedExpenses
    );

    renderFixedExpenseList();

}

function openFixedExpenseEdit(
    id
) {

    const item =
        getFixedExpenses()
        .find(
            expense =>
                expense.id === id
        );

    if (!item) {
        return;
    }

    editingFixedExpenseId =
        id;

    document.getElementById(
        "editFixedName"
    ).value =
        item.name;

    document.getElementById(
        "editFixedAmount"
    ).value =
        item.amount;

    document.getElementById(
        "editFixedDay"
    ).value =
        item.day;

    renderEditFixedPayments();

    renderEditFixedCategories();

    document.getElementById(
        "editFixedCategory"
    ).value =
        item.category;

    document.getElementById(
        "editFixedPayment"
    ).value =
        item.payment;

    document.getElementById(
        "fixedExpenseEditModal"
    ).style.display =
        "flex";

}

document.getElementById(
    "cancelFixedEditButton"
).addEventListener(
    "click",
    function() {

        document.getElementById(
            "fixedExpenseEditModal"
        ).style.display =
            "none";

    }
);

document.getElementById(
    "saveFixedEditButton"
).addEventListener(
    "click",
    function() {

        const fixedExpenses =
            getFixedExpenses();

        const item =
            fixedExpenses.find(
                expense =>
                    expense.id ===
                    editingFixedExpenseId
            );

        if (!item) {
            return;
        }

        const name =
            document.getElementById(
                "editFixedName"
            ).value;

        const amount =
            Number(
                document.getElementById(
                    "editFixedAmount"
                ).value
            );

        const day =
            Number(
                document.getElementById(
                    "editFixedDay"
                ).value
            );

        const category =
            document.getElementById(
                "editFixedCategory"
            ).value;

        const payment =
            document.getElementById(
                "editFixedPayment"
            ).value;

        const isValid =
            validateFixedExpenseInput(
                name,
                amount,
                day,
                category,
                payment
            );

        if (!isValid) {
            return;
        }

        item.name =
            name;

        item.amount =
            amount;

        item.day =
            day;

        item.category =
            category;

        item.payment =
            payment;

        saveFixedExpenses(
            fixedExpenses
        );

        const synced =
            syncFixedExpenseCategories();

        renderFixedExpenseList();

        if (synced) {

            renderExpenses();
            renderCategoryChart();
            renderExpenseAnalysis();
            renderSummaryCards();

        }

        document.getElementById(
            "fixedExpenseEditModal"
        ).style.display =
            "none";

    }
);