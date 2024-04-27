import styled from 'styled-components';

const StyledWrapper = styled.div`
  div.tabs {
    div.tab {
      padding: 6px 0px;
      border: none;
      border-bottom: solid 2px transparent;
      margin-right: 1.25rem;
      color: var(--color-tab-inactive);
      cursor: pointer;

      &:focus,
      &:active,
      &:focus-within,
      &:focus-visible,
      &:target {
        outline: none !important;
        box-shadow: none !important;
      }

      &.content,
      &.active {
        color: ${(props) => props.theme.tabs.active.color} !important;
      }

      &.active {
        border-bottom: solid 2px ${(props) => props.theme.tabs.active.border} !important;
      }
    }
  }
`;

export default StyledWrapper;
