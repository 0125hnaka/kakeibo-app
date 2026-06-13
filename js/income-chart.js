function renderIncomeChart() {

    const expenses =
        getExpenses();

    const selectedMonth =
        currentSummaryMonth;

    const categoryTotals =
        {};

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

        }
    );

    const canvas =
        document.getElementById(
            "incomeCategoryChart"
        );

    if (!canvas) {
        return;
    }

    const ctx =
        canvas.getContext("2d");

    if (
        window.incomeChart
    ) {

        window.incomeChart.destroy();

    }

    window.incomeChart =
        new Chart(
            ctx,
            {
                type: "pie",

                data: {

                    labels:
                        Object.keys(
                            categoryTotals
                        ),

                    datasets: [
                        {
                            data:
                                Object.values(
                                    categoryTotals
                                )
                        }
                    ]

                }

            }
        );

}