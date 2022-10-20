import React from "react";
import StyledWrapper from "./StyledWrapper";

const ResponseHeaders = ({ headers }) => {
  return (
    <StyledWrapper className="px-3 pb-4 w-full">
      <table>
        <thead>
          <tr>
            <td>Name</td>
            <td>Value</td>
          </tr>
        </thead>
        <tbody>
          {headers && headers.length
            ? headers.map((header, index) => {
                return (
                  <tr key={index}>
                    <td className="key">{header[0]}</td>
                    <td className="value">{header[1]}</td>
                  </tr>
                );
              })
            : null}
        </tbody>
      </table>
    </StyledWrapper>
  );
};
export default ResponseHeaders;
