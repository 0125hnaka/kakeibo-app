function updateCalendarTitle() {

    const month =
        document.getElementById(
            "expenseMonth"
        ).value;

    const title =
        document.getElementById(
            "calendarTitle"
        );

    title.textContent =
        month;

}

document.getElementById(
    "expenseMonth"
).addEventListener(
    "change",
    function() {

        updateCalendarTitle();
        renderCalendar();

    }
);

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

    const monthSelect =
        document.getElementById(
            "expenseMonth"
        );

    const months = [];

    for (
        let i = 0;
        i < monthSelect.options.length;
        i++
    ) {

        months.push(
            monthSelect.options[i].value
        );

    }

    const currentIndex =
        months.indexOf(
            monthSelect.value
        );

    const newIndex =
        currentIndex + offset;

    if (
        newIndex < 0 ||
        newIndex >= months.length
    ) {

        return;

    }

    monthSelect.value =
        months[newIndex];

    updateCalendarTitle();
    renderCalendar();

    renderExpenses();

}

function renderCalendar() {

    const month =
        document.getElementById(
            "expenseMonth"
        ).value;

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

                html +=
                `
                <td>
                    <div class="calendarDay">
                        ${day}
                    </div>
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