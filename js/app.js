const today = new Date()
    .toISOString()
    .split("T")[0];

document.getElementById("date").value =
    today;

processCreditCardBills();

const expenses =
    getExpenses();

if (
    expenses.length > 0
) {

    currentMonth =
        expenses
            .map(
                expense =>
                expense.date.substring(
                    0,
                    7
                )
            )
            .sort()
            .reverse()[0];

}

renderBalance();
renderCategories();
renderPayments();
generateFixedExpenses();
syncFixedExpenseCategories();
renderExpenses();
renderMonthSelector();
renderCategoryChart();
updateCalendarTitle();
renderCalendar();
renderSummaryCards();
initializeExpenseAnalysis();
renderExpenseAnalysis();
initializeIncomeAnalysis();
renderIncomeSummary();
renderIncomeChart();
initializeCardAnalysis();
renderAssetAnalysis();
renderHistoryFilters();
renderFixedExpensePayments();
renderFixedExpenseList();
renderFixedExpenseCategories();
initializeFixedAnalysis();
renderCategoryList();
renderPaymentList();

setActiveBottomTab(
    "inputTab"
);