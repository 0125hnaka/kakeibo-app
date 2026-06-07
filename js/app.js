console.log("家計簿アプリ起動");

const today = new Date()
    .toISOString()
    .split("T")[0];

document.getElementById("date").value =
    today;

//DBへデータ取得関数
function getExpenses() {

    const data =
        localStorage.getItem("expenses");

    if (data === null) {
        return [];
    }

    return JSON.parse(data);
}

//DBへの保存関数
function saveExpenses(expenses) {

    localStorage.setItem(
        "expenses",
        JSON.stringify(expenses)
    );
}

//カテゴリ追加関数
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
            }
        ];

        localStorage.setItem(
            "categories",
            JSON.stringify(defaultCategories)
        );

        return defaultCategories;
    }

    return JSON.parse(data);
}

function getPayments() {

    const data =
        localStorage.getItem("payments");

    if (data === null) {

        const defaultPayments = [
            "現金",
            "PayPay",
            "楽天カード"
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

function renderPayments() {

    const paymentSelect =
        document.getElementById("payment");

    paymentSelect.innerHTML = "";

    const payments =
        getPayments();

    payments.forEach(function(payment) {

        const option =
            document.createElement("option");

        option.value = payment;

        option.textContent = payment;

        paymentSelect.appendChild(option);

    });

}

function saveCategories(categories) {

    localStorage.setItem(
        "categories",
        JSON.stringify(categories)
    );

}

//カテゴリ表示関数
function renderCategories() {

    const categorySelect =
        document.getElementById("category");

    categorySelect.innerHTML = "";

    const transactionType =
        document.querySelector(
            'input[name="transactionType"]:checked'
        ).value;

    const categories =
        getCategories();

    categories.forEach(function(category) {

        if (category.type !== transactionType) {
            return;
        }

        const option =
            document.createElement("option");

        option.value =
            category.name;

        option.textContent =
            category.name;

        categorySelect.appendChild(option);

    });

}

function renderExpenses() {

    const expenses = getExpenses();

    const expenseList =
        document.getElementById("expenseList");

    expenseList.innerHTML = "";

    expenses.forEach(function(expense) {

        const item =
            document.createElement("div");

        item.textContent =
            `[${expense.type}] ` +
            `${expense.date} | ` +
            `${expense.category} | ` +
            `${expense.amount}円 | ` +
            `${expense.payment}`;

        expenseList.appendChild(item);

    });

}

//保存ボタンの設定
const saveButton =
    document.getElementById("saveButton");

saveButton.addEventListener(
    "click",
    function () {

        const amount =
            document.getElementById("amount").value;

        const date =
            document.getElementById("date").value;

        const category =
            document.getElementById("category").value;

        const payment =
            document.getElementById("payment").value;

        const transactionType =
            document.querySelector(
            'input[name="transactionType"]:checked'
            ).value;

        const expense = {
            type: transactionType,
            amount: Number(amount),
            date: date,
            category: category,
            payment: payment
        };
        const expenses = getExpenses();
        expenses.push(expense);
        saveExpenses(expenses);
        renderExpenses();
        document.getElementById("amount").value = "";
        document.getElementById("category").selectedIndex = 0;
        document.getElementById("payment").selectedIndex = 0;
        console.log(expenses);
    }
);

const addCategoryButton =
    document.getElementById(
        "addCategoryButton"
    );

addCategoryButton.addEventListener(
    "click",
    function() {

        const newCategory =
            document.getElementById(
                "newCategory"
            ).value.trim();

        if (newCategory === "") {
            return;
        }

        const categories =
            getCategories();

        const categoryType =
            document.querySelector(
                'input[name="categoryType"]:checked'
            ).value;

        const exists = categories.some(
            function(category) {

                return (
                    category.name === newCategory &&
                    category.type === categoryType
                );

            }
        );

        if (exists) {
            alert(
                "既に存在するカテゴリです"
            );

            return;
        }

        categories.push({
            name: newCategory,
            type: categoryType
        });

        saveCategories(categories);

        renderCategories();

        document.getElementById(
            "newCategory"
        ).value = "";

    }
);

const transactionTypeRadios =
    document.querySelectorAll(
        'input[name="transactionType"]'
    );

transactionTypeRadios.forEach(
    function(radio) {

        radio.addEventListener(
            "change",
            function() {

                renderCategories();

            }
        );

    }
);

const addPaymentButton =
    document.getElementById(
        "addPaymentButton"
    );

addPaymentButton.addEventListener(
    "click",
    function() {

        const newPayment =
            document.getElementById(
                "newPayment"
            ).value.trim();

        if (newPayment === "") {
            return;
        }

        const payments =
            getPayments();

        if (
            payments.includes(
                newPayment
            )
        ) {

            alert(
                "既に存在します"
            );

            return;
        }

        payments.push(
            newPayment
        );

        savePayments(
            payments
        );

        renderPayments();

        document.getElementById(
            "newPayment"
        ).value = "";

    }
);

function renderPaymentSummary() {

    const expenses =
        getExpenses();

    const summary = {};

    expenses.forEach(function(expense) {

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


renderCategories();
renderPayments();
renderExpenses();
renderPaymentSummary();