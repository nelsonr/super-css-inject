import { SuperCSSInject } from "../types";
import { Stylesheet } from "../Stylesheet";

type State = SuperCSSInject;
type ActionValue = SuperCSSInject | string | number;

export enum ActionType {
    Add,
    Remove,
    UpdateState,
}

interface Action {
    type: ActionType;
    value: ActionValue;
}

export function reducer (state: State, action: Action): State {
    const { type, value } = action;
    
    switch (type) {
    case ActionType.Add:
        return add(state, value as string);
        
    case ActionType.Remove:
        return remove(state, value as number);
        
    case ActionType.UpdateState:
        return updateState(state, value as SuperCSSInject);

    default:
        return state;
    }
}

function updateState (state: State, newState: State): State {
    return { ...state, ...newState };
}

function add (state: State, url: string): State {
    const stylesheet = new Stylesheet(url);
    
    return { 
        ...state, 
        stylesheets: [ ...state.stylesheets, stylesheet ] 
    };
}

function remove (state: State, id: number): State {
    const stylesheets = state.stylesheets.filter((_item, index) => index !== id);
    
    return {
        ...state,
        stylesheets: stylesheets
    };
}
