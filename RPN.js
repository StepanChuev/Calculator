'use strict';

class RPN {
	#operatorsPriority = {
		"+": 1,
		"-": 1,
		"*": 2,
		"/": 2,
		"^": 3,
		"r": 3
	};

	#functions = {
		"sqrt": Math.sqrt,
		"cbrt": Math.cbrt,
		"abs": Math.abs,
		"sin": Math.sin, 
		"cos": Math.cos, 
		"tg": Math.tan,
		"fact": factorial,
		"comb": combination
	};

	#constants = {
		"pi": Math.PI,
		"e": Math.E
	};

	constructor(expression){
		this.expression = expression;
		this.rpnExpression = "";
		this.result = 0;
	}

	#getExpressionInBrackets(expression, index = 0){
		let expressionInBrackets = "";
		let amountBrackets = 1;
		index += (expression[index] === "(") ? 1 : 0;

		while ((expression[index] !== ")" || amountBrackets !== 1) && index < expression.length){
			expressionInBrackets += expression[index];

			if (expression[index] === "("){
				amountBrackets++;
			}

			else if (expression[index] === ")"){
				amountBrackets--;
			}

			index++;
		}

		return expressionInBrackets;
	}

	#splitParameters(expression, separator){
		const parameters = [""];
		let amountBrackets = 0;

		for (let i = 0; i < expression.length; i++){
			if (expression[i] === "("){
				amountBrackets++;
			}

			else if (expression[i] === ")"){
				amountBrackets--;
			}

			if (expression[i] === separator && amountBrackets === 0){
				parameters.push("");

				continue;
			}

			parameters[parameters.length - 1] += expression[i];
		}

		return parameters;
	}

	#extractFromStack(stack, thisOperator){
		let extracted = "";

		while (stack.length && stack.at(-1) !== "(") {
			if (this.#operatorsPriority.hasOwnProperty(stack.at(-1)) && this.#operatorsPriority[stack.at(-1)] < this.#operatorsPriority[thisOperator]){
				break;
			}

			extracted += stack.pop() + " ";
		}

		return extracted;
	}

	#getResultFromOperator(operand1, operand2, operator){
		switch (operator) {
			case "+":
				return operand2 + operand1;

			case "-":
				return operand2 - operand1;

			case "*":
				return operand2 * operand1;

			case "/":
				return operand2 / operand1;

			case "^":
				return operand2 ** operand1;

			case "r":
				return operand2 ** (1 / operand1);
		}
	}

	#calculateParameters(expInBrackets){
		const parameters = this.#splitParameters(expInBrackets, ",");
		const calculated = [];

		for (let i = 0; i < parameters.length; i++){
			const rpn = new RPN("");

			rpn.rpnExpression = parameters[i] + " =";
			calculated.push(rpn.calculateRPN());
		}

		return calculated;
	}

	normalize(expression){
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

			else {
				normalized += expression[i];
			}
		}

		normalized += "=";

		return normalized;
	}

	expressionToRPN(){
		let stack = [];
		let expression = this.expression;
		let nameFunction = "";
		let i = 0;

		while (i < this.expression.length){
			if (
				!Number.isNaN(+this.expression[i]) || 
				(this.expression[i] === "-" && (this.#operatorsPriority.hasOwnProperty(this.expression[i - 1]) || i === 0)))
			{
				stack.push(parseFloat(this.expression.slice(i)).toString());
				i += stack.at(-1).length - 1;
			}

			else if (this.expression[i] === "("){
				const expInBrackets = this.#getExpressionInBrackets(this.expression, i);

				if (this.#functions.hasOwnProperty(nameFunction)){
					this.rpnExpression += nameFunction + "(" + new RPN(expInBrackets + "=").expressionToRPN().slice(0, -1) + ") ";
					nameFunction = "";
				}

				else {
					this.rpnExpression += new RPN(expInBrackets + "=").expressionToRPN();
				}
				
				i += expInBrackets.length + 1;
			}

			else if (this.expression[i] === "=" || this.expression[i] === "," || (this.#operatorsPriority.hasOwnProperty(this.expression[i]) && nameFunction.length <= 0)){
				const thisOperator = this.expression[i];

				this.rpnExpression += this.#extractFromStack(stack, this.expression[i]);
				
				if (this.expression[i] !== ",") {
					stack.push(thisOperator);
				}

				else {
					this.rpnExpression += ", ";
				}
			}

			else if (!this.#operatorsPriority.hasOwnProperty(this.expression[i]) || nameFunction.length > 0){
				nameFunction += this.expression[i];
			}

			if (this.#constants.hasOwnProperty(nameFunction) && (this.#operatorsPriority.hasOwnProperty(this.expression[i + 1]) || this.expression[i + 1] === "=")){
				this.rpnExpression += this.#constants[nameFunction] + " ";
				nameFunction = "";
			}

			i++;
		}

		return this.rpnExpression;
	}

	calculateRPN(){
		let operands = [];
		let nameFunction = "";
		let i = 0;

		while (i < this.rpnExpression.length){
			if (this.rpnExpression[i] === " "){
				i++;
				continue;
			}

			if (
				!Number.isNaN(+this.rpnExpression[i]) || 
				(this.rpnExpression[i] === "-" && (i + 1 < this.rpnExpression.length && this.rpnExpression[i + 1] !== " ")))
			{
				operands.push(parseFloat(this.rpnExpression.slice(i)));
				i += operands.at(-1).toString().length - 1;
			}

			else if ((i > 0 && this.rpnExpression[i - 1] === " ") && (i + 1 < this.rpnExpression.length && this.rpnExpression[i + 1] === " ")){
				this.result = this.#getResultFromOperator(operands.at(-1), operands.at(-2), this.rpnExpression[i]);

				operands.pop();
				operands[operands.length - 1] = this.result;
			}

			else if (this.#functions.hasOwnProperty(nameFunction)){
				const expInBrackets = this.#getExpressionInBrackets(this.rpnExpression, i);
				const parameters = this.#calculateParameters(expInBrackets);

				this.result = this.#functions[nameFunction](...parameters);
				operands.push(this.result);
				nameFunction = "";
				i += expInBrackets.length;
			}

			else if (!["(", ")"].includes(this.rpnExpression[i])){
				nameFunction += this.rpnExpression[i];
			}

			i++;
		}

		if (operands.at(-1) !== this.result){
			this.result = operands.at(-1);
		}

		return this.result;
	}

	calculateExpression(){
		this.result = 0;
		this.rpnExpression = "";
		this.expression = this.normalize(this.expression);
		this.rpnExpression = this.expressionToRPN();
		return this.calculateRPN();
	}
}
