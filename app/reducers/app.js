import { TOGGLE_HELLO_WORLD } from '../actions/app';

export const initialState = {
    helloWorld: false
};

export default function (state = initialState, action = {}) {
    const {data, type} = action;

    switch (type) {
        case TOGGLE_HELLO_WORLD:
            return Object.assign({}, state, {
                helloWorld: data
            });
        default:
            return state;
    }
}
