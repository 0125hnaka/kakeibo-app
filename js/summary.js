let currentSummaryMonth =
    "";

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

    renderCategoryChart();
    renderSummaryCards();
    renderExpenseAnalysis();
    renderIncomeSummary();
    renderIncomeChart();
    renderAssetAnalysis();

}