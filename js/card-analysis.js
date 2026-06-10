let cardAnalysisMonth = "";

function initializeCardAnalysis() {

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

    cardAnalysisMonth =
        months[0] || "";

    updateCardAnalysis();

}

function updateCardAnalysis() {

    const title =
        document.getElementById(
            "cardMonthTitle"
        );

    if (!title) {
        return;
    }

    title.textContent =
        cardAnalysisMonth;

    renderCardUsage();
    renderCardBilling();

}

function renderCardUsage() {

    const expenses =
        getExpenses();

    const usageByCard =
        {};

    let total = 0;

    expenses.forEach(
        function(expense) {

            if (
                expense.date.substring(
                    0,
                    7
                ) !==
                cardAnalysisMonth
            ) {
                return;
            }

            const payment =
                getPayments()
                .find(
                    p =>
                    p.name ===
                    expense.payment
                );

            if (
                !payment ||
                payment.type !==
                "credit"
            ) {
                return;
            }

            if (
                !usageByCard[
                    expense.payment
                ]
            ) {

                usageByCard[
                    expense.payment
                ] = 0;

            }

            usageByCard[
                expense.payment
            ] += expense.amount;

            total +=
                expense.amount;

        }
    );

    document.getElementById(
        "cardBillingTotal"
    ).innerHTML =
        `
        <div>
            合計請求額
        </div>

        <div class="card-total">
            ${total.toLocaleString()}円
        </div>
        `;

    const list =
        document.getElementById(
            "cardUsageList"
        );

    list.innerHTML = "";

    for (
        const card
        in usageByCard
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
                ${card}
            </span>

            <span>
                ${
                    usageByCard[
                        card
                    ].toLocaleString()
                }円
            </span>
            `;

        list.appendChild(
            div
        );

    }

}

function renderCardBilling() {

    const payments =
        getPayments();

    const expenses =
        getExpenses();

    const billingMonthDate =
        new Date(
            cardAnalysisMonth +
            "-01"
        );

    const targetDate =
        new Date(
            billingMonthDate
        );

    targetDate.setMonth(
        targetDate.getMonth() - 1
    );

    const targetMonth =
        targetDate
            .toISOString()
            .substring(
                0,
                7
            );

    const billingByCard =
        {};

    let total = 0;

    payments.forEach(
        function(payment) {

            if (
                payment.type !==
                "credit"
            ) {

                return;

            }

            let cardTotal = 0;

            expenses.forEach(
                function(expense) {

                    if (
                        expense.payment ===
                        payment.name &&

                        expense.date.substring(
                            0,
                            7
                        ) ===
                        targetMonth
                    ) {

                        cardTotal +=
                            expense.amount;

                    }

                }
            );

            if (
                cardTotal > 0
            ) {

                billingByCard[
                    payment.name
                ] = {
                    amount:
                        cardTotal,

                    paymentDay:
                        payment.paymentDay
                };

                total +=
                    cardTotal;

            }

        }
    );

    document.getElementById(
        "cardUsageTotal"
    ).innerHTML =
    `
    <div>
        合計利用額
    </div>

    <div class="card-total">
        ${total.toLocaleString()}円
    </div>
    `;

    const list =
        document.getElementById(
            "cardBillingList"
        );

    list.innerHTML = "";

    for (
        const card
        in billingByCard
    ) {

        const item =
            billingByCard[
                card
            ];

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
                    ${card}
                </strong>

                <br>

                ${item.amount.toLocaleString()}円

            </div>

            <div>

                ${Number(
                    cardAnalysisMonth
                        .substring(5, 7)
                )}
                /
                ${item.paymentDay}

                引落

            </div>
            `;

        list.appendChild(
            div
        );

    }

}

document.getElementById(
    "cardPrevMonth"
).addEventListener(
    "click",
    function() {

        moveCardMonth(
            1
        );

    }
);

document.getElementById(
    "cardNextMonth"
).addEventListener(
    "click",
    function() {

        moveCardMonth(
            -1
        );

    }
);

function moveCardMonth(
    offset
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

    months.sort().reverse();

    const currentIndex =
        months.indexOf(
            cardAnalysisMonth
        );

    const newIndex =
        currentIndex +
        offset;

    if (
        newIndex < 0 ||
        newIndex >=
        months.length
    ) {

        return;

    }

    cardAnalysisMonth =
        months[newIndex];

    updateCardAnalysis();

}