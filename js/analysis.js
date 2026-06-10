function renderSummaryCards() {

    const expenses =
        getExpenses();

    let income = 0;
    let expense = 0;

    expenses.forEach(
        function(item) {

            const selectedMonth =
                document.getElementById(
                    "summaryMonth"
                ).value;

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

}

function renderCategoryRanking() {

    const expenses =
        getExpenses();

    const selectedMonth =
        document.getElementById(
            "summaryMonth"
        ).value;

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