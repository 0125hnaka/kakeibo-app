const resetButton =
    document.getElementById(
        "resetButton"
    );

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

        localStorage.clear();

        location.reload();

    }
);