'use strict';

function calculator() {
   const result = document.querySelector('.calculator__result span'),
      buttons = document.querySelector('.calculator__buttons');

   let pressedDot = false,
      finishCalculate = false,
      currentOperation = null,
      firstNum = null;

   function endsWithOperation() {
      return result.textContent.endsWith('/') || result.textContent.endsWith('*') || result.textContent.endsWith('-')
         || result.textContent.endsWith('+');
   }

   function haveOperation() {
      return result.textContent.includes('/') || result.textContent.includes('*') || result.textContent.includes('-')
         || result.textContent.includes('+');
   }

   function deleteNum() {
      if (result.textContent === '0' || result.textContent.length <= 1) {
         result.textContent = '0';
      } else if (result.textContent.endsWith('.')) {
         pressedDot = false;
         result.textContent = result.textContent.slice(0, -1);
      } else {
         if (result.textContent.endsWith(currentOperation)) {
            currentOperation = false;
         }
         result.textContent = result.textContent.slice(0, -1);
      }
   }

   function cleanResult() {
      pressedDot = false;
      result.textContent = '0';
      currentOperation = false;
   }

   function addDot(target) {
      if (finishCalculate) {
         result.textContent = '0.';
         finishCalculate = false;
      } else if (endsWithOperation()) {
         result.textContent += '0.';
      } else {
         pressedDot = true;
         result.textContent += target.dataset.num;
      }
   }

   function reverseNum() {
      if (result.textContent.endsWith('.')) pressedDot = false;
      if (!result.textContent.includes(currentOperation)) result.textContent = -result.textContent;
   }

   function addNum(target) {
      if (finishCalculate) {
         result.textContent = target.dataset.num;
         finishCalculate = false;
      } else if (result.textContent === '0') {
         result.textContent = '';
         result.textContent += target.dataset.num;
      } else {
         result.textContent += target.dataset.num;
      }
   }

   function makeOperation(operation) {
      if (!currentOperation) {
         firstNum = +result.textContent;
         result.textContent += operation;
         pressedDot = false;
         currentOperation = operation;
         finishCalculate = false;
      } else if (currentOperation && endsWithOperation()) {
         firstNum = parseFloat(result.textContent);
         result.textContent = result.textContent.slice(0, -1) + operation;
         pressedDot = false;
         currentOperation = operation;
         finishCalculate = false;
      } else if (currentOperation && haveOperation() && !endsWithOperation()) {
         calculate();
         firstNum = parseFloat(result.textContent);
         currentOperation = operation;
         pressedDot = false;
         finishCalculate = false;
         result.textContent += operation;
      }
   }

   function calculate() {
      const secondNum = +result.textContent.split(currentOperation)[1];
      const calc = new Function('a', 'b', `return parseFloat((a ${currentOperation} b).toFixed(15))`);
      result.textContent = calc(firstNum, secondNum);
      finishCalculate = true;
      currentOperation = null;
   }

   buttons.addEventListener('click', e => {
      let target = e.target;
      let classList = e.target.classList;

      switch (true) {
         case (classList.contains('calculator__button-c')):
            cleanResult();
            break;

         case (classList.contains('calculator__button-del')):
            deleteNum();
            break;

         case (classList.contains('calculator__button-dot')):
            addDot(target);
            break;

         case (classList.contains('calculator__button-dot') && !pressedDot):
            addDot(target);
            break;

         case (classList.contains('calculator__button-reverse')):
            reverseNum();
            break;

         case (classList.contains('calculator__button-num')):
            addNum(target);
            break;

         case (classList.contains('calculator__button-math')):
            makeOperation(target.dataset.oper);
            break;

         case (classList.contains('calculator__button-equal')):
            calculate();
            break;
      }
   });
}

calculator();