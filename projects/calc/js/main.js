"use strict";

class Calc {
  static get MAX_NUMBER() {
    return 24;
  }
  constructor(options) {
    this.elem = options.elem;

    this._operand1 = '';
    this._operand2 = '';
    this._operator = null;
    this._activeOperand = '';
    this._result = '';
    this._hasError = false;

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
      'sqrt': function(obj) {
        return Math.sqrt(obj.a);
      },
      '%': function(obj) {
        return obj.a * obj.b / 100;
      },
      'pow2': function(obj) {
        return Math.pow(obj.a, 2);
      },
      'pow3': function(obj) {
        return Math.pow(obj.a, 3);
      },
      'powy': function(obj) {
        return Math.pow(obj.a, obj.b);
      },
      '10pow': function(obj) {
        return Math.pow(10, obj.a);
      },
      'factorial': function(obj) {
        function factorial(n) {
          return n ? n * factorial(n - 1) : 1;
        }

        return factorial(obj.a);
      }
    }

    // Buttons event listener
    this.elem.addEventListener('click', function(e) {
      var target = e.target;

      if(target.tagName === 'A') {
        if(!this._hasError || (this._hasError && target.dataset.type === 'clear')) {
          this._handleButtonsClick(e);
        }

        this._showResult(this._result || 0);
      }
    }.bind(this));

    // Keyboard event listener
    document.addEventListener('keypress', function(e) {
      if(!this._hasError) {
        this._handleKeyboardClick(e);
      }

      this._showResult(this._result || 0);
    }.bind(this));
    document.addEventListener('keydown', function(e) {
      if(!this._hasError || (this._hasError && e.keyCode === 27)) {
        this._handleKeyboardSpecialClick(e);
      }

      this._showResult(this._result || 0);
    }.bind(this));

    // Show result by default
    this._showResult(0);
  }

  // Handle button's click
  _handleButtonsClick(e) {
    let dataset = e.target.dataset;

    // Button's handler
    switch(dataset.type) {
      case 'operand':
        this._handleOperand(dataset.value);
        break;
      case 'operator':
        this._handleOperator(dataset.value);
        break;
      case 'point':
        this._handlePoint(dataset.value);
        break;
      case 'remove':
        this._handleRemoveButton();
        break;
      case 'sign':
        this._handleChangeSign();
        break;
      case 'result':
        this._handleResult();
        break;
      case 'clear':
        this._handleClear();
        break;
    }
  }

  // Handle keyboard's click
  _handleKeyboardClick(e) {
    let keyCode = e.keyCode,
        char    = getChar(e);

    // operand
    if(keyCode >= 48 && keyCode <= 57) {
      this._handleOperand(char);
    }

    // operator
    if(keyCode === 42 || keyCode === 43 || keyCode === 45 || keyCode === 47) {
      this._handleOperator(char);
    }

    // point
    if(keyCode === 46) {
      this._handlePoint(char);
    }

    function getChar(event) {
      if(event.which == null) {
        if(event.keyCode < 32) return null;
        return String.fromCharCode(event.keyCode)
      }

      if(event.which != 0 && event.charCode != 0) {
        if(event.which < 32) return null;
        return String.fromCharCode(event.which);
      }

      return null;
    }
  }

  _handleKeyboardSpecialClick(e) {
    let keyCode = e.keyCode;

    // clear
    if(keyCode === 8) {
      this._handleRemoveButton();
    }

    // result
    if(keyCode === 13) {
      this._handleResult();
    }

    // clear
    if(keyCode === 27) {
      this._handleClear();
    }
  }

  // Handle operand
  _handleOperand(value) {
    if(this._activeOperand === '0') {
      if(value === '0') {
        return
      } else if(value !== '.') {
        this._activeOperand = '';
      }
    }

    if(this._activeOperand.length < Calc.MAX_NUMBER) {
      this._result = this._activeOperand += value;
    }
  }

  // Handle operator
  _handleOperator(operator) {
    this._copyOperands();

    switch(operator) {
      case '1/x':
      case 'sqrt':
      case 'pow2':
      case 'pow3':
      case '10pow':
      case 'factorial':
        singleMath.apply(this);
        break;
      case '+':
      case '-':
      case '*':
      case '/':
      case 'powy':
        simpleMath.apply(this);
        break;
      case '%':
        complexMath.apply(this);
        break;
    }

    // Simple math function
    function simpleMath() {
      this._interimResult();

      if(this._operand1) {
        this._operator = operator;
      }
    }

    // Single math function
    function singleMath() {
      this._result = this._calcResult({
        firstOperator: this._operand2 || this._operand1,
        operator: operator
      });

      if(!this._operator) {
        this._operand1 = this._result
      } else {
        this._operand2 = this._result
      }
    }

    // Complex math function
    function complexMath() {
      if(this._operator) {
        this._result = this._calcResult({
          firstOperator: this._operand1,
          secondOperator: this._operand2 || this._operand1,
          operator: operator
        });

        this._operand2 = this._result;
      }
    }
  }

  // Handle decimal point
  _handlePoint(value) {
    let activeOperand = this._activeOperand;

    if(activeOperand.indexOf('.') === -1) {
      if(activeOperand.charAt(0) === '') {
        value = '0.';
      }
      this._handleOperand(value);
    }
  }

  // Handle backspace button
  _handleRemoveButton() {
    this._result = this._activeOperand = this._activeOperand.slice(0, -1);
  }

  // Handle change sign button
  _handleChangeSign() {
    let activeOperand = this._activeOperand;

    if(activeOperand) {
      if(activeOperand.charAt(0) === '-') {
        this._activeOperand = activeOperand.slice(1);
      } else {
        this._activeOperand = '-' + activeOperand;
      }

      this._result = this._activeOperand;
    }
  }

  // Result button handler
  _handleResult() {
    if(this._operator) {
      this._copyOperands();
    }

    this._interimResult();
  }

  // Clear button handler
  _handleClear() {
    this._operand1 = '';
    this._operand2 = '';
    this._operator = null;
    this._activeOperand = '';
    this._result = '';
    this._hasError = false;
  }

  // Calculation result
  _calcResult(obj) {
    let result;

    try {
      result = this._allOperators[obj.operator]({
        a: parseFloat(obj.firstOperator) || 0,
        b: parseFloat(obj.secondOperator) || 0
      });
    } catch(e) {}

    if(!isNumeric(result)) {
      this._hasError = true;
      return 'Недопустимое значение';
    }

    function isNumeric(n) {
      return !isNaN(parseFloat(n)) && isFinite(n);
    }

    return +result.toFixed(20);
  }

  // Copy active operand
  _copyOperands() {
    if(this._activeOperand) {
      if(!this._operand1) {
        this._operand1 = this._activeOperand;
      } else {
        this._operand2 = this._activeOperand;
      }

      this._activeOperand = '';
    }
  }

  // Show result
  _showResult(value) {
    this._resultField.value = value;
  }

  _interimResult() {
    if(this._operand1 && this._operand2 && this._operator) {
      this._result = this._calcResult({
        firstOperator: this._operand1,
        secondOperator: this._operand2,
        operator: this._operator
      });

      this._operand1 = this._result;
      this._operand2 = this._operator = '';
    }
  }
}

let calc = new Calc({
  elem: document.querySelector('#calc')
});