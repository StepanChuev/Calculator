'use strict';

class RPN {
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
			if (!Number.isNaN(+this.expression[i])){
				stack.push(parseFloat(this.expression.slice(i)).toString());
				i += stack.at(-1).length - 1;
			}

			else {
				while (stack.length) {
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

			if (!Number.isNaN(+this.rpnExpression[i])){
				operands.push(parseFloat(this.rpnExpression.slice(i)));
				i += operands.at(-1).toString().length - 1;
			}

			else {
				switch (this.rpnExpression[i]) {
					case "+":
						this.result = operands[0] + operands[1];
						operands = [this.result];
						break;

					case "-":
						this.result = operands[0] - operands[1];
						operands = [this.result];
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