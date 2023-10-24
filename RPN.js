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

	#nameFunctions = {
		"sin": Math.sin, 
		"cos": Math.cos, 
		"tg": Math.tan
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

				if (this.#nameFunctions.hasOwnProperty(nameFunction)){
					this.rpnExpression += nameFunction + "(" + new RPN(expInBrackets + "=").expressionToRPN().slice(0, -1) + ") ";
				}

				else {
					this.rpnExpression += new RPN(expInBrackets + "=").expressionToRPN();
				}
				
				i += expInBrackets.length + 1;
			}

			else if (this.expression[i] === "=" || this.#operatorsPriority.hasOwnProperty(this.expression[i])){
				const thisOperator = this.expression[i];

				while (stack.length && stack.at(-1) !== "(") {
					if (this.#operatorsPriority.hasOwnProperty(stack.at(-1)) && this.#operatorsPriority[stack.at(-1)] < this.#operatorsPriority[thisOperator]){
						break;
					}

					this.rpnExpression += stack.pop() + " ";
				}
				
				stack.push(thisOperator);
			}

			else {
				nameFunction += this.expression[i];
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
				switch (this.rpnExpression[i]) {
					case "+":
						this.result = operands.at(-2) + operands.at(-1);
						operands.pop();
						operands[operands.length - 1] = this.result;
						break;

					case "-":
						this.result = operands.at(-2) - operands.at(-1);
						operands.pop();
						operands[operands.length - 1] = this.result;
						break;

					case "*":
						this.result = operands.at(-2) * operands.at(-1);
						operands.pop();
						operands[operands.length - 1] = this.result;
						break;

					case "/":
						this.result = operands.at(-2) / operands.at(-1);
						operands.pop();
						operands[operands.length - 1] = this.result;
						break;

					case "^":
						this.result = operands.at(-2) ** operands.at(-1);
						operands.pop();
						operands[operands.length - 1] = this.result;
						break;

					case "r":
						this.result = operands.at(-2) ** (1 / operands.at(-1));
						operands.pop();
						operands[operands.length - 1] = this.result;
						break;
				}
			}

			else if (this.#nameFunctions.hasOwnProperty(nameFunction)){
				const expInBrackets = this.#getExpressionInBrackets(this.rpnExpression, i);
				let parameterValue = new RPN("");

				parameterValue.rpnExpression = expInBrackets + " =";
				parameterValue = parameterValue.calculateRPN();

				this.result = this.#nameFunctions[nameFunction](parameterValue); // this.#nameFunctions[nameFunction](parameterValue)
				operands.push(this.result);
				nameFunction = "";
				i += expInBrackets.length;
			}

			else {
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
		this.rpnExpression = this.expressionToRPN();
		return this.calculateRPN();
	}
}
