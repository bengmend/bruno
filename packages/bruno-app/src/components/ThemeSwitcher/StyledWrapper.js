import styled from "styled-components";

const StyledWrapper = styled.div`
  color: var(--color-text);
  .collection-options {
    svg {
      position: relative;
      top: -1px;
    }

    .label {
      cursor: pointer;
      &:hover {
        text-decoration: underline;
      }
    }
  }
`;

export default StyledWrapper;
