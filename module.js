'use strict';

const normalize = (expression) => {
	const operators = ["+", "-", "."];
	let normalized = "";

	for (let i = 0; i < expression.length; i++){
		if (expression[i] === " "){
			continue;
		}

		if (!Number.isNaN(+expression[i]) || operators.includes(expression[i])){
			normalized += expression[i];
		}
	}

	normalized += "=";

	return normalized;
};