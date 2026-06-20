let incomeAnalysisMonth = "";

function initializeIncomeAnalysis() {

    const expenses =
        getExpenses();

    const months =
        [
            ...new Set(
                expenses.map(
                    expense =>
                    expense.date.substring(
                        0,
                        7
                    )
                )
            )
        ];

    months.sort().reverse();

    incomeAnalysisMonth =
        months[0] || "";

    updateIncomeMonthTitle();

}

function updateIncomeMonthTitle() {

    const title =
        document.getElementById(
            "incomeMonthTitle"
        );

    if (!title) {
        return;
    }

    title.textContent =
        incomeAnalysisMonth;

}

function renderIncomeSummary() {

    const expenses =
        getExpenses();

    const selectedMonth =
        incomeAnalysisMonth;

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

    let total = 0;

    Object.values(
        summary
    ).forEach(
        amount => {

            total += amount;

        }
    );

    document.getElementById(
        "incomeTotalDisplay"
    ).innerHTML =
    `
        <div>
            収入合計
        </div>

        <div
            class="card-total"
        >
            ${total.toLocaleString()}円
        </div>
        `;

    const container =
        document.getElementById(
            "incomeSummary"
        );

    if (!container) {
        return;
    }

    container.innerHTML = "";

    Object.entries(
        summary
    )
    .sort(
        function(a, b) {

            return (
                b[1] - a[1]
            );

        }
    )
    .forEach(
        function(item) {

        const category =
            item[0];

        const amount =
            item[1];

        const div =
            document.createElement(
                "div"
            );

        div.className =
            "ranking-item";

        const percent =
            total === 0
            ? 0
            :
            (
                amount
                /
                total
            ) * 100;

        div.innerHTML =
        `
        <div>

            <strong>
                ${category}
            </strong>

            <br>

            ${amount.toLocaleString()}円

        </div>

        <div>

            <span class="credit-card-percent">
                ${percent.toFixed(
                    1
                )}%
            </span>

        </div>
        `;

        container.appendChild(
            div
        );

        }
    );

}

document.getElementById(
    "incomePrevMonth"
).addEventListener(
    "click",
    function() {

        moveIncomeMonth(
            -1
        );

    }
);

document.getElementById(
    "incomeNextMonth"
).addEventListener(
    "click",
    function() {

        moveIncomeMonth(
            1
        );

    }
);

function moveIncomeMonth(
    direction
) {

    const expenses =
        getExpenses();

    const months =
        [
            ...new Set(
                expenses.map(
                    expense =>
                    expense.date.substring(
                        0,
                        7
                    )
                )
            )
        ];

    months.sort();

    const currentIndex =
        months.indexOf(
            incomeAnalysisMonth
        );

    const nextIndex =
        currentIndex +
        direction;

    if (
        nextIndex < 0 ||
        nextIndex >=
        months.length
    ) {

        return;

    }

    incomeAnalysisMonth =
        months[
            nextIndex
        ];

    updateIncomeMonthTitle();

    renderIncomeSummary();

    renderIncomeChart();

}