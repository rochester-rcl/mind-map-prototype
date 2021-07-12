import React, { Fragment } from "react";
import styled from "styled-components";
import { GlobalStyle, Palette } from "./styles/GlobalStyles";
import TextSelector from "./components/text-selector/TextSelector";
import NodeEditor from "./components/node-editor/NodeEditor";

// Main app container display component
const AppContainer = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
  overflow-y: hidden;
`;

// Child container display component
const ChildContainer = styled.div`
  flex: 0.6;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
`;

const NodeEditorContainer = styled(ChildContainer)`
  background: ${Palette.offWhite};
`;

const TextSelectorContainer = styled(ChildContainer)`
  flex: 0.4;
  background: ${Palette.white};
  padding: 20px;
`;

/**
 * The main App component - renders global styles as well as
 * the TextSelector and NodeEditor components
 * @returns
 */
function App() {
  // sample text select handler callback
  function handleSelectText(selected: ISimpleTextSelection) {
    console.log(selected);
  }

  return (
    <Fragment>
      <GlobalStyle />
      <AppContainer>
        <NodeEditorContainer>
          <NodeEditor />
        </NodeEditorContainer>
        <TextSelectorContainer>
          <TextSelector onSelect={handleSelectText} />
        </TextSelectorContainer>
      </AppContainer>
    </Fragment>
  );
}

export default App;
