function renderPaymentSummary() {

    const expenses =
        getExpenses();

    const summary = {};

    const selectedMonth =
    document.getElementById(
        "summaryMonth"
    ).value;

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

    summaryDiv.innerHTML = "";

    for (const payment in summary) {

        const item =
            document.createElement(
                "div"
            );

        item.textContent =
            `${payment} : ${summary[payment]}円`;

        summaryDiv.appendChild(
            item
        );

    }

}

function renderMonthSelector() {

    const expenses =
        getExpenses();

    const monthSelect =
        document.getElementById(
            "summaryMonth"
        );

    monthSelect.innerHTML = "";

    const months = [];

    expenses.forEach(
        function(expense) {

            const month =
                expense.date.substring(
                    0,
                    7
                );

            if (
                !months.includes(month)
            ) {

                months.push(month);

            }

        }
    );

    months.sort().reverse();

    months.forEach(
        function(month) {

            const option =
                document.createElement(
                    "option"
                );

            option.value = month;
            option.textContent = month;

            monthSelect.appendChild(
                option
            );

        }
    );

}

const summaryMonth =
    document.getElementById(
        "summaryMonth"
    );

summaryMonth.addEventListener(
    "change",
    function() {

        renderPaymentSummary();
        renderCreditCardList();

    }
);

function renderCreditCardList() {

    const payments =
        getPayments();

    const expenses =
        getExpenses();

    const paidBills =
        getPaidBills();

    const creditCardList =
        document.getElementById(
            "creditCardList"
        );

    creditCardList.innerHTML = "";

    const creditCards =
        payments.filter(
            function(payment) {

                return (
                    payment.type ===
                    "credit"
                );

            }
        );

    creditCards.forEach(
        function(card) {

            const cardDiv =
                document.createElement(
                    "div"
                );

            const title =
                document.createElement(
                    "h3"
                );

            title.textContent =
                `${card.name}（支払日:${card.paymentDay}日）`;

            cardDiv.appendChild(
                title
            );

            const months = [];

            expenses.forEach(
                function(expense) {

                    if (
                        expense.payment ===
                        card.name
                    ) {

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

                }
            );

            months.sort().reverse();

            months.forEach(
                function(month) {

                    let total = 0;

                    expenses.forEach(
                        function(expense) {

                            if (
                                expense.payment ===
                                    card.name &&
                                expense.date.substring(
                                    0,
                                    7
                                ) === month
                            ) {

                                total +=
                                    expense.amount;

                            }

                        }
                    );

                    const paid =
                        paidBills.some(
                            function(bill) {

                                return (
                                    bill.cardName ===
                                        card.name &&
                                    bill.targetMonth ===
                                        month
                                );

                            }
                        );

                    const item =
                        document.createElement(
                            "div"
                        );

                    item.textContent =
                        `${month} : ` +
                        `${total.toLocaleString()}円 ` +
                        `(${paid ? "請求済" : "未請求"})`;

                    cardDiv.appendChild(
                        item
                    );

                }
            );

            creditCardList.appendChild(
                cardDiv
            );

            creditCardList.appendChild(
                document.createElement(
                    "hr"
                )
            );

        }
    );

}