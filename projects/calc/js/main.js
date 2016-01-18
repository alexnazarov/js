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
      '+': function(a, b) {
        return a + b;
      },
      '-': function(a, b) {
        return a - b;
      },
      '*': function(a, b) {
        return a * b;
      },
      '/': function(a, b) {
        return a / b;
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
        this._handleOperand(dataset);
        break;
      case 'point':
        this._handlePoint();
        break;
      case 'operator':
        this._handleOperator(dataset);
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
  _handleOperand(dataset) {
    this._activeOperand += dataset.digit;

    this._showResult(this._activeOperand);
  }

  // Handle operator
  _handleOperator(dataset) {
    // If operator takes one argument
    if(this._allOperators[dataset.operator].length === 1) {
      this._activeOperand = this._calcResult({
        firstOperator: this._activeOperand || this._storedOperand || this._result || 0,
        operator: dataset.operator
      });

      this._showResult(this._activeOperand);
    }

    // If operator takes two arguments
    if(this._allOperators[dataset.operator].length === 2) {
      if(this._storedOperand && this._activeOperand) {
        this._activeOperand = this._calcResult({
          firstOperator: this._storedOperand || 0,
          secondOperator: this._activeOperand || 0,
          operator: this._operator
        });
      }

      if(this._activeOperand || this._result) {
        this._storedOperand = this._activeOperand || this._result;
        this._activeOperand = '';
        this._result = '';
      }

      this._operator = dataset.operator;

      this._showResult(this._storedOperand);
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

  // Calculation result
  _calcResult(obj) {
    return this._allOperators[obj.operator](parseFloat(obj.firstOperator), parseFloat(obj.secondOperator));
  }

  // Result button handler
  _handleResult() {
    if(this._storedOperand && this._activeOperand) {
      this._result = this._calcResult({
        firstOperator: this._storedOperand || 0,
        secondOperator: this._activeOperand || 0,
        operator: this._operator
      });
      this._activeOperand = '';
      this._storedOperand = '';
      this._operator = '';

      this._showResult(this._result);
    }

  }

  // Show result
  _showResult(value) {
    this._resultField.value = value;
  }

  // Add custom operator
  addOperator(name, func) {
    this._allOperators[name] = func;
  }
}

let calcEl       = document.querySelector('#calc'),
    customButton = document.querySelector('#customButton');

let calc = new Calc({
  elem: calcEl
});

// You can add your own operators
calc.addOperator(customButton.getAttribute('data-operator'), function(a) {
  return 1 / a;
});