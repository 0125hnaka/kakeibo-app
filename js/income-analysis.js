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

function renderIncomeRanking() {

    const expenses =
        getExpenses();

    const selectedMonth =
        currentSummaryMonth;

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

        const percent =
            total === 0
            ? 0
            :
            (
                summary[
                    category
                ]
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

            ${
                summary[
                    category
                ].toLocaleString()
            }円

        </div>

        <div>

            ${percent.toFixed(
                1
            )}%

        </div>
        `;

        container.appendChild(
            div
        );

    }

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