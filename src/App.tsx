import React, { Fragment } from "react";
import styled from "styled-components";
import { GlobalStyle } from "./styles/GlobalStyles";
import TextSelector from "./components/text-selector/TextSelector";
const AppContainer = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
  overflow-y: hidden;
`;

const ChildContainer = styled.div`
  flex: 1;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  margin-top: 20px;
  padding: 20px;
`;

function App() {
  function handleSelectText(selected: ISimpleTextSelection) {
    console.log(selected);
  }
  return (
    <Fragment>
      <GlobalStyle />
      <AppContainer>
        <ChildContainer>Node Editor Goes Here</ChildContainer>
        <ChildContainer>
          <TextSelector onSelect={handleSelectText} />
        </ChildContainer>
      </AppContainer>
    </Fragment>
  );
}

export default App;
