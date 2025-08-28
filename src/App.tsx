import { useState, useRef, createContext } from "react";
import styled from "styled-components";

import { GlobalStyle, Palette } from "./styles/GlobalStyles";
import TextSelector from "./components/text-selector/TextSelector";
import NodeEditor, {
  NodeEditorHandle
} from "./components/node-editor/NodeEditor";

/* ------------------------------------------------------------------ */
/*  Layout                                                             */
/* ------------------------------------------------------------------ */

const AppContainer = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
  overflow-y: hidden;
`;

const ChildContainer = styled.div`
  flex: 0.6;
  overflow-y: auto;
`;

const NodeEditorContainer = styled(ChildContainer)`
  background: ${Palette.offWhite};
  position: relative;
`;

const Toolbar = styled.div`
  position: absolute;   /* ← new: remove it from normal flow  */
  top: 8px;             /* same vertical offset as controls   */
  left: 8px;
  display: flex;
  gap: 8px;
  z-index: 10;          /* stay above React‑Flow canvas       */
`;

const TextSelectorContainer = styled(ChildContainer)`
  flex: 0.4;
  background: ${Palette.white};
  padding: 20px;
  overflow-x: hidden;
`;

/* ------------------------------------------------------------------ */
/*  Context                                                            */
/* ------------------------------------------------------------------ */

const defaultAppCtx: IAppContext = {
  selectedTextNodes: [],
  highlightedTexts: []
};
export const AppContext = createContext<IAppContext>(defaultAppCtx);

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

function App() {
  /* -------- Selection / highlighting (existing behaviour) -------- */
  const [highlightedTextNodes, setHighlightedTextNodes] = useState<
    IDraftSelectedTextNode[]
  >([]);
  const [selectedTextNodes, setSelectedTextNodes] = useState<
    IDraftSelectedTextNode[]
  >([]);

  function handleSelectNodes(nodes: IDraftSelectedTextNode[]) {
    setHighlightedTextNodes(nodes);
  }
  function handleSelectNode(node: IDraftSelectedTextNode) {
    setHighlightedTextNodes([node]);
  }
  function handleDeselectNodes() {
    setHighlightedTextNodes([]);
  }
  function handleNodesChange(nodes: IDraftSelectedTextNode[]) {
    setSelectedTextNodes(nodes);
    setHighlightedTextNodes(prev =>
      nodes.filter(({ node }) => prev.some(p => p.node.id === node.id))
    );
  }
  const highlightedTexts = highlightedTextNodes.map(tn => tn.selected);

  /* -------- Patch 1: article text + node‑editor ref -------- */
  const [article, setArticle] = useState<string>("");
  const nodeRef = useRef<NodeEditorHandle>(null);

  /* -------- Export / Import handlers -------- */
  function handleExport() {
    const map = nodeRef.current?.getMap();
    if (!map) return;
    const exportData = { ...map, article };   // merge in the article
    navigator.clipboard
      .writeText(JSON.stringify(exportData, null, 2))
      .catch(() => alert("Could not copy to clipboard."));
  }

  function handleImport() {
    const raw = prompt("Paste the exported JSON here:");
    if (!raw) return;
    try {
      const obj = JSON.parse(raw);
      if (typeof obj.article === "string") setArticle(obj.article);
      if (obj.nodes && obj.edges) {
        nodeRef.current?.loadMap({
          nodes: obj.nodes as any,            // includes `selected`
          edges: obj.edges
        });
      }
    } catch {
      alert("Invalid JSON – import aborted.");
    }
  }

  /* -------- Render -------- */
  return (
    <AppContext.Provider value={{ selectedTextNodes, highlightedTexts }}>
      <GlobalStyle />
      <AppContainer>
        <NodeEditorContainer>
          <Toolbar>
            <button onClick={handleExport}>Export Map</button>
            <button onClick={handleImport}>Import Map</button>
          </Toolbar>

          <NodeEditor
            ref={nodeRef}
            onSelectNode={handleSelectNode}
            onNodesChange={handleNodesChange}
            onDeselectNodes={handleDeselectNodes}
            onSelectNodes={handleSelectNodes}
          />
        </NodeEditorContainer>

        <TextSelectorContainer>
          <TextSelector initialText={article} onChange={setArticle} />
        </TextSelectorContainer>
      </AppContainer>
    </AppContext.Provider>
  );
}

export default App;
