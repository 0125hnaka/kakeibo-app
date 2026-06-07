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

    const data =
        localStorage.getItem("categories");

    if (data === null) {

        const defaultCategories = [
            {
                name: "食費",
                type: "expense"
            },
            {
                name: "日用品",
                type: "expense"
            },
            {
                name: "交通費",
                type: "expense"
            },
            {
                name: "趣味",
                type: "expense"
            },
            {
                name: "給与",
                type: "income"
            },
            { 
                name:"ボーナス",
                type:"income"
            },
            {
                name:"口座入金",
                type:"income"
            },
            {
                name:"口座出金",
                type:"expense"
            },
        ];

        localStorage.setItem(
            "categories",
            JSON.stringify(defaultCategories)
        );

        return defaultCategories;
    }

    return JSON.parse(data);
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
                name: "楽天カード",
                type: "credit",
                paymentDay: 27
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