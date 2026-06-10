let currentMonth = "";

function updateCalendarTitle() {

    document.getElementById(
        "calendarTitle"
    ).textContent =
        currentMonth;

}

document.getElementById(
    "prevMonth"
).addEventListener(
    "click",
    function() {

        moveMonth(1);

    }
);

document.getElementById(
    "nextMonth"
).addEventListener(
    "click",
    function() {

        moveMonth(-1);

    }
);

function moveMonth(
    offset
) {

    const expenses =
        getExpenses();

    const months =
        [
            ...new Set(
                expenses.map(
                    expense =>
                    expense.date.substring(
                        0,
                        7
                    )
                )
            )
        ];

   months.sort().reverse();

    const currentIndex =
        months.indexOf(
            currentMonth
        );

    const newIndex =
        currentIndex +
        offset;

    if (
        newIndex < 0 ||
        newIndex >= months.length
    ) {

        return;

    }

    currentMonth =
        months[newIndex];

    updateCalendarTitle();
    renderCalendar();
    renderExpenses();
}

function renderCalendar() {

    const month =
        currentMonth;

    if (!month) {
        return;
    }

    const container =
        document.getElementById(
            "calendarContainer"
        );

    container.innerHTML = "";

    const firstDay =
        new Date(
            month + "-01"
        );

    const startDay =
        firstDay.getDay();

    const lastDay =
        new Date(
            firstDay.getFullYear(),
            firstDay.getMonth() + 1,
            0
        ).getDate();

    let html =
        `
        <table class="calendarTable">
            <tr>
                <th class="sun">日</th>
                <th>月</th>
                <th>火</th>
                <th>水</th>
                <th>木</th>
                <th>金</th>
                <th class="sat">土</th>
            </tr>
        `;

    let day = 1;

    for (
        let row = 0;
        row < 5;
        row++
    ) {

        html += "<tr>";

        for (
            let col = 0;
            col < 7;
            col++
        ) {

            if (
                row === 0 &&
                col < startDay
            ) {

                html += "<td></td>";

            }

            else if (
                day > lastDay
            ) {

                html += "<td></td>";

            }

            else {

    const dayString =
        String(day)
            .padStart(2, "0");

    const dateString =
        month + "-" + dayString;

    let income = 0;
    let expense = 0;

    getExpenses().forEach(
        function(item) {

            if (
                item.date !==
                dateString
            ) {

                return;

            }

            if (
                item.type ===
                "income"
            ) {

                income +=
                    item.amount;

            }

            else {

                expense +=
                    item.amount;

            }

        }
    );

    html +=
    `
    <td>

        <div
            class="calendarDay"
            onclick="
                jumpToDate(
                    '${dateString}'
                )
            "
        >
            ${day}
        </div>

        ${
            expense > 0
            ?
            `<div class="calendarExpense">
                -${expense.toLocaleString()}
            </div>`
            :
            ""
        }

        ${
            income > 0
            ?
            `<div class="calendarIncome">
                +${income.toLocaleString()}
            </div>`
            :
            ""
        }

    </td>
    `;

    day++;

}

        }

        html += "</tr>";

    }

    html += "</table>";

    container.innerHTML =
        html;

}

function jumpToDate(
    date
) {

    const target =
        document.getElementById(
            "date-" + date
        );

    if (
        target
    ) {

        target.scrollIntoView(
            {
                behavior:
                    "smooth"
            }
        );

    }

}