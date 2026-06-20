// 支出
function getExpenses() {

    const data =
        localStorage.getItem("expenses");

    if (data === null) {
        return [];
    }

    return JSON.parse(data);
}

function saveExpenses(expenses) {

    localStorage.setItem(
        "expenses",
        JSON.stringify(expenses)
    );
}

// カテゴリ
function getCategories() {

    const defaultCategories = [
        // 支出

        {
            name: "食費",
            type: "expense"
        },

        {
            name: "外食費",
            type: "expense"
        },

        {
            name: "交通費",
            type: "expense"
        },

        {
            name: "衣服",
            type: "expense"
        },

        {
            name: "サブスク",
            type: "expense"
        },

        {
            name: "通信費",
            type: "expense"
        },


        {
            name: "交際費",
           type: "expense"
        },

        {
            name: "趣味",
            type: "expense"
        },

        {
            name: "病院",
            type: "expense"
        },

        {
            name: "遊び",
            type: "expense"
        },

        {
            name: "返却",
            type: "expense"
        },

        {
            name: "その他",
            type: "expense"
        },

        {
            name: "口座出金",
            type: "expense"
        },

        {
            name: "デート",
            type: "expense"
        },

        {
            name: "日用品",
            type: "expense"
        },

        {
            name: "投資",
            type: "expense"
        },

        // 収入

        {
            name: "給料",
            type: "income"
        },

        {
            name: "賞与",
            type: "income"
        },

        {
            name: "給与",
            type: "income"
        },

        {
            name: "ボーナス",
            type: "income"
        },

        {
            name: "口座入金",
            type: "income"
        },

        {
            name: "返却",
            type: "income"
        },

        {
            name: "その他",
            type: "income"
        }
    ];

    const data =
        localStorage.getItem("categories");

    if (data === null) {
        localStorage.setItem(
            "categories",
            JSON.stringify(defaultCategories)
        );

        return defaultCategories;
    }

    const storedCategories =
        JSON.parse(data);

    const mergedCategories =
        [...storedCategories];

    let changed = false;

    defaultCategories.forEach(
        function(defaultCategory) {

            const exists =
                mergedCategories.some(
                    function(category) {

                        return (
                            category.name ===
                                defaultCategory.name &&
                            category.type ===
                                defaultCategory.type
                        );

                    }
                );

            if (!exists) {

                mergedCategories.push(
                    defaultCategory
                );

                changed = true;

            }

        }
    );

    if (changed) {

        saveCategories(
            mergedCategories
        );

    }

    return mergedCategories;
}

function saveCategories(categories) {

    localStorage.setItem(
        "categories",
        JSON.stringify(categories)
    );

}

// 支払方法
function getPayments() {

    const data =
        localStorage.getItem("payments");

    if (data === null) {

        const defaultPayments = [

            {
                name: "現金",
                type: "cash"
            },

            {
                name: "PayPay",
                type: "emoney"
            },

            {
                name: "PayPayカード",
                type: "credit",
                paymentDay: 27
            },

            {
                name: "ゴールドNL",
                 type: "credit",
                paymentDay: 26
            },

            {
                name: "AmazonPrimeカード",
                type: "credit",
                paymentDay: 26
            },

            {
                name: "Viewカード",
                type: "credit",
                paymentDay: 4
            }

        ];

        localStorage.setItem(
            "payments",
            JSON.stringify(defaultPayments)
        );

        return defaultPayments;
    }

    return JSON.parse(data);
}

function savePayments(payments) {

    localStorage.setItem(
        "payments",
        JSON.stringify(payments)
    );

}

function getBalance() {

    const balance =
        localStorage.getItem(
            "balance"
        );

    if (balance === null) {
        return 0;
    }

    return Number(balance);

}

function saveBalance(balance) {

    localStorage.setItem(
        "balance",
        balance
    );

}

function getBaseBalance() {

    const baseBalance =
        localStorage.getItem(
            "baseBalance"
        );

    if (baseBalance === null) {
        return null;
    }

    const value =
        Number(baseBalance);

    if (
        !Number.isFinite(value)
    ) {
        return null;
    }

    return value;

}

function saveBaseBalance(
    baseBalance
) {

    localStorage.setItem(
        "baseBalance",
        String(baseBalance)
    );

}

function getPaidBills() {

    const data =
        localStorage.getItem(
            "paidBills"
        );

    if (data === null) {
        return [];
    }

    return JSON.parse(data);

}

function savePaidBills(
    paidBills
) {

    localStorage.setItem(
        "paidBills",
        JSON.stringify(
            paidBills
        )
    );

}

function getFixedExpenses() {

    const data =
        localStorage.getItem(
            "fixedExpenses"
        );

    if (data === null) {
        return [];
    }

    return JSON.parse(data);

}

function saveFixedExpenses(
    fixedExpenses
) {

    localStorage.setItem(
        "fixedExpenses",
        JSON.stringify(
            fixedExpenses
        )
    );

}

function getPayslips() {

    const data =
        localStorage.getItem(
            "payslips"
        );

    if (data === null) {
        return [];
    }

    return JSON.parse(data);

}

function savePayslips(
    payslips
) {

    localStorage.setItem(
        "payslips",
        JSON.stringify(
            payslips
        )
    );

}

const backupData = {

    expenses:
        JSON.parse(
            localStorage.getItem(
                "expenses"
            )
        ) || [],

    categories:
        JSON.parse(
            localStorage.getItem(
                "categories"
            )
        ) || [],

    payments:
        JSON.parse(
            localStorage.getItem(
                "payments"
            )
        ) || [],

    fixedExpenses:
        JSON.parse(
            localStorage.getItem(
                "fixedExpenses"
            )
        ) || [],

    paidBills:
        JSON.parse(
            localStorage.getItem(
                "paidBills"
            )
        ) || [],

    balance:
        Number(
            localStorage.getItem(
                "balance"
            )
        ) || 0

};