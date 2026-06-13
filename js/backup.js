document
.getElementById(
    "exportDataButton"
)
.addEventListener(
    "click",
    exportBackup
);

function exportBackup() {

    const backupData = {

        expenses:
            JSON.parse(
                localStorage.getItem(
                    "expenses"
                )
            ) || [],

        categories:
            JSON.parse(
                localStorage.getItem(
                    "categories"
                )
            ) || [],

        payments:
            JSON.parse(
                localStorage.getItem(
                    "payments"
                )
            ) || [],

        fixedExpenses:
            JSON.parse(
                localStorage.getItem(
                    "fixedExpenses"
                )
            ) || [],

        paidBills:
            JSON.parse(
                localStorage.getItem(
                    "paidBills"
                )
            ) || [],

        balance:
            JSON.parse(
                localStorage.getItem(
                    "balance"
                )
            ) || 0

    };

    const blob =
        new Blob(
            [
                JSON.stringify(
                    backupData,
                    null,
                    2
                )
            ],
            {
                type:
                "application/json"
            }
        );

    const url =
        URL.createObjectURL(
            blob
        );

    const a =
        document.createElement(
            "a"
        );

    a.href = url;

    a.download =
        `kakeibo_backup_${
            new Date()
            .toISOString()
            .slice(0,10)
        }.json`;

    a.click();

    URL.revokeObjectURL(
        url
    );

}

document
.getElementById(
    "importDataButton"
)
.addEventListener(
    "click",
    function() {

        document
        .getElementById(
            "importFile"
        )
        .click();

    }
);

document
.getElementById(
    "importFile"
)
.addEventListener(
    "change",
    importBackup
);

function importBackup(
    event
) {

    const file =
        event.target.files[0];

    if (!file) {
        return;
    }

    const reader =
        new FileReader();

    reader.onload =
        function(e) {

            const data =
                JSON.parse(
                    e.target.result
                );

            localStorage.setItem(
                "expenses",
                JSON.stringify(
                    data.expenses
                )
            );

            localStorage.setItem(
                "paidBills",
                JSON.stringify(
                    data.paidBills || []
                )
            );

            localStorage.setItem(
                "categories",
                JSON.stringify(
                    data.categories
                )
            );

            localStorage.setItem(
                "payments",
                JSON.stringify(
                    data.payments
                )
            );

            localStorage.setItem(
                "fixedExpenses",
                JSON.stringify(
                    data.fixedExpenses
                )
            );

           localStorage.setItem(
                "balance",
                data.balance
            );

            alert(
                "復元完了"
            );

            location.reload();

        };

    reader.readAsText(
        file
    );

}