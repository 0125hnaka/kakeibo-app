let expenseAnalysisMonth =
    "";

function initializeExpenseAnalysis() {

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

    expenseAnalysisMonth =
        months[0] || "";

    updateExpenseMonthTitle();

}

function updateExpenseMonthTitle() {

    const title =
        document.getElementById(
            "expenseMonthTitle"
        );

    if (!title) {
        return;
    }

    title.textContent =
        expenseAnalysisMonth;

}

function renderExpenseAnalysis() {

    console.log(
        "renderExpenseAnalysis"
    );

    const expenses =
        getExpenses();

    const selectedMonth =
        expenseAnalysisMonth;
        
    const categoryTotals =
        {};

    let total = 0;

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
                !categoryTotals[
                    expense.category
                ]
            ) {

                categoryTotals[
                    expense.category
                ] = 0;

            }

            categoryTotals[
                expense.category
            ] += expense.amount;

            total +=
                expense.amount;

        }
    );

    document.getElementById(
        "expenseTotalDisplay"
    ).innerHTML =
        `
        <div>
            支出合計
        </div>

        <div
            class="card-total"
        >
            ${total.toLocaleString()}円
        </div>
        `;

    const container =
        document.getElementById(
            "expenseCategoryList"
        );

    container.innerHTML =
        "";

    Object.entries(
        categoryTotals
    )
    .sort(
        (
            a,
            b
        ) =>
        b[1] - a[1]
    )
    .forEach(
        function(item) {

            const percent =
                total === 0
                ? 0
                :
                (
                    item[1]
                    /
                    total
                ) * 100;

            const div =
                document.createElement(
                    "div"
                );

            div.className =
                "ranking-item";

            div.innerHTML =
                `
                <div>

                    <strong>
                        ${item[0]}
                    </strong>

                    <br>

                    ${item[1]
                        .toLocaleString()}円

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
    );

}

function renderExpensePaymentSummary() {

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
                !summary[
                    expense.payment
                ]
            ) {

                summary[
                    expense.payment
                ] = 0;

            }

            summary[
                expense.payment
            ] += expense.amount;

        }
    );

    const container =
        document.getElementById(
            "expensePaymentSummary"
        );

    if (!container) {
        return;
    }

    container.innerHTML = "";

    for (
        const payment
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
                ${payment}
            </span>

            <span>
                ${summary[
                    payment
                ].toLocaleString()}円
            </span>
            `;

        container.appendChild(
            div
        );

    }

}

document.getElementById(
    "expensePrevMonth"
).addEventListener(
    "click",
    function() {

        moveExpenseMonth(
            -1
        );

    }
);

document.getElementById(
    "expenseNextMonth"
).addEventListener(
    "click",
    function() {

        moveExpenseMonth(
            1
        );

    }
);

function moveExpenseMonth(
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
            expenseAnalysisMonth
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

    expenseAnalysisMonth =
        months[
            nextIndex
        ];

    updateExpenseMonthTitle();

    renderExpenseAnalysis();

    renderCategoryChart();

}