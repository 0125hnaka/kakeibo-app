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

        setActiveBottomTab(
            "inputTab"
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

        setActiveBottomTab(
            "historyTab"
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

        setActiveBottomTab(
            "analysisTab"
        );

        renderSummaryCards();

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

        setActiveBottomTab(
            "settingsTab"
        );

    }
);

function setActiveBottomTab(
    tabId
) {

    document
        .querySelectorAll(
            "#bottomNav button"
        )
        .forEach(
            function(button) {

                button.classList.remove(
                    "bottom-nav-active"
                );

            }
        );

    document.getElementById(
        tabId
    ).classList.add(
        "bottom-nav-active"
    );

}