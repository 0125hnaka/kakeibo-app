function renderCategories() {

    const categorySelect =
        document.getElementById("category");

    categorySelect.innerHTML = "";

    const transactionType =
        document.querySelector(
            'input[name="transactionType"]:checked'
        ).value;

    const categories =
        getCategories();

    categories.forEach(function(category) {

        if (category.type !== transactionType) {
            return;
        }

        const option =
            document.createElement("option");

        option.value =
            category.name;

        option.textContent =
            category.name;

        categorySelect.appendChild(option);

    });

}

const addCategoryButton =
    document.getElementById(
        "addCategoryButton"
    );

addCategoryButton.addEventListener(
    "click",
    function() {

        const newCategory =
            document.getElementById(
                "newCategory"
            ).value.trim();

        if (newCategory === "") {
            return;
        }

        const categories =
            getCategories();

        const categoryType =
            document.querySelector(
                'input[name="categoryType"]:checked'
            ).value;

        const exists =
            categories.some(
                function(category) {

                    return (
                        category.name === newCategory &&
                        category.type === categoryType
                    );

                }
            );

        if (exists) {

            alert(
                "既に存在するカテゴリです"
            );

            return;
        }

        categories.push({
            name: newCategory,
            type: categoryType
        });

        saveCategories(categories);

        renderCategories();

        document.getElementById(
            "newCategory"
        ).value = "";

    }
);

const transactionTypeRadios =
    document.querySelectorAll(
        'input[name="transactionType"]'
    );

transactionTypeRadios.forEach(
    function(radio) {

        radio.addEventListener(
            "change",
            function() {

                renderCategories();

                renderPayments();

            }
        );

    }
);