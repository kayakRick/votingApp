import React from 'react';

import ShowPollList from "./ShowPollList";

export default class YourPolls extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount(){
        if(!sessionStorage.getItem("loginName"))
            this.props.router.push('/');
    }

    render() {
        return(
            <ShowPollList mode="user"/>
        );
    }
}