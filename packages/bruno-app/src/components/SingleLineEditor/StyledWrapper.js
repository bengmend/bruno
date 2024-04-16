import styled from 'styled-components';

const StyledWrapper = styled.div`
  width: 100%;
  height: ${(props) => (props.allowNewlines ? 'fit-content' : '30px')};
  max-height: ${(props) => (props.allowNewlines ? '200px' : 'none')};
  overflow: ${(props) => (props.allowNewlines ? 'auto' : 'hidden')};

  .CodeMirror {
    background: transparent;
    height: ${(props) => (props.allowNewlines ? 'fit-content' : '34px')};
    font-size: 14px;
    line-height: 30px;
    overflow: hidden;

    .CodeMirror-scroll {
      overflow: hidden !important;
      ${'' /* padding-bottom: 50px !important; */}
    }

    .CodeMirror-vscrollbar,
    .CodeMirror-hscrollbar,
    .CodeMirror-scrollbar-filler {
      display: none;
    }

    .CodeMirror-lines {
      padding: 0;
    }

    .CodeMirror-cursor {
      height: 20px !important;
      margin-top: 5px !important;
      border-left: 1px solid ${(props) => props.theme.text} !important;
    }

    pre {
      font-family: Inter, sans-serif !important;
      font-weight: 400;
    }

    .CodeMirror-line {
      color: ${(props) => props.theme.text};
      padding: 0;
    }

    .CodeMirror-selected {
      background-color: rgba(212, 125, 59, 0.3);
    }
  }
`;

export default StyledWrapper;
