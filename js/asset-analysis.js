function renderAssetAnalysis() {

    const balance =
        getBalance();

    document.getElementById(
        "savingBalance"
    ).textContent =
        balance.toLocaleString()
        + "円";

    const selectedMonth =
        document.getElementById(
            "summaryMonth"
        ).value;

    const expenses =
        getExpenses();

    let income = 0;
    let expense = 0;

    expenses.forEach(
        function(item) {

            if (
                item.date.substring(
                    0,
                    7
                ) !==
                selectedMonth
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

    const monthlyChange =
        income - expense;

    const changeElement =
        document.getElementById(
            "savingMonthlyChange"
        );

    changeElement.textContent =
        monthlyChange
            .toLocaleString()
        + "円";

    if (
        monthlyChange >= 0
    ) {

        changeElement.style.color =
            "#096aba";

    }

    else {

        changeElement.style.color =
            "#d32f2f";

    }

        renderAssetChart();

}

let assetChart = null;

function renderAssetChart() {

    const expenses =
        getExpenses();

    const monthlyData =
        {};

    expenses.forEach(
        function(item) {

            const month =
                item.date.substring(
                    0,
                    7
                );

            if (
                !monthlyData[month]
            ) {

                monthlyData[month] = {
                    income: 0,
                    expense: 0
                };

            }

            if (
                item.type ===
                "income"
            ) {

                monthlyData[
                    month
                ].income +=
                    item.amount;

            }

            else {

                monthlyData[
                    month
                ].expense +=
                    item.amount;

            }

        }
    );

    const months =
        Object.keys(
            monthlyData
        ).sort();

    const balances =
        [];

    let runningBalance =
        getBalance();

    for (
        let i =
            months.length - 1;
        i >= 0;
        i--
    ) {

        balances[i] =
            runningBalance;

        const month =
            months[i];

        runningBalance -=
            monthlyData[
                month
            ].income;

        runningBalance +=
            monthlyData[
                month
            ].expense;

    }

    const canvas =
        document.getElementById(
            "assetChart"
        );

    if (!canvas) {
        return;
    }

    renderAssetHistory(
        months,
        balances
    );

    if (
        assetChart
    ) {

        assetChart.destroy();

    }

    assetChart =
        new Chart(
            canvas,
            {
                type: "bar",

                data: {

                    labels:
                        months,

                    datasets: [
                        {

                            label:
                                "残高",

                            data:
                                balances

                        }
                    ]

                }

            }
        );

}

function renderAssetHistory(
    months,
    balances
) {

    const history =
        document.getElementById(
            "assetHistory"
        );

    if (!history) {
        return;
    }

    history.innerHTML = "";

    for (
        let i =
            months.length - 1;
        i >= 0;
        i--
    ) {

        const item =
            document.createElement(
                "div"
            );

        item.className =
            "ranking-item";

        item.innerHTML =
            `
            <span>
                ${months[i]}
            </span>

            <span>
                ${balances[i]
                    .toLocaleString()}円
            </span>
            `;

        history.appendChild(
            item
        );

    }

}