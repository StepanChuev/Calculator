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

	constructor(expression){
		this.expression = expression;
		this.rpnExpression = "";
		this.result = 0;
	}

	expressionToRPN(){
		let stack = [];
		let expression = this.expression;
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
				stack.push(this.expression[i]);
			}

			else if (this.expression[i] === ")"){
				let j = stack.length - 1;

				while (stack[j] !== "("){
					j--;
				}

				stack.splice(j, 1);
			}

			else {
				const thisOperator = this.expression[i];

				while (stack.length && stack.at(-1) !== "(") {
					if (this.#operatorsPriority.hasOwnProperty(stack.at(-1)) && this.#operatorsPriority[stack.at(-1)] < this.#operatorsPriority[thisOperator]){
						break;
					}

					this.rpnExpression += stack.pop() + " ";
				}
				
				stack.push(this.expression[i]);
			}

			i++;
		}

		return this.rpnExpression;
	}

	calculateRPN(){
		let operands = [];
		let i = 0;

		while (i < this.rpnExpression.length){
			if (this.rpnExpression[i] === " "){
				i++;
				continue;
			}

			if (
				!Number.isNaN(+this.rpnExpression[i]) || 
				(this.expression[i] === "-" && (this.#operatorsPriority.hasOwnProperty(this.expression[i - 1]) || i === 0)))
			{
				operands.push(parseFloat(this.rpnExpression.slice(i)));
				i += operands.at(-1).toString().length - 1;
			}

			else {
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

			i++;
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
