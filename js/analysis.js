function renderSummaryCards() {

    const expenses =
        getExpenses();

    let income = 0;
    let expense = 0;

    expenses.forEach(
        function(item) {

            const selectedMonth =
                currentSummaryMonth;

            if (
                item.date.substring(
                    0,
                    7
                ) !== selectedMonth
            ) {

                return;

            }

            if (
                item.type ===
                "income"
            ) {

                income +=
                    item.amount;

            }

            else {

                expense +=
                    item.amount;

            }

        }
    );

    document.getElementById(
        "incomeTotal"
    ).textContent =
        income.toLocaleString()
        + "円";

    document.getElementById(
        "expenseTotal"
    ).textContent =
        expense.toLocaleString()
        + "円";

    document.getElementById(
        "balanceTotal"
    ).textContent =
        (
            income - expense
        ).toLocaleString()
        + "円";

    const balance =
        getBalance();

    document.getElementById(
        "summarySavingBalance"
    ).textContent =
        balance.toLocaleString()
        + "円";

    let unpaidTotal = 0;

    const payments =
        getPayments();

    const expensesList =
        getExpenses();

    const paidBills =
        getPaidBills();

    payments.forEach(
        function(payment) {

            if (
                payment.type !==
               "credit"
            ) {
                return;
            }

            expensesList.forEach(
                function(expense) {

                    if (
                        expense.payment !==
                        payment.name
                    ) {
                        return;
                    }

                    const paid =
                        paidBills.some(
                            function(bill) {

                               return (
                                    bill.cardName ===
                                    payment.name &&
                                    bill.targetMonth ===
                                    expense.date.substring(
                                        0,
                                        7
                                    )
                                );

                            }
                        );

                    if (!paid) {

                        unpaidTotal +=
                            expense.amount;

                    }

                }
            );

        }
    );

    document.getElementById(
        "summaryUnpaidCard"
    ).textContent =
        unpaidTotal.toLocaleString()
        + "円";


    let fixedTotal = 0;

    getFixedExpenses()
    .forEach(
        function(item) {

            fixedTotal +=
                item.amount;

        }
    );

    document.getElementById(
        "summaryFixedTotal"
    ).textContent =
        fixedTotal.toLocaleString()
        + "円";

}

function renderCategoryRanking() {

    const expenses =
        getExpenses();

    const selectedMonth =
        currentSummaryMonth;

    const ranking = {};

    expenses.forEach(
        function(expense) {

            if (
                expense.type !==
                "expense"
            ) {

                return;

            }

            if (
                expense.date.substring(
                    0,
                    7
                ) !== selectedMonth
            ) {

                return;

            }

            if (
                !ranking[
                    expense.category
                ]
            ) {

                ranking[
                    expense.category
                ] = 0;

            }

            ranking[
                expense.category
            ] += expense.amount;

        }
    );

    const sorted =
        Object.entries(
            ranking
        )
        .sort(
            function(a, b) {

                return (
                    b[1] - a[1]
                );

            }
        )
        .slice(0, 5);

    const container =
        document.getElementById(
            "categoryRanking"
        );

    container.innerHTML = "";

    sorted.forEach(
        function(item, index) {

            const div =
                document.createElement(
                    "div"
                );

            div.className =
                "ranking-item";

            div.innerHTML =
                `
                <span>
                    ${index + 1}位
                    ${item[0]}
                </span>

                <span>
                    ${item[1]
                        .toLocaleString()}
                    円
                </span>
                `;

            container.appendChild(
                div
            );

        }
    );

}