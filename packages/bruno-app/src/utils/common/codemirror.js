import get from 'lodash/get';

let CodeMirror;
const SERVER_RENDERED = typeof navigator === 'undefined' || global['PREVENT_CODEMIRROR_RENDER'] === true;

if (!SERVER_RENDERED) {
  CodeMirror = require('codemirror');
}

const pathFoundInVariables = (path, obj) => {
  const value = get(obj, path);
  return value !== undefined;
};

/**
 * Changes the render behaviour for a given CodeMirror editor.
 * Replaces all **rendered** characters, not the actual value, with the provided character.
 */
export class MaskedEditor {
  /**
   * @param {import('codemirror').Editor} editor CodeMirror editor instance
   * @param {string} maskChar Target character being applied to all content
   */
  constructor(editor, maskChar) {
    this.editor = editor;
    this.maskChar = maskChar;
    this.enabled = false;
  }

  /**
   * Set and apply new masking character
   */
  enable = () => {
    this.enabled = true;
    this.editor.setValue(this.editor.getValue());
    this.editor.on('inputRead', this.maskContent);
    this.update();
  };

  /** Disables masking of the editor field. */
  disable = () => {
    this.enabled = false;
    this.editor.off('inputRead', this.maskContent);
    this.editor.setValue(this.editor.getValue());
  };

  /** Updates the rendered content if enabled. */
  update = () => {
    if (this.enabled) this.maskContent();
  };

  /** Replaces all rendered characters, with the provided character. */
  maskContent = () => {
    const content = this.editor.getValue();
    this.editor.operation(() => {
      // Clear previous masked text
      this.editor.getAllMarks().forEach((mark) => mark.clear());
      // Apply new masked text
      for (let i = 0; i < content.length; i++) {
        if (content[i] !== '\n') {
          const maskedNode = document.createTextNode(this.maskChar);
          this.editor.markText(
            { line: this.editor.posFromIndex(i).line, ch: this.editor.posFromIndex(i).ch },
            { line: this.editor.posFromIndex(i + 1).line, ch: this.editor.posFromIndex(i + 1).ch },
            { replacedWith: maskedNode, handleMouseEvents: true }
          );
        }
      }
    });
  };
}

export const defineCodeMirrorBrunoVariablesMode = (variables, mode) => {
  CodeMirror.defineMode('brunovariables', function (config, parserConfig) {
    let variablesOverlay = {
      token: function (stream, state) {
        if (stream.match('{{', true)) {
          let ch;
          let word = '';
          while ((ch = stream.next()) != null) {
            if (ch == '}' && stream.next() == '}') {
              stream.eat('}');
              let found = pathFoundInVariables(word, variables);
              if (found) {
                return 'variable-valid random-' + (Math.random() + 1).toString(36).substring(9);
              } else {
                return 'variable-invalid random-' + (Math.random() + 1).toString(36).substring(9);
              }
              // Random classname added so adjacent variables are not rendered in the same SPAN by CodeMirror.
            }
            word += ch;
          }
        }
        while (stream.next() != null && !stream.match('{{', false)) {}
        return null;
      }
    };

    return CodeMirror.overlayMode(CodeMirror.getMode(config, parserConfig.backdrop || mode), variablesOverlay);
  });
};

export const getCodeMirrorModeBasedOnContentType = (contentType, body) => {
  if (typeof body === 'object') {
    return 'application/ld+json';
  }
  if (!contentType || typeof contentType !== 'string') {
    return 'application/text';
  }

  if (contentType.includes('json')) {
    return 'application/ld+json';
  } else if (contentType.includes('xml')) {
    return 'application/xml';
  } else if (contentType.includes('html')) {
    return 'application/html';
  } else if (contentType.includes('text')) {
    return 'application/text';
  } else if (contentType.includes('application/edn')) {
    return 'application/xml';
  } else if (contentType.includes('yaml')) {
    return 'application/yaml';
  } else if (contentType.includes('image')) {
    return 'application/image';
  } else {
    return 'application/text';
  }
};
