function renderCategoryChart() {

    const expenses =
        getExpenses();

    const selectedMonth =
        expenseAnalysisMonth;

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

    const labels =
        Object.keys(summary);

    const values =
        Object.values(summary);

    const canvas =
        document.getElementById(
            "expenseCategoryChart"
        );

    if (
        window.categoryChart &&
        typeof window.categoryChart.destroy
        === "function"
    ) {

        window.categoryChart.destroy();

    }

    if (!canvas) {
        return;
    }

    window.categoryChart =
        new Chart(
            canvas,
            {
                type: "pie",

                data: {

                    labels: labels,

                    datasets: [
                        {
                            data: values,

                            backgroundColor: [
                            "#4CAF50",
                            "#2196F3",
                            "#FF9800",
                            "#9C27B0",
                            "#F44336",
                            "#00BCD4",
                            "#795548",
                            "#607D8B",
                            "#8BC34A",
                            "#FFC107"
                            ]
                        }
                    ]
                }
            }
        );

}