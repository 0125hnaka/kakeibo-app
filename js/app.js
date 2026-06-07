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

//保存後フォームを初期化
document.getElementById("amount").value = "";
document.getElementById("category").selectedIndex = 0;
document.getElementById("payment").selectedIndex = 0;


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

        const expense = {
            amount: Number(amount),
            date: date,
            category: category,
            payment: payment
        };
        const expenses = getExpenses();
        expenses.push(expense);
        saveExpenses(expenses);
        console.log(expenses);
    }
);