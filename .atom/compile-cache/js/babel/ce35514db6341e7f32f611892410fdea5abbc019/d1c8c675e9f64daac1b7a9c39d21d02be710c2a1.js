'use babel';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _require = require('atom');

var Range = _require.Range;

var Base = require('./base');

var MiscCommand = (function (_Base) {
  _inherits(MiscCommand, _Base);

  function MiscCommand() {
    _classCallCheck(this, MiscCommand);

    _get(Object.getPrototypeOf(MiscCommand.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(MiscCommand, null, [{
    key: 'command',
    value: false,
    enumerable: true
  }, {
    key: 'operationKind',
    value: 'misc-command',
    enumerable: true
  }]);

  return MiscCommand;
})(Base);

var Mark = (function (_MiscCommand) {
  _inherits(Mark, _MiscCommand);

  function Mark() {
    _classCallCheck(this, Mark);

    _get(Object.getPrototypeOf(Mark.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(Mark, [{
    key: 'execute',
    value: _asyncToGenerator(function* () {
      var mark = yield this.readCharPromised();
      if (mark) {
        this.vimState.mark.set(mark, this.getCursorBufferPosition());
      }
    })
  }]);

  return Mark;
})(MiscCommand);

var ReverseSelections = (function (_MiscCommand2) {
  _inherits(ReverseSelections, _MiscCommand2);

  function ReverseSelections() {
    _classCallCheck(this, ReverseSelections);

    _get(Object.getPrototypeOf(ReverseSelections.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(ReverseSelections, [{
    key: 'execute',
    value: function execute() {
      this.swrap.setReversedState(this.editor, !this.editor.getLastSelection().isReversed());
      if (this.isMode('visual', 'blockwise')) {
        this.getLastBlockwiseSelection().autoscroll();
      }
    }
  }]);

  return ReverseSelections;
})(MiscCommand);

var BlockwiseOtherEnd = (function (_ReverseSelections) {
  _inherits(BlockwiseOtherEnd, _ReverseSelections);

  function BlockwiseOtherEnd() {
    _classCallCheck(this, BlockwiseOtherEnd);

    _get(Object.getPrototypeOf(BlockwiseOtherEnd.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(BlockwiseOtherEnd, [{
    key: 'execute',
    value: function execute() {
      for (var blockwiseSelection of this.getBlockwiseSelections()) {
        blockwiseSelection.reverse();
      }
      _get(Object.getPrototypeOf(BlockwiseOtherEnd.prototype), 'execute', this).call(this);
    }
  }]);

  return BlockwiseOtherEnd;
})(ReverseSelections);

var Undo = (function (_MiscCommand3) {
  _inherits(Undo, _MiscCommand3);

  function Undo() {
    _classCallCheck(this, Undo);

    _get(Object.getPrototypeOf(Undo.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(Undo, [{
    key: 'execute',
    value: function execute() {
      var newRanges = [];
      var oldRanges = [];

      var disposable = this.editor.getBuffer().onDidChangeText(function (event) {
        for (var _ref2 of event.changes) {
          var newRange = _ref2.newRange;
          var oldRange = _ref2.oldRange;

          if (newRange.isEmpty()) {
            oldRanges.push(oldRange); // Remove only
          } else {
              newRanges.push(newRange);
            }
        }
      });

      if (this.name === 'Undo') {
        this.editor.undo();
      } else {
        this.editor.redo();
      }

      disposable.dispose();

      for (var selection of this.editor.getSelections()) {
        selection.clear();
      }

      if (this.getConfig('setCursorToStartOfChangeOnUndoRedo')) {
        var strategy = this.getConfig('setCursorToStartOfChangeOnUndoRedoStrategy');
        this.setCursorPosition({ newRanges: newRanges, oldRanges: oldRanges, strategy: strategy });
        this.vimState.clearSelections();
      }

      if (this.getConfig('flashOnUndoRedo')) {
        if (newRanges.length) {
          this.flashChanges(newRanges, 'changes');
        } else {
          this.flashChanges(oldRanges, 'deletes');
        }
      }
      this.activateMode('normal');
    }
  }, {
    key: 'setCursorPosition',
    value: function setCursorPosition(_ref3) {
      var newRanges = _ref3.newRanges;
      var oldRanges = _ref3.oldRanges;
      var strategy = _ref3.strategy;

      var lastCursor = this.editor.getLastCursor(); // This is restored cursor

      var changedRange = undefined;

      if (strategy === 'smart') {
        changedRange = this.utils.findRangeContainsPoint(newRanges, lastCursor.getBufferPosition());
      } else if (strategy === 'simple') {
        changedRange = this.utils.sortRanges(newRanges.concat(oldRanges))[0];
      }

      if (changedRange) {
        if (this.utils.isLinewiseRange(changedRange)) this.utils.setBufferRow(lastCursor, changedRange.start.row);else lastCursor.setBufferPosition(changedRange.start);
      }
    }
  }, {
    key: 'flashChanges',
    value: function flashChanges(ranges, mutationType) {
      var _this = this;

      var isMultipleSingleLineRanges = function isMultipleSingleLineRanges(ranges) {
        return ranges.length > 1 && ranges.every(_this.utils.isSingleLineRange);
      };
      var humanizeNewLineForBufferRange = this.utils.humanizeNewLineForBufferRange.bind(null, this.editor);
      var isNotLeadingWhiteSpaceRange = this.utils.isNotLeadingWhiteSpaceRange.bind(null, this.editor);
      if (!this.utils.isMultipleAndAllRangeHaveSameColumnAndConsecutiveRows(ranges)) {
        ranges = ranges.map(humanizeNewLineForBufferRange);
        var type = isMultipleSingleLineRanges(ranges) ? 'undo-redo-multiple-' + mutationType : 'undo-redo';
        if (!(type === 'undo-redo' && mutationType === 'deletes')) {
          this.vimState.flash(ranges.filter(isNotLeadingWhiteSpaceRange), { type: type });
        }
      }
    }
  }]);

  return Undo;
})(MiscCommand);

var Redo = (function (_Undo) {
  _inherits(Redo, _Undo);

  function Redo() {
    _classCallCheck(this, Redo);

    _get(Object.getPrototypeOf(Redo.prototype), 'constructor', this).apply(this, arguments);
  }

  // zc
  return Redo;
})(Undo);

var FoldCurrentRow = (function (_MiscCommand4) {
  _inherits(FoldCurrentRow, _MiscCommand4);

  function FoldCurrentRow() {
    _classCallCheck(this, FoldCurrentRow);

    _get(Object.getPrototypeOf(FoldCurrentRow.prototype), 'constructor', this).apply(this, arguments);
  }

  // zo

  _createClass(FoldCurrentRow, [{
    key: 'execute',
    value: function execute() {
      for (var point of this.getCursorBufferPositions()) {
        this.editor.foldBufferRow(point.row);
      }
    }
  }]);

  return FoldCurrentRow;
})(MiscCommand);

var UnfoldCurrentRow = (function (_MiscCommand5) {
  _inherits(UnfoldCurrentRow, _MiscCommand5);

  function UnfoldCurrentRow() {
    _classCallCheck(this, UnfoldCurrentRow);

    _get(Object.getPrototypeOf(UnfoldCurrentRow.prototype), 'constructor', this).apply(this, arguments);
  }

  // za

  _createClass(UnfoldCurrentRow, [{
    key: 'execute',
    value: function execute() {
      for (var point of this.getCursorBufferPositions()) {
        this.editor.unfoldBufferRow(point.row);
      }
    }
  }]);

  return UnfoldCurrentRow;
})(MiscCommand);

var ToggleFold = (function (_MiscCommand6) {
  _inherits(ToggleFold, _MiscCommand6);

  function ToggleFold() {
    _classCallCheck(this, ToggleFold);

    _get(Object.getPrototypeOf(ToggleFold.prototype), 'constructor', this).apply(this, arguments);
  }

  // Base of zC, zO, zA

  _createClass(ToggleFold, [{
    key: 'execute',
    value: function execute() {
      for (var point of this.getCursorBufferPositions()) {
        this.editor.toggleFoldAtBufferRow(point.row);
      }
    }
  }]);

  return ToggleFold;
})(MiscCommand);

var FoldCurrentRowRecursivelyBase = (function (_MiscCommand7) {
  _inherits(FoldCurrentRowRecursivelyBase, _MiscCommand7);

  function FoldCurrentRowRecursivelyBase() {
    _classCallCheck(this, FoldCurrentRowRecursivelyBase);

    _get(Object.getPrototypeOf(FoldCurrentRowRecursivelyBase.prototype), 'constructor', this).apply(this, arguments);
  }

  // zC

  _createClass(FoldCurrentRowRecursivelyBase, [{
    key: 'eachFoldStartRow',
    value: function eachFoldStartRow(fn) {
      var _this2 = this;

      var _loop = function (_ref4) {
        var row = _ref4.row;

        if (!_this2.editor.isFoldableAtBufferRow(row)) return 'continue';

        var foldRanges = _this2.utils.getCodeFoldRanges(_this2.editor);
        var enclosingFoldRange = foldRanges.find(function (range) {
          return range.start.row === row;
        });
        var enclosedFoldRanges = foldRanges.filter(function (range) {
          return enclosingFoldRange.containsRange(range);
        });

        // Why reverse() is to process encolosed(nested) fold first than encolosing fold.
        enclosedFoldRanges.reverse().forEach(function (range) {
          return fn(range.start.row);
        });
      };

      for (var _ref4 of this.getCursorBufferPositionsOrdered().reverse()) {
        var _ret = _loop(_ref4);

        if (_ret === 'continue') continue;
      }
    }
  }, {
    key: 'foldRecursively',
    value: function foldRecursively() {
      var _this3 = this;

      this.eachFoldStartRow(function (row) {
        if (!_this3.editor.isFoldedAtBufferRow(row)) _this3.editor.foldBufferRow(row);
      });
    }
  }, {
    key: 'unfoldRecursively',
    value: function unfoldRecursively() {
      var _this4 = this;

      this.eachFoldStartRow(function (row) {
        if (_this4.editor.isFoldedAtBufferRow(row)) _this4.editor.unfoldBufferRow(row);
      });
    }
  }], [{
    key: 'command',
    value: false,
    enumerable: true
  }]);

  return FoldCurrentRowRecursivelyBase;
})(MiscCommand);

var FoldCurrentRowRecursively = (function (_FoldCurrentRowRecursivelyBase) {
  _inherits(FoldCurrentRowRecursively, _FoldCurrentRowRecursivelyBase);

  function FoldCurrentRowRecursively() {
    _classCallCheck(this, FoldCurrentRowRecursively);

    _get(Object.getPrototypeOf(FoldCurrentRowRecursively.prototype), 'constructor', this).apply(this, arguments);
  }

  // zO

  _createClass(FoldCurrentRowRecursively, [{
    key: 'execute',
    value: function execute() {
      this.foldRecursively();
    }
  }]);

  return FoldCurrentRowRecursively;
})(FoldCurrentRowRecursivelyBase);

var UnfoldCurrentRowRecursively = (function (_FoldCurrentRowRecursivelyBase2) {
  _inherits(UnfoldCurrentRowRecursively, _FoldCurrentRowRecursivelyBase2);

  function UnfoldCurrentRowRecursively() {
    _classCallCheck(this, UnfoldCurrentRowRecursively);

    _get(Object.getPrototypeOf(UnfoldCurrentRowRecursively.prototype), 'constructor', this).apply(this, arguments);
  }

  // zA

  _createClass(UnfoldCurrentRowRecursively, [{
    key: 'execute',
    value: function execute() {
      this.unfoldRecursively();
    }
  }]);

  return UnfoldCurrentRowRecursively;
})(FoldCurrentRowRecursivelyBase);

var ToggleFoldRecursively = (function (_FoldCurrentRowRecursivelyBase3) {
  _inherits(ToggleFoldRecursively, _FoldCurrentRowRecursivelyBase3);

  function ToggleFoldRecursively() {
    _classCallCheck(this, ToggleFoldRecursively);

    _get(Object.getPrototypeOf(ToggleFoldRecursively.prototype), 'constructor', this).apply(this, arguments);
  }

  // zR

  _createClass(ToggleFoldRecursively, [{
    key: 'execute',
    value: function execute() {
      if (this.editor.isFoldedAtBufferRow(this.getCursorBufferPosition().row)) {
        this.unfoldRecursively();
      } else {
        this.foldRecursively();
      }
    }
  }]);

  return ToggleFoldRecursively;
})(FoldCurrentRowRecursivelyBase);

var UnfoldAll = (function (_MiscCommand8) {
  _inherits(UnfoldAll, _MiscCommand8);

  function UnfoldAll() {
    _classCallCheck(this, UnfoldAll);

    _get(Object.getPrototypeOf(UnfoldAll.prototype), 'constructor', this).apply(this, arguments);
  }

  // zM

  _createClass(UnfoldAll, [{
    key: 'execute',
    value: function execute() {
      this.editor.unfoldAll();
    }
  }]);

  return UnfoldAll;
})(MiscCommand);

var FoldAll = (function (_MiscCommand9) {
  _inherits(FoldAll, _MiscCommand9);

  function FoldAll() {
    _classCallCheck(this, FoldAll);

    _get(Object.getPrototypeOf(FoldAll.prototype), 'constructor', this).apply(this, arguments);
  }

  // zr

  _createClass(FoldAll, [{
    key: 'execute',
    value: function execute() {
      var _utils$getFoldInfoByKind = this.utils.getFoldInfoByKind(this.editor);

      var allFold = _utils$getFoldInfoByKind.allFold;

      if (!allFold) return;

      this.editor.unfoldAll();
      for (var _ref52 of allFold.listOfRangeAndIndent) {
        var indent = _ref52.indent;
        var range = _ref52.range;

        if (indent <= this.getConfig('maxFoldableIndentLevel')) {
          this.editor.foldBufferRange(range);
        }
      }
      this.editor.scrollToCursorPosition({ center: true });
    }
  }]);

  return FoldAll;
})(MiscCommand);

var UnfoldNextIndentLevel = (function (_MiscCommand10) {
  _inherits(UnfoldNextIndentLevel, _MiscCommand10);

  function UnfoldNextIndentLevel() {
    _classCallCheck(this, UnfoldNextIndentLevel);

    _get(Object.getPrototypeOf(UnfoldNextIndentLevel.prototype), 'constructor', this).apply(this, arguments);
  }

  // zm

  _createClass(UnfoldNextIndentLevel, [{
    key: 'execute',
    value: function execute() {
      var _utils$getFoldInfoByKind2 = this.utils.getFoldInfoByKind(this.editor);

      var folded = _utils$getFoldInfoByKind2.folded;

      if (!folded) return;
      var minIndent = folded.minIndent;
      var listOfRangeAndIndent = folded.listOfRangeAndIndent;

      var targetIndents = this.utils.getList(minIndent, minIndent + this.getCount() - 1);
      for (var _ref62 of listOfRangeAndIndent) {
        var indent = _ref62.indent;
        var range = _ref62.range;

        if (targetIndents.includes(indent)) {
          this.editor.unfoldBufferRow(range.start.row);
        }
      }
    }
  }]);

  return UnfoldNextIndentLevel;
})(MiscCommand);

var FoldNextIndentLevel = (function (_MiscCommand11) {
  _inherits(FoldNextIndentLevel, _MiscCommand11);

  function FoldNextIndentLevel() {
    _classCallCheck(this, FoldNextIndentLevel);

    _get(Object.getPrototypeOf(FoldNextIndentLevel.prototype), 'constructor', this).apply(this, arguments);
  }

  // ctrl-e scroll lines downwards

  _createClass(FoldNextIndentLevel, [{
    key: 'execute',
    value: function execute() {
      var _utils$getFoldInfoByKind3 = this.utils.getFoldInfoByKind(this.editor);

      var unfolded = _utils$getFoldInfoByKind3.unfolded;
      var allFold = _utils$getFoldInfoByKind3.allFold;

      if (!unfolded) return;
      // FIXME: Why I need unfoldAll()? Why can't I just fold non-folded-fold only?
      // Unless unfoldAll() here, @editor.unfoldAll() delete foldMarker but fail
      // to render unfolded rows correctly.
      // I believe this is bug of text-buffer's markerLayer which assume folds are
      // created **in-order** from top-row to bottom-row.
      this.editor.unfoldAll();

      var maxFoldable = this.getConfig('maxFoldableIndentLevel');
      var fromLevel = Math.min(unfolded.maxIndent, maxFoldable);
      fromLevel = this.limitNumber(fromLevel - this.getCount() - 1, { min: 0 });
      var targetIndents = this.utils.getList(fromLevel, maxFoldable);
      for (var _ref72 of allFold.listOfRangeAndIndent) {
        var indent = _ref72.indent;
        var range = _ref72.range;

        if (targetIndents.includes(indent)) {
          this.editor.foldBufferRange(range);
        }
      }
    }
  }]);

  return FoldNextIndentLevel;
})(MiscCommand);

var MiniScrollDown = (function (_MiscCommand12) {
  _inherits(MiniScrollDown, _MiscCommand12);

  function MiniScrollDown() {
    _classCallCheck(this, MiniScrollDown);

    _get(Object.getPrototypeOf(MiniScrollDown.prototype), 'constructor', this).apply(this, arguments);

    this.defaultCount = this.getConfig('defaultScrollRowsOnMiniScroll');
    this.direction = 'down';
  }

  // ctrl-y scroll lines upwards

  _createClass(MiniScrollDown, [{
    key: 'keepCursorOnScreen',
    value: function keepCursorOnScreen() {
      var cursor = this.editor.getLastCursor();
      var row = cursor.getScreenRow();
      var offset = 2;
      var validRow = this.direction === 'down' ? this.limitNumber(row, { min: this.editor.getFirstVisibleScreenRow() + offset }) : this.limitNumber(row, { max: this.editor.getLastVisibleScreenRow() - offset });
      if (row !== validRow) {
        this.utils.setBufferRow(cursor, this.editor.bufferRowForScreenRow(validRow), { autoscroll: false });
      }
    }
  }, {
    key: 'execute',
    value: function execute() {
      var _this5 = this;

      this.vimState.requestScroll({
        amountOfPixels: (this.direction === 'down' ? 1 : -1) * this.getCount() * this.editor.getLineHeightInPixels(),
        duration: this.getSmoothScrollDuation('MiniScroll'),
        onFinish: function onFinish() {
          return _this5.keepCursorOnScreen();
        }
      });
    }
  }]);

  return MiniScrollDown;
})(MiscCommand);

var MiniScrollUp = (function (_MiniScrollDown) {
  _inherits(MiniScrollUp, _MiniScrollDown);

  function MiniScrollUp() {
    _classCallCheck(this, MiniScrollUp);

    _get(Object.getPrototypeOf(MiniScrollUp.prototype), 'constructor', this).apply(this, arguments);

    this.direction = 'up';
  }

  // RedrawCursorLineAt{XXX} in viewport.
  // +-------------------------------------------+
  // | where        | no move | move to 1st char |
  // |--------------+---------+------------------|
  // | top          | z t     | z enter          |
  // | upper-middle | z u     | z space          |
  // | middle       | z z     | z .              |
  // | bottom       | z b     | z -              |
  // +-------------------------------------------+
  return MiniScrollUp;
})(MiniScrollDown);

var RedrawCursorLine = (function (_MiscCommand13) {
  _inherits(RedrawCursorLine, _MiscCommand13);

  function RedrawCursorLine() {
    _classCallCheck(this, RedrawCursorLine);

    _get(Object.getPrototypeOf(RedrawCursorLine.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(RedrawCursorLine, [{
    key: 'initialize',
    value: function initialize() {
      var baseName = this.name.replace(/AndMoveToFirstCharacterOfLine$/, '');
      this.coefficient = this.constructor.coefficientByName[baseName];
      this.moveToFirstCharacterOfLine = this.name.endsWith('AndMoveToFirstCharacterOfLine');
      _get(Object.getPrototypeOf(RedrawCursorLine.prototype), 'initialize', this).call(this);
    }
  }, {
    key: 'execute',
    value: function execute() {
      var _this6 = this;

      var scrollTop = Math.round(this.getScrollTop());
      this.vimState.requestScroll({
        scrollTop: scrollTop,
        duration: this.getSmoothScrollDuation('RedrawCursorLine'),
        onFinish: function onFinish() {
          if (_this6.getConfig('askOptInToEditorScrollPastEnd') && _this6.editorElement.getScrollTop() !== scrollTop && !_this6.editor.getScrollPastEnd()) {
            _this6.recommendToEnableScrollPastEnd();
          }
        }
      });
      if (this.moveToFirstCharacterOfLine) this.editor.moveToFirstCharacterOfLine();
    }
  }, {
    key: 'getScrollTop',
    value: function getScrollTop() {
      var _editorElement$pixelPositionForScreenPosition = this.editorElement.pixelPositionForScreenPosition(this.editor.getCursorScreenPosition());

      var top = _editorElement$pixelPositionForScreenPosition.top;

      var editorHeight = this.editorElement.getHeight();
      var lineHeightInPixel = this.editor.getLineHeightInPixels();

      return this.limitNumber(top - editorHeight * this.coefficient, {
        min: top - editorHeight + lineHeightInPixel * 3,
        max: top - lineHeightInPixel * 2
      });
    }
  }, {
    key: 'recommendToEnableScrollPastEnd',
    value: function recommendToEnableScrollPastEnd() {
      var message = ['vim-mode-plus', '- Failed to scroll. To successfully scroll, `editor.scrollPastEnd` need to be enabled.', '- You can do it from `"Settings" > "Editor" > "Scroll Past End"`.', '- Or **do you allow vmp enable it for you now?**'].join('\n');

      var notification = atom.notifications.addInfo(message, {
        dismissable: true,
        buttons: [{
          text: 'No thanks.',
          onDidClick: function onDidClick() {
            return notification.dismiss();
          }
        }, {
          text: 'Never ask again.',
          onDidClick: function onDidClick() {
            atom.config.set('vim-mode-plus.askOptInToEditorScrollPastEnd', false);
            notification.dismiss();
          }
        }, {
          text: 'OK. Enable it now!!',
          onDidClick: function onDidClick() {
            atom.config.set('editor.scrollPastEnd', true);
            notification.dismiss();
          }
        }]
      });
    }
  }], [{
    key: 'command',
    value: false,
    enumerable: true
  }, {
    key: 'coefficientByName',
    value: {
      RedrawCursorLineAtTop: 0,
      RedrawCursorLineAtUpperMiddle: 0.25,
      RedrawCursorLineAtMiddle: 0.5,
      RedrawCursorLineAtBottom: 1
    },
    enumerable: true
  }]);

  return RedrawCursorLine;
})(MiscCommand);

var RedrawCursorLineAtTop = (function (_RedrawCursorLine) {
  _inherits(RedrawCursorLineAtTop, _RedrawCursorLine);

  function RedrawCursorLineAtTop() {
    _classCallCheck(this, RedrawCursorLineAtTop);

    _get(Object.getPrototypeOf(RedrawCursorLineAtTop.prototype), 'constructor', this).apply(this, arguments);
  }

  // zt
  return RedrawCursorLineAtTop;
})(RedrawCursorLine);

var RedrawCursorLineAtTopAndMoveToFirstCharacterOfLine = (function (_RedrawCursorLine2) {
  _inherits(RedrawCursorLineAtTopAndMoveToFirstCharacterOfLine, _RedrawCursorLine2);

  function RedrawCursorLineAtTopAndMoveToFirstCharacterOfLine() {
    _classCallCheck(this, RedrawCursorLineAtTopAndMoveToFirstCharacterOfLine);

    _get(Object.getPrototypeOf(RedrawCursorLineAtTopAndMoveToFirstCharacterOfLine.prototype), 'constructor', this).apply(this, arguments);
  }

  // z enter
  return RedrawCursorLineAtTopAndMoveToFirstCharacterOfLine;
})(RedrawCursorLine);

var RedrawCursorLineAtUpperMiddle = (function (_RedrawCursorLine3) {
  _inherits(RedrawCursorLineAtUpperMiddle, _RedrawCursorLine3);

  function RedrawCursorLineAtUpperMiddle() {
    _classCallCheck(this, RedrawCursorLineAtUpperMiddle);

    _get(Object.getPrototypeOf(RedrawCursorLineAtUpperMiddle.prototype), 'constructor', this).apply(this, arguments);
  }

  // zu
  return RedrawCursorLineAtUpperMiddle;
})(RedrawCursorLine);

var RedrawCursorLineAtUpperMiddleAndMoveToFirstCharacterOfLine = (function (_RedrawCursorLine4) {
  _inherits(RedrawCursorLineAtUpperMiddleAndMoveToFirstCharacterOfLine, _RedrawCursorLine4);

  function RedrawCursorLineAtUpperMiddleAndMoveToFirstCharacterOfLine() {
    _classCallCheck(this, RedrawCursorLineAtUpperMiddleAndMoveToFirstCharacterOfLine);

    _get(Object.getPrototypeOf(RedrawCursorLineAtUpperMiddleAndMoveToFirstCharacterOfLine.prototype), 'constructor', this).apply(this, arguments);
  }

  // z space
  return RedrawCursorLineAtUpperMiddleAndMoveToFirstCharacterOfLine;
})(RedrawCursorLine);

var RedrawCursorLineAtMiddle = (function (_RedrawCursorLine5) {
  _inherits(RedrawCursorLineAtMiddle, _RedrawCursorLine5);

  function RedrawCursorLineAtMiddle() {
    _classCallCheck(this, RedrawCursorLineAtMiddle);

    _get(Object.getPrototypeOf(RedrawCursorLineAtMiddle.prototype), 'constructor', this).apply(this, arguments);
  }

  // z z
  return RedrawCursorLineAtMiddle;
})(RedrawCursorLine);

var RedrawCursorLineAtMiddleAndMoveToFirstCharacterOfLine = (function (_RedrawCursorLine6) {
  _inherits(RedrawCursorLineAtMiddleAndMoveToFirstCharacterOfLine, _RedrawCursorLine6);

  function RedrawCursorLineAtMiddleAndMoveToFirstCharacterOfLine() {
    _classCallCheck(this, RedrawCursorLineAtMiddleAndMoveToFirstCharacterOfLine);

    _get(Object.getPrototypeOf(RedrawCursorLineAtMiddleAndMoveToFirstCharacterOfLine.prototype), 'constructor', this).apply(this, arguments);
  }

  // z .
  return RedrawCursorLineAtMiddleAndMoveToFirstCharacterOfLine;
})(RedrawCursorLine);

var RedrawCursorLineAtBottom = (function (_RedrawCursorLine7) {
  _inherits(RedrawCursorLineAtBottom, _RedrawCursorLine7);

  function RedrawCursorLineAtBottom() {
    _classCallCheck(this, RedrawCursorLineAtBottom);

    _get(Object.getPrototypeOf(RedrawCursorLineAtBottom.prototype), 'constructor', this).apply(this, arguments);
  }

  // z b
  return RedrawCursorLineAtBottom;
})(RedrawCursorLine);

var RedrawCursorLineAtBottomAndMoveToFirstCharacterOfLine = (function (_RedrawCursorLine8) {
  _inherits(RedrawCursorLineAtBottomAndMoveToFirstCharacterOfLine, _RedrawCursorLine8);

  function RedrawCursorLineAtBottomAndMoveToFirstCharacterOfLine() {
    _classCallCheck(this, RedrawCursorLineAtBottomAndMoveToFirstCharacterOfLine);

    _get(Object.getPrototypeOf(RedrawCursorLineAtBottomAndMoveToFirstCharacterOfLine.prototype), 'constructor', this).apply(this, arguments);
  }

  // z -

  // Horizontal Scroll without changing cursor position
  // -------------------------
  // zs
  return RedrawCursorLineAtBottomAndMoveToFirstCharacterOfLine;
})(RedrawCursorLine);

var ScrollCursorToLeft = (function (_MiscCommand14) {
  _inherits(ScrollCursorToLeft, _MiscCommand14);

  function ScrollCursorToLeft() {
    _classCallCheck(this, ScrollCursorToLeft);

    _get(Object.getPrototypeOf(ScrollCursorToLeft.prototype), 'constructor', this).apply(this, arguments);

    this.which = 'left';
  }

  // ze

  _createClass(ScrollCursorToLeft, [{
    key: 'execute',
    value: function execute() {
      var translation = this.which === 'left' ? [0, 0] : [0, 1];
      var screenPosition = this.editor.getCursorScreenPosition().translate(translation);
      var pixel = this.editorElement.pixelPositionForScreenPosition(screenPosition);
      if (this.which === 'left') {
        this.editorElement.setScrollLeft(pixel.left);
      } else {
        this.editorElement.setScrollRight(pixel.left);
        this.editor.component.updateSync(); // FIXME: This is necessary maybe because of bug of atom-core.
      }
    }
  }]);

  return ScrollCursorToLeft;
})(MiscCommand);

var ScrollCursorToRight = (function (_ScrollCursorToLeft) {
  _inherits(ScrollCursorToRight, _ScrollCursorToLeft);

  function ScrollCursorToRight() {
    _classCallCheck(this, ScrollCursorToRight);

    _get(Object.getPrototypeOf(ScrollCursorToRight.prototype), 'constructor', this).apply(this, arguments);

    this.which = 'right';
  }

  // insert-mode specific commands
  // -------------------------
  return ScrollCursorToRight;
})(ScrollCursorToLeft);

var InsertMode = (function (_MiscCommand15) {
  _inherits(InsertMode, _MiscCommand15);

  function InsertMode() {
    _classCallCheck(this, InsertMode);

    _get(Object.getPrototypeOf(InsertMode.prototype), 'constructor', this).apply(this, arguments);
  }

  // just namespace

  return InsertMode;
})(MiscCommand);

var ActivateNormalModeOnce = (function (_InsertMode) {
  _inherits(ActivateNormalModeOnce, _InsertMode);

  function ActivateNormalModeOnce() {
    _classCallCheck(this, ActivateNormalModeOnce);

    _get(Object.getPrototypeOf(ActivateNormalModeOnce.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(ActivateNormalModeOnce, [{
    key: 'execute',
    value: function execute() {
      var _this7 = this;

      var cursorsToMoveRight = this.editor.getCursors().filter(function (cursor) {
        return !cursor.isAtBeginningOfLine();
      });
      this.vimState.activate('normal');
      for (var cursor of cursorsToMoveRight) {
        this.utils.moveCursorRight(cursor);
      }

      var disposable = atom.commands.onDidDispatch(function (event) {
        if (event.type !== _this7.getCommandName()) {
          disposable.dispose();
          _this7.vimState.activate('insert');
        }
      });
    }
  }]);

  return ActivateNormalModeOnce;
})(InsertMode);

var ToggleReplaceMode = (function (_MiscCommand16) {
  _inherits(ToggleReplaceMode, _MiscCommand16);

  function ToggleReplaceMode() {
    _classCallCheck(this, ToggleReplaceMode);

    _get(Object.getPrototypeOf(ToggleReplaceMode.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(ToggleReplaceMode, [{
    key: 'execute',
    value: function execute() {
      if (this.mode === 'insert') {
        if (this.submode === 'replace') {
          this.vimState.operationStack.runNext('ActivateInsertMode');
        } else {
          this.vimState.operationStack.runNext('ActivateReplaceMode');
        }
      }
    }
  }]);

  return ToggleReplaceMode;
})(MiscCommand);

var InsertRegister = (function (_InsertMode2) {
  _inherits(InsertRegister, _InsertMode2);

  function InsertRegister() {
    _classCallCheck(this, InsertRegister);

    _get(Object.getPrototypeOf(InsertRegister.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(InsertRegister, [{
    key: 'execute',
    value: _asyncToGenerator(function* () {
      var _this8 = this;

      var input = yield this.readCharPromised();
      if (input) {
        this.editor.transact(function () {
          for (var selection of _this8.editor.getSelections()) {
            selection.insertText(_this8.vimState.register.getText(input, selection));
          }
        });
      }
    })
  }]);

  return InsertRegister;
})(InsertMode);

var InsertLastInserted = (function (_InsertMode3) {
  _inherits(InsertLastInserted, _InsertMode3);

  function InsertLastInserted() {
    _classCallCheck(this, InsertLastInserted);

    _get(Object.getPrototypeOf(InsertLastInserted.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(InsertLastInserted, [{
    key: 'execute',
    value: function execute() {
      this.editor.insertText(this.vimState.register.getText('.'));
    }
  }]);

  return InsertLastInserted;
})(InsertMode);

var CopyFromLineAbove = (function (_InsertMode4) {
  _inherits(CopyFromLineAbove, _InsertMode4);

  function CopyFromLineAbove() {
    _classCallCheck(this, CopyFromLineAbove);

    _get(Object.getPrototypeOf(CopyFromLineAbove.prototype), 'constructor', this).apply(this, arguments);

    this.rowDelta = -1;
  }

  _createClass(CopyFromLineAbove, [{
    key: 'execute',
    value: function execute() {
      var _this9 = this;

      var translation = [this.rowDelta, 0];
      this.editor.transact(function () {
        for (var selection of _this9.editor.getSelections()) {
          var point = selection.cursor.getBufferPosition().translate(translation);
          if (point.row >= 0) {
            var range = Range.fromPointWithDelta(point, 0, 1);
            var text = _this9.editor.getTextInBufferRange(range);
            if (text) selection.insertText(text);
          }
        }
      });
    }
  }]);

  return CopyFromLineAbove;
})(InsertMode);

var CopyFromLineBelow = (function (_CopyFromLineAbove) {
  _inherits(CopyFromLineBelow, _CopyFromLineAbove);

  function CopyFromLineBelow() {
    _classCallCheck(this, CopyFromLineBelow);

    _get(Object.getPrototypeOf(CopyFromLineBelow.prototype), 'constructor', this).apply(this, arguments);

    this.rowDelta = +1;
  }

  return CopyFromLineBelow;
})(CopyFromLineAbove);

var NextTab = (function (_MiscCommand17) {
  _inherits(NextTab, _MiscCommand17);

  function NextTab() {
    _classCallCheck(this, NextTab);

    _get(Object.getPrototypeOf(NextTab.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(NextTab, [{
    key: 'execute',
    value: function execute() {
      var pane = atom.workspace.paneForItem(this.editor);

      if (this.hasCount()) {
        pane.activateItemAtIndex(this.getCount() - 1);
      } else {
        pane.activateNextItem();
      }
    }
  }]);

  return NextTab;
})(MiscCommand);

var PreviousTab = (function (_MiscCommand18) {
  _inherits(PreviousTab, _MiscCommand18);

  function PreviousTab() {
    _classCallCheck(this, PreviousTab);

    _get(Object.getPrototypeOf(PreviousTab.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(PreviousTab, [{
    key: 'execute',
    value: function execute() {
      atom.workspace.paneForItem(this.editor).activatePreviousItem();
    }
  }]);

  return PreviousTab;
})(MiscCommand);

module.exports = {
  MiscCommand: MiscCommand,
  Mark: Mark,
  ReverseSelections: ReverseSelections,
  BlockwiseOtherEnd: BlockwiseOtherEnd,
  Undo: Undo,
  Redo: Redo,
  FoldCurrentRow: FoldCurrentRow,
  UnfoldCurrentRow: UnfoldCurrentRow,
  ToggleFold: ToggleFold,
  FoldCurrentRowRecursivelyBase: FoldCurrentRowRecursivelyBase,
  FoldCurrentRowRecursively: FoldCurrentRowRecursively,
  UnfoldCurrentRowRecursively: UnfoldCurrentRowRecursively,
  ToggleFoldRecursively: ToggleFoldRecursively,
  UnfoldAll: UnfoldAll,
  FoldAll: FoldAll,
  UnfoldNextIndentLevel: UnfoldNextIndentLevel,
  FoldNextIndentLevel: FoldNextIndentLevel,
  MiniScrollDown: MiniScrollDown,
  MiniScrollUp: MiniScrollUp,
  RedrawCursorLine: RedrawCursorLine,
  RedrawCursorLineAtTop: RedrawCursorLineAtTop,
  RedrawCursorLineAtTopAndMoveToFirstCharacterOfLine: RedrawCursorLineAtTopAndMoveToFirstCharacterOfLine,
  RedrawCursorLineAtUpperMiddle: RedrawCursorLineAtUpperMiddle,
  RedrawCursorLineAtUpperMiddleAndMoveToFirstCharacterOfLine: RedrawCursorLineAtUpperMiddleAndMoveToFirstCharacterOfLine,
  RedrawCursorLineAtMiddle: RedrawCursorLineAtMiddle,
  RedrawCursorLineAtMiddleAndMoveToFirstCharacterOfLine: RedrawCursorLineAtMiddleAndMoveToFirstCharacterOfLine,
  RedrawCursorLineAtBottom: RedrawCursorLineAtBottom,
  RedrawCursorLineAtBottomAndMoveToFirstCharacterOfLine: RedrawCursorLineAtBottomAndMoveToFirstCharacterOfLine,
  ScrollCursorToLeft: ScrollCursorToLeft,
  ScrollCursorToRight: ScrollCursorToRight,
  ActivateNormalModeOnce: ActivateNormalModeOnce,
  ToggleReplaceMode: ToggleReplaceMode,
  InsertRegister: InsertRegister,
  InsertLastInserted: InsertLastInserted,
  CopyFromLineAbove: CopyFromLineAbove,
  CopyFromLineBelow: CopyFromLineBelow,
  NextTab: NextTab,
  PreviousTab: PreviousTab
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9naXQvLmF0b20vcGFja2FnZXMvdmltLW1vZGUtcGx1cy9saWIvbWlzYy1jb21tYW5kLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFdBQVcsQ0FBQTs7Ozs7Ozs7Ozs7O2VBRUssT0FBTyxDQUFDLE1BQU0sQ0FBQzs7SUFBeEIsS0FBSyxZQUFMLEtBQUs7O0FBQ1osSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFBOztJQUV4QixXQUFXO1lBQVgsV0FBVzs7V0FBWCxXQUFXOzBCQUFYLFdBQVc7OytCQUFYLFdBQVc7OztlQUFYLFdBQVc7O1dBQ0UsS0FBSzs7OztXQUNDLGNBQWM7Ozs7U0FGakMsV0FBVztHQUFTLElBQUk7O0lBS3hCLElBQUk7WUFBSixJQUFJOztXQUFKLElBQUk7MEJBQUosSUFBSTs7K0JBQUosSUFBSTs7O2VBQUosSUFBSTs7NkJBQ00sYUFBRztBQUNmLFVBQU0sSUFBSSxHQUFHLE1BQU0sSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUE7QUFDMUMsVUFBSSxJQUFJLEVBQUU7QUFDUixZQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyx1QkFBdUIsRUFBRSxDQUFDLENBQUE7T0FDN0Q7S0FDRjs7O1NBTkcsSUFBSTtHQUFTLFdBQVc7O0lBU3hCLGlCQUFpQjtZQUFqQixpQkFBaUI7O1dBQWpCLGlCQUFpQjswQkFBakIsaUJBQWlCOzsrQkFBakIsaUJBQWlCOzs7ZUFBakIsaUJBQWlCOztXQUNiLG1CQUFHO0FBQ1QsVUFBSSxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUE7QUFDdEYsVUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxXQUFXLENBQUMsRUFBRTtBQUN0QyxZQUFJ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QUFDUCxhQUFXLEVBQVgsV0FBVztDQUNaLENBQUEiLCJmaWxlIjoiL1VzZXJzL2dpdC8uYXRvbS9wYWNrYWdlcy92aW0tbW9kZS1wbHVzL2xpYi9taXNjLWNvbW1hbmQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5jb25zdCB7UmFuZ2V9ID0gcmVxdWlyZSgnYXRvbScpXG5jb25zdCBCYXNlID0gcmVxdWlyZSgnLi9iYXNlJylcblxuY2xhc3MgTWlzY0NvbW1hbmQgZXh0ZW5kcyBCYXNlIHtcbiAgc3RhdGljIGNvbW1hbmQgPSBmYWxzZVxuICBzdGF0aWMgb3BlcmF0aW9uS2luZCA9ICdtaXNjLWNvbW1hbmQnXG59XG5cbmNsYXNzIE1hcmsgZXh0ZW5kcyBNaXNjQ29tbWFuZCB7XG4gIGFzeW5jIGV4ZWN1dGUgKCkge1xuICAgIGNvbnN0IG1hcmsgPSBhd2FpdCB0aGlzLnJlYWRDaGFyUHJvbWlzZWQoKVxuICAgIGlmIChtYXJrKSB7XG4gICAgICB0aGlzLnZpbVN0YXRlLm1hcmsuc2V0KG1hcmssIHRoaXMuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oKSlcbiAgICB9XG4gIH1cbn1cblxuY2xhc3MgUmV2ZXJzZVNlbGVjdGlvbnMgZXh0ZW5kcyBNaXNjQ29tbWFuZCB7XG4gIGV4ZWN1dGUgKCkge1xuICAgIHRoaXMuc3dyYXAuc2V0UmV2ZXJzZWRTdGF0ZSh0aGlzLmVkaXRvciwgIXRoaXMuZWRpdG9yLmdldExhc3RTZWxlY3Rpb24oKS5pc1JldmVyc2VkKCkpXG4gICAgaWYgKHRoaXMuaXNNb2RlKCd2aXN1YWwnLCAnYmxvY2t3aXNlJykpIHtcbiAgICAgIHRoaXMuZ2V0TGFzdEJsb2Nrd2lzZVNlbGVjdGlvbigpLmF1dG9zY3JvbGwoKVxuICAgIH1cbiAgfVxufVxuXG5jbGFzcyBCbG9ja3dpc2VPdGhlckVuZCBleHRlbmRzIFJldmVyc2VTZWxlY3Rpb25zIHtcbiAgZXhlY3V0ZSAoKSB7XG4gICAgZm9yIChjb25zdCBibG9ja3dpc2VTZWxlY3Rpb24gb2YgdGhpcy5nZXRCbG9ja3dpc2VTZWxlY3Rpb25zKCkpIHtcbiAgICAgIGJsb2Nrd2lzZVNlbGVjdGlvbi5yZXZlcnNlKClcbiAgICB9XG4gICAgc3VwZXIuZXhlY3V0ZSgpXG4gIH1cbn1cblxuY2xhc3MgVW5kbyBleHRlbmRzIE1pc2NDb21tYW5kIHtcbiAgZXhlY3V0ZSAoKSB7XG4gICAgY29uc3QgbmV3UmFuZ2VzID0gW11cbiAgICBjb25zdCBvbGRSYW5nZXMgPSBbXVxuXG4gICAgY29uc3QgZGlzcG9zYWJsZSA9IHRoaXMuZWRpdG9yLmdldEJ1ZmZlcigpLm9uRGlkQ2hhbmdlVGV4dChldmVudCA9PiB7XG4gICAgICBmb3IgKGNvbnN0IHtuZXdSYW5nZSwgb2xkUmFuZ2V9IG9mIGV2ZW50LmNoYW5nZXMpIHtcbiAgICAgICAgaWYgKG5ld1JhbmdlLmlzRW1wdHkoKSkge1xuICAgICAgICAgIG9sZFJhbmdlcy5wdXNoKG9sZFJhbmdlKSAvLyBSZW1vdmUgb25seVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG5ld1Jhbmdlcy5wdXNoKG5ld1JhbmdlKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcblxuICAgIGlmICh0aGlzLm5hbWUgPT09ICdVbmRvJykge1xuICAgICAgdGhpcy5lZGl0b3IudW5kbygpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZWRpdG9yLnJlZG8oKVxuICAgIH1cblxuICAgIGRpc3Bvc2FibGUuZGlzcG9zZSgpXG5cbiAgICBmb3IgKGNvbnN0IHNlbGVjdGlvbiBvZiB0aGlzLmVkaXRvci5nZXRTZWxlY3Rpb25zKCkpIHtcbiAgICAgIHNlbGVjdGlvbi5jbGVhcigpXG4gICAgfVxuXG4gICAgaWYgKHRoaXMuZ2V0Q29uZmlnKCdzZXRDdXJzb3JUb1N0YXJ0T2ZDaGFuZ2VPblVuZG9SZWRvJykpIHtcbiAgICAgIGNvbnN0IHN0cmF0ZWd5ID0gdGhpcy5nZXRDb25maWcoJ3NldEN1cnNvclRvU3RhcnRPZkNoYW5nZU9uVW5kb1JlZG9TdHJhdGVneScpXG4gICAgICB0aGlzLnNldEN1cnNvclBvc2l0aW9uKHtuZXdSYW5nZXMsIG9sZFJhbmdlcywgc3RyYXRlZ3l9KVxuICAgICAgdGhpcy52aW1TdGF0ZS5jbGVhclNlbGVjdGlvbnMoKVxuICAgIH1cblxuICAgIGlmICh0aGlzLmdldENvbmZpZygnZmxhc2hPblVuZG9SZWRvJykpIHtcbiAgICAgIGlmIChuZXdSYW5nZXMubGVuZ3RoKSB7XG4gICAgICAgIHRoaXMuZmxhc2hDaGFuZ2VzKG5ld1JhbmdlcywgJ2NoYW5nZXMnKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5mbGFzaENoYW5nZXMob2xkUmFuZ2VzLCAnZGVsZXRlcycpXG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuYWN0aXZhdGVNb2RlKCdub3JtYWwnKVxuICB9XG5cbiAgc2V0Q3Vyc29yUG9zaXRpb24gKHtuZXdSYW5nZXMsIG9sZFJhbmdlcywgc3RyYXRlZ3l9KSB7XG4gICAgY29uc3QgbGFzdEN1cnNvciA9IHRoaXMuZWRpdG9yLmdldExhc3RDdXJzb3IoKSAvLyBUaGlzIGlzIHJlc3RvcmVkIGN1cnNvclxuXG4gICAgbGV0IGNoYW5nZWRSYW5nZVxuXG4gICAgaWYgKHN0cmF0ZWd5ID09PSAnc21hcnQnKSB7XG4gICAgICBjaGFuZ2VkUmFuZ2UgPSB0aGlzLnV0aWxzLmZpbmRSYW5nZUNvbnRhaW5zUG9pbnQobmV3UmFuZ2VzLCBsYXN0Q3Vyc29yLmdldEJ1ZmZlclBvc2l0aW9uKCkpXG4gICAgfSBlbHNlIGlmIChzdHJhdGVneSA9PT0gJ3NpbXBsZScpIHtcbiAgICAgIGNoYW5nZWRSYW5nZSA9IHRoaXMudXRpbHMuc29ydFJhbmdlcyhuZXdSYW5nZXMuY29uY2F0KG9sZFJhbmdlcykpWzBdXG4gICAgfVxuXG4gICAgaWYgKGNoYW5nZWRSYW5nZSkge1xuICAgICAgaWYgKHRoaXMudXRpbHMuaXNMaW5ld2lzZVJhbmdlKGNoYW5nZWRSYW5nZSkpIHRoaXMudXRpbHMuc2V0QnVmZmVyUm93KGxhc3RDdXJzb3IsIGNoYW5nZWRSYW5nZS5zdGFydC5yb3cpXG4gICAgICBlbHNlIGxhc3RDdXJzb3Iuc2V0QnVmZmVyUG9zaXRpb24oY2hhbmdlZFJhbmdlLnN0YXJ0KVxuICAgIH1cbiAgfVxuXG4gIGZsYXNoQ2hhbmdlcyAocmFuZ2VzLCBtdXRhdGlvblR5cGUpIHtcbiAgICBjb25zdCBpc011bHRpcGxlU2luZ2xlTGluZVJhbmdlcyA9IHJhbmdlcyA9PiByYW5nZXMubGVuZ3RoID4gMSAmJiByYW5nZXMuZXZlcnkodGhpcy51dGlscy5pc1NpbmdsZUxpbmVSYW5nZSlcbiAgICBjb25zdCBodW1hbml6ZU5ld0xpbmVGb3JCdWZmZXJSYW5nZSA9IHRoaXMudXRpbHMuaHVtYW5pemVOZXdMaW5lRm9yQnVmZmVyUmFuZ2UuYmluZChudWxsLCB0aGlzLmVkaXRvcilcbiAgICBjb25zdCBpc05vdExlYWRpbmdXaGl0ZVNwYWNlUmFuZ2UgPSB0aGlzLnV0aWxzLmlzTm90TGVhZGluZ1doaXRlU3BhY2VSYW5nZS5iaW5kKG51bGwsIHRoaXMuZWRpdG9yKVxuICAgIGlmICghdGhpcy51dGlscy5pc011bHRpcGxlQW5kQWxsUmFuZ2VIYXZlU2FtZUNvbHVtbkFuZENvbnNlY3V0aXZlUm93cyhyYW5nZXMpKSB7XG4gICAgICByYW5nZXMgPSByYW5nZXMubWFwKGh1bWFuaXplTmV3TGluZUZvckJ1ZmZlclJhbmdlKVxuICAgICAgY29uc3QgdHlwZSA9IGlzTXVsdGlwbGVTaW5nbGVMaW5lUmFuZ2VzKHJhbmdlcykgPyBgdW5kby1yZWRvLW11bHRpcGxlLSR7bXV0YXRpb25UeXBlfWAgOiAndW5kby1yZWRvJ1xuICAgICAgaWYgKCEodHlwZSA9PT0gJ3VuZG8tcmVkbycgJiYgbXV0YXRpb25UeXBlID09PSAnZGVsZXRlcycpKSB7XG4gICAgICAgIHRoaXMudmltU3RhdGUuZmxhc2gocmFuZ2VzLmZpbHRlcihpc05vdExlYWRpbmdXaGl0ZVNwYWNlUmFuZ2UpLCB7dHlwZX0pXG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmNsYXNzIFJlZG8gZXh0ZW5kcyBVbmRvIHt9XG5cbi8vIHpjXG5jbGFzcyBGb2xkQ3VycmVudFJvdyBleHRlbmRzIE1pc2NDb21tYW5kIHtcbiAgZXhlY3V0ZSAoKSB7XG4gICAgZm9yIChjb25zdCBwb2ludCBvZiB0aGlzLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9ucygpKSB7XG4gICAgICB0aGlzLmVkaXRvci5mb2xkQnVmZmVyUm93KHBvaW50LnJvdylcbiAgICB9XG4gIH1cbn1cblxuLy8gem9cbmNsYXNzIFVuZm9sZEN1cnJlbnRSb3cgZXh0ZW5kcyBNaXNjQ29tbWFuZCB7XG4gIGV4ZWN1dGUgKCkge1xuICAgIGZvciAoY29uc3QgcG9pbnQgb2YgdGhpcy5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbnMoKSkge1xuICAgICAgdGhpcy5lZGl0b3IudW5mb2xkQnVmZmVyUm93KHBvaW50LnJvdylcbiAgICB9XG4gIH1cbn1cblxuLy8gemFcbmNsYXNzIFRvZ2dsZUZvbGQgZXh0ZW5kcyBNaXNjQ29tbWFuZCB7XG4gIGV4ZWN1dGUgKCkge1xuICAgIGZvciAoY29uc3QgcG9pbnQgb2YgdGhpcy5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbnMoKSkge1xuICAgICAgdGhpcy5lZGl0b3IudG9nZ2xlRm9sZEF0QnVmZmVyUm93KHBvaW50LnJvdylcbiAgICB9XG4gIH1cbn1cblxuLy8gQmFzZSBvZiB6Qywgek8sIHpBXG5jbGFzcyBGb2xkQ3VycmVudFJvd1JlY3Vyc2l2ZWx5QmFzZSBleHRlbmRzIE1pc2NDb21tYW5kIHtcbiAgc3RhdGljIGNvbW1hbmQgPSBmYWxzZVxuICBlYWNoRm9sZFN0YXJ0Um93IChmbikge1xuICAgIGZvciAoY29uc3Qge3Jvd30gb2YgdGhpcy5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbnNPcmRlcmVkKCkucmV2ZXJzZSgpKSB7XG4gICAgICBpZiAoIXRoaXMuZWRpdG9yLmlzRm9sZGFibGVBdEJ1ZmZlclJvdyhyb3cpKSBjb250aW51ZVxuXG4gICAgICBjb25zdCBmb2xkUmFuZ2VzID0gdGhpcy51dGlscy5nZXRDb2RlRm9sZFJhbmdlcyh0aGlzLmVkaXRvcilcbiAgICAgIGNvbnN0IGVuY2xvc2luZ0ZvbGRSYW5nZSA9IGZvbGRSYW5nZXMuZmluZChyYW5nZSA9PiByYW5nZS5zdGFydC5yb3cgPT09IHJvdylcbiAgICAgIGNvbnN0IGVuY2xvc2VkRm9sZFJhbmdlcyA9IGZvbGRSYW5nZXMuZmlsdGVyKHJhbmdlID0+IGVuY2xvc2luZ0ZvbGRSYW5nZS5jb250YWluc1JhbmdlKHJhbmdlKSlcblxuICAgICAgLy8gV2h5IHJldmVyc2UoKSBpcyB0byBwcm9jZXNzIGVuY29sb3NlZChuZXN0ZWQpIGZvbGQgZmlyc3QgdGhhbiBlbmNvbG9zaW5nIGZvbGQuXG4gICAgICBlbmNsb3NlZEZvbGRSYW5nZXMucmV2ZXJzZSgpLmZvckVhY2gocmFuZ2UgPT4gZm4ocmFuZ2Uuc3RhcnQucm93KSlcbiAgICB9XG4gIH1cblxuICBmb2xkUmVjdXJzaXZlbHkgKCkge1xuICAgIHRoaXMuZWFjaEZvbGRTdGFydFJvdyhyb3cgPT4ge1xuICAgICAgaWYgKCF0aGlzLmVkaXRvci5pc0ZvbGRlZEF0QnVmZmVyUm93KHJvdykpIHRoaXMuZWRpdG9yLmZvbGRCdWZmZXJSb3cocm93KVxuICAgIH0pXG4gIH1cblxuICB1bmZvbGRSZWN1cnNpdmVseSAoKSB7XG4gICAgdGhpcy5lYWNoRm9sZFN0YXJ0Um93KHJvdyA9PiB7XG4gICAgICBpZiAodGhpcy5lZGl0b3IuaXNGb2xkZWRBdEJ1ZmZlclJvdyhyb3cpKSB0aGlzLmVkaXRvci51bmZvbGRCdWZmZXJSb3cocm93KVxuICAgIH0pXG4gIH1cbn1cblxuLy8gekNcbmNsYXNzIEZvbGRDdXJyZW50Um93UmVjdXJzaXZlbHkgZXh0ZW5kcyBGb2xkQ3VycmVudFJvd1JlY3Vyc2l2ZWx5QmFzZSB7XG4gIGV4ZWN1dGUgKCkge1xuICAgIHRoaXMuZm9sZFJlY3Vyc2l2ZWx5KClcbiAgfVxufVxuXG4vLyB6T1xuY2xhc3MgVW5mb2xkQ3VycmVudFJvd1JlY3Vyc2l2ZWx5IGV4dGVuZHMgRm9sZEN1cnJlbnRSb3dSZWN1cnNpdmVseUJhc2Uge1xuICBleGVjdXRlICgpIHtcbiAgICB0aGlzLnVuZm9sZFJlY3Vyc2l2ZWx5KClcbiAgfVxufVxuXG4vLyB6QVxuY2xhc3MgVG9nZ2xlRm9sZFJlY3Vyc2l2ZWx5IGV4dGVuZHMgRm9sZEN1cnJlbnRSb3dSZWN1cnNpdmVseUJhc2Uge1xuICBleGVjdXRlICgpIHtcbiAgICBpZiAodGhpcy5lZGl0b3IuaXNGb2xkZWRBdEJ1ZmZlclJvdyh0aGlzLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9uKCkucm93KSkge1xuICAgICAgdGhpcy51bmZvbGRSZWN1cnNpdmVseSgpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZm9sZFJlY3Vyc2l2ZWx5KClcbiAgICB9XG4gIH1cbn1cblxuLy8gelJcbmNsYXNzIFVuZm9sZEFsbCBleHRlbmRzIE1pc2NDb21tYW5kIHtcbiAgZXhlY3V0ZSAoKSB7XG4gICAgdGhpcy5lZGl0b3IudW5mb2xkQWxsKClcbiAgfVxufVxuXG4vLyB6TVxuY2xhc3MgRm9sZEFsbCBleHRlbmRzIE1pc2NDb21tYW5kIHtcbiAgZXhlY3V0ZSAoKSB7XG4gICAgY29uc3Qge2FsbEZvbGR9ID0gdGhpcy51dGlscy5nZXRGb2xkSW5mb0J5S2luZCh0aGlzLmVkaXRvcilcbiAgICBpZiAoIWFsbEZvbGQpIHJldHVyblxuXG4gICAgdGhpcy5lZGl0b3IudW5mb2xkQWxsKClcbiAgICBmb3IgKGNvbnN0IHtpbmRlbnQsIHJhbmdlfSBvZiBhbGxGb2xkLmxpc3RPZlJhbmdlQW5kSW5kZW50KSB7XG4gICAgICBpZiAoaW5kZW50IDw9IHRoaXMuZ2V0Q29uZmlnKCdtYXhGb2xkYWJsZUluZGVudExldmVsJykpIHtcbiAgICAgICAgdGhpcy5lZGl0b3IuZm9sZEJ1ZmZlclJhbmdlKHJhbmdlKVxuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLmVkaXRvci5zY3JvbGxUb0N1cnNvclBvc2l0aW9uKHtjZW50ZXI6IHRydWV9KVxuICB9XG59XG5cbi8vIHpyXG5jbGFzcyBVbmZvbGROZXh0SW5kZW50TGV2ZWwgZXh0ZW5kcyBNaXNjQ29tbWFuZCB7XG4gIGV4ZWN1dGUgKCkge1xuICAgIGNvbnN0IHtmb2xkZWR9ID0gdGhpcy51dGlscy5nZXRGb2xkSW5mb0J5S2luZCh0aGlzLmVkaXRvcilcbiAgICBpZiAoIWZvbGRlZCkgcmV0dXJuXG4gICAgY29uc3Qge21pbkluZGVudCwgbGlzdE9mUmFuZ2VBbmRJbmRlbnR9ID0gZm9sZGVkXG4gICAgY29uc3QgdGFyZ2V0SW5kZW50cyA9IHRoaXMudXRpbHMuZ2V0TGlzdChtaW5JbmRlbnQsIG1pbkluZGVudCArIHRoaXMuZ2V0Q291bnQoKSAtIDEpXG4gICAgZm9yIChjb25zdCB7aW5kZW50LCByYW5nZX0gb2YgbGlzdE9mUmFuZ2VBbmRJbmRlbnQpIHtcbiAgICAgIGlmICh0YXJnZXRJbmRlbnRzLmluY2x1ZGVzKGluZGVudCkpIHtcbiAgICAgICAgdGhpcy5lZGl0b3IudW5mb2xkQnVmZmVyUm93KHJhbmdlLnN0YXJ0LnJvdylcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuLy8gem1cbmNsYXNzIEZvbGROZXh0SW5kZW50TGV2ZWwgZXh0ZW5kcyBNaXNjQ29tbWFuZCB7XG4gIGV4ZWN1dGUgKCkge1xuICAgIGNvbnN0IHt1bmZvbGRlZCwgYWxsRm9sZH0gPSB0aGlzLnV0aWxzLmdldEZvbGRJbmZvQnlLaW5kKHRoaXMuZWRpdG9yKVxuICAgIGlmICghdW5mb2xkZWQpIHJldHVyblxuICAgIC8vIEZJWE1FOiBXaHkgSSBuZWVkIHVuZm9sZEFsbCgpPyBXaHkgY2FuJ3QgSSBqdXN0IGZvbGQgbm9uLWZvbGRlZC1mb2xkIG9ubHk/XG4gICAgLy8gVW5sZXNzIHVuZm9sZEFsbCgpIGhlcmUsIEBlZGl0b3IudW5mb2xkQWxsKCkgZGVsZXRlIGZvbGRNYXJrZXIgYnV0IGZhaWxcbiAgICAvLyB0byByZW5kZXIgdW5mb2xkZWQgcm93cyBjb3JyZWN0bHkuXG4gICAgLy8gSSBiZWxpZXZlIHRoaXMgaXMgYnVnIG9mIHRleHQtYnVmZmVyJ3MgbWFya2VyTGF5ZXIgd2hpY2ggYXNzdW1lIGZvbGRzIGFyZVxuICAgIC8vIGNyZWF0ZWQgKippbi1vcmRlcioqIGZyb20gdG9wLXJvdyB0byBib3R0b20tcm93LlxuICAgIHRoaXMuZWRpdG9yLnVuZm9sZEFsbCgpXG5cbiAgICBjb25zdCBtYXhGb2xkYWJsZSA9IHRoaXMuZ2V0Q29uZmlnKCdtYXhGb2xkYWJsZUluZGVudExldmVsJylcbiAgICBsZXQgZnJvbUxldmVsID0gTWF0aC5taW4odW5mb2xkZWQubWF4SW5kZW50LCBtYXhGb2xkYWJsZSlcbiAgICBmcm9tTGV2ZWwgPSB0aGlzLmxpbWl0TnVtYmVyKGZyb21MZXZlbCAtIHRoaXMuZ2V0Q291bnQoKSAtIDEsIHttaW46IDB9KVxuICAgIGNvbnN0IHRhcmdldEluZGVudHMgPSB0aGlzLnV0aWxzLmdldExpc3QoZnJvbUxldmVsLCBtYXhGb2xkYWJsZSlcbiAgICBmb3IgKGNvbnN0IHtpbmRlbnQsIHJhbmdlfSBvZiBhbGxGb2xkLmxpc3RPZlJhbmdlQW5kSW5kZW50KSB7XG4gICAgICBpZiAodGFyZ2V0SW5kZW50cy5pbmNsdWRlcyhpbmRlbnQpKSB7XG4gICAgICAgIHRoaXMuZWRpdG9yLmZvbGRCdWZmZXJSYW5nZShyYW5nZSlcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuLy8gY3RybC1lIHNjcm9sbCBsaW5lcyBkb3dud2FyZHNcbmNsYXNzIE1pbmlTY3JvbGxEb3duIGV4dGVuZHMgTWlzY0NvbW1hbmQge1xuICBkZWZhdWx0Q291bnQgPSB0aGlzLmdldENvbmZpZygnZGVmYXVsdFNjcm9sbFJvd3NPbk1pbmlTY3JvbGwnKVxuICBkaXJlY3Rpb24gPSAnZG93bidcblxuICBrZWVwQ3Vyc29yT25TY3JlZW4gKCkge1xuICAgIGNvbnN0IGN1cnNvciA9IHRoaXMuZWRpdG9yLmdldExhc3RDdXJzb3IoKVxuICAgIGNvbnN0IHJvdyA9IGN1cnNvci5nZXRTY3JlZW5Sb3coKVxuICAgIGNvbnN0IG9mZnNldCA9IDJcbiAgICBjb25zdCB2YWxpZFJvdyA9XG4gICAgICB0aGlzLmRpcmVjdGlvbiA9PT0gJ2Rvd24nXG4gICAgICAgID8gdGhpcy5saW1pdE51bWJlcihyb3csIHttaW46IHRoaXMuZWRpdG9yLmdldEZpcnN0VmlzaWJsZVNjcmVlblJvdygpICsgb2Zmc2V0fSlcbiAgICAgICAgOiB0aGlzLmxpbWl0TnVtYmVyKHJvdywge21heDogdGhpcy5lZGl0b3IuZ2V0TGFzdFZpc2libGVTY3JlZW5Sb3coKSAtIG9mZnNldH0pXG4gICAgaWYgKHJvdyAhPT0gdmFsaWRSb3cpIHtcbiAgICAgIHRoaXMudXRpbHMuc2V0QnVmZmVyUm93KGN1cnNvciwgdGhpcy5lZGl0b3IuYnVmZmVyUm93Rm9yU2NyZWVuUm93KHZhbGlkUm93KSwge2F1dG9zY3JvbGw6IGZhbHNlfSlcbiAgICB9XG4gIH1cblxuICBleGVjdXRlICgpIHtcbiAgICB0aGlzLnZpbVN0YXRlLnJlcXVlc3RTY3JvbGwoe1xuICAgICAgYW1vdW50T2ZQaXhlbHM6ICh0aGlzLmRpcmVjdGlvbiA9PT0gJ2Rvd24nID8gMSA6IC0xKSAqIHRoaXMuZ2V0Q291bnQoKSAqIHRoaXMuZWRpdG9yLmdldExpbmVIZWlnaHRJblBpeGVscygpLFxuICAgICAgZHVyYXRpb246IHRoaXMuZ2V0U21vb3RoU2Nyb2xsRHVhdGlvbignTWluaVNjcm9sbCcpLFxuICAgICAgb25GaW5pc2g6ICgpID0+IHRoaXMua2VlcEN1cnNvck9uU2NyZWVuKClcbiAgICB9KVxuICB9XG59XG5cbi8vIGN0cmwteSBzY3JvbGwgbGluZXMgdXB3YXJkc1xuY2xhc3MgTWluaVNjcm9sbFVwIGV4dGVuZHMgTWluaVNjcm9sbERvd24ge1xuICBkaXJlY3Rpb24gPSAndXAnXG59XG5cbi8vIFJlZHJhd0N1cnNvckxpbmVBdHtYWFh9IGluIHZpZXdwb3J0LlxuLy8gKy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rXG4vLyB8IHdoZXJlICAgICAgICB8IG5vIG1vdmUgfCBtb3ZlIHRvIDFzdCBjaGFyIHxcbi8vIHwtLS0tLS0tLS0tLS0tLSstLS0tLS0tLS0rLS0tLS0tLS0tLS0tLS0tLS0tfFxuLy8gfCB0b3AgICAgICAgICAgfCB6IHQgICAgIHwgeiBlbnRlciAgICAgICAgICB8XG4vLyB8IHVwcGVyLW1pZGRsZSB8IHogdSAgICAgfCB6IHNwYWNlICAgICAgICAgIHxcbi8vIHwgbWlkZGxlICAgICAgIHwgeiB6ICAgICB8IHogLiAgICAgICAgICAgICAgfFxuLy8gfCBib3R0b20gICAgICAgfCB6IGIgICAgIHwgeiAtICAgICAgICAgICAgICB8XG4vLyArLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLStcbmNsYXNzIFJlZHJhd0N1cnNvckxpbmUgZXh0ZW5kcyBNaXNjQ29tbWFuZCB7XG4gIHN0YXRpYyBjb21tYW5kID0gZmFsc2VcbiAgc3RhdGljIGNvZWZmaWNpZW50QnlOYW1lID0ge1xuICAgIFJlZHJhd0N1cnNvckxpbmVBdFRvcDogMCxcbiAgICBSZWRyYXdDdXJzb3JMaW5lQXRVcHBlck1pZGRsZTogMC4yNSxcbiAgICBSZWRyYXdDdXJzb3JMaW5lQXRNaWRkbGU6IDAuNSxcbiAgICBSZWRyYXdDdXJzb3JMaW5lQXRCb3R0b206IDFcbiAgfVxuXG4gIGluaXRpYWxpemUgKCkge1xuICAgIGNvbnN0IGJhc2VOYW1lID0gdGhpcy5uYW1lLnJlcGxhY2UoL0FuZE1vdmVUb0ZpcnN0Q2hhcmFjdGVyT2ZMaW5lJC8sICcnKVxuICAgIHRoaXMuY29lZmZpY2llbnQgPSB0aGlzLmNvbnN0cnVjdG9yLmNvZWZmaWNpZW50QnlOYW1lW2Jhc2VOYW1lXVxuICAgIHRoaXMubW92ZVRvRmlyc3RDaGFyYWN0ZXJPZkxpbmUgPSB0aGlzLm5hbWUuZW5kc1dpdGgoJ0FuZE1vdmVUb0ZpcnN0Q2hhcmFjdGVyT2ZMaW5lJylcbiAgICBzdXBlci5pbml0aWFsaXplKClcbiAgfVxuXG4gIGV4ZWN1dGUgKCkge1xuICAgIGNvbnN0IHNjcm9sbFRvcCA9IE1hdGgucm91bmQodGhpcy5nZXRTY3JvbGxUb3AoKSlcbiAgICB0aGlzLnZpbVN0YXRlLnJlcXVlc3RTY3JvbGwoe1xuICAgICAgc2Nyb2xsVG9wOiBzY3JvbGxUb3AsXG4gICAgICBkdXJhdGlvbjogdGhpcy5nZXRTbW9vdGhTY3JvbGxEdWF0aW9uKCdSZWRyYXdDdXJzb3JMaW5lJyksXG4gICAgICBvbkZpbmlzaDogKCkgPT4ge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgdGhpcy5nZXRDb25maWcoJ2Fza09wdEluVG9FZGl0b3JTY3JvbGxQYXN0RW5kJykgJiZcbiAgICAgICAgICB0aGlzLmVkaXRvckVsZW1lbnQuZ2V0U2Nyb2xsVG9wKCkgIT09IHNjcm9sbFRvcCAmJlxuICAgICAgICAgICF0aGlzLmVkaXRvci5nZXRTY3JvbGxQYXN0RW5kKClcbiAgICAgICAgKSB7XG4gICAgICAgICAgdGhpcy5yZWNvbW1lbmRUb0VuYWJsZVNjcm9sbFBhc3RFbmQoKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcbiAgICBpZiAodGhpcy5tb3ZlVG9GaXJzdENoYXJhY3Rlck9mTGluZSkgdGhpcy5lZGl0b3IubW92ZVRvRmlyc3RDaGFyYWN0ZXJPZkxpbmUoKVxuICB9XG5cbiAgZ2V0U2Nyb2xsVG9wICgpIHtcbiAgICBjb25zdCB7dG9wfSA9IHRoaXMuZWRpdG9yRWxlbWVudC5waXhlbFBvc2l0aW9uRm9yU2NyZWVuUG9zaXRpb24odGhpcy5lZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSlcbiAgICBjb25zdCBlZGl0b3JIZWlnaHQgPSB0aGlzLmVkaXRvckVsZW1lbnQuZ2V0SGVpZ2h0KClcbiAgICBjb25zdCBsaW5lSGVpZ2h0SW5QaXhlbCA9IHRoaXMuZWRpdG9yLmdldExpbmVIZWlnaHRJblBpeGVscygpXG5cbiAgICByZXR1cm4gdGhpcy5saW1pdE51bWJlcih0b3AgLSBlZGl0b3JIZWlnaHQgKiB0aGlzLmNvZWZmaWNpZW50LCB7XG4gICAgICBtaW46IHRvcCAtIGVkaXRvckhlaWdodCArIGxpbmVIZWlnaHRJblBpeGVsICogMyxcbiAgICAgIG1heDogdG9wIC0gbGluZUhlaWdodEluUGl4ZWwgKiAyXG4gICAgfSlcbiAgfVxuXG4gIHJlY29tbWVuZFRvRW5hYmxlU2Nyb2xsUGFzdEVuZCAoKSB7XG4gICAgY29uc3QgbWVzc2FnZSA9IFtcbiAgICAgICd2aW0tbW9kZS1wbHVzJyxcbiAgICAgICctIEZhaWxlZCB0byBzY3JvbGwuIFRvIHN1Y2Nlc3NmdWxseSBzY3JvbGwsIGBlZGl0b3Iuc2Nyb2xsUGFzdEVuZGAgbmVlZCB0byBiZSBlbmFibGVkLicsXG4gICAgICAnLSBZb3UgY2FuIGRvIGl0IGZyb20gYFwiU2V0dGluZ3NcIiA+IFwiRWRpdG9yXCIgPiBcIlNjcm9sbCBQYXN0IEVuZFwiYC4nLFxuICAgICAgJy0gT3IgKipkbyB5b3UgYWxsb3cgdm1wIGVuYWJsZSBpdCBmb3IgeW91IG5vdz8qKidcbiAgICBdLmpvaW4oJ1xcbicpXG5cbiAgICBjb25zdCBub3RpZmljYXRpb24gPSBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkSW5mbyhtZXNzYWdlLCB7XG4gICAgICBkaXNtaXNzYWJsZTogdHJ1ZSxcbiAgICAgIGJ1dHRvbnM6IFtcbiAgICAgICAge1xuICAgICAgICAgIHRleHQ6ICdObyB0aGFua3MuJyxcbiAgICAgICAgICBvbkRpZENsaWNrOiAoKSA9PiBub3RpZmljYXRpb24uZGlzbWlzcygpXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICB0ZXh0OiAnTmV2ZXIgYXNrIGFnYWluLicsXG4gICAgICAgICAgb25EaWRDbGljazogKCkgPT4ge1xuICAgICAgICAgICAgYXRvbS5jb25maWcuc2V0KGB2aW0tbW9kZS1wbHVzLmFza09wdEluVG9FZGl0b3JTY3JvbGxQYXN0RW5kYCwgZmFsc2UpXG4gICAgICAgICAgICBub3RpZmljYXRpb24uZGlzbWlzcygpXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgdGV4dDogJ09LLiBFbmFibGUgaXQgbm93ISEnLFxuICAgICAgICAgIG9uRGlkQ2xpY2s6ICgpID0+IHtcbiAgICAgICAgICAgIGF0b20uY29uZmlnLnNldChgZWRpdG9yLnNjcm9sbFBhc3RFbmRgLCB0cnVlKVxuICAgICAgICAgICAgbm90aWZpY2F0aW9uLmRpc21pc3MoKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgXVxuICAgIH0pXG4gIH1cbn1cblxuY2xhc3MgUmVkcmF3Q3Vyc29yTGluZUF0VG9wIGV4dGVuZHMgUmVkcmF3Q3Vyc29yTGluZSB7fSAvLyB6dFxuY2xhc3MgUmVkcmF3Q3Vyc29yTGluZUF0VG9wQW5kTW92ZVRvRmlyc3RDaGFyYWN0ZXJPZkxpbmUgZXh0ZW5kcyBSZWRyYXdDdXJzb3JMaW5lIHt9IC8vIHogZW50ZXJcbmNsYXNzIFJlZHJhd0N1cnNvckxpbmVBdFVwcGVyTWlkZGxlIGV4dGVuZHMgUmVkcmF3Q3Vyc29yTGluZSB7fSAvLyB6dVxuY2xhc3MgUmVkcmF3Q3Vyc29yTGluZUF0VXBwZXJNaWRkbGVBbmRNb3ZlVG9GaXJzdENoYXJhY3Rlck9mTGluZSBleHRlbmRzIFJlZHJhd0N1cnNvckxpbmUge30gLy8geiBzcGFjZVxuY2xhc3MgUmVkcmF3Q3Vyc29yTGluZUF0TWlkZGxlIGV4dGVuZHMgUmVkcmF3Q3Vyc29yTGluZSB7fSAvLyB6IHpcbmNsYXNzIFJlZHJhd0N1cnNvckxpbmVBdE1pZGRsZUFuZE1vdmVUb0ZpcnN0Q2hhcmFjdGVyT2ZMaW5lIGV4dGVuZHMgUmVkcmF3Q3Vyc29yTGluZSB7fSAvLyB6IC5cbmNsYXNzIFJlZHJhd0N1cnNvckxpbmVBdEJvdHRvbSBleHRlbmRzIFJlZHJhd0N1cnNvckxpbmUge30gLy8geiBiXG5jbGFzcyBSZWRyYXdDdXJzb3JMaW5lQXRCb3R0b21BbmRNb3ZlVG9GaXJzdENoYXJhY3Rlck9mTGluZSBleHRlbmRzIFJlZHJhd0N1cnNvckxpbmUge30gLy8geiAtXG5cbi8vIEhvcml6b250YWwgU2Nyb2xsIHdpdGhvdXQgY2hhbmdpbmcgY3Vyc29yIHBvc2l0aW9uXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyB6c1xuY2xhc3MgU2Nyb2xsQ3Vyc29yVG9MZWZ0IGV4dGVuZHMgTWlzY0NvbW1hbmQge1xuICB3aGljaCA9ICdsZWZ0J1xuICBleGVjdXRlICgpIHtcbiAgICBjb25zdCB0cmFuc2xhdGlvbiA9IHRoaXMud2hpY2ggPT09ICdsZWZ0JyA/IFswLCAwXSA6IFswLCAxXVxuICAgIGNvbnN0IHNjcmVlblBvc2l0aW9uID0gdGhpcy5lZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKS50cmFuc2xhdGUodHJhbnNsYXRpb24pXG4gICAgY29uc3QgcGl4ZWwgPSB0aGlzLmVkaXRvckVsZW1lbnQucGl4ZWxQb3NpdGlvbkZvclNjcmVlblBvc2l0aW9uKHNjcmVlblBvc2l0aW9uKVxuICAgIGlmICh0aGlzLndoaWNoID09PSAnbGVmdCcpIHtcbiAgICAgIHRoaXMuZWRpdG9yRWxlbWVudC5zZXRTY3JvbGxMZWZ0KHBpeGVsLmxlZnQpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZWRpdG9yRWxlbWVudC5zZXRTY3JvbGxSaWdodChwaXhlbC5sZWZ0KVxuICAgICAgdGhpcy5lZGl0b3IuY29tcG9uZW50LnVwZGF0ZVN5bmMoKSAvLyBGSVhNRTogVGhpcyBpcyBuZWNlc3NhcnkgbWF5YmUgYmVjYXVzZSBvZiBidWcgb2YgYXRvbS1jb3JlLlxuICAgIH1cbiAgfVxufVxuXG4vLyB6ZVxuY2xhc3MgU2Nyb2xsQ3Vyc29yVG9SaWdodCBleHRlbmRzIFNjcm9sbEN1cnNvclRvTGVmdCB7XG4gIHdoaWNoID0gJ3JpZ2h0J1xufVxuXG4vLyBpbnNlcnQtbW9kZSBzcGVjaWZpYyBjb21tYW5kc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuY2xhc3MgSW5zZXJ0TW9kZSBleHRlbmRzIE1pc2NDb21tYW5kIHt9IC8vIGp1c3QgbmFtZXNwYWNlXG5cbmNsYXNzIEFjdGl2YXRlTm9ybWFsTW9kZU9uY2UgZXh0ZW5kcyBJbnNlcnRNb2RlIHtcbiAgZXhlY3V0ZSAoKSB7XG4gICAgY29uc3QgY3Vyc29yc1RvTW92ZVJpZ2h0ID0gdGhpcy5lZGl0b3IuZ2V0Q3Vyc29ycygpLmZpbHRlcihjdXJzb3IgPT4gIWN1cnNvci5pc0F0QmVnaW5uaW5nT2ZMaW5lKCkpXG4gICAgdGhpcy52aW1TdGF0ZS5hY3RpdmF0ZSgnbm9ybWFsJylcbiAgICBmb3IgKGNvbnN0IGN1cnNvciBvZiBjdXJzb3JzVG9Nb3ZlUmlnaHQpIHtcbiAgICAgIHRoaXMudXRpbHMubW92ZUN1cnNvclJpZ2h0KGN1cnNvcilcbiAgICB9XG5cbiAgICBjb25zdCBkaXNwb3NhYmxlID0gYXRvbS5jb21tYW5kcy5vbkRpZERpc3BhdGNoKGV2ZW50ID0+IHtcbiAgICAgIGlmIChldmVudC50eXBlICE9PSB0aGlzLmdldENvbW1hbmROYW1lKCkpIHtcbiAgICAgICAgZGlzcG9zYWJsZS5kaXNwb3NlKClcbiAgICAgICAgdGhpcy52aW1TdGF0ZS5hY3RpdmF0ZSgnaW5zZXJ0JylcbiAgICAgIH1cbiAgICB9KVxuICB9XG59XG5cbmNsYXNzIFRvZ2dsZVJlcGxhY2VNb2RlIGV4dGVuZHMgTWlzY0NvbW1hbmQge1xuICBleGVjdXRlICgpIHtcbiAgICBpZiAodGhpcy5tb2RlID09PSAnaW5zZXJ0Jykge1xuICAgICAgaWYgKHRoaXMuc3VibW9kZSA9PT0gJ3JlcGxhY2UnKSB7XG4gICAgICAgIHRoaXMudmltU3RhdGUub3BlcmF0aW9uU3RhY2sucnVuTmV4dCgnQWN0aXZhdGVJbnNlcnRNb2RlJylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMudmltU3RhdGUub3BlcmF0aW9uU3RhY2sucnVuTmV4dCgnQWN0aXZhdGVSZXBsYWNlTW9kZScpXG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmNsYXNzIEluc2VydFJlZ2lzdGVyIGV4dGVuZHMgSW5zZXJ0TW9kZSB7XG4gIGFzeW5jIGV4ZWN1dGUgKCkge1xuICAgIGNvbnN0IGlucHV0ID0gYXdhaXQgdGhpcy5yZWFkQ2hhclByb21pc2VkKClcbiAgICBpZiAoaW5wdXQpIHtcbiAgICAgIHRoaXMuZWRpdG9yLnRyYW5zYWN0KCgpID0+IHtcbiAgICAgICAgZm9yIChjb25zdCBzZWxlY3Rpb24gb2YgdGhpcy5lZGl0b3IuZ2V0U2VsZWN0aW9ucygpKSB7XG4gICAgICAgICAgc2VsZWN0aW9uLmluc2VydFRleHQodGhpcy52aW1TdGF0ZS5yZWdpc3Rlci5nZXRUZXh0KGlucHV0LCBzZWxlY3Rpb24pKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgfVxufVxuXG5jbGFzcyBJbnNlcnRMYXN0SW5zZXJ0ZWQgZXh0ZW5kcyBJbnNlcnRNb2RlIHtcbiAgZXhlY3V0ZSAoKSB7XG4gICAgdGhpcy5lZGl0b3IuaW5zZXJ0VGV4dCh0aGlzLnZpbVN0YXRlLnJlZ2lzdGVyLmdldFRleHQoJy4nKSlcbiAgfVxufVxuXG5jbGFzcyBDb3B5RnJvbUxpbmVBYm92ZSBleHRlbmRzIEluc2VydE1vZGUge1xuICByb3dEZWx0YSA9IC0xXG5cbiAgZXhlY3V0ZSAoKSB7XG4gICAgY29uc3QgdHJhbnNsYXRpb24gPSBbdGhpcy5yb3dEZWx0YSwgMF1cbiAgICB0aGlzLmVkaXRvci50cmFuc2FjdCgoKSA9PiB7XG4gICAgICBmb3IgKGNvbnN0IHNlbGVjdGlvbiBvZiB0aGlzLmVkaXRvci5nZXRTZWxlY3Rpb25zKCkpIHtcbiAgICAgICAgY29uc3QgcG9pbnQgPSBzZWxlY3Rpb24uY3Vyc29yLmdldEJ1ZmZlclBvc2l0aW9uKCkudHJhbnNsYXRlKHRyYW5zbGF0aW9uKVxuICAgICAgICBpZiAocG9pbnQucm93ID49IDApIHtcbiAgICAgICAgICBjb25zdCByYW5nZSA9IFJhbmdlLmZyb21Qb2ludFdpdGhEZWx0YShwb2ludCwgMCwgMSlcbiAgICAgICAgICBjb25zdCB0ZXh0ID0gdGhpcy5lZGl0b3IuZ2V0VGV4dEluQnVmZmVyUmFuZ2UocmFuZ2UpXG4gICAgICAgICAgaWYgKHRleHQpIHNlbGVjdGlvbi5pbnNlcnRUZXh0KHRleHQpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxuICB9XG59XG5cbmNsYXNzIENvcHlGcm9tTGluZUJlbG93IGV4dGVuZHMgQ29weUZyb21MaW5lQWJvdmUge1xuICByb3dEZWx0YSA9ICsxXG59XG5cbmNsYXNzIE5leHRUYWIgZXh0ZW5kcyBNaXNjQ29tbWFuZCB7XG4gIGV4ZWN1dGUgKCkge1xuICAgIGNvbnN0IHBhbmUgPSBhdG9tLndvcmtzcGFjZS5wYW5lRm9ySXRlbSh0aGlzLmVkaXRvcilcblxuICAgIGlmICh0aGlzLmhhc0NvdW50KCkpIHtcbiAgICAgIHBhbmUuYWN0aXZhdGVJdGVtQXRJbmRleCh0aGlzLmdldENvdW50KCkgLSAxKVxuICAgIH0gZWxzZSB7XG4gICAgICBwYW5lLmFjdGl2YXRlTmV4dEl0ZW0oKVxuICAgIH1cbiAgfVxufVxuXG5jbGFzcyBQcmV2aW91c1RhYiBleHRlbmRzIE1pc2NDb21tYW5kIHtcbiAgZXhlY3V0ZSAoKSB7XG4gICAgYXRvbS53b3Jrc3BhY2UucGFuZUZvckl0ZW0odGhpcy5lZGl0b3IpLmFjdGl2YXRlUHJldmlvdXNJdGVtKClcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgTWlzY0NvbW1hbmQsXG4gIE1hcmssXG4gIFJldmVyc2VTZWxlY3Rpb25zLFxuICBCbG9ja3dpc2VPdGhlckVuZCxcbiAgVW5kbyxcbiAgUmVkbyxcbiAgRm9sZEN1cnJlbnRSb3csXG4gIFVuZm9sZEN1cnJlbnRSb3csXG4gIFRvZ2dsZUZvbGQsXG4gIEZvbGRDdXJyZW50Um93UmVjdXJzaXZlbHlCYXNlLFxuICBGb2xkQ3VycmVudFJvd1JlY3Vyc2l2ZWx5LFxuICBVbmZvbGRDdXJyZW50Um93UmVjdXJzaXZlbHksXG4gIFRvZ2dsZUZvbGRSZWN1cnNpdmVseSxcbiAgVW5mb2xkQWxsLFxuICBGb2xkQWxsLFxuICBVbmZvbGROZXh0SW5kZW50TGV2ZWwsXG4gIEZvbGROZXh0SW5kZW50TGV2ZWwsXG4gIE1pbmlTY3JvbGxEb3duLFxuICBNaW5pU2Nyb2xsVXAsXG4gIFJlZHJhd0N1cnNvckxpbmUsXG4gIFJlZHJhd0N1cnNvckxpbmVBdFRvcCxcbiAgUmVkcmF3Q3Vyc29yTGluZUF0VG9wQW5kTW92ZVRvRmlyc3RDaGFyYWN0ZXJPZkxpbmUsXG4gIFJlZHJhd0N1cnNvckxpbmVBdFVwcGVyTWlkZGxlLFxuICBSZWRyYXdDdXJzb3JMaW5lQXRVcHBlck1pZGRsZUFuZE1vdmVUb0ZpcnN0Q2hhcmFjdGVyT2ZMaW5lLFxuICBSZWRyYXdDdXJzb3JMaW5lQXRNaWRkbGUsXG4gIFJlZHJhd0N1cnNvckxpbmVBdE1pZGRsZUFuZE1vdmVUb0ZpcnN0Q2hhcmFjdGVyT2ZMaW5lLFxuICBSZWRyYXdDdXJzb3JMaW5lQXRCb3R0b20sXG4gIFJlZHJhd0N1cnNvckxpbmVBdEJvdHRvbUFuZE1vdmVUb0ZpcnN0Q2hhcmFjdGVyT2ZMaW5lLFxuICBTY3JvbGxDdXJzb3JUb0xlZnQsXG4gIFNjcm9sbEN1cnNvclRvUmlnaHQsXG4gIEFjdGl2YXRlTm9ybWFsTW9kZU9uY2UsXG4gIFRvZ2dsZVJlcGxhY2VNb2RlLFxuICBJbnNlcnRSZWdpc3RlcixcbiAgSW5zZXJ0TGFzdEluc2VydGVkLFxuICBDb3B5RnJvbUxpbmVBYm92ZSxcbiAgQ29weUZyb21MaW5lQmVsb3csXG4gIE5leHRUYWIsXG4gIFByZXZpb3VzVGFiXG59XG4iXX0=