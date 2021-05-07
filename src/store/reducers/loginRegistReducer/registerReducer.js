import * as actionTypes from '../../actionTypes';

const initialState = {
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
}

const registerReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SET_REGISTER:
            return {...state}
        default:
            return state
    }
}

export default registerReducer;