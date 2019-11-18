'use babel';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _require = require('atom');

var Range = _require.Range;
var Point = _require.Point;

// [TODO] Need overhaul
//  - [ ] Make expandable by selection.getBufferRange().union(this.getRange(selection))
//  - [ ] Count support(priority low)?
var Base = require('./base');
var PairFinder = require('./pair-finder');

var TextObject = (function (_Base) {
  _inherits(TextObject, _Base);

  function TextObject() {
    _classCallCheck(this, TextObject);

    _get(Object.getPrototypeOf(TextObject.prototype), 'constructor', this).apply(this, arguments);

    this.operator = null;
    this.wise = 'characterwise';
    this.supportCount = false;
    this.selectOnce = false;
    this.selectSucceeded = false;
  }

  // Section: Word
  // =========================

  _createClass(TextObject, [{
    key: 'isInner',
    value: function isInner() {
      return this.inner;
    }
  }, {
    key: 'isA',
    value: function isA() {
      return !this.inner;
    }
  }, {
    key: 'isLinewise',
    value: function isLinewise() {
      return this.wise === 'linewise';
    }
  }, {
    key: 'isBlockwise',
    value: function isBlockwise() {
      return this.wise === 'blockwise';
    }
  }, {
    key: 'forceWise',
    value: function forceWise(wise) {
      return this.wise = wise; // FIXME currently not well supported
    }
  }, {
    key: 'resetState',
    value: function resetState() {
      this.selectSucceeded = false;
    }

    // execute: Called from Operator::selectTarget()
    //  - `v i p`, is `VisualModeSelect` operator with @target = `InnerParagraph`.
    //  - `d i p`, is `Delete` operator with @target = `InnerParagraph`.
  }, {
    key: 'execute',
    value: function execute() {
      // Whennever TextObject is executed, it has @operator
      if (!this.operator) throw new Error('in TextObject: Must not happen');
      this.select();
    }
  }, {
    key: 'select',
    value: function select() {
      var _this = this;

      if (this.isMode('visual', 'blockwise')) {
        this.swrap.normalize(this.editor);
      }

      this.countTimes(this.getCount(), function (_ref2) {
        var stop = _ref2.stop;

        if (!_this.supportCount) stop(); // quick-fix for #560

        for (var selection of _this.editor.getSelections()) {
          var oldRange = selection.getBufferRange();
          if (_this.selectTextObject(selection)) _this.selectSucceeded = true;
          if (selection.getBufferRange().isEqual(oldRange)) stop();
          if (_this.selectOnce) break;
        }
      });

      this.editor.mergeIntersectingSelections();
      // Some TextObject's wise is NOT deterministic. It has to be detected from selected range.
      if (this.wise == null) this.wise = this.swrap.detectWise(this.editor);

      if (this.operator['instanceof']('SelectBase')) {
        if (this.selectSucceeded) {
          if (this.wise === 'characterwise') {
            this.swrap.saveProperties(this.editor, { force: true });
          } else if (this.wise === 'linewise') {
            // When target is persistent-selection, new selection is added after selectTextObject.
            // So we have to assure all selection have selction property.
            // Maybe this logic can be moved to operation stack.
            for (var $selection of this.swrap.getSelections(this.editor)) {
              if (this.getConfig('stayOnSelectTextObject')) {
                if (!$selection.hasProperties()) {
                  $selection.saveProperties();
                }
              } else {
                $selection.saveProperties();
              }
              $selection.fixPropertyRowToRowRange();
            }
          }
        }

        if (this.submode === 'blockwise') {
          for (var $selection of this.swrap.getSelections(this.editor)) {
            $selection.normalize();
            $selection.applyWise('blockwise');
          }
        }
      }
    }

    // Return true or false
  }, {
    key: 'selectTextObject',
    value: function selectTextObject(selection) {
      var range = this.getRange(selection);
      if (range) {
        this.swrap(selection).setBufferRange(range);
        return true;
      } else {
        return false;
      }
    }

    // to override
  }, {
    key: 'getRange',
    value: function getRange(selection) {}
  }], [{
    key: 'deriveClass',
    value: function deriveClass(innerAndA, innerAndAForAllowForwarding) {
      this.command = false; // HACK: klass to derive child class is not command
      var store = {};
      if (innerAndA) {
        var klassA = this.generateClass(false);
        var klassI = this.generateClass(true);
        store[klassA.name] = klassA;
        store[klassI.name] = klassI;
      }
      if (innerAndAForAllowForwarding) {
        var klassA = this.generateClass(false, true);
        var klassI = this.generateClass(true, true);
        store[klassA.name] = klassA;
        store[klassI.name] = klassI;
      }
      return store;
    }
  }, {
    key: 'generateClass',
    value: function generateClass(inner, allowForwarding) {
      var name = (inner ? 'Inner' : 'A') + this.name;
      if (allowForwarding) {
        name += 'AllowForwarding';
      }

      return (function (_ref) {
        _inherits(_class, _ref);

        _createClass(_class, null, [{
          key: 'name',
          value: name,
          enumerable: true
        }]);

        function _class(vimState) {
          _classCallCheck(this, _class);

          _get(Object.getPrototypeOf(_class.prototype), 'constructor', this).call(this, vimState);
          this.inner = inner;
          if (allowForwarding != null) {
            this.allowForwarding = allowForwarding;
          }
        }

        return _class;
      })(this);
    }
  }, {
    key: 'operationKind',
    value: 'text-object',
    enumerable: true
  }, {
    key: 'command',
    value: false,
    enumerable: true
  }]);

  return TextObject;
})(Base);

var Word = (function (_TextObject) {
  _inherits(Word, _TextObject);

  function Word() {
    _classCallCheck(this, Word);

    _get(Object.getPrototypeOf(Word.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(Word, [{
    key: 'getRange',
    value: function getRange(selection) {
      var point = this.getCursorPositionForSelection(selection);

      var _getWordBufferRangeAndKindAtBufferPosition = this.getWordBufferRangeAndKindAtBufferPosition(point, { wordRegex: this.wordRegex });

      var range = _getWordBufferRangeAndKindAtBufferPosition.range;

      return this.isA() ? this.utils.expandRangeToWhiteSpaces(this.editor, range) : range;
    }
  }]);

  return Word;
})(TextObject);

var WholeWord = (function (_Word) {
  _inherits(WholeWord, _Word);

  function WholeWord() {
    _classCallCheck(this, WholeWord);

    _get(Object.getPrototypeOf(WholeWord.prototype), 'constructor', this).apply(this, arguments);

    this.wordRegex = /\S+/;
  }

  // Just include _, -
  return WholeWord;
})(Word);

var SmartWord = (function (_Word2) {
  _inherits(SmartWord, _Word2);

  function SmartWord() {
    _classCallCheck(this, SmartWord);

    _get(Object.getPrototypeOf(SmartWord.prototype), 'constructor', this).apply(this, arguments);

    this.wordRegex = /[\w-]+/;
  }

  // Just include _, -
  return SmartWord;
})(Word);

var Subword = (function (_Word3) {
  _inherits(Subword, _Word3);

  function Subword() {
    _classCallCheck(this, Subword);

    _get(Object.getPrototypeOf(Subword.prototype), 'constructor', this).apply(this, arguments);
  }

  // Section: Pair
  // =========================

  _createClass(Subword, [{
    key: 'getRange',
    value: function getRange(selection) {
      this.wordRegex = selection.cursor.subwordRegExp();
      return _get(Object.getPrototypeOf(Subword.prototype), 'getRange', this).call(this, selection);
    }
  }]);

  return Subword;
})(Word);

var Pair = (function (_TextObject2) {
  _inherits(Pair, _TextObject2);

  function Pair() {
    _classCallCheck(this, Pair);

    _get(Object.getPrototypeOf(Pair.prototype), 'constructor', this).apply(this, arguments);

    this.supportCount = true;
    this.allowNextLine = null;
    this.adjustInnerRange = true;
    this.pair = null;
    this.inclusive = true;
  }

  // Used by DeleteSurround

  _createClass(Pair, [{
    key: 'isAllowNextLine',
    value: function isAllowNextLine() {
      if (this.allowNextLine != null) {
        return this.allowNextLine;
      } else {
        return this.pair && this.pair[0] !== this.pair[1];
      }
    }
  }, {
    key: 'adjustRange',
    value: function adjustRange(_ref3) {
      var start = _ref3.start;
      var end = _ref3.end;

      // Dirty work to feel natural for human, to behave compatible with pure Vim.
      // Where this adjustment appear is in following situation.
      // op-1: `ci{` replace only 2nd line
      // op-2: `di{` delete only 2nd line.
      // text:
      //  {
      //    aaa
      //  }
      if (this.utils.pointIsAtEndOfLine(this.editor, start)) {
        start = start.traverse([1, 0]);
      }

      if (this.utils.getLineTextToBufferPosition(this.editor, end).match(/^\s*$/)) {
        if (this.mode === 'visual') {
          // This is slightly innconsistent with regular Vim
          // - regular Vim: select new line after EOL
          // - vim-mode-plus: select to EOL(before new line)
          // This is intentional since to make submode `characterwise` when auto-detect submode
          // innerEnd = new Point(innerEnd.row - 1, Infinity)
          end = new Point(end.row - 1, Infinity);
        } else {
          end = new Point(end.row, 0);
        }
      }
      return new Range(start, end);
    }
  }, {
    key: 'getFinder',
    value: function getFinder() {
      var finderName = this.pair[0] === this.pair[1] ? 'QuoteFinder' : 'BracketFinder';
      return new PairFinder[finderName](this.editor, {
        allowNextLine: this.isAllowNextLine(),
        allowForwarding: this.allowForwarding,
        pair: this.pair,
        inclusive: this.inclusive
      });
    }
  }, {
    key: 'getPairInfo',
    value: function getPairInfo(from) {
      var pairInfo = this.getFinder().find(from);
      if (pairInfo) {
        if (this.adjustInnerRange) {
          pairInfo.innerRange = this.adjustRange(pairInfo.innerRange);
        }
        pairInfo.targetRange = this.isInner() ? pairInfo.innerRange : pairInfo.aRange;
        return pairInfo;
      }
    }
  }, {
    key: 'getRange',
    value: function getRange(selection) {
      var originalRange = selection.getBufferRange();
      var pairInfo = this.getPairInfo(this.getCursorPositionForSelection(selection));
      // When range was same, try to expand range
      if (pairInfo && pairInfo.targetRange.isEqual(originalRange)) {
        pairInfo = this.getPairInfo(pairInfo.aRange.end);
      }
      if (pairInfo) {
        return pairInfo.targetRange;
      }
    }
  }], [{
    key: 'command',
    value: false,
    enumerable: true
  }]);

  return Pair;
})(TextObject);

var APair = (function (_Pair) {
  _inherits(APair, _Pair);

  function APair() {
    _classCallCheck(this, APair);

    _get(Object.getPrototypeOf(APair.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(APair, null, [{
    key: 'command',
    value: false,
    enumerable: true
  }]);

  return APair;
})(Pair);

var AnyPair = (function (_Pair2) {
  _inherits(AnyPair, _Pair2);

  function AnyPair() {
    _classCallCheck(this, AnyPair);

    _get(Object.getPrototypeOf(AnyPair.prototype), 'constructor', this).apply(this, arguments);

    this.allowForwarding = false;
    this.member = ['DoubleQuote', 'SingleQuote', 'BackTick', 'CurlyBracket', 'AngleBracket', 'SquareBracket', 'Parenthesis'];
  }

  _createClass(AnyPair, [{
    key: 'getRanges',
    value: function getRanges(selection) {
      var _this2 = this;

      var options = {
        inner: this.inner,
        allowForwarding: this.allowForwarding,
        inclusive: this.inclusive
      };
      var getRangeByMember = function getRangeByMember(member) {
        return _this2.getInstance(member, options).getRange(selection);
      };
      return this.member.map(getRangeByMember).filter(function (v) {
        return v;
      });
    }
  }, {
    key: 'getRange',
    value: function getRange(selection) {
      return this.utils.sortRanges(this.getRanges(selection)).pop();
    }
  }]);

  return AnyPair;
})(Pair);

var AnyPairAllowForwarding = (function (_AnyPair) {
  _inherits(AnyPairAllowForwarding, _AnyPair);

  function AnyPairAllowForwarding() {
    _classCallCheck(this, AnyPairAllowForwarding);

    _get(Object.getPrototypeOf(AnyPairAllowForwarding.prototype), 'constructor', this).apply(this, arguments);

    this.allowForwarding = true;
  }

  _createClass(AnyPairAllowForwarding, [{
    key: 'getRange',
    value: function getRange(selection) {
      var ranges = this.getRanges(selection);
      var from = selection.cursor.getBufferPosition();

      var _$partition = this._.partition(ranges, function (range) {
        return range.start.isGreaterThanOrEqual(from);
      });

      var _$partition2 = _slicedToArray(_$partition, 2);

      var forwardingRanges = _$partition2[0];
      var enclosingRanges = _$partition2[1];

      var enclosingRange = this.utils.sortRanges(enclosingRanges).pop();
      forwardingRanges = this.utils.sortRanges(forwardingRanges);

      // When enclosingRange is exists,
      // We don't go across enclosingRange.end.
      // So choose from ranges contained in enclosingRange.
      if (enclosingRange) {
        forwardingRanges = forwardingRanges.filter(function (range) {
          return enclosingRange.containsRange(range);
        });
      }

      return forwardingRanges[0] || enclosingRange;
    }
  }]);

  return AnyPairAllowForwarding;
})(AnyPair);

var AnyQuote = (function (_AnyPair2) {
  _inherits(AnyQuote, _AnyPair2);

  function AnyQuote() {
    _classCallCheck(this, AnyQuote);

    _get(Object.getPrototypeOf(AnyQuote.prototype), 'constructor', this).apply(this, arguments);

    this.allowForwarding = true;
    this.member = ['DoubleQuote', 'SingleQuote', 'BackTick'];
  }

  _createClass(AnyQuote, [{
    key: 'getRange',
    value: function getRange(selection) {
      // Pick range which end.colum is leftmost(mean, closed first)
      return this.getRanges(selection).sort(function (a, b) {
        return a.end.column - b.end.column;
      })[0];
    }
  }]);

  return AnyQuote;
})(AnyPair);

var Quote = (function (_Pair3) {
  _inherits(Quote, _Pair3);

  function Quote() {
    _classCallCheck(this, Quote);

    _get(Object.getPrototypeOf(Quote.prototype), 'constructor', this).apply(this, arguments);

    this.allowForwarding = true;
  }

  _createClass(Quote, null, [{
    key: 'command',
    value: false,
    enumerable: true
  }]);

  return Quote;
})(Pair);

var DoubleQuote = (function (_Quote) {
  _inherits(DoubleQuote, _Quote);

  function DoubleQuote() {
    _classCallCheck(this, DoubleQuote);

    _get(Object.getPrototypeOf(DoubleQuote.prototype), 'constructor', this).apply(this, arguments);

    this.pair = ['"', '"'];
  }

  return DoubleQuote;
})(Quote);

var SingleQuote = (function (_Quote2) {
  _inherits(SingleQuote, _Quote2);

  function SingleQuote() {
    _classCallCheck(this, SingleQuote);

    _get(Object.getPrototypeOf(SingleQuote.prototype), 'constructor', this).apply(this, arguments);

    this.pair = ["'", "'"];
  }

  return SingleQuote;
})(Quote);

var BackTick = (function (_Quote3) {
  _inherits(BackTick, _Quote3);

  function BackTick() {
    _classCallCheck(this, BackTick);

    _get(Object.getPrototypeOf(BackTick.prototype), 'constructor', this).apply(this, arguments);

    this.pair = ['`', '`'];
  }

  return BackTick;
})(Quote);

var CurlyBracket = (function (_Pair4) {
  _inherits(CurlyBracket, _Pair4);

  function CurlyBracket() {
    _classCallCheck(this, CurlyBracket);

    _get(Object.getPrototypeOf(CurlyBracket.prototype), 'constructor', this).apply(this, arguments);

    this.pair = ['{', '}'];
  }

  return CurlyBracket;
})(Pair);

var SquareBracket = (function (_Pair5) {
  _inherits(SquareBracket, _Pair5);

  function SquareBracket() {
    _classCallCheck(this, SquareBracket);

    _get(Object.getPrototypeOf(SquareBracket.prototype), 'constructor', this).apply(this, arguments);

    this.pair = ['[', ']'];
  }

  return SquareBracket;
})(Pair);

var Parenthesis = (function (_Pair6) {
  _inherits(Parenthesis, _Pair6);

  function Parenthesis() {
    _classCallCheck(this, Parenthesis);

    _get(Object.getPrototypeOf(Parenthesis.prototype), 'constructor', this).apply(this, arguments);

    this.pair = ['(', ')'];
  }

  return Parenthesis;
})(Pair);

var AngleBracket = (function (_Pair7) {
  _inherits(AngleBracket, _Pair7);

  function AngleBracket() {
    _classCallCheck(this, AngleBracket);

    _get(Object.getPrototypeOf(AngleBracket.prototype), 'constructor', this).apply(this, arguments);

    this.pair = ['<', '>'];
  }

  return AngleBracket;
})(Pair);

var Tag = (function (_Pair8) {
  _inherits(Tag, _Pair8);

  function Tag() {
    _classCallCheck(this, Tag);

    _get(Object.getPrototypeOf(Tag.prototype), 'constructor', this).apply(this, arguments);

    this.allowNextLine = true;
    this.allowForwarding = true;
    this.adjustInnerRange = false;
  }

  // Section: Paragraph
  // =========================
  // Paragraph is defined as consecutive (non-)blank-line.

  _createClass(Tag, [{
    key: 'getTagStartPoint',
    value: function getTagStartPoint(from) {
      var regex = PairFinder.TagFinder.pattern;
      var options = { from: [from.row, 0] };
      return this.findInEditor('forward', regex, options, function (_ref4) {
        var range = _ref4.range;
        return range.containsPoint(from, true) && range.start;
      });
    }
  }, {
    key: 'getFinder',
    value: function getFinder() {
      return new PairFinder.TagFinder(this.editor, {
        allowNextLine: this.isAllowNextLine(),
        allowForwarding: this.allowForwarding,
        inclusive: this.inclusive
      });
    }
  }, {
    key: 'getPairInfo',
    value: function getPairInfo(from) {
      return _get(Object.getPrototypeOf(Tag.prototype), 'getPairInfo', this).call(this, this.getTagStartPoint(from) || from);
    }
  }]);

  return Tag;
})(Pair);

var Paragraph = (function (_TextObject3) {
  _inherits(Paragraph, _TextObject3);

  function Paragraph() {
    _classCallCheck(this, Paragraph);

    _get(Object.getPrototypeOf(Paragraph.prototype), 'constructor', this).apply(this, arguments);

    this.wise = 'linewise';
    this.supportCount = true;
  }

  _createClass(Paragraph, [{
    key: 'findRow',
    value: function findRow(fromRow, direction, fn) {
      if (fn.reset) fn.reset();
      var foundRow = fromRow;
      for (var row of this.getBufferRows({ startRow: fromRow, direction: direction })) {
        if (!fn(row, direction)) break;
        foundRow = row;
      }
      return foundRow;
    }
  }, {
    key: 'findRowRangeBy',
    value: function findRowRangeBy(fromRow, fn) {
      var startRow = this.findRow(fromRow, 'previous', fn);
      var endRow = this.findRow(fromRow, 'next', fn);
      return [startRow, endRow];
    }
  }, {
    key: 'getPredictFunction',
    value: function getPredictFunction(fromRow, selection) {
      var _this3 = this;

      var fromRowResult = this.editor.isBufferRowBlank(fromRow);

      if (this.isInner()) {
        return function (row, direction) {
          return _this3.editor.isBufferRowBlank(row) === fromRowResult;
        };
      } else {
        var _ret = (function () {
          var directionToExtend = selection.isReversed() ? 'previous' : 'next';

          var flip = false;
          var predict = function predict(row, direction) {
            var result = _this3.editor.isBufferRowBlank(row) === fromRowResult;
            if (flip) {
              return !result;
            } else {
              if (!result && direction === directionToExtend) {
                return flip = true;
              }
              return result;
            }
          };
          predict.reset = function () {
            return flip = false;
          };
          return {
            v: predict
          };
        })();

        if (typeof _ret === 'object') return _ret.v;
      }
    }
  }, {
    key: 'getRange',
    value: function getRange(selection) {
      var fromRow = this.getCursorPositionForSelection(selection).row;
      if (this.isMode('visual', 'linewise')) {
        if (selection.isReversed()) fromRow--;else fromRow++;
        fromRow = this.getValidVimBufferRow(fromRow);
      }
      var rowRange = this.findRowRangeBy(fromRow, this.getPredictFunction(fromRow, selection));
      return selection.getBufferRange().union(this.getBufferRangeForRowRange(rowRange));
    }
  }]);

  return Paragraph;
})(TextObject);

var Indentation = (function (_Paragraph) {
  _inherits(Indentation, _Paragraph);

  function Indentation() {
    _classCallCheck(this, Indentation);

    _get(Object.getPrototypeOf(Indentation.prototype), 'constructor', this).apply(this, arguments);
  }

  // Section: Comment
  // =========================

  _createClass(Indentation, [{
    key: 'getRange',
    value: function getRange(selection) {
      var _this4 = this;

      var fromRow = this.getCursorPositionForSelection(selection).row;
      var baseIndentLevel = this.editor.indentationForBufferRow(fromRow);
      var rowRange = this.findRowRangeBy(fromRow, function (row) {
        if (_this4.editor.isBufferRowBlank(row)) {
          return _this4.isA();
        } else {
          return _this4.editor.indentationForBufferRow(row) >= baseIndentLevel;
        }
      });
      return this.getBufferRangeForRowRange(rowRange);
    }
  }]);

  return Indentation;
})(Paragraph);

var Comment = (function (_TextObject4) {
  _inherits(Comment, _TextObject4);

  function Comment() {
    _classCallCheck(this, Comment);

    _get(Object.getPrototypeOf(Comment.prototype), 'constructor', this).apply(this, arguments);

    this.wise = 'linewise';
  }

  _createClass(Comment, [{
    key: 'getRange',
    value: function getRange(selection) {
      var _getCursorPositionForSelection = this.getCursorPositionForSelection(selection);

      var row = _getCursorPositionForSelection.row;

      var rowRange = this.utils.getRowRangeForCommentAtBufferRow(this.editor, row);
      if (rowRange) {
        return this.getBufferRangeForRowRange(rowRange);
      }
    }
  }]);

  return Comment;
})(TextObject);

var BlockComment = (function (_TextObject5) {
  _inherits(BlockComment, _TextObject5);

  function BlockComment() {
    _classCallCheck(this, BlockComment);

    _get(Object.getPrototypeOf(BlockComment.prototype), 'constructor', this).apply(this, arguments);

    this.wise = 'characterwise';
  }

  _createClass(BlockComment, [{
    key: 'getRange',
    value: function getRange(selection) {
      // Following one-column-right translation is necessary when cursor is "on" `/` char of beginning `/*`.
      var from = this.editor.clipBufferPosition(this.getCursorPositionForSelection(selection).translate([0, 1]));

      var range = this.getBlockCommentRangeForPoint(from);
      if (range) {
        range.start = this.getStartOfBlockComment(range.start);
        range.end = this.getEndOfBlockComment(range.end);
        var scanRange = range;

        if (this.isInner()) {
          this.scanEditor('forward', /\s+/, { scanRange: scanRange }, function (event) {
            range.start = event.range.end;
            event.stop();
          });
          this.scanEditor('backward', /\s+/, { scanRange: scanRange }, function (event) {
            range.end = event.range.start;
            event.stop();
          });
        }
        return range;
      }
    }
  }, {
    key: 'getStartOfBlockComment',
    value: function getStartOfBlockComment(start) {
      while (start.column === 0) {
        var range = this.getBlockCommentRangeForPoint(start.translate([-1, Infinity]));
        if (!range) break;
        start = range.start;
      }
      return start;
    }
  }, {
    key: 'getEndOfBlockComment',
    value: function getEndOfBlockComment(end) {
      while (this.utils.pointIsAtEndOfLine(this.editor, end)) {
        var range = this.getBlockCommentRangeForPoint([end.row + 1, 0]);
        if (!range) break;
        end = range.end;
      }
      return end;
    }
  }, {
    key: 'getBlockCommentRangeForPoint',
    value: function getBlockCommentRangeForPoint(point) {
      var scope = 'comment.block';
      return this.editor.bufferRangeForScopeAtPosition(scope, point);
    }
  }]);

  return BlockComment;
})(TextObject);

var CommentOrParagraph = (function (_TextObject6) {
  _inherits(CommentOrParagraph, _TextObject6);

  function CommentOrParagraph() {
    _classCallCheck(this, CommentOrParagraph);

    _get(Object.getPrototypeOf(CommentOrParagraph.prototype), 'constructor', this).apply(this, arguments);

    this.wise = 'linewise';
  }

  // Section: Fold
  // =========================

  _createClass(CommentOrParagraph, [{
    key: 'getRange',
    value: function getRange(selection) {
      var inner = this.inner;

      for (var klass of ['Comment', 'Paragraph']) {
        var range = this.getInstance(klass, { inner: inner }).getRange(selection);
        if (range) {
          return range;
        }
      }
    }
  }]);

  return CommentOrParagraph;
})(TextObject);

var Fold = (function (_TextObject7) {
  _inherits(Fold, _TextObject7);

  function Fold() {
    _classCallCheck(this, Fold);

    _get(Object.getPrototypeOf(Fold.prototype), 'constructor', this).apply(this, arguments);

    this.wise = 'linewise';
  }

  _createClass(Fold, [{
    key: 'getRange',
    value: function getRange(selection) {
      var _getCursorPositionForSelection2 = this.getCursorPositionForSelection(selection);

      var row = _getCursorPositionForSelection2.row;

      var selectedRange = selection.getBufferRange();
      var foldRanges = this.utils.getCodeFoldRanges(this.editor);
      var foldRangesContainsCursorRow = foldRanges.filter(function (range) {
        return range.start.row <= row && row <= range.end.row;
      });
      var useTreeSitter = this.utils.isUsingTreeSitter(selection.editor);

      for (var foldRange of foldRangesContainsCursorRow.reverse()) {
        if (this.isA()) {
          foldRange = unionConjoinedFoldRange(foldRange, foldRanges, { useTreeSitter: useTreeSitter });
        } else {
          if (this.utils.doesRangeStartAndEndWithSameIndentLevel(this.editor, foldRange)) {
            foldRange.end.row -= 1;
          }
          foldRange.start.row += 1;
        }
        foldRange = this.getBufferRangeForRowRange([foldRange.start.row, foldRange.end.row]);
        if (!selectedRange.containsRange(foldRange)) {
          return foldRange;
        }
      }
    }
  }]);

  return Fold;
})(TextObject);

function unionConjoinedFoldRange(foldRange, foldRanges, _ref5) {
  var useTreeSitter = _ref5.useTreeSitter;

  var index = foldRanges.findIndex(function (range) {
    return range === foldRange;
  });

  // Extend to downwards
  for (var i = index + 1; i < foldRanges.length; i++) {
    if (foldRange.end.column !== Infinity) break;
    var endRow = useTreeSitter ? foldRange.end.row + 1 : foldRange.end.row;
    if (foldRanges[i].start.isEqual([endRow, Infinity])) {
      foldRange = foldRange.union(foldRanges[i]);
    }
  }

  // Extend to upwards
  for (var i = index - 1; i >= 0; i--) {
    if (foldRange.start.column !== Infinity) break;
    var startRow = useTreeSitter ? foldRange.start.row - 1 : foldRange.start.row;
    if (foldRanges[i].end.isEqual([startRow, Infinity])) {
      foldRange = foldRange.union(foldRanges[i]);
    }
  }

  return foldRange;
}

var Function = (function (_TextObject8) {
  _inherits(Function, _TextObject8);

  function Function() {
    _classCallCheck(this, Function);

    _get(Object.getPrototypeOf(Function.prototype), 'constructor', this).apply(this, arguments);

    this.wise = 'linewise';
    this.scopeNamesOmittingClosingBrace = ['source.go', 'source.elixir'];
  }

  // Section: Other
  // =========================

  _createClass(Function, [{
    key: 'getFunctionBodyStartRegex',
    // language doesn't include closing `}` into fold.

    value: function getFunctionBodyStartRegex(_ref6) {
      var scopeName = _ref6.scopeName;

      if (scopeName === 'source.python') {
        return (/:$/
        );
      } else if (scopeName === 'source.coffee') {
        return (/-|=>$/
        );
      } else {
        return (/{$/
        );
      }
    }
  }, {
    key: 'isMultiLineParameterFunctionRange',
    value: function isMultiLineParameterFunctionRange(parameterRange, bodyRange, bodyStartRegex) {
      var _this5 = this;

      var isBodyStartRow = function isBodyStartRow(row) {
        return bodyStartRegex.test(_this5.editor.lineTextForBufferRow(row));
      };
      if (isBodyStartRow(parameterRange.start.row)) return false;
      if (isBodyStartRow(parameterRange.end.row)) return parameterRange.end.row === bodyRange.start.row;
      if (isBodyStartRow(parameterRange.end.row + 1)) return parameterRange.end.row + 1 === bodyRange.start.row;
      return false;
    }
  }, {
    key: 'getRangeWithTreeSitter',
    value: function getRangeWithTreeSitter(selection) {
      var editor = this.editor;
      var cursorPosition = this.getCursorPositionForSelection(selection);
      var firstCharacterPosition = this.utils.getFirstCharacterPositionForBufferRow(this.editor, cursorPosition.row);
      var searchStartPoint = Point.max(firstCharacterPosition, cursorPosition);
      var startNode = editor.languageMode.getSyntaxNodeAtPosition(searchStartPoint);

      var node = this.utils.findParentNodeForFunctionType(editor, startNode);
      if (node) {
        var range = node.range;

        if (!this.isA()) {
          var bodyNode = this.utils.findFunctionBodyNode(editor, node);
          if (bodyNode) {
            range = bodyNode.range;
          }

          var endRowTranslation = this.utils.doesRangeStartAndEndWithSameIndentLevel(editor, range) ? -1 : 0;
          range = range.translate([1, 0], [endRowTranslation, 0]);
        }
        if (range.end.column !== 0) {
          // The 'preproc_function_def' type used in C and C++ header's "#define" returns linewise range.
          // In this case, we shouldn't translate to linewise since it already contains ending newline.
          range = this.utils.getBufferRangeForRowRange(editor, [range.start.row, range.end.row]);
        }
        return range;
      }
    }
  }, {
    key: 'getRange',
    value: function getRange(selection) {
      var _this6 = this;

      var useTreeSitter = this.utils.isUsingTreeSitter(selection.editor);
      if (useTreeSitter) {
        return this.getRangeWithTreeSitter(selection);
      }

      var editor = this.editor;
      var cursorRow = this.getCursorPositionForSelection(selection).row;
      var bodyStartRegex = this.getFunctionBodyStartRegex(editor.getGrammar());
      var isIncludeFunctionScopeForRow = function isIncludeFunctionScopeForRow(row) {
        return _this6.utils.isIncludeFunctionScopeForRow(editor, row);
      };

      var functionRanges = [];
      var saveFunctionRange = function saveFunctionRange(_ref7) {
        var aRange = _ref7.aRange;
        var innerRange = _ref7.innerRange;

        functionRanges.push({
          aRange: _this6.buildARange(aRange),
          innerRange: _this6.buildInnerRange(innerRange)
        });
      };

      var foldRanges = this.utils.getCodeFoldRanges(editor);
      while (foldRanges.length) {
        var range = foldRanges.shift();
        if (isIncludeFunctionScopeForRow(range.start.row)) {
          var nextRange = foldRanges[0];
          var nextFoldIsConnected = nextRange && nextRange.start.row <= range.end.row + 1;
          var maybeAFunctionRange = nextFoldIsConnected ? range.union(nextRange) : range;
          if (!maybeAFunctionRange.containsPoint([cursorRow, Infinity])) continue; // skip to avoid heavy computation
          if (nextFoldIsConnected && this.isMultiLineParameterFunctionRange(range, nextRange, bodyStartRegex)) {
            var bodyRange = foldRanges.shift();
            saveFunctionRange({ aRange: range.union(bodyRange), innerRange: bodyRange });
          } else {
            saveFunctionRange({ aRange: range, innerRange: range });
          }
        } else {
          var previousRow = range.start.row - 1;
          if (previousRow < 0) continue;
          if (editor.isFoldableAtBufferRow(previousRow)) continue;
          var maybeAFunctionRange = range.union(editor.bufferRangeForBufferRow(previousRow));
          if (!maybeAFunctionRange.containsPoint([cursorRow, Infinity])) continue; // skip to avoid heavy computation

          var isBodyStartOnlyRow = function isBodyStartOnlyRow(row) {
            return new RegExp('^\\s*' + bodyStartRegex.source).test(editor.lineTextForBufferRow(row));
          };
          if (isBodyStartOnlyRow(range.start.row) && isIncludeFunctionScopeForRow(previousRow)) {
            saveFunctionRange({ aRange: maybeAFunctionRange, innerRange: range });
          }
        }
      }

      for (var functionRange of functionRanges.reverse()) {
        var _ref8 = this.isA() ? functionRange.aRange : functionRange.innerRange;

        var start = _ref8.start;
        var end = _ref8.end;

        var range = this.getBufferRangeForRowRange([start.row, end.row]);
        if (!selection.getBufferRange().containsRange(range)) return range;
      }
    }
  }, {
    key: 'buildInnerRange',
    value: function buildInnerRange(range) {
      var endRowTranslation = this.utils.doesRangeStartAndEndWithSameIndentLevel(this.editor, range) ? -1 : 0;
      return range.translate([1, 0], [endRowTranslation, 0]);
    }
  }, {
    key: 'buildARange',
    value: function buildARange(range) {
      // NOTE: This adjustment shoud not be necessary if language-syntax is properly defined.
      var endRowTranslation = this.isGrammarDoesNotFoldClosingRow() ? +1 : 0;
      return range.translate([0, 0], [endRowTranslation, 0]);
    }
  }, {
    key: 'isGrammarDoesNotFoldClosingRow',
    value: function isGrammarDoesNotFoldClosingRow() {
      var _editor$getGrammar = this.editor.getGrammar();

      var scopeName = _editor$getGrammar.scopeName;
      var packageName = _editor$getGrammar.packageName;

      if (this.scopeNamesOmittingClosingBrace.includes(scopeName)) {
        return true;
      } else {
        // HACK: Rust have two package `language-rust` and `atom-language-rust`
        // language-rust don't fold ending `}`, but atom-language-rust does.
        return scopeName === 'source.rust' && packageName === 'language-rust';
      }
    }
  }]);

  return Function;
})(TextObject);

var Arguments = (function (_TextObject9) {
  _inherits(Arguments, _TextObject9);

  function Arguments() {
    _classCallCheck(this, Arguments);

    _get(Object.getPrototypeOf(Arguments.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(Arguments, [{
    key: 'newArgInfo',
    value: function newArgInfo(argStart, arg, separator) {
      var argEnd = this.utils.traverseTextFromPoint(argStart, arg);
      var argRange = new Range(argStart, argEnd);

      var separatorEnd = this.utils.traverseTextFromPoint(argEnd, separator != null ? separator : '');
      var separatorRange = new Range(argEnd, separatorEnd);

      var innerRange = argRange;
      var aRange = argRange.union(separatorRange);
      return { argRange: argRange, separatorRange: separatorRange, innerRange: innerRange, aRange: aRange };
    }
  }, {
    key: 'getArgumentsRangeForSelection',
    value: function getArgumentsRangeForSelection(selection) {
      var options = {
        member: ['CurlyBracket', 'SquareBracket', 'Parenthesis'],
        inclusive: false
      };
      return this.getInstance('InnerAnyPair', options).getRange(selection);
    }
  }, {
    key: 'getRange',
    value: function getRange(selection) {
      var _utils = this.utils;
      var splitArguments = _utils.splitArguments;
      var traverseTextFromPoint = _utils.traverseTextFromPoint;
      var getLast = _utils.getLast;

      var range = this.getArgumentsRangeForSelection(selection);
      var pairRangeFound = range != null;

      range = range || this.getInstance('InnerCurrentLine').getRange(selection); // fallback
      if (!range) return;

      range = this.trimBufferRange(range);

      var text = this.editor.getTextInBufferRange(range);
      var allTokens = splitArguments(text, pairRangeFound);

      var argInfos = [];
      var argStart = range.start;

      // Skip starting separator
      if (allTokens.length && allTokens[0].type === 'separator') {
        var token = allTokens.shift();
        argStart = traverseTextFromPoint(argStart, token.text);
      }

      while (allTokens.length) {
        var token = allTokens.shift();
        if (token.type === 'argument') {
          var nextToken = allTokens.shift();
          var separator = nextToken ? nextToken.text : undefined;
          var argInfo = this.newArgInfo(argStart, token.text, separator);

          if (allTokens.length === 0 && argInfos.length) {
            argInfo.aRange = argInfo.argRange.union(getLast(argInfos).separatorRange);
          }

          argStart = argInfo.aRange.end;
          argInfos.push(argInfo);
        } else {
          throw new Error('must not happen');
        }
      }

      var point = this.getCursorPositionForSelection(selection);
      for (var _ref92 of argInfos) {
        var innerRange = _ref92.innerRange;
        var aRange = _ref92.aRange;

        if (innerRange.end.isGreaterThanOrEqual(point)) {
          return this.isInner() ? innerRange : aRange;
        }
      }
    }
  }]);

  return Arguments;
})(TextObject);

var CurrentLine = (function (_TextObject10) {
  _inherits(CurrentLine, _TextObject10);

  function CurrentLine() {
    _classCallCheck(this, CurrentLine);

    _get(Object.getPrototypeOf(CurrentLine.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(CurrentLine, [{
    key: 'getRange',
    value: function getRange(selection) {
      var _getCursorPositionForSelection3 = this.getCursorPositionForSelection(selection);

      var row = _getCursorPositionForSelection3.row;

      var range = this.editor.bufferRangeForBufferRow(row);
      return this.isA() ? range : this.trimBufferRange(range);
    }
  }]);

  return CurrentLine;
})(TextObject);

var Entire = (function (_TextObject11) {
  _inherits(Entire, _TextObject11);

  function Entire() {
    _classCallCheck(this, Entire);

    _get(Object.getPrototypeOf(Entire.prototype), 'constructor', this).apply(this, arguments);

    this.wise = 'linewise';
    this.selectOnce = true;
  }

  _createClass(Entire, [{
    key: 'getRange',
    value: function getRange(selection) {
      return this.editor.buffer.getRange();
    }
  }]);

  return Entire;
})(TextObject);

var Empty = (function (_TextObject12) {
  _inherits(Empty, _TextObject12);

  function Empty() {
    _classCallCheck(this, Empty);

    _get(Object.getPrototypeOf(Empty.prototype), 'constructor', this).apply(this, arguments);

    this.selectOnce = true;
  }

  _createClass(Empty, null, [{
    key: 'command',
    value: false,
    enumerable: true
  }]);

  return Empty;
})(TextObject);

var LatestChange = (function (_TextObject13) {
  _inherits(LatestChange, _TextObject13);

  function LatestChange() {
    _classCallCheck(this, LatestChange);

    _get(Object.getPrototypeOf(LatestChange.prototype), 'constructor', this).apply(this, arguments);

    this.wise = null;
    this.selectOnce = true;
  }

  _createClass(LatestChange, [{
    key: 'getRange',
    value: function getRange(selection) {
      var start = this.vimState.mark.get('[');
      var end = this.vimState.mark.get(']');
      if (start && end) {
        return new Range(start, end);
      }
    }
  }]);

  return LatestChange;
})(TextObject);

var SearchMatchForward = (function (_TextObject14) {
  _inherits(SearchMatchForward, _TextObject14);

  function SearchMatchForward() {
    _classCallCheck(this, SearchMatchForward);

    _get(Object.getPrototypeOf(SearchMatchForward.prototype), 'constructor', this).apply(this, arguments);

    this.backward = false;
  }

  _createClass(SearchMatchForward, [{
    key: 'findMatch',
    value: function findMatch(from, regex) {
      if (this.backward) {
        if (this.mode === 'visual') {
          from = this.utils.translatePointAndClip(this.editor, from, 'backward');
        }

        var options = { from: [from.row, Infinity] };
        return {
          range: this.findInEditor('backward', regex, options, function (_ref10) {
            var range = _ref10.range;
            return range.start.isLessThan(from) && range;
          }),
          whichIsHead: 'start'
        };
      } else {
        if (this.mode === 'visual') {
          from = this.utils.translatePointAndClip(this.editor, from, 'forward');
        }

        var options = { from: [from.row, 0] };
        return {
          range: this.findInEditor('forward', regex, options, function (_ref11) {
            var range = _ref11.range;
            return range.end.isGreaterThan(from) && range;
          }),
          whichIsHead: 'end'
        };
      }
    }
  }, {
    key: 'getRange',
    value: function getRange(selection) {
      var pattern = this.globalState.get('lastSearchPattern');
      if (!pattern) return;

      var fromPoint = selection.getHeadBufferPosition();

      var _findMatch = this.findMatch(fromPoint, pattern);

      var range = _findMatch.range;
      var whichIsHead = _findMatch.whichIsHead;

      if (range) {
        return this.unionRangeAndDetermineReversedState(selection, range, whichIsHead);
      }
    }
  }, {
    key: 'unionRangeAndDetermineReversedState',
    value: function unionRangeAndDetermineReversedState(selection, range, whichIsHead) {
      if (selection.isEmpty()) return range;

      var head = range[whichIsHead];
      var tail = selection.getTailBufferPosition();

      if (this.backward) {
        if (tail.isLessThan(head)) head = this.utils.translatePointAndClip(this.editor, head, 'forward');
      } else {
        if (head.isLessThan(tail)) head = this.utils.translatePointAndClip(this.editor, head, 'backward');
      }

      this.reversed = head.isLessThan(tail);
      return new Range(tail, head).union(this.swrap(selection).getTailBufferRange());
    }
  }, {
    key: 'selectTextObject',
    value: function selectTextObject(selection) {
      var range = this.getRange(selection);
      if (range) {
        this.swrap(selection).setBufferRange(range, { reversed: this.reversed != null ? this.reversed : this.backward });
        return true;
      }
    }
  }]);

  return SearchMatchForward;
})(TextObject);

var SearchMatchBackward = (function (_SearchMatchForward) {
  _inherits(SearchMatchBackward, _SearchMatchForward);

  function SearchMatchBackward() {
    _classCallCheck(this, SearchMatchBackward);

    _get(Object.getPrototypeOf(SearchMatchBackward.prototype), 'constructor', this).apply(this, arguments);

    this.backward = true;
  }

  // [Limitation: won't fix]: Selected range is not submode aware. always characterwise.
  // So even if original selection was vL or vB, selected range by this text-object
  // is always vC range.
  return SearchMatchBackward;
})(SearchMatchForward);

var PreviousSelection = (function (_TextObject15) {
  _inherits(PreviousSelection, _TextObject15);

  function PreviousSelection() {
    _classCallCheck(this, PreviousSelection);

    _get(Object.getPrototypeOf(PreviousSelection.prototype), 'constructor', this).apply(this, arguments);

    this.wise = null;
    this.selectOnce = true;
  }

  _createClass(PreviousSelection, [{
    key: 'selectTextObject',
    value: function selectTextObject(selection) {
      var _vimState$previousSelection = this.vimState.previousSelection;
      var properties = _vimState$previousSelection.properties;
      var submode = _vimState$previousSelection.submode;

      if (properties && submode) {
        this.wise = submode;
        this.swrap(this.editor.getLastSelection()).selectByProperties(properties);
        return true;
      }
    }
  }]);

  return PreviousSelection;
})(TextObject);

var PersistentSelection = (function (_TextObject16) {
  _inherits(PersistentSelection, _TextObject16);

  function PersistentSelection() {
    _classCallCheck(this, PersistentSelection);

    _get(Object.getPrototypeOf(PersistentSelection.prototype), 'constructor', this).apply(this, arguments);

    this.wise = null;
    this.selectOnce = true;
  }

  // Used only by ReplaceWithRegister and PutBefore and its' children.

  _createClass(PersistentSelection, [{
    key: 'selectTextObject',
    value: function selectTextObject(selection) {
      if (this.vimState.hasPersistentSelections()) {
        this.persistentSelection.setSelectedBufferRanges();
        return true;
      }
    }
  }]);

  return PersistentSelection;
})(TextObject);

var LastPastedRange = (function (_TextObject17) {
  _inherits(LastPastedRange, _TextObject17);

  function LastPastedRange() {
    _classCallCheck(this, LastPastedRange);

    _get(Object.getPrototypeOf(LastPastedRange.prototype), 'constructor', this).apply(this, arguments);

    this.wise = null;
    this.selectOnce = true;
  }

  _createClass(LastPastedRange, [{
    key: 'selectTextObject',
    value: function selectTextObject(selection) {
      for (selection of this.editor.getSelections()) {
        var range = this.vimState.sequentialPasteManager.getPastedRangeForSelection(selection);
        selection.setBufferRange(range);
      }
      return true;
    }
  }], [{
    key: 'command',
    value: false,
    enumerable: true
  }]);

  return LastPastedRange;
})(TextObject);

var VisibleArea = (function (_TextObject18) {
  _inherits(VisibleArea, _TextObject18);

  function VisibleArea() {
    _classCallCheck(this, VisibleArea);

    _get(Object.getPrototypeOf(VisibleArea.prototype), 'constructor', this).apply(this, arguments);

    this.selectOnce = true;
  }

  _createClass(VisibleArea, [{
    key: 'getRange',
    value: function getRange(selection) {
      var _editor$getVisibleRowRange = this.editor.getVisibleRowRange();

      var _editor$getVisibleRowRange2 = _slicedToArray(_editor$getVisibleRowRange, 2);

      var startRow = _editor$getVisibleRowRange2[0];
      var endRow = _editor$getVisibleRowRange2[1];

      return this.editor.bufferRangeForScreenRange([[startRow, 0], [endRow, Infinity]]);
    }
  }]);

  return VisibleArea;
})(TextObject);

var DiffHunk = (function (_TextObject19) {
  _inherits(DiffHunk, _TextObject19);

  function DiffHunk() {
    _classCallCheck(this, DiffHunk);

    _get(Object.getPrototypeOf(DiffHunk.prototype), 'constructor', this).apply(this, arguments);

    this.wise = 'linewise';
    this.selectOnce = true;
  }

  _createClass(DiffHunk, [{
    key: 'getRange',
    value: function getRange(selection) {
      var row = this.getCursorPositionForSelection(selection).row;
      return this.utils.getHunkRangeAtBufferRow(this.editor, row);
    }
  }]);

  return DiffHunk;
})(TextObject);

module.exports = Object.assign({
  TextObject: TextObject,
  Word: Word,
  WholeWord: WholeWord,
  SmartWord: SmartWord,
  Subword: Subword,
  Pair: Pair,
  APair: APair,
  AnyPair: AnyPair,
  AnyPairAllowForwarding: AnyPairAllowForwarding,
  AnyQuote: AnyQuote,
  Quote: Quote,
  DoubleQuote: DoubleQuote,
  SingleQuote: SingleQuote,
  BackTick: BackTick,
  CurlyBracket: CurlyBracket,
  SquareBracket: SquareBracket,
  Parenthesis: Parenthesis,
  AngleBracket: AngleBracket,
  Tag: Tag,
  Paragraph: Paragraph,
  Indentation: Indentation,
  Comment: Comment,
  CommentOrParagraph: CommentOrParagraph,
  Fold: Fold,
  Function: Function,
  Arguments: Arguments,
  CurrentLine: CurrentLine,
  Entire: Entire,
  Empty: Empty,
  LatestChange: LatestChange,
  SearchMatchForward: SearchMatchForward,
  SearchMatchBackward: SearchMatchBackward,
  PreviousSelection: PreviousSelection,
  PersistentSelection: PersistentSelection,
  LastPastedRange: LastPastedRange,
  VisibleArea: VisibleArea
}, Word.deriveClass(true), WholeWord.deriveClass(true), SmartWord.deriveClass(true), Subword.deriveClass(true), AnyPair.deriveClass(true), AnyPairAllowForwarding.deriveClass(true), AnyQuote.deriveClass(true), DoubleQuote.deriveClass(true), SingleQuote.deriveClass(true), BackTick.deriveClass(true), CurlyBracket.deriveClass(true, true), SquareBracket.deriveClass(true, true), Parenthesis.deriveClass(true, true), AngleBracket.deriveClass(true, true), Tag.deriveClass(true), Paragraph.deriveClass(true), Indentation.deriveClass(true), Comment.deriveClass(true), BlockComment.deriveClass(true), CommentOrParagraph.deriveClass(true), Fold.deriveClass(true), Function.deriveClass(true), Arguments.deriveClass(true), CurrentLine.deriveClass(true), Entire.deriveClass(true), LatestChange.deriveClass(true), PersistentSelection.deriveClass(true), VisibleArea.deriveClass(true), DiffHunk.deriveClass(true));
// FIXME #472, #66
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9naXQvLmF0b20vcGFja2FnZXMvdmltLW1vZGUtcGx1cy9saWIvdGV4dC1vYmplY3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsV0FBVyxDQUFBOzs7Ozs7Ozs7Ozs7ZUFFWSxPQUFPLENBQUMsTUFBTSxDQUFDOztJQUEvQixLQUFLLFlBQUwsS0FBSztJQUFFLEtBQUssWUFBTCxLQUFLOzs7OztBQUtuQixJQUFNLElBQUksR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUE7QUFDOUIsSUFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFBOztJQUVyQyxVQUFVO1lBQVYsVUFBVTs7V0FBVixVQUFVOzBCQUFWLFVBQVU7OytCQUFWLFVBQVU7O1NBSWQsUUFBUSxHQUFHLElBQUk7U0FDZixJQUFJLEdBQUcsZUFBZTtTQUN0QixZQUFZLEdBQUcsS0FBSztTQUNwQixVQUFVLEdBQUcsS0FBSztTQUNsQixlQUFlLEdBQUcsS0FBSzs7Ozs7O2VBUm5CLFVBQVU7O1dBOENOLG1CQUFHO0FBQ1QsYUFBTyxJQUFJLENBQUMsS0FBSyxDQUFBO0tBQ2xCOzs7V0FFRyxlQUFHO0FBQ0wsYUFBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUE7S0FDbkI7OztXQUVVLHNCQUFHO0FBQ1osYUFBTyxJQUFJLENBQUMsSUFBSSxLQUFLLFVBQVUsQ0FBQTtLQUNoQzs7O1dBRVcsdUJBQUc7QUFDYixhQUFPLElBQUksQ0FBQyxJQUFJLEtBQUssV0FBVyxDQUFBO0tBQ2pDOzs7V0FFUyxtQkFBQyxJQUFJLEVBQUU7QUFDZixhQUFRLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0tBQzFCOzs7V0FFVSxzQkFBRztBQUNaLFVBQUksQ0FBQyxlQUFlLEdBQUcsS0FBSyxDQUFBO0tBQzdCOzs7Ozs7O1dBS08sbUJBQUc7O0FBRVQsVUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyxnQ0FBZ0MsQ0FB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QUFDLElBQUksQ0FBQyxFQUNyQyxXQUFXLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxFQUM3QixRQUFRLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUMzQixDQUFBIiwiZmlsZSI6Ii9Vc2Vycy9naXQvLmF0b20vcGFja2FnZXMvdmltLW1vZGUtcGx1cy9saWIvdGV4dC1vYmplY3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5jb25zdCB7UmFuZ2UsIFBvaW50fSA9IHJlcXVpcmUoJ2F0b20nKVxuXG4vLyBbVE9ET10gTmVlZCBvdmVyaGF1bFxuLy8gIC0gWyBdIE1ha2UgZXhwYW5kYWJsZSBieSBzZWxlY3Rpb24uZ2V0QnVmZmVyUmFuZ2UoKS51bmlvbih0aGlzLmdldFJhbmdlKHNlbGVjdGlvbikpXG4vLyAgLSBbIF0gQ291bnQgc3VwcG9ydChwcmlvcml0eSBsb3cpP1xuY29uc3QgQmFzZSA9IHJlcXVpcmUoJy4vYmFzZScpXG5jb25zdCBQYWlyRmluZGVyID0gcmVxdWlyZSgnLi9wYWlyLWZpbmRlcicpXG5cbmNsYXNzIFRleHRPYmplY3QgZXh0ZW5kcyBCYXNlIHtcbiAgc3RhdGljIG9wZXJhdGlvbktpbmQgPSAndGV4dC1vYmplY3QnXG4gIHN0YXRpYyBjb21tYW5kID0gZmFsc2VcblxuICBvcGVyYXRvciA9IG51bGxcbiAgd2lzZSA9ICdjaGFyYWN0ZXJ3aXNlJ1xuICBzdXBwb3J0Q291bnQgPSBmYWxzZSAvLyBGSVhNRSAjNDcyLCAjNjZcbiAgc2VsZWN0T25jZSA9IGZhbHNlXG4gIHNlbGVjdFN1Y2NlZWRlZCA9IGZhbHNlXG5cbiAgc3RhdGljIGRlcml2ZUNsYXNzIChpbm5lckFuZEEsIGlubmVyQW5kQUZvckFsbG93Rm9yd2FyZGluZykge1xuICAgIHRoaXMuY29tbWFuZCA9IGZhbHNlIC8vIEhBQ0s6IGtsYXNzIHRvIGRlcml2ZSBjaGlsZCBjbGFzcyBpcyBub3QgY29tbWFuZFxuICAgIGNvbnN0IHN0b3JlID0ge31cbiAgICBpZiAoaW5uZXJBbmRBKSB7XG4gICAgICBjb25zdCBrbGFzc0EgPSB0aGlzLmdlbmVyYXRlQ2xhc3MoZmFsc2UpXG4gICAgICBjb25zdCBrbGFzc0kgPSB0aGlzLmdlbmVyYXRlQ2xhc3ModHJ1ZSlcbiAgICAgIHN0b3JlW2tsYXNzQS5uYW1lXSA9IGtsYXNzQVxuICAgICAgc3RvcmVba2xhc3NJLm5hbWVdID0ga2xhc3NJXG4gICAgfVxuICAgIGlmIChpbm5lckFuZEFGb3JBbGxvd0ZvcndhcmRpbmcpIHtcbiAgICAgIGNvbnN0IGtsYXNzQSA9IHRoaXMuZ2VuZXJhdGVDbGFzcyhmYWxzZSwgdHJ1ZSlcbiAgICAgIGNvbnN0IGtsYXNzSSA9IHRoaXMuZ2VuZXJhdGVDbGFzcyh0cnVlLCB0cnVlKVxuICAgICAgc3RvcmVba2xhc3NBLm5hbWVdID0ga2xhc3NBXG4gICAgICBzdG9yZVtrbGFzc0kubmFtZV0gPSBrbGFzc0lcbiAgICB9XG4gICAgcmV0dXJuIHN0b3JlXG4gIH1cblxuICBzdGF0aWMgZ2VuZXJhdGVDbGFzcyAoaW5uZXIsIGFsbG93Rm9yd2FyZGluZykge1xuICAgIGxldCBuYW1lID0gKGlubmVyID8gJ0lubmVyJyA6ICdBJykgKyB0aGlzLm5hbWVcbiAgICBpZiAoYWxsb3dGb3J3YXJkaW5nKSB7XG4gICAgICBuYW1lICs9ICdBbGxvd0ZvcndhcmRpbmcnXG4gICAgfVxuXG4gICAgcmV0dXJuIGNsYXNzIGV4dGVuZHMgdGhpcyB7XG4gICAgICBzdGF0aWMgbmFtZSA9IG5hbWVcbiAgICAgIGNvbnN0cnVjdG9yICh2aW1TdGF0ZSkge1xuICAgICAgICBzdXBlcih2aW1TdGF0ZSlcbiAgICAgICAgdGhpcy5pbm5lciA9IGlubmVyXG4gICAgICAgIGlmIChhbGxvd0ZvcndhcmRpbmcgIT0gbnVsbCkge1xuICAgICAgICAgIHRoaXMuYWxsb3dGb3J3YXJkaW5nID0gYWxsb3dGb3J3YXJkaW5nXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBpc0lubmVyICgpIHtcbiAgICByZXR1cm4gdGhpcy5pbm5lclxuICB9XG5cbiAgaXNBICgpIHtcbiAgICByZXR1cm4gIXRoaXMuaW5uZXJcbiAgfVxuXG4gIGlzTGluZXdpc2UgKCkge1xuICAgIHJldHVybiB0aGlzLndpc2UgPT09ICdsaW5ld2lzZSdcbiAgfVxuXG4gIGlzQmxvY2t3aXNlICgpIHtcbiAgICByZXR1cm4gdGhpcy53aXNlID09PSAnYmxvY2t3aXNlJ1xuICB9XG5cbiAgZm9yY2VXaXNlICh3aXNlKSB7XG4gICAgcmV0dXJuICh0aGlzLndpc2UgPSB3aXNlKSAvLyBGSVhNRSBjdXJyZW50bHkgbm90IHdlbGwgc3VwcG9ydGVkXG4gIH1cblxuICByZXNldFN0YXRlICgpIHtcbiAgICB0aGlzLnNlbGVjdFN1Y2NlZWRlZCA9IGZhbHNlXG4gIH1cblxuICAvLyBleGVjdXRlOiBDYWxsZWQgZnJvbSBPcGVyYXRvcjo6c2VsZWN0VGFyZ2V0KClcbiAgLy8gIC0gYHYgaSBwYCwgaXMgYFZpc3VhbE1vZGVTZWxlY3RgIG9wZXJhdG9yIHdpdGggQHRhcmdldCA9IGBJbm5lclBhcmFncmFwaGAuXG4gIC8vICAtIGBkIGkgcGAsIGlzIGBEZWxldGVgIG9wZXJhdG9yIHdpdGggQHRhcmdldCA9IGBJbm5lclBhcmFncmFwaGAuXG4gIGV4ZWN1dGUgKCkge1xuICAgIC8vIFdoZW5uZXZlciBUZXh0T2JqZWN0IGlzIGV4ZWN1dGVkLCBpdCBoYXMgQG9wZXJhdG9yXG4gICAgaWYgKCF0aGlzLm9wZXJhdG9yKSB0aHJvdyBuZXcgRXJyb3IoJ2luIFRleHRPYmplY3Q6IE11c3Qgbm90IGhhcHBlbicpXG4gICAgdGhpcy5zZWxlY3QoKVxuICB9XG5cbiAgc2VsZWN0ICgpIHtcbiAgICBpZiAodGhpcy5pc01vZGUoJ3Zpc3VhbCcsICdibG9ja3dpc2UnKSkge1xuICAgICAgdGhpcy5zd3JhcC5ub3JtYWxpemUodGhpcy5lZGl0b3IpXG4gICAgfVxuXG4gICAgdGhpcy5jb3VudFRpbWVzKHRoaXMuZ2V0Q291bnQoKSwgKHtzdG9wfSkgPT4ge1xuICAgICAgaWYgKCF0aGlzLnN1cHBvcnRDb3VudCkgc3RvcCgpIC8vIHF1aWNrLWZpeCBmb3IgIzU2MFxuXG4gICAgICBmb3IgKGNvbnN0IHNlbGVjdGlvbiBvZiB0aGlzLmVkaXRvci5nZXRTZWxlY3Rpb25zKCkpIHtcbiAgICAgICAgY29uc3Qgb2xkUmFuZ2UgPSBzZWxlY3Rpb24uZ2V0QnVmZmVyUmFuZ2UoKVxuICAgICAgICBpZiAodGhpcy5zZWxlY3RUZXh0T2JqZWN0KHNlbGVjdGlvbikpIHRoaXMuc2VsZWN0U3VjY2VlZGVkID0gdHJ1ZVxuICAgICAgICBpZiAoc2VsZWN0aW9uLmdldEJ1ZmZlclJhbmdlKCkuaXNFcXVhbChvbGRSYW5nZSkpIHN0b3AoKVxuICAgICAgICBpZiAodGhpcy5zZWxlY3RPbmNlKSBicmVha1xuICAgICAgfVxuICAgIH0pXG5cbiAgICB0aGlzLmVkaXRvci5tZXJnZUludGVyc2VjdGluZ1NlbGVjdGlvbnMoKVxuICAgIC8vIFNvbWUgVGV4dE9iamVjdCdzIHdpc2UgaXMgTk9UIGRldGVybWluaXN0aWMuIEl0IGhhcyB0byBiZSBkZXRlY3RlZCBmcm9tIHNlbGVjdGVkIHJhbmdlLlxuICAgIGlmICh0aGlzLndpc2UgPT0gbnVsbCkgdGhpcy53aXNlID0gdGhpcy5zd3JhcC5kZXRlY3RXaXNlKHRoaXMuZWRpdG9yKVxuXG4gICAgaWYgKHRoaXMub3BlcmF0b3IuaW5zdGFuY2VvZignU2VsZWN0QmFzZScpKSB7XG4gICAgICBpZiAodGhpcy5zZWxlY3RTdWNjZWVkZWQpIHtcbiAgICAgICAgaWYgKHRoaXMud2lzZSA9PT0gJ2NoYXJhY3Rlcndpc2UnKSB7XG4gICAgICAgICAgdGhpcy5zd3JhcC5zYXZlUHJvcGVydGllcyh0aGlzLmVkaXRvciwge2ZvcmNlOiB0cnVlfSlcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLndpc2UgPT09ICdsaW5ld2lzZScpIHtcbiAgICAgICAgICAvLyBXaGVuIHRhcmdldCBpcyBwZXJzaXN0ZW50LXNlbGVjdGlvbiwgbmV3IHNlbGVjdGlvbiBpcyBhZGRlZCBhZnRlciBzZWxlY3RUZXh0T2JqZWN0LlxuICAgICAgICAgIC8vIFNvIHdlIGhhdmUgdG8gYXNzdXJlIGFsbCBzZWxlY3Rpb24gaGF2ZSBzZWxjdGlvbiBwcm9wZXJ0eS5cbiAgICAgICAgICAvLyBNYXliZSB0aGlzIGxvZ2ljIGNhbiBiZSBtb3ZlZCB0byBvcGVyYXRpb24gc3RhY2suXG4gICAgICAgICAgZm9yIChjb25zdCAkc2VsZWN0aW9uIG9mIHRoaXMuc3dyYXAuZ2V0U2VsZWN0aW9ucyh0aGlzLmVkaXRvcikpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmdldENvbmZpZygnc3RheU9uU2VsZWN0VGV4dE9iamVjdCcpKSB7XG4gICAgICAgICAgICAgIGlmICghJHNlbGVjdGlvbi5oYXNQcm9wZXJ0aWVzKCkpIHtcbiAgICAgICAgICAgICAgICAkc2VsZWN0aW9uLnNhdmVQcm9wZXJ0aWVzKClcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgJHNlbGVjdGlvbi5zYXZlUHJvcGVydGllcygpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAkc2VsZWN0aW9uLmZpeFByb3BlcnR5Um93VG9Sb3dSYW5nZSgpXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLnN1Ym1vZGUgPT09ICdibG9ja3dpc2UnKSB7XG4gICAgICAgIGZvciAoY29uc3QgJHNlbGVjdGlvbiBvZiB0aGlzLnN3cmFwLmdldFNlbGVjdGlvbnModGhpcy5lZGl0b3IpKSB7XG4gICAgICAgICAgJHNlbGVjdGlvbi5ub3JtYWxpemUoKVxuICAgICAgICAgICRzZWxlY3Rpb24uYXBwbHlXaXNlKCdibG9ja3dpc2UnKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gUmV0dXJuIHRydWUgb3IgZmFsc2VcbiAgc2VsZWN0VGV4dE9iamVjdCAoc2VsZWN0aW9uKSB7XG4gICAgY29uc3QgcmFuZ2UgPSB0aGlzLmdldFJhbmdlKHNlbGVjdGlvbilcbiAgICBpZiAocmFuZ2UpIHtcbiAgICAgIHRoaXMuc3dyYXAoc2VsZWN0aW9uKS5zZXRCdWZmZXJSYW5nZShyYW5nZSlcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cbiAgfVxuXG4gIC8vIHRvIG92ZXJyaWRlXG4gIGdldFJhbmdlIChzZWxlY3Rpb24pIHt9XG59XG5cbi8vIFNlY3Rpb246IFdvcmRcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT1cbmNsYXNzIFdvcmQgZXh0ZW5kcyBUZXh0T2JqZWN0IHtcbiAgZ2V0UmFuZ2UgKHNlbGVjdGlvbikge1xuICAgIGNvbnN0IHBvaW50ID0gdGhpcy5nZXRDdXJzb3JQb3NpdGlvbkZvclNlbGVjdGlvbihzZWxlY3Rpb24pXG4gICAgY29uc3Qge3JhbmdlfSA9IHRoaXMuZ2V0V29yZEJ1ZmZlclJhbmdlQW5kS2luZEF0QnVmZmVyUG9zaXRpb24ocG9pbnQsIHt3b3JkUmVnZXg6IHRoaXMud29yZFJlZ2V4fSlcbiAgICByZXR1cm4gdGhpcy5pc0EoKSA/IHRoaXMudXRpbHMuZXhwYW5kUmFuZ2VUb1doaXRlU3BhY2VzKHRoaXMuZWRpdG9yLCByYW5nZSkgOiByYW5nZVxuICB9XG59XG5cbmNsYXNzIFdob2xlV29yZCBleHRlbmRzIFdvcmQge1xuICB3b3JkUmVnZXggPSAvXFxTKy9cbn1cblxuLy8gSnVzdCBpbmNsdWRlIF8sIC1cbmNsYXNzIFNtYXJ0V29yZCBleHRlbmRzIFdvcmQge1xuICB3b3JkUmVnZXggPSAvW1xcdy1dKy9cbn1cblxuLy8gSnVzdCBpbmNsdWRlIF8sIC1cbmNsYXNzIFN1YndvcmQgZXh0ZW5kcyBXb3JkIHtcbiAgZ2V0UmFuZ2UgKHNlbGVjdGlvbikge1xuICAgIHRoaXMud29yZFJlZ2V4ID0gc2VsZWN0aW9uLmN1cnNvci5zdWJ3b3JkUmVnRXhwKClcbiAgICByZXR1cm4gc3VwZXIuZ2V0UmFuZ2Uoc2VsZWN0aW9uKVxuICB9XG59XG5cbi8vIFNlY3Rpb246IFBhaXJcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT1cbmNsYXNzIFBhaXIgZXh0ZW5kcyBUZXh0T2JqZWN0IHtcbiAgc3RhdGljIGNvbW1hbmQgPSBmYWxzZVxuICBzdXBwb3J0Q291bnQgPSB0cnVlXG4gIGFsbG93TmV4dExpbmUgPSBudWxsXG4gIGFkanVzdElubmVyUmFuZ2UgPSB0cnVlXG4gIHBhaXIgPSBudWxsXG4gIGluY2x1c2l2ZSA9IHRydWVcblxuICBpc0FsbG93TmV4dExpbmUgKCkge1xuICAgIGlmICh0aGlzLmFsbG93TmV4dExpbmUgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRoaXMuYWxsb3dOZXh0TGluZVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5wYWlyICYmIHRoaXMucGFpclswXSAhPT0gdGhpcy5wYWlyWzFdXG4gICAgfVxuICB9XG5cbiAgYWRqdXN0UmFuZ2UgKHtzdGFydCwgZW5kfSkge1xuICAgIC8vIERpcnR5IHdvcmsgdG8gZmVlbCBuYXR1cmFsIGZvciBodW1hbiwgdG8gYmVoYXZlIGNvbXBhdGlibGUgd2l0aCBwdXJlIFZpbS5cbiAgICAvLyBXaGVyZSB0aGlzIGFkanVzdG1lbnQgYXBwZWFyIGlzIGluIGZvbGxvd2luZyBzaXR1YXRpb24uXG4gICAgLy8gb3AtMTogYGNpe2AgcmVwbGFjZSBvbmx5IDJuZCBsaW5lXG4gICAgLy8gb3AtMjogYGRpe2AgZGVsZXRlIG9ubHkgMm5kIGxpbmUuXG4gICAgLy8gdGV4dDpcbiAgICAvLyAge1xuICAgIC8vICAgIGFhYVxuICAgIC8vICB9XG4gICAgaWYgKHRoaXMudXRpbHMucG9pbnRJc0F0RW5kT2ZMaW5lKHRoaXMuZWRpdG9yLCBzdGFydCkpIHtcbiAgICAgIHN0YXJ0ID0gc3RhcnQudHJhdmVyc2UoWzEsIDBdKVxuICAgIH1cblxuICAgIGlmICh0aGlzLnV0aWxzLmdldExpbmVUZXh0VG9CdWZmZXJQb3NpdGlvbih0aGlzLmVkaXRvciwgZW5kKS5tYXRjaCgvXlxccyokLykpIHtcbiAgICAgIGlmICh0aGlzLm1vZGUgPT09ICd2aXN1YWwnKSB7XG4gICAgICAgIC8vIFRoaXMgaXMgc2xpZ2h0bHkgaW5uY29uc2lzdGVudCB3aXRoIHJlZ3VsYXIgVmltXG4gICAgICAgIC8vIC0gcmVndWxhciBWaW06IHNlbGVjdCBuZXcgbGluZSBhZnRlciBFT0xcbiAgICAgICAgLy8gLSB2aW0tbW9kZS1wbHVzOiBzZWxlY3QgdG8gRU9MKGJlZm9yZSBuZXcgbGluZSlcbiAgICAgICAgLy8gVGhpcyBpcyBpbnRlbnRpb25hbCBzaW5jZSB0byBtYWtlIHN1Ym1vZGUgYGNoYXJhY3Rlcndpc2VgIHdoZW4gYXV0by1kZXRlY3Qgc3VibW9kZVxuICAgICAgICAvLyBpbm5lckVuZCA9IG5ldyBQb2ludChpbm5lckVuZC5yb3cgLSAxLCBJbmZpbml0eSlcbiAgICAgICAgZW5kID0gbmV3IFBvaW50KGVuZC5yb3cgLSAxLCBJbmZpbml0eSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGVuZCA9IG5ldyBQb2ludChlbmQucm93LCAwKVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbmV3IFJhbmdlKHN0YXJ0LCBlbmQpXG4gIH1cblxuICBnZXRGaW5kZXIgKCkge1xuICAgIGNvbnN0IGZpbmRlck5hbWUgPSB0aGlzLnBhaXJbMF0gPT09IHRoaXMucGFpclsxXSA/ICdRdW90ZUZpbmRlcicgOiAnQnJhY2tldEZpbmRlcidcbiAgICByZXR1cm4gbmV3IFBhaXJGaW5kZXJbZmluZGVyTmFtZV0odGhpcy5lZGl0b3IsIHtcbiAgICAgIGFsbG93TmV4dExpbmU6IHRoaXMuaXNBbGxvd05leHRMaW5lKCksXG4gICAgICBhbGxvd0ZvcndhcmRpbmc6IHRoaXMuYWxsb3dGb3J3YXJkaW5nLFxuICAgICAgcGFpcjogdGhpcy5wYWlyLFxuICAgICAgaW5jbHVzaXZlOiB0aGlzLmluY2x1c2l2ZVxuICAgIH0pXG4gIH1cblxuICBnZXRQYWlySW5mbyAoZnJvbSkge1xuICAgIGNvbnN0IHBhaXJJbmZvID0gdGhpcy5nZXRGaW5kZXIoKS5maW5kKGZyb20pXG4gICAgaWYgKHBhaXJJbmZvKSB7XG4gICAgICBpZiAodGhpcy5hZGp1c3RJbm5lclJhbmdlKSB7XG4gICAgICAgIHBhaXJJbmZvLmlubmVyUmFuZ2UgPSB0aGlzLmFkanVzdFJhbmdlKHBhaXJJbmZvLmlubmVyUmFuZ2UpXG4gICAgICB9XG4gICAgICBwYWlySW5mby50YXJnZXRSYW5nZSA9IHRoaXMuaXNJbm5lcigpID8gcGFpckluZm8uaW5uZXJSYW5nZSA6IHBhaXJJbmZvLmFSYW5nZVxuICAgICAgcmV0dXJuIHBhaXJJbmZvXG4gICAgfVxuICB9XG5cbiAgZ2V0UmFuZ2UgKHNlbGVjdGlvbikge1xuICAgIGNvbnN0IG9yaWdpbmFsUmFuZ2UgPSBzZWxlY3Rpb24uZ2V0QnVmZmVyUmFuZ2UoKVxuICAgIGxldCBwYWlySW5mbyA9IHRoaXMuZ2V0UGFpckluZm8odGhpcy5nZXRDdXJzb3JQb3NpdGlvbkZvclNlbGVjdGlvbihzZWxlY3Rpb24pKVxuICAgIC8vIFdoZW4gcmFuZ2Ugd2FzIHNhbWUsIHRyeSB0byBleHBhbmQgcmFuZ2VcbiAgICBpZiAocGFpckluZm8gJiYgcGFpckluZm8udGFyZ2V0UmFuZ2UuaXNFcXVhbChvcmlnaW5hbFJhbmdlKSkge1xuICAgICAgcGFpckluZm8gPSB0aGlzLmdldFBhaXJJbmZvKHBhaXJJbmZvLmFSYW5nZS5lbmQpXG4gICAgfVxuICAgIGlmIChwYWlySW5mbykge1xuICAgICAgcmV0dXJuIHBhaXJJbmZvLnRhcmdldFJhbmdlXG4gICAgfVxuICB9XG59XG5cbi8vIFVzZWQgYnkgRGVsZXRlU3Vycm91bmRcbmNsYXNzIEFQYWlyIGV4dGVuZHMgUGFpciB7XG4gIHN0YXRpYyBjb21tYW5kID0gZmFsc2Vcbn1cblxuY2xhc3MgQW55UGFpciBleHRlbmRzIFBhaXIge1xuICBhbGxvd0ZvcndhcmRpbmcgPSBmYWxzZVxuICBtZW1iZXIgPSBbJ0RvdWJsZVF1b3RlJywgJ1NpbmdsZVF1b3RlJywgJ0JhY2tUaWNrJywgJ0N1cmx5QnJhY2tldCcsICdBbmdsZUJyYWNrZXQnLCAnU3F1YXJlQnJhY2tldCcsICdQYXJlbnRoZXNpcyddXG5cbiAgZ2V0UmFuZ2VzIChzZWxlY3Rpb24pIHtcbiAgICBjb25zdCBvcHRpb25zID0ge1xuICAgICAgaW5uZXI6IHRoaXMuaW5uZXIsXG4gICAgICBhbGxvd0ZvcndhcmRpbmc6IHRoaXMuYWxsb3dGb3J3YXJkaW5nLFxuICAgICAgaW5jbHVzaXZlOiB0aGlzLmluY2x1c2l2ZVxuICAgIH1cbiAgICBjb25zdCBnZXRSYW5nZUJ5TWVtYmVyID0gbWVtYmVyID0+IHRoaXMuZ2V0SW5zdGFuY2UobWVtYmVyLCBvcHRpb25zKS5nZXRSYW5nZShzZWxlY3Rpb24pXG4gICAgcmV0dXJuIHRoaXMubWVtYmVyLm1hcChnZXRSYW5nZUJ5TWVtYmVyKS5maWx0ZXIodiA9PiB2KVxuICB9XG5cbiAgZ2V0UmFuZ2UgKHNlbGVjdGlvbikge1xuICAgIHJldHVybiB0aGlzLnV0aWxzLnNvcnRSYW5nZXModGhpcy5nZXRSYW5nZXMoc2VsZWN0aW9uKSkucG9wKClcbiAgfVxufVxuXG5jbGFzcyBBbnlQYWlyQWxsb3dGb3J3YXJkaW5nIGV4dGVuZHMgQW55UGFpciB7XG4gIGFsbG93Rm9yd2FyZGluZyA9IHRydWVcblxuICBnZXRSYW5nZSAoc2VsZWN0aW9uKSB7XG4gICAgY29uc3QgcmFuZ2VzID0gdGhpcy5nZXRSYW5nZXMoc2VsZWN0aW9uKVxuICAgIGNvbnN0IGZyb20gPSBzZWxlY3Rpb24uY3Vyc29yLmdldEJ1ZmZlclBvc2l0aW9uKClcbiAgICBsZXQgW2ZvcndhcmRpbmdSYW5nZXMsIGVuY2xvc2luZ1Jhbmdlc10gPSB0aGlzLl8ucGFydGl0aW9uKHJhbmdlcywgcmFuZ2UgPT4gcmFuZ2Uuc3RhcnQuaXNHcmVhdGVyVGhhbk9yRXF1YWwoZnJvbSkpXG4gICAgY29uc3QgZW5jbG9zaW5nUmFuZ2UgPSB0aGlzLnV0aWxzLnNvcnRSYW5nZXMoZW5jbG9zaW5nUmFuZ2VzKS5wb3AoKVxuICAgIGZvcndhcmRpbmdSYW5nZXMgPSB0aGlzLnV0aWxzLnNvcnRSYW5nZXMoZm9yd2FyZGluZ1JhbmdlcylcblxuICAgIC8vIFdoZW4gZW5jbG9zaW5nUmFuZ2UgaXMgZXhpc3RzLFxuICAgIC8vIFdlIGRvbid0IGdvIGFjcm9zcyBlbmNsb3NpbmdSYW5nZS5lbmQuXG4gICAgLy8gU28gY2hvb3NlIGZyb20gcmFuZ2VzIGNvbnRhaW5lZCBpbiBlbmNsb3NpbmdSYW5nZS5cbiAgICBpZiAoZW5jbG9zaW5nUmFuZ2UpIHtcbiAgICAgIGZvcndhcmRpbmdSYW5nZXMgPSBmb3J3YXJkaW5nUmFuZ2VzLmZpbHRlcihyYW5nZSA9PiBlbmNsb3NpbmdSYW5nZS5jb250YWluc1JhbmdlKHJhbmdlKSlcbiAgICB9XG5cbiAgICByZXR1cm4gZm9yd2FyZGluZ1Jhbmdlc1swXSB8fCBlbmNsb3NpbmdSYW5nZVxuICB9XG59XG5cbmNsYXNzIEFueVF1b3RlIGV4dGVuZHMgQW55UGFpciB7XG4gIGFsbG93Rm9yd2FyZGluZyA9IHRydWVcbiAgbWVtYmVyID0gWydEb3VibGVRdW90ZScsICdTaW5nbGVRdW90ZScsICdCYWNrVGljayddXG5cbiAgZ2V0UmFuZ2UgKHNlbGVjdGlvbikge1xuICAgIC8vIFBpY2sgcmFuZ2Ugd2hpY2ggZW5kLmNvbHVtIGlzIGxlZnRtb3N0KG1lYW4sIGNsb3NlZCBmaXJzdClcbiAgICByZXR1cm4gdGhpcy5nZXRSYW5nZXMoc2VsZWN0aW9uKS5zb3J0KChhLCBiKSA9PiBhLmVuZC5jb2x1bW4gLSBiLmVuZC5jb2x1bW4pWzBdXG4gIH1cbn1cblxuY2xhc3MgUXVvdGUgZXh0ZW5kcyBQYWlyIHtcbiAgc3RhdGljIGNvbW1hbmQgPSBmYWxzZVxuICBhbGxvd0ZvcndhcmRpbmcgPSB0cnVlXG59XG5cbmNsYXNzIERvdWJsZVF1b3RlIGV4dGVuZHMgUXVvdGUge1xuICBwYWlyID0gWydcIicsICdcIiddXG59XG5cbmNsYXNzIFNpbmdsZVF1b3RlIGV4dGVuZHMgUXVvdGUge1xuICBwYWlyID0gW1wiJ1wiLCBcIidcIl1cbn1cblxuY2xhc3MgQmFja1RpY2sgZXh0ZW5kcyBRdW90ZSB7XG4gIHBhaXIgPSBbJ2AnLCAnYCddXG59XG5cbmNsYXNzIEN1cmx5QnJhY2tldCBleHRlbmRzIFBhaXIge1xuICBwYWlyID0gWyd7JywgJ30nXVxufVxuXG5jbGFzcyBTcXVhcmVCcmFja2V0IGV4dGVuZHMgUGFpciB7XG4gIHBhaXIgPSBbJ1snLCAnXSddXG59XG5cbmNsYXNzIFBhcmVudGhlc2lzIGV4dGVuZHMgUGFpciB7XG4gIHBhaXIgPSBbJygnLCAnKSddXG59XG5cbmNsYXNzIEFuZ2xlQnJhY2tldCBleHRlbmRzIFBhaXIge1xuICBwYWlyID0gWyc8JywgJz4nXVxufVxuXG5jbGFzcyBUYWcgZXh0ZW5kcyBQYWlyIHtcbiAgYWxsb3dOZXh0TGluZSA9IHRydWVcbiAgYWxsb3dGb3J3YXJkaW5nID0gdHJ1ZVxuICBhZGp1c3RJbm5lclJhbmdlID0gZmFsc2VcblxuICBnZXRUYWdTdGFydFBvaW50IChmcm9tKSB7XG4gICAgY29uc3QgcmVnZXggPSBQYWlyRmluZGVyLlRhZ0ZpbmRlci5wYXR0ZXJuXG4gICAgY29uc3Qgb3B0aW9ucyA9IHtmcm9tOiBbZnJvbS5yb3csIDBdfVxuICAgIHJldHVybiB0aGlzLmZpbmRJbkVkaXRvcignZm9yd2FyZCcsIHJlZ2V4LCBvcHRpb25zLCAoe3JhbmdlfSkgPT4gcmFuZ2UuY29udGFpbnNQb2ludChmcm9tLCB0cnVlKSAmJiByYW5nZS5zdGFydClcbiAgfVxuXG4gIGdldEZpbmRlciAoKSB7XG4gICAgcmV0dXJuIG5ldyBQYWlyRmluZGVyLlRhZ0ZpbmRlcih0aGlzLmVkaXRvciwge1xuICAgICAgYWxsb3dOZXh0TGluZTogdGhpcy5pc0FsbG93TmV4dExpbmUoKSxcbiAgICAgIGFsbG93Rm9yd2FyZGluZzogdGhpcy5hbGxvd0ZvcndhcmRpbmcsXG4gICAgICBpbmNsdXNpdmU6IHRoaXMuaW5jbHVzaXZlXG4gICAgfSlcbiAgfVxuXG4gIGdldFBhaXJJbmZvIChmcm9tKSB7XG4gICAgcmV0dXJuIHN1cGVyLmdldFBhaXJJbmZvKHRoaXMuZ2V0VGFnU3RhcnRQb2ludChmcm9tKSB8fCBmcm9tKVxuICB9XG59XG5cbi8vIFNlY3Rpb246IFBhcmFncmFwaFxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gUGFyYWdyYXBoIGlzIGRlZmluZWQgYXMgY29uc2VjdXRpdmUgKG5vbi0pYmxhbmstbGluZS5cbmNsYXNzIFBhcmFncmFwaCBleHRlbmRzIFRleHRPYmplY3Qge1xuICB3aXNlID0gJ2xpbmV3aXNlJ1xuICBzdXBwb3J0Q291bnQgPSB0cnVlXG5cbiAgZmluZFJvdyAoZnJvbVJvdywgZGlyZWN0aW9uLCBmbikge1xuICAgIGlmIChmbi5yZXNldCkgZm4ucmVzZXQoKVxuICAgIGxldCBmb3VuZFJvdyA9IGZyb21Sb3dcbiAgICBmb3IgKGNvbnN0IHJvdyBvZiB0aGlzLmdldEJ1ZmZlclJvd3Moe3N0YXJ0Um93OiBmcm9tUm93LCBkaXJlY3Rpb259KSkge1xuICAgICAgaWYgKCFmbihyb3csIGRpcmVjdGlvbikpIGJyZWFrXG4gICAgICBmb3VuZFJvdyA9IHJvd1xuICAgIH1cbiAgICByZXR1cm4gZm91bmRSb3dcbiAgfVxuXG4gIGZpbmRSb3dSYW5nZUJ5IChmcm9tUm93LCBmbikge1xuICAgIGNvbnN0IHN0YXJ0Um93ID0gdGhpcy5maW5kUm93KGZyb21Sb3csICdwcmV2aW91cycsIGZuKVxuICAgIGNvbnN0IGVuZFJvdyA9IHRoaXMuZmluZFJvdyhmcm9tUm93LCAnbmV4dCcsIGZuKVxuICAgIHJldHVybiBbc3RhcnRSb3csIGVuZFJvd11cbiAgfVxuXG4gIGdldFByZWRpY3RGdW5jdGlvbiAoZnJvbVJvdywgc2VsZWN0aW9uKSB7XG4gICAgY29uc3QgZnJvbVJvd1Jlc3VsdCA9IHRoaXMuZWRpdG9yLmlzQnVmZmVyUm93QmxhbmsoZnJvbVJvdylcblxuICAgIGlmICh0aGlzLmlzSW5uZXIoKSkge1xuICAgICAgcmV0dXJuIChyb3csIGRpcmVjdGlvbikgPT4gdGhpcy5lZGl0b3IuaXNCdWZmZXJSb3dCbGFuayhyb3cpID09PSBmcm9tUm93UmVzdWx0XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGRpcmVjdGlvblRvRXh0ZW5kID0gc2VsZWN0aW9uLmlzUmV2ZXJzZWQoKSA/ICdwcmV2aW91cycgOiAnbmV4dCdcblxuICAgICAgbGV0IGZsaXAgPSBmYWxzZVxuICAgICAgY29uc3QgcHJlZGljdCA9IChyb3csIGRpcmVjdGlvbikgPT4ge1xuICAgICAgICBjb25zdCByZXN1bHQgPSB0aGlzLmVkaXRvci5pc0J1ZmZlclJvd0JsYW5rKHJvdykgPT09IGZyb21Sb3dSZXN1bHRcbiAgICAgICAgaWYgKGZsaXApIHtcbiAgICAgICAgICByZXR1cm4gIXJlc3VsdFxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmICghcmVzdWx0ICYmIGRpcmVjdGlvbiA9PT0gZGlyZWN0aW9uVG9FeHRlbmQpIHtcbiAgICAgICAgICAgIHJldHVybiAoZmxpcCA9IHRydWUpXG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiByZXN1bHRcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcHJlZGljdC5yZXNldCA9ICgpID0+IChmbGlwID0gZmFsc2UpXG4gICAgICByZXR1cm4gcHJlZGljdFxuICAgIH1cbiAgfVxuXG4gIGdldFJhbmdlIChzZWxlY3Rpb24pIHtcbiAgICBsZXQgZnJvbVJvdyA9IHRoaXMuZ2V0Q3Vyc29yUG9zaXRpb25Gb3JTZWxlY3Rpb24oc2VsZWN0aW9uKS5yb3dcbiAgICBpZiAodGhpcy5pc01vZGUoJ3Zpc3VhbCcsICdsaW5ld2lzZScpKSB7XG4gICAgICBpZiAoc2VsZWN0aW9uLmlzUmV2ZXJzZWQoKSkgZnJvbVJvdy0tXG4gICAgICBlbHNlIGZyb21Sb3crK1xuICAgICAgZnJvbVJvdyA9IHRoaXMuZ2V0VmFsaWRWaW1CdWZmZXJSb3coZnJvbVJvdylcbiAgICB9XG4gICAgY29uc3Qgcm93UmFuZ2UgPSB0aGlzLmZpbmRSb3dSYW5nZUJ5KGZyb21Sb3csIHRoaXMuZ2V0UHJlZGljdEZ1bmN0aW9uKGZyb21Sb3csIHNlbGVjdGlvbikpXG4gICAgcmV0dXJuIHNlbGVjdGlvbi5nZXRCdWZmZXJSYW5nZSgpLnVuaW9uKHRoaXMuZ2V0QnVmZmVyUmFuZ2VGb3JSb3dSYW5nZShyb3dSYW5nZSkpXG4gIH1cbn1cblxuY2xhc3MgSW5kZW50YXRpb24gZXh0ZW5kcyBQYXJhZ3JhcGgge1xuICBnZXRSYW5nZSAoc2VsZWN0aW9uKSB7XG4gICAgY29uc3QgZnJvbVJvdyA9IHRoaXMuZ2V0Q3Vyc29yUG9zaXRpb25Gb3JTZWxlY3Rpb24oc2VsZWN0aW9uKS5yb3dcbiAgICBjb25zdCBiYXNlSW5kZW50TGV2ZWwgPSB0aGlzLmVkaXRvci5pbmRlbnRhdGlvbkZvckJ1ZmZlclJvdyhmcm9tUm93KVxuICAgIGNvbnN0IHJvd1JhbmdlID0gdGhpcy5maW5kUm93UmFuZ2VCeShmcm9tUm93LCByb3cgPT4ge1xuICAgICAgaWYgKHRoaXMuZWRpdG9yLmlzQnVmZmVyUm93Qmxhbmsocm93KSkge1xuICAgICAgICByZXR1cm4gdGhpcy5pc0EoKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWRpdG9yLmluZGVudGF0aW9uRm9yQnVmZmVyUm93KHJvdykgPj0gYmFzZUluZGVudExldmVsXG4gICAgICB9XG4gICAgfSlcbiAgICByZXR1cm4gdGhpcy5nZXRCdWZmZXJSYW5nZUZvclJvd1JhbmdlKHJvd1JhbmdlKVxuICB9XG59XG5cbi8vIFNlY3Rpb246IENvbW1lbnRcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT1cbmNsYXNzIENvbW1lbnQgZXh0ZW5kcyBUZXh0T2JqZWN0IHtcbiAgd2lzZSA9ICdsaW5ld2lzZSdcblxuICBnZXRSYW5nZSAoc2VsZWN0aW9uKSB7XG4gICAgY29uc3Qge3Jvd30gPSB0aGlzLmdldEN1cnNvclBvc2l0aW9uRm9yU2VsZWN0aW9uKHNlbGVjdGlvbilcbiAgICBjb25zdCByb3dSYW5nZSA9IHRoaXMudXRpbHMuZ2V0Um93UmFuZ2VGb3JDb21tZW50QXRCdWZmZXJSb3codGhpcy5lZGl0b3IsIHJvdylcbiAgICBpZiAocm93UmFuZ2UpIHtcbiAgICAgIHJldHVybiB0aGlzLmdldEJ1ZmZlclJhbmdlRm9yUm93UmFuZ2Uocm93UmFuZ2UpXG4gICAgfVxuICB9XG59XG5cbmNsYXNzIEJsb2NrQ29tbWVudCBleHRlbmRzIFRleHRPYmplY3Qge1xuICB3aXNlID0gJ2NoYXJhY3Rlcndpc2UnXG5cbiAgZ2V0UmFuZ2UgKHNlbGVjdGlvbikge1xuICAgIC8vIEZvbGxvd2luZyBvbmUtY29sdW1uLXJpZ2h0IHRyYW5zbGF0aW9uIGlzIG5lY2Vzc2FyeSB3aGVuIGN1cnNvciBpcyBcIm9uXCIgYC9gIGNoYXIgb2YgYmVnaW5uaW5nIGAvKmAuXG4gICAgY29uc3QgZnJvbSA9IHRoaXMuZWRpdG9yLmNsaXBCdWZmZXJQb3NpdGlvbih0aGlzLmdldEN1cnNvclBvc2l0aW9uRm9yU2VsZWN0aW9uKHNlbGVjdGlvbikudHJhbnNsYXRlKFswLCAxXSkpXG5cbiAgICBjb25zdCByYW5nZSA9IHRoaXMuZ2V0QmxvY2tDb21tZW50UmFuZ2VGb3JQb2ludChmcm9tKVxuICAgIGlmIChyYW5nZSkge1xuICAgICAgcmFuZ2Uuc3RhcnQgPSB0aGlzLmdldFN0YXJ0T2ZCbG9ja0NvbW1lbnQocmFuZ2Uuc3RhcnQpXG4gICAgICByYW5nZS5lbmQgPSB0aGlzLmdldEVuZE9mQmxvY2tDb21tZW50KHJhbmdlLmVuZClcbiAgICAgIGNvbnN0IHNjYW5SYW5nZSA9IHJhbmdlXG5cbiAgICAgIGlmICh0aGlzLmlzSW5uZXIoKSkge1xuICAgICAgICB0aGlzLnNjYW5FZGl0b3IoJ2ZvcndhcmQnLCAvXFxzKy8sIHtzY2FuUmFuZ2V9LCBldmVudCA9PiB7XG4gICAgICAgICAgcmFuZ2Uuc3RhcnQgPSBldmVudC5yYW5nZS5lbmRcbiAgICAgICAgICBldmVudC5zdG9wKClcbiAgICAgICAgfSlcbiAgICAgICAgdGhpcy5zY2FuRWRpdG9yKCdiYWNrd2FyZCcsIC9cXHMrLywge3NjYW5SYW5nZX0sIGV2ZW50ID0+IHtcbiAgICAgICAgICByYW5nZS5lbmQgPSBldmVudC5yYW5nZS5zdGFydFxuICAgICAgICAgIGV2ZW50LnN0b3AoKVxuICAgICAgICB9KVxuICAgICAgfVxuICAgICAgcmV0dXJuIHJhbmdlXG4gICAgfVxuICB9XG5cbiAgZ2V0U3RhcnRPZkJsb2NrQ29tbWVudCAoc3RhcnQpIHtcbiAgICB3aGlsZSAoc3RhcnQuY29sdW1uID09PSAwKSB7XG4gICAgICBjb25zdCByYW5nZSA9IHRoaXMuZ2V0QmxvY2tDb21tZW50UmFuZ2VGb3JQb2ludChzdGFydC50cmFuc2xhdGUoWy0xLCBJbmZpbml0eV0pKVxuICAgICAgaWYgKCFyYW5nZSkgYnJlYWtcbiAgICAgIHN0YXJ0ID0gcmFuZ2Uuc3RhcnRcbiAgICB9XG4gICAgcmV0dXJuIHN0YXJ0XG4gIH1cblxuICBnZXRFbmRPZkJsb2NrQ29tbWVudCAoZW5kKSB7XG4gICAgd2hpbGUgKHRoaXMudXRpbHMucG9pbnRJc0F0RW5kT2ZMaW5lKHRoaXMuZWRpdG9yLCBlbmQpKSB7XG4gICAgICBjb25zdCByYW5nZSA9IHRoaXMuZ2V0QmxvY2tDb21tZW50UmFuZ2VGb3JQb2ludChbZW5kLnJvdyArIDEsIDBdKVxuICAgICAgaWYgKCFyYW5nZSkgYnJlYWtcbiAgICAgIGVuZCA9IHJhbmdlLmVuZFxuICAgIH1cbiAgICByZXR1cm4gZW5kXG4gIH1cblxuICBnZXRCbG9ja0NvbW1lbnRSYW5nZUZvclBvaW50IChwb2ludCkge1xuICAgIGNvbnN0IHNjb3BlID0gJ2NvbW1lbnQuYmxvY2snXG4gICAgcmV0dXJuIHRoaXMuZWRpdG9yLmJ1ZmZlclJhbmdlRm9yU2NvcGVBdFBvc2l0aW9uKHNjb3BlLCBwb2ludClcbiAgfVxufVxuXG5jbGFzcyBDb21tZW50T3JQYXJhZ3JhcGggZXh0ZW5kcyBUZXh0T2JqZWN0IHtcbiAgd2lzZSA9ICdsaW5ld2lzZSdcblxuICBnZXRSYW5nZSAoc2VsZWN0aW9uKSB7XG4gICAgY29uc3Qge2lubmVyfSA9IHRoaXNcbiAgICBmb3IgKGNvbnN0IGtsYXNzIG9mIFsnQ29tbWVudCcsICdQYXJhZ3JhcGgnXSkge1xuICAgICAgY29uc3QgcmFuZ2UgPSB0aGlzLmdldEluc3RhbmNlKGtsYXNzLCB7aW5uZXJ9KS5nZXRSYW5nZShzZWxlY3Rpb24pXG4gICAgICBpZiAocmFuZ2UpIHtcbiAgICAgICAgcmV0dXJuIHJhbmdlXG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbi8vIFNlY3Rpb246IEZvbGRcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT1cbmNsYXNzIEZvbGQgZXh0ZW5kcyBUZXh0T2JqZWN0IHtcbiAgd2lzZSA9ICdsaW5ld2lzZSdcblxuICBnZXRSYW5nZSAoc2VsZWN0aW9uKSB7XG4gICAgY29uc3Qge3Jvd30gPSB0aGlzLmdldEN1cnNvclBvc2l0aW9uRm9yU2VsZWN0aW9uKHNlbGVjdGlvbilcbiAgICBjb25zdCBzZWxlY3RlZFJhbmdlID0gc2VsZWN0aW9uLmdldEJ1ZmZlclJhbmdlKClcbiAgICBjb25zdCBmb2xkUmFuZ2VzID0gdGhpcy51dGlscy5nZXRDb2RlRm9sZFJhbmdlcyh0aGlzLmVkaXRvcilcbiAgICBjb25zdCBmb2xkUmFuZ2VzQ29udGFpbnNDdXJzb3JSb3cgPSBmb2xkUmFuZ2VzLmZpbHRlcihyYW5nZSA9PiByYW5nZS5zdGFydC5yb3cgPD0gcm93ICYmIHJvdyA8PSByYW5nZS5lbmQucm93KVxuICAgIGNvbnN0IHVzZVRyZWVTaXR0ZXIgPSB0aGlzLnV0aWxzLmlzVXNpbmdUcmVlU2l0dGVyKHNlbGVjdGlvbi5lZGl0b3IpXG5cbiAgICBmb3IgKGxldCBmb2xkUmFuZ2Ugb2YgZm9sZFJhbmdlc0NvbnRhaW5zQ3Vyc29yUm93LnJldmVyc2UoKSkge1xuICAgICAgaWYgKHRoaXMuaXNBKCkpIHtcbiAgICAgICAgZm9sZFJhbmdlID0gdW5pb25Db25qb2luZWRGb2xkUmFuZ2UoZm9sZFJhbmdlLCBmb2xkUmFuZ2VzLCB7dXNlVHJlZVNpdHRlcn0pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodGhpcy51dGlscy5kb2VzUmFuZ2VTdGFydEFuZEVuZFdpdGhTYW1lSW5kZW50TGV2ZWwodGhpcy5lZGl0b3IsIGZvbGRSYW5nZSkpIHtcbiAgICAgICAgICBmb2xkUmFuZ2UuZW5kLnJvdyAtPSAxXG4gICAgICAgIH1cbiAgICAgICAgZm9sZFJhbmdlLnN0YXJ0LnJvdyArPSAxXG4gICAgICB9XG4gICAgICBmb2xkUmFuZ2UgPSB0aGlzLmdldEJ1ZmZlclJhbmdlRm9yUm93UmFuZ2UoW2ZvbGRSYW5nZS5zdGFydC5yb3csIGZvbGRSYW5nZS5lbmQucm93XSlcbiAgICAgIGlmICghc2VsZWN0ZWRSYW5nZS5jb250YWluc1JhbmdlKGZvbGRSYW5nZSkpIHtcbiAgICAgICAgcmV0dXJuIGZvbGRSYW5nZVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiB1bmlvbkNvbmpvaW5lZEZvbGRSYW5nZSAoZm9sZFJhbmdlLCBmb2xkUmFuZ2VzLCB7dXNlVHJlZVNpdHRlcn0pIHtcbiAgY29uc3QgaW5kZXggPSBmb2xkUmFuZ2VzLmZpbmRJbmRleChyYW5nZSA9PiByYW5nZSA9PT0gZm9sZFJhbmdlKVxuXG4gIC8vIEV4dGVuZCB0byBkb3dud2FyZHNcbiAgZm9yIChsZXQgaSA9IGluZGV4ICsgMTsgaSA8IGZvbGRSYW5nZXMubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoZm9sZFJhbmdlLmVuZC5jb2x1bW4gIT09IEluZmluaXR5KSBicmVha1xuICAgIGNvbnN0IGVuZFJvdyA9IHVzZVRyZWVTaXR0ZXIgPyBmb2xkUmFuZ2UuZW5kLnJvdyArIDEgOiBmb2xkUmFuZ2UuZW5kLnJvd1xuICAgIGlmIChmb2xkUmFuZ2VzW2ldLnN0YXJ0LmlzRXF1YWwoW2VuZFJvdywgSW5maW5pdHldKSkge1xuICAgICAgZm9sZFJhbmdlID0gZm9sZFJhbmdlLnVuaW9uKGZvbGRSYW5nZXNbaV0pXG4gICAgfVxuICB9XG5cbiAgLy8gRXh0ZW5kIHRvIHVwd2FyZHNcbiAgZm9yIChsZXQgaSA9IGluZGV4IC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICBpZiAoZm9sZFJhbmdlLnN0YXJ0LmNvbHVtbiAhPT0gSW5maW5pdHkpIGJyZWFrXG4gICAgY29uc3Qgc3RhcnRSb3cgPSB1c2VUcmVlU2l0dGVyID8gZm9sZFJhbmdlLnN0YXJ0LnJvdyAtIDEgOiBmb2xkUmFuZ2Uuc3RhcnQucm93XG4gICAgaWYgKGZvbGRSYW5nZXNbaV0uZW5kLmlzRXF1YWwoW3N0YXJ0Um93LCBJbmZpbml0eV0pKSB7XG4gICAgICBmb2xkUmFuZ2UgPSBmb2xkUmFuZ2UudW5pb24oZm9sZFJhbmdlc1tpXSlcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZm9sZFJhbmdlXG59XG5cbmNsYXNzIEZ1bmN0aW9uIGV4dGVuZHMgVGV4dE9iamVjdCB7XG4gIHdpc2UgPSAnbGluZXdpc2UnXG4gIHNjb3BlTmFtZXNPbWl0dGluZ0Nsb3NpbmdCcmFjZSA9IFsnc291cmNlLmdvJywgJ3NvdXJjZS5lbGl4aXInXSAvLyBsYW5ndWFnZSBkb2Vzbid0IGluY2x1ZGUgY2xvc2luZyBgfWAgaW50byBmb2xkLlxuXG4gIGdldEZ1bmN0aW9uQm9keVN0YXJ0UmVnZXggKHtzY29wZU5hbWV9KSB7XG4gICAgaWYgKHNjb3BlTmFtZSA9PT0gJ3NvdXJjZS5weXRob24nKSB7XG4gICAgICByZXR1cm4gLzokL1xuICAgIH0gZWxzZSBpZiAoc2NvcGVOYW1lID09PSAnc291cmNlLmNvZmZlZScpIHtcbiAgICAgIHJldHVybiAvLXw9PiQvXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAveyQvXG4gICAgfVxuICB9XG5cbiAgaXNNdWx0aUxpbmVQYXJhbWV0ZXJGdW5jdGlvblJhbmdlIChwYXJhbWV0ZXJSYW5nZSwgYm9keVJhbmdlLCBib2R5U3RhcnRSZWdleCkge1xuICAgIGNvbnN0IGlzQm9keVN0YXJ0Um93ID0gcm93ID0+IGJvZHlTdGFydFJlZ2V4LnRlc3QodGhpcy5lZGl0b3IubGluZVRleHRGb3JCdWZmZXJSb3cocm93KSlcbiAgICBpZiAoaXNCb2R5U3RhcnRSb3cocGFyYW1ldGVyUmFuZ2Uuc3RhcnQucm93KSkgcmV0dXJuIGZhbHNlXG4gICAgaWYgKGlzQm9keVN0YXJ0Um93KHBhcmFtZXRlclJhbmdlLmVuZC5yb3cpKSByZXR1cm4gcGFyYW1ldGVyUmFuZ2UuZW5kLnJvdyA9PT0gYm9keVJhbmdlLnN0YXJ0LnJvd1xuICAgIGlmIChpc0JvZHlTdGFydFJvdyhwYXJhbWV0ZXJSYW5nZS5lbmQucm93ICsgMSkpIHJldHVybiBwYXJhbWV0ZXJSYW5nZS5lbmQucm93ICsgMSA9PT0gYm9keVJhbmdlLnN0YXJ0LnJvd1xuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgZ2V0UmFuZ2VXaXRoVHJlZVNpdHRlciAoc2VsZWN0aW9uKSB7XG4gICAgY29uc3QgZWRpdG9yID0gdGhpcy5lZGl0b3JcbiAgICBjb25zdCBjdXJzb3JQb3NpdGlvbiA9IHRoaXMuZ2V0Q3Vyc29yUG9zaXRpb25Gb3JTZWxlY3Rpb24oc2VsZWN0aW9uKVxuICAgIGNvbnN0IGZpcnN0Q2hhcmFjdGVyUG9zaXRpb24gPSB0aGlzLnV0aWxzLmdldEZpcnN0Q2hhcmFjdGVyUG9zaXRpb25Gb3JCdWZmZXJSb3codGhpcy5lZGl0b3IsIGN1cnNvclBvc2l0aW9uLnJvdylcbiAgICBjb25zdCBzZWFyY2hTdGFydFBvaW50ID0gUG9pbnQubWF4KGZpcnN0Q2hhcmFjdGVyUG9zaXRpb24sIGN1cnNvclBvc2l0aW9uKVxuICAgIGNvbnN0IHN0YXJ0Tm9kZSA9IGVkaXRvci5sYW5ndWFnZU1vZGUuZ2V0U3ludGF4Tm9kZUF0UG9zaXRpb24oc2VhcmNoU3RhcnRQb2ludClcblxuICAgIGNvbnN0IG5vZGUgPSB0aGlzLnV0aWxzLmZpbmRQYXJlbnROb2RlRm9yRnVuY3Rpb25UeXBlKGVkaXRvciwgc3RhcnROb2RlKVxuICAgIGlmIChub2RlKSB7XG4gICAgICBsZXQgcmFuZ2UgPSBub2RlLnJhbmdlXG5cbiAgICAgIGlmICghdGhpcy5pc0EoKSkge1xuICAgICAgICBjb25zdCBib2R5Tm9kZSA9IHRoaXMudXRpbHMuZmluZEZ1bmN0aW9uQm9keU5vZGUoZWRpdG9yLCBub2RlKVxuICAgICAgICBpZiAoYm9keU5vZGUpIHtcbiAgICAgICAgICByYW5nZSA9IGJvZHlOb2RlLnJhbmdlXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBlbmRSb3dUcmFuc2xhdGlvbiA9IHRoaXMudXRpbHMuZG9lc1JhbmdlU3RhcnRBbmRFbmRXaXRoU2FtZUluZGVudExldmVsKGVkaXRvciwgcmFuZ2UpID8gLTEgOiAwXG4gICAgICAgIHJhbmdlID0gcmFuZ2UudHJhbnNsYXRlKFsxLCAwXSwgW2VuZFJvd1RyYW5zbGF0aW9uLCAwXSlcbiAgICAgIH1cbiAgICAgIGlmIChyYW5nZS5lbmQuY29sdW1uICE9PSAwKSB7XG4gICAgICAgIC8vIFRoZSAncHJlcHJvY19mdW5jdGlvbl9kZWYnIHR5cGUgdXNlZCBpbiBDIGFuZCBDKysgaGVhZGVyJ3MgXCIjZGVmaW5lXCIgcmV0dXJucyBsaW5ld2lzZSByYW5nZS5cbiAgICAgICAgLy8gSW4gdGhpcyBjYXNlLCB3ZSBzaG91bGRuJ3QgdHJhbnNsYXRlIHRvIGxpbmV3aXNlIHNpbmNlIGl0IGFscmVhZHkgY29udGFpbnMgZW5kaW5nIG5ld2xpbmUuXG4gICAgICAgIHJhbmdlID0gdGhpcy51dGlscy5nZXRCdWZmZXJSYW5nZUZvclJvd1JhbmdlKGVkaXRvciwgW3JhbmdlLnN0YXJ0LnJvdywgcmFuZ2UuZW5kLnJvd10pXG4gICAgICB9XG4gICAgICByZXR1cm4gcmFuZ2VcbiAgICB9XG4gIH1cblxuICBnZXRSYW5nZSAoc2VsZWN0aW9uKSB7XG4gICAgY29uc3QgdXNlVHJlZVNpdHRlciA9IHRoaXMudXRpbHMuaXNVc2luZ1RyZWVTaXR0ZXIoc2VsZWN0aW9uLmVkaXRvcilcbiAgICBpZiAodXNlVHJlZVNpdHRlcikge1xuICAgICAgcmV0dXJuIHRoaXMuZ2V0UmFuZ2VXaXRoVHJlZVNpdHRlcihzZWxlY3Rpb24pXG4gICAgfVxuXG4gICAgY29uc3QgZWRpdG9yID0gdGhpcy5lZGl0b3JcbiAgICBjb25zdCBjdXJzb3JSb3cgPSB0aGlzLmdldEN1cnNvclBvc2l0aW9uRm9yU2VsZWN0aW9uKHNlbGVjdGlvbikucm93XG4gICAgY29uc3QgYm9keVN0YXJ0UmVnZXggPSB0aGlzLmdldEZ1bmN0aW9uQm9keVN0YXJ0UmVnZXgoZWRpdG9yLmdldEdyYW1tYXIoKSlcbiAgICBjb25zdCBpc0luY2x1ZGVGdW5jdGlvblNjb3BlRm9yUm93ID0gcm93ID0+IHRoaXMudXRpbHMuaXNJbmNsdWRlRnVuY3Rpb25TY29wZUZvclJvdyhlZGl0b3IsIHJvdylcblxuICAgIGNvbnN0IGZ1bmN0aW9uUmFuZ2VzID0gW11cbiAgICBjb25zdCBzYXZlRnVuY3Rpb25SYW5nZSA9ICh7YVJhbmdlLCBpbm5lclJhbmdlfSkgPT4ge1xuICAgICAgZnVuY3Rpb25SYW5nZXMucHVzaCh7XG4gICAgICAgIGFSYW5nZTogdGhpcy5idWlsZEFSYW5nZShhUmFuZ2UpLFxuICAgICAgICBpbm5lclJhbmdlOiB0aGlzLmJ1aWxkSW5uZXJSYW5nZShpbm5lclJhbmdlKVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBjb25zdCBmb2xkUmFuZ2VzID0gdGhpcy51dGlscy5nZXRDb2RlRm9sZFJhbmdlcyhlZGl0b3IpXG4gICAgd2hpbGUgKGZvbGRSYW5nZXMubGVuZ3RoKSB7XG4gICAgICBjb25zdCByYW5nZSA9IGZvbGRSYW5nZXMuc2hpZnQoKVxuICAgICAgaWYgKGlzSW5jbHVkZUZ1bmN0aW9uU2NvcGVGb3JSb3cocmFuZ2Uuc3RhcnQucm93KSkge1xuICAgICAgICBjb25zdCBuZXh0UmFuZ2UgPSBmb2xkUmFuZ2VzWzBdXG4gICAgICAgIGNvbnN0IG5leHRGb2xkSXNDb25uZWN0ZWQgPSBuZXh0UmFuZ2UgJiYgbmV4dFJhbmdlLnN0YXJ0LnJvdyA8PSByYW5nZS5lbmQucm93ICsgMVxuICAgICAgICBjb25zdCBtYXliZUFGdW5jdGlvblJhbmdlID0gbmV4dEZvbGRJc0Nvbm5lY3RlZCA/IHJhbmdlLnVuaW9uKG5leHRSYW5nZSkgOiByYW5nZVxuICAgICAgICBpZiAoIW1heWJlQUZ1bmN0aW9uUmFuZ2UuY29udGFpbnNQb2ludChbY3Vyc29yUm93LCBJbmZpbml0eV0pKSBjb250aW51ZSAvLyBza2lwIHRvIGF2b2lkIGhlYXZ5IGNvbXB1dGF0aW9uXG4gICAgICAgIGlmIChuZXh0Rm9sZElzQ29ubmVjdGVkICYmIHRoaXMuaXNNdWx0aUxpbmVQYXJhbWV0ZXJGdW5jdGlvblJhbmdlKHJhbmdlLCBuZXh0UmFuZ2UsIGJvZHlTdGFydFJlZ2V4KSkge1xuICAgICAgICAgIGNvbnN0IGJvZHlSYW5nZSA9IGZvbGRSYW5nZXMuc2hpZnQoKVxuICAgICAgICAgIHNhdmVGdW5jdGlvblJhbmdlKHthUmFuZ2U6IHJhbmdlLnVuaW9uKGJvZHlSYW5nZSksIGlubmVyUmFuZ2U6IGJvZHlSYW5nZX0pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc2F2ZUZ1bmN0aW9uUmFuZ2Uoe2FSYW5nZTogcmFuZ2UsIGlubmVyUmFuZ2U6IHJhbmdlfSlcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgcHJldmlvdXNSb3cgPSByYW5nZS5zdGFydC5yb3cgLSAxXG4gICAgICAgIGlmIChwcmV2aW91c1JvdyA8IDApIGNvbnRpbnVlXG4gICAgICAgIGlmIChlZGl0b3IuaXNGb2xkYWJsZUF0QnVmZmVyUm93KHByZXZpb3VzUm93KSkgY29udGludWVcbiAgICAgICAgY29uc3QgbWF5YmVBRnVuY3Rpb25SYW5nZSA9IHJhbmdlLnVuaW9uKGVkaXRvci5idWZmZXJSYW5nZUZvckJ1ZmZlclJvdyhwcmV2aW91c1JvdykpXG4gICAgICAgIGlmICghbWF5YmVBRnVuY3Rpb25SYW5nZS5jb250YWluc1BvaW50KFtjdXJzb3JSb3csIEluZmluaXR5XSkpIGNvbnRpbnVlIC8vIHNraXAgdG8gYXZvaWQgaGVhdnkgY29tcHV0YXRpb25cblxuICAgICAgICBjb25zdCBpc0JvZHlTdGFydE9ubHlSb3cgPSByb3cgPT5cbiAgICAgICAgICBuZXcgUmVnRXhwKCdeXFxcXHMqJyArIGJvZHlTdGFydFJlZ2V4LnNvdXJjZSkudGVzdChlZGl0b3IubGluZVRleHRGb3JCdWZmZXJSb3cocm93KSlcbiAgICAgICAgaWYgKGlzQm9keVN0YXJ0T25seVJvdyhyYW5nZS5zdGFydC5yb3cpICYmIGlzSW5jbHVkZUZ1bmN0aW9uU2NvcGVGb3JSb3cocHJldmlvdXNSb3cpKSB7XG4gICAgICAgICAgc2F2ZUZ1bmN0aW9uUmFuZ2Uoe2FSYW5nZTogbWF5YmVBRnVuY3Rpb25SYW5nZSwgaW5uZXJSYW5nZTogcmFuZ2V9KVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBmdW5jdGlvblJhbmdlIG9mIGZ1bmN0aW9uUmFuZ2VzLnJldmVyc2UoKSkge1xuICAgICAgY29uc3Qge3N0YXJ0LCBlbmR9ID0gdGhpcy5pc0EoKSA/IGZ1bmN0aW9uUmFuZ2UuYVJhbmdlIDogZnVuY3Rpb25SYW5nZS5pbm5lclJhbmdlXG4gICAgICBjb25zdCByYW5nZSA9IHRoaXMuZ2V0QnVmZmVyUmFuZ2VGb3JSb3dSYW5nZShbc3RhcnQucm93LCBlbmQucm93XSlcbiAgICAgIGlmICghc2VsZWN0aW9uLmdldEJ1ZmZlclJhbmdlKCkuY29udGFpbnNSYW5nZShyYW5nZSkpIHJldHVybiByYW5nZVxuICAgIH1cbiAgfVxuXG4gIGJ1aWxkSW5uZXJSYW5nZSAocmFuZ2UpIHtcbiAgICBjb25zdCBlbmRSb3dUcmFuc2xhdGlvbiA9IHRoaXMudXRpbHMuZG9lc1JhbmdlU3RhcnRBbmRFbmRXaXRoU2FtZUluZGVudExldmVsKHRoaXMuZWRpdG9yLCByYW5nZSkgPyAtMSA6IDBcbiAgICByZXR1cm4gcmFuZ2UudHJhbnNsYXRlKFsxLCAwXSwgW2VuZFJvd1RyYW5zbGF0aW9uLCAwXSlcbiAgfVxuXG4gIGJ1aWxkQVJhbmdlIChyYW5nZSkge1xuICAgIC8vIE5PVEU6IFRoaXMgYWRqdXN0bWVudCBzaG91ZCBub3QgYmUgbmVjZXNzYXJ5IGlmIGxhbmd1YWdlLXN5bnRheCBpcyBwcm9wZXJseSBkZWZpbmVkLlxuICAgIGNvbnN0IGVuZFJvd1RyYW5zbGF0aW9uID0gdGhpcy5pc0dyYW1tYXJEb2VzTm90Rm9sZENsb3NpbmdSb3coKSA/ICsxIDogMFxuICAgIHJldHVybiByYW5nZS50cmFuc2xhdGUoWzAsIDBdLCBbZW5kUm93VHJhbnNsYXRpb24sIDBdKVxuICB9XG5cbiAgaXNHcmFtbWFyRG9lc05vdEZvbGRDbG9zaW5nUm93ICgpIHtcbiAgICBjb25zdCB7c2NvcGVOYW1lLCBwYWNrYWdlTmFtZX0gPSB0aGlzLmVkaXRvci5nZXRHcmFtbWFyKClcbiAgICBpZiAodGhpcy5zY29wZU5hbWVzT21pdHRpbmdDbG9zaW5nQnJhY2UuaW5jbHVkZXMoc2NvcGVOYW1lKSkge1xuICAgICAgcmV0dXJuIHRydWVcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gSEFDSzogUnVzdCBoYXZlIHR3byBwYWNrYWdlIGBsYW5ndWFnZS1ydXN0YCBhbmQgYGF0b20tbGFuZ3VhZ2UtcnVzdGBcbiAgICAgIC8vIGxhbmd1YWdlLXJ1c3QgZG9uJ3QgZm9sZCBlbmRpbmcgYH1gLCBidXQgYXRvbS1sYW5ndWFnZS1ydXN0IGRvZXMuXG4gICAgICByZXR1cm4gc2NvcGVOYW1lID09PSAnc291cmNlLnJ1c3QnICYmIHBhY2thZ2VOYW1lID09PSAnbGFuZ3VhZ2UtcnVzdCdcbiAgICB9XG4gIH1cbn1cblxuLy8gU2VjdGlvbjogT3RoZXJcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT1cbmNsYXNzIEFyZ3VtZW50cyBleHRlbmRzIFRleHRPYmplY3Qge1xuICBuZXdBcmdJbmZvIChhcmdTdGFydCwgYXJnLCBzZXBhcmF0b3IpIHtcbiAgICBjb25zdCBhcmdFbmQgPSB0aGlzLnV0aWxzLnRyYXZlcnNlVGV4dEZyb21Qb2ludChhcmdTdGFydCwgYXJnKVxuICAgIGNvbnN0IGFyZ1JhbmdlID0gbmV3IFJhbmdlKGFyZ1N0YXJ0LCBhcmdFbmQpXG5cbiAgICBjb25zdCBzZXBhcmF0b3JFbmQgPSB0aGlzLnV0aWxzLnRyYXZlcnNlVGV4dEZyb21Qb2ludChhcmdFbmQsIHNlcGFyYXRvciAhPSBudWxsID8gc2VwYXJhdG9yIDogJycpXG4gICAgY29uc3Qgc2VwYXJhdG9yUmFuZ2UgPSBuZXcgUmFuZ2UoYXJnRW5kLCBzZXBhcmF0b3JFbmQpXG5cbiAgICBjb25zdCBpbm5lclJhbmdlID0gYXJnUmFuZ2VcbiAgICBjb25zdCBhUmFuZ2UgPSBhcmdSYW5nZS51bmlvbihzZXBhcmF0b3JSYW5nZSlcbiAgICByZXR1cm4ge2FyZ1JhbmdlLCBzZXBhcmF0b3JSYW5nZSwgaW5uZXJSYW5nZSwgYVJhbmdlfVxuICB9XG5cbiAgZ2V0QXJndW1lbnRzUmFuZ2VGb3JTZWxlY3Rpb24gKHNlbGVjdGlvbikge1xuICAgIGNvbnN0IG9wdGlvbnMgPSB7XG4gICAgICBtZW1iZXI6IFsnQ3VybHlCcmFja2V0JywgJ1NxdWFyZUJyYWNrZXQnLCAnUGFyZW50aGVzaXMnXSxcbiAgICAgIGluY2x1c2l2ZTogZmFsc2VcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuZ2V0SW5zdGFuY2UoJ0lubmVyQW55UGFpcicsIG9wdGlvbnMpLmdldFJhbmdlKHNlbGVjdGlvbilcbiAgfVxuXG4gIGdldFJhbmdlIChzZWxlY3Rpb24pIHtcbiAgICBjb25zdCB7c3BsaXRBcmd1bWVudHMsIHRyYXZlcnNlVGV4dEZyb21Qb2ludCwgZ2V0TGFzdH0gPSB0aGlzLnV0aWxzXG4gICAgbGV0IHJhbmdlID0gdGhpcy5nZXRBcmd1bWVudHNSYW5nZUZvclNlbGVjdGlvbihzZWxlY3Rpb24pXG4gICAgY29uc3QgcGFpclJhbmdlRm91bmQgPSByYW5nZSAhPSBudWxsXG5cbiAgICByYW5nZSA9IHJhbmdlIHx8IHRoaXMuZ2V0SW5zdGFuY2UoJ0lubmVyQ3VycmVudExpbmUnKS5nZXRSYW5nZShzZWxlY3Rpb24pIC8vIGZhbGxiYWNrXG4gICAgaWYgKCFyYW5nZSkgcmV0dXJuXG5cbiAgICByYW5nZSA9IHRoaXMudHJpbUJ1ZmZlclJhbmdlKHJhbmdlKVxuXG4gICAgY29uc3QgdGV4dCA9IHRoaXMuZWRpdG9yLmdldFRleHRJbkJ1ZmZlclJhbmdlKHJhbmdlKVxuICAgIGNvbnN0IGFsbFRva2VucyA9IHNwbGl0QXJndW1lbnRzKHRleHQsIHBhaXJSYW5nZUZvdW5kKVxuXG4gICAgY29uc3QgYXJnSW5mb3MgPSBbXVxuICAgIGxldCBhcmdTdGFydCA9IHJhbmdlLnN0YXJ0XG5cbiAgICAvLyBTa2lwIHN0YXJ0aW5nIHNlcGFyYXRvclxuICAgIGlmIChhbGxUb2tlbnMubGVuZ3RoICYmIGFsbFRva2Vuc1swXS50eXBlID09PSAnc2VwYXJhdG9yJykge1xuICAgICAgY29uc3QgdG9rZW4gPSBhbGxUb2tlbnMuc2hpZnQoKVxuICAgICAgYXJnU3RhcnQgPSB0cmF2ZXJzZVRleHRGcm9tUG9pbnQoYXJnU3RhcnQsIHRva2VuLnRleHQpXG4gICAgfVxuXG4gICAgd2hpbGUgKGFsbFRva2Vucy5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IHRva2VuID0gYWxsVG9rZW5zLnNoaWZ0KClcbiAgICAgIGlmICh0b2tlbi50eXBlID09PSAnYXJndW1lbnQnKSB7XG4gICAgICAgIGNvbnN0IG5leHRUb2tlbiA9IGFsbFRva2Vucy5zaGlmdCgpXG4gICAgICAgIGNvbnN0IHNlcGFyYXRvciA9IG5leHRUb2tlbiA/IG5leHRUb2tlbi50ZXh0IDogdW5kZWZpbmVkXG4gICAgICAgIGNvbnN0IGFyZ0luZm8gPSB0aGlzLm5ld0FyZ0luZm8oYXJnU3RhcnQsIHRva2VuLnRleHQsIHNlcGFyYXRvcilcblxuICAgICAgICBpZiAoYWxsVG9rZW5zLmxlbmd0aCA9PT0gMCAmJiBhcmdJbmZvcy5sZW5ndGgpIHtcbiAgICAgICAgICBhcmdJbmZvLmFSYW5nZSA9IGFyZ0luZm8uYXJnUmFuZ2UudW5pb24oZ2V0TGFzdChhcmdJbmZvcykuc2VwYXJhdG9yUmFuZ2UpXG4gICAgICAgIH1cblxuICAgICAgICBhcmdTdGFydCA9IGFyZ0luZm8uYVJhbmdlLmVuZFxuICAgICAgICBhcmdJbmZvcy5wdXNoKGFyZ0luZm8pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ211c3Qgbm90IGhhcHBlbicpXG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgcG9pbnQgPSB0aGlzLmdldEN1cnNvclBvc2l0aW9uRm9yU2VsZWN0aW9uKHNlbGVjdGlvbilcbiAgICBmb3IgKGNvbnN0IHtpbm5lclJhbmdlLCBhUmFuZ2V9IG9mIGFyZ0luZm9zKSB7XG4gICAgICBpZiAoaW5uZXJSYW5nZS5lbmQuaXNHcmVhdGVyVGhhbk9yRXF1YWwocG9pbnQpKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmlzSW5uZXIoKSA/IGlubmVyUmFuZ2UgOiBhUmFuZ2VcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuY2xhc3MgQ3VycmVudExpbmUgZXh0ZW5kcyBUZXh0T2JqZWN0IHtcbiAgZ2V0UmFuZ2UgKHNlbGVjdGlvbikge1xuICAgIGNvbnN0IHtyb3d9ID0gdGhpcy5nZXRDdXJzb3JQb3NpdGlvbkZvclNlbGVjdGlvbihzZWxlY3Rpb24pXG4gICAgY29uc3QgcmFuZ2UgPSB0aGlzLmVkaXRvci5idWZmZXJSYW5nZUZvckJ1ZmZlclJvdyhyb3cpXG4gICAgcmV0dXJuIHRoaXMuaXNBKCkgPyByYW5nZSA6IHRoaXMudHJpbUJ1ZmZlclJhbmdlKHJhbmdlKVxuICB9XG59XG5cbmNsYXNzIEVudGlyZSBleHRlbmRzIFRleHRPYmplY3Qge1xuICB3aXNlID0gJ2xpbmV3aXNlJ1xuICBzZWxlY3RPbmNlID0gdHJ1ZVxuXG4gIGdldFJhbmdlIChzZWxlY3Rpb24pIHtcbiAgICByZXR1cm4gdGhpcy5lZGl0b3IuYnVmZmVyLmdldFJhbmdlKClcbiAgfVxufVxuXG5jbGFzcyBFbXB0eSBleHRlbmRzIFRleHRPYmplY3Qge1xuICBzdGF0aWMgY29tbWFuZCA9IGZhbHNlXG4gIHNlbGVjdE9uY2UgPSB0cnVlXG59XG5cbmNsYXNzIExhdGVzdENoYW5nZSBleHRlbmRzIFRleHRPYmplY3Qge1xuICB3aXNlID0gbnVsbFxuICBzZWxlY3RPbmNlID0gdHJ1ZVxuICBnZXRSYW5nZSAoc2VsZWN0aW9uKSB7XG4gICAgY29uc3Qgc3RhcnQgPSB0aGlzLnZpbVN0YXRlLm1hcmsuZ2V0KCdbJylcbiAgICBjb25zdCBlbmQgPSB0aGlzLnZpbVN0YXRlLm1hcmsuZ2V0KCddJylcbiAgICBpZiAoc3RhcnQgJiYgZW5kKSB7XG4gICAgICByZXR1cm4gbmV3IFJhbmdlKHN0YXJ0LCBlbmQpXG4gICAgfVxuICB9XG59XG5cbmNsYXNzIFNlYXJjaE1hdGNoRm9yd2FyZCBleHRlbmRzIFRleHRPYmplY3Qge1xuICBiYWNrd2FyZCA9IGZhbHNlXG5cbiAgZmluZE1hdGNoIChmcm9tLCByZWdleCkge1xuICAgIGlmICh0aGlzLmJhY2t3YXJkKSB7XG4gICAgICBpZiAodGhpcy5tb2RlID09PSAndmlzdWFsJykge1xuICAgICAgICBmcm9tID0gdGhpcy51dGlscy50cmFuc2xhdGVQb2ludEFuZENsaXAodGhpcy5lZGl0b3IsIGZyb20sICdiYWNrd2FyZCcpXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IG9wdGlvbnMgPSB7ZnJvbTogW2Zyb20ucm93LCBJbmZpbml0eV19XG4gICAgICByZXR1cm4ge1xuICAgICAgICByYW5nZTogdGhpcy5maW5kSW5FZGl0b3IoJ2JhY2t3YXJkJywgcmVnZXgsIG9wdGlvbnMsICh7cmFuZ2V9KSA9PiByYW5nZS5zdGFydC5pc0xlc3NUaGFuKGZyb20pICYmIHJhbmdlKSxcbiAgICAgICAgd2hpY2hJc0hlYWQ6ICdzdGFydCdcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHRoaXMubW9kZSA9PT0gJ3Zpc3VhbCcpIHtcbiAgICAgICAgZnJvbSA9IHRoaXMudXRpbHMudHJhbnNsYXRlUG9pbnRBbmRDbGlwKHRoaXMuZWRpdG9yLCBmcm9tLCAnZm9yd2FyZCcpXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IG9wdGlvbnMgPSB7ZnJvbTogW2Zyb20ucm93LCAwXX1cbiAgICAgIHJldHVybiB7XG4gICAgICAgIHJhbmdlOiB0aGlzLmZpbmRJbkVkaXRvcignZm9yd2FyZCcsIHJlZ2V4LCBvcHRpb25zLCAoe3JhbmdlfSkgPT4gcmFuZ2UuZW5kLmlzR3JlYXRlclRoYW4oZnJvbSkgJiYgcmFuZ2UpLFxuICAgICAgICB3aGljaElzSGVhZDogJ2VuZCdcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBnZXRSYW5nZSAoc2VsZWN0aW9uKSB7XG4gICAgY29uc3QgcGF0dGVybiA9IHRoaXMuZ2xvYmFsU3RhdGUuZ2V0KCdsYXN0U2VhcmNoUGF0dGVybicpXG4gICAgaWYgKCFwYXR0ZXJuKSByZXR1cm5cblxuICAgIGNvbnN0IGZyb21Qb2ludCA9IHNlbGVjdGlvbi5nZXRIZWFkQnVmZmVyUG9zaXRpb24oKVxuICAgIGNvbnN0IHtyYW5nZSwgd2hpY2hJc0hlYWR9ID0gdGhpcy5maW5kTWF0Y2goZnJvbVBvaW50LCBwYXR0ZXJuKVxuICAgIGlmIChyYW5nZSkge1xuICAgICAgcmV0dXJuIHRoaXMudW5pb25SYW5nZUFuZERldGVybWluZVJldmVyc2VkU3RhdGUoc2VsZWN0aW9uLCByYW5nZSwgd2hpY2hJc0hlYWQpXG4gICAgfVxuICB9XG5cbiAgdW5pb25SYW5nZUFuZERldGVybWluZVJldmVyc2VkU3RhdGUgKHNlbGVjdGlvbiwgcmFuZ2UsIHdoaWNoSXNIZWFkKSB7XG4gICAgaWYgKHNlbGVjdGlvbi5pc0VtcHR5KCkpIHJldHVybiByYW5nZVxuXG4gICAgbGV0IGhlYWQgPSByYW5nZVt3aGljaElzSGVhZF1cbiAgICBjb25zdCB0YWlsID0gc2VsZWN0aW9uLmdldFRhaWxCdWZmZXJQb3NpdGlvbigpXG5cbiAgICBpZiAodGhpcy5iYWNrd2FyZCkge1xuICAgICAgaWYgKHRhaWwuaXNMZXNzVGhhbihoZWFkKSkgaGVhZCA9IHRoaXMudXRpbHMudHJhbnNsYXRlUG9pbnRBbmRDbGlwKHRoaXMuZWRpdG9yLCBoZWFkLCAnZm9yd2FyZCcpXG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChoZWFkLmlzTGVzc1RoYW4odGFpbCkpIGhlYWQgPSB0aGlzLnV0aWxzLnRyYW5zbGF0ZVBvaW50QW5kQ2xpcCh0aGlzLmVkaXRvciwgaGVhZCwgJ2JhY2t3YXJkJylcbiAgICB9XG5cbiAgICB0aGlzLnJldmVyc2VkID0gaGVhZC5pc0xlc3NUaGFuKHRhaWwpXG4gICAgcmV0dXJuIG5ldyBSYW5nZSh0YWlsLCBoZWFkKS51bmlvbih0aGlzLnN3cmFwKHNlbGVjdGlvbikuZ2V0VGFpbEJ1ZmZlclJhbmdlKCkpXG4gIH1cblxuICBzZWxlY3RUZXh0T2JqZWN0IChzZWxlY3Rpb24pIHtcbiAgICBjb25zdCByYW5nZSA9IHRoaXMuZ2V0UmFuZ2Uoc2VsZWN0aW9uKVxuICAgIGlmIChyYW5nZSkge1xuICAgICAgdGhpcy5zd3JhcChzZWxlY3Rpb24pLnNldEJ1ZmZlclJhbmdlKHJhbmdlLCB7cmV2ZXJzZWQ6IHRoaXMucmV2ZXJzZWQgIT0gbnVsbCA/IHRoaXMucmV2ZXJzZWQgOiB0aGlzLmJhY2t3YXJkfSlcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuICB9XG59XG5cbmNsYXNzIFNlYXJjaE1hdGNoQmFja3dhcmQgZXh0ZW5kcyBTZWFyY2hNYXRjaEZvcndhcmQge1xuICBiYWNrd2FyZCA9IHRydWVcbn1cblxuLy8gW0xpbWl0YXRpb246IHdvbid0IGZpeF06IFNlbGVjdGVkIHJhbmdlIGlzIG5vdCBzdWJtb2RlIGF3YXJlLiBhbHdheXMgY2hhcmFjdGVyd2lzZS5cbi8vIFNvIGV2ZW4gaWYgb3JpZ2luYWwgc2VsZWN0aW9uIHdhcyB2TCBvciB2Qiwgc2VsZWN0ZWQgcmFuZ2UgYnkgdGhpcyB0ZXh0LW9iamVjdFxuLy8gaXMgYWx3YXlzIHZDIHJhbmdlLlxuY2xhc3MgUHJldmlvdXNTZWxlY3Rpb24gZXh0ZW5kcyBUZXh0T2JqZWN0IHtcbiAgd2lzZSA9IG51bGxcbiAgc2VsZWN0T25jZSA9IHRydWVcblxuICBzZWxlY3RUZXh0T2JqZWN0IChzZWxlY3Rpb24pIHtcbiAgICBjb25zdCB7cHJvcGVydGllcywgc3VibW9kZX0gPSB0aGlzLnZpbVN0YXRlLnByZXZpb3VzU2VsZWN0aW9uXG4gICAgaWYgKHByb3BlcnRpZXMgJiYgc3VibW9kZSkge1xuICAgICAgdGhpcy53aXNlID0gc3VibW9kZVxuICAgICAgdGhpcy5zd3JhcCh0aGlzLmVkaXRvci5nZXRMYXN0U2VsZWN0aW9uKCkpLnNlbGVjdEJ5UHJvcGVydGllcyhwcm9wZXJ0aWVzKVxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG4gIH1cbn1cblxuY2xhc3MgUGVyc2lzdGVudFNlbGVjdGlvbiBleHRlbmRzIFRleHRPYmplY3Qge1xuICB3aXNlID0gbnVsbFxuICBzZWxlY3RPbmNlID0gdHJ1ZVxuXG4gIHNlbGVjdFRleHRPYmplY3QgKHNlbGVjdGlvbikge1xuICAgIGlmICh0aGlzLnZpbVN0YXRlLmhhc1BlcnNpc3RlbnRTZWxlY3Rpb25zKCkpIHtcbiAgICAgIHRoaXMucGVyc2lzdGVudFNlbGVjdGlvbi5zZXRTZWxlY3RlZEJ1ZmZlclJhbmdlcygpXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cbiAgfVxufVxuXG4vLyBVc2VkIG9ubHkgYnkgUmVwbGFjZVdpdGhSZWdpc3RlciBhbmQgUHV0QmVmb3JlIGFuZCBpdHMnIGNoaWxkcmVuLlxuY2xhc3MgTGFzdFBhc3RlZFJhbmdlIGV4dGVuZHMgVGV4dE9iamVjdCB7XG4gIHN0YXRpYyBjb21tYW5kID0gZmFsc2VcbiAgd2lzZSA9IG51bGxcbiAgc2VsZWN0T25jZSA9IHRydWVcblxuICBzZWxlY3RUZXh0T2JqZWN0IChzZWxlY3Rpb24pIHtcbiAgICBmb3IgKHNlbGVjdGlvbiBvZiB0aGlzLmVkaXRvci5nZXRTZWxlY3Rpb25zKCkpIHtcbiAgICAgIGNvbnN0IHJhbmdlID0gdGhpcy52aW1TdGF0ZS5zZXF1ZW50aWFsUGFzdGVNYW5hZ2VyLmdldFBhc3RlZFJhbmdlRm9yU2VsZWN0aW9uKHNlbGVjdGlvbilcbiAgICAgIHNlbGVjdGlvbi5zZXRCdWZmZXJSYW5nZShyYW5nZSlcbiAgICB9XG4gICAgcmV0dXJuIHRydWVcbiAgfVxufVxuXG5jbGFzcyBWaXNpYmxlQXJlYSBleHRlbmRzIFRleHRPYmplY3Qge1xuICBzZWxlY3RPbmNlID0gdHJ1ZVxuXG4gIGdldFJhbmdlIChzZWxlY3Rpb24pIHtcbiAgICBjb25zdCBbc3RhcnRSb3csIGVuZFJvd10gPSB0aGlzLmVkaXRvci5nZXRWaXNpYmxlUm93UmFuZ2UoKVxuICAgIHJldHVybiB0aGlzLmVkaXRvci5idWZmZXJSYW5nZUZvclNjcmVlblJhbmdlKFtbc3RhcnRSb3csIDBdLCBbZW5kUm93LCBJbmZpbml0eV1dKVxuICB9XG59XG5cbmNsYXNzIERpZmZIdW5rIGV4dGVuZHMgVGV4dE9iamVjdCB7XG4gIHdpc2UgPSAnbGluZXdpc2UnXG4gIHNlbGVjdE9uY2UgPSB0cnVlXG4gIGdldFJhbmdlIChzZWxlY3Rpb24pIHtcbiAgICBjb25zdCByb3cgPSB0aGlzLmdldEN1cnNvclBvc2l0aW9uRm9yU2VsZWN0aW9uKHNlbGVjdGlvbikucm93XG4gICAgcmV0dXJuIHRoaXMudXRpbHMuZ2V0SHVua1JhbmdlQXRCdWZmZXJSb3codGhpcy5lZGl0b3IsIHJvdylcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5hc3NpZ24oXG4gIHtcbiAgICBUZXh0T2JqZWN0LFxuICAgIFdvcmQsXG4gICAgV2hvbGVXb3JkLFxuICAgIFNtYXJ0V29yZCxcbiAgICBTdWJ3b3JkLFxuICAgIFBhaXIsXG4gICAgQVBhaXIsXG4gICAgQW55UGFpcixcbiAgICBBbnlQYWlyQWxsb3dGb3J3YXJkaW5nLFxuICAgIEFueVF1b3RlLFxuICAgIFF1b3RlLFxuICAgIERvdWJsZVF1b3RlLFxuICAgIFNpbmdsZVF1b3RlLFxuICAgIEJhY2tUaWNrLFxuICAgIEN1cmx5QnJhY2tldCxcbiAgICBTcXVhcmVCcmFja2V0LFxuICAgIFBhcmVudGhlc2lzLFxuICAgIEFuZ2xlQnJhY2tldCxcbiAgICBUYWcsXG4gICAgUGFyYWdyYXBoLFxuICAgIEluZGVudGF0aW9uLFxuICAgIENvbW1lbnQsXG4gICAgQ29tbWVudE9yUGFyYWdyYXBoLFxuICAgIEZvbGQsXG4gICAgRnVuY3Rpb24sXG4gICAgQXJndW1lbnRzLFxuICAgIEN1cnJlbnRMaW5lLFxuICAgIEVudGlyZSxcbiAgICBFbXB0eSxcbiAgICBMYXRlc3RDaGFuZ2UsXG4gICAgU2VhcmNoTWF0Y2hGb3J3YXJkLFxuICAgIFNlYXJjaE1hdGNoQmFja3dhcmQsXG4gICAgUHJldmlvdXNTZWxlY3Rpb24sXG4gICAgUGVyc2lzdGVudFNlbGVjdGlvbixcbiAgICBMYXN0UGFzdGVkUmFuZ2UsXG4gICAgVmlzaWJsZUFyZWFcbiAgfSxcbiAgV29yZC5kZXJpdmVDbGFzcyh0cnVlKSxcbiAgV2hvbGVXb3JkLmRlcml2ZUNsYXNzKHRydWUpLFxuICBTbWFydFdvcmQuZGVyaXZlQ2xhc3ModHJ1ZSksXG4gIFN1YndvcmQuZGVyaXZlQ2xhc3ModHJ1ZSksXG4gIEFueVBhaXIuZGVyaXZlQ2xhc3ModHJ1ZSksXG4gIEFueVBhaXJBbGxvd0ZvcndhcmRpbmcuZGVyaXZlQ2xhc3ModHJ1ZSksXG4gIEFueVF1b3RlLmRlcml2ZUNsYXNzKHRydWUpLFxuICBEb3VibGVRdW90ZS5kZXJpdmVDbGFzcyh0cnVlKSxcbiAgU2luZ2xlUXVvdGUuZGVyaXZlQ2xhc3ModHJ1ZSksXG4gIEJhY2tUaWNrLmRlcml2ZUNsYXNzKHRydWUpLFxuICBDdXJseUJyYWNrZXQuZGVyaXZlQ2xhc3ModHJ1ZSwgdHJ1ZSksXG4gIFNxdWFyZUJyYWNrZXQuZGVyaXZlQ2xhc3ModHJ1ZSwgdHJ1ZSksXG4gIFBhcmVudGhlc2lzLmRlcml2ZUNsYXNzKHRydWUsIHRydWUpLFxuICBBbmdsZUJyYWNrZXQuZGVyaXZlQ2xhc3ModHJ1ZSwgdHJ1ZSksXG4gIFRhZy5kZXJpdmVDbGFzcyh0cnVlKSxcbiAgUGFyYWdyYXBoLmRlcml2ZUNsYXNzKHRydWUpLFxuICBJbmRlbnRhdGlvbi5kZXJpdmVDbGFzcyh0cnVlKSxcbiAgQ29tbWVudC5kZXJpdmVDbGFzcyh0cnVlKSxcbiAgQmxvY2tDb21tZW50LmRlcml2ZUNsYXNzKHRydWUpLFxuICBDb21tZW50T3JQYXJhZ3JhcGguZGVyaXZlQ2xhc3ModHJ1ZSksXG4gIEZvbGQuZGVyaXZlQ2xhc3ModHJ1ZSksXG4gIEZ1bmN0aW9uLmRlcml2ZUNsYXNzKHRydWUpLFxuICBBcmd1bWVudHMuZGVyaXZlQ2xhc3ModHJ1ZSksXG4gIEN1cnJlbnRMaW5lLmRlcml2ZUNsYXNzKHRydWUpLFxuICBFbnRpcmUuZGVyaXZlQ2xhc3ModHJ1ZSksXG4gIExhdGVzdENoYW5nZS5kZXJpdmVDbGFzcyh0cnVlKSxcbiAgUGVyc2lzdGVudFNlbGVjdGlvbi5kZXJpdmVDbGFzcyh0cnVlKSxcbiAgVmlzaWJsZUFyZWEuZGVyaXZlQ2xhc3ModHJ1ZSksXG4gIERpZmZIdW5rLmRlcml2ZUNsYXNzKHRydWUpXG4pXG4iXX0=