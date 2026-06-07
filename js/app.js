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
            "食費",
            "日用品",
            "交通費",
            "趣味"
        ];

        localStorage.setItem(
            "categories",
            JSON.stringify(defaultCategories)
        );

        return defaultCategories;
    }

    return JSON.parse(data);
}

//カテゴリ表示関数
function renderCategories() {

    const categorySelect =
        document.getElementById("category");

    categorySelect.innerHTML = "";

    const categories =
        getCategories();

    categories.forEach(function(category) {

        const option =
            document.createElement("option");

        option.value = category;
        option.textContent = category;

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

renderCategories();
renderExpenses();