export const TOGGLE_HELLO_WORLD = 'toggle_hello_world';

export function toggleHelloWorld(e){
    e.preventDefault();

    return (dispatch, getState) => {
        dispatch({
            type: TOGGLE_HELLO_WORLD,
            data: !getState().app.helloWorld
        })
    }
}
