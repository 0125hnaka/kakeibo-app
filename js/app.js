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
renderExpenses();
renderMonthSelector();
//renderPaymentSummary();
renderCreditCardList();
renderCategoryChart();
updateCalendarTitle();
renderCalendar();
renderSummaryCards();
initializeExpenseAnalysis();
renderExpenseAnalysis();
renderExpensePaymentSummary();
renderIncomeRanking();
renderIncomeSummary();
renderIncomeChart();
initializeCardAnalysis();
renderAssetAnalysis();
renderHistoryFilters();