import { createContext, useReducer } from "react";

export const Store = createContext()

export function StoreProvider(props){
    const [state,dispatch] = useReducer(reducer,initialState)
    const value = {state,dispatch}
    return <StoreProvider value={value}>
        {props.children}
    </StoreProvider>
}