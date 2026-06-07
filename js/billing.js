function processCreditCardBills() {

    const payments =
        getPayments();

    const expenses =
        getExpenses();

    const paidBills =
        getPaidBills();

    let balance =
        getBalance();

    const today =
        new Date();

    payments.forEach(
        function(payment) {

            if (
                payment.type !==
                "credit"
            ) {
                return;
            }

            const currentYear =
                today.getFullYear();

            const currentMonth =
                today.getMonth() + 1;

            const previousMonthDate =
                new Date(
                    currentYear,
                    currentMonth - 2,
                    1
                );

            const targetMonth =
                previousMonthDate
                    .toISOString()
                    .substring(0, 7);

            const billDate =
                new Date(
                    currentYear,
                    currentMonth - 1,
                    payment.paymentDay
                );

            if (
                today <
                billDate
            ) {
                return;
            }

            const alreadyPaid =
                paidBills.some(
                    function(bill) {

                        return (
                            bill.cardName ===
                            payment.name &&

                            bill.targetMonth ===
                            targetMonth
                        );

                    }
                );

            if (
                alreadyPaid
            ) {
                return;
            }

            let total = 0;

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

                        total +=
                            expense.amount;

                    }

                }
            );

            balance -= total;

            paidBills.push({
                cardName:
                    payment.name,

                targetMonth:
                    targetMonth
            });

        }
    );

    saveBalance(
        balance
    );

    savePaidBills(
        paidBills
    );

}