/* скрипт парсинга сайта https://vikings.help/resources/secret_knowledge/ */

$.fn.ignore = function(sel) {
	return this.clone().find(sel||">*").remove().end();
};
Object.defineProperty(String.prototype, "toFloatKMBT",
	{
		value: function parseKMBT() {
			if (this.endsWith('K')) {
				return this.slice(0,-1)*1000.0;
			}
			if (this.endsWith('M')) {
				return this.slice(0,-1)*1000000.0;
			}
			if (this.endsWith('B')) {
				return this.slice(0,-1)*1000000000.0;
			}
			if (this.endsWith('T')) {
				return this.slice(0,-1)*1000000000000.0;
			}
			if (this.endsWith('%')) {
				return this.slice(0,-1)*1.0;
			}
			return null;
		}
	});
Object.defineProperty(String.prototype, "toIntKMBT",
	{
		value: function parseKMBT() {
			if (this.endsWith('K')) {
				return this.slice(0,-1)*1000;
			}
			if (this.endsWith('M')) {
				return this.slice(0,-1)*1000000;
			}
			if (this.endsWith('B')) {
				return this.slice(0,-1)*1000000000;
			}
			if (this.endsWith('T')) {
				return this.slice(0,-1)*1000000000000;
			}
			if (this.endsWith('%')) {
				return this.slice(0,-1)*1;
			}
			return null;
		}
	});

// https://vikings.help/resources/secret_knowledge/
var secret2branches = $(".i152, .i154, .i155, .i157, .i153, .i156", ".pagesList")
	.map(function(i, item) {
		return {
			branch: "",
			name: $("a", $(item)).ignore("span").text(),
			url: $("a", $(item)).attr("href")
		};
	}).get();
// JSON.stringify(secret2branches) и вручную заполнить 'branch'
var secret2stage = [
	{
		"branch": "secret2ofnc",
		"name": "Урон",
		"url": "/resources/secret_knowledge/offense/"
	},
	{
		"branch": "secret2dfnc",
		"name": "Защита",
		"url": "/resources/secret_knowledge/defense2/"
	},
	{
		"branch": "secret2hlth",
		"name": "Здоровье",
		"url": "/resources/secret_knowledge/health/"
	},
	{
		"branch": "secret2frtr",
		"name": "Крепости II",
		"url": "/resources/secret_knowledge/fortresses2/"
	},
	{
		"branch": "secret2twn",
		"name": "Города",
		"url": "/resources/secret_knowledge/towns/"
	},
	{
		"branch": "secret2t8",
		"name": "Войска VIII тира",
		"url": "/resources/secret_knowledge/tierviii/"
	}
]
//парсим всё и таблички
secret2stage.forEach(function(slug) {
	$.get(slug.url)
		.done(function(response1) {
			var doc1 = $.parseHTML(response1);
			var researches = $(".research.frame > a", doc1)
				.map(function(i1, item) {
					var research = {
						id: $(item).attr("href").split('/')[4],
						url: $(item).attr("href"),
						name: $("span", item).text()
					};
					$.get(research.url)
						.done(function(response2) {
							var doc2 = $.parseHTML(response2);
							var levels =$("div.researchInfo tbody tr", doc2)
								.filter(function() { return $("td", this).attr("lvl") !== undefined; })
								.map(function(i2, levelItem) {
									return {
										level: $("td", levelItem).attr("lvl")*1,
										gold: $("td:eq(1)", levelItem).text().toIntKMBT(),
										soul_shard: $("td:eq(2)", levelItem).text().toIntKMBT(),
										inf: $("td:eq(-2)", levelItem).text().toIntKMBT(),
										effect_value: $("td:eq(5)", levelItem).text(),
										effect_name: $(levelItem).parents(".researchInfo").find("thead td:eq(5)").text(),
										req1: $("td:eq(4) a:eq(0)", levelItem).text(),
										req2: $("td:eq(4) a:eq(1)", levelItem).text(),
										req3: $("td:eq(4) a:eq(2)", levelItem).text(),
										req4: $("td:eq(4) a:eq(3)", levelItem).text()
									};
								}).get();
							research["levels"] = levels;
						});
					return research;
				}).get();
			slug["researches"] = researches;
		});
	});
/*
* КОСТЫЛИ:
secret2stage[3].researches[15].name = "Защита войск при обороне Крепостей II"
secret2stage[3].researches[15].url = "/resources/secret_knowledge/fortresses2/2968/"
$.get(secret2stage[3].researches[15].url)
	.done(function(response2) {
		var doc2 = $.parseHTML(response2);
		var levels =$("div.researchInfo tbody tr", doc2)
			.filter(function() { return $("td", this).attr("lvl") !== undefined; })
			.map(function(i2, levelItem) {
				return {
					level: $("td", levelItem).attr("lvl")*1,
					gold: $("td:eq(1)", levelItem).text().toIntKMBT(),
					soul_shard: $("td:eq(2)", levelItem).text().toIntKMBT(),
					inf: $("td:eq(-2)", levelItem).text().toIntKMBT(),
					effect_value: $("td:eq(5)", levelItem).text(),
					effect_name: $(levelItem).parents(".researchInfo").find("thead td:eq(5)").text(),
					req1: $("td:eq(4) a:eq(0)", levelItem).text(),
					req2: $("td:eq(4) a:eq(1)", levelItem).text(),
					req3: $("td:eq(4) a:eq(2)", levelItem).text(),
					req4: $("td:eq(4) a:eq(3)", levelItem).text()
				};
			}).get();
		secret2stage[3].researches[15]["levels"] = levels;
	});
*/

// research_list
var slugIndex = 0;
var research_list = secret2stage.reduce(function(reducer, branch) {
	return reducer.concat(branch.researches.map(function(research, i) {
		return {
			slug: branch.branch+"_"+(i+1).toString().padStart(2,'0'),
			name: research.name,
			max_level: research.levels[research.levels.length-1].level,
			effect_name: research.levels[0].effect_name,
			effect_max: research.levels[research.levels.length-1].effect_value.toFloatKMBT(),
			effect_values: research.levels.map(function(level){return level.effect_value.toFloatKMBT();}).join(',')
		};
	}));
}, []);
// JSON.stringify(research_list) и дополнить файл research_list.js

var lastId = 4203; // взято из research.js (или бд)
var slugIndex = 0;
var research_data = secret2stage.reduce(function(r1, branch) {
	slugIndex = 0;
	return r1.concat(branch.researches.reduce(function(r2, research) {
		++slugIndex;
		return r2.concat(research.levels.map(function(level) {
			return {
				id: ++lastId,
				slug: branch.branch+"_"+slugIndex.toString().padStart(2,'0'),
				name: research.name,
				level: level.level,
				gold: level.gold,
				scroll: level.soul_shard,
				time_days: 0, // неизвестно
				time_seconds: 0, // неизвестно
				effect_value: level.effect_value,
				effect_name: level.effect_name,
				oracle: (level.req1+level.req2+level.req3+level.req4).split("Оракул ")[1]*1,
				req1: level.req1.startsWith("Оракул")?"":level.req1,
				req2: level.req2.startsWith("Оракул")?"":level.req2,
				req3: level.req3.startsWith("Оракул")?"":level.req3,
				req4: level.req4.startsWith("Оракул")?"":level.req4,
				inf: level.inf
			}
		}));
	}, []));
}, []);
// JSON.stringify(research_data) и дополнить файл research.js