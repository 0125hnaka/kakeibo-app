function renderBalance() {

    const balance =
        getBalance();

    const balanceDisplay =
        document.getElementById(
            "balanceDisplay"
        );

    balanceDisplay.textContent =
        balance.toLocaleString() +
        "円";

}

const saveBalanceButton =
    document.getElementById(
        "saveBalanceButton"
    );

saveBalanceButton.addEventListener(
    "click",
    function() {

        const balance =
            Number(
                document.getElementById(
                    "balanceInput"
                ).value
            );

        saveBalance(balance);

        renderBalance();

        document.getElementById(
            "balanceInput"
        ).value = "";

    }
);

function recalculateBalance() {

    const expenses =
        getExpenses();

    let balance = 0;

    expenses.forEach(
        function(expense) {

            if (
                expense.category ===
                    "給与" ||
                expense.category ===
                    "ボーナス" ||
                expense.category ===
                    "口座入金"
            ) {

                balance +=
                    expense.amount;

            }

            if (
                expense.category ===
                "口座出金"
            ) {

                balance -=
                    expense.amount;

            }

        }
    );

    saveBalance(
        balance
    );

    renderBalance();

}