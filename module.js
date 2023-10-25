'use strict';

const normalize = (expression) => {
	const operators = ["+", "-", "*", "/", "^", "r", "(", ")", "."];
	let normalized = "";
	let onFractionalZero = false;
	let isNegativeBracket = false;

	for (let i = 0; i < expression.length; i++){
		const isOperator = operators.includes(expression[i]);

		if (onFractionalZero && isOperator){
			onFractionalZero = false;
		}

		if (expression[i] === "-" && expression[i + 1] === "("){
			isNegativeBracket = true;
		}

		if (expression[i] === " " || onFractionalZero){
			continue;
		}

		if (expression[i] === "-" && (operators.includes(normalized.at(-1)) || i === 0) && !operators.includes(expression[i + 1]) && Number.isNaN(+expression[i + 1])){
			normalized += "-1*";
		}

		else if (isOperator){
			if (expression[i] === "." && (parseInt(expression.slice(i + 1)) === 0 || Number.isNaN(+expression[i + 1]) || expression[i + 1] === " ")){
				onFractionalZero = true;
				continue;
			}

			if (isNegativeBracket){
				normalized += "-1*";
				isNegativeBracket = false;
				continue;
			}

			normalized += expression[i];
		}

		else { // if (!Number.isNaN(+expression[i]))
			normalized += expression[i];
		}
	}

	normalized += "=";

	return normalized;
};


const factorial = (n) => {
	let result = n;

	while (n > 1){
		n -= 1;
		result *= n;
	}

	return result;
};