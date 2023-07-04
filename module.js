'use strict';

const normalize = (expression) => {
	const operators = ["+", "-", "*", "/", "^", "r", "."];
	let normalized = "";
	let onFractionalZero = false;

	for (let i = 0; i < expression.length; i++){
		const isOperator = operators.includes(expression[i]);

		if (onFractionalZero && isOperator){
			onFractionalZero = false;
		}

		if (expression[i] === " " || onFractionalZero){
			continue;
		}

		else if (isOperator){
			if (expression[i] === "." && (parseInt(expression.slice(i + 1)) === 0 || Number.isNaN(+expression[i + 1]) || expression[i + 1] === " ")){
				onFractionalZero = true;
				continue;
			}

			normalized += expression[i];
		}

		else if (!Number.isNaN(+expression[i])){
			normalized += expression[i];
		}
	}

	normalized += "=";

	return normalized;
};
