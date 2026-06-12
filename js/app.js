console.log("家計簿アプリ起動");

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
renderExpenses();
renderMonthSelector();
renderCreditCardList();
renderCategoryChart();
updateCalendarTitle();
renderCalendar();
renderSummaryCards();
initializeExpenseAnalysis();
renderExpenseAnalysis();
renderExpensePaymentSummary();
initializeIncomeAnalysis();
renderIncomeRanking();
renderIncomeSummary();
renderIncomeChart();
initializeCardAnalysis();
renderAssetAnalysis();
renderHistoryFilters();
renderFixedExpensePayments();
renderFixedExpenseList();
initializeFixedAnalysis();