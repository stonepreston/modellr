import { configureStore } from '@reduxjs/toolkit'
import graphEditorReducer from './modeling/graph_editor/graphEditorSlice'
const store = configureStore({  
  reducer: {    
    graphEditor: graphEditorReducer,
  }
})

export default store;
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch