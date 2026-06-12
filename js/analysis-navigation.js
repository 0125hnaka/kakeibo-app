document.getElementById(
        "fixedAnalysisPage"
    ).style.display =
        "none";

function showAnalysisPage(
    pageId
) {

    document.getElementById(
        "summaryAnalysisPage"
    ).style.display =
        "none";

    document.getElementById(
        "expenseAnalysisPage"
    ).style.display =
        "none";

    document.getElementById(
        "incomeAnalysisPage"
    ).style.display =
        "none";

    document.getElementById(
        "cardAnalysisPage"
    ).style.display =
        "none";

    document.getElementById(
        "assetAnalysisPage"
    ).style.display =
        "none";

    document.getElementById(
        pageId
    ).style.display =
        "block";

    document
        .querySelectorAll(
            ".analysis-tab"
        )
        .forEach(
            function(tab) {

                tab.classList.remove(
                    "active"
                );

            }
        );
}

document.getElementById(
    "summaryTab"
).addEventListener(
    "click",
    function() {

        showAnalysisPage(
            "summaryAnalysisPage"
        );

        this.classList.add(
            "active"
        );

    }
);

document.getElementById(
    "expenseAnalysisTab"
).addEventListener(
    "click",
    function() {

        showAnalysisPage(
            "expenseAnalysisPage"
        );

        this.classList.add(
            "active"
        );

        renderCategoryChart();

        renderExpenseAnalysis();

    }
);

document.getElementById(
    "incomeAnalysisTab"
).addEventListener(
    "click",
    function() {

        showAnalysisPage(
            "incomeAnalysisPage"
        );

        this.classList.add(
            "active"
        );

        renderIncomeSummary();

        renderIncomeChart();


    }
);

document.getElementById(
    "cardAnalysisTab"
).addEventListener(
    "click",
    function() {

        showAnalysisPage(
            "cardAnalysisPage"
        );

        this.classList.add(
            "active"
        );

    }
);

document.getElementById(
    "assetAnalysisTab"
).addEventListener(
    "click",
    function() {

        showAnalysisPage(
            "assetAnalysisPage"
        );

        this.classList.add(
            "active"
        );

    }
);

document.getElementById(
        "fixedAnalysisTab"
    ).addEventListener(
        "click",
        function() {

            showAnalysisPage(
                "fixedAnalysisPage"
            );

            this.classList.add(
                "active"
            );

            renderFixedAnalysis();

        }
    );
