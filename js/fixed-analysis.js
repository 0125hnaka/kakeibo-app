let fixedAnalysisMonth =
    "";

function initializeFixedAnalysis() {

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

    fixedAnalysisMonth =
        months[0] || "";

    updateFixedMonthTitle();

}

function updateFixedMonthTitle() {

    const title =
        document.getElementById(
            "fixedMonthTitle"
        );

    if (!title) {
        return;
    }

    title.textContent =
        fixedAnalysisMonth;

}

function renderFixedAnalysis() {

    const fixedExpenses =
        getFixedExpenses();

    let total = 0;

    fixedExpenses
    .slice()
    .sort(
        function(a, b) {

            return (
                b.amount -
                a.amount
            );

        }
    )
    .forEach(
        function(item) {

            total +=
                item.amount;

        }
    );

    document.getElementById(
        "fixedTotalDisplay"
    ).innerHTML =
        `
        <div>
            固定費合計
        </div>

        <div
            class="card-total"
        >
            ${total.toLocaleString()}円
        </div>
        `;

    const list =
        document.getElementById(
            "fixedCategoryList"
        );

    list.innerHTML = "";

    fixedExpenses.forEach(
        function(item) {

            const percent =
                total === 0
                ? 0
                :
                (
                    item.amount
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
                        ${item.name}
                    </strong>

                    <br>

                    ${item.amount.toLocaleString()}円

                    <br>

                    ${item.day}日

                </div>

                <div>

                    <span class="credit-card-percent">
                        ${percent.toFixed(
                            1
                        )}%
                    </span>

                </div>
                `;

            list.appendChild(
                div
            );

        }
    );

}