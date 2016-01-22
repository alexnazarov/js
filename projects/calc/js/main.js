"use strict";

class Calc {
  constructor(options) {
    this.elem = options.elem;

    this._storedOperand = '';
    this._operator = null;
    this._result = '';
    this._activeOperand = '';
    this._buttonType;

    this._resultField = document.querySelector('#result-field');

    // All available operators
    this._allOperators = {
      '+': function(obj) {
        return obj.a + obj.b;
      },
      '-': function(obj) {
        return obj.a - obj.b;
      },
      '*': function(obj) {
        return obj.a * obj.b;
      },
      '/': function(obj) {
        return obj.a / obj.b;
      },
      '1/x': function(obj) {
        return 1 / obj.a;
      },
      '%': function(obj) {
        return obj.a * obj.b / 100;
      }
    }

    // Buttons event listener
    this.elem.addEventListener('click', function(e) {
      if(e.target.tagName === 'BUTTON') {
        this._handleButtonsClick(e)
      }
    }.bind(this));

    // Result by default
    this._showResult(0);
  }

  // Handle button's click
  _handleButtonsClick(e) {
    let dataset = e.target.dataset;

    // Find out button's type
    if(dataset.digit) {
      this._buttonType = 'digit'
    } else if(dataset.decimalPoint) {
      this._buttonType = 'point'
    } else if(dataset.operator) {
      this._buttonType = 'operator'
    } else if(dataset.back) {
      this._buttonType = 'back'
    } else if(dataset.result) {
      this._buttonType = 'result'
    }

    // Button's handler
    switch(this._buttonType) {
      case 'digit':
        this._handleOperand(dataset.digit);
        break;
      case 'point':
        this._handlePoint();
        break;
      case 'operator':
        this._handleOperator(dataset.operator);
        break;
      case 'back':
        this._handleBack();
        break;
      case 'result':
        this._handleResult();
        break;
      default:
        alert('Unknown button\'s type');
    }

    console.log({
      _storedOperand: this._storedOperand,
      _operator: this._operator,
      _activeOperand: this._activeOperand,
      _result: this._result
    });
  }

  // Handle operand
  _handleOperand(digit) {
    this._activeOperand += digit;

    this._showResult(this._activeOperand);
  }

  // Handle operator
  _handleOperator(operator) {
    switch(operator) {
      case '1/x':
        this._activeOperand = this._calcResult({
          firstOperator: this._activeOperand || this._storedOperand || this._result,
          operator: operator
        });

        this._showResult(this._activeOperand);
        break;
      case '+':
      case '-':
      case '*':
      case '/':
        if(this._storedOperand && this._activeOperand) {
          this._activeOperand = this._calcResult({
            firstOperator: this._storedOperand,
            secondOperator: this._activeOperand,
            operator: this._operator
          });
        }

        if(this._activeOperand || this._result) {
          this._storedOperand = this._activeOperand || this._result;
          this._activeOperand = '';
          this._result = '';
        }

        this._operator = operator;

        this._showResult(this._storedOperand);
        break;
      case '%':
        this._activeOperand = this._calcResult({
          firstOperator: this._storedOperand,
          secondOperator: this._activeOperand,
          operator: operator
        });

        this._showResult(this._activeOperand);
        break;
    }
  }

  // Handle decimal point
  _handlePoint() {
    this._activeOperand += '.';
  }

  // Handle backspace button
  _handleBack() {
    this._activeOperand = this._activeOperand.slice(0, -1);

    this._showResult(this._activeOperand);
  }

  // Result button handler
  _handleResult() {
    if(this._storedOperand && this._activeOperand) {
      this._result = this._calcResult({
        firstOperator: this._storedOperand,
        secondOperator: this._activeOperand,
        operator: this._operator
      });
      this._activeOperand = '';
      this._storedOperand = '';
      this._operator = '';

      this._showResult(this._result);
    }

  }

  // Calculation result
  _calcResult(obj) {
    return this._allOperators[obj.operator]({
      a: parseFloat(obj.firstOperator) || 0,
      b: parseFloat(obj.secondOperator) || 0
    });
  }

  // Show result
  _showResult(value) {
    this._resultField.value = value;
  }

}

let calc = new Calc({
  elem: document.querySelector('#calc')
});