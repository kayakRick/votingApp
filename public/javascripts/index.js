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

class App extends React.Component {
    constructor(props) {
        super(props);
        this.onAboutClick = this.onAboutClick.bind(this);
        this.onLoginClick = this.onLoginClick.bind(this);
        this.onLogoutClick = this.onLogoutClick.bind(this);

        sessionStorage.setItem("loggedIn", false);

        this.state = {
            loggedIn: false,
            page: "main"
        }
    }

    onAboutClick(){
        bootbox.alert("Hello world!");
    }

    onLoginClick(){
        sessionStorage.setItem("loginName", "kayakRick");
        sessionStorage.setItem("loggedIn", true);
        this.setState({
            loggedIn: true
        });
    }

    onLogoutClick(){
        sessionStorage.removeItem("loginName");
        sessionStorage.setItem("loggedIn", false);
        this.setState({
            loggedIn: false
        });
    }

    render() {
        return(<div>
            <MenuBar loggedIn={this.state.loggedIn} onAboutClick={this.onAboutClick}
                onLoginClick={this.onLoginClick}  onLogoutClick={this.onLogoutClick}/>
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
