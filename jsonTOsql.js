'use strict';

const fs = require('fs');
//let rawdata = fs.readFileSync('recipe_test_01.json');
let rawdata = fs.readFileSync(process.argv[2]);
var recipe_json = JSON.parse(rawdata);

/**
**
**	RECIPE TABLE
**
**/
var recipe_fields = []

// Champs intéressants
recipe_fields.push(["NAME",st(recipe_json.name)])
recipe_fields.push(["DURATION",recipe_json.duration])
recipe_fields.push(["DURATION_TOTAL",recipe_json.duration_total])
recipe_fields.push(["IMAGE_BASE",st(recipe_json.picture_path)])
recipe_fields.push(["IMAGE_NAME",st(recipe_json.picture_name)])
recipe_fields.push(["UNIT",st(recipe_json.yield.yield_unit)])
recipe_fields.push(["YIELD",recipe_json.yield.yield_value])
recipe_fields.push(["YIELD_UNIT",st(recipe_json.yield.yield_label)])
recipe_fields.push(["INSTRUCTIONS",st(recipe_json.instructions)])
recipe_fields.push(["LEVEL",recipe_json.level])
recipe_fields.push(["COMPLEXITY",st(recipe_json.complexity)])

// Autres champs nuls
recipe_fields.push(["PREPARATIONS",st("")])
recipe_fields.push(["RECIPE_TYPE",st("live")])
recipe_fields.push(["IS_FAVORITE",1])
recipe_fields.push(["LANGUAGE",st("fr")])
recipe_fields.push(["MACHINE_TYPE",st("MC2")])
recipe_fields.push(["MACHINE_VERSION",st("2.0")])
recipe_fields.push(["SCHEME_VERSION",1])
recipe_fields.push(["UPDATED",1585731600000])
recipe_fields.push(["VALID_FROM",null])
recipe_fields.push(["VALID_TO",null])
recipe_fields.push(["VERSION ",1])

console.log(arrayToSQL(recipe_fields,"RECIPE"))
const RECIPE_ID = "(SELECT MAX(_id) FROM RECIPE)"
const MEASUREMENT_ID = "(SELECT MAX(_id) FROM MEASUREMENT)"
const LED_ID = "(SELECT MAX(_id) FROM LED)"
const MACHINE_VALUES_ID = "(SELECT MAX(_id) FROM MACHINE_VALUES)"
const INGREDIENTS_BASE_ID = "(SELECT MAX(_id) FROM INGREDIENTS_BASE)"


/**
**
**	NUTRIENT TABLE
**
**/

// D'abord les joules
var nutrient_fields_joules = []
nutrient_fields_joules.push(["RECIPE_ID",RECIPE_ID])
nutrient_fields_joules.push(["TYPE",st("joules")])
nutrient_fields_joules.push(["UNIT",st("kj")])
nutrient_fields_joules.push(["AMOUNT",recipe_json.nutrient_amount.joules])

console.log(arrayToSQL(nutrient_fields_joules,"NUTRIENT"))

// calories
var nutrient_fields_calories = []
nutrient_fields_calories.push(["RECIPE_ID",RECIPE_ID])
nutrient_fields_calories.push(["TYPE",st("calories")])
nutrient_fields_calories.push(["UNIT",st("kcal")])
nutrient_fields_calories.push(["AMOUNT",recipe_json.nutrient_amount.calories])

console.log(arrayToSQL(nutrient_fields_calories,"NUTRIENT"))

// protein
var nutrient_fields_protein = []
nutrient_fields_protein.push(["RECIPE_ID",RECIPE_ID])
nutrient_fields_protein.push(["TYPE",st("protein")])
nutrient_fields_protein.push(["UNIT",st("g")])
nutrient_fields_protein.push(["AMOUNT",recipe_json.nutrient_amount.protein])

console.log(arrayToSQL(nutrient_fields_protein,"NUTRIENT"))

// carbohydrate
var nutrient_fields_carbohydrate = []
nutrient_fields_carbohydrate.push(["RECIPE_ID",RECIPE_ID])
nutrient_fields_carbohydrate.push(["TYPE",st("carbohydrate")])
nutrient_fields_carbohydrate.push(["UNIT",st("g")])
nutrient_fields_carbohydrate.push(["AMOUNT",recipe_json.nutrient_amount.carbohydrate])

console.log(arrayToSQL(nutrient_fields_carbohydrate,"NUTRIENT"))

// fat
var nutrient_fields_fat = []
nutrient_fields_fat.push(["RECIPE_ID",RECIPE_ID])
nutrient_fields_fat.push(["TYPE",st("fat")])
nutrient_fields_fat.push(["UNIT",st("g")])
nutrient_fields_fat.push(["AMOUNT",recipe_json.nutrient_amount.fat])

console.log(arrayToSQL(nutrient_fields_fat,"NUTRIENT"))


/**
**
**	TAGS
**
**/

recipe_json.tags.forEach(function(tag) {
	var tag_fields = []
	tag_fields.push(["CATEGORY",st("other")])
	tag_fields.push(["RECIPE_ID",RECIPE_ID])
	tag_fields.push(["NAME",st(tag.name)])

	console.log(arrayToSQL(tag_fields,"TAG"))
});

/**
**
**	INGREDIENTS_BASE
**
**/

recipe_json.ingredients_bases.forEach(function(_ingredients_base) {
	var ib_fields = []
	ib_fields.push(["RECIPE_ID",RECIPE_ID])
	ib_fields.push(["NAME",st(_ingredients_base.name)])
	console.log(arrayToSQL(ib_fields,"INGREDIENTS_BASE"))
	addIngredients(_ingredients_base.ingredients)


});

/**
**
**	INGREDIENTS
**
**/

function addIngredients(_ingredients) {
	_ingredients.forEach(function(ingredient) {
		var ing_fields = []
		ing_fields.push(["INGREDIENTS_BASE_ID",INGREDIENTS_BASE_ID])
		ing_fields.push(["NAME",st(ingredient.name)])
		ing_fields.push(["AMOUNT",st("")])
		ing_fields.push(["UNIT",st("")])
		console.log(arrayToSQL(ing_fields,"INGREDIENT"))
	});
}


/**
**
**	STEP
**
**/

var step_number = 0

recipe_json.steps.forEach(function(_step) {
	step_number++
	var step_fields = []
	step_fields.push(["RECIPE_ID",RECIPE_ID])
	step_fields.push(["MODE",st(_step.mode)])
	step_fields.push(["STEP",step_number])
	step_fields.push(["TEXT",st(_step.txt)])
	addMeasurement(_step.measurement)
	step_fields.push(["MEASUREMENT_ID",MEASUREMENT_ID])
	addMachine_values(_step.machine_values)
	step_fields.push(["MACHINE_VALUES_ID",MACHINE_VALUES_ID])
	addLED_values(_step.LED)
	step_fields.push(["LED_ID",LED_ID])
	console.log(arrayToSQL(step_fields,"STEP"))
});
 
/**
**
**	MEASUREMENT
**
**/

function addMeasurement(_mesurement) {
	var measurement_fields = []
	measurement_fields.push(["SPEED",_mesurement.speed])
	measurement_fields.push(["TEMP",_mesurement.temperature])
	measurement_fields.push(["WEIGHT",_mesurement.weight])
	measurement_fields.push(["LID",0])
	console.log(arrayToSQL(measurement_fields,"MEASUREMENT"))
}

/**
**
**	MACHINE_VALUES
**
**/

function addMachine_values(_machinev) {
	var machinev_fields = []
	machinev_fields.push(["SPEED",_machinev.speed])
	machinev_fields.push(["TEMP",_machinev.temperature])
	machinev_fields.push(["WEIGHT",_machinev.weight])
	machinev_fields.push(["REVERSE",_machinev.reverse])
	machinev_fields.push(["TIME",_machinev.time])
	console.log(arrayToSQL(machinev_fields,"MACHINE_VALUES"))
}

/**
**
**	LED
**
**/
 
function addLED_values(_led) {
	var led_fields = []
	led_fields.push(["ACTION",st("steady")])
	led_fields.push(["COLOR",st("green")])
	console.log(arrayToSQL(led_fields,"LED"))
}

/**
**
** Fonctions utiles pour gagner du temps
**
**/
function arrayToSQL(_array,_table) {

	var SQL_FIELDS_LIST = "("
	var SQL_FIELDS_VALUES = "("
	_array.forEach(function(field) {
	    SQL_FIELDS_LIST += field[0]+", "
	    SQL_FIELDS_VALUES += field[1]+", "
	});
	// On supprime les virgules moches
	SQL_FIELDS_LIST=SQL_FIELDS_LIST.substring(0, SQL_FIELDS_LIST.length - 2);
	SQL_FIELDS_VALUES=SQL_FIELDS_VALUES.substring(0, SQL_FIELDS_VALUES.length - 2);

	SQL_FIELDS_LIST += ")"
	SQL_FIELDS_VALUES += ")"

	var SQL_REQUEST_RECIPE = "INSERT INTO "+_table+" "+SQL_FIELDS_LIST+" VALUES "+SQL_FIELDS_VALUES+";"

	return SQL_REQUEST_RECIPE
}

function st(_txt) {
	return '"'+_txt+'"'
}