(function() {
  var OS, child, execFile, ref;

  ref = require('child_process'), execFile = ref.execFile, child = ref.child;

  OS = require('os');

  module.exports = {
    config: {
      executablePath: {
        type: "string",
        "default": ""
      }
    },
    activate: function(state) {
      var vimPath, vimType, whichType;
      vimPath = atom.config.get("open-vim.executablePath");
      if (!!vimPath) {
        this.commands = atom.commands.add("atom-workspace", {
          "open-vim:open": (function(_this) {
            return function() {
              return _this.open(vimPath);
            };
          })(this)
        });
        this.open(vimPath);
        return;
      }
      vimType = OS.platform() === "darwin" ? "mvim" : "gvim";
      whichType = OS.platform() === "win32" ? "where" : "which";
      return execFile(whichType, [vimType], (function(_this) {
        return function(error, stdout, stderr) {
          if (error) {
            return alert(vimType + " not found, make sure you started atom from the terminal and that " + vimType + " is on the PATH");
          } else {
            _this.commands = atom.commands.add("atom-workspace", {
              "open-vim:open": function() {
                return _this.open(vimType);
              }
            });
            return _this.open(vimType);
          }
        };
      })(this));
    },
    open: function(vimType) {
      var colNum, editor, filePath, lineNum;
      editor = atom.workspace.getActiveTextEditor();
      if (editor) {
        filePath = editor.getPath();
        lineNum = editor.bufferPositionForScreenPosition(editor.getCursorScreenPosition()).row + 1;
        colNum = editor.bufferPositionForScreenPosition(editor.getCursorScreenPosition()).column + 1;
        return execFile(vimType, ["--remote-silent", "+call cursor(" + lineNum + ", " + colNum + ")", filePath], function(error, stdout, stderr) {
          if (error) {
            return atom.notifications.addError(error.message);
          }
        });
      }
    },
    deactivate: function() {
      if (this.commands) {
        return this.commands.dispose();
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2dpdC8uYXRvbS9wYWNrYWdlcy9vcGVuLXZpbS9saWIvb3Blbi12aW0uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxNQUFvQixPQUFBLENBQVEsZUFBUixDQUFwQixFQUFDLHVCQUFELEVBQVc7O0VBQ1gsRUFBQSxHQUFvQixPQUFBLENBQVEsSUFBUjs7RUFFcEIsTUFBTSxDQUFDLE9BQVAsR0FFRTtJQUFBLE1BQUEsRUFDRTtNQUFBLGNBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxRQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxFQURUO09BREY7S0FERjtJQUtBLFFBQUEsRUFBVSxTQUFDLEtBQUQ7QUFDUixVQUFBO01BQUEsT0FBQSxHQUFVLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix5QkFBaEI7TUFDVixJQUFHLENBQUMsQ0FBQyxPQUFMO1FBQ0UsSUFBQyxDQUFBLFFBQUQsR0FBWSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQ1Y7VUFBQSxlQUFBLEVBQWlCLENBQUEsU0FBQSxLQUFBO21CQUFBLFNBQUE7cUJBQUcsS0FBQyxDQUFBLElBQUQsQ0FBTSxPQUFOO1lBQUg7VUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWpCO1NBRFU7UUFFWixJQUFDLENBQUEsSUFBRCxDQUFNLE9BQU47QUFDQSxlQUpGOztNQU1BLE9BQUEsR0FBYSxFQUFFLENBQUMsUUFBSCxDQUFBLENBQUEsS0FBaUIsUUFBcEIsR0FBa0MsTUFBbEMsR0FBOEM7TUFDeEQsU0FBQSxHQUFlLEVBQUUsQ0FBQyxRQUFILENBQUEsQ0FBQSxLQUFpQixPQUFwQixHQUFpQyxPQUFqQyxHQUE4QzthQUMxRCxRQUFBLENBQVMsU0FBVCxFQUFvQixDQUFDLE9BQUQsQ0FBcEIsRUFBK0IsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLEtBQUQsRUFBUSxNQUFSLEVBQWdCLE1BQWhCO1VBQzdCLElBQUcsS0FBSDttQkFDRSxLQUFBLENBQVMsT0FBRCxHQUFTLG9FQUFULEdBQTZFLE9BQTdFLEdBQXFGLGlCQUE3RixFQURGO1dBQUEsTUFBQTtZQUdFLEtBQUMsQ0FBQSxRQUFELEdBQVksSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUNWO2NBQUEsZUFBQSxFQUFpQixTQUFBO3VCQUFHLEtBQUMsQ0FBQSxJQUFELENBQU0sT0FBTjtjQUFILENBQWpCO2FBRFU7bUJBRVosS0FBQyxDQUFBLElBQUQsQ0FBTSxPQUFOLEVBTEY7O1FBRDZCO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUEvQjtJQVZRLENBTFY7SUF1QkEsSUFBQSxFQUFNLFNBQUMsT0FBRDtBQUNKLFVBQUE7TUFBQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBO01BQ1QsSUFBRyxNQUFIO1FBQ0UsUUFBQSxHQUFXLE1BQU0sQ0FBQyxPQUFQLENBQUE7UUFDWCxPQUFBLEdBQVcsTUFBTSxDQUFDLCtCQUFQLENBQXVDLE1BQU0sQ0FBQyx1QkFBUCxDQUFBLENBQXZDLENBQXdFLENBQUMsR0FBekUsR0FBK0U7UUFDMUYsTUFBQSxHQUFXLE1BQU0sQ0FBQywrQkFBUCxDQUF1QyxNQUFNLENBQUMsdUJBQVAsQ0FBQSxDQUF2QyxDQUF3RSxDQUFDLE1BQXpFLEdBQWtGO2VBQzdGLFFBQUEsQ0FBUyxPQUFULEVBQWtCLENBQUMsaUJBQUQsRUFBb0IsZUFBQSxHQUFnQixPQUFoQixHQUF3QixJQUF4QixHQUE0QixNQUE1QixHQUFtQyxHQUF2RCxFQUEyRCxRQUEzRCxDQUFsQixFQUF3RixTQUFDLEtBQUQsRUFBUSxNQUFSLEVBQWdCLE1BQWhCO1VBQ3RGLElBQUcsS0FBSDttQkFDRSxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQW5CLENBQTRCLEtBQUssQ0FBQyxPQUFsQyxFQURGOztRQURzRixDQUF4RixFQUpGOztJQUZJLENBdkJOO0lBaUNBLFVBQUEsRUFBWSxTQUFBO01BQ1YsSUFBdUIsSUFBQyxDQUFBLFFBQXhCO2VBQUEsSUFBQyxDQUFBLFFBQVEsQ0FBQyxPQUFWLENBQUEsRUFBQTs7SUFEVSxDQWpDWjs7QUFMRiIsInNvdXJjZXNDb250ZW50IjpbIntleGVjRmlsZSwgY2hpbGR9ID0gcmVxdWlyZSAnY2hpbGRfcHJvY2Vzcydcbk9TICAgICAgICAgICAgICAgID0gcmVxdWlyZSAnb3MnXG5cbm1vZHVsZS5leHBvcnRzID1cblxuICBjb25maWc6XG4gICAgZXhlY3V0YWJsZVBhdGg6XG4gICAgICB0eXBlOiBcInN0cmluZ1wiXG4gICAgICBkZWZhdWx0OiBcIlwiXG5cbiAgYWN0aXZhdGU6IChzdGF0ZSkgLT5cbiAgICB2aW1QYXRoID0gYXRvbS5jb25maWcuZ2V0IFwib3Blbi12aW0uZXhlY3V0YWJsZVBhdGhcIlxuICAgIGlmICEhdmltUGF0aFxuICAgICAgQGNvbW1hbmRzID0gYXRvbS5jb21tYW5kcy5hZGQgXCJhdG9tLXdvcmtzcGFjZVwiLFxuICAgICAgICBcIm9wZW4tdmltOm9wZW5cIjogPT4gQG9wZW4odmltUGF0aClcbiAgICAgIEBvcGVuKHZpbVBhdGgpICMgY2FsbCBleHBsaWNpdGx5IHVwb24gYWN0aXZhdGUsIHNpbmNlIHBhY2thZ2UgaXMgbGF6eSBsb2FkZWQgYW5kIHRoaXMgc2V0dXAgaXMgYXN5bmNcbiAgICAgIHJldHVyblxuXG4gICAgdmltVHlwZSA9IGlmIE9TLnBsYXRmb3JtKCkgaXMgXCJkYXJ3aW5cIiB0aGVuIFwibXZpbVwiIGVsc2UgXCJndmltXCJcbiAgICB3aGljaFR5cGUgPSBpZiBPUy5wbGF0Zm9ybSgpIGlzIFwid2luMzJcIiB0aGVuIFwid2hlcmVcIiBlbHNlIFwid2hpY2hcIlxuICAgIGV4ZWNGaWxlIHdoaWNoVHlwZSwgW3ZpbVR5cGVdLCAoZXJyb3IsIHN0ZG91dCwgc3RkZXJyKSA9PlxuICAgICAgaWYgZXJyb3JcbiAgICAgICAgYWxlcnQgXCIje3ZpbVR5cGV9IG5vdCBmb3VuZCwgbWFrZSBzdXJlIHlvdSBzdGFydGVkIGF0b20gZnJvbSB0aGUgdGVybWluYWwgYW5kIHRoYXQgI3t2aW1UeXBlfSBpcyBvbiB0aGUgUEFUSFwiXG4gICAgICBlbHNlXG4gICAgICAgIEBjb21tYW5kcyA9IGF0b20uY29tbWFuZHMuYWRkIFwiYXRvbS13b3Jrc3BhY2VcIixcbiAgICAgICAgICBcIm9wZW4tdmltOm9wZW5cIjogPT4gQG9wZW4odmltVHlwZSlcbiAgICAgICAgQG9wZW4odmltVHlwZSkgIyBjYWxsIGV4cGxpY2l0bHkgdXBvbiBhY3RpdmF0ZSwgc2luY2UgcGFja2FnZSBpcyBsYXp5IGxvYWRlZCBhbmQgdGhpcyBzZXR1cCBpcyBhc3luY1xuXG4gIG9wZW46ICh2aW1UeXBlKSAtPlxuICAgIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgIGlmIGVkaXRvclxuICAgICAgZmlsZVBhdGggPSBlZGl0b3IuZ2V0UGF0aCgpXG4gICAgICBsaW5lTnVtICA9IGVkaXRvci5idWZmZXJQb3NpdGlvbkZvclNjcmVlblBvc2l0aW9uKGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS5yb3cgKyAxICMgKzEgdG8gZ2V0IGFjdHVhbCBsaW5lXG4gICAgICBjb2xOdW0gICA9IGVkaXRvci5idWZmZXJQb3NpdGlvbkZvclNjcmVlblBvc2l0aW9uKGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpKS5jb2x1bW4gKyAxXG4gICAgICBleGVjRmlsZSB2aW1UeXBlLCBbXCItLXJlbW90ZS1zaWxlbnRcIiwgXCIrY2FsbCBjdXJzb3IoI3tsaW5lTnVtfSwgI3tjb2xOdW19KVwiLCBmaWxlUGF0aF0sIChlcnJvciwgc3Rkb3V0LCBzdGRlcnIpIC0+XG4gICAgICAgIGlmIGVycm9yXG4gICAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yIGVycm9yLm1lc3NhZ2VcblxuICBkZWFjdGl2YXRlOiAtPlxuICAgIEBjb21tYW5kcy5kaXNwb3NlKCkgaWYgQGNvbW1hbmRzXG4iXX0=
