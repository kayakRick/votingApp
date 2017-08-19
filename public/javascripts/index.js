/********************************************************************************************************
 * This is the main container for the voting app.
 * The App class serves as the parent container for the menu bar and the main part of the page. Most
 * menu bar selections are handled by various child components via the react router but "about" is handled
 * directly.
 ********************************************************************************************************/

"use strict";

import React from 'react';
import ReactDOM from 'react-dom';

import  { Router,
    Route,
    IndexRoute,
    IndexLink,
    hashHistory,
    Link } from 'react-router';

import MenuBar from './MenuBar';
import NewPoll from "./NewPoll";
import ShowPollList from "./ShowPollList";
import ShowPoll from "./ShowPoll";
import YourPolls from "./YourPolls";

import getBaseUrl from "./getBaseUrl";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.onAboutClick = this.onAboutClick.bind(this);

        console.log(document.cookie)

        this.state = {
            loggedIn: this.getCookieValue("loggedIn") == "true",
            loginName: this.getCookieValue("name")
        };

        sessionStorage.setItem("loggedIn", this.state.loggedIn);
        sessionStorage.setItem("loginName", this.state.loginName);

    }

    getCookieValue (sKey) {
        if (!sKey) {
            return null;
        }
        return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
    }

    onAboutClick(){
        bootbox.alert('Written by Rick Evans<br>Code is available ' + '' +
            '<a href="https://github.com/kayakRick/votingApp" target="_blank">Here</a>');
    }


    render() {
        console.log(this.state.loggedIn)
        return(<div>
            <MenuBar loggedIn={this.state.loggedIn} onAboutClick={this.onAboutClick}/>
            {this.props.children}
        </div>);
    }
}

ReactDOM.render(
    <Router history={hashHistory}>
        <Route path="/" component={App}>
            <IndexRoute component={ShowPollList}/>
            <Route path="showPoll/:pollId" component={ShowPoll}/>
            <Route path="YourPolls" component={YourPolls}/>
            <Route path="NewPoll" component={NewPoll}/>
        </Route>
    </Router>,
    document.getElementById("app"));
