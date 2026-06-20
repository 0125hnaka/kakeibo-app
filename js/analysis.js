function renderSummaryCards() {

    const expenses =
        getExpenses();

    let income = 0;
    let expense = 0;

    expenses.forEach(
        function(item) {

            const selectedMonth =
                currentSummaryMonth;

            if (
                item.date.substring(
                    0,
                    7
                ) !== selectedMonth
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

    document.getElementById(
        "incomeTotal"
    ).textContent =
        income.toLocaleString()
        + "円";

    document.getElementById(
        "expenseTotal"
    ).textContent =
        expense.toLocaleString()
        + "円";

    document.getElementById(
        "balanceTotal"
    ).textContent =
        (
            income - expense
        ).toLocaleString()
        + "円";

    const balance =
        getBalance();

    document.getElementById(
        "summarySavingBalance"
    ).textContent =
        balance.toLocaleString()
        + "円";

    let unpaidTotal = 0;

    const payments =
        getPayments();

    const expensesList =
        getExpenses();

    const paidBills =
        getPaidBills();

    payments.forEach(
        function(payment) {

            if (
                payment.type !==
               "credit"
            ) {
                return;
            }

            expensesList.forEach(
                function(expense) {

                    if (
                        expense.payment !==
                        payment.name
                    ) {
                        return;
                    }

                    const paid =
                        paidBills.some(
                            function(bill) {

                               return (
                                    bill.cardName ===
                                    payment.name &&
                                    bill.targetMonth ===
                                    expense.date.substring(
                                        0,
                                        7
                                    )
                                );

                            }
                        );

                    if (!paid) {

                        unpaidTotal +=
                            expense.amount;

                    }

                }
            );

        }
    );

    document.getElementById(
        "summaryUnpaidCard"
    ).textContent =
        unpaidTotal.toLocaleString()
        + "円";


    let fixedTotal = 0;

    getFixedExpenses()
    .forEach(
        function(item) {

            fixedTotal +=
                item.amount;

        }
    );

    document.getElementById(
        "summaryFixedTotal"
    ).textContent =
        fixedTotal.toLocaleString()
        + "円";

}