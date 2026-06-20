const resetButton =
    document.getElementById(
        "resetButton"
    );

const appStorageKeys = [
    "expenses",
    "categories",
    "payments",
    "fixedExpenses",
    "paidBills",
    "baseBalance",
    "balance"
];

resetButton.addEventListener(
    "click",
    function() {

        const result =
            confirm(
                "全データを削除しますか？"
            );

        if (!result) {
            return;
        }

        appStorageKeys.forEach(
            function(key) {

                localStorage.removeItem(
                    key
                );

            }
        );

        location.reload();

    }
);