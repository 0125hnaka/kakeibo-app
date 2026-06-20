let currentPayslipId =
    null;

// ---- ユーティリティ ----

function payslipEscapeHtml(
    text
) {

    return String(text)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");

}

function formatYen(
    value
) {

    return Number(value || 0)
        .toLocaleString() +
        "円";

}

function toNumberOrZero(
    value
) {

    const num =
        Number(value);

    if (
        !Number.isFinite(num)
    ) {
        return 0;
    }

    return num;

}

function createAdditionalEarningRow(
    name,
    amount
) {

    const row =
        document.createElement(
            "div"
        );

    row.className =
        "payslip-additional-row";

    row.innerHTML =
        `
        <input
            type="text"
            class="payslip-earning-name"
            placeholder="例: 交通費"
            value="${payslipEscapeHtml(name || "")}">

        <input
            type="number"
            class="payslip-earning-amount"
            placeholder="金額"
            min="0"
            step="1"
            value="${toNumberOrZero(amount) || ""}">

        <button
            type="button"
            class="payslip-remove-item-btn">削除</button>
        `;

    row.querySelector(
        ".payslip-remove-item-btn"
    ).addEventListener(
        "click",
        function() {

            row.remove();

        }
    );

    return row;

}

function addAdditionalEarningRow(
    name,
    amount
) {

    const list =
        document.getElementById(
            "payslipAdditionalEarningsList"
        );

    if (!list) {
        return;
    }

    list.appendChild(
        createAdditionalEarningRow(
            name,
            amount
        )
    );

}

function clearAdditionalEarningRows() {

    const list =
        document.getElementById(
            "payslipAdditionalEarningsList"
        );

    if (!list) {
        return;
    }

    list.innerHTML = "";

}

function getAdditionalEarningsFromForm() {

    const rows =
        document.querySelectorAll(
            "#payslipAdditionalEarningsList .payslip-additional-row"
        );

    const items = [];

    rows.forEach(
        function(row) {

            const name =
                row.querySelector(
                    ".payslip-earning-name"
                ).value.trim();

            const amount =
                toNumberOrZero(
                    row.querySelector(
                        ".payslip-earning-amount"
                    ).value
                );

            if (
                name !== "" ||
                amount > 0
            ) {

                items.push({
                    name: name,
                    amount: amount
                });

            }

        }
    );

    return items;

}

function getPayslipFormTotals() {

    const grossPay =
        toNumberOrZero(
            document.getElementById(
                "payslipGrossPay"
            ).value
        );

    const bonusPay =
        toNumberOrZero(
            document.getElementById(
                "payslipBonusPay"
            ).value
        );

    const additionalEarnings =
        getAdditionalEarningsFromForm();

    const additionalEarningsTotal =
        additionalEarnings.reduce(
            function(sum, item) {

                return sum +
                    toNumberOrZero(
                        item.amount
                    );

            },
            0
        );

    const deductionsTotal = [
        "payslipIncomeTax",
        "payslipResidentTax",
        "payslipHealthInsurance",
        "payslipPension",
        "payslipEmploymentInsurance",
        "payslipOtherDeductions"
    ].reduce(
        function(sum, id) {

            return sum +
                toNumberOrZero(
                    document.getElementById(
                        id
                    ).value
                );

        },
        0
    );

    const withholdingTotal = [
        "payslipStockDeduction",
        "payslipInsuranceDeduction",
        "payslipOtherWithholding"
    ].reduce(
        function(sum, id) {

            return sum +
                toNumberOrZero(
                    document.getElementById(
                        id
                    ).value
                );

        },
        0
    );

    return {
        grossPay,
        bonusPay,
        additionalEarnings,
        additionalEarningsTotal,
        earningsTotal:
            grossPay +
            bonusPay +
            additionalEarningsTotal,
        deductionsTotal,
        withholdingTotal
    };

}

// ---- 履歴連動 ----

function syncPayslipToExpense(
    payslip
) {

    const expenses =
        getExpenses();

    const existingIndex =
        expenses.findIndex(
            function(e) {

                return (
                    e.payslipId ===
                    payslip.id
                );

            }
        );

    const defaultPayment =
        (
            getPayments()
            .find(
                function(p) {

                    return (
                        p.type !== "credit"
                    );

                }
            ) ||
            { name: "現金" }
        ).name;

    const entry = {
        id:
            existingIndex >= 0
            ? expenses[existingIndex].id
            : Date.now() +
                Math.random(),

        type: "income",

        amount:
            Number(
                payslip.netPay
            ) || 0,

        date:
            payslip.payDate ||
            new Date()
            .toISOString()
            .slice(0, 10),

        category: "給料",

        payment: defaultPayment,

        memo:
            "給与明細: " +
            (payslip.period || ""),

        payslipId: payslip.id
    };

    const oldEntry =
        existingIndex >= 0
            ? expenses[existingIndex]
            : null;

    const oldAmount =
        oldEntry
            ? Number(oldEntry.amount) || 0
            : 0;

    const newAmount =
        Number(entry.amount) || 0;

    if (existingIndex >= 0) {

        expenses[existingIndex] =
            entry;

    }

    else {

        expenses.push(entry);

    }

    saveExpenses(expenses);

    const balanceDelta =
        newAmount - oldAmount;

    if (balanceDelta !== 0) {

        const currentBalance =
            getBalance();

        saveBalance(
            currentBalance +
            balanceDelta
        );

    }

    renderExpenses();
    renderMonthSelector();
    refreshBalanceViews();
    renderCalendar();
    renderSummaryCards();

}

function syncAllPayslipsToExpensesForRebuild() {

    const payslips =
        getPayslips();

    const expenses =
        getExpenses().slice();

    const payslipIdSet =
        new Set(
            payslips.map(
                function(p) {

                    return p.id;

                }
            )
        );

    let changed = false;

    payslips.forEach(
        function(payslip) {

            const index =
                expenses.findIndex(
                    function(e) {

                        return (
                            e.payslipId ===
                            payslip.id
                        );

                    }
                );

            const defaultPayment =
                (
                    getPayments()
                    .find(
                        function(p) {

                            return (
                                p.type !== "credit"
                            );

                        }
                    ) ||
                    { name: "現金" }
                ).name;

            const nextEntry = {
                id:
                    index >= 0
                    ? expenses[index].id
                    : Date.now() +
                        Math.random(),

                type: "income",

                amount:
                    Number(
                        payslip.netPay
                    ) || 0,

                date:
                    payslip.payDate ||
                    new Date()
                    .toISOString()
                    .slice(0, 10),

                category: "給料",

                payment: defaultPayment,

                memo:
                    "給与明細: " +
                    (payslip.period || ""),

                payslipId: payslip.id
            };

            if (index >= 0) {

                const current =
                    expenses[index];

                const isSame =
                    current.type === nextEntry.type &&
                    Number(current.amount || 0) === Number(nextEntry.amount || 0) &&
                    current.date === nextEntry.date &&
                    current.category === nextEntry.category &&
                    current.payment === nextEntry.payment &&
                    current.memo === nextEntry.memo;

                if (!isSame) {

                    expenses[index] =
                        nextEntry;

                    changed = true;

                }

            }

            else {

                expenses.push(
                    nextEntry
                );

                changed = true;

            }

        }
    );

    const filteredExpenses =
        expenses.filter(
            function(e) {

                if (
                    e.payslipId === undefined ||
                    e.payslipId === null
                ) {
                    return true;
                }

                return payslipIdSet.has(
                    e.payslipId
                );

            }
        );

    if (
        filteredExpenses.length !==
        expenses.length
    ) {
        changed = true;
    }

    if (changed) {
        saveExpenses(
            filteredExpenses
        );
    }

}

function removePayslipExpense(
    payslipId
) {

    const targetExpense =
        getExpenses().find(
            function(e) {

                return (
                    e.payslipId ===
                    payslipId
                );

            }
        );

    const expenses =
        getExpenses()
        .filter(
            function(e) {

                return (
                    e.payslipId !==
                    payslipId
                );

            }
        );

    saveExpenses(expenses);

    if (targetExpense) {

        const currentBalance =
            getBalance();

        const amount =
            Number(
                targetExpense.amount
            ) || 0;

        saveBalance(
            currentBalance - amount
        );

    }

    renderExpenses();
    renderMonthSelector();
    refreshBalanceViews();
    renderCalendar();
    renderSummaryCards();

}

// ---- 一覧描画 ----

function renderPayslipList() {

    const list =
        document.getElementById(
            "payslipList"
        );

    if (!list) {
        return;
    }

    const payslips =
        getPayslips()
        .slice()
        .sort(
            function(a, b) {

                if (
                    a.period > b.period
                ) {
                    return -1;
                }

                if (
                    a.period < b.period
                ) {
                    return 1;
                }

                return 0;

            }
        );

    list.innerHTML = "";

    if (
        payslips.length === 0
    ) {

        list.innerHTML =
            `<div class="payslip-empty">
                まだ給与明細がありません
            </div>`;

        return;

    }

    payslips.forEach(
        function(payslip) {

            const card =
                document.createElement(
                    "div"
                );

            card.className =
                "payslip-card";

            const period =
                payslipEscapeHtml(
                    payslip.period || ""
                );

            const payDate =
                payslipEscapeHtml(
                    payslip.payDate || ""
                );

            card.innerHTML =
                `
                <div>
                    <div class="payslip-card-period">
                        ${period}
                    </div>
                    <div class="payslip-card-sub">
                        支払日: ${payDate}
                    </div>
                </div>
                <div>
                    <div class="payslip-card-net-label">
                        手取り
                    </div>
                    <div class="payslip-card-net">
                        ${formatYen(payslip.netPay)}
                    </div>
                </div>
                `;

            card.addEventListener(
                "click",
                function() {

                    openPayslipDetail(
                        payslip.id
                    );

                }
            );

            list.appendChild(
                card
            );

        }
    );

}

// ---- 入力モーダル ----

function openPayslipInput(
    editId
) {

    currentPayslipId =
        editId || null;

    const title =
        document.getElementById(
            "payslipModalTitle"
        );

    title.textContent =
        editId
        ? "給与明細を編集"
        : "給与明細を入力";

    const today =
        new Date()
        .toISOString()
        .slice(0, 7);

    const todayDate =
        new Date()
        .toISOString()
        .slice(0, 10);

    if (editId) {

        const payslip =
            getPayslips()
            .find(
                function(p) {
                    return p.id === editId;
                }
            );

        if (!payslip) {
            return;
        }

        document.getElementById(
            "payslipPeriod"
        ).value =
            payslip.period || today;

        document.getElementById(
            "payslipPayDate"
        ).value =
            payslip.payDate || todayDate;

        document.getElementById(
            "payslipGrossPay"
        ).value =
            payslip.grossPay || "";

        document.getElementById(
            "payslipBonusPay"
        ).value =
            payslip.bonusPay || "";

        clearAdditionalEarningRows();

        (payslip.additionalEarnings || [])
        .forEach(
            function(item) {

                addAdditionalEarningRow(
                    item.name || "",
                    item.amount || 0
                );

            }
        );

        document.getElementById(
            "payslipIncomeTax"
        ).value =
            payslip.incomeTax || "";

        document.getElementById(
            "payslipResidentTax"
        ).value =
            payslip.residentTax || "";

        document.getElementById(
            "payslipHealthInsurance"
        ).value =
            payslip.healthInsurance || "";

        document.getElementById(
            "payslipPension"
        ).value =
            payslip.pension || "";

        document.getElementById(
            "payslipEmploymentInsurance"
        ).value =
            payslip.employmentInsurance || "";

        document.getElementById(
            "payslipOtherDeductions"
        ).value =
            payslip.otherDeductions || "";

        document.getElementById(
            "payslipStockDeduction"
        ).value =
            payslip.stockDeduction || "";

        document.getElementById(
            "payslipInsuranceDeduction"
        ).value =
            payslip.insuranceDeduction || "";

        document.getElementById(
            "payslipOtherWithholding"
        ).value =
            payslip.otherWithholding || "";

        document.getElementById(
            "payslipNetPay"
        ).value =
            payslip.netPay || "";

        document.getElementById(
            "payslipMemo"
        ).value =
            payslip.memo || "";

    }

    else {

        document.getElementById(
            "payslipPeriod"
        ).value = today;

        document.getElementById(
            "payslipPayDate"
        ).value = todayDate;

        [
            "payslipGrossPay",
            "payslipBonusPay",
            "payslipIncomeTax",
            "payslipResidentTax",
            "payslipHealthInsurance",
            "payslipPension",
            "payslipEmploymentInsurance",
            "payslipOtherDeductions",
            "payslipStockDeduction",
            "payslipInsuranceDeduction",
            "payslipOtherWithholding",
            "payslipNetPay",
            "payslipMemo"
        ].forEach(
            function(id) {

                document.getElementById(
                    id
                ).value = "";

            }
        );

        clearAdditionalEarningRows();

    }

    document.getElementById(
        "payslipInputModal"
    ).style.display =
        "flex";

}

function closePayslipInput() {

    document.getElementById(
        "payslipInputModal"
    ).style.display =
        "none";

    currentPayslipId = null;

}

// ---- 自動計算 ----

document.getElementById(
    "addPayslipEarningItemButton"
).addEventListener(
    "click",
    function() {

        addAdditionalEarningRow(
            "",
            0
        );

    }
);

document.getElementById(
    "payslipAutoCalcButton"
).addEventListener(
    "click",
    function() {

        const totals =
            getPayslipFormTotals();

        if (
            totals.earningsTotal <= 0
        ) {

            alert(
                "支給項目を入力してください"
            );

            return;

        }

        const net =
            totals.earningsTotal -
            totals.deductionsTotal -
            totals.withholdingTotal;

        document.getElementById(
            "payslipNetPay"
        ).value =
            net >= 0 ? net : 0;

    }
);

// ---- 保存 ----

document.getElementById(
    "savePayslipButton"
).addEventListener(
    "click",
    function() {

        const period =
            document.getElementById(
                "payslipPeriod"
            ).value;

        if (!period) {

            alert(
                "支給年月を入力してください"
            );

            return;

        }

        const totals =
            getPayslipFormTotals();

        if (
            totals.earningsTotal <= 0
        ) {

            alert(
                "支給項目を1つ以上入力してください"
            );

            return;

        }

        const netPayInput =
            document.getElementById(
                "payslipNetPay"
            );

        let netPay =
            Number(
                netPayInput.value
            );

        if (
            netPayInput.value.trim() === ""
        ) {

            netPay =
                totals.earningsTotal -
                totals.deductionsTotal -
                totals.withholdingTotal;

            netPayInput.value =
                netPay >= 0
                ? netPay
                : 0;

            netPay =
                Number(
                    netPayInput.value
                );

        }

        if (
            !Number.isFinite(
                netPay
            ) ||
            netPay < 0
        ) {

            alert(
                "手取り金額を正しく入力してください"
            );

            return;

        }

        const data = {

            period:
                period,

            payDate:
                document.getElementById(
                    "payslipPayDate"
                ).value,

            grossPay:
                totals.grossPay,

            bonusPay:
                totals.bonusPay,

            additionalEarnings:
                totals.additionalEarnings,

            incomeTax:
                Number(
                    document.getElementById(
                        "payslipIncomeTax"
                    ).value
                ) || 0,

            residentTax:
                Number(
                    document.getElementById(
                        "payslipResidentTax"
                    ).value
                ) || 0,

            healthInsurance:
                Number(
                    document.getElementById(
                        "payslipHealthInsurance"
                    ).value
                ) || 0,

            pension:
                Number(
                    document.getElementById(
                        "payslipPension"
                    ).value
                ) || 0,

            employmentInsurance:
                Number(
                    document.getElementById(
                        "payslipEmploymentInsurance"
                    ).value
                ) || 0,

            otherDeductions:
                Number(
                    document.getElementById(
                        "payslipOtherDeductions"
                    ).value
                ) || 0,

            stockDeduction:
                Number(
                    document.getElementById(
                        "payslipStockDeduction"
                    ).value
                ) || 0,

            insuranceDeduction:
                Number(
                    document.getElementById(
                        "payslipInsuranceDeduction"
                    ).value
                ) || 0,

            otherWithholding:
                Number(
                    document.getElementById(
                        "payslipOtherWithholding"
                    ).value
                ) || 0,

            netPay:
                netPay,

            memo:
                document.getElementById(
                    "payslipMemo"
                ).value.trim()

        };

        const payslips =
            getPayslips();

        if (currentPayslipId) {

            const index =
                payslips.findIndex(
                    function(p) {

                        return (
                            p.id ===
                            currentPayslipId
                        );

                    }
                );

            if (index >= 0) {

                data.id =
                    currentPayslipId;

                payslips[index] =
                    data;

            }

        }

        else {

            data.id =
                Date.now();

            payslips.push(data);

        }

        savePayslips(payslips);

        syncPayslipToExpense(data);

        closePayslipInput();

        renderPayslipList();

    }
);

document.getElementById(
    "cancelPayslipButton"
).addEventListener(
    "click",
    closePayslipInput
);

// ---- 詳細モーダル ----

function openPayslipDetail(id) {

    const payslip =
        getPayslips()
        .find(
            function(p) {

                return p.id === id;

            }
        );

    if (!payslip) {
        return;
    }

    currentPayslipId = id;

    document.getElementById(
        "payslipDetailTitle"
    ).textContent =
        (payslip.period || "") +
        " 給与明細";

    const additionalEarnings =
        Array.isArray(
            payslip.additionalEarnings
        )
            ? payslip.additionalEarnings
            : [];

    const bonusPay =
        toNumberOrZero(
            payslip.bonusPay
        );

    const totalDeductions =
        (payslip.incomeTax || 0) +
        (payslip.residentTax || 0) +
        (payslip.healthInsurance || 0) +
        (payslip.pension || 0) +
        (payslip.employmentInsurance || 0) +
        (payslip.otherDeductions || 0);

    const totalWithholding =
        toNumberOrZero(
            payslip.stockDeduction
        ) +
        toNumberOrZero(
            payslip.insuranceDeduction
        ) +
        toNumberOrZero(
            payslip.otherWithholding
        );

    function row(label, value, isNet) {

        const cls =
            isNet
            ? "payslip-detail-value payslip-detail-net"
            : "payslip-detail-value";

        return `
            <div class="payslip-detail-row">
                <span class="payslip-detail-label">
                    ${payslipEscapeHtml(label)}
                </span>
                <span class="${cls}">
                    ${payslipEscapeHtml(value)}
                </span>
            </div>
        `;

    }

    let html =
        `<div class="payslip-section-title">支給</div>` +
        row("額面", formatYen(payslip.grossPay)) +
        row("ボーナス", formatYen(bonusPay));

    additionalEarnings.forEach(
        function(item) {

            html += row(
                item.name || "追加支給",
                formatYen(item.amount || 0)
            );

        }
    );

    html +=
        `<div class="payslip-section-title">控除</div>` +
        row("所得税", formatYen(payslip.incomeTax)) +
        row("住民税", formatYen(payslip.residentTax)) +
        row("健康保険料", formatYen(payslip.healthInsurance)) +
        row("厚生年金", formatYen(payslip.pension)) +
        row("雇用保険", formatYen(payslip.employmentInsurance)) +
        row("その他控除", formatYen(payslip.otherDeductions)) +
        row("控除合計", formatYen(totalDeductions)) +
        `<div class="payslip-section-title">天引き</div>` +
        row("持ち株", formatYen(payslip.stockDeduction || 0)) +
        row("保険", formatYen(payslip.insuranceDeduction || 0)) +
        row("その他天引き", formatYen(payslip.otherWithholding || 0)) +
        row("天引き合計", formatYen(totalWithholding)) +
        `<div class="payslip-section-title">手取り</div>` +
        row("手取り", formatYen(payslip.netPay), true);

    if (payslip.payDate) {

        html +=
            row(
                "支払日",
                payslipEscapeHtml(
                    payslip.payDate
                )
            );

    }

    if (payslip.memo) {

        html +=
            row(
                "メモ",
                payslipEscapeHtml(
                    payslip.memo
                )
            );

    }

    document.getElementById(
        "payslipDetailBody"
    ).innerHTML = html;

    document.getElementById(
        "payslipDetailModal"
    ).style.display =
        "flex";

}

function closePayslipDetail() {

    document.getElementById(
        "payslipDetailModal"
    ).style.display =
        "none";

    currentPayslipId = null;

}

document.getElementById(
    "closePayslipDetailButton"
).addEventListener(
    "click",
    closePayslipDetail
);

document.getElementById(
    "editPayslipButton"
).addEventListener(
    "click",
    function() {

        const id = currentPayslipId;

        closePayslipDetail();

        openPayslipInput(id);

    }
);

document.getElementById(
    "deletePayslipButton"
).addEventListener(
    "click",
    function() {

        if (
            !confirm(
                "この給与明細を削除しますか？"
            )
        ) {
            return;
        }

        const deletingId =
            currentPayslipId;

        const payslips =
            getPayslips()
            .filter(
                function(p) {

                    return (
                        p.id !==
                        deletingId
                    );

                }
            );

        savePayslips(payslips);

        removePayslipExpense(
            deletingId
        );

        closePayslipDetail();

        renderPayslipList();

    }
);

// ---- 追加ボタン ----

document.getElementById(
    "addPayslipButton"
).addEventListener(
    "click",
    function() {

        openPayslipInput();

    }
);

// ---- モーダル外クリックで閉じる ----

window.addEventListener(
    "click",
    function(event) {

        if (
            event.target ===
            document.getElementById(
                "payslipInputModal"
            )
        ) {

            closePayslipInput();

        }

        if (
            event.target ===
            document.getElementById(
                "payslipDetailModal"
            )
        ) {

            closePayslipDetail();

        }

    }
);
