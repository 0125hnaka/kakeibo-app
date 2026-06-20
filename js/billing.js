function toYearMonthLocal(date) {

    const year =
        date.getFullYear();

    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");

    return `${year}-${month}`;

}

function getCreditCardBillCandidates(today) {

    const currentDate =
        today ||
        new Date();

    const payments =
        getPayments();

    const expenses =
        getExpenses();

    const paidBills =
        getPaidBills();

    const currentYear =
        currentDate.getFullYear();

    const currentMonth =
        currentDate.getMonth() + 1;

    const previousMonthDate =
        new Date(
            currentYear,
            currentMonth - 2,
            1
        );

    const targetMonth =
        toYearMonthLocal(
            previousMonthDate
        );

    const candidates = [];

    payments.forEach(
        function(payment) {

            if (
                payment.type !==
                "credit"
            ) {
                return;
            }

            const paymentDay =
                Number(
                    payment.paymentDay
                );

            if (
                !Number.isInteger(
                    paymentDay
                ) ||
                paymentDay < 1 ||
                paymentDay > 31
            ) {
                return;
            }

            const billDate =
                new Date(
                    currentYear,
                    currentMonth - 1,
                    paymentDay
                );

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

            candidates.push({
                cardName:
                    payment.name,
                paymentDay:
                    paymentDay,
                targetMonth:
                    targetMonth,
                billDate:
                    billDate,
                total:
                    total,
                isDue:
                    currentDate >=
                    billDate,
                isPaid:
                    alreadyPaid
            });

        }
    );

    candidates.sort(
        function(a, b) {

            return (
                a.paymentDay -
                b.paymentDay
            );

        }
    );

    return candidates;

}

function processCreditCardBills() {

    const paidBills =
        getPaidBills();

    let balance =
        getBalance();

    const today =
        new Date();

    const candidates =
        getCreditCardBillCandidates(
            today
        );

    candidates.forEach(
        function(item) {

            if (
                !item.isDue ||
                item.isPaid
            ) {
                return;
            }

            balance -=
                item.total;

            paidBills.push({
                cardName:
                    item.cardName,
                targetMonth:
                    item.targetMonth
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