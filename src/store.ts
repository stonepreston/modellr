import { configureStore } from '@reduxjs/toolkit'
import graphEditorReducer from './modeling/graph_editor/graphEditorSlice'
import resultsReducer from './modeling/results/resultsSlice'
const store = configureStore({  
  reducer: {    
    graphEditor: graphEditorReducer,
    results: resultsReducer
  }
})

export default store;
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch