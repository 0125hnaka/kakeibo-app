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
        "cardUsageTotal"
    ).innerHTML =
    `
    <div class="credit-total-title">
        合計利用額
    </div>

    <div class="credit-total-value">
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
            "credit-card-item";

        const payment =
            getPayments().find(
                function(p) {

                    return (
                        p.name ===
                        card
                    );

                }
            );

        const ratio =
            (
                usageByCard[card]
                /
                total
                *
                100
            ).toFixed(1);

        div.innerHTML =
        `
        <div class="credit-card-header">

            <div>

                <div class="credit-card-name">
                    ${card}
                </div>

                <div class="credit-card-amount">
                    ${usageByCard[card].toLocaleString()}円
                </div>

            </div>

            <div class="credit-card-info">

                支払日 ${payment?.paymentDay || "-"}日

                <br>

                <span class="credit-card-percent">
                    ${ratio}%
                </span>

            </div>

        </div>
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
        "cardBillingTotal"
    ).innerHTML =
    `
    <div class="credit-total-title">
        合計請求額
    </div>

    <div class="credit-total-value">
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

        const ratio =
            (
                item.amount
                /
                total
                *
                100
            ).toFixed(1);

        const div =
            document.createElement(
                "div"
            );

        div.className =
            "credit-card-item";

        div.innerHTML =
        `
        <div class="credit-card-header">

            <div>

                <div class="credit-card-name">
                    ${card}
                </div>

                <div class="credit-card-amount">
                    ${item.amount.toLocaleString()}円
                </div>

            </div>

            <div class="credit-card-info">

                支払日 ${item.paymentDay}日

                 <br>

                <span class="credit-card-percent">
                    ${ratio}%
                </span>

            </div>

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