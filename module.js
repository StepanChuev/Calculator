'use strict';

const factorial = (n) => {
	let result = n;

	while (n > 1){
		n -= 1;
		result *= n;
	}

	return result;
};

const combination = (k, n) => {
	return factorial(n) / (factorial(k) * factorial(n - k));
};