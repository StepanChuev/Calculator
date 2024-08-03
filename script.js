'use strict';

const input = document.querySelector('.expression');
const calcBtn = document.querySelector('.calculate');
let rpn = new RPN("");

calcBtn.addEventListener("click", () => {
	rpn.expression = input.value;
	input.value = rpn.calculateExpression();
});