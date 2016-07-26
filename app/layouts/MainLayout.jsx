import React, {PropTypes} from 'react';
import {Provider} from 'react-redux';
import store from '../store';

const MainLayout = ({content}) => {
    return <Provider store={store}>
        <div className="layout">
            {content()}
        </div>
    </Provider>
};

MainLayout.propTypes = {
    content: PropTypes.func.isRequired
};

export default MainLayout;
