console.log("家計簿アプリ起動");

const today = new Date()
    .toISOString()
    .split("T")[0];

document.getElementById("date").value =
    today;

processCreditCardBills();
renderBalance();
renderCategories();
renderPayments();
renderExpenseMonthSelector();
renderExpenses();
renderMonthSelector();
renderPaymentSummary();
renderCreditCardList();
renderCategoryChart();
updateCalendarTitle();
renderCalendar();