function renderIncomeRanking() {

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
                "income"
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
        );

    const container =
        document.getElementById(
            "incomeRanking"
        );

    if (!container) {
        return;
    }

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

function renderIncomeSummary() {

    const expenses =
        getExpenses();

    const selectedMonth =
        document.getElementById(
            "summaryMonth"
        ).value;

    const summary = {};

    expenses.forEach(
        function(expense) {

            if (
                expense.type !==
                "income"
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
                !summary[
                    expense.category
                ]
            ) {

                summary[
                    expense.category
                ] = 0;

            }

            summary[
                expense.category
            ] += expense.amount;

        }
    );

    const container =
        document.getElementById(
            "incomeSummary"
        );

    if (!container) {
        return;
    }

    container.innerHTML = "";

    for (
        const category
        in summary
    ) {

        const div =
            document.createElement(
                "div"
            );

        div.className =
            "ranking-item";

        div.innerHTML =
            `
            <span>
                ${category}
            </span>

            <span>
                ${summary[
                    category
                ].toLocaleString()}円
            </span>
            `;

        container.appendChild(
            div
        );

    }

}