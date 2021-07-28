import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { 
    Elements,
    FlowTransform,
    FlowElement,
    isNode,
    isEdge
} from 'react-flow-renderer/nocss';

interface GraphEditorState {  
  elements: Elements;
  transform: FlowTransform
}

  
const initialState: GraphEditorState = {
  elements: [],
  transform: {x: 0.0, y: 0.0, zoom: 1.0}
}
  
export const graphEditorSlice = createSlice({
  name: 'graphEditor',
  initialState,
  reducers: {
    setElements: (state, action: PayloadAction<Elements>) => {
      state.elements = action.payload;
    },

    setTransform: (state, action: PayloadAction<FlowTransform>) => {
      state.transform = action.payload;
    },
  }
});

export const selectElements = (state: GraphEditorState) => {
  return state.elements;
}


export const selectTransform = (state: GraphEditorState) => {
  return state.transform;
}

export const selectModelNodes = (state: GraphEditorState) => {
  let modelNodes: FlowElement[] = []
  state.elements.forEach(function (element: FlowElement) {
    if (isNode(element)) {
      modelNodes.push(element);
    }
  });

  return modelNodes;
}

export const selectEdgeNodes = (state: GraphEditorState) => {
  let edgeNodes: FlowElement[] = []
  state.elements.forEach(function (element: FlowElement) {
    if (isEdge(element)) {
      edgeNodes.push(element);
    }
  });

  return edgeNodes;
}

export const { setElements, setTransform } = graphEditorSlice.actions
export default graphEditorSlice.reducer
