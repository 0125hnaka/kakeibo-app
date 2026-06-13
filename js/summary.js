let currentSummaryMonth =
    "";

function renderPaymentSummary() {

    const expenses =
        getExpenses();

    const summary = {};

    const selectedMonth =
        currentSummaryMonth;

    expenses.forEach(function(expense) {

        if (
            expense.date.substring(0, 7)
            !== selectedMonth
        ) {
            return;
        }

        const payment =
            expense.payment;

        if (!summary[payment]) {

            summary[payment] = 0;

        }

        summary[payment] +=
            expense.amount;

    });

    const summaryDiv =
        document.getElementById(
            "paymentSummary"
        );

    if (!summaryDiv) {
        return;
    }

summaryDiv.innerHTML = "";

    for (const payment in summary) {

        const item =
            document.createElement(
                "div"
            );

        item.textContent =
            `${payment} : ${
                summary[payment]
                    .toLocaleString()
            }円`;

        summaryDiv.appendChild(
            item
        );

    }

}

function renderMonthSelector() {

    const expenses =
        getExpenses();

    const months = [];

    expenses.forEach(
        function(expense) {

            const month =
                expense.date.substring(
                    0,
                    7
                );

            if (
                !months.includes(
                    month
                )
            ) {

                months.push(
                    month
                );

            }

        }
    );

    months.sort().reverse();

    if (
        !currentSummaryMonth
    ) {

        currentSummaryMonth =
            months[0];

    }

    document.getElementById(
        "summaryMonthLabel"
    ).textContent =
        currentSummaryMonth;

}

document.getElementById(
    "summaryPrevMonth"
).addEventListener(
    "click",
    function() {

        changeSummaryMonth(
            -1
        );

    }
);

document.getElementById(
    "summaryNextMonth"
).addEventListener(
    "click",
    function() {

        changeSummaryMonth(
            1
        );

    }
);

function changeSummaryMonth(
    direction
) {

    const expenses =
        getExpenses();

    const months = [];

    expenses.forEach(
        function(expense) {

            const month =
                expense.date.substring(
                    0,
                    7
                );

            if (
                !months.includes(
                    month
                )
            ) {

                months.push(
                    month
                );

            }

        }
    );

    months.sort();

    const currentIndex =
        months.indexOf(
            currentSummaryMonth
        );

    const nextIndex =
        currentIndex +
        direction;

    if (
        nextIndex < 0 ||
        nextIndex >= months.length
    ) {

        return;

    }

    currentSummaryMonth =
        months[nextIndex];

    document.getElementById(
        "summaryMonthLabel"
    ).textContent =
        currentSummaryMonth;

    renderPaymentSummary();
    renderCategoryChart();
    renderSummaryCards();
    renderExpenseAnalysis();
    renderExpensePaymentSummary();
    renderIncomeRanking();
    renderIncomeSummary();
    renderIncomeChart();
    renderAssetAnalysis();

}