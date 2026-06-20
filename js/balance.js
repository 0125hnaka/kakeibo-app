function renderBalance() {

    const balance =
        getBalance();

    const balanceDisplay =
        document.getElementById(
            "balanceDisplay"
        );

    balanceDisplay.textContent =
        balance.toLocaleString() +
        "円";

}

const saveBalanceButton =
    document.getElementById(
        "saveBalanceButton"
    );

const recalculateBalanceButton =
    document.getElementById(
        "recalculateBalanceButton"
    );

function refreshBalanceViews() {

    renderBalance();

    renderSummaryCards();

    renderAssetAnalysis();

}

function calculateExpenseDeltaTotal(
    expenses
) {

    if (
        typeof getBalanceDeltaByExpense !==
        "function"
    ) {
        return 0;
    }

    let total = 0;

    expenses.forEach(
        function(expense) {

            total +=
                getBalanceDeltaByExpense(
                    expense
                );

        }
    );

    return total;

}

function calculatePaidBillDeductionTotal(
    expenses,
    paidBills
) {

    let total = 0;

    const seen =
        new Set();

    paidBills.forEach(
        function(bill) {

            const key =
                `${bill.cardName}|${bill.targetMonth}`;

            if (
                seen.has(key)
            ) {
                return;
            }

            seen.add(key);

            expenses.forEach(
                function(expense) {

                    if (
                        expense.payment ===
                            bill.cardName &&
                        expense.date.substring(
                            0,
                            7
                        ) ===
                            bill.targetMonth
                    ) {

                        total +=
                            Number(
                                expense.amount
                            ) || 0;

                    }

                }
            );

        }
    );

    return total;

}

function estimateBaseBalanceFromCurrent() {

    const currentBalance =
        getBalance();

    const expenses =
        getExpenses();

    const paidBills =
        getPaidBills();

    const expenseDeltaTotal =
        calculateExpenseDeltaTotal(
            expenses
        );

    const paidBillDeductionTotal =
        calculatePaidBillDeductionTotal(
            expenses,
            paidBills
        );

    return (
        currentBalance -
        expenseDeltaTotal +
        paidBillDeductionTotal
    );

}

function getOrCreateBaseBalance() {

    const storedBaseBalance =
        getBaseBalance();

    if (
        storedBaseBalance !== null
    ) {
        return storedBaseBalance;
    }

    const estimatedBaseBalance =
        estimateBaseBalanceFromCurrent();

    saveBaseBalance(
        estimatedBaseBalance
    );

    return estimatedBaseBalance;

}

function calculateBaseBalanceForTarget(
    targetBalance
) {

    const expenses =
        getExpenses();

    const paidBills =
        getPaidBills();

    const expenseDeltaTotal =
        calculateExpenseDeltaTotal(
            expenses
        );

    const paidBillDeductionTotal =
        calculatePaidBillDeductionTotal(
            expenses,
            paidBills
        );

    return (
        targetBalance -
        expenseDeltaTotal +
        paidBillDeductionTotal
    );

}

function rebuildBalanceFromBase() {

    const baseBalance =
        getOrCreateBaseBalance();

    const expenses =
        getExpenses();

    const paidBills =
        getPaidBills();

    const expenseDeltaTotal =
        calculateExpenseDeltaTotal(
            expenses
        );

    const paidBillDeductionTotal =
        calculatePaidBillDeductionTotal(
            expenses,
            paidBills
        );

    const rebuiltBalance =
        baseBalance +
        expenseDeltaTotal -
        paidBillDeductionTotal;

    saveBalance(
        rebuiltBalance
    );

}

saveBalanceButton.addEventListener(
    "click",
    function() {

        const balance =
            Number(
                document.getElementById(
                    "balanceInput"
                ).value
            );

        if (
            !Number.isFinite(
                balance
            )
        ) {

            alert(
                "残高を数値で入力してください"
            );

            return;

        }

        const normalizedBaseBalance =
            calculateBaseBalanceForTarget(
                balance
            );

        saveBalance(balance);

        saveBaseBalance(
            normalizedBaseBalance
        );

        refreshBalanceViews();

        document.getElementById(
            "balanceInput"
        ).value = "";

    }
);

if (
    recalculateBalanceButton
) {

    recalculateBalanceButton.addEventListener(
        "click",
        function() {

            rebuildBalanceFromBase();

            processCreditCardBills();

            refreshBalanceViews();

            renderCardBilling();

            alert(
                "残高再計算を実行しました"
            );

        }
    );

}