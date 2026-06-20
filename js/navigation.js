function showPage(
    pageId
) {

    [
        "inputPage",
        "historyPage",
        "analysisPage",
        "payslipPage",
        "settingsPage"
    ].forEach(
        function(id) {

            document.getElementById(
                id
            ).style.display =
                "none";

        }
    );

    document.getElementById(
        pageId
    ).style.display =
        "block";

}

function syncBalanceWithBilling() {

    processCreditCardBills();

    renderBalance();

    renderSummaryCards();

    renderAssetAnalysis();

}

document.getElementById(
    "inputTab"
).addEventListener(
    "click",
    function() {

        syncBalanceWithBilling();

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

        syncBalanceWithBilling();

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

        syncBalanceWithBilling();

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
    "payslipTab"
).addEventListener(
    "click",
    function() {

        showPage(
            "payslipPage"
        );

        setActiveBottomTab(
            "payslipTab"
        );

        if (
            typeof renderPayslipList ===
            "function"
        ) {
            renderPayslipList();
        }

    }
);

document.getElementById(
    "settingsTab"
).addEventListener(
    "click",
    function() {

        syncBalanceWithBilling();

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