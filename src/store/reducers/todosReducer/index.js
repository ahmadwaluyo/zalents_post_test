import * as actionTypes from '../../actionTypes';

const initialState = {
    todos: [],
    loadingTodos: false
}

const todosReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SET_ALL_TODOS:
            return {...state, todos: action.payload}
        case actionTypes.SET_LOADING_TODOS:
            return {...state, loadingTodos: action.status}
        default:
            return state
    }
}

export default todosReducer;