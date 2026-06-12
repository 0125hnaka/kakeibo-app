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
                "expense-card";

            div.innerHTML =
                `
                <strong>
                    ${item.name}
                </strong>

                <br>

                ${item.amount.toLocaleString()}円

                <br>

                毎月${item.day}日

                <br>

                ${item.payment}

                <br><br>

                <button
                    onclick="
                        deleteFixedExpense(
                            ${item.id}
                        )
                    "
                >
                    削除
                </button>
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