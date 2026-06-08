function renderCategoryChart() {

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
            "categoryChart"
        );

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
                            data: values
                        }
                    ]
                }
            }
        );

}