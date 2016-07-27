import React, {PropTypes} from 'react';

const HelloWorld = ({app, toggleHelloWorld}) => {
    return (
        <div>
            {app.helloWorld ?
            <h1>Hallo Welt!</h1> : null}
            <a href="#!" onClick={toggleHelloWorld}>toggle</a>
        </div>

    );
};

HelloWorld.propTypes = {
    app: PropTypes.object.isRequired,
    toggleHelloWorld: PropTypes.func.isRequired
};

export default HelloWorld;
