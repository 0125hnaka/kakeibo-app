function renderPayments() {

    const paymentSelect =
        document.getElementById("payment");

    paymentSelect.innerHTML = "";

    const payments =
        getPayments();

    payments.forEach(function(payment) {

        const option =
            document.createElement("option");

        option.value = payment.name;

        option.textContent = payment.name;

        paymentSelect.appendChild(option);

    });

}

const addPaymentButton =
    document.getElementById(
        "addPaymentButton"
    );

addPaymentButton.addEventListener(
    "click",
    function() {

        const newPayment =
            document.getElementById(
                "newPayment"
            ).value.trim();

        if (newPayment === "") {
            return;
        }

        const payments =
            getPayments();

        const exists =
            payments.some(
                function(payment) {

                    return (
                        payment.name ===
                        newPayment
                    );

                }
            );

        if (exists) {

            alert(
                "既に存在します"
            );

            return;
        }

        const paymentType =
            document.querySelector(
                'input[name="paymentType"]:checked'
            ).value;

        const paymentDay =
            Number(
                document.getElementById(
                    "paymentDay"
                ).value
            );

        const paymentObject = {

            name: newPayment,

            type: paymentType

        };

        if (
            paymentType === "credit"
        ) {

            paymentObject.paymentDay =
                paymentDay;

        }

        payments.push(
            paymentObject
        );

        savePayments(
            payments
        );

        renderPayments();

        document.getElementById(
            "newPayment"
        ).value = "";

    }
);