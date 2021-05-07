import { combineReducers } from 'redux';
import loginReducer from './loginRegistReducer/loginReducer';
import registerReducer from './loginRegistReducer/registerReducer';
import todosReducer from './todosReducer';
import itemsReducer from './itemsReducer';

const rootReducer = combineReducers({
    loginReducer,
    registerReducer,
    todosReducer,
    itemsReducer
});

export default rootReducer;