let editingFixedExpenseId =
    null;

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

        const fixedExpenses =
            getFixedExpenses();

        fixedExpenses.push({

            id:
                Date.now(),

            name:
                document.getElementById(
                    "fixedExpenseName"
                ).value,

            amount:
                Number(
                    document.getElementById(
                        "fixedExpenseAmount"
                    ).value
                ),

            day:
                Number(
                    document.getElementById(
                        "fixedExpenseDay"
                    ).value
                ),

            payment:
                document.getElementById(
                    "fixedExpensePayment"
                ).value

        });

        saveFixedExpenses(
            fixedExpenses
        );

        renderFixedExpenseList();

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

        item.name =
            document.getElementById(
                "editFixedName"
            ).value;

        item.amount =
            Number(
                document.getElementById(
                    "editFixedAmount"
                ).value
            );

        item.day =
            Number(
                document.getElementById(
                    "editFixedDay"
                ).value
            );

        item.payment =
            document.getElementById(
                "editFixedPayment"
            ).value;

        saveFixedExpenses(
            fixedExpenses
        );

        renderFixedExpenseList();

        document.getElementById(
            "fixedExpenseEditModal"
        ).style.display =
            "none";

    }
);