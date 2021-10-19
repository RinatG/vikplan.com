const upgradable = ["Родонит", "Опал", "Шпинель", "Гиацинт", "Агат", "Гранат", "Рубин", "Турмалин", "Тааффеит", "Аквамарин", "Индиголит", "Эвклаз", "Раухтопаз", "Спессартин", "Оникс", "Альмандин", "Авантюрин", "Корунд", "Пироп", "Розовый кварц", "Рубеллит", "Сердолик", "Морганит", "Циркон"];
const gemList = $('.gem>.name').get().map(function (item, i) {
    let gemname = $(item).text();
    let url = $(item).parents("a").attr("href");
    const gem = {
        name: gemname
    };
    $.get(url)
        .done(function (response) {
            const doc = $.parseHTML(response);
            const effect_name = $(".table-responsive.gemDetailDiv tr:eq(6) td:eq(0)", doc).text();
            const effect_value = $(".table-responsive.gemDetailDiv tr:eq(6) td:eq(6)", doc).text();
            const baseEffect = { name: effect_name, value: effect_value };

            if (upgradable.indexOf(gemname) >= 0) {
                gem.levels = [
                    {
                        level: "Легендарный",
                        workshop: 21,
                        effects: [
                            { name: baseEffect.name, value: baseEffect.value }
                        ],
                        reqs: []
                    },
                    {
                        level: "Легендарный I",
                        workshop: 36,
                        effects: [
                            { name: baseEffect.name, value: "17.5%" }
                        ],
                        reqs: [
                            { name: gemname + " Легендарный", count: 1 },
                            { name: " Легендарный", count: 15 },
                            { name: " Легендарный", count: 15 },
                            { name: " Легендарный", count: 15 }
                        ]
                    },
                    {
                        level: "Легендарный II",
                        workshop: 38,
                        effects: [
                            { name: baseEffect.name, value: "24%" },
                            { name: "Защита всех войск", value: "10%" }
                        ],
                        reqs: [
                            { name: gemname + " Легендарный I", count: 1 },
                            { name: " Легендарный", count: 35 },
                            { name: " Легендарный", count: 35 },
                            { name: " Легендарный", count: 35 }
                        ]
                    },
                    {
                        level: "Легендарный III",
                        workshop: 40,
                        effects: [
                            { name: baseEffect.name, value: "31%" },
                            { name: "Защита всех войск", value: "15.5%" },
                            { name: "Здоровье всех войск", value: "10%" }
                        ],
                        reqs: [
                            { name: gemname + " Легендарный II", count: 1 },
                            { name: " Легендарный I", count: 1 },
                            { name: " Легендарный", count: 40 },
                            { name: " Легендарный", count: 40 }
                        ]
                    }
                ];
            }
            else {
                gem.levels = [
                    {
                        level: "Легендарный",
                        workshop: 21,
                        effects: [
                            { name: baseEffect.name, value: baseEffect.value }
                        ],
                        reqs: []
                    }
                ];
            }
        });

    return gem;
});

// JSON.stringify(gemList); // и заполнить файл gems.json