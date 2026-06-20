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

        schemaVersion: 2,

        exportedAt:
            new Date()
            .toISOString(),

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

        baseBalance:
            Number(
                localStorage.getItem(
                    "baseBalance"
                )
            ) || null,

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

    function isArray(value) {

        return Array.isArray(value);

    }

    function isFiniteNumber(value) {

        return Number.isFinite(
            Number(value)
        );

    }

    function validateBackupData(data) {

        if (
            typeof data !== "object" ||
            data === null
        ) {
            return false;
        }

        if (
            !isArray(data.expenses) ||
            !isArray(data.categories) ||
            !isArray(data.payments) ||
            !isArray(data.fixedExpenses)
        ) {
            return false;
        }

        if (
            data.paidBills !== undefined &&
            !isArray(data.paidBills)
        ) {
            return false;
        }

        if (
            data.balance !== undefined &&
            !isFiniteNumber(
                data.balance
            )
        ) {
            return false;
        }

        if (
            data.baseBalance !== undefined &&
            data.baseBalance !== null &&
            !isFiniteNumber(
                data.baseBalance
            )
        ) {
            return false;
        }

        return true;

    }

    reader.onload =
        function(e) {

            let data;

            try {

                data = JSON.parse(
                    e.target.result
                );

            }

            catch (error) {

                alert(
                    "バックアップJSONの形式が不正です"
                );

                return;

            }

            if (
                !validateBackupData(
                    data
                )
            ) {

                alert(
                    "バックアップデータの項目が不足または不正です"
                );

                return;

            }

            const normalizedBalance =
                isFiniteNumber(
                    data.balance
                )
                ? Number(data.balance)
                : 0;

            const normalizedBaseBalance =
                isFiniteNumber(
                    data.baseBalance
                )
                ? Number(data.baseBalance)
                : normalizedBalance;

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
                "baseBalance",
                String(
                    normalizedBaseBalance
                )
            );

           localStorage.setItem(
                "balance",
                String(
                    normalizedBalance
                )
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