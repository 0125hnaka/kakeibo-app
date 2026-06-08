console.log(
    document.getElementById(
        "inputTab"
    )
);

function showPage(
    pageId
) {

    document.getElementById(
        "inputPage"
    ).style.display =
        "none";

    document.getElementById(
        "historyPage"
    ).style.display =
        "none";

    document.getElementById(
        "analysisPage"
    ).style.display =
        "none";

    document.getElementById(
        "settingsPage"
    ).style.display =
        "none";

    document.getElementById(
        pageId
    ).style.display =
        "block";

}

document.getElementById(
    "inputTab"
).addEventListener(
    "click",
    function() {

        showPage(
            "inputPage"
        );

    }
);

document.getElementById(
    "historyTab"
).addEventListener(
    "click",
    function() {

        showPage(
            "historyPage"
        );

    }
);

document.getElementById(
    "analysisTab"
).addEventListener(
    "click",
    function() {

        showPage(
            "analysisPage"
        );

    }
);

document.getElementById(
    "settingsTab"
).addEventListener(
    "click",
    function() {

        showPage(
            "settingsPage"
        );

    }
);