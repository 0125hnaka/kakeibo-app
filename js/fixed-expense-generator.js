function generateFixedExpenses() {

    const fixedExpenses =
        getFixedExpenses();

    const expenses =
        getExpenses();

    const today =
        new Date();

    const todayDay =
        today.getDate();

    const year =
        today.getFullYear();

    const month =
        String(
            today.getMonth() + 1
        ).padStart(
            2,
            "0"
        );

    fixedExpenses.forEach(
        function(item) {

            if (
                todayDay <
                item.day
            ) {

                return;

            }

            const date =
                `${year}-${month}-${String(
                    item.day
                ).padStart(
                    2,
                    "0"
                )}`;

            const exists =
                expenses.some(
                    expense =>

                    expense.fixedExpenseId ===
                    item.id &&

                    expense.date ===
                    date
                );

            if (
                exists
            ) {

                return;

            }

            expenses.push({

                id:
                    Date.now() +
                    Math.random(),

                fixedExpenseId:
                    item.id,

                type:
                    "expense",

                amount:
                    item.amount,

                date:
                    date,

                category:
                    "サブスク",

                payment:
                    item.payment

            });

        }
    );

    saveExpenses(
        expenses
    );

}