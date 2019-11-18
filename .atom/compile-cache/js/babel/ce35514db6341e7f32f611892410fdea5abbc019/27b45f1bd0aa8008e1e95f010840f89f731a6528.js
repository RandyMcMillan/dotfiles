'use babel';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var changeCase = require('change-case');
var selectList = undefined;

var _require = require('atom');

var BufferedProcess = _require.BufferedProcess;

var _require2 = require('./operator');

var Operator = _require2.Operator;

// TransformString
// ================================

var TransformString = (function (_Operator) {
  _inherits(TransformString, _Operator);

  function TransformString() {
    _classCallCheck(this, TransformString);

    _get(Object.getPrototypeOf(TransformString.prototype), 'constructor', this).apply(this, arguments);

    this.trackChange = true;
    this.stayOptionName = 'stayOnTransformString';
    this.autoIndent = false;
    this.autoIndentNewline = false;
    this.replaceByDiff = false;
  }

  _createClass(TransformString, [{
    key: 'mutateSelection',
    value: function mutateSelection(selection) {
      var text = this.getNewText(selection.getText(), selection);
      if (text) {
        if (this.replaceByDiff) {
          this.replaceTextInRangeViaDiff(selection.getBufferRange(), text);
        } else {
          selection.insertText(text, { autoIndent: this.autoIndent, autoIndentNewline: this.autoIndentNewline });
        }
      }
    }
  }], [{
    key: 'registerToSelectList',
    value: function registerToSelectList() {
      this.stringTransformers.push(this);
    }
  }, {
    key: 'command',
    value: false,
    enumerable: true
  }, {
    key: 'stringTransformers',
    value: [],
    enumerable: true
  }]);

  return TransformString;
})(Operator);

var ChangeCase = (function (_TransformString) {
  _inherits(ChangeCase, _TransformString);

  function ChangeCase() {
    _classCallCheck(this, ChangeCase);

    _get(Object.getPrototypeOf(ChangeCase.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(ChangeCase, [{
    key: 'getNewText',
    value: function getNewText(text) {
      var functionName = this.functionName || changeCase.lowerCaseFirst(this.name);
      // HACK: Pure Vim's `~` is too aggressive(e.g. remove punctuation, remove white spaces...).
      // Here intentionally making changeCase less aggressive by narrowing target charset.
      var charset = '[À-ʯΆ-և\\w]';
      var regex = new RegExp(charset + '+(:?[-./]?' + charset + '+)*', 'g');
      return text.replace(regex, function (match) {
        return changeCase[functionName](match);
      });
    }
  }], [{
    key: 'command',
    value: false,
    enumerable: true
  }]);

  return ChangeCase;
})(TransformString);

var NoCase = (function (_ChangeCase) {
  _inherits(NoCase, _ChangeCase);

  function NoCase() {
    _classCallCheck(this, NoCase);

    _get(Object.getPrototypeOf(NoCase.prototype), 'constructor', this).apply(this, arguments);
  }

  return NoCase;
})(ChangeCase);

var DotCase = (function (_ChangeCase2) {
  _inherits(DotCase, _ChangeCase2);

  function DotCase() {
    _classCallCheck(this, DotCase);

    _get(Object.getPrototypeOf(DotCase.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(DotCase, null, [{
    key: 'displayNameSuffix',
    value: '.',
    enumerable: true
  }]);

  return DotCase;
})(ChangeCase);

var SwapCase = (function (_ChangeCase3) {
  _inherits(SwapCase, _ChangeCase3);

  function SwapCase() {
    _classCallCheck(this, SwapCase);

    _get(Object.getPrototypeOf(SwapCase.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(SwapCase, null, [{
    key: 'displayNameSuffix',
    value: '~',
    enumerable: true
  }]);

  return SwapCase;
})(ChangeCase);

var PathCase = (function (_ChangeCase4) {
  _inherits(PathCase, _ChangeCase4);

  function PathCase() {
    _classCallCheck(this, PathCase);

    _get(Object.getPrototypeOf(PathCase.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(PathCase, null, [{
    key: 'displayNameSuffix',
    value: '/',
    enumerable: true
  }]);

  return PathCase;
})(ChangeCase);

var UpperCase = (function (_ChangeCase5) {
  _inherits(UpperCase, _ChangeCase5);

  function UpperCase() {
    _classCallCheck(this, UpperCase);

    _get(Object.getPrototypeOf(UpperCase.prototype), 'constructor', this).apply(this, arguments);
  }

  return UpperCase;
})(ChangeCase);

var LowerCase = (function (_ChangeCase6) {
  _inherits(LowerCase, _ChangeCase6);

  function LowerCase() {
    _classCallCheck(this, LowerCase);

    _get(Object.getPrototypeOf(LowerCase.prototype), 'constructor', this).apply(this, arguments);
  }

  return LowerCase;
})(ChangeCase);

var CamelCase = (function (_ChangeCase7) {
  _inherits(CamelCase, _ChangeCase7);

  function CamelCase() {
    _classCallCheck(this, CamelCase);

    _get(Object.getPrototypeOf(CamelCase.prototype), 'constructor', this).apply(this, arguments);
  }

  return CamelCase;
})(ChangeCase);

var SnakeCase = (function (_ChangeCase8) {
  _inherits(SnakeCase, _ChangeCase8);

  function SnakeCase() {
    _classCallCheck(this, SnakeCase);

    _get(Object.getPrototypeOf(SnakeCase.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(SnakeCase, null, [{
    key: 'displayNameSuffix',
    value: '_',
    enumerable: true
  }]);

  return SnakeCase;
})(ChangeCase);

var TitleCase = (function (_ChangeCase9) {
  _inherits(TitleCase, _ChangeCase9);

  function TitleCase() {
    _classCallCheck(this, TitleCase);

    _get(Object.getPrototypeOf(TitleCase.prototype), 'constructor', this).apply(this, arguments);
  }

  return TitleCase;
})(ChangeCase);

var ParamCase = (function (_ChangeCase10) {
  _inherits(ParamCase, _ChangeCase10);

  function ParamCase() {
    _classCallCheck(this, ParamCase);

    _get(Object.getPrototypeOf(ParamCase.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(ParamCase, null, [{
    key: 'displayNameSuffix',
    value: '-',
    enumerable: true
  }]);

  return ParamCase;
})(ChangeCase);

var HeaderCase = (function (_ChangeCase11) {
  _inherits(HeaderCase, _ChangeCase11);

  function HeaderCase() {
    _classCallCheck(this, HeaderCase);

    _get(Object.getPrototypeOf(HeaderCase.prototype), 'constructor', this).apply(this, arguments);
  }

  return HeaderCase;
})(ChangeCase);

var PascalCase = (function (_ChangeCase12) {
  _inherits(PascalCase, _ChangeCase12);

  function PascalCase() {
    _classCallCheck(this, PascalCase);

    _get(Object.getPrototypeOf(PascalCase.prototype), 'constructor', this).apply(this, arguments);
  }

  return PascalCase;
})(ChangeCase);

var ConstantCase = (function (_ChangeCase13) {
  _inherits(ConstantCase, _ChangeCase13);

  function ConstantCase() {
    _classCallCheck(this, ConstantCase);

    _get(Object.getPrototypeOf(ConstantCase.prototype), 'constructor', this).apply(this, arguments);
  }

  return ConstantCase;
})(ChangeCase);

var SentenceCase = (function (_ChangeCase14) {
  _inherits(SentenceCase, _ChangeCase14);

  function SentenceCase() {
    _classCallCheck(this, SentenceCase);

    _get(Object.getPrototypeOf(SentenceCase.prototype), 'constructor', this).apply(this, arguments);
  }

  return SentenceCase;
})(ChangeCase);

var UpperCaseFirst = (function (_ChangeCase15) {
  _inherits(UpperCaseFirst, _ChangeCase15);

  function UpperCaseFirst() {
    _classCallCheck(this, UpperCaseFirst);

    _get(Object.getPrototypeOf(UpperCaseFirst.prototype), 'constructor', this).apply(this, arguments);
  }

  return UpperCaseFirst;
})(ChangeCase);

var LowerCaseFirst = (function (_ChangeCase16) {
  _inherits(LowerCaseFirst, _ChangeCase16);

  function LowerCaseFirst() {
    _classCallCheck(this, LowerCaseFirst);

    _get(Object.getPrototypeOf(LowerCaseFirst.prototype), 'constructor', this).apply(this, arguments);
  }

  return LowerCaseFirst;
})(ChangeCase);

var DashCase = (function (_ChangeCase17) {
  _inherits(DashCase, _ChangeCase17);

  function DashCase() {
    _classCallCheck(this, DashCase);

    _get(Object.getPrototypeOf(DashCase.prototype), 'constructor', this).apply(this, arguments);

    this.functionName = 'paramCase';
  }

  _createClass(DashCase, null, [{
    key: 'displayNameSuffix',
    value: '-',
    enumerable: true
  }]);

  return DashCase;
})(ChangeCase);

var ToggleCase = (function (_ChangeCase18) {
  _inherits(ToggleCase, _ChangeCase18);

  function ToggleCase() {
    _classCallCheck(this, ToggleCase);

    _get(Object.getPrototypeOf(ToggleCase.prototype), 'constructor', this).apply(this, arguments);

    this.functionName = 'swapCase';
  }

  _createClass(ToggleCase, null, [{
    key: 'displayNameSuffix',
    value: '~',
    enumerable: true
  }]);

  return ToggleCase;
})(ChangeCase);

var ToggleCaseAndMoveRight = (function (_ChangeCase19) {
  _inherits(ToggleCaseAndMoveRight, _ChangeCase19);

  function ToggleCaseAndMoveRight() {
    _classCallCheck(this, ToggleCaseAndMoveRight);

    _get(Object.getPrototypeOf(ToggleCaseAndMoveRight.prototype), 'constructor', this).apply(this, arguments);

    this.functionName = 'swapCase';
    this.flashTarget = false;
    this.restorePositions = false;
    this.target = 'MoveRight';
  }

  // Replace
  // -------------------------
  return ToggleCaseAndMoveRight;
})(ChangeCase);

var Replace = (function (_TransformString2) {
  _inherits(Replace, _TransformString2);

  function Replace() {
    _classCallCheck(this, Replace);

    _get(Object.getPrototypeOf(Replace.prototype), 'constructor', this).apply(this, arguments);

    this.flashCheckpoint = 'did-select-occurrence';
    this.autoIndentNewline = true;
    this.readInputAfterSelect = true;
  }

  _createClass(Replace, [{
    key: 'getNewText',
    value: function getNewText(text) {
      if (this.target.name === 'MoveRightBufferColumn' && text.length !== this.getCount()) {
        return;
      }

      var input = this.input || '\n';
      if (input === '\n') {
        this.restorePositions = false;
      }
      return text.replace(/./g, input);
    }
  }]);

  return Replace;
})(TransformString);

var ReplaceCharacter = (function (_Replace) {
  _inherits(ReplaceCharacter, _Replace);

  function ReplaceCharacter() {
    _classCallCheck(this, ReplaceCharacter);

    _get(Object.getPrototypeOf(ReplaceCharacter.prototype), 'constructor', this).apply(this, arguments);

    this.target = 'MoveRightBufferColumn';
  }

  // -------------------------
  // DUP meaning with SplitString need consolidate.
  return ReplaceCharacter;
})(Replace);

var SplitByCharacter = (function (_TransformString3) {
  _inherits(SplitByCharacter, _TransformString3);

  function SplitByCharacter() {
    _classCallCheck(this, SplitByCharacter);

    _get(Object.getPrototypeOf(SplitByCharacter.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(SplitByCharacter, [{
    key: 'getNewText',
    value: function getNewText(text) {
      return text.split('').join(' ');
    }
  }]);

  return SplitByCharacter;
})(TransformString);

var EncodeUriComponent = (function (_TransformString4) {
  _inherits(EncodeUriComponent, _TransformString4);

  function EncodeUriComponent() {
    _classCallCheck(this, EncodeUriComponent);

    _get(Object.getPrototypeOf(EncodeUriComponent.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(EncodeUriComponent, [{
    key: 'getNewText',
    value: function getNewText(text) {
      return encodeURIComponent(text);
    }
  }], [{
    key: 'displayNameSuffix',
    value: '%',
    enumerable: true
  }]);

  return EncodeUriComponent;
})(TransformString);

var DecodeUriComponent = (function (_TransformString5) {
  _inherits(DecodeUriComponent, _TransformString5);

  function DecodeUriComponent() {
    _classCallCheck(this, DecodeUriComponent);

    _get(Object.getPrototypeOf(DecodeUriComponent.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(DecodeUriComponent, [{
    key: 'getNewText',
    value: function getNewText(text) {
      return decodeURIComponent(text);
    }
  }], [{
    key: 'displayNameSuffix',
    value: '%%',
    enumerable: true
  }]);

  return DecodeUriComponent;
})(TransformString);

var TrimString = (function (_TransformString6) {
  _inherits(TrimString, _TransformString6);

  function TrimString() {
    _classCallCheck(this, TrimString);

    _get(Object.getPrototypeOf(TrimString.prototype), 'constructor', this).apply(this, arguments);

    this.stayByMarker = true;
    this.replaceByDiff = true;
  }

  _createClass(TrimString, [{
    key: 'getNewText',
    value: function getNewText(text) {
      return text.trim();
    }
  }]);

  return TrimString;
})(TransformString);

var CompactSpaces = (function (_TransformString7) {
  _inherits(CompactSpaces, _TransformString7);

  function CompactSpaces() {
    _classCallCheck(this, CompactSpaces);

    _get(Object.getPrototypeOf(CompactSpaces.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(CompactSpaces, [{
    key: 'getNewText',
    value: function getNewText(text) {
      if (text.match(/^[ ]+$/)) {
        return ' ';
      } else {
        // Don't compact for leading and trailing white spaces.
        var regex = /^(\s*)(.*?)(\s*)$/gm;
        return text.replace(regex, function (m, leading, middle, trailing) {
          return leading + middle.split(/[ \t]+/).join(' ') + trailing;
        });
      }
    }
  }]);

  return CompactSpaces;
})(TransformString);

var AlignOccurrence = (function (_TransformString8) {
  _inherits(AlignOccurrence, _TransformString8);

  function AlignOccurrence() {
    _classCallCheck(this, AlignOccurrence);

    _get(Object.getPrototypeOf(AlignOccurrence.prototype), 'constructor', this).apply(this, arguments);

    this.occurrence = true;
    this.whichToPad = 'auto';
  }

  _createClass(AlignOccurrence, [{
    key: 'getSelectionTaker',
    value: function getSelectionTaker() {
      var selectionsByRow = {};
      for (var selection of this.editor.getSelectionsOrderedByBufferPosition()) {
        var row = selection.getBufferRange().start.row;
        if (!(row in selectionsByRow)) selectionsByRow[row] = [];
        selectionsByRow[row].push(selection);
      }
      var allRows = Object.keys(selectionsByRow);
      return function () {
        return allRows.map(function (row) {
          return selectionsByRow[row].shift();
        }).filter(function (s) {
          return s;
        });
      };
    }
  }, {
    key: 'getWichToPadForText',
    value: function getWichToPadForText(text) {
      if (this.whichToPad !== 'auto') return this.whichToPad;

      if (/^\s*[=|]\s*$/.test(text)) {
        // Asignment(=) and `|`(markdown-table separator)
        return 'start';
      } else if (/^\s*,\s*$/.test(text)) {
        // Arguments
        return 'end';
      } else if (/\W$/.test(text)) {
        // ends with non-word-char
        return 'end';
      } else {
        return 'start';
      }
    }
  }, {
    key: 'calculatePadding',
    value: function calculatePadding() {
      var _this = this;

      var totalAmountOfPaddingByRow = {};
      var columnForSelection = function columnForSelection(selection) {
        var which = _this.getWichToPadForText(selection.getText());
        var point = selection.getBufferRange()[which];
        return point.column + (totalAmountOfPaddingByRow[point.row] || 0);
      };

      var takeSelections = this.getSelectionTaker();
      while (true) {
        var selections = takeSelections();
        if (!selections.length) return;
        var maxColumn = selections.map(columnForSelection).reduce(function (max, cur) {
          return cur > max ? cur : max;
        });
        for (var selection of selections) {
          var row = selection.getBufferRange().start.row;
          var amountOfPadding = maxColumn - columnForSelection(selection);
          totalAmountOfPaddingByRow[row] = (totalAmountOfPaddingByRow[row] || 0) + amountOfPadding;
          this.amountOfPaddingBySelection.set(selection, amountOfPadding);
        }
      }
    }
  }, {
    key: 'execute',
    value: function execute() {
      var _this2 = this;

      this.amountOfPaddingBySelection = new Map();
      this.onDidSelectTarget(function () {
        _this2.calculatePadding();
      });
      _get(Object.getPrototypeOf(AlignOccurrence.prototype), 'execute', this).call(this);
    }
  }, {
    key: 'getNewText',
    value: function getNewText(text, selection) {
      var padding = ' '.repeat(this.amountOfPaddingBySelection.get(selection));
      var whichToPad = this.getWichToPadForText(selection.getText());
      return whichToPad === 'start' ? padding + text : text + padding;
    }
  }]);

  return AlignOccurrence;
})(TransformString);

var AlignOccurrenceByPadLeft = (function (_AlignOccurrence) {
  _inherits(AlignOccurrenceByPadLeft, _AlignOccurrence);

  function AlignOccurrenceByPadLeft() {
    _classCallCheck(this, AlignOccurrenceByPadLeft);

    _get(Object.getPrototypeOf(AlignOccurrenceByPadLeft.prototype), 'constructor', this).apply(this, arguments);

    this.whichToPad = 'start';
  }

  return AlignOccurrenceByPadLeft;
})(AlignOccurrence);

var AlignOccurrenceByPadRight = (function (_AlignOccurrence2) {
  _inherits(AlignOccurrenceByPadRight, _AlignOccurrence2);

  function AlignOccurrenceByPadRight() {
    _classCallCheck(this, AlignOccurrenceByPadRight);

    _get(Object.getPrototypeOf(AlignOccurrenceByPadRight.prototype), 'constructor', this).apply(this, arguments);

    this.whichToPad = 'end';
  }

  return AlignOccurrenceByPadRight;
})(AlignOccurrence);

var RemoveLeadingWhiteSpaces = (function (_TransformString9) {
  _inherits(RemoveLeadingWhiteSpaces, _TransformString9);

  function RemoveLeadingWhiteSpaces() {
    _classCallCheck(this, RemoveLeadingWhiteSpaces);

    _get(Object.getPrototypeOf(RemoveLeadingWhiteSpaces.prototype), 'constructor', this).apply(this, arguments);

    this.wise = 'linewise';
  }

  _createClass(RemoveLeadingWhiteSpaces, [{
    key: 'getNewText',
    value: function getNewText(text, selection) {
      var trimLeft = function trimLeft(text) {
        return text.trimLeft();
      };
      return this.utils.splitTextByNewLine(text).map(trimLeft).join('\n') + '\n';
    }
  }]);

  return RemoveLeadingWhiteSpaces;
})(TransformString);

var ConvertToSoftTab = (function (_TransformString10) {
  _inherits(ConvertToSoftTab, _TransformString10);

  function ConvertToSoftTab() {
    _classCallCheck(this, ConvertToSoftTab);

    _get(Object.getPrototypeOf(ConvertToSoftTab.prototype), 'constructor', this).apply(this, arguments);

    this.wise = 'linewise';
  }

  _createClass(ConvertToSoftTab, [{
    key: 'mutateSelection',
    value: function mutateSelection(selection) {
      var _this3 = this;

      this.scanEditor('forward', /\t/g, { scanRange: selection.getBufferRange() }, function (_ref) {
        var range = _ref.range;
        var replace = _ref.replace;

        // Replace \t to spaces which length is vary depending on tabStop and tabLenght
        // So we directly consult it's screen representing length.
        var length = _this3.editor.screenRangeForBufferRange(range).getExtent().column;
        replace(' '.repeat(length));
      });
    }
  }], [{
    key: 'displayName',
    value: 'Soft Tab',
    enumerable: true
  }]);

  return ConvertToSoftTab;
})(TransformString);

var ConvertToHardTab = (function (_TransformString11) {
  _inherits(ConvertToHardTab, _TransformString11);

  function ConvertToHardTab() {
    _classCallCheck(this, ConvertToHardTab);

    _get(Object.getPrototypeOf(ConvertToHardTab.prototype), 'constructor', this).apply(this, arguments);
  }

  // -------------------------

  _createClass(ConvertToHardTab, [{
    key: 'mutateSelection',
    value: function mutateSelection(selection) {
      var _this4 = this;

      var tabLength = this.editor.getTabLength();
      this.scanEditor('forward', /[ \t]+/g, { scanRange: selection.getBufferRange() }, function (_ref2) {
        var range = _ref2.range;
        var replace = _ref2.replace;

        var _editor$screenRangeForBufferRange = _this4.editor.screenRangeForBufferRange(range);

        var start = _editor$screenRangeForBufferRange.start;
        var end = _editor$screenRangeForBufferRange.end;

        var startColumn = start.column;
        var endColumn = end.column;

        // We can't naively replace spaces to tab, we have to consider valid tabStop column
        // If nextTabStop column exceeds replacable range, we pad with spaces.
        var newText = '';
        while (true) {
          var remainder = startColumn % tabLength;
          var nextTabStop = startColumn + (remainder === 0 ? tabLength : remainder);
          if (nextTabStop > endColumn) {
            newText += ' '.repeat(endColumn - startColumn);
          } else {
            newText += '\t';
          }
          startColumn = nextTabStop;
          if (startColumn >= endColumn) {
            break;
          }
        }

        replace(newText);
      });
    }
  }], [{
    key: 'displayName',
    value: 'Hard Tab',
    enumerable: true
  }]);

  return ConvertToHardTab;
})(TransformString);

var TransformStringByExternalCommand = (function (_TransformString12) {
  _inherits(TransformStringByExternalCommand, _TransformString12);

  function TransformStringByExternalCommand() {
    _classCallCheck(this, TransformStringByExternalCommand);

    _get(Object.getPrototypeOf(TransformStringByExternalCommand.prototype), 'constructor', this).apply(this, arguments);

    this.autoIndent = true;
    this.command = '';
    this.args = [];
  }

  // -------------------------

  _createClass(TransformStringByExternalCommand, [{
    key: 'getNewText',
    // e.g args: ['-rn']

    // NOTE: Unlike other class, first arg is `stdout` of external commands.
    value: function getNewText(text, selection) {
      return text || selection.getText();
    }
  }, {
    key: 'getCommand',
    value: function getCommand(selection) {
      return { command: this.command, args: this.args };
    }
  }, {
    key: 'getStdin',
    value: function getStdin(selection) {
      return selection.getText();
    }
  }, {
    key: 'execute',
    value: _asyncToGenerator(function* () {
      this.preSelect();

      if (this.selectTarget()) {
        for (var selection of this.editor.getSelections()) {
          var _ref3 = this.getCommand(selection) || {};

          var command = _ref3.command;
          var args = _ref3.args;

          if (command == null || args == null) continue;

          var stdout = yield this.runExternalCommand({ command: command, args: args, stdin: this.getStdin(selection) });
          selection.insertText(this.getNewText(stdout, selection), { autoIndent: this.autoIndent });
        }
        this.mutationManager.setCheckpoint('did-finish');
        this.restoreCursorPositionsIfNecessary();
      }
      this.postMutate();
    })
  }, {
    key: 'runExternalCommand',
    value: function runExternalCommand(options) {
      var _this5 = this;

      var output = '';
      options.stdout = function (data) {
        return output += data;
      };
      var exitPromise = new Promise(function (resolve) {
        options.exit = function () {
          return resolve(output);
        };
      });
      var stdin = options.stdin;

      delete options.stdin;
      var bufferedProcess = new BufferedProcess(options);
      bufferedProcess.onWillThrowError(function (_ref4) {
        var error = _ref4.error;
        var handle = _ref4.handle;

        // Suppress command not found error intentionally.
        if (error.code === 'ENOENT' && error.syscall.indexOf('spawn') === 0) {
          console.log(_this5.getCommandName() + ': Failed to spawn command ' + error.path + '.');
          handle();
        }
        _this5.cancelOperation();
      });

      if (stdin) {
        bufferedProcess.process.stdin.write(stdin);
        bufferedProcess.process.stdin.end();
      }
      return exitPromise;
    }
  }], [{
    key: 'command',
    value: false,
    enumerable: true
  }]);

  return TransformStringByExternalCommand;
})(TransformString);

var TransformStringBySelectList = (function (_TransformString13) {
  _inherits(TransformStringBySelectList, _TransformString13);

  function TransformStringBySelectList() {
    _classCallCheck(this, TransformStringBySelectList);

    _get(Object.getPrototypeOf(TransformStringBySelectList.prototype), 'constructor', this).apply(this, arguments);

    this.target = 'Empty';
    this.recordable = false;
  }

  _createClass(TransformStringBySelectList, [{
    key: 'selectItems',
    value: function selectItems() {
      if (!selectList) {
        var SelectList = require('./select-list');
        selectList = new SelectList();
      }
      return selectList.selectFromItems(this.constructor.getSelectListItems());
    }
  }, {
    key: 'execute',
    value: _asyncToGenerator(function* () {
      var item = yield this.selectItems();
      if (item) {
        this.vimState.operationStack.runNext(item.klass, { target: this.nextTarget });
      }
    })
  }], [{
    key: 'getSelectListItems',
    value: function getSelectListItems() {
      var _this6 = this;

      if (!this.selectListItems) {
        this.selectListItems = this.stringTransformers.map(function (klass) {
          var suffix = klass.hasOwnProperty('displayNameSuffix') ? ' ' + klass.displayNameSuffix : '';

          return {
            klass: klass,
            displayName: klass.hasOwnProperty('displayName') ? klass.displayName + suffix : _this6._.humanizeEventName(_this6._.dasherize(klass.name)) + suffix
          };
        });
      }
      return this.selectListItems;
    }
  }]);

  return TransformStringBySelectList;
})(TransformString);

var TransformWordBySelectList = (function (_TransformStringBySelectList) {
  _inherits(TransformWordBySelectList, _TransformStringBySelectList);

  function TransformWordBySelectList() {
    _classCallCheck(this, TransformWordBySelectList);

    _get(Object.getPrototypeOf(TransformWordBySelectList.prototype), 'constructor', this).apply(this, arguments);

    this.nextTarget = 'InnerWord';
  }

  return TransformWordBySelectList;
})(TransformStringBySelectList);

var TransformSmartWordBySelectList = (function (_TransformStringBySelectList2) {
  _inherits(TransformSmartWordBySelectList, _TransformStringBySelectList2);

  function TransformSmartWordBySelectList() {
    _classCallCheck(this, TransformSmartWordBySelectList);

    _get(Object.getPrototypeOf(TransformSmartWordBySelectList.prototype), 'constructor', this).apply(this, arguments);

    this.nextTarget = 'InnerSmartWord';
  }

  // -------------------------
  return TransformSmartWordBySelectList;
})(TransformStringBySelectList);

var ReplaceWithRegister = (function (_TransformString14) {
  _inherits(ReplaceWithRegister, _TransformString14);

  function ReplaceWithRegister() {
    _classCallCheck(this, ReplaceWithRegister);

    _get(Object.getPrototypeOf(ReplaceWithRegister.prototype), 'constructor', this).apply(this, arguments);

    this.flashType = 'operator-long';
  }

  _createClass(ReplaceWithRegister, [{
    key: 'initialize',
    value: function initialize() {
      this.vimState.sequentialPasteManager.onInitialize(this);
      _get(Object.getPrototypeOf(ReplaceWithRegister.prototype), 'initialize', this).call(this);
    }
  }, {
    key: 'execute',
    value: function execute() {
      this.sequentialPaste = this.vimState.sequentialPasteManager.onExecute(this);

      _get(Object.getPrototypeOf(ReplaceWithRegister.prototype), 'execute', this).call(this);

      for (var selection of this.editor.getSelections()) {
        var range = this.mutationManager.getMutatedBufferRangeForSelection(selection);
        this.vimState.sequentialPasteManager.savePastedRangeForSelection(selection, range);
      }
    }
  }, {
    key: 'getNewText',
    value: function getNewText(text, selection) {
      var value = this.vimState.register.get(null, selection, this.sequentialPaste);
      return value ? value.text : '';
    }
  }]);

  return ReplaceWithRegister;
})(TransformString);

var ReplaceOccurrenceWithRegister = (function (_ReplaceWithRegister) {
  _inherits(ReplaceOccurrenceWithRegister, _ReplaceWithRegister);

  function ReplaceOccurrenceWithRegister() {
    _classCallCheck(this, ReplaceOccurrenceWithRegister);

    _get(Object.getPrototypeOf(ReplaceOccurrenceWithRegister.prototype), 'constructor', this).apply(this, arguments);

    this.occurrence = true;
  }

  // Save text to register before replace
  return ReplaceOccurrenceWithRegister;
})(ReplaceWithRegister);

var SwapWithRegister = (function (_TransformString15) {
  _inherits(SwapWithRegister, _TransformString15);

  function SwapWithRegister() {
    _classCallCheck(this, SwapWithRegister);

    _get(Object.getPrototypeOf(SwapWithRegister.prototype), 'constructor', this).apply(this, arguments);
  }

  // Indent < TransformString
  // -------------------------

  _createClass(SwapWithRegister, [{
    key: 'getNewText',
    value: function getNewText(text, selection) {
      var newText = this.vimState.register.getText();
      this.setTextToRegister(text, selection);
      return newText;
    }
  }]);

  return SwapWithRegister;
})(TransformString);

var Indent = (function (_TransformString16) {
  _inherits(Indent, _TransformString16);

  function Indent() {
    _classCallCheck(this, Indent);

    _get(Object.getPrototypeOf(Indent.prototype), 'constructor', this).apply(this, arguments);

    this.stayByMarker = true;
    this.setToFirstCharacterOnLinewise = true;
    this.wise = 'linewise';
  }

  _createClass(Indent, [{
    key: 'mutateSelection',
    value: function mutateSelection(selection) {
      var _this7 = this;

      // Need count times indentation in visual-mode and its repeat(`.`).
      if (this.target.name === 'CurrentSelection') {
        (function () {
          var oldText = undefined;
          // limit to 100 to avoid freezing by accidental big number.
          _this7.countTimes(_this7.limitNumber(_this7.getCount(), { max: 100 }), function (_ref5) {
            var stop = _ref5.stop;

            oldText = selection.getText();
            _this7.indent(selection);
            if (selection.getText() === oldText) stop();
          });
        })();
      } else {
        this.indent(selection);
      }
    }
  }, {
    key: 'indent',
    value: function indent(selection) {
      selection.indentSelectedRows();
    }
  }]);

  return Indent;
})(TransformString);

var Outdent = (function (_Indent) {
  _inherits(Outdent, _Indent);

  function Outdent() {
    _classCallCheck(this, Outdent);

    _get(Object.getPrototypeOf(Outdent.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(Outdent, [{
    key: 'indent',
    value: function indent(selection) {
      selection.outdentSelectedRows();
    }
  }]);

  return Outdent;
})(Indent);

var AutoIndent = (function (_Indent2) {
  _inherits(AutoIndent, _Indent2);

  function AutoIndent() {
    _classCallCheck(this, AutoIndent);

    _get(Object.getPrototypeOf(AutoIndent.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(AutoIndent, [{
    key: 'indent',
    value: function indent(selection) {
      selection.autoIndentSelectedRows();
    }
  }]);

  return AutoIndent;
})(Indent);

var ToggleLineComments = (function (_TransformString17) {
  _inherits(ToggleLineComments, _TransformString17);

  function ToggleLineComments() {
    _classCallCheck(this, ToggleLineComments);

    _get(Object.getPrototypeOf(ToggleLineComments.prototype), 'constructor', this).apply(this, arguments);

    this.flashTarget = false;
    this.stayByMarker = true;
    this.stayAtSamePosition = true;
    this.wise = 'linewise';
  }

  _createClass(ToggleLineComments, [{
    key: 'mutateSelection',
    value: function mutateSelection(selection) {
      selection.toggleLineComments();
    }
  }]);

  return ToggleLineComments;
})(TransformString);

var Reflow = (function (_TransformString18) {
  _inherits(Reflow, _TransformString18);

  function Reflow() {
    _classCallCheck(this, Reflow);

    _get(Object.getPrototypeOf(Reflow.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(Reflow, [{
    key: 'mutateSelection',
    value: function mutateSelection(selection) {
      atom.commands.dispatch(this.editorElement, 'autoflow:reflow-selection');
    }
  }]);

  return Reflow;
})(TransformString);

var ReflowWithStay = (function (_Reflow) {
  _inherits(ReflowWithStay, _Reflow);

  function ReflowWithStay() {
    _classCallCheck(this, ReflowWithStay);

    _get(Object.getPrototypeOf(ReflowWithStay.prototype), 'constructor', this).apply(this, arguments);

    this.stayAtSamePosition = true;
  }

  // Surround < TransformString
  // -------------------------
  return ReflowWithStay;
})(Reflow);

var SurroundBase = (function (_TransformString19) {
  _inherits(SurroundBase, _TransformString19);

  function SurroundBase() {
    _classCallCheck(this, SurroundBase);

    _get(Object.getPrototypeOf(SurroundBase.prototype), 'constructor', this).apply(this, arguments);

    this.surroundAction = null;
    this.pairsByAlias = {
      '(': ['(', ')'],
      ')': ['(', ')'],
      '{': ['{', '}'],
      '}': ['{', '}'],
      '[': ['[', ']'],
      ']': ['[', ']'],
      '<': ['<', '>'],
      '>': ['<', '>'],
      b: ['(', ')'],
      B: ['{', '}'],
      r: ['[', ']'],
      a: ['<', '>']
    };
  }

  _createClass(SurroundBase, [{
    key: 'initialize',
    value: function initialize() {
      this.replaceByDiff = this.getConfig('replaceByDiffOnSurround');
      this.stayByMarker = this.replaceByDiff;
      _get(Object.getPrototypeOf(SurroundBase.prototype), 'initialize', this).call(this);
    }
  }, {
    key: 'getPair',
    value: function getPair(char) {
      var userConfig = this.getConfig('customSurroundPairs');
      var customPairByAlias = JSON.parse(userConfig) || {};
      return customPairByAlias[char] || this.pairsByAlias[char] || [char, char];
    }
  }, {
    key: 'surround',
    value: function surround(text, char) {
      var _this8 = this;

      var _ref6 = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      var _ref6$keepLayout = _ref6.keepLayout;
      var keepLayout = _ref6$keepLayout === undefined ? false : _ref6$keepLayout;
      var selection = _ref6.selection;

      var _getPair = this.getPair(char);

      var _getPair2 = _slicedToArray(_getPair, 3);

      var open = _getPair2[0];
      var close = _getPair2[1];
      var addSpace = _getPair2[2];

      if (!keepLayout && text.endsWith('\n')) {
        (function () {
          var baseIndentLevel = _this8.editor.indentationForBufferRow(selection.getBufferRange().start.row);
          var indentTextStartRow = _this8.editor.buildIndentString(baseIndentLevel);
          var indentTextOneLevel = _this8.editor.buildIndentString(1);

          open = indentTextStartRow + open + '\n';
          text = text.replace(/^(.+)$/gm, function (m) {
            return indentTextOneLevel + m;
          });
          close = indentTextStartRow + close + '\n';
        })();
      }

      if (this.utils.isSingleLineText(text)) {
        if (addSpace || this.getConfig('charactersToAddSpaceOnSurround').includes(char)) {
          text = ' ' + text + ' ';
        }
      }
      return open + text + close;
    }
  }, {
    key: 'getTargetPair',
    value: function getTargetPair() {
      if (this.target) {
        return this.target.pair;
      }
    }
  }, {
    key: 'deleteSurround',
    value: function deleteSurround(text) {
      var _ref7 = this.getTargetPair() || [text[0], text[text.length - 1]];

      var _ref72 = _slicedToArray(_ref7, 2);

      var open = _ref72[0];
      var close = _ref72[1];

      var innerText = text.slice(open.length, text.length - close.length);
      return this.utils.isSingleLineText(text) && open !== close ? innerText.trim() : innerText;
    }
  }, {
    key: 'getNewText',
    value: function getNewText(text, selection) {
      if (this.surroundAction === 'surround') {
        return this.surround(text, this.input, { selection: selection });
      } else if (this.surroundAction === 'delete-surround') {
        return this.deleteSurround(text);
      } else if (this.surroundAction === 'change-surround') {
        return this.surround(this.deleteSurround(text), this.input, { keepLayout: true });
      }
    }
  }], [{
    key: 'command',
    value: false,
    enumerable: true
  }]);

  return SurroundBase;
})(TransformString);

var Surround = (function (_SurroundBase) {
  _inherits(Surround, _SurroundBase);

  function Surround() {
    _classCallCheck(this, Surround);

    _get(Object.getPrototypeOf(Surround.prototype), 'constructor', this).apply(this, arguments);

    this.surroundAction = 'surround';
    this.readInputAfterSelect = true;
  }

  return Surround;
})(SurroundBase);

var SurroundWord = (function (_Surround) {
  _inherits(SurroundWord, _Surround);

  function SurroundWord() {
    _classCallCheck(this, SurroundWord);

    _get(Object.getPrototypeOf(SurroundWord.prototype), 'constructor', this).apply(this, arguments);

    this.target = 'InnerWord';
  }

  return SurroundWord;
})(Surround);

var SurroundSmartWord = (function (_Surround2) {
  _inherits(SurroundSmartWord, _Surround2);

  function SurroundSmartWord() {
    _classCallCheck(this, SurroundSmartWord);

    _get(Object.getPrototypeOf(SurroundSmartWord.prototype), 'constructor', this).apply(this, arguments);

    this.target = 'InnerSmartWord';
  }

  return SurroundSmartWord;
})(Surround);

var MapSurround = (function (_Surround3) {
  _inherits(MapSurround, _Surround3);

  function MapSurround() {
    _classCallCheck(this, MapSurround);

    _get(Object.getPrototypeOf(MapSurround.prototype), 'constructor', this).apply(this, arguments);

    this.occurrence = true;
    this.patternForOccurrence = /\w+/g;
  }

  // Delete Surround
  // -------------------------
  return MapSurround;
})(Surround);

var DeleteSurround = (function (_SurroundBase2) {
  _inherits(DeleteSurround, _SurroundBase2);

  function DeleteSurround() {
    _classCallCheck(this, DeleteSurround);

    _get(Object.getPrototypeOf(DeleteSurround.prototype), 'constructor', this).apply(this, arguments);

    this.surroundAction = 'delete-surround';
  }

  _createClass(DeleteSurround, [{
    key: 'initialize',
    value: function initialize() {
      var _this9 = this;

      if (!this.target) {
        this.focusInput({
          onConfirm: function onConfirm(char) {
            _this9.setTarget(_this9.getInstance('APair', { pair: _this9.getPair(char) }));
            _this9.processOperation();
          }
        });
      }
      _get(Object.getPrototypeOf(DeleteSurround.prototype), 'initialize', this).call(this);
    }
  }]);

  return DeleteSurround;
})(SurroundBase);

var DeleteSurroundAnyPair = (function (_DeleteSurround) {
  _inherits(DeleteSurroundAnyPair, _DeleteSurround);

  function DeleteSurroundAnyPair() {
    _classCallCheck(this, DeleteSurroundAnyPair);

    _get(Object.getPrototypeOf(DeleteSurroundAnyPair.prototype), 'constructor', this).apply(this, arguments);

    this.target = 'AAnyPair';
  }

  return DeleteSurroundAnyPair;
})(DeleteSurround);

var DeleteSurroundAnyPairAllowForwarding = (function (_DeleteSurroundAnyPair) {
  _inherits(DeleteSurroundAnyPairAllowForwarding, _DeleteSurroundAnyPair);

  function DeleteSurroundAnyPairAllowForwarding() {
    _classCallCheck(this, DeleteSurroundAnyPairAllowForwarding);

    _get(Object.getPrototypeOf(DeleteSurroundAnyPairAllowForwarding.prototype), 'constructor', this).apply(this, arguments);

    this.target = 'AAnyPairAllowForwarding';
  }

  // Change Surround
  // -------------------------
  return DeleteSurroundAnyPairAllowForwarding;
})(DeleteSurroundAnyPair);

var ChangeSurround = (function (_DeleteSurround2) {
  _inherits(ChangeSurround, _DeleteSurround2);

  function ChangeSurround() {
    _classCallCheck(this, ChangeSurround);

    _get(Object.getPrototypeOf(ChangeSurround.prototype), 'constructor', this).apply(this, arguments);

    this.surroundAction = 'change-surround';
    this.readInputAfterSelect = true;
  }

  _createClass(ChangeSurround, [{
    key: 'focusInputPromised',

    // Override to show changing char on hover
    value: _asyncToGenerator(function* () {
      var hoverPoint = this.mutationManager.getInitialPointForSelection(this.editor.getLastSelection());
      var openSurrondText = this.getTargetPair() ? this.getTargetPair()[0] : this.editor.getSelectedText()[0];
      this.vimState.hover.set(openSurrondText, hoverPoint);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _get(Object.getPrototypeOf(ChangeSurround.prototype), 'focusInputPromised', this).apply(this, args);
    })
  }]);

  return ChangeSurround;
})(DeleteSurround);

var ChangeSurroundAnyPair = (function (_ChangeSurround) {
  _inherits(ChangeSurroundAnyPair, _ChangeSurround);

  function ChangeSurroundAnyPair() {
    _classCallCheck(this, ChangeSurroundAnyPair);

    _get(Object.getPrototypeOf(ChangeSurroundAnyPair.prototype), 'constructor', this).apply(this, arguments);

    this.target = 'AAnyPair';
  }

  return ChangeSurroundAnyPair;
})(ChangeSurround);

var ChangeSurroundAnyPairAllowForwarding = (function (_ChangeSurroundAnyPair) {
  _inherits(ChangeSurroundAnyPairAllowForwarding, _ChangeSurroundAnyPair);

  function ChangeSurroundAnyPairAllowForwarding() {
    _classCallCheck(this, ChangeSurroundAnyPairAllowForwarding);

    _get(Object.getPrototypeOf(ChangeSurroundAnyPairAllowForwarding.prototype), 'constructor', this).apply(this, arguments);

    this.target = 'AAnyPairAllowForwarding';
  }

  // -------------------------
  // FIXME
  // Currently native editor.joinLines() is better for cursor position setting
  // So I use native methods for a meanwhile.
  return ChangeSurroundAnyPairAllowForwarding;
})(ChangeSurroundAnyPair);

var JoinTarget = (function (_TransformString20) {
  _inherits(JoinTarget, _TransformString20);

  function JoinTarget() {
    _classCallCheck(this, JoinTarget);

    _get(Object.getPrototypeOf(JoinTarget.prototype), 'constructor', this).apply(this, arguments);

    this.flashTarget = false;
    this.restorePositions = false;
  }

  _createClass(JoinTarget, [{
    key: 'mutateSelection',
    value: function mutateSelection(selection) {
      var range = selection.getBufferRange();

      // When cursor is at last BUFFER row, it select last-buffer-row, then
      // joinning result in "clear last-buffer-row text".
      // I believe this is BUG of upstream atom-core. guard this situation here
      if (!range.isSingleLine() || range.end.row !== this.editor.getLastBufferRow()) {
        if (this.utils.isLinewiseRange(range)) {
          selection.setBufferRange(range.translate([0, 0], [-1, Infinity]));
        }
        selection.joinLines();
      }
      var point = selection.getBufferRange().end.translate([0, -1]);
      return selection.cursor.setBufferPosition(point);
    }
  }]);

  return JoinTarget;
})(TransformString);

var Join = (function (_JoinTarget) {
  _inherits(Join, _JoinTarget);

  function Join() {
    _classCallCheck(this, Join);

    _get(Object.getPrototypeOf(Join.prototype), 'constructor', this).apply(this, arguments);

    this.target = 'MoveToRelativeLine';
  }

  return Join;
})(JoinTarget);

var JoinBase = (function (_TransformString21) {
  _inherits(JoinBase, _TransformString21);

  function JoinBase() {
    _classCallCheck(this, JoinBase);

    _get(Object.getPrototypeOf(JoinBase.prototype), 'constructor', this).apply(this, arguments);

    this.wise = 'linewise';
    this.trim = false;
    this.target = 'MoveToRelativeLineMinimumTwo';
  }

  _createClass(JoinBase, [{
    key: 'getNewText',
    value: function getNewText(text) {
      var regex = this.trim ? /\r?\n[ \t]*/g : /\r?\n/g;
      return text.trimRight().replace(regex, this.input) + '\n';
    }
  }], [{
    key: 'command',
    value: false,
    enumerable: true
  }]);

  return JoinBase;
})(TransformString);

var JoinWithKeepingSpace = (function (_JoinBase) {
  _inherits(JoinWithKeepingSpace, _JoinBase);

  function JoinWithKeepingSpace() {
    _classCallCheck(this, JoinWithKeepingSpace);

    _get(Object.getPrototypeOf(JoinWithKeepingSpace.prototype), 'constructor', this).apply(this, arguments);

    this.input = '';
  }

  return JoinWithKeepingSpace;
})(JoinBase);

var JoinByInput = (function (_JoinBase2) {
  _inherits(JoinByInput, _JoinBase2);

  function JoinByInput() {
    _classCallCheck(this, JoinByInput);

    _get(Object.getPrototypeOf(JoinByInput.prototype), 'constructor', this).apply(this, arguments);

    this.readInputAfterSelect = true;
    this.focusInputOptions = { charsMax: 10 };
    this.trim = true;
  }

  return JoinByInput;
})(JoinBase);

var JoinByInputWithKeepingSpace = (function (_JoinByInput) {
  _inherits(JoinByInputWithKeepingSpace, _JoinByInput);

  function JoinByInputWithKeepingSpace() {
    _classCallCheck(this, JoinByInputWithKeepingSpace);

    _get(Object.getPrototypeOf(JoinByInputWithKeepingSpace.prototype), 'constructor', this).apply(this, arguments);

    this.trim = false;
  }

  // -------------------------
  // String suffix in name is to avoid confusion with 'split' window.
  return JoinByInputWithKeepingSpace;
})(JoinByInput);

var SplitString = (function (_TransformString22) {
  _inherits(SplitString, _TransformString22);

  function SplitString() {
    _classCallCheck(this, SplitString);

    _get(Object.getPrototypeOf(SplitString.prototype), 'constructor', this).apply(this, arguments);

    this.target = 'MoveToRelativeLine';
    this.keepSplitter = false;
    this.readInputAfterSelect = true;
    this.focusInputOptions = { charsMax: 10 };
  }

  _createClass(SplitString, [{
    key: 'getNewText',
    value: function getNewText(text) {
      var regex = new RegExp(this._.escapeRegExp(this.input || '\\n'), 'g');
      var lineSeparator = (this.keepSplitter ? this.input : '') + '\n';
      return text.replace(regex, lineSeparator);
    }
  }]);

  return SplitString;
})(TransformString);

var SplitStringWithKeepingSplitter = (function (_SplitString) {
  _inherits(SplitStringWithKeepingSplitter, _SplitString);

  function SplitStringWithKeepingSplitter() {
    _classCallCheck(this, SplitStringWithKeepingSplitter);

    _get(Object.getPrototypeOf(SplitStringWithKeepingSplitter.prototype), 'constructor', this).apply(this, arguments);

    this.keepSplitter = true;
  }

  return SplitStringWithKeepingSplitter;
})(SplitString);

var SplitArguments = (function (_TransformString23) {
  _inherits(SplitArguments, _TransformString23);

  function SplitArguments() {
    _classCallCheck(this, SplitArguments);

    _get(Object.getPrototypeOf(SplitArguments.prototype), 'constructor', this).apply(this, arguments);

    this.keepSeparator = true;
  }

  _createClass(SplitArguments, [{
    key: 'getNewText',
    value: function getNewText(text, selection) {
      var allTokens = this.utils.splitArguments(text.trim());
      var newText = '';

      var baseIndentLevel = this.editor.indentationForBufferRow(selection.getBufferRange().start.row);
      var indentTextStartRow = this.editor.buildIndentString(baseIndentLevel);
      var indentTextInnerRows = this.editor.buildIndentString(baseIndentLevel + 1);

      while (allTokens.length) {
        var _allTokens$shift = allTokens.shift();

        var _text = _allTokens$shift.text;
        var type = _allTokens$shift.type;

        newText += type === 'separator' ? (this.keepSeparator ? _text.trim() : '') + '\n' : indentTextInnerRows + _text;
      }
      return '\n' + newText + '\n' + indentTextStartRow;
    }
  }]);

  return SplitArguments;
})(TransformString);

var SplitArgumentsWithRemoveSeparator = (function (_SplitArguments) {
  _inherits(SplitArgumentsWithRemoveSeparator, _SplitArguments);

  function SplitArgumentsWithRemoveSeparator() {
    _classCallCheck(this, SplitArgumentsWithRemoveSeparator);

    _get(Object.getPrototypeOf(SplitArgumentsWithRemoveSeparator.prototype), 'constructor', this).apply(this, arguments);

    this.keepSeparator = false;
  }

  return SplitArgumentsWithRemoveSeparator;
})(SplitArguments);

var SplitArgumentsOfInnerAnyPair = (function (_SplitArguments2) {
  _inherits(SplitArgumentsOfInnerAnyPair, _SplitArguments2);

  function SplitArgumentsOfInnerAnyPair() {
    _classCallCheck(this, SplitArgumentsOfInnerAnyPair);

    _get(Object.getPrototypeOf(SplitArgumentsOfInnerAnyPair.prototype), 'constructor', this).apply(this, arguments);

    this.target = 'InnerAnyPair';
  }

  return SplitArgumentsOfInnerAnyPair;
})(SplitArguments);

var ChangeOrder = (function (_TransformString24) {
  _inherits(ChangeOrder, _TransformString24);

  function ChangeOrder() {
    _classCallCheck(this, ChangeOrder);

    _get(Object.getPrototypeOf(ChangeOrder.prototype), 'constructor', this).apply(this, arguments);

    this.action = null;
    this.sortBy = null;
  }

  _createClass(ChangeOrder, [{
    key: 'getNewText',
    value: function getNewText(text) {
      var _this10 = this;

      return this.target.isLinewise() ? this.getNewList(this.utils.splitTextByNewLine(text)).join('\n') + '\n' : this.sortArgumentsInTextBy(text, function (args) {
        return _this10.getNewList(args);
      });
    }
  }, {
    key: 'getNewList',
    value: function getNewList(rows) {
      if (rows.length === 1) {
        return [this.utils.changeCharOrder(rows[0], this.action, this.sortBy)];
      } else {
        return this.utils.changeArrayOrder(rows, this.action, this.sortBy);
      }
    }
  }, {
    key: 'sortArgumentsInTextBy',
    value: function sortArgumentsInTextBy(text, fn) {
      var start = text.search(/\S/);
      var end = text.search(/\s*$/);
      var leadingSpaces = start !== -1 ? text.slice(0, start) : '';
      var trailingSpaces = end !== -1 ? text.slice(end) : '';
      var allTokens = this.utils.splitArguments(text.slice(start, end));
      var args = allTokens.filter(function (token) {
        return token.type === 'argument';
      }).map(function (token) {
        return token.text;
      });
      var newArgs = fn(args);

      var newText = '';
      while (allTokens.length) {
        var token = allTokens.shift();
        // token.type is "separator" or "argument"
        newText += token.type === 'separator' ? token.text : newArgs.shift();
      }
      return leadingSpaces + newText + trailingSpaces;
    }
  }], [{
    key: 'command',
    value: false,
    enumerable: true
  }]);

  return ChangeOrder;
})(TransformString);

var Reverse = (function (_ChangeOrder) {
  _inherits(Reverse, _ChangeOrder);

  function Reverse() {
    _classCallCheck(this, Reverse);

    _get(Object.getPrototypeOf(Reverse.prototype), 'constructor', this).apply(this, arguments);

    this.action = 'reverse';
  }

  return Reverse;
})(ChangeOrder);

var ReverseInnerAnyPair = (function (_Reverse) {
  _inherits(ReverseInnerAnyPair, _Reverse);

  function ReverseInnerAnyPair() {
    _classCallCheck(this, ReverseInnerAnyPair);

    _get(Object.getPrototypeOf(ReverseInnerAnyPair.prototype), 'constructor', this).apply(this, arguments);

    this.target = 'InnerAnyPair';
  }

  return ReverseInnerAnyPair;
})(Reverse);

var Rotate = (function (_ChangeOrder2) {
  _inherits(Rotate, _ChangeOrder2);

  function Rotate() {
    _classCallCheck(this, Rotate);

    _get(Object.getPrototypeOf(Rotate.prototype), 'constructor', this).apply(this, arguments);

    this.action = 'rotate-left';
  }

  return Rotate;
})(ChangeOrder);

var RotateBackwards = (function (_ChangeOrder3) {
  _inherits(RotateBackwards, _ChangeOrder3);

  function RotateBackwards() {
    _classCallCheck(this, RotateBackwards);

    _get(Object.getPrototypeOf(RotateBackwards.prototype), 'constructor', this).apply(this, arguments);

    this.action = 'rotate-right';
  }

  return RotateBackwards;
})(ChangeOrder);

var RotateArgumentsOfInnerPair = (function (_Rotate) {
  _inherits(RotateArgumentsOfInnerPair, _Rotate);

  function RotateArgumentsOfInnerPair() {
    _classCallCheck(this, RotateArgumentsOfInnerPair);

    _get(Object.getPrototypeOf(RotateArgumentsOfInnerPair.prototype), 'constructor', this).apply(this, arguments);

    this.target = 'InnerAnyPair';
  }

  return RotateArgumentsOfInnerPair;
})(Rotate);

var RotateArgumentsBackwardsOfInnerPair = (function (_RotateBackwards) {
  _inherits(RotateArgumentsBackwardsOfInnerPair, _RotateBackwards);

  function RotateArgumentsBackwardsOfInnerPair() {
    _classCallCheck(this, RotateArgumentsBackwardsOfInnerPair);

    _get(Object.getPrototypeOf(RotateArgumentsBackwardsOfInnerPair.prototype), 'constructor', this).apply(this, arguments);

    this.target = 'InnerAnyPair';
  }

  return RotateArgumentsBackwardsOfInnerPair;
})(RotateBackwards);

var Sort = (function (_ChangeOrder4) {
  _inherits(Sort, _ChangeOrder4);

  function Sort() {
    _classCallCheck(this, Sort);

    _get(Object.getPrototypeOf(Sort.prototype), 'constructor', this).apply(this, arguments);

    this.action = 'sort';
  }

  return Sort;
})(ChangeOrder);

var SortCaseInsensitively = (function (_Sort) {
  _inherits(SortCaseInsensitively, _Sort);

  function SortCaseInsensitively() {
    _classCallCheck(this, SortCaseInsensitively);

    _get(Object.getPrototypeOf(SortCaseInsensitively.prototype), 'constructor', this).apply(this, arguments);

    this.sortBy = function (rowA, rowB) {
      return rowA.localeCompare(rowB, { sensitivity: 'base' });
    };
  }

  return SortCaseInsensitively;
})(Sort);

var SortByNumber = (function (_Sort2) {
  _inherits(SortByNumber, _Sort2);

  function SortByNumber() {
    _classCallCheck(this, SortByNumber);

    _get(Object.getPrototypeOf(SortByNumber.prototype), 'constructor', this).apply(this, arguments);

    this.sortBy = function (rowA, rowB) {
      return (Number.parseInt(rowA) || Infinity) - (Number.parseInt(rowB) || Infinity);
    };
  }

  return SortByNumber;
})(Sort);

var Randomize = (function (_ChangeOrder5) {
  _inherits(Randomize, _ChangeOrder5);

  function Randomize() {
    _classCallCheck(this, Randomize);

    _get(Object.getPrototypeOf(Randomize.prototype), 'constructor', this).apply(this, arguments);

    this.action = 'ramdomize';
  }

  return Randomize;
})(ChangeOrder);

var NumberingLines = (function (_TransformString25) {
  _inherits(NumberingLines, _TransformString25);

  function NumberingLines() {
    _classCallCheck(this, NumberingLines);

    _get(Object.getPrototypeOf(NumberingLines.prototype), 'constructor', this).apply(this, arguments);

    this.wise = 'linewise';
  }

  _createClass(NumberingLines, [{
    key: 'getNewText',
    value: function getNewText(text) {
      var _this11 = this;

      var rows = this.utils.splitTextByNewLine(text);
      var lastRowWidth = String(rows.length).length;

      var newRows = rows.map(function (rowText, i) {
        i++; // fix 0 start index to 1 start.
        var amountOfPadding = _this11.limitNumber(lastRowWidth - String(i).length, { min: 0 });
        return ' '.repeat(amountOfPadding) + i + ': ' + rowText;
      });
      return newRows.join('\n') + '\n';
    }
  }]);

  return NumberingLines;
})(TransformString);

var DuplicateWithCommentOutOriginal = (function (_TransformString26) {
  _inherits(DuplicateWithCommentOutOriginal, _TransformString26);

  function DuplicateWithCommentOutOriginal() {
    _classCallCheck(this, DuplicateWithCommentOutOriginal);

    _get(Object.getPrototypeOf(DuplicateWithCommentOutOriginal.prototype), 'constructor', this).apply(this, arguments);

    this.wise = 'linewise';
    this.stayByMarker = true;
    this.stayAtSamePosition = true;
  }

  _createClass(DuplicateWithCommentOutOriginal, [{
    key: 'mutateSelection',
    value: function mutateSelection(selection) {
      var _selection$getBufferRowRange = selection.getBufferRowRange();

      var _selection$getBufferRowRange2 = _slicedToArray(_selection$getBufferRowRange, 2);

      var startRow = _selection$getBufferRowRange2[0];
      var endRow = _selection$getBufferRowRange2[1];

      selection.setBufferRange(this.utils.insertTextAtBufferPosition(this.editor, [startRow, 0], selection.getText()));
      this.editor.toggleLineCommentsForBufferRows(startRow, endRow);
    }
  }]);

  return DuplicateWithCommentOutOriginal;
})(TransformString);

module.exports = {
  TransformString: TransformString,

  NoCase: NoCase,
  DotCase: DotCase,
  SwapCase: SwapCase,
  PathCase: PathCase,
  UpperCase: UpperCase,
  LowerCase: LowerCase,
  CamelCase: CamelCase,
  SnakeCase: SnakeCase,
  TitleCase: TitleCase,
  ParamCase: ParamCase,
  HeaderCase: HeaderCase,
  PascalCase: PascalCase,
  ConstantCase: ConstantCase,
  SentenceCase: SentenceCase,
  UpperCaseFirst: UpperCaseFirst,
  LowerCaseFirst: LowerCaseFirst,
  DashCase: DashCase,
  ToggleCase: ToggleCase,
  ToggleCaseAndMoveRight: ToggleCaseAndMoveRight,

  Replace: Replace,
  ReplaceCharacter: ReplaceCharacter,
  SplitByCharacter: SplitByCharacter,
  EncodeUriComponent: EncodeUriComponent,
  DecodeUriComponent: DecodeUriComponent,
  TrimString: TrimString,
  CompactSpaces: CompactSpaces,
  AlignOccurrence: AlignOccurrence,
  AlignOccurrenceByPadLeft: AlignOccurrenceByPadLeft,
  AlignOccurrenceByPadRight: AlignOccurrenceByPadRight,
  RemoveLeadingWhiteSpaces: RemoveLeadingWhiteSpaces,
  ConvertToSoftTab: ConvertToSoftTab,
  ConvertToHardTab: ConvertToHardTab,
  TransformStringByExternalCommand: TransformStringByExternalCommand,
  TransformStringBySelectList: TransformStringBySelectList,
  TransformWordBySelectList: TransformWordBySelectList,
  TransformSmartWordBySelectList: TransformSmartWordBySelectList,
  ReplaceWithRegister: ReplaceWithRegister,
  ReplaceOccurrenceWithRegister: ReplaceOccurrenceWithRegister,
  SwapWithRegister: SwapWithRegister,
  Indent: Indent,
  Outdent: Outdent,
  AutoIndent: AutoIndent,
  ToggleLineComments: ToggleLineComments,
  Reflow: Reflow,
  ReflowWithStay: ReflowWithStay,
  SurroundBase: SurroundBase,
  Surround: Surround,
  SurroundWord: SurroundWord,
  SurroundSmartWord: SurroundSmartWord,
  MapSurround: MapSurround,
  DeleteSurround: DeleteSurround,
  DeleteSurroundAnyPair: DeleteSurroundAnyPair,
  DeleteSurroundAnyPairAllowForwarding: DeleteSurroundAnyPairAllowForwarding,
  ChangeSurround: ChangeSurround,
  ChangeSurroundAnyPair: ChangeSurroundAnyPair,
  ChangeSurroundAnyPairAllowForwarding: ChangeSurroundAnyPairAllowForwarding,
  JoinTarget: JoinTarget,
  Join: Join,
  JoinBase: JoinBase,
  JoinWithKeepingSpace: JoinWithKeepingSpace,
  JoinByInput: JoinByInput,
  JoinByInputWithKeepingSpace: JoinByInputWithKeepingSpace,
  SplitString: SplitString,
  SplitStringWithKeepingSplitter: SplitStringWithKeepingSplitter,
  SplitArguments: SplitArguments,
  SplitArgumentsWithRemoveSeparator: SplitArgumentsWithRemoveSeparator,
  SplitArgumentsOfInnerAnyPair: SplitArgumentsOfInnerAnyPair,
  ChangeOrder: ChangeOrder,
  Reverse: Reverse,
  ReverseInnerAnyPair: ReverseInnerAnyPair,
  Rotate: Rotate,
  RotateBackwards: RotateBackwards,
  RotateArgumentsOfInnerPair: RotateArgumentsOfInnerPair,
  RotateArgumentsBackwardsOfInnerPair: RotateArgumentsBackwardsOfInnerPair,
  Sort: Sort,
  SortCaseInsensitively: SortCaseInsensitively,
  SortByNumber: SortByNumber,
  Randomize: Randomize,
  NumberingLines: NumberingLines,
  DuplicateWithCommentOutOriginal: DuplicateWithCommentOutOriginal
};
for (var klass of Object.values(module.exports)) {
  if (klass.isCommand()) klass.registerToSelectList();
}
// e.g. command: 'sort'
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9naXQvLmF0b20vcGFja2FnZXMvdmltLW1vZGUtcGx1cy9saWIvb3BlcmF0b3ItdHJhbnNmb3JtLXN0cmluZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLENBQUE7Ozs7Ozs7Ozs7Ozs7O0FBRVgsSUFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFBO0FBQ3pDLElBQUksVUFBVSxZQUFBLENBQUE7O2VBRVksT0FBTyxDQUFDLE1BQU0sQ0FBQzs7SUFBbEMsZUFBZSxZQUFmLGVBQWU7O2dCQUNILE9BQU8sQ0FBQyxZQUFZLENBQUM7O0lBQWpDLFFBQVEsYUFBUixRQUFROzs7OztJQUlULGVBQWU7WUFBZixlQUFlOztXQUFmLGVBQWU7MEJBQWYsZUFBZTs7K0JBQWYsZUFBZTs7U0FHbkIsV0FBVyxHQUFHLElBQUk7U0FDbEIsY0FBYyxHQUFHLHVCQUF1QjtTQUN4QyxVQUFVLEdBQUcsS0FBSztTQUNsQixpQkFBaUIsR0FBRyxLQUFLO1NBQ3pCLGFBQWEsR0FBRyxLQUFLOzs7ZUFQakIsZUFBZTs7V0FhSCx5QkFBQyxTQUFTLEVBQUU7QUFDMUIsVUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLEVBQUUsU0FBUyxDQUFDLENBQUE7QUFDNUQsVUFBSSxJQUFJLEVBQUU7QUFDUixZQUFJLElBQUksQ0FBQyxhQUFhLEVBQUU7QUFDdEIsY0FBSSxDQUFDLHlCQUF5QixDQUFDLFNBQVMsQ0FBQyxjQUFjLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQTtTQUNqRSxNQUFNO0FBQ0wsbUJBQVMsQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLEVBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxVQUFVLEVBQUUsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixFQUFDLENBQUMsQ0FBQTtTQUNyRztPQUNGO0tBQ0Y7OztXQWIyQixnQ0FBRztBQUM3QixVQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO0tBQ25DOzs7V0FWZ0IsS0FBSzs7OztXQUNNLEVBQUU7Ozs7U0FGMUIsZUFBZTtHQUFTLFFBQVE7O0lBeUJoQyxVQUFVO1lBQVYsVUFBVTs7V0FBVixVQUFVOzBCQUFWLFVBQVU7OytCQUFWLFVBQVU7OztlQUFWLFVBQVU7O1dBRUgsb0JBQUMsSUFBSSxFQUFFO0FBQ2hCLFVBQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxZQUFZLElBQUksVUFBVSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7OztBQUc5RSxVQUFNLE9BQU8sR0FBRyxhQUFpQyxDQUFBO0FBQ2pELFVBQU0sS0FBSyxHQUFHLElBQUksTUFBTSxDQUFJLE9BQU8sa0JBQWEsT0FBTyxVQUFPLEdBQUcsQ0FBQyxDQUFBO0FBQ2xFLGFBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsVUFBQSxLQUFLO2VBQUksVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDLEtBQUssQ0FBQztPQUFBLENBQUMsQ0FBQTtLQUNyRTs7O1dBUmdCLEtBQUs7Ozs7U0FEbEIsVUFBVTtHQUFTLGVBQWU7O0lBWWxDLE1BQU07WUFBTixNQUFNOztXQUFOLE1BQU07MEJBQU4sTUFBTTs7K0JBQU4sTUFBTTs7O1NBQU4sTUFBTTtHQUFTLFVBQVU7O0lBQ3pCLE9BQU87WUFBUCxPQUFPOztXQUFQLE9BQU87MEJBQVAsT0FBTzs7K0JBQVAsT0FBTzs7O2VBQVAsT0FBTzs7V0FDZ0IsR0FBRzs7OztTQUQxQixPQUFPO0dBQVMsVUFBVTs7SUFHMUIsUUFBUTtZQUFSLFFBQVE7O1dBQVIsUUFBUTswQkFBUixRQUFROzsrQkFBUixRQUFROzs7ZUFBUixRQUFROztXQUNlLEdBQUc7Ozs7U0FEMUIsUUFBUTtHQUFTLFVBQVU7O0lBRzNCLFFBQVE7WUFBUixRQUFROztXQUFSLFFBQVE7MEJBQVIsUUFBUTs7K0JBQVIsUUFBUTs7O2VBQVIsUUFBUTs7V0FDZSxHQUFHOzs7O1NBRDFCLFFBQVE7R0FBUyxVQUFVOztJQUczQixTQUFTO1lBQVQsU0FBUzs7V0FBVCxTQUFTOzBCQUFULFNBQVM7OytCQUFULFNBQVM7OztTQUFULFNBQVM7R0FBUyxVQUFVOztJQUM1QixTQUFTO1lBQVQsU0FBUzs7V0FBVCxTQUFTOzBCQUFULFNBQVM7OytCQUFULFNBQVM7OztTQUFULFNBQVM7R0FBUyxVQUFVOztJQUM1QixTQUFTO1lBQVQsU0FBUzs7V0FBVCxTQUFTOzBCQUFULFNBQVM7OytCQUFULFNBQVM7OztTQUFULFNBQVM7R0FBUyxVQUFVOztJQUM1QixTQUFTO1lBQVQsU0FBUzs7V0FBVCxTQUFTOzBCQUFULFNBQVM7OytCQUFULFNBQVM7OztlQUFULFNBQVM7O1dBQ2MsR0FBRzs7OztTQUQxQixTQUFTO0dBQVMsVUFBVTs7SUFHNUIsU0FBUztZQUFULFNBQVM7O1dBQVQsU0FBUzswQkFBVCxTQUFTOzsrQkFBVCxTQUFTOzs7U0FBVCxTQUFTO0dBQVMsVUFBVTs7SUFDNUIsU0FBUztZQUFULFNBQVM7O1dBQVQsU0FBUzswQkFBVCxTQUFTOzsrQkFBVCxTQUFTOzs7ZUFBVCxTQUFTOztXQUNjLEdBQUc7Ozs7U0FEMUIsU0FBUztHQUFTLFVBQVU7O0lBRzVCLFVBQVU7WUFBVixVQUFVOztXQUFWLFVBQVU7MEJBQVYsVUFBVTs7K0JBQVYsVUFBVTs7O1NBQVYsVUFBVTtHQUFTLFVBQVU7O0lBQzdCLFVBQVU7WUFBVixVQUFVOztXQUFWLFVBQVU7MEJBQVYsVUFBVTs7K0JBQVYsVUFBVTs7O1NBQVYsVUFBVTtHQUFTLFVBQVU7O0lBQzdCLFlBQVk7WUFBWixZQUFZOztXQUFaLFlBQVk7MEJBQVosWUFBWTs7K0JBQVosWUFBWTs7O1NBQVosWUFBWTtHQUFTLFVBQVU7O0lBQy9CLFlBQVk7WUFBWixZQUFZOztXQUFaLFlBQVk7MEJBQVosWUFBWTs7K0JBQVosWUFBWTs7O1NBQVosWUFBWTtHQUFTLFVBQVU7O0lBQy9CLGNBQWM7WUFBZCxjQUFjOztXQUFkLGNBQWM7MEJBQWQsY0FBYzs7K0JBQWQsY0FBYzs7O1NBQWQsY0FBYztHQUFTLFVBQVU7O0lBQ2pDLGNBQWM7WUFBZCxjQUFjOztXQUFkLGNBQWM7MEJBQWQsY0FBYzs7K0JBQWQsY0FBYzs7O1NBQWQsY0FBYztHQUFTLFVBQVU7O0lBRWpDLFFBQVE7WUFBUixRQUFROztXQUFSLFFBQVE7MEJBQVIsUUFBUTs7K0JBQVIsUUFBUTs7U0FFWixZQUFZLEdBQUcsV0FBVzs7O2VBRnRCLFFBQVE7O1dBQ2UsR0FBRzs7OztTQUQxQixRQUFRO0dBQVMsVUFBVTs7SUFJM0IsVUFBVTtZQUFWLFVBQVU7O1dBQVYsVUFBVTswQkFBVixVQUFVOzsrQkFBVixVQUFVOztTQUVkLFlBQVksR0FBRyxVQUFVOzs7ZUFGckIsVUFBVTs7V0FDYSxHQUFHOzs7O1NBRDFCLFVBQVU7R0FBUyxVQUFVOztJQUs3QixzQkFBc0I7WUFBdEIsc0JBQXNCOztXQUF0QixzQkFBc0I7MEJBQXRCLHNCQUFzQjs7K0JBQXRCLHNCQUFzQjs7U0FDMUIsWUFBWSxHQUFHLFVBQVU7U0FDekIsV0FBVyxHQUFHLEtBQUs7U0FDbkIsZ0JBQWdCLEdBQUcsS0FBSztTQUN4QixNQUFNLEdBQUcsV0FBVzs7Ozs7U0FKaEIsc0JBQXNCO0dBQVMsVUFBVTs7SUFTekMsT0FBTztZQUFQLE9BQU87O1dBQVAsT0FBTzswQkFBUCxPQUFPOzsrQkFBUCxPQUFPOztTQUNYLGVBQWUsR0FBRyx1QkFBdUI7U0FDekMsaUJBQWlCLEdBQUcsSUFBSTtTQUN4QixvQkFBb0IsR0FBRyxJQUFJOzs7ZUFIdkIsT0FBTzs7V0FLQSxvQkFBQyxJQUFJLEVBQUU7QUFDaEIsVUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksS0FBSyx1QkFBdUIsSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLElBQUksQ0FBQyxRQUFRLEVBQUUsRUFBRTtBQUNuRixlQUFNO09BQ1A7O0FBRUQsVUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUE7QUFDaEMsVUFBSSxLQUFLLEtBQUssSUFBSSxFQUFFO0FBQ2xCLFlBQUksQ0FBQyxnQkFBZ0IsR0FBRyxLQUFLLENBQUE7T0FDOUI7QUFDRCxhQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFBO0tBQ2pDOzs7U0FmRyxPQUFPO0dBQVMsZUFBZTs7SUFrQi9CLGdCQUFnQjtZQUFoQixnQkFBZ0I7O1dBQWhCLGdCQUFnQjswQkFBaEIsZ0JBQWdCOzsrQkFBaEIsZ0JBQWdCOztTQUNwQixNQUFNLEdBQUcsdUJBQXVCOzs7OztTQUQ1QixnQkFBZ0I7R0FBUyxPQUFPOztJQU1oQyxnQkFBZ0I7WUFBaEIsZ0JBQWdCOztXQUFoQixnQkFBZ0I7MEJBQWhCLGdCQUFnQjs7K0JBQWhCLGdCQUFnQjs7O2VBQWhCLGdCQUFnQjs7V0FDVCxvQkFBQyxJQUFJLEVBQUU7QUFDaEIsYUFBTyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQTtLQUNoQzs7O1NBSEcsZ0JBQWdCO0dBQVMsZUFBZTs7SUFNeEMsa0JBQWtCO1lBQWxCLGtCQUFrQjs7V0FBbEIsa0JBQWtCOzBCQUFsQixrQkFBa0I7OytCQUFsQixrQkFBa0I7OztlQUFsQixrQkFBa0I7O1dBRVgsb0JBQUMsSUFBSSxFQUFFO0FBQ2hCLGFBQU8sa0JBQWtCLENBQUMsSUFBSSxDQUFDLENBQUE7S0FDaEM7OztXQUgwQixHQUFHOzs7O1NBRDFCLGtCQUFrQjtHQUFTLGVBQWU7O0lBTzFDLGtCQUFrQjtZQUFsQixrQkFBa0I7O1dBQWxCLGtCQUFrQjswQkFBbEIsa0JBQWtCOzsrQkFBbEIsa0JBQWtCOzs7ZUFBbEIsa0JBQWtCOztXQUVYLG9CQUFDLElBQUksRUFBRTtBQUNoQixhQUFPLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFBO0tBQ2hDOzs7V0FIMEIsSUFBSTs7OztTQUQzQixrQkFBa0I7R0FBUyxlQUFlOztJQU8xQyxVQUFVO1lBQVYsVUFBVTs7V0FBVixVQUFVOzBCQUFWLFVBQVU7OytCQUFWLFVBQVU7O1NBQ2QsWUFBWSxHQUFHLElBQUk7U0FDbkIsYUFBYSxHQUFHLElBQUk7OztlQUZoQixVQUFVOztXQUlILG9CQUFDLElBQUksRUFBRTtBQUNoQixhQUFPLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQTtLQUNuQjs7O1NBTkcsVUFBVTtHQUFTLGVBQWU7O0lBU2xDLGFBQWE7WUFBYixhQUFhOztXQUFiLGFBQWE7MEJBQWIsYUFBYTs7K0JBQWIsYUFBYTs7O2VBQWIsYUFBYTs7V0FDTixvQkFBQyxJQUFJLEVBQUU7QUFDaEIsVUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxFQUFFO0FBQ3hCLGVBQU8sR0FBRyxDQUFBO09BQ1gsTUFBTTs7QUFFTCxZQUFNLEtBQUssR0FBRyxxQkFBcUIsQ0FBQTtBQUNuQyxlQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLFVBQUMsQ0FBQyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFLO0FBQzNELGlCQUFPLE9BQU8sR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxRQUFRLENBQUE7U0FDN0QsQ0FBQyxDQUFBO09BQ0g7S0FDRjs7O1NBWEcsYUFBYTtHQUFTLGVBQWU7O0lBY3JDLGVBQWU7WUFBZixlQUFlOztXQUFmLGVBQWU7MEJBQWYsZUFBZTs7K0JBQWYsZUFBZTs7U0FDbkIsVUFBVSxHQUFHLElBQUk7U0FDakIsVUFBVSxHQUFHLE1BQU07OztlQUZmLGVBQWU7O1dBSUQsNkJBQUc7QUFDbkIsVUFBTSxlQUFlLEdBQUcsRUFBRSxDQUFBO0FBQzFCLFdBQUssSUFBTSxTQUFTLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxvQ0FBb0MsRUFBRSxFQUFFO0FBQzFFLFlBQU0sR0FBRyxHQUFHLFNBQVMsQ0FBQyxjQUFjLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFBO0FBQ2hELFlBQUksRUFBRSxHQUFHLElBQUksZUFBZSxDQUFBLEFBQUMsRUFBRSxlQUFlLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFBO0FBQ3hELHVCQUFlLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFBO09BQ3JDO0FBQ0QsVUFBTSxPQUFPLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQTtBQUM1QyxhQUFPO2VBQU0sT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFBLEdBQUc7aUJBQUksZUFBZSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssRUFBRTtTQUFBLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBQSxDQUFDO2lCQUFJLENBQUM7U0FBQSxDQUFDO09BQUEsQ0FBQTtLQUM3RTs7O1dBRW1CLDZCQUFDLElBQUksRUFBRTtBQUN6QixVQUFJLElBQUksQ0FBQyxVQUFVLEtBQUssTUFBTSxFQUFFLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQTs7QUFFdEQsVUFBSSxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFOztBQUU3QixlQUFPLE9BQU8sQ0FBQTtPQUNmLE1BQU0sSUFBSSxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFOztBQUVqQyxlQUFPLEtBQUssQ0FBQTtPQUNiLE1BQU0sSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFOztBQUUzQixlQUFPLEtBQUssQ0FBQTtPQUNiLE1BQU07QUFDTCxlQUFPLE9BQU8sQ0FBQTtPQUNmO0tBQ0Y7OztXQUVnQiw0QkFBRzs7O0FBQ2xCLFVBQU0seUJBQXlCLEdBQUcsRUFBRSxDQUFBO0FBQ3BDLFVBQU0sa0JBQWtCLEdBQUcsU0FBckIsa0JBQWtCLENBQUcsU0FBUyxFQUFJO0FBQ3RDLFlBQU0sS0FBSyxHQUFHLE1BQUssbUJBQW1CLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUE7QUFDM0QsWUFBTSxLQUFLLEdBQUcsU0FBUyxDQUFDLGNBQWMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFBO0FBQy9DLGVBQU8sS0FBSyxDQUFDLE1BQU0sSUFBSSx5QkFBeUIsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFBLEFBQUMsQ0FBQTtPQUNsRSxDQUFBOztBQUVELFVBQU0sY0FBYyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO0FBQy9DLGFBQU8sSUFBSSxFQUFFO0FBQ1gsWUFBTSxVQUFVLEdBQUcsY0FBYyxFQUFFLENBQUE7QUFDbkMsWUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsT0FBTTtBQUM5QixZQUFNLFNBQVMsR0FBRyxVQUFVLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDLENBQUMsTUFBTSxDQUFDLFVBQUMsR0FBRyxFQUFFLEdBQUc7aUJBQU0sR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRztTQUFDLENBQUMsQ0FBQTtBQUNsRyxhQUFLLElBQU0sU0FBUyxJQUFJLFVBQVUsRUFBRTtBQUNsQyxjQUFNLEdBQUcsR0FBRyxTQUFTLENBQUMsY0FBYyxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQTtBQUNoRCxjQUFNLGVBQWUsR0FBRyxTQUFTLEdBQUcsa0JBQWtCLENBQUMsU0FBUyxDQUFDLENBQUE7QUFDakUsbUNBQXlCLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUEsR0FBSSxlQUFlLENBQUE7QUFDeEYsY0FBSSxDQUFDLDBCQUEwQixDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsZUFBZSxDQUFDLENBQUE7U0FDaEU7T0FDRjtLQUNGOzs7V0FFTyxtQkFBRzs7O0FBQ1QsVUFBSSxDQUFDLDBCQUEwQixHQUFHLElBQUksR0FBRyxFQUFFLENBQUE7QUFDM0MsVUFBSSxDQUFDLGlCQUFpQixDQUFDLFlBQU07QUFDM0IsZUFBSyxnQkFBZ0IsRUFBRSxDQUFBO09BQ3hCLENBQUMsQ0FBQTtBQUNGLGlDQTNERSxlQUFlLHlDQTJERjtLQUNoQjs7O1dBRVUsb0JBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRTtBQUMzQixVQUFNLE9BQU8sR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQTtBQUMxRSxVQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUE7QUFDaEUsYUFBTyxVQUFVLEtBQUssT0FBTyxHQUFHLE9BQU8sR0FBRyxJQUFJLEdBQUcsSUFBSSxHQUFHLE9BQU8sQ0FBQTtLQUNoRTs7O1NBbEVHLGVBQWU7R0FBUyxlQUFlOztJQXFFdkMsd0JBQXdCO1lBQXhCLHdCQUF3Qjs7V0FBeEIsd0JBQXdCOzBCQUF4Qix3QkFBd0I7OytCQUF4Qix3QkFBd0I7O1NBQzVCLFVBQVUsR0FBRyxPQUFPOzs7U0FEaEIsd0JBQXdCO0dBQVMsZUFBZTs7SUFJaEQseUJBQXlCO1lBQXpCLHlCQUF5Qjs7V0FBekIseUJBQXlCOzBCQUF6Qix5QkFBeUI7OytCQUF6Qix5QkFBeUI7O1NBQzdCLFVBQVUsR0FBRyxLQUFLOzs7U0FEZCx5QkFBeUI7R0FBUyxlQUFlOztJQUlqRCx3QkFBd0I7WUFBeEIsd0JBQXdCOztXQUF4Qix3QkFBd0I7MEJBQXhCLHdCQUF3Qjs7K0JBQXhCLHdCQUF3Qjs7U0FDNUIsSUFBSSxHQUFHLFVBQVU7OztlQURiLHdCQUF3Qjs7V0FFakIsb0JBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRTtBQUMzQixVQUFNLFFBQVEsR0FBRyxTQUFYLFFBQVEsQ0FBRyxJQUFJO2VBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtPQUFBLENBQUE7QUFDeEMsYUFDRSxJQUFJLENBQUMsS0FBSyxDQUNQLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUN4QixHQUFHLENBQUMsUUFBUSxDQUFDLENBQ2IsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FDckI7S0FDRjs7O1NBVkcsd0JBQXdCO0dBQVMsZUFBZTs7SUFhaEQsZ0JBQWdCO1lBQWhCLGdCQUFnQjs7V0FBaEIsZ0JBQWdCOzBCQUFoQixnQkFBZ0I7OytCQUFoQixnQkFBZ0I7O1NBRXBCLElBQUksR0FBRyxVQUFVOzs7ZUFGYixnQkFBZ0I7O1dBSUoseUJBQUMsU0FBUyxFQUFFOzs7QUFDMUIsVUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLEVBQUUsS0FBSyxFQUFFLEVBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxjQUFjLEVBQUUsRUFBQyxFQUFFLFVBQUMsSUFBZ0IsRUFBSztZQUFwQixLQUFLLEdBQU4sSUFBZ0IsQ0FBZixLQUFLO1lBQUUsT0FBTyxHQUFmLElBQWdCLENBQVIsT0FBTzs7OztBQUd6RixZQUFNLE1BQU0sR0FBRyxPQUFLLE1BQU0sQ0FBQyx5QkFBeUIsQ0FBQyxLQUFLLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxNQUFNLENBQUE7QUFDOUUsZUFBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQTtPQUM1QixDQUFDLENBQUE7S0FDSDs7O1dBVm9CLFVBQVU7Ozs7U0FEM0IsZ0JBQWdCO0dBQVMsZUFBZTs7SUFjeEMsZ0JBQWdCO1lBQWhCLGdCQUFnQjs7V0FBaEIsZ0JBQWdCOzBCQUFoQixnQkFBZ0I7OytCQUFoQixnQkFBZ0I7Ozs7O2VBQWhCLGdCQUFnQjs7V0FHSix5QkFBQyxTQUFTLEVBQUU7OztBQUMxQixVQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRSxDQUFBO0FBQzVDLFVBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxFQUFFLFNBQVMsRUFBRSxFQUFDLFNBQVMsRUFBRSxTQUFTLENBQUMsY0FBYyxFQUFFLEVBQUMsRUFBRSxVQUFDLEtBQWdCLEVBQUs7WUFBcEIsS0FBSyxHQUFOLEtBQWdCLENBQWYsS0FBSztZQUFFLE9BQU8sR0FBZixLQUFnQixDQUFSLE9BQU87O2dEQUN4RSxPQUFLLE1BQU0sQ0FBQyx5QkFBeUIsQ0FBQyxLQUFLLENBQUM7O1lBQTFELEtBQUsscUNBQUwsS0FBSztZQUFFLEdBQUcscUNBQUgsR0FBRzs7QUFDakIsWUFBSSxXQUFXLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQTtBQUM5QixZQUFNLFNBQVMsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFBOzs7O0FBSTVCLFlBQUksT0FBTyxHQUFHLEVBQUUsQ0FBQTtBQUNoQixlQUFPLElBQUksRUFBRTtBQUNYLGNBQU0sU0FBUyxHQUFHLFdBQVcsR0FBRyxTQUFTLENBQUE7QUFDekMsY0FBTSxXQUFXLEdBQUcsV0FBVyxJQUFJLFNBQVMsS0FBSyxDQUFDLEdBQUcsU0FBUyxHQUFHLFNBQVMsQ0FBQSxBQUFDLENBQUE7QUFDM0UsY0FBSSxXQUFXLEdBQUcsU0FBUyxFQUFFO0FBQzNCLG1CQUFPLElBQUksR0FBRyxDQUFDLE1BQU0sQ0FBQyxTQUFTLEdBQUcsV0FBVyxDQUFDLENBQUE7V0FDL0MsTUFBTTtBQUNMLG1CQUFPLElBQUksSUFBSSxDQUFBO1dBQ2hCO0FBQ0QscUJBQVcsR0FBRyxXQUFXLENBQUE7QUFDekIsY0FBSSxXQUFXLElBQUksU0FBUyxFQUFFO0FBQzVCLGtCQUFLO1dBQ047U0FDRjs7QUFFRCxlQUFPLENBQUMsT0FBTyxDQUFDLENBQUE7T0FDakIsQ0FBQyxDQUFBO0tBQ0g7OztXQTVCb0IsVUFBVTs7OztTQUQzQixnQkFBZ0I7R0FBUyxlQUFlOztJQWlDeEMsZ0NBQWdDO1lBQWhDLGdDQUFnQzs7V0FBaEMsZ0NBQWdDOzBCQUFoQyxnQ0FBZ0M7OytCQUFoQyxnQ0FBZ0M7O1NBRXBDLFVBQVUsR0FBRyxJQUFJO1NBQ2pCLE9BQU8sR0FBRyxFQUFFO1NBQ1osSUFBSSxHQUFHLEVBQUU7Ozs7O2VBSkwsZ0NBQWdDOzs7OztXQU96QixvQkFBQyxJQUFJLEVBQUUsU0FBUyxFQUFFO0FBQzNCLGFBQU8sSUFBSSxJQUFJLFNBQVMsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtLQUNuQzs7O1dBQ1Usb0JBQUMsU0FBUyxFQUFFO0FBQ3JCLGFBQU8sRUFBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBQyxDQUFBO0tBQ2hEOzs7V0FDUSxrQkFBQyxTQUFTLEVBQUU7QUFDbkIsYUFBTyxTQUFTLENBQUMsT0FBTyxFQUFFLENBQUE7S0FDM0I7Ozs2QkFFYSxhQUFHO0FBQ2YsVUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFBOztBQUVoQixVQUFJLElBQUksQ0FBQyxZQUFZLEVBQUUsRUFBRTtBQUN2QixhQUFLLElBQU0sU0FBUyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxFQUFFLEVBQUU7c0JBQzNCLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRTs7Y0FBakQsT0FBTyxTQUFQLE9BQU87Y0FBRSxJQUFJLFNBQUosSUFBSTs7QUFDcEIsY0FBSSxPQUFPLElBQUksSUFBSSxJQUFJLElBQUksSUFBSSxJQUFJLEVBQUUsU0FBUTs7QUFFN0MsY0FBTSxNQUFNLEdBQUcsTUFBTSxJQUFJLENBQUMsa0JBQWtCLENBQUMsRUFBQyxPQUFPLEVBQVAsT0FBTyxFQUFFLElBQUksRUFBSixJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLEVBQUMsQ0FBQyxDQUFBO0FBQzlGLG1CQUFTLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQyxFQUFFLEVBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxVQUFVLEVBQUMsQ0FBQyxDQUFBO1NBQ3hGO0FBQ0QsWUFBSSxDQUFDLGVBQWUsQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLENBQUE7QUFDaEQsWUFBSSxDQUFDLGlDQUFpQyxFQUFFLENBQUE7T0FDekM7QUFDRCxVQUFJLENBQUMsVUFBVSxFQUFFLENBQUE7S0FDbEI7OztXQUVrQiw0QkFBQyxPQUFPLEVBQUU7OztBQUMzQixVQUFJLE1BQU0sR0FBRyxFQUFFLENBQUE7QUFDZixhQUFPLENBQUMsTUFBTSxHQUFHLFVBQUEsSUFBSTtlQUFLLE1BQU0sSUFBSSxJQUFJO09BQUMsQ0FBQTtBQUN6QyxVQUFNLFdBQVcsR0FBRyxJQUFJLE9BQU8sQ0FBQyxVQUFBLE9BQU8sRUFBSTtBQUN6QyxlQUFPLENBQUMsSUFBSSxHQUFHO2lCQUFNLE9BQU8sQ0FBQyxNQUFNLENBQUM7U0FBQSxDQUFBO09BQ3JDLENBQUMsQ0FBQTtVQUNLLEtBQUssR0FBSSxPQUFPLENBQWhCLEtBQUs7O0FBQ1osYUFBTyxPQUFPLENBQUMsS0FBSyxDQUFBO0FBQ3BCLFVBQU0sZUFBZSxHQUFHLElBQUksZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFBO0FBQ3BELHFCQUFlLENBQUMsZ0JBQWdCLENBQUMsVUFBQyxLQUFlLEVBQUs7WUFBbkIsS0FBSyxHQUFOLEtBQWUsQ0FBZCxLQUFLO1lBQUUsTUFBTSxHQUFkLEtBQWUsQ0FBUCxNQUFNOzs7QUFFOUMsWUFBSSxLQUFLLENBQUMsSUFBSSxLQUFLLFFBQVEsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUU7QUFDbkUsaUJBQU8sQ0FBQyxHQUFHLENBQUksT0FBSyxjQUFjLEVBQUUsa0NBQTZCLEtBQUssQ0FBQyxJQUFJLE9BQUksQ0FBQTtBQUMvRSxnQkFBTSxFQUFFLENBQUE7U0FDVDtBQUNELGVBQUssZUFBZSxFQUFFLENBQUE7T0FDdkIsQ0FBQyxDQUFBOztBQUVGLFVBQUksS0FBSyxFQUFFO0FBQ1QsdUJBQWUsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQTtBQUMxQyx1QkFBZSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUE7T0FDcEM7QUFDRCxhQUFPLFdBQVcsQ0FBQTtLQUNuQjs7O1dBeERnQixLQUFLOzs7O1NBRGxCLGdDQUFnQztHQUFTLGVBQWU7O0lBNkR4RCwyQkFBMkI7WUFBM0IsMkJBQTJCOztXQUEzQiwyQkFBMkI7MEJBQTNCLDJCQUEyQjs7K0JBQTNCLDJCQUEyQjs7U0FDL0IsTUFBTSxHQUFHLE9BQU87U0FDaEIsVUFBVSxHQUFHLEtBQUs7OztlQUZkLDJCQUEyQjs7V0FvQm5CLHVCQUFHO0FBQ2IsVUFBSSxDQUFDLFVBQVUsRUFBRTtBQUNmLFlBQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQTtBQUMzQyxrQkFBVSxHQUFHLElBQUksVUFBVSxFQUFFLENBQUE7T0FDOUI7QUFDRCxhQUFPLFVBQVUsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLENBQUE7S0FDekU7Ozs2QkFFYSxhQUFHO0FBQ2YsVUFBTSxJQUFJLEdBQUcsTUFBTSxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUE7QUFDckMsVUFBSSxJQUFJLEVBQUU7QUFDUixZQUFJLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxFQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsVUFBVSxFQUFDLENBQUMsQ0FBQTtPQUM1RTtLQUNGOzs7V0E3QnlCLDhCQUFHOzs7QUFDM0IsVUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUU7QUFDekIsWUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsR0FBRyxDQUFDLFVBQUEsS0FBSyxFQUFJO0FBQzFELGNBQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxjQUFjLENBQUMsbUJBQW1CLENBQUMsR0FBRyxHQUFHLEdBQUcsS0FBSyxDQUFDLGlCQUFpQixHQUFHLEVBQUUsQ0FBQTs7QUFFN0YsaUJBQU87QUFDTCxpQkFBSyxFQUFFLEtBQUs7QUFDWix1QkFBVyxFQUFFLEtBQUssQ0FBQyxjQUFjLENBQUMsYUFBYSxDQUFDLEdBQzVDLEtBQUssQ0FBQyxXQUFXLEdBQUcsTUFBTSxHQUMxQixPQUFLLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxPQUFLLENBQUMsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsTUFBTTtXQUNwRSxDQUFBO1NBQ0YsQ0FBQyxDQUFBO09BQ0g7QUFDRCxhQUFPLElBQUksQ0FBQyxlQUFlLENBQUE7S0FDNUI7OztTQWxCRywyQkFBMkI7R0FBUyxlQUFlOztJQW9DbkQseUJBQXlCO1lBQXpCLHlCQUF5Qjs7V0FBekIseUJBQXlCOzBCQUF6Qix5QkFBeUI7OytCQUF6Qix5QkFBeUI7O1NBQzdCLFVBQVUsR0FBRyxXQUFXOzs7U0FEcEIseUJBQXlCO0dBQVMsMkJBQTJCOztJQUk3RCw4QkFBOEI7WUFBOUIsOEJBQThCOztXQUE5Qiw4QkFBOEI7MEJBQTlCLDhCQUE4Qjs7K0JBQTlCLDhCQUE4Qjs7U0FDbEMsVUFBVSxHQUFHLGdCQUFnQjs7OztTQUR6Qiw4QkFBOEI7R0FBUywyQkFBMkI7O0lBS2xFLG1CQUFtQjtZQUFuQixtQkFBbUI7O1dBQW5CLG1CQUFtQjswQkFBbkIsbUJBQW1COzsrQkFBbkIsbUJBQW1COztTQUN2QixTQUFTLEdBQUcsZUFBZTs7O2VBRHZCLG1CQUFtQjs7V0FHWixzQkFBRztBQUNaLFVBQUksQ0FBQyxRQUFRLENBQUMsc0JBQXNCLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFBO0FBQ3ZELGlDQUxFLG1CQUFtQiw0Q0FLSDtLQUNuQjs7O1dBRU8sbUJBQUc7QUFDVCxVQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsc0JBQXNCLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFBOztBQUUzRSxpQ0FYRSxtQkFBbUIseUNBV047O0FBRWYsV0FBSyxJQUFNLFNBQVMsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsRUFBRSxFQUFFO0FBQ25ELFlBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsaUNBQWlDLENBQUMsU0FBUyxDQUFDLENBQUE7QUFDL0UsWUFBSSxDQUFDLFFBQVEsQ0FBQyxzQkFBc0IsQ0FBQywyQkFBMkIsQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLENBQUE7T0FDbkY7S0FDRjs7O1dBRVUsb0JBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRTtBQUMzQixVQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUE7QUFDL0UsYUFBTyxLQUFLLEdBQUcsS0FBSyxDQUFDLElBQUksR0FBRyxFQUFFLENBQUE7S0FDL0I7OztTQXRCRyxtQkFBbUI7R0FBUyxlQUFlOztJQXlCM0MsNkJBQTZCO1lBQTdCLDZCQUE2Qjs7V0FBN0IsNkJBQTZCOzBCQUE3Qiw2QkFBNkI7OytCQUE3Qiw2QkFBNkI7O1NBQ2pDLFVBQVUsR0FBRyxJQUFJOzs7O1NBRGIsNkJBQTZCO0dBQVMsbUJBQW1COztJQUt6RCxnQkFBZ0I7WUFBaEIsZ0JBQWdCOztXQUFoQixnQkFBZ0I7MEJBQWhCLGdCQUFnQjs7K0JBQWhCLGdCQUFnQjs7Ozs7O2VBQWhCLGdCQUFnQjs7V0FDVCxvQkFBQyxJQUFJLEVBQUUsU0FBUyxFQUFFO0FBQzNCLFVBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxDQUFBO0FBQ2hELFVBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUE7QUFDdkMsYUFBTyxPQUFPLENBQUE7S0FDZjs7O1NBTEcsZ0JBQWdCO0dBQVMsZUFBZTs7SUFVeEMsTUFBTTtZQUFOLE1BQU07O1dBQU4sTUFBTTswQkFBTixNQUFNOzsrQkFBTixNQUFNOztTQUNWLFlBQVksR0FBRyxJQUFJO1NBQ25CLDZCQUE2QixHQUFHLElBQUk7U0FDcEMsSUFBSSxHQUFHLFVBQVU7OztlQUhiLE1BQU07O1dBS00seUJBQUMsU0FBUyxFQUFFOzs7O0FBRTFCLFVBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEtBQUssa0JBQWtCLEVBQUU7O0FBQzNDLGNBQUksT0FBTyxZQUFBLENBQUE7O0FBRVgsaUJBQUssVUFBVSxDQUFDLE9BQUssV0FBVyxDQUFDLE9BQUssUUFBUSxFQUFFLEVBQUUsRUFBQyxHQUFHLEVBQUUsR0FBRyxFQUFDLENBQUMsRUFBRSxVQUFDLEtBQU0sRUFBSztnQkFBVixJQUFJLEdBQUwsS0FBTSxDQUFMLElBQUk7O0FBQ25FLG1CQUFPLEdBQUcsU0FBUyxDQUFDLE9BQU8sRUFBRSxDQUFBO0FBQzdCLG1CQUFLLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQTtBQUN0QixnQkFBSSxTQUFTLENBQUMsT0FBTyxFQUFFLEtBQUssT0FBTyxFQUFFLElBQUksRUFBRSxDQUFBO1dBQzVDLENBQUMsQ0FBQTs7T0FDSCxNQUFNO0FBQ0wsWUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQTtPQUN2QjtLQUNGOzs7V0FFTSxnQkFBQyxTQUFTLEVBQUU7QUFDakIsZUFBUyxDQUFDLGtCQUFrQixFQUFFLENBQUE7S0FDL0I7OztTQXRCRyxNQUFNO0dBQVMsZUFBZTs7SUF5QjlCLE9BQU87WUFBUCxPQUFPOztXQUFQLE9BQU87MEJBQVAsT0FBTzs7K0JBQVAsT0FBTzs7O2VBQVAsT0FBTzs7V0FDSixnQkFBQyxTQUFTLEVBQUU7QUFDakIsZUFBUyxDQUFDLG1CQUFtQixFQUFFLENBQUE7S0FDaEM7OztTQUhHLE9BQU87R0FBUyxNQUFNOztJQU10QixVQUFVO1lBQVYsVUFBVTs7V0FBVixVQUFVOzBCQUFWLFVBQVU7OytCQUFWLFVBQVU7OztlQUFWLFVBQVU7O1dBQ1AsZ0JBQUMsU0FBUyxFQUFFO0FBQ2pCLGVBQVMsQ0FBQyxzQkFBc0IsRUFBRSxDQUFBO0tBQ25DOzs7U0FIRyxVQUFVO0dBQVMsTUFBTTs7SUFNekIsa0JBQWtCO1lBQWxCLGtCQUFrQjs7V0FBbEIsa0JBQWtCOzBCQUFsQixrQkFBa0I7OytCQUFsQixrQkFBa0I7O1NBQ3RCLFdBQVcsR0FBRyxLQUFLO1NBQ25CLFlBQVksR0FBRyxJQUFJO1NBQ25CLGtCQUFrQixHQUFHLElBQUk7U0FDekIsSUFBSSxHQUFHLFVBQVU7OztlQUpiLGtCQUFrQjs7V0FNTix5QkFBQyxTQUFTLEVBQUU7QUFDMUIsZUFBUyxDQUFDLGtCQUFrQixFQUFFLENBQUE7S0FDL0I7OztTQVJHLGtCQUFrQjtHQUFTLGVBQWU7O0lBVzFDLE1BQU07WUFBTixNQUFNOztXQUFOLE1BQU07MEJBQU4sTUFBTTs7K0JBQU4sTUFBTTs7O2VBQU4sTUFBTTs7V0FDTSx5QkFBQyxTQUFTLEVBQUU7QUFDMUIsVUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSwyQkFBMkIsQ0FBQyxDQUFBO0tBQ3hFOzs7U0FIRyxNQUFNO0dBQVMsZUFBZTs7SUFNOUIsY0FBYztZQUFkLGNBQWM7O1dBQWQsY0FBYzswQkFBZCxjQUFjOzsrQkFBZCxjQUFjOztTQUNsQixrQkFBa0IsR0FBRyxJQUFJOzs7OztTQURyQixjQUFjO0dBQVMsTUFBTTs7SUFNN0IsWUFBWTtZQUFaLFlBQVk7O1dBQVosWUFBWTswQkFBWixZQUFZOzsrQkFBWixZQUFZOztTQUVoQixjQUFjLEdBQUcsSUFBSTtTQUNyQixZQUFZLEdBQUc7QUFDYixTQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDO0FBQ2YsU0FBRyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQztBQUNmLFNBQUcsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUM7QUFDZixTQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDO0FBQ2YsU0FBRyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQztBQUNmLFNBQUcsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUM7QUFDZixTQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDO0FBQ2YsU0FBRyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQztBQUNmLE9BQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUM7QUFDYixPQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDO0FBQ2IsT0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQztBQUNiLE9BQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUM7S0FDZDs7O2VBaEJHLFlBQVk7O1dBa0JMLHNCQUFHO0FBQ1osVUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLHlCQUF5QixDQUFDLENBQUE7QUFDOUQsVUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFBO0FBQ3RDLGlDQXJCRSxZQUFZLDRDQXFCSTtLQUNuQjs7O1dBRU8saUJBQUMsSUFBSSxFQUFFO0FBQ2IsVUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFBO0FBQ3hELFVBQU0saUJBQWlCLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLENBQUE7QUFDdEQsYUFBTyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFBO0tBQzFFOzs7V0FFUSxrQkFBQyxJQUFJLEVBQUUsSUFBSSxFQUF3Qzs7O3dFQUFKLEVBQUU7O21DQUFuQyxVQUFVO1VBQVYsVUFBVSxvQ0FBRyxLQUFLO1VBQUUsU0FBUyxTQUFULFNBQVM7O3FCQUNwQixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQzs7OztVQUEzQyxJQUFJO1VBQUUsS0FBSztVQUFFLFFBQVE7O0FBQzFCLFVBQUksQ0FBQyxVQUFVLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRTs7QUFDdEMsY0FBTSxlQUFlLEdBQUcsT0FBSyxNQUFNLENBQUMsdUJBQXVCLENBQUMsU0FBUyxDQUFDLGNBQWMsRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQTtBQUNqRyxjQUFNLGtCQUFrQixHQUFHLE9BQUssTUFBTSxDQUFDLGlCQUFpQixDQUFDLGVBQWUsQ0FBQyxDQUFBO0FBQ3pFLGNBQU0sa0JBQWtCLEdBQUcsT0FBSyxNQUFNLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUE7O0FBRTNELGNBQUksR0FBRyxrQkFBa0IsR0FBRyxJQUFJLEdBQUcsSUFBSSxDQUFBO0FBQ3ZDLGNBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxVQUFBLENBQUM7bUJBQUksa0JBQWtCLEdBQUcsQ0FBQztXQUFBLENBQUMsQ0FBQTtBQUM1RCxlQUFLLEdBQUcsa0JBQWtCLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQTs7T0FDMUM7O0FBRUQsVUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxFQUFFO0FBQ3JDLFlBQUksUUFBUSxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsZ0NBQWdDLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUU7QUFDL0UsY0FBSSxHQUFHLEdBQUcsR0FBRyxJQUFJLEdBQUcsR0FBRyxDQUFBO1NBQ3hCO09BQ0Y7QUFDRCxhQUFPLElBQUksR0FBRyxJQUFJLEdBQUcsS0FBSyxDQUFBO0tBQzNCOzs7V0FFYSx5QkFBRztBQUNmLFVBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtBQUNmLGVBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUE7T0FDeEI7S0FDRjs7O1dBRWMsd0JBQUMsSUFBSSxFQUFFO2tCQUNFLElBQUksQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQzs7OztVQUF2RSxJQUFJO1VBQUUsS0FBSzs7QUFDbEIsVUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFBO0FBQ3JFLGFBQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLEtBQUssS0FBSyxHQUFHLFNBQVMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxTQUFTLENBQUE7S0FDMUY7OztXQUVVLG9CQUFDLElBQUksRUFBRSxTQUFTLEVBQUU7QUFDM0IsVUFBSSxJQUFJLENBQUMsY0FBYyxLQUFLLFVBQVUsRUFBRTtBQUN0QyxlQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsRUFBQyxTQUFTLEVBQVQsU0FBUyxFQUFDLENBQUMsQ0FBQTtPQUNwRCxNQUFNLElBQUksSUFBSSxDQUFDLGNBQWMsS0FBSyxpQkFBaUIsRUFBRTtBQUNwRCxlQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUE7T0FDakMsTUFBTSxJQUFJLElBQUksQ0FBQyxjQUFjLEtBQUssaUJBQWlCLEVBQUU7QUFDcEQsZUFBTyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBRSxFQUFDLFVBQVUsRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFBO09BQ2hGO0tBQ0Y7OztXQXJFZ0IsS0FBSzs7OztTQURsQixZQUFZO0dBQVMsZUFBZTs7SUF5RXBDLFFBQVE7WUFBUixRQUFROztXQUFSLFFBQVE7MEJBQVIsUUFBUTs7K0JBQVIsUUFBUTs7U0FDWixjQUFjLEdBQUcsVUFBVTtTQUMzQixvQkFBb0IsR0FBRyxJQUFJOzs7U0FGdkIsUUFBUTtHQUFTLFlBQVk7O0lBSzdCLFlBQVk7WUFBWixZQUFZOztXQUFaLFlBQVk7MEJBQVosWUFBWTs7K0JBQVosWUFBWTs7U0FDaEIsTUFBTSxHQUFHLFdBQVc7OztTQURoQixZQUFZO0dBQVMsUUFBUTs7SUFJN0IsaUJBQWlCO1lBQWpCLGlCQUFpQjs7V0FBakIsaUJBQWlCOzBCQUFqQixpQkFBaUI7OytCQUFqQixpQkFBaUI7O1NBQ3JCLE1BQU0sR0FBRyxnQkFBZ0I7OztTQURyQixpQkFBaUI7R0FBUyxRQUFROztJQUlsQyxXQUFXO1lBQVgsV0FBVzs7V0FBWCxXQUFXOzBCQUFYLFdBQVc7OytCQUFYLFdBQVc7O1NBQ2YsVUFBVSxHQUFHLElBQUk7U0FDakIsb0JBQW9CLEdBQUcsTUFBTTs7Ozs7U0FGekIsV0FBVztHQUFTLFFBQVE7O0lBTzVCLGNBQWM7WUFBZCxjQUFjOztXQUFkLGNBQWM7MEJBQWQsY0FBYzs7K0JBQWQsY0FBYzs7U0FDbEIsY0FBYyxHQUFHLGlCQUFpQjs7O2VBRDlCLGNBQWM7O1dBRVAsc0JBQUc7OztBQUNaLFVBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFO0FBQ2hCLFlBQUksQ0FBQyxVQUFVLENBQUM7QUFDZCxtQkFBUyxFQUFFLG1CQUFBLElBQUksRUFBSTtBQUNqQixtQkFBSyxTQUFTLENBQUMsT0FBSyxXQUFXLENBQUMsT0FBTyxFQUFFLEVBQUMsSUFBSSxFQUFFLE9BQUssT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFBO0FBQ3JFLG1CQUFLLGdCQUFnQixFQUFFLENBQUE7V0FDeEI7U0FDRixDQUFDLENBQUE7T0FDSDtBQUNELGlDQVhFLGNBQWMsNENBV0U7S0FDbkI7OztTQVpHLGNBQWM7R0FBUyxZQUFZOztJQWVuQyxxQkFBcUI7WUFBckIscUJBQXFCOztXQUFyQixxQkFBcUI7MEJBQXJCLHFCQUFxQjs7K0JBQXJCLHFCQUFxQjs7U0FDekIsTUFBTSxHQUFHLFVBQVU7OztTQURmLHFCQUFxQjtHQUFTLGNBQWM7O0lBSTVDLG9DQUFvQztZQUFwQyxvQ0FBb0M7O1dBQXBDLG9DQUFvQzswQkFBcEMsb0NBQW9DOzsrQkFBcEMsb0NBQW9DOztTQUN4QyxNQUFNLEdBQUcseUJBQXlCOzs7OztTQUQ5QixvQ0FBb0M7R0FBUyxxQkFBcUI7O0lBTWxFLGNBQWM7WUFBZCxjQUFjOztXQUFkLGNBQWM7MEJBQWQsY0FBYzs7K0JBQWQsY0FBYzs7U0FDbEIsY0FBYyxHQUFHLGlCQUFpQjtTQUNsQyxvQkFBb0IsR0FBRyxJQUFJOzs7ZUFGdkIsY0FBYzs7Ozs2QkFLTyxhQUFVO0FBQ2pDLFVBQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsMkJBQTJCLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLENBQUE7QUFDbkcsVUFBTSxlQUFlLEdBQUcsSUFBSSxDQUFDLGFBQWEsRUFBRSxHQUFHLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLGVBQWUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQ3pHLFVBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxlQUFlLEVBQUUsVUFBVSxDQUFDLENBQUE7O3dDQUh6QixJQUFJO0FBQUosWUFBSTs7O0FBSS9CLHdDQVRFLGNBQWMscURBU21CLElBQUksRUFBQztLQUN6Qzs7O1NBVkcsY0FBYztHQUFTLGNBQWM7O0lBYXJDLHFCQUFxQjtZQUFyQixxQkFBcUI7O1dBQXJCLHFCQUFxQjswQkFBckIscUJBQXFCOzsrQkFBckIscUJBQXFCOztTQUN6QixNQUFNLEdBQUcsVUFBVTs7O1NBRGYscUJBQXFCO0dBQVMsY0FBYzs7SUFJNUMsb0NBQW9DO1lBQXBDLG9DQUFvQzs7V0FBcEMsb0NBQW9DOzBCQUFwQyxvQ0FBb0M7OytCQUFwQyxvQ0FBb0M7O1NBQ3hDLE1BQU0sR0FBRyx5QkFBeUI7Ozs7Ozs7U0FEOUIsb0NBQW9DO0dBQVMscUJBQXFCOztJQVFsRSxVQUFVO1lBQVYsVUFBVTs7V0FBVixVQUFVOzBCQUFWLFVBQVU7OytCQUFWLFVBQVU7O1NBQ2QsV0FBVyxHQUFHLEtBQUs7U0FDbkIsZ0JBQWdCLEdBQUcsS0FBSzs7O2VBRnBCLFVBQVU7O1dBSUUseUJBQUMsU0FBUyxFQUFFO0FBQzFCLFVBQU0sS0FBSyxHQUFHLFNBQVMsQ0FBQyxjQUFjLEVBQUUsQ0FBQTs7Ozs7QUFLeEMsVUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsS0FBSyxJQUFJLENBQUMsTUFBTSxDQUFDLGdCQUFnQixFQUFFLEVBQUU7QUFDN0UsWUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsRUFBRTtBQUNyQyxtQkFBUyxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFBO1NBQ2xFO0FBQ0QsaUJBQVMsQ0FBQyxTQUFTLEVBQUUsQ0FBQTtPQUN0QjtBQUNELFVBQU0sS0FBSyxHQUFHLFNBQVMsQ0FBQyxjQUFjLEVBQUUsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUMvRCxhQUFPLFNBQVMsQ0FBQyxNQUFNLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLENBQUE7S0FDakQ7OztTQWxCRyxVQUFVO0dBQVMsZUFBZTs7SUFxQmxDLElBQUk7WUFBSixJQUFJOztXQUFKLElBQUk7MEJBQUosSUFBSTs7K0JBQUosSUFBSTs7U0FDUixNQUFNLEdBQUcsb0JBQW9COzs7U0FEekIsSUFBSTtHQUFTLFVBQVU7O0lBSXZCLFFBQVE7WUFBUixRQUFROztXQUFSLFFBQVE7MEJBQVIsUUFBUTs7K0JBQVIsUUFBUTs7U0FFWixJQUFJLEdBQUcsVUFBVTtTQUNqQixJQUFJLEdBQUcsS0FBSztTQUNaLE1BQU0sR0FBRyw4QkFBOEI7OztlQUpuQyxRQUFROztXQU1ELG9CQUFDLElBQUksRUFBRTtBQUNoQixVQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxHQUFHLGNBQWMsR0FBRyxRQUFRLENBQUE7QUFDbkQsYUFBTyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxDQUFBO0tBQzFEOzs7V0FSZ0IsS0FBSzs7OztTQURsQixRQUFRO0dBQVMsZUFBZTs7SUFZaEMsb0JBQW9CO1lBQXBCLG9CQUFvQjs7V0FBcEIsb0JBQW9COzBCQUFwQixvQkFBb0I7OytCQUFwQixvQkFBb0I7O1NBQ3hCLEtBQUssR0FBRyxFQUFFOzs7U0FETixvQkFBb0I7R0FBUyxRQUFROztJQUlyQyxXQUFXO1lBQVgsV0FBVzs7V0FBWCxXQUFXOzBCQUFYLFdBQVc7OytCQUFYLFdBQVc7O1NBQ2Ysb0JBQW9CLEdBQUcsSUFBSTtTQUMzQixpQkFBaUIsR0FBRyxFQUFDLFFBQVEsRUFBRSxFQUFFLEVBQUM7U0FDbEMsSUFBSSxHQUFHLElBQUk7OztTQUhQLFdBQVc7R0FBUyxRQUFROztJQU01QiwyQkFBMkI7WUFBM0IsMkJBQTJCOztXQUEzQiwyQkFBMkI7MEJBQTNCLDJCQUEyQjs7K0JBQTNCLDJCQUEyQjs7U0FDL0IsSUFBSSxHQUFHLEtBQUs7Ozs7O1NBRFIsMkJBQTJCO0dBQVMsV0FBVzs7SUFNL0MsV0FBVztZQUFYLFdBQVc7O1dBQVgsV0FBVzswQkFBWCxXQUFXOzsrQkFBWCxXQUFXOztTQUNmLE1BQU0sR0FBRyxvQkFBb0I7U0FDN0IsWUFBWSxHQUFHLEtBQUs7U0FDcEIsb0JBQW9CLEdBQUcsSUFBSTtTQUMzQixpQkFBaUIsR0FBRyxFQUFDLFFBQVEsRUFBRSxFQUFFLEVBQUM7OztlQUo5QixXQUFXOztXQU1KLG9CQUFDLElBQUksRUFBRTtBQUNoQixVQUFNLEtBQUssR0FBRyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsS0FBSyxJQUFJLEtBQUssQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFBO0FBQ3ZFLFVBQU0sYUFBYSxHQUFHLENBQUMsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQSxHQUFJLElBQUksQ0FBQTtBQUNsRSxhQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLGFBQWEsQ0FBQyxDQUFBO0tBQzFDOzs7U0FWRyxXQUFXO0dBQVMsZUFBZTs7SUFhbkMsOEJBQThCO1lBQTlCLDhCQUE4Qjs7V0FBOUIsOEJBQThCOzBCQUE5Qiw4QkFBOEI7OytCQUE5Qiw4QkFBOEI7O1NBQ2xDLFlBQVksR0FBRyxJQUFJOzs7U0FEZiw4QkFBOEI7R0FBUyxXQUFXOztJQUlsRCxjQUFjO1lBQWQsY0FBYzs7V0FBZCxjQUFjOzBCQUFkLGNBQWM7OytCQUFkLGNBQWM7O1NBQ2xCLGFBQWEsR0FBRyxJQUFJOzs7ZUFEaEIsY0FBYzs7V0FHUCxvQkFBQyxJQUFJLEVBQUUsU0FBUyxFQUFFO0FBQzNCLFVBQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFBO0FBQ3hELFVBQUksT0FBTyxHQUFHLEVBQUUsQ0FBQTs7QUFFaEIsVUFBTSxlQUFlLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyx1QkFBdUIsQ0FBQyxTQUFTLENBQUMsY0FBYyxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFBO0FBQ2pHLFVBQU0sa0JBQWtCLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxlQUFlLENBQUMsQ0FBQTtBQUN6RSxVQUFNLG1CQUFtQixHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsaUJBQWlCLENBQUMsZUFBZSxHQUFHLENBQUMsQ0FBQyxDQUFBOztBQUU5RSxhQUFPLFNBQVMsQ0FBQyxNQUFNLEVBQUU7K0JBQ0YsU0FBUyxDQUFDLEtBQUssRUFBRTs7WUFBL0IsS0FBSSxvQkFBSixJQUFJO1lBQUUsSUFBSSxvQkFBSixJQUFJOztBQUNqQixlQUFPLElBQUksSUFBSSxLQUFLLFdBQVcsR0FBRyxDQUFDLElBQUksQ0FBQyxhQUFhLEdBQUcsS0FBSSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQSxHQUFJLElBQUksR0FBRyxtQkFBbUIsR0FBRyxLQUFJLENBQUE7T0FDOUc7QUFDRCxvQkFBWSxPQUFPLFVBQUssa0JBQWtCLENBQUU7S0FDN0M7OztTQWhCRyxjQUFjO0dBQVMsZUFBZTs7SUFtQnRDLGlDQUFpQztZQUFqQyxpQ0FBaUM7O1dBQWpDLGlDQUFpQzswQkFBakMsaUNBQWlDOzsrQkFBakMsaUNBQWlDOztTQUNyQyxhQUFhLEdBQUcsS0FBSzs7O1NBRGpCLGlDQUFpQztHQUFTLGNBQWM7O0lBSXhELDRCQUE0QjtZQUE1Qiw0QkFBNEI7O1dBQTVCLDRCQUE0QjswQkFBNUIsNEJBQTRCOzsrQkFBNUIsNEJBQTRCOztTQUNoQyxNQUFNLEdBQUcsY0FBYzs7O1NBRG5CLDRCQUE0QjtHQUFTLGNBQWM7O0lBSW5ELFdBQVc7WUFBWCxXQUFXOztXQUFYLFdBQVc7MEJBQVgsV0FBVzs7K0JBQVgsV0FBVzs7U0FFZixNQUFNLEdBQUcsSUFBSTtTQUNiLE1BQU0sR0FBRyxJQUFJOzs7ZUFIVCxXQUFXOztXQUtKLG9CQUFDLElBQUksRUFBRTs7O0FBQ2hCLGFBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsR0FDM0IsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksR0FDdEUsSUFBSSxDQUFDLHFCQUFxQixDQUFDLElBQUksRUFBRSxVQUFBLElBQUk7ZUFBSSxRQUFLLFVBQVUsQ0FBQyxJQUFJLENBQUM7T0FBQSxDQUFDLENBQUE7S0FDcEU7OztXQUVVLG9CQUFDLElBQUksRUFBRTtBQUNoQixVQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO0FBQ3JCLGVBQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQTtPQUN2RSxNQUFNO0FBQ0wsZUFBTyxJQUFJLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQTtPQUNuRTtLQUNGOzs7V0FFcUIsK0JBQUMsSUFBSSxFQUFFLEVBQUUsRUFBRTtBQUMvQixVQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFBO0FBQy9CLFVBQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUE7QUFDL0IsVUFBTSxhQUFhLEdBQUcsS0FBSyxLQUFLLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQTtBQUM5RCxVQUFNLGNBQWMsR0FBRyxHQUFHLEtBQUssQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUE7QUFDeEQsVUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQTtBQUNuRSxVQUFNLElBQUksR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDLFVBQUEsS0FBSztlQUFJLEtBQUssQ0FBQyxJQUFJLEtBQUssVUFBVTtPQUFBLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBQSxLQUFLO2VBQUksS0FBSyxDQUFDLElBQUk7T0FBQSxDQUFDLENBQUE7QUFDMUYsVUFBTSxPQUFPLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFBOztBQUV4QixVQUFJLE9BQU8sR0FBRyxFQUFFLENBQUE7QUFDaEIsYUFBTyxTQUFTLENBQUMsTUFBTSxFQUFFO0FBQ3ZCLFlBQU0sS0FBSyxHQUFHLFNBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQTs7QUFFL0IsZUFBTyxJQUFJLEtBQUssQ0FBQyxJQUFJLEtBQUssV0FBVyxHQUFHLEtBQUssQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFBO09BQ3JFO0FBQ0QsYUFBTyxhQUFhLEdBQUcsT0FBTyxHQUFHLGNBQWMsQ0FBQTtLQUNoRDs7O1dBbENnQixLQUFLOzs7O1NBRGxCLFdBQVc7R0FBUyxlQUFlOztJQXNDbkMsT0FBTztZQUFQLE9BQU87O1dBQVAsT0FBTzswQkFBUCxPQUFPOzsrQkFBUCxPQUFPOztTQUNYLE1BQU0sR0FBRyxTQUFTOzs7U0FEZCxPQUFPO0dBQVMsV0FBVzs7SUFJM0IsbUJBQW1CO1lBQW5CLG1CQUFtQjs7V0FBbkIsbUJBQW1COzBCQUFuQixtQkFBbUI7OytCQUFuQixtQkFBbUI7O1NBQ3ZCLE1BQU0sR0FBRyxjQUFjOzs7U0FEbkIsbUJBQW1CO0dBQVMsT0FBTzs7SUFJbkMsTUFBTTtZQUFOLE1BQU07O1dBQU4sTUFBTTswQkFBTixNQUFNOzsrQkFBTixNQUFNOztTQUNWLE1BQU0sR0FBRyxhQUFhOzs7U0FEbEIsTUFBTTtHQUFTLFdBQVc7O0lBSTFCLGVBQWU7WUFBZixlQUFlOztXQUFmLGVBQWU7MEJBQWYsZUFBZTs7K0JBQWYsZUFBZTs7U0FDbkIsTUFBTSxHQUFHLGNBQWM7OztTQURuQixlQUFlO0dBQVMsV0FBVzs7SUFJbkMsMEJBQTBCO1lBQTFCLDBCQUEwQjs7V0FBMUIsMEJBQTBCOzBCQUExQiwwQkFBMEI7OytCQUExQiwwQkFBMEI7O1NBQzlCLE1BQU0sR0FBRyxjQUFjOzs7U0FEbkIsMEJBQTBCO0dBQVMsTUFBTTs7SUFJekMsbUNBQW1DO1lBQW5DLG1DQUFtQzs7V0FBbkMsbUNBQW1DOzBCQUFuQyxtQ0FBbUM7OytCQUFuQyxtQ0FBbUM7O1NBQ3ZDLE1BQU0sR0FBRyxjQUFjOzs7U0FEbkIsbUNBQW1DO0dBQVMsZUFBZTs7SUFJM0QsSUFBSTtZQUFKLElBQUk7O1dBQUosSUFBSTswQkFBSixJQUFJOzsrQkFBSixJQUFJOztTQUNSLE1BQU0sR0FBRyxNQUFNOzs7U0FEWCxJQUFJO0dBQVMsV0FBVzs7SUFJeEIscUJBQXFCO1lBQXJCLHFCQUFxQjs7V0FBckIscUJBQXFCOzBCQUFyQixxQkFBcUI7OytCQUFyQixxQkFBcUI7O1NBQ3pCLE1BQU0sR0FBRyxVQUFDLElBQUksRUFBRSxJQUFJO2FBQUssSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEVBQUUsRUFBQyxXQUFXLEVBQUUsTUFBTSxFQUFDLENBQUM7S0FBQTs7O1NBRHBFLHFCQUFxQjtHQUFTLElBQUk7O0lBSWxDLFlBQVk7WUFBWixZQUFZOztXQUFaLFlBQVk7MEJBQVosWUFBWTs7K0JBQVosWUFBWTs7U0FDaEIsTUFBTSxHQUFHLFVBQUMsSUFBSSxFQUFFLElBQUk7YUFBSyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksUUFBUSxDQUFBLElBQUssTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxRQUFRLENBQUEsQUFBQztLQUFBOzs7U0FEOUYsWUFBWTtHQUFTLElBQUk7O0lBSXpCLFNBQVM7WUFBVCxTQUFTOztXQUFULFNBQVM7MEJBQVQsU0FBUzs7K0JBQVQsU0FBUzs7U0FDYixNQUFNLEdBQUcsV0FBVzs7O1NBRGhCLFNBQVM7R0FBUyxXQUFXOztJQUk3QixjQUFjO1lBQWQsY0FBYzs7V0FBZCxjQUFjOzBCQUFkLGNBQWM7OytCQUFkLGNBQWM7O1NBQ2xCLElBQUksR0FBRyxVQUFVOzs7ZUFEYixjQUFjOztXQUdQLG9CQUFDLElBQUksRUFBRTs7O0FBQ2hCLFVBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLENBQUE7QUFDaEQsVUFBTSxZQUFZLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUE7O0FBRS9DLFVBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBQyxPQUFPLEVBQUUsQ0FBQyxFQUFLO0FBQ3ZDLFNBQUMsRUFBRSxDQUFBO0FBQ0gsWUFBTSxlQUFlLEdBQUcsUUFBSyxXQUFXLENBQUMsWUFBWSxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBQyxHQUFHLEVBQUUsQ0FBQyxFQUFDLENBQUMsQ0FBQTtBQUNuRixlQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksR0FBRyxPQUFPLENBQUE7T0FDeEQsQ0FBQyxDQUFBO0FBQ0YsYUFBTyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQTtLQUNqQzs7O1NBYkcsY0FBYztHQUFTLGVBQWU7O0lBZ0J0QywrQkFBK0I7WUFBL0IsK0JBQStCOztXQUEvQiwrQkFBK0I7MEJBQS9CLCtCQUErQjs7K0JBQS9CLCtCQUErQjs7U0FDbkMsSUFBSSxHQUFHLFVBQVU7U0FDakIsWUFBWSxHQUFHLElBQUk7U0FDbkIsa0JBQWtCLEdBQUcsSUFBSTs7O2VBSHJCLCtCQUErQjs7V0FJbkIseUJBQUMsU0FBUyxFQUFFO3lDQUNDLFNBQVMsQ0FBQyxpQkFBaUIsRUFBRTs7OztVQUFqRCxRQUFRO1VBQUUsTUFBTTs7QUFDdkIsZUFBUyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLDBCQUEwQixDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQTtBQUNoSCxVQUFJLENBQUMsTUFBTSxDQUFDLCtCQUErQixDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQTtLQUM5RDs7O1NBUkcsK0JBQStCO0dBQVMsZUFBZTs7QUFXN0QsTUFBTSxDQUFDLE9BQU8sR0FBRztBQUNmLGlCQUFlLEVBQWYsZUFBZTs7QUFFZixRQUFNLEVBQU4sTUFBTTtBQUNOLFNBQU8sRUFBUCxPQUFPO0FBQ1AsVUFBUSxFQUFSLFFBQVE7QUFDUixVQUFRLEVBQVIsUUFBUTtBQUNSLFdBQVMsRUFBVCxTQUFTO0FBQ1QsV0FBUyxFQUFULFNBQVM7QUFDVCxXQUFTLEVBQVQsU0FBUztBQUNULFdBQVMsRUFBVCxTQUFTO0FBQ1QsV0FBUyxFQUFULFNBQVM7QUFDVCxXQUFTLEVBQVQsU0FBUztBQUNULFlBQVUsRUFBVixVQUFVO0FBQ1YsWUFBVSxFQUFWLFVBQVU7QUFDVixjQUFZLEVBQVosWUFBWTtBQUNaLGNBQVksRUFBWixZQUFZO0FBQ1osZ0JBQWMsRUFBZCxjQUFjO0FBQ2QsZ0JBQWMsRUFBZCxjQUFjO0FBQ2QsVUFBUSxFQUFSLFFBQVE7QUFDUixZQUFVLEVBQVYsVUFBVTtBQUNWLHdCQUFzQixFQUF0QixzQkFBc0I7O0FBRXRCLFNBQU8sRUFBUCxPQUFPO0FBQ1Asa0JBQWdCLEVBQWhCLGdCQUFnQjtBQUNoQixrQkFBZ0IsRUFBaEIsZ0JBQWdCO0FBQ2hCLG9CQUFrQixFQUFsQixrQkFBa0I7QUFDbEIsb0JBQWtCLEVBQWxCLGtCQUFrQjtBQUNsQixZQUFVLEVBQVYsVUFBVTtBQUNWLGVBQWEsRUFBYixhQUFhO0FBQ2IsaUJBQWUsRUFBZixlQUFlO0FBQ2YsMEJBQXdCLEVBQXhCLHdCQUF3QjtBQUN4QiwyQkFBeUIsRUFBekIseUJBQXlCO0FBQ3pCLDBCQUF3QixFQUF4Qix3QkFBd0I7QUFDeEIsa0JBQWdCLEVBQWhCLGdCQUFnQjtBQUNoQixrQkFBZ0IsRUFBaEIsZ0JBQWdCO0FBQ2hCLGtDQUFnQyxFQUFoQyxnQ0FBZ0M7QUFDaEMsNkJBQTJCLEVBQTNCLDJCQUEyQjtBQUMzQiwyQkFBeUIsRUFBekIseUJBQXlCO0FBQ3pCLGdDQUE4QixFQUE5Qiw4QkFBOEI7QUFDOUIscUJBQW1CLEVBQW5CLG1CQUFtQjtBQUNuQiwrQkFBNkIsRUFBN0IsNkJBQTZCO0FBQzdCLGtCQUFnQixFQUFoQixnQkFBZ0I7QUFDaEIsUUFBTSxFQUFOLE1BQU07QUFDTixTQUFPLEVBQVAsT0FBTztBQUNQLFlBQVUsRUFBVixVQUFVO0FBQ1Ysb0JBQWtCLEVBQWxCLGtCQUFrQjtBQUNsQixRQUFNLEVBQU4sTUFBTTtBQUNOLGdCQUFjLEVBQWQsY0FBYztBQUNkLGNBQVksRUFBWixZQUFZO0FBQ1osVUFBUSxFQUFSLFFBQVE7QUFDUixjQUFZLEVBQVosWUFBWTtBQUNaLG1CQUFpQixFQUFqQixpQkFBaUI7QUFDakIsYUFBVyxFQUFYLFdBQVc7QUFDWCxnQkFBYyxFQUFkLGNBQWM7QUFDZCx1QkFBcUIsRUFBckIscUJBQXFCO0FBQ3JCLHNDQUFvQyxFQUFwQyxvQ0FBb0M7QUFDcEMsZ0JBQWMsRUFBZCxjQUFjO0FBQ2QsdUJBQXFCLEVBQXJCLHFCQUFxQjtBQUNyQixzQ0FBb0MsRUFBcEMsb0NBQW9DO0FBQ3BDLFlBQVUsRUFBVixVQUFVO0FBQ1YsTUFBSSxFQUFKLElBQUk7QUFDSixVQUFRLEVBQVIsUUFBUTtBQUNSLHNCQUFvQixFQUFwQixvQkFBb0I7QUFDcEIsYUFBVyxFQUFYLFdBQVc7QUFDWCw2QkFBMkIsRUFBM0IsMkJBQTJCO0FBQzNCLGFBQVcsRUFBWCxXQUFXO0FBQ1gsZ0NBQThCLEVBQTlCLDhCQUE4QjtBQUM5QixnQkFBYyxFQUFkLGNBQWM7QUFDZCxtQ0FBaUMsRUFBakMsaUNBQWlDO0FBQ2pDLDhCQUE0QixFQUE1Qiw0QkFBNEI7QUFDNUIsYUFBVyxFQUFYLFdBQVc7QUFDWCxTQUFPLEVBQVAsT0FBTztBQUNQLHFCQUFtQixFQUFuQixtQkFBbUI7QUFDbkIsUUFBTSxFQUFOLE1BQU07QUFDTixpQkFBZSxFQUFmLGVBQWU7QUFDZiw0QkFBMEIsRUFBMUIsMEJBQTBCO0FBQzFCLHFDQUFtQyxFQUFuQyxtQ0FBbUM7QUFDbkMsTUFBSSxFQUFKLElBQUk7QUFDSix1QkFBcUIsRUFBckIscUJBQXFCO0FBQ3JCLGNBQVksRUFBWixZQUFZO0FBQ1osV0FBUyxFQUFULFNBQVM7QUFDVCxnQkFBYyxFQUFkLGNBQWM7QUFDZCxpQ0FBK0IsRUFBL0IsK0JBQStCO0NBQ2hDLENBQUE7QUFDRCxLQUFLLElBQU0sS0FBSyxJQUFJLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxFQUFFO0FBQ2pELE1BQUksS0FBSyxDQUFDLFNBQVMsRUFBRSxFQUFFLEtBQUssQ0FBQyxvQkFBb0IsRUFBRSxDQUFBO0NBQ3BEIiwiZmlsZSI6Ii9Vc2Vycy9naXQvLmF0b20vcGFja2FnZXMvdmltLW1vZGUtcGx1cy9saWIvb3BlcmF0b3ItdHJhbnNmb3JtLXN0cmluZy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmNvbnN0IGNoYW5nZUNhc2UgPSByZXF1aXJlKCdjaGFuZ2UtY2FzZScpXG5sZXQgc2VsZWN0TGlzdFxuXG5jb25zdCB7QnVmZmVyZWRQcm9jZXNzfSA9IHJlcXVpcmUoJ2F0b20nKVxuY29uc3Qge09wZXJhdG9yfSA9IHJlcXVpcmUoJy4vb3BlcmF0b3InKVxuXG4vLyBUcmFuc2Zvcm1TdHJpbmdcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5jbGFzcyBUcmFuc2Zvcm1TdHJpbmcgZXh0ZW5kcyBPcGVyYXRvciB7XG4gIHN0YXRpYyBjb21tYW5kID0gZmFsc2VcbiAgc3RhdGljIHN0cmluZ1RyYW5zZm9ybWVycyA9IFtdXG4gIHRyYWNrQ2hhbmdlID0gdHJ1ZVxuICBzdGF5T3B0aW9uTmFtZSA9ICdzdGF5T25UcmFuc2Zvcm1TdHJpbmcnXG4gIGF1dG9JbmRlbnQgPSBmYWxzZVxuICBhdXRvSW5kZW50TmV3bGluZSA9IGZhbHNlXG4gIHJlcGxhY2VCeURpZmYgPSBmYWxzZVxuXG4gIHN0YXRpYyByZWdpc3RlclRvU2VsZWN0TGlzdCAoKSB7XG4gICAgdGhpcy5zdHJpbmdUcmFuc2Zvcm1lcnMucHVzaCh0aGlzKVxuICB9XG5cbiAgbXV0YXRlU2VsZWN0aW9uIChzZWxlY3Rpb24pIHtcbiAgICBjb25zdCB0ZXh0ID0gdGhpcy5nZXROZXdUZXh0KHNlbGVjdGlvbi5nZXRUZXh0KCksIHNlbGVjdGlvbilcbiAgICBpZiAodGV4dCkge1xuICAgICAgaWYgKHRoaXMucmVwbGFjZUJ5RGlmZikge1xuICAgICAgICB0aGlzLnJlcGxhY2VUZXh0SW5SYW5nZVZpYURpZmYoc2VsZWN0aW9uLmdldEJ1ZmZlclJhbmdlKCksIHRleHQpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzZWxlY3Rpb24uaW5zZXJ0VGV4dCh0ZXh0LCB7YXV0b0luZGVudDogdGhpcy5hdXRvSW5kZW50LCBhdXRvSW5kZW50TmV3bGluZTogdGhpcy5hdXRvSW5kZW50TmV3bGluZX0pXG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmNsYXNzIENoYW5nZUNhc2UgZXh0ZW5kcyBUcmFuc2Zvcm1TdHJpbmcge1xuICBzdGF0aWMgY29tbWFuZCA9IGZhbHNlXG4gIGdldE5ld1RleHQgKHRleHQpIHtcbiAgICBjb25zdCBmdW5jdGlvbk5hbWUgPSB0aGlzLmZ1bmN0aW9uTmFtZSB8fCBjaGFuZ2VDYXNlLmxvd2VyQ2FzZUZpcnN0KHRoaXMubmFtZSlcbiAgICAvLyBIQUNLOiBQdXJlIFZpbSdzIGB+YCBpcyB0b28gYWdncmVzc2l2ZShlLmcuIHJlbW92ZSBwdW5jdHVhdGlvbiwgcmVtb3ZlIHdoaXRlIHNwYWNlcy4uLikuXG4gICAgLy8gSGVyZSBpbnRlbnRpb25hbGx5IG1ha2luZyBjaGFuZ2VDYXNlIGxlc3MgYWdncmVzc2l2ZSBieSBuYXJyb3dpbmcgdGFyZ2V0IGNoYXJzZXQuXG4gICAgY29uc3QgY2hhcnNldCA9ICdbXFx1MDBDMC1cXHUwMkFGXFx1MDM4Ni1cXHUwNTg3XFxcXHddJ1xuICAgIGNvbnN0IHJlZ2V4ID0gbmV3IFJlZ0V4cChgJHtjaGFyc2V0fSsoOj9bLS4vXT8ke2NoYXJzZXR9KykqYCwgJ2cnKVxuICAgIHJldHVybiB0ZXh0LnJlcGxhY2UocmVnZXgsIG1hdGNoID0+IGNoYW5nZUNhc2VbZnVuY3Rpb25OYW1lXShtYXRjaCkpXG4gIH1cbn1cblxuY2xhc3MgTm9DYXNlIGV4dGVuZHMgQ2hhbmdlQ2FzZSB7fVxuY2xhc3MgRG90Q2FzZSBleHRlbmRzIENoYW5nZUNhc2Uge1xuICBzdGF0aWMgZGlzcGxheU5hbWVTdWZmaXggPSAnLidcbn1cbmNsYXNzIFN3YXBDYXNlIGV4dGVuZHMgQ2hhbmdlQ2FzZSB7XG4gIHN0YXRpYyBkaXNwbGF5TmFtZVN1ZmZpeCA9ICd+J1xufVxuY2xhc3MgUGF0aENhc2UgZXh0ZW5kcyBDaGFuZ2VDYXNlIHtcbiAgc3RhdGljIGRpc3BsYXlOYW1lU3VmZml4ID0gJy8nXG59XG5jbGFzcyBVcHBlckNhc2UgZXh0ZW5kcyBDaGFuZ2VDYXNlIHt9XG5jbGFzcyBMb3dlckNhc2UgZXh0ZW5kcyBDaGFuZ2VDYXNlIHt9XG5jbGFzcyBDYW1lbENhc2UgZXh0ZW5kcyBDaGFuZ2VDYXNlIHt9XG5jbGFzcyBTbmFrZUNhc2UgZXh0ZW5kcyBDaGFuZ2VDYXNlIHtcbiAgc3RhdGljIGRpc3BsYXlOYW1lU3VmZml4ID0gJ18nXG59XG5jbGFzcyBUaXRsZUNhc2UgZXh0ZW5kcyBDaGFuZ2VDYXNlIHt9XG5jbGFzcyBQYXJhbUNhc2UgZXh0ZW5kcyBDaGFuZ2VDYXNlIHtcbiAgc3RhdGljIGRpc3BsYXlOYW1lU3VmZml4ID0gJy0nXG59XG5jbGFzcyBIZWFkZXJDYXNlIGV4dGVuZHMgQ2hhbmdlQ2FzZSB7fVxuY2xhc3MgUGFzY2FsQ2FzZSBleHRlbmRzIENoYW5nZUNhc2Uge31cbmNsYXNzIENvbnN0YW50Q2FzZSBleHRlbmRzIENoYW5nZUNhc2Uge31cbmNsYXNzIFNlbnRlbmNlQ2FzZSBleHRlbmRzIENoYW5nZUNhc2Uge31cbmNsYXNzIFVwcGVyQ2FzZUZpcnN0IGV4dGVuZHMgQ2hhbmdlQ2FzZSB7fVxuY2xhc3MgTG93ZXJDYXNlRmlyc3QgZXh0ZW5kcyBDaGFuZ2VDYXNlIHt9XG5cbmNsYXNzIERhc2hDYXNlIGV4dGVuZHMgQ2hhbmdlQ2FzZSB7XG4gIHN0YXRpYyBkaXNwbGF5TmFtZVN1ZmZpeCA9ICctJ1xuICBmdW5jdGlvbk5hbWUgPSAncGFyYW1DYXNlJ1xufVxuY2xhc3MgVG9nZ2xlQ2FzZSBleHRlbmRzIENoYW5nZUNhc2Uge1xuICBzdGF0aWMgZGlzcGxheU5hbWVTdWZmaXggPSAnfidcbiAgZnVuY3Rpb25OYW1lID0gJ3N3YXBDYXNlJ1xufVxuXG5jbGFzcyBUb2dnbGVDYXNlQW5kTW92ZVJpZ2h0IGV4dGVuZHMgQ2hhbmdlQ2FzZSB7XG4gIGZ1bmN0aW9uTmFtZSA9ICdzd2FwQ2FzZSdcbiAgZmxhc2hUYXJnZXQgPSBmYWxzZVxuICByZXN0b3JlUG9zaXRpb25zID0gZmFsc2VcbiAgdGFyZ2V0ID0gJ01vdmVSaWdodCdcbn1cblxuLy8gUmVwbGFjZVxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuY2xhc3MgUmVwbGFjZSBleHRlbmRzIFRyYW5zZm9ybVN0cmluZyB7XG4gIGZsYXNoQ2hlY2twb2ludCA9ICdkaWQtc2VsZWN0LW9jY3VycmVuY2UnXG4gIGF1dG9JbmRlbnROZXdsaW5lID0gdHJ1ZVxuICByZWFkSW5wdXRBZnRlclNlbGVjdCA9IHRydWVcblxuICBnZXROZXdUZXh0ICh0ZXh0KSB7XG4gICAgaWYgKHRoaXMudGFyZ2V0Lm5hbWUgPT09ICdNb3ZlUmlnaHRCdWZmZXJDb2x1bW4nICYmIHRleHQubGVuZ3RoICE9PSB0aGlzLmdldENvdW50KCkpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGNvbnN0IGlucHV0ID0gdGhpcy5pbnB1dCB8fCAnXFxuJ1xuICAgIGlmIChpbnB1dCA9PT0gJ1xcbicpIHtcbiAgICAgIHRoaXMucmVzdG9yZVBvc2l0aW9ucyA9IGZhbHNlXG4gICAgfVxuICAgIHJldHVybiB0ZXh0LnJlcGxhY2UoLy4vZywgaW5wdXQpXG4gIH1cbn1cblxuY2xhc3MgUmVwbGFjZUNoYXJhY3RlciBleHRlbmRzIFJlcGxhY2Uge1xuICB0YXJnZXQgPSAnTW92ZVJpZ2h0QnVmZmVyQ29sdW1uJ1xufVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBEVVAgbWVhbmluZyB3aXRoIFNwbGl0U3RyaW5nIG5lZWQgY29uc29saWRhdGUuXG5jbGFzcyBTcGxpdEJ5Q2hhcmFjdGVyIGV4dGVuZHMgVHJhbnNmb3JtU3RyaW5nIHtcbiAgZ2V0TmV3VGV4dCAodGV4dCkge1xuICAgIHJldHVybiB0ZXh0LnNwbGl0KCcnKS5qb2luKCcgJylcbiAgfVxufVxuXG5jbGFzcyBFbmNvZGVVcmlDb21wb25lbnQgZXh0ZW5kcyBUcmFuc2Zvcm1TdHJpbmcge1xuICBzdGF0aWMgZGlzcGxheU5hbWVTdWZmaXggPSAnJSdcbiAgZ2V0TmV3VGV4dCAodGV4dCkge1xuICAgIHJldHVybiBlbmNvZGVVUklDb21wb25lbnQodGV4dClcbiAgfVxufVxuXG5jbGFzcyBEZWNvZGVVcmlDb21wb25lbnQgZXh0ZW5kcyBUcmFuc2Zvcm1TdHJpbmcge1xuICBzdGF0aWMgZGlzcGxheU5hbWVTdWZmaXggPSAnJSUnXG4gIGdldE5ld1RleHQgKHRleHQpIHtcbiAgICByZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KHRleHQpXG4gIH1cbn1cblxuY2xhc3MgVHJpbVN0cmluZyBleHRlbmRzIFRyYW5zZm9ybVN0cmluZyB7XG4gIHN0YXlCeU1hcmtlciA9IHRydWVcbiAgcmVwbGFjZUJ5RGlmZiA9IHRydWVcblxuICBnZXROZXdUZXh0ICh0ZXh0KSB7XG4gICAgcmV0dXJuIHRleHQudHJpbSgpXG4gIH1cbn1cblxuY2xhc3MgQ29tcGFjdFNwYWNlcyBleHRlbmRzIFRyYW5zZm9ybVN0cmluZyB7XG4gIGdldE5ld1RleHQgKHRleHQpIHtcbiAgICBpZiAodGV4dC5tYXRjaCgvXlsgXSskLykpIHtcbiAgICAgIHJldHVybiAnICdcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gRG9uJ3QgY29tcGFjdCBmb3IgbGVhZGluZyBhbmQgdHJhaWxpbmcgd2hpdGUgc3BhY2VzLlxuICAgICAgY29uc3QgcmVnZXggPSAvXihcXHMqKSguKj8pKFxccyopJC9nbVxuICAgICAgcmV0dXJuIHRleHQucmVwbGFjZShyZWdleCwgKG0sIGxlYWRpbmcsIG1pZGRsZSwgdHJhaWxpbmcpID0+IHtcbiAgICAgICAgcmV0dXJuIGxlYWRpbmcgKyBtaWRkbGUuc3BsaXQoL1sgXFx0XSsvKS5qb2luKCcgJykgKyB0cmFpbGluZ1xuICAgICAgfSlcbiAgICB9XG4gIH1cbn1cblxuY2xhc3MgQWxpZ25PY2N1cnJlbmNlIGV4dGVuZHMgVHJhbnNmb3JtU3RyaW5nIHtcbiAgb2NjdXJyZW5jZSA9IHRydWVcbiAgd2hpY2hUb1BhZCA9ICdhdXRvJ1xuXG4gIGdldFNlbGVjdGlvblRha2VyICgpIHtcbiAgICBjb25zdCBzZWxlY3Rpb25zQnlSb3cgPSB7fVxuICAgIGZvciAoY29uc3Qgc2VsZWN0aW9uIG9mIHRoaXMuZWRpdG9yLmdldFNlbGVjdGlvbnNPcmRlcmVkQnlCdWZmZXJQb3NpdGlvbigpKSB7XG4gICAgICBjb25zdCByb3cgPSBzZWxlY3Rpb24uZ2V0QnVmZmVyUmFuZ2UoKS5zdGFydC5yb3dcbiAgICAgIGlmICghKHJvdyBpbiBzZWxlY3Rpb25zQnlSb3cpKSBzZWxlY3Rpb25zQnlSb3dbcm93XSA9IFtdXG4gICAgICBzZWxlY3Rpb25zQnlSb3dbcm93XS5wdXNoKHNlbGVjdGlvbilcbiAgICB9XG4gICAgY29uc3QgYWxsUm93cyA9IE9iamVjdC5rZXlzKHNlbGVjdGlvbnNCeVJvdylcbiAgICByZXR1cm4gKCkgPT4gYWxsUm93cy5tYXAocm93ID0+IHNlbGVjdGlvbnNCeVJvd1tyb3ddLnNoaWZ0KCkpLmZpbHRlcihzID0+IHMpXG4gIH1cblxuICBnZXRXaWNoVG9QYWRGb3JUZXh0ICh0ZXh0KSB7XG4gICAgaWYgKHRoaXMud2hpY2hUb1BhZCAhPT0gJ2F1dG8nKSByZXR1cm4gdGhpcy53aGljaFRvUGFkXG5cbiAgICBpZiAoL15cXHMqWz18XVxccyokLy50ZXN0KHRleHQpKSB7XG4gICAgICAvLyBBc2lnbm1lbnQoPSkgYW5kIGB8YChtYXJrZG93bi10YWJsZSBzZXBhcmF0b3IpXG4gICAgICByZXR1cm4gJ3N0YXJ0J1xuICAgIH0gZWxzZSBpZiAoL15cXHMqLFxccyokLy50ZXN0KHRleHQpKSB7XG4gICAgICAvLyBBcmd1bWVudHNcbiAgICAgIHJldHVybiAnZW5kJ1xuICAgIH0gZWxzZSBpZiAoL1xcVyQvLnRlc3QodGV4dCkpIHtcbiAgICAgIC8vIGVuZHMgd2l0aCBub24td29yZC1jaGFyXG4gICAgICByZXR1cm4gJ2VuZCdcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuICdzdGFydCdcbiAgICB9XG4gIH1cblxuICBjYWxjdWxhdGVQYWRkaW5nICgpIHtcbiAgICBjb25zdCB0b3RhbEFtb3VudE9mUGFkZGluZ0J5Um93ID0ge31cbiAgICBjb25zdCBjb2x1bW5Gb3JTZWxlY3Rpb24gPSBzZWxlY3Rpb24gPT4ge1xuICAgICAgY29uc3Qgd2hpY2ggPSB0aGlzLmdldFdpY2hUb1BhZEZvclRleHQoc2VsZWN0aW9uLmdldFRleHQoKSlcbiAgICAgIGNvbnN0IHBvaW50ID0gc2VsZWN0aW9uLmdldEJ1ZmZlclJhbmdlKClbd2hpY2hdXG4gICAgICByZXR1cm4gcG9pbnQuY29sdW1uICsgKHRvdGFsQW1vdW50T2ZQYWRkaW5nQnlSb3dbcG9pbnQucm93XSB8fCAwKVxuICAgIH1cblxuICAgIGNvbnN0IHRha2VTZWxlY3Rpb25zID0gdGhpcy5nZXRTZWxlY3Rpb25UYWtlcigpXG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgIGNvbnN0IHNlbGVjdGlvbnMgPSB0YWtlU2VsZWN0aW9ucygpXG4gICAgICBpZiAoIXNlbGVjdGlvbnMubGVuZ3RoKSByZXR1cm5cbiAgICAgIGNvbnN0IG1heENvbHVtbiA9IHNlbGVjdGlvbnMubWFwKGNvbHVtbkZvclNlbGVjdGlvbikucmVkdWNlKChtYXgsIGN1cikgPT4gKGN1ciA+IG1heCA/IGN1ciA6IG1heCkpXG4gICAgICBmb3IgKGNvbnN0IHNlbGVjdGlvbiBvZiBzZWxlY3Rpb25zKSB7XG4gICAgICAgIGNvbnN0IHJvdyA9IHNlbGVjdGlvbi5nZXRCdWZmZXJSYW5nZSgpLnN0YXJ0LnJvd1xuICAgICAgICBjb25zdCBhbW91bnRPZlBhZGRpbmcgPSBtYXhDb2x1bW4gLSBjb2x1bW5Gb3JTZWxlY3Rpb24oc2VsZWN0aW9uKVxuICAgICAgICB0b3RhbEFtb3VudE9mUGFkZGluZ0J5Um93W3Jvd10gPSAodG90YWxBbW91bnRPZlBhZGRpbmdCeVJvd1tyb3ddIHx8IDApICsgYW1vdW50T2ZQYWRkaW5nXG4gICAgICAgIHRoaXMuYW1vdW50T2ZQYWRkaW5nQnlTZWxlY3Rpb24uc2V0KHNlbGVjdGlvbiwgYW1vdW50T2ZQYWRkaW5nKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGV4ZWN1dGUgKCkge1xuICAgIHRoaXMuYW1vdW50T2ZQYWRkaW5nQnlTZWxlY3Rpb24gPSBuZXcgTWFwKClcbiAgICB0aGlzLm9uRGlkU2VsZWN0VGFyZ2V0KCgpID0+IHtcbiAgICAgIHRoaXMuY2FsY3VsYXRlUGFkZGluZygpXG4gICAgfSlcbiAgICBzdXBlci5leGVjdXRlKClcbiAgfVxuXG4gIGdldE5ld1RleHQgKHRleHQsIHNlbGVjdGlvbikge1xuICAgIGNvbnN0IHBhZGRpbmcgPSAnICcucmVwZWF0KHRoaXMuYW1vdW50T2ZQYWRkaW5nQnlTZWxlY3Rpb24uZ2V0KHNlbGVjdGlvbikpXG4gICAgY29uc3Qgd2hpY2hUb1BhZCA9IHRoaXMuZ2V0V2ljaFRvUGFkRm9yVGV4dChzZWxlY3Rpb24uZ2V0VGV4dCgpKVxuICAgIHJldHVybiB3aGljaFRvUGFkID09PSAnc3RhcnQnID8gcGFkZGluZyArIHRleHQgOiB0ZXh0ICsgcGFkZGluZ1xuICB9XG59XG5cbmNsYXNzIEFsaWduT2NjdXJyZW5jZUJ5UGFkTGVmdCBleHRlbmRzIEFsaWduT2NjdXJyZW5jZSB7XG4gIHdoaWNoVG9QYWQgPSAnc3RhcnQnXG59XG5cbmNsYXNzIEFsaWduT2NjdXJyZW5jZUJ5UGFkUmlnaHQgZXh0ZW5kcyBBbGlnbk9jY3VycmVuY2Uge1xuICB3aGljaFRvUGFkID0gJ2VuZCdcbn1cblxuY2xhc3MgUmVtb3ZlTGVhZGluZ1doaXRlU3BhY2VzIGV4dGVuZHMgVHJhbnNmb3JtU3RyaW5nIHtcbiAgd2lzZSA9ICdsaW5ld2lzZSdcbiAgZ2V0TmV3VGV4dCAodGV4dCwgc2VsZWN0aW9uKSB7XG4gICAgY29uc3QgdHJpbUxlZnQgPSB0ZXh0ID0+IHRleHQudHJpbUxlZnQoKVxuICAgIHJldHVybiAoXG4gICAgICB0aGlzLnV0aWxzXG4gICAgICAgIC5zcGxpdFRleHRCeU5ld0xpbmUodGV4dClcbiAgICAgICAgLm1hcCh0cmltTGVmdClcbiAgICAgICAgLmpvaW4oJ1xcbicpICsgJ1xcbidcbiAgICApXG4gIH1cbn1cblxuY2xhc3MgQ29udmVydFRvU29mdFRhYiBleHRlbmRzIFRyYW5zZm9ybVN0cmluZyB7XG4gIHN0YXRpYyBkaXNwbGF5TmFtZSA9ICdTb2Z0IFRhYidcbiAgd2lzZSA9ICdsaW5ld2lzZSdcblxuICBtdXRhdGVTZWxlY3Rpb24gKHNlbGVjdGlvbikge1xuICAgIHRoaXMuc2NhbkVkaXRvcignZm9yd2FyZCcsIC9cXHQvZywge3NjYW5SYW5nZTogc2VsZWN0aW9uLmdldEJ1ZmZlclJhbmdlKCl9LCAoe3JhbmdlLCByZXBsYWNlfSkgPT4ge1xuICAgICAgLy8gUmVwbGFjZSBcXHQgdG8gc3BhY2VzIHdoaWNoIGxlbmd0aCBpcyB2YXJ5IGRlcGVuZGluZyBvbiB0YWJTdG9wIGFuZCB0YWJMZW5naHRcbiAgICAgIC8vIFNvIHdlIGRpcmVjdGx5IGNvbnN1bHQgaXQncyBzY3JlZW4gcmVwcmVzZW50aW5nIGxlbmd0aC5cbiAgICAgIGNvbnN0IGxlbmd0aCA9IHRoaXMuZWRpdG9yLnNjcmVlblJhbmdlRm9yQnVmZmVyUmFuZ2UocmFuZ2UpLmdldEV4dGVudCgpLmNvbHVtblxuICAgICAgcmVwbGFjZSgnICcucmVwZWF0KGxlbmd0aCkpXG4gICAgfSlcbiAgfVxufVxuXG5jbGFzcyBDb252ZXJ0VG9IYXJkVGFiIGV4dGVuZHMgVHJhbnNmb3JtU3RyaW5nIHtcbiAgc3RhdGljIGRpc3BsYXlOYW1lID0gJ0hhcmQgVGFiJ1xuXG4gIG11dGF0ZVNlbGVjdGlvbiAoc2VsZWN0aW9uKSB7XG4gICAgY29uc3QgdGFiTGVuZ3RoID0gdGhpcy5lZGl0b3IuZ2V0VGFiTGVuZ3RoKClcbiAgICB0aGlzLnNjYW5FZGl0b3IoJ2ZvcndhcmQnLCAvWyBcXHRdKy9nLCB7c2NhblJhbmdlOiBzZWxlY3Rpb24uZ2V0QnVmZmVyUmFuZ2UoKX0sICh7cmFuZ2UsIHJlcGxhY2V9KSA9PiB7XG4gICAgICBjb25zdCB7c3RhcnQsIGVuZH0gPSB0aGlzLmVkaXRvci5zY3JlZW5SYW5nZUZvckJ1ZmZlclJhbmdlKHJhbmdlKVxuICAgICAgbGV0IHN0YXJ0Q29sdW1uID0gc3RhcnQuY29sdW1uXG4gICAgICBjb25zdCBlbmRDb2x1bW4gPSBlbmQuY29sdW1uXG5cbiAgICAgIC8vIFdlIGNhbid0IG5haXZlbHkgcmVwbGFjZSBzcGFjZXMgdG8gdGFiLCB3ZSBoYXZlIHRvIGNvbnNpZGVyIHZhbGlkIHRhYlN0b3AgY29sdW1uXG4gICAgICAvLyBJZiBuZXh0VGFiU3RvcCBjb2x1bW4gZXhjZWVkcyByZXBsYWNhYmxlIHJhbmdlLCB3ZSBwYWQgd2l0aCBzcGFjZXMuXG4gICAgICBsZXQgbmV3VGV4dCA9ICcnXG4gICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICBjb25zdCByZW1haW5kZXIgPSBzdGFydENvbHVtbiAlIHRhYkxlbmd0aFxuICAgICAgICBjb25zdCBuZXh0VGFiU3RvcCA9IHN0YXJ0Q29sdW1uICsgKHJlbWFpbmRlciA9PT0gMCA/IHRhYkxlbmd0aCA6IHJlbWFpbmRlcilcbiAgICAgICAgaWYgKG5leHRUYWJTdG9wID4gZW5kQ29sdW1uKSB7XG4gICAgICAgICAgbmV3VGV4dCArPSAnICcucmVwZWF0KGVuZENvbHVtbiAtIHN0YXJ0Q29sdW1uKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG5ld1RleHQgKz0gJ1xcdCdcbiAgICAgICAgfVxuICAgICAgICBzdGFydENvbHVtbiA9IG5leHRUYWJTdG9wXG4gICAgICAgIGlmIChzdGFydENvbHVtbiA+PSBlbmRDb2x1bW4pIHtcbiAgICAgICAgICBicmVha1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJlcGxhY2UobmV3VGV4dClcbiAgICB9KVxuICB9XG59XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmNsYXNzIFRyYW5zZm9ybVN0cmluZ0J5RXh0ZXJuYWxDb21tYW5kIGV4dGVuZHMgVHJhbnNmb3JtU3RyaW5nIHtcbiAgc3RhdGljIGNvbW1hbmQgPSBmYWxzZVxuICBhdXRvSW5kZW50ID0gdHJ1ZVxuICBjb21tYW5kID0gJycgLy8gZS5nLiBjb21tYW5kOiAnc29ydCdcbiAgYXJncyA9IFtdIC8vIGUuZyBhcmdzOiBbJy1ybiddXG5cbiAgLy8gTk9URTogVW5saWtlIG90aGVyIGNsYXNzLCBmaXJzdCBhcmcgaXMgYHN0ZG91dGAgb2YgZXh0ZXJuYWwgY29tbWFuZHMuXG4gIGdldE5ld1RleHQgKHRleHQsIHNlbGVjdGlvbikge1xuICAgIHJldHVybiB0ZXh0IHx8IHNlbGVjdGlvbi5nZXRUZXh0KClcbiAgfVxuICBnZXRDb21tYW5kIChzZWxlY3Rpb24pIHtcbiAgICByZXR1cm4ge2NvbW1hbmQ6IHRoaXMuY29tbWFuZCwgYXJnczogdGhpcy5hcmdzfVxuICB9XG4gIGdldFN0ZGluIChzZWxlY3Rpb24pIHtcbiAgICByZXR1cm4gc2VsZWN0aW9uLmdldFRleHQoKVxuICB9XG5cbiAgYXN5bmMgZXhlY3V0ZSAoKSB7XG4gICAgdGhpcy5wcmVTZWxlY3QoKVxuXG4gICAgaWYgKHRoaXMuc2VsZWN0VGFyZ2V0KCkpIHtcbiAgICAgIGZvciAoY29uc3Qgc2VsZWN0aW9uIG9mIHRoaXMuZWRpdG9yLmdldFNlbGVjdGlvbnMoKSkge1xuICAgICAgICBjb25zdCB7Y29tbWFuZCwgYXJnc30gPSB0aGlzLmdldENvbW1hbmQoc2VsZWN0aW9uKSB8fCB7fVxuICAgICAgICBpZiAoY29tbWFuZCA9PSBudWxsIHx8IGFyZ3MgPT0gbnVsbCkgY29udGludWVcblxuICAgICAgICBjb25zdCBzdGRvdXQgPSBhd2FpdCB0aGlzLnJ1bkV4dGVybmFsQ29tbWFuZCh7Y29tbWFuZCwgYXJncywgc3RkaW46IHRoaXMuZ2V0U3RkaW4oc2VsZWN0aW9uKX0pXG4gICAgICAgIHNlbGVjdGlvbi5pbnNlcnRUZXh0KHRoaXMuZ2V0TmV3VGV4dChzdGRvdXQsIHNlbGVjdGlvbiksIHthdXRvSW5kZW50OiB0aGlzLmF1dG9JbmRlbnR9KVxuICAgICAgfVxuICAgICAgdGhpcy5tdXRhdGlvbk1hbmFnZXIuc2V0Q2hlY2twb2ludCgnZGlkLWZpbmlzaCcpXG4gICAgICB0aGlzLnJlc3RvcmVDdXJzb3JQb3NpdGlvbnNJZk5lY2Vzc2FyeSgpXG4gICAgfVxuICAgIHRoaXMucG9zdE11dGF0ZSgpXG4gIH1cblxuICBydW5FeHRlcm5hbENvbW1hbmQgKG9wdGlvbnMpIHtcbiAgICBsZXQgb3V0cHV0ID0gJydcbiAgICBvcHRpb25zLnN0ZG91dCA9IGRhdGEgPT4gKG91dHB1dCArPSBkYXRhKVxuICAgIGNvbnN0IGV4aXRQcm9taXNlID0gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICBvcHRpb25zLmV4aXQgPSAoKSA9PiByZXNvbHZlKG91dHB1dClcbiAgICB9KVxuICAgIGNvbnN0IHtzdGRpbn0gPSBvcHRpb25zXG4gICAgZGVsZXRlIG9wdGlvbnMuc3RkaW5cbiAgICBjb25zdCBidWZmZXJlZFByb2Nlc3MgPSBuZXcgQnVmZmVyZWRQcm9jZXNzKG9wdGlvbnMpXG4gICAgYnVmZmVyZWRQcm9jZXNzLm9uV2lsbFRocm93RXJyb3IoKHtlcnJvciwgaGFuZGxlfSkgPT4ge1xuICAgICAgLy8gU3VwcHJlc3MgY29tbWFuZCBub3QgZm91bmQgZXJyb3IgaW50ZW50aW9uYWxseS5cbiAgICAgIGlmIChlcnJvci5jb2RlID09PSAnRU5PRU5UJyAmJiBlcnJvci5zeXNjYWxsLmluZGV4T2YoJ3NwYXduJykgPT09IDApIHtcbiAgICAgICAgY29uc29sZS5sb2coYCR7dGhpcy5nZXRDb21tYW5kTmFtZSgpfTogRmFpbGVkIHRvIHNwYXduIGNvbW1hbmQgJHtlcnJvci5wYXRofS5gKVxuICAgICAgICBoYW5kbGUoKVxuICAgICAgfVxuICAgICAgdGhpcy5jYW5jZWxPcGVyYXRpb24oKVxuICAgIH0pXG5cbiAgICBpZiAoc3RkaW4pIHtcbiAgICAgIGJ1ZmZlcmVkUHJvY2Vzcy5wcm9jZXNzLnN0ZGluLndyaXRlKHN0ZGluKVxuICAgICAgYnVmZmVyZWRQcm9jZXNzLnByb2Nlc3Muc3RkaW4uZW5kKClcbiAgICB9XG4gICAgcmV0dXJuIGV4aXRQcm9taXNlXG4gIH1cbn1cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuY2xhc3MgVHJhbnNmb3JtU3RyaW5nQnlTZWxlY3RMaXN0IGV4dGVuZHMgVHJhbnNmb3JtU3RyaW5nIHtcbiAgdGFyZ2V0ID0gJ0VtcHR5J1xuICByZWNvcmRhYmxlID0gZmFsc2VcblxuICBzdGF0aWMgZ2V0U2VsZWN0TGlzdEl0ZW1zICgpIHtcbiAgICBpZiAoIXRoaXMuc2VsZWN0TGlzdEl0ZW1zKSB7XG4gICAgICB0aGlzLnNlbGVjdExpc3RJdGVtcyA9IHRoaXMuc3RyaW5nVHJhbnNmb3JtZXJzLm1hcChrbGFzcyA9PiB7XG4gICAgICAgIGNvbnN0IHN1ZmZpeCA9IGtsYXNzLmhhc093blByb3BlcnR5KCdkaXNwbGF5TmFtZVN1ZmZpeCcpID8gJyAnICsga2xhc3MuZGlzcGxheU5hbWVTdWZmaXggOiAnJ1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAga2xhc3M6IGtsYXNzLFxuICAgICAgICAgIGRpc3BsYXlOYW1lOiBrbGFzcy5oYXNPd25Qcm9wZXJ0eSgnZGlzcGxheU5hbWUnKVxuICAgICAgICAgICAgPyBrbGFzcy5kaXNwbGF5TmFtZSArIHN1ZmZpeFxuICAgICAgICAgICAgOiB0aGlzLl8uaHVtYW5pemVFdmVudE5hbWUodGhpcy5fLmRhc2hlcml6ZShrbGFzcy5uYW1lKSkgKyBzdWZmaXhcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuc2VsZWN0TGlzdEl0ZW1zXG4gIH1cblxuICBzZWxlY3RJdGVtcyAoKSB7XG4gICAgaWYgKCFzZWxlY3RMaXN0KSB7XG4gICAgICBjb25zdCBTZWxlY3RMaXN0ID0gcmVxdWlyZSgnLi9zZWxlY3QtbGlzdCcpXG4gICAgICBzZWxlY3RMaXN0ID0gbmV3IFNlbGVjdExpc3QoKVxuICAgIH1cbiAgICByZXR1cm4gc2VsZWN0TGlzdC5zZWxlY3RGcm9tSXRlbXModGhpcy5jb25zdHJ1Y3Rvci5nZXRTZWxlY3RMaXN0SXRlbXMoKSlcbiAgfVxuXG4gIGFzeW5jIGV4ZWN1dGUgKCkge1xuICAgIGNvbnN0IGl0ZW0gPSBhd2FpdCB0aGlzLnNlbGVjdEl0ZW1zKClcbiAgICBpZiAoaXRlbSkge1xuICAgICAgdGhpcy52aW1TdGF0ZS5vcGVyYXRpb25TdGFjay5ydW5OZXh0KGl0ZW0ua2xhc3MsIHt0YXJnZXQ6IHRoaXMubmV4dFRhcmdldH0pXG4gICAgfVxuICB9XG59XG5cbmNsYXNzIFRyYW5zZm9ybVdvcmRCeVNlbGVjdExpc3QgZXh0ZW5kcyBUcmFuc2Zvcm1TdHJpbmdCeVNlbGVjdExpc3Qge1xuICBuZXh0VGFyZ2V0ID0gJ0lubmVyV29yZCdcbn1cblxuY2xhc3MgVHJhbnNmb3JtU21hcnRXb3JkQnlTZWxlY3RMaXN0IGV4dGVuZHMgVHJhbnNmb3JtU3RyaW5nQnlTZWxlY3RMaXN0IHtcbiAgbmV4dFRhcmdldCA9ICdJbm5lclNtYXJ0V29yZCdcbn1cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuY2xhc3MgUmVwbGFjZVdpdGhSZWdpc3RlciBleHRlbmRzIFRyYW5zZm9ybVN0cmluZyB7XG4gIGZsYXNoVHlwZSA9ICdvcGVyYXRvci1sb25nJ1xuXG4gIGluaXRpYWxpemUgKCkge1xuICAgIHRoaXMudmltU3RhdGUuc2VxdWVudGlhbFBhc3RlTWFuYWdlci5vbkluaXRpYWxpemUodGhpcylcbiAgICBzdXBlci5pbml0aWFsaXplKClcbiAgfVxuXG4gIGV4ZWN1dGUgKCkge1xuICAgIHRoaXMuc2VxdWVudGlhbFBhc3RlID0gdGhpcy52aW1TdGF0ZS5zZXF1ZW50aWFsUGFzdGVNYW5hZ2VyLm9uRXhlY3V0ZSh0aGlzKVxuXG4gICAgc3VwZXIuZXhlY3V0ZSgpXG5cbiAgICBmb3IgKGNvbnN0IHNlbGVjdGlvbiBvZiB0aGlzLmVkaXRvci5nZXRTZWxlY3Rpb25zKCkpIHtcbiAgICAgIGNvbnN0IHJhbmdlID0gdGhpcy5tdXRhdGlvbk1hbmFnZXIuZ2V0TXV0YXRlZEJ1ZmZlclJhbmdlRm9yU2VsZWN0aW9uKHNlbGVjdGlvbilcbiAgICAgIHRoaXMudmltU3RhdGUuc2VxdWVudGlhbFBhc3RlTWFuYWdlci5zYXZlUGFzdGVkUmFuZ2VGb3JTZWxlY3Rpb24oc2VsZWN0aW9uLCByYW5nZSlcbiAgICB9XG4gIH1cblxuICBnZXROZXdUZXh0ICh0ZXh0LCBzZWxlY3Rpb24pIHtcbiAgICBjb25zdCB2YWx1ZSA9IHRoaXMudmltU3RhdGUucmVnaXN0ZXIuZ2V0KG51bGwsIHNlbGVjdGlvbiwgdGhpcy5zZXF1ZW50aWFsUGFzdGUpXG4gICAgcmV0dXJuIHZhbHVlID8gdmFsdWUudGV4dCA6ICcnXG4gIH1cbn1cblxuY2xhc3MgUmVwbGFjZU9jY3VycmVuY2VXaXRoUmVnaXN0ZXIgZXh0ZW5kcyBSZXBsYWNlV2l0aFJlZ2lzdGVyIHtcbiAgb2NjdXJyZW5jZSA9IHRydWVcbn1cblxuLy8gU2F2ZSB0ZXh0IHRvIHJlZ2lzdGVyIGJlZm9yZSByZXBsYWNlXG5jbGFzcyBTd2FwV2l0aFJlZ2lzdGVyIGV4dGVuZHMgVHJhbnNmb3JtU3RyaW5nIHtcbiAgZ2V0TmV3VGV4dCAodGV4dCwgc2VsZWN0aW9uKSB7XG4gICAgY29uc3QgbmV3VGV4dCA9IHRoaXMudmltU3RhdGUucmVnaXN0ZXIuZ2V0VGV4dCgpXG4gICAgdGhpcy5zZXRUZXh0VG9SZWdpc3Rlcih0ZXh0LCBzZWxlY3Rpb24pXG4gICAgcmV0dXJuIG5ld1RleHRcbiAgfVxufVxuXG4vLyBJbmRlbnQgPCBUcmFuc2Zvcm1TdHJpbmdcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmNsYXNzIEluZGVudCBleHRlbmRzIFRyYW5zZm9ybVN0cmluZyB7XG4gIHN0YXlCeU1hcmtlciA9IHRydWVcbiAgc2V0VG9GaXJzdENoYXJhY3Rlck9uTGluZXdpc2UgPSB0cnVlXG4gIHdpc2UgPSAnbGluZXdpc2UnXG5cbiAgbXV0YXRlU2VsZWN0aW9uIChzZWxlY3Rpb24pIHtcbiAgICAvLyBOZWVkIGNvdW50IHRpbWVzIGluZGVudGF0aW9uIGluIHZpc3VhbC1tb2RlIGFuZCBpdHMgcmVwZWF0KGAuYCkuXG4gICAgaWYgKHRoaXMudGFyZ2V0Lm5hbWUgPT09ICdDdXJyZW50U2VsZWN0aW9uJykge1xuICAgICAgbGV0IG9sZFRleHRcbiAgICAgIC8vIGxpbWl0IHRvIDEwMCB0byBhdm9pZCBmcmVlemluZyBieSBhY2NpZGVudGFsIGJpZyBudW1iZXIuXG4gICAgICB0aGlzLmNvdW50VGltZXModGhpcy5saW1pdE51bWJlcih0aGlzLmdldENvdW50KCksIHttYXg6IDEwMH0pLCAoe3N0b3B9KSA9PiB7XG4gICAgICAgIG9sZFRleHQgPSBzZWxlY3Rpb24uZ2V0VGV4dCgpXG4gICAgICAgIHRoaXMuaW5kZW50KHNlbGVjdGlvbilcbiAgICAgICAgaWYgKHNlbGVjdGlvbi5nZXRUZXh0KCkgPT09IG9sZFRleHQpIHN0b3AoKVxuICAgICAgfSlcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5pbmRlbnQoc2VsZWN0aW9uKVxuICAgIH1cbiAgfVxuXG4gIGluZGVudCAoc2VsZWN0aW9uKSB7XG4gICAgc2VsZWN0aW9uLmluZGVudFNlbGVjdGVkUm93cygpXG4gIH1cbn1cblxuY2xhc3MgT3V0ZGVudCBleHRlbmRzIEluZGVudCB7XG4gIGluZGVudCAoc2VsZWN0aW9uKSB7XG4gICAgc2VsZWN0aW9uLm91dGRlbnRTZWxlY3RlZFJvd3MoKVxuICB9XG59XG5cbmNsYXNzIEF1dG9JbmRlbnQgZXh0ZW5kcyBJbmRlbnQge1xuICBpbmRlbnQgKHNlbGVjdGlvbikge1xuICAgIHNlbGVjdGlvbi5hdXRvSW5kZW50U2VsZWN0ZWRSb3dzKClcbiAgfVxufVxuXG5jbGFzcyBUb2dnbGVMaW5lQ29tbWVudHMgZXh0ZW5kcyBUcmFuc2Zvcm1TdHJpbmcge1xuICBmbGFzaFRhcmdldCA9IGZhbHNlXG4gIHN0YXlCeU1hcmtlciA9IHRydWVcbiAgc3RheUF0U2FtZVBvc2l0aW9uID0gdHJ1ZVxuICB3aXNlID0gJ2xpbmV3aXNlJ1xuXG4gIG11dGF0ZVNlbGVjdGlvbiAoc2VsZWN0aW9uKSB7XG4gICAgc2VsZWN0aW9uLnRvZ2dsZUxpbmVDb21tZW50cygpXG4gIH1cbn1cblxuY2xhc3MgUmVmbG93IGV4dGVuZHMgVHJhbnNmb3JtU3RyaW5nIHtcbiAgbXV0YXRlU2VsZWN0aW9uIChzZWxlY3Rpb24pIHtcbiAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKHRoaXMuZWRpdG9yRWxlbWVudCwgJ2F1dG9mbG93OnJlZmxvdy1zZWxlY3Rpb24nKVxuICB9XG59XG5cbmNsYXNzIFJlZmxvd1dpdGhTdGF5IGV4dGVuZHMgUmVmbG93IHtcbiAgc3RheUF0U2FtZVBvc2l0aW9uID0gdHJ1ZVxufVxuXG4vLyBTdXJyb3VuZCA8IFRyYW5zZm9ybVN0cmluZ1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuY2xhc3MgU3Vycm91bmRCYXNlIGV4dGVuZHMgVHJhbnNmb3JtU3RyaW5nIHtcbiAgc3RhdGljIGNvbW1hbmQgPSBmYWxzZVxuICBzdXJyb3VuZEFjdGlvbiA9IG51bGxcbiAgcGFpcnNCeUFsaWFzID0ge1xuICAgICcoJzogWycoJywgJyknXSxcbiAgICAnKSc6IFsnKCcsICcpJ10sXG4gICAgJ3snOiBbJ3snLCAnfSddLFxuICAgICd9JzogWyd7JywgJ30nXSxcbiAgICAnWyc6IFsnWycsICddJ10sXG4gICAgJ10nOiBbJ1snLCAnXSddLFxuICAgICc8JzogWyc8JywgJz4nXSxcbiAgICAnPic6IFsnPCcsICc+J10sXG4gICAgYjogWycoJywgJyknXSxcbiAgICBCOiBbJ3snLCAnfSddLFxuICAgIHI6IFsnWycsICddJ10sXG4gICAgYTogWyc8JywgJz4nXVxuICB9XG5cbiAgaW5pdGlhbGl6ZSAoKSB7XG4gICAgdGhpcy5yZXBsYWNlQnlEaWZmID0gdGhpcy5nZXRDb25maWcoJ3JlcGxhY2VCeURpZmZPblN1cnJvdW5kJylcbiAgICB0aGlzLnN0YXlCeU1hcmtlciA9IHRoaXMucmVwbGFjZUJ5RGlmZlxuICAgIHN1cGVyLmluaXRpYWxpemUoKVxuICB9XG5cbiAgZ2V0UGFpciAoY2hhcikge1xuICAgIGNvbnN0IHVzZXJDb25maWcgPSB0aGlzLmdldENvbmZpZygnY3VzdG9tU3Vycm91bmRQYWlycycpXG4gICAgY29uc3QgY3VzdG9tUGFpckJ5QWxpYXMgPSBKU09OLnBhcnNlKHVzZXJDb25maWcpIHx8IHt9XG4gICAgcmV0dXJuIGN1c3RvbVBhaXJCeUFsaWFzW2NoYXJdIHx8IHRoaXMucGFpcnNCeUFsaWFzW2NoYXJdIHx8IFtjaGFyLCBjaGFyXVxuICB9XG5cbiAgc3Vycm91bmQgKHRleHQsIGNoYXIsIHtrZWVwTGF5b3V0ID0gZmFsc2UsIHNlbGVjdGlvbn0gPSB7fSkge1xuICAgIGxldCBbb3BlbiwgY2xvc2UsIGFkZFNwYWNlXSA9IHRoaXMuZ2V0UGFpcihjaGFyKVxuICAgIGlmICgha2VlcExheW91dCAmJiB0ZXh0LmVuZHNXaXRoKCdcXG4nKSkge1xuICAgICAgY29uc3QgYmFzZUluZGVudExldmVsID0gdGhpcy5lZGl0b3IuaW5kZW50YXRpb25Gb3JCdWZmZXJSb3coc2VsZWN0aW9uLmdldEJ1ZmZlclJhbmdlKCkuc3RhcnQucm93KVxuICAgICAgY29uc3QgaW5kZW50VGV4dFN0YXJ0Um93ID0gdGhpcy5lZGl0b3IuYnVpbGRJbmRlbnRTdHJpbmcoYmFzZUluZGVudExldmVsKVxuICAgICAgY29uc3QgaW5kZW50VGV4dE9uZUxldmVsID0gdGhpcy5lZGl0b3IuYnVpbGRJbmRlbnRTdHJpbmcoMSlcblxuICAgICAgb3BlbiA9IGluZGVudFRleHRTdGFydFJvdyArIG9wZW4gKyAnXFxuJ1xuICAgICAgdGV4dCA9IHRleHQucmVwbGFjZSgvXiguKykkL2dtLCBtID0+IGluZGVudFRleHRPbmVMZXZlbCArIG0pXG4gICAgICBjbG9zZSA9IGluZGVudFRleHRTdGFydFJvdyArIGNsb3NlICsgJ1xcbidcbiAgICB9XG5cbiAgICBpZiAodGhpcy51dGlscy5pc1NpbmdsZUxpbmVUZXh0KHRleHQpKSB7XG4gICAgICBpZiAoYWRkU3BhY2UgfHwgdGhpcy5nZXRDb25maWcoJ2NoYXJhY3RlcnNUb0FkZFNwYWNlT25TdXJyb3VuZCcpLmluY2x1ZGVzKGNoYXIpKSB7XG4gICAgICAgIHRleHQgPSAnICcgKyB0ZXh0ICsgJyAnXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvcGVuICsgdGV4dCArIGNsb3NlXG4gIH1cblxuICBnZXRUYXJnZXRQYWlyICgpIHtcbiAgICBpZiAodGhpcy50YXJnZXQpIHtcbiAgICAgIHJldHVybiB0aGlzLnRhcmdldC5wYWlyXG4gICAgfVxuICB9XG5cbiAgZGVsZXRlU3Vycm91bmQgKHRleHQpIHtcbiAgICBjb25zdCBbb3BlbiwgY2xvc2VdID0gdGhpcy5nZXRUYXJnZXRQYWlyKCkgfHwgW3RleHRbMF0sIHRleHRbdGV4dC5sZW5ndGggLSAxXV1cbiAgICBjb25zdCBpbm5lclRleHQgPSB0ZXh0LnNsaWNlKG9wZW4ubGVuZ3RoLCB0ZXh0Lmxlbmd0aCAtIGNsb3NlLmxlbmd0aClcbiAgICByZXR1cm4gdGhpcy51dGlscy5pc1NpbmdsZUxpbmVUZXh0KHRleHQpICYmIG9wZW4gIT09IGNsb3NlID8gaW5uZXJUZXh0LnRyaW0oKSA6IGlubmVyVGV4dFxuICB9XG5cbiAgZ2V0TmV3VGV4dCAodGV4dCwgc2VsZWN0aW9uKSB7XG4gICAgaWYgKHRoaXMuc3Vycm91bmRBY3Rpb24gPT09ICdzdXJyb3VuZCcpIHtcbiAgICAgIHJldHVybiB0aGlzLnN1cnJvdW5kKHRleHQsIHRoaXMuaW5wdXQsIHtzZWxlY3Rpb259KVxuICAgIH0gZWxzZSBpZiAodGhpcy5zdXJyb3VuZEFjdGlvbiA9PT0gJ2RlbGV0ZS1zdXJyb3VuZCcpIHtcbiAgICAgIHJldHVybiB0aGlzLmRlbGV0ZVN1cnJvdW5kKHRleHQpXG4gICAgfSBlbHNlIGlmICh0aGlzLnN1cnJvdW5kQWN0aW9uID09PSAnY2hhbmdlLXN1cnJvdW5kJykge1xuICAgICAgcmV0dXJuIHRoaXMuc3Vycm91bmQodGhpcy5kZWxldGVTdXJyb3VuZCh0ZXh0KSwgdGhpcy5pbnB1dCwge2tlZXBMYXlvdXQ6IHRydWV9KVxuICAgIH1cbiAgfVxufVxuXG5jbGFzcyBTdXJyb3VuZCBleHRlbmRzIFN1cnJvdW5kQmFzZSB7XG4gIHN1cnJvdW5kQWN0aW9uID0gJ3N1cnJvdW5kJ1xuICByZWFkSW5wdXRBZnRlclNlbGVjdCA9IHRydWVcbn1cblxuY2xhc3MgU3Vycm91bmRXb3JkIGV4dGVuZHMgU3Vycm91bmQge1xuICB0YXJnZXQgPSAnSW5uZXJXb3JkJ1xufVxuXG5jbGFzcyBTdXJyb3VuZFNtYXJ0V29yZCBleHRlbmRzIFN1cnJvdW5kIHtcbiAgdGFyZ2V0ID0gJ0lubmVyU21hcnRXb3JkJ1xufVxuXG5jbGFzcyBNYXBTdXJyb3VuZCBleHRlbmRzIFN1cnJvdW5kIHtcbiAgb2NjdXJyZW5jZSA9IHRydWVcbiAgcGF0dGVybkZvck9jY3VycmVuY2UgPSAvXFx3Ky9nXG59XG5cbi8vIERlbGV0ZSBTdXJyb3VuZFxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuY2xhc3MgRGVsZXRlU3Vycm91bmQgZXh0ZW5kcyBTdXJyb3VuZEJhc2Uge1xuICBzdXJyb3VuZEFjdGlvbiA9ICdkZWxldGUtc3Vycm91bmQnXG4gIGluaXRpYWxpemUgKCkge1xuICAgIGlmICghdGhpcy50YXJnZXQpIHtcbiAgICAgIHRoaXMuZm9jdXNJbnB1dCh7XG4gICAgICAgIG9uQ29uZmlybTogY2hhciA9PiB7XG4gICAgICAgICAgdGhpcy5zZXRUYXJnZXQodGhpcy5nZXRJbnN0YW5jZSgnQVBhaXInLCB7cGFpcjogdGhpcy5nZXRQYWlyKGNoYXIpfSkpXG4gICAgICAgICAgdGhpcy5wcm9jZXNzT3BlcmF0aW9uKClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG4gICAgc3VwZXIuaW5pdGlhbGl6ZSgpXG4gIH1cbn1cblxuY2xhc3MgRGVsZXRlU3Vycm91bmRBbnlQYWlyIGV4dGVuZHMgRGVsZXRlU3Vycm91bmQge1xuICB0YXJnZXQgPSAnQUFueVBhaXInXG59XG5cbmNsYXNzIERlbGV0ZVN1cnJvdW5kQW55UGFpckFsbG93Rm9yd2FyZGluZyBleHRlbmRzIERlbGV0ZVN1cnJvdW5kQW55UGFpciB7XG4gIHRhcmdldCA9ICdBQW55UGFpckFsbG93Rm9yd2FyZGluZydcbn1cblxuLy8gQ2hhbmdlIFN1cnJvdW5kXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5jbGFzcyBDaGFuZ2VTdXJyb3VuZCBleHRlbmRzIERlbGV0ZVN1cnJvdW5kIHtcbiAgc3Vycm91bmRBY3Rpb24gPSAnY2hhbmdlLXN1cnJvdW5kJ1xuICByZWFkSW5wdXRBZnRlclNlbGVjdCA9IHRydWVcblxuICAvLyBPdmVycmlkZSB0byBzaG93IGNoYW5naW5nIGNoYXIgb24gaG92ZXJcbiAgYXN5bmMgZm9jdXNJbnB1dFByb21pc2VkICguLi5hcmdzKSB7XG4gICAgY29uc3QgaG92ZXJQb2ludCA9IHRoaXMubXV0YXRpb25NYW5hZ2VyLmdldEluaXRpYWxQb2ludEZvclNlbGVjdGlvbih0aGlzLmVkaXRvci5nZXRMYXN0U2VsZWN0aW9uKCkpXG4gICAgY29uc3Qgb3BlblN1cnJvbmRUZXh0ID0gdGhpcy5nZXRUYXJnZXRQYWlyKCkgPyB0aGlzLmdldFRhcmdldFBhaXIoKVswXSA6IHRoaXMuZWRpdG9yLmdldFNlbGVjdGVkVGV4dCgpWzBdXG4gICAgdGhpcy52aW1TdGF0ZS5ob3Zlci5zZXQob3BlblN1cnJvbmRUZXh0LCBob3ZlclBvaW50KVxuICAgIHJldHVybiBzdXBlci5mb2N1c0lucHV0UHJvbWlzZWQoLi4uYXJncylcbiAgfVxufVxuXG5jbGFzcyBDaGFuZ2VTdXJyb3VuZEFueVBhaXIgZXh0ZW5kcyBDaGFuZ2VTdXJyb3VuZCB7XG4gIHRhcmdldCA9ICdBQW55UGFpcidcbn1cblxuY2xhc3MgQ2hhbmdlU3Vycm91bmRBbnlQYWlyQWxsb3dGb3J3YXJkaW5nIGV4dGVuZHMgQ2hhbmdlU3Vycm91bmRBbnlQYWlyIHtcbiAgdGFyZ2V0ID0gJ0FBbnlQYWlyQWxsb3dGb3J3YXJkaW5nJ1xufVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBGSVhNRVxuLy8gQ3VycmVudGx5IG5hdGl2ZSBlZGl0b3Iuam9pbkxpbmVzKCkgaXMgYmV0dGVyIGZvciBjdXJzb3IgcG9zaXRpb24gc2V0dGluZ1xuLy8gU28gSSB1c2UgbmF0aXZlIG1ldGhvZHMgZm9yIGEgbWVhbndoaWxlLlxuY2xhc3MgSm9pblRhcmdldCBleHRlbmRzIFRyYW5zZm9ybVN0cmluZyB7XG4gIGZsYXNoVGFyZ2V0ID0gZmFsc2VcbiAgcmVzdG9yZVBvc2l0aW9ucyA9IGZhbHNlXG5cbiAgbXV0YXRlU2VsZWN0aW9uIChzZWxlY3Rpb24pIHtcbiAgICBjb25zdCByYW5nZSA9IHNlbGVjdGlvbi5nZXRCdWZmZXJSYW5nZSgpXG5cbiAgICAvLyBXaGVuIGN1cnNvciBpcyBhdCBsYXN0IEJVRkZFUiByb3csIGl0IHNlbGVjdCBsYXN0LWJ1ZmZlci1yb3csIHRoZW5cbiAgICAvLyBqb2lubmluZyByZXN1bHQgaW4gXCJjbGVhciBsYXN0LWJ1ZmZlci1yb3cgdGV4dFwiLlxuICAgIC8vIEkgYmVsaWV2ZSB0aGlzIGlzIEJVRyBvZiB1cHN0cmVhbSBhdG9tLWNvcmUuIGd1YXJkIHRoaXMgc2l0dWF0aW9uIGhlcmVcbiAgICBpZiAoIXJhbmdlLmlzU2luZ2xlTGluZSgpIHx8IHJhbmdlLmVuZC5yb3cgIT09IHRoaXMuZWRpdG9yLmdldExhc3RCdWZmZXJSb3coKSkge1xuICAgICAgaWYgKHRoaXMudXRpbHMuaXNMaW5ld2lzZVJhbmdlKHJhbmdlKSkge1xuICAgICAgICBzZWxlY3Rpb24uc2V0QnVmZmVyUmFuZ2UocmFuZ2UudHJhbnNsYXRlKFswLCAwXSwgWy0xLCBJbmZpbml0eV0pKVxuICAgICAgfVxuICAgICAgc2VsZWN0aW9uLmpvaW5MaW5lcygpXG4gICAgfVxuICAgIGNvbnN0IHBvaW50ID0gc2VsZWN0aW9uLmdldEJ1ZmZlclJhbmdlKCkuZW5kLnRyYW5zbGF0ZShbMCwgLTFdKVxuICAgIHJldHVybiBzZWxlY3Rpb24uY3Vyc29yLnNldEJ1ZmZlclBvc2l0aW9uKHBvaW50KVxuICB9XG59XG5cbmNsYXNzIEpvaW4gZXh0ZW5kcyBKb2luVGFyZ2V0IHtcbiAgdGFyZ2V0ID0gJ01vdmVUb1JlbGF0aXZlTGluZSdcbn1cblxuY2xhc3MgSm9pbkJhc2UgZXh0ZW5kcyBUcmFuc2Zvcm1TdHJpbmcge1xuICBzdGF0aWMgY29tbWFuZCA9IGZhbHNlXG4gIHdpc2UgPSAnbGluZXdpc2UnXG4gIHRyaW0gPSBmYWxzZVxuICB0YXJnZXQgPSAnTW92ZVRvUmVsYXRpdmVMaW5lTWluaW11bVR3bydcblxuICBnZXROZXdUZXh0ICh0ZXh0KSB7XG4gICAgY29uc3QgcmVnZXggPSB0aGlzLnRyaW0gPyAvXFxyP1xcblsgXFx0XSovZyA6IC9cXHI/XFxuL2dcbiAgICByZXR1cm4gdGV4dC50cmltUmlnaHQoKS5yZXBsYWNlKHJlZ2V4LCB0aGlzLmlucHV0KSArICdcXG4nXG4gIH1cbn1cblxuY2xhc3MgSm9pbldpdGhLZWVwaW5nU3BhY2UgZXh0ZW5kcyBKb2luQmFzZSB7XG4gIGlucHV0ID0gJydcbn1cblxuY2xhc3MgSm9pbkJ5SW5wdXQgZXh0ZW5kcyBKb2luQmFzZSB7XG4gIHJlYWRJbnB1dEFmdGVyU2VsZWN0ID0gdHJ1ZVxuICBmb2N1c0lucHV0T3B0aW9ucyA9IHtjaGFyc01heDogMTB9XG4gIHRyaW0gPSB0cnVlXG59XG5cbmNsYXNzIEpvaW5CeUlucHV0V2l0aEtlZXBpbmdTcGFjZSBleHRlbmRzIEpvaW5CeUlucHV0IHtcbiAgdHJpbSA9IGZhbHNlXG59XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFN0cmluZyBzdWZmaXggaW4gbmFtZSBpcyB0byBhdm9pZCBjb25mdXNpb24gd2l0aCAnc3BsaXQnIHdpbmRvdy5cbmNsYXNzIFNwbGl0U3RyaW5nIGV4dGVuZHMgVHJhbnNmb3JtU3RyaW5nIHtcbiAgdGFyZ2V0ID0gJ01vdmVUb1JlbGF0aXZlTGluZSdcbiAga2VlcFNwbGl0dGVyID0gZmFsc2VcbiAgcmVhZElucHV0QWZ0ZXJTZWxlY3QgPSB0cnVlXG4gIGZvY3VzSW5wdXRPcHRpb25zID0ge2NoYXJzTWF4OiAxMH1cblxuICBnZXROZXdUZXh0ICh0ZXh0KSB7XG4gICAgY29uc3QgcmVnZXggPSBuZXcgUmVnRXhwKHRoaXMuXy5lc2NhcGVSZWdFeHAodGhpcy5pbnB1dCB8fCAnXFxcXG4nKSwgJ2cnKVxuICAgIGNvbnN0IGxpbmVTZXBhcmF0b3IgPSAodGhpcy5rZWVwU3BsaXR0ZXIgPyB0aGlzLmlucHV0IDogJycpICsgJ1xcbidcbiAgICByZXR1cm4gdGV4dC5yZXBsYWNlKHJlZ2V4LCBsaW5lU2VwYXJhdG9yKVxuICB9XG59XG5cbmNsYXNzIFNwbGl0U3RyaW5nV2l0aEtlZXBpbmdTcGxpdHRlciBleHRlbmRzIFNwbGl0U3RyaW5nIHtcbiAga2VlcFNwbGl0dGVyID0gdHJ1ZVxufVxuXG5jbGFzcyBTcGxpdEFyZ3VtZW50cyBleHRlbmRzIFRyYW5zZm9ybVN0cmluZyB7XG4gIGtlZXBTZXBhcmF0b3IgPSB0cnVlXG5cbiAgZ2V0TmV3VGV4dCAodGV4dCwgc2VsZWN0aW9uKSB7XG4gICAgY29uc3QgYWxsVG9rZW5zID0gdGhpcy51dGlscy5zcGxpdEFyZ3VtZW50cyh0ZXh0LnRyaW0oKSlcbiAgICBsZXQgbmV3VGV4dCA9ICcnXG5cbiAgICBjb25zdCBiYXNlSW5kZW50TGV2ZWwgPSB0aGlzLmVkaXRvci5pbmRlbnRhdGlvbkZvckJ1ZmZlclJvdyhzZWxlY3Rpb24uZ2V0QnVmZmVyUmFuZ2UoKS5zdGFydC5yb3cpXG4gICAgY29uc3QgaW5kZW50VGV4dFN0YXJ0Um93ID0gdGhpcy5lZGl0b3IuYnVpbGRJbmRlbnRTdHJpbmcoYmFzZUluZGVudExldmVsKVxuICAgIGNvbnN0IGluZGVudFRleHRJbm5lclJvd3MgPSB0aGlzLmVkaXRvci5idWlsZEluZGVudFN0cmluZyhiYXNlSW5kZW50TGV2ZWwgKyAxKVxuXG4gICAgd2hpbGUgKGFsbFRva2Vucy5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IHt0ZXh0LCB0eXBlfSA9IGFsbFRva2Vucy5zaGlmdCgpXG4gICAgICBuZXdUZXh0ICs9IHR5cGUgPT09ICdzZXBhcmF0b3InID8gKHRoaXMua2VlcFNlcGFyYXRvciA/IHRleHQudHJpbSgpIDogJycpICsgJ1xcbicgOiBpbmRlbnRUZXh0SW5uZXJSb3dzICsgdGV4dFxuICAgIH1cbiAgICByZXR1cm4gYFxcbiR7bmV3VGV4dH1cXG4ke2luZGVudFRleHRTdGFydFJvd31gXG4gIH1cbn1cblxuY2xhc3MgU3BsaXRBcmd1bWVudHNXaXRoUmVtb3ZlU2VwYXJhdG9yIGV4dGVuZHMgU3BsaXRBcmd1bWVudHMge1xuICBrZWVwU2VwYXJhdG9yID0gZmFsc2Vcbn1cblxuY2xhc3MgU3BsaXRBcmd1bWVudHNPZklubmVyQW55UGFpciBleHRlbmRzIFNwbGl0QXJndW1lbnRzIHtcbiAgdGFyZ2V0ID0gJ0lubmVyQW55UGFpcidcbn1cblxuY2xhc3MgQ2hhbmdlT3JkZXIgZXh0ZW5kcyBUcmFuc2Zvcm1TdHJpbmcge1xuICBzdGF0aWMgY29tbWFuZCA9IGZhbHNlXG4gIGFjdGlvbiA9IG51bGxcbiAgc29ydEJ5ID0gbnVsbFxuXG4gIGdldE5ld1RleHQgKHRleHQpIHtcbiAgICByZXR1cm4gdGhpcy50YXJnZXQuaXNMaW5ld2lzZSgpXG4gICAgICA/IHRoaXMuZ2V0TmV3TGlzdCh0aGlzLnV0aWxzLnNwbGl0VGV4dEJ5TmV3TGluZSh0ZXh0KSkuam9pbignXFxuJykgKyAnXFxuJ1xuICAgICAgOiB0aGlzLnNvcnRBcmd1bWVudHNJblRleHRCeSh0ZXh0LCBhcmdzID0+IHRoaXMuZ2V0TmV3TGlzdChhcmdzKSlcbiAgfVxuXG4gIGdldE5ld0xpc3QgKHJvd3MpIHtcbiAgICBpZiAocm93cy5sZW5ndGggPT09IDEpIHtcbiAgICAgIHJldHVybiBbdGhpcy51dGlscy5jaGFuZ2VDaGFyT3JkZXIocm93c1swXSwgdGhpcy5hY3Rpb24sIHRoaXMuc29ydEJ5KV1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMudXRpbHMuY2hhbmdlQXJyYXlPcmRlcihyb3dzLCB0aGlzLmFjdGlvbiwgdGhpcy5zb3J0QnkpXG4gICAgfVxuICB9XG5cbiAgc29ydEFyZ3VtZW50c0luVGV4dEJ5ICh0ZXh0LCBmbikge1xuICAgIGNvbnN0IHN0YXJ0ID0gdGV4dC5zZWFyY2goL1xcUy8pXG4gICAgY29uc3QgZW5kID0gdGV4dC5zZWFyY2goL1xccyokLylcbiAgICBjb25zdCBsZWFkaW5nU3BhY2VzID0gc3RhcnQgIT09IC0xID8gdGV4dC5zbGljZSgwLCBzdGFydCkgOiAnJ1xuICAgIGNvbnN0IHRyYWlsaW5nU3BhY2VzID0gZW5kICE9PSAtMSA/IHRleHQuc2xpY2UoZW5kKSA6ICcnXG4gICAgY29uc3QgYWxsVG9rZW5zID0gdGhpcy51dGlscy5zcGxpdEFyZ3VtZW50cyh0ZXh0LnNsaWNlKHN0YXJ0LCBlbmQpKVxuICAgIGNvbnN0IGFyZ3MgPSBhbGxUb2tlbnMuZmlsdGVyKHRva2VuID0+IHRva2VuLnR5cGUgPT09ICdhcmd1bWVudCcpLm1hcCh0b2tlbiA9PiB0b2tlbi50ZXh0KVxuICAgIGNvbnN0IG5ld0FyZ3MgPSBmbihhcmdzKVxuXG4gICAgbGV0IG5ld1RleHQgPSAnJ1xuICAgIHdoaWxlIChhbGxUb2tlbnMubGVuZ3RoKSB7XG4gICAgICBjb25zdCB0b2tlbiA9IGFsbFRva2Vucy5zaGlmdCgpXG4gICAgICAvLyB0b2tlbi50eXBlIGlzIFwic2VwYXJhdG9yXCIgb3IgXCJhcmd1bWVudFwiXG4gICAgICBuZXdUZXh0ICs9IHRva2VuLnR5cGUgPT09ICdzZXBhcmF0b3InID8gdG9rZW4udGV4dCA6IG5ld0FyZ3Muc2hpZnQoKVxuICAgIH1cbiAgICByZXR1cm4gbGVhZGluZ1NwYWNlcyArIG5ld1RleHQgKyB0cmFpbGluZ1NwYWNlc1xuICB9XG59XG5cbmNsYXNzIFJldmVyc2UgZXh0ZW5kcyBDaGFuZ2VPcmRlciB7XG4gIGFjdGlvbiA9ICdyZXZlcnNlJ1xufVxuXG5jbGFzcyBSZXZlcnNlSW5uZXJBbnlQYWlyIGV4dGVuZHMgUmV2ZXJzZSB7XG4gIHRhcmdldCA9ICdJbm5lckFueVBhaXInXG59XG5cbmNsYXNzIFJvdGF0ZSBleHRlbmRzIENoYW5nZU9yZGVyIHtcbiAgYWN0aW9uID0gJ3JvdGF0ZS1sZWZ0J1xufVxuXG5jbGFzcyBSb3RhdGVCYWNrd2FyZHMgZXh0ZW5kcyBDaGFuZ2VPcmRlciB7XG4gIGFjdGlvbiA9ICdyb3RhdGUtcmlnaHQnXG59XG5cbmNsYXNzIFJvdGF0ZUFyZ3VtZW50c09mSW5uZXJQYWlyIGV4dGVuZHMgUm90YXRlIHtcbiAgdGFyZ2V0ID0gJ0lubmVyQW55UGFpcidcbn1cblxuY2xhc3MgUm90YXRlQXJndW1lbnRzQmFja3dhcmRzT2ZJbm5lclBhaXIgZXh0ZW5kcyBSb3RhdGVCYWNrd2FyZHMge1xuICB0YXJnZXQgPSAnSW5uZXJBbnlQYWlyJ1xufVxuXG5jbGFzcyBTb3J0IGV4dGVuZHMgQ2hhbmdlT3JkZXIge1xuICBhY3Rpb24gPSAnc29ydCdcbn1cblxuY2xhc3MgU29ydENhc2VJbnNlbnNpdGl2ZWx5IGV4dGVuZHMgU29ydCB7XG4gIHNvcnRCeSA9IChyb3dBLCByb3dCKSA9PiByb3dBLmxvY2FsZUNvbXBhcmUocm93Qiwge3NlbnNpdGl2aXR5OiAnYmFzZSd9KVxufVxuXG5jbGFzcyBTb3J0QnlOdW1iZXIgZXh0ZW5kcyBTb3J0IHtcbiAgc29ydEJ5ID0gKHJvd0EsIHJvd0IpID0+IChOdW1iZXIucGFyc2VJbnQocm93QSkgfHwgSW5maW5pdHkpIC0gKE51bWJlci5wYXJzZUludChyb3dCKSB8fCBJbmZpbml0eSlcbn1cblxuY2xhc3MgUmFuZG9taXplIGV4dGVuZHMgQ2hhbmdlT3JkZXIge1xuICBhY3Rpb24gPSAncmFtZG9taXplJ1xufVxuXG5jbGFzcyBOdW1iZXJpbmdMaW5lcyBleHRlbmRzIFRyYW5zZm9ybVN0cmluZyB7XG4gIHdpc2UgPSAnbGluZXdpc2UnXG5cbiAgZ2V0TmV3VGV4dCAodGV4dCkge1xuICAgIGNvbnN0IHJvd3MgPSB0aGlzLnV0aWxzLnNwbGl0VGV4dEJ5TmV3TGluZSh0ZXh0KVxuICAgIGNvbnN0IGxhc3RSb3dXaWR0aCA9IFN0cmluZyhyb3dzLmxlbmd0aCkubGVuZ3RoXG5cbiAgICBjb25zdCBuZXdSb3dzID0gcm93cy5tYXAoKHJvd1RleHQsIGkpID0+IHtcbiAgICAgIGkrKyAvLyBmaXggMCBzdGFydCBpbmRleCB0byAxIHN0YXJ0LlxuICAgICAgY29uc3QgYW1vdW50T2ZQYWRkaW5nID0gdGhpcy5saW1pdE51bWJlcihsYXN0Um93V2lkdGggLSBTdHJpbmcoaSkubGVuZ3RoLCB7bWluOiAwfSlcbiAgICAgIHJldHVybiAnICcucmVwZWF0KGFtb3VudE9mUGFkZGluZykgKyBpICsgJzogJyArIHJvd1RleHRcbiAgICB9KVxuICAgIHJldHVybiBuZXdSb3dzLmpvaW4oJ1xcbicpICsgJ1xcbidcbiAgfVxufVxuXG5jbGFzcyBEdXBsaWNhdGVXaXRoQ29tbWVudE91dE9yaWdpbmFsIGV4dGVuZHMgVHJhbnNmb3JtU3RyaW5nIHtcbiAgd2lzZSA9ICdsaW5ld2lzZSdcbiAgc3RheUJ5TWFya2VyID0gdHJ1ZVxuICBzdGF5QXRTYW1lUG9zaXRpb24gPSB0cnVlXG4gIG11dGF0ZVNlbGVjdGlvbiAoc2VsZWN0aW9uKSB7XG4gICAgY29uc3QgW3N0YXJ0Um93LCBlbmRSb3ddID0gc2VsZWN0aW9uLmdldEJ1ZmZlclJvd1JhbmdlKClcbiAgICBzZWxlY3Rpb24uc2V0QnVmZmVyUmFuZ2UodGhpcy51dGlscy5pbnNlcnRUZXh0QXRCdWZmZXJQb3NpdGlvbih0aGlzLmVkaXRvciwgW3N0YXJ0Um93LCAwXSwgc2VsZWN0aW9uLmdldFRleHQoKSkpXG4gICAgdGhpcy5lZGl0b3IudG9nZ2xlTGluZUNvbW1lbnRzRm9yQnVmZmVyUm93cyhzdGFydFJvdywgZW5kUm93KVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBUcmFuc2Zvcm1TdHJpbmcsXG5cbiAgTm9DYXNlLFxuICBEb3RDYXNlLFxuICBTd2FwQ2FzZSxcbiAgUGF0aENhc2UsXG4gIFVwcGVyQ2FzZSxcbiAgTG93ZXJDYXNlLFxuICBDYW1lbENhc2UsXG4gIFNuYWtlQ2FzZSxcbiAgVGl0bGVDYXNlLFxuICBQYXJhbUNhc2UsXG4gIEhlYWRlckNhc2UsXG4gIFBhc2NhbENhc2UsXG4gIENvbnN0YW50Q2FzZSxcbiAgU2VudGVuY2VDYXNlLFxuICBVcHBlckNhc2VGaXJzdCxcbiAgTG93ZXJDYXNlRmlyc3QsXG4gIERhc2hDYXNlLFxuICBUb2dnbGVDYXNlLFxuICBUb2dnbGVDYXNlQW5kTW92ZVJpZ2h0LFxuXG4gIFJlcGxhY2UsXG4gIFJlcGxhY2VDaGFyYWN0ZXIsXG4gIFNwbGl0QnlDaGFyYWN0ZXIsXG4gIEVuY29kZVVyaUNvbXBvbmVudCxcbiAgRGVjb2RlVXJpQ29tcG9uZW50LFxuICBUcmltU3RyaW5nLFxuICBDb21wYWN0U3BhY2VzLFxuICBBbGlnbk9jY3VycmVuY2UsXG4gIEFsaWduT2NjdXJyZW5jZUJ5UGFkTGVmdCxcbiAgQWxpZ25PY2N1cnJlbmNlQnlQYWRSaWdodCxcbiAgUmVtb3ZlTGVhZGluZ1doaXRlU3BhY2VzLFxuICBDb252ZXJ0VG9Tb2Z0VGFiLFxuICBDb252ZXJ0VG9IYXJkVGFiLFxuICBUcmFuc2Zvcm1TdHJpbmdCeUV4dGVybmFsQ29tbWFuZCxcbiAgVHJhbnNmb3JtU3RyaW5nQnlTZWxlY3RMaXN0LFxuICBUcmFuc2Zvcm1Xb3JkQnlTZWxlY3RMaXN0LFxuICBUcmFuc2Zvcm1TbWFydFdvcmRCeVNlbGVjdExpc3QsXG4gIFJlcGxhY2VXaXRoUmVnaXN0ZXIsXG4gIFJlcGxhY2VPY2N1cnJlbmNlV2l0aFJlZ2lzdGVyLFxuICBTd2FwV2l0aFJlZ2lzdGVyLFxuICBJbmRlbnQsXG4gIE91dGRlbnQsXG4gIEF1dG9JbmRlbnQsXG4gIFRvZ2dsZUxpbmVDb21tZW50cyxcbiAgUmVmbG93LFxuICBSZWZsb3dXaXRoU3RheSxcbiAgU3Vycm91bmRCYXNlLFxuICBTdXJyb3VuZCxcbiAgU3Vycm91bmRXb3JkLFxuICBTdXJyb3VuZFNtYXJ0V29yZCxcbiAgTWFwU3Vycm91bmQsXG4gIERlbGV0ZVN1cnJvdW5kLFxuICBEZWxldGVTdXJyb3VuZEFueVBhaXIsXG4gIERlbGV0ZVN1cnJvdW5kQW55UGFpckFsbG93Rm9yd2FyZGluZyxcbiAgQ2hhbmdlU3Vycm91bmQsXG4gIENoYW5nZVN1cnJvdW5kQW55UGFpcixcbiAgQ2hhbmdlU3Vycm91bmRBbnlQYWlyQWxsb3dGb3J3YXJkaW5nLFxuICBKb2luVGFyZ2V0LFxuICBKb2luLFxuICBKb2luQmFzZSxcbiAgSm9pbldpdGhLZWVwaW5nU3BhY2UsXG4gIEpvaW5CeUlucHV0LFxuICBKb2luQnlJbnB1dFdpdGhLZWVwaW5nU3BhY2UsXG4gIFNwbGl0U3RyaW5nLFxuICBTcGxpdFN0cmluZ1dpdGhLZWVwaW5nU3BsaXR0ZXIsXG4gIFNwbGl0QXJndW1lbnRzLFxuICBTcGxpdEFyZ3VtZW50c1dpdGhSZW1vdmVTZXBhcmF0b3IsXG4gIFNwbGl0QXJndW1lbnRzT2ZJbm5lckFueVBhaXIsXG4gIENoYW5nZU9yZGVyLFxuICBSZXZlcnNlLFxuICBSZXZlcnNlSW5uZXJBbnlQYWlyLFxuICBSb3RhdGUsXG4gIFJvdGF0ZUJhY2t3YXJkcyxcbiAgUm90YXRlQXJndW1lbnRzT2ZJbm5lclBhaXIsXG4gIFJvdGF0ZUFyZ3VtZW50c0JhY2t3YXJkc09mSW5uZXJQYWlyLFxuICBTb3J0LFxuICBTb3J0Q2FzZUluc2Vuc2l0aXZlbHksXG4gIFNvcnRCeU51bWJlcixcbiAgUmFuZG9taXplLFxuICBOdW1iZXJpbmdMaW5lcyxcbiAgRHVwbGljYXRlV2l0aENvbW1lbnRPdXRPcmlnaW5hbFxufVxuZm9yIChjb25zdCBrbGFzcyBvZiBPYmplY3QudmFsdWVzKG1vZHVsZS5leHBvcnRzKSkge1xuICBpZiAoa2xhc3MuaXNDb21tYW5kKCkpIGtsYXNzLnJlZ2lzdGVyVG9TZWxlY3RMaXN0KClcbn1cbiJdfQ==