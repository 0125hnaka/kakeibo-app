console.log("家計簿アプリ起動");

const today = new Date()
    .toISOString()
    .split("T")[0];

document.getElementById("date").value =
    today;

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

        console.log("金額:", amount);
        console.log("日付:", date);
        console.log("カテゴリ:", category);
        console.log("支払方法:", payment);

    }
);