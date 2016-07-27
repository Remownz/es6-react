import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { toggleHelloWorld } from '../actions/app';
import HelloWorld from '../components/HelloWorld';

function mapStateToProps({ app }) {
    return {
        app
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        toggleHelloWorld
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(HelloWorld);
