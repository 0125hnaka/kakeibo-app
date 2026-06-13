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

        renderCategoryList();

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

function renderCategoryList() {

    const container =
        document.getElementById(
            "categoryList"
        );

    container.innerHTML =
        "";

    const expenseCategories =
        getCategories().filter(
             function(category) {

                return (
                    category.type ===
                    "expense"
                );

            }
        );

    const incomeCategories =
        getCategories().filter(
            function(category) {

                return (
                    category.type ===
                    "income"
                );

            }
        );

    container.innerHTML =
    `
    <div class="setting-group">

        <div class="setting-group-title">
            支出カテゴリ
        </div>

        <div
            id="expenseCategoryArea"
        >
        </div>

    </div>

    <div class="setting-group">

        <div class="setting-group-title">
            収入カテゴリ
        </div>

        <div
            id="incomeCategoryArea"
        >
        </div>

    </div>
    `;

    const expenseArea =
        document.getElementById(
            "expenseCategoryArea"
    );

    expenseCategories.forEach(
        function(category) {

            const div =
                document.createElement(
                    "div"
                );

            div.className =
                "setting-item";

            div.innerHTML =
                `
                <span>
                    ${category.name}
                </span>

                <button
                    class="delete-btn"
                    onclick="
                        deleteCategory(
                            '${category.name}',
                            '${category.type}'
                        )
                    "
                >
                    削除
                </button>
             `;

            expenseArea.appendChild(
                div
            );
        } 
    );

    const incomeArea =
        document.getElementById(
            "incomeCategoryArea"
        );

    incomeCategories.forEach(
        function(category) {

            const div =
                document.createElement(
                    "div"
                );

            div.className =
                "setting-item";

            div.innerHTML =
                `
                <span>
                    ${category.name}
                </span>

                <button
                    class="delete-btn"
                    onclick="
                        deleteCategory(
                            '${category.name}',
                            '${category.type}'
                        )
                    "
                >
                    削除
                </button>
                `;

            incomeArea.appendChild(
                div
            );

        }
    );

}

function deleteCategory(
    name,
    type
) {

    if (
        !confirm(
            "カテゴリを削除しますか？"
        )
    ) {

        return;

    }

    const categories =
        getCategories()
        .filter(
            category =>
                !(
                    category.name ===
                    name
                    &&
                    category.type ===
                    type
                )
        );

    saveCategories(
        categories
    );

    renderCategories();

    renderHistoryFilters();

    renderCategoryList();

}