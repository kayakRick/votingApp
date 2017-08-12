/*********************************************************************************************************
 * The Menubar Class is responsible for displaying the menu bar at the top of the page. It is called
 * by the app class which passes it properties so it knows what needs to be displayed.
 * The Menubar has no state -- it get's it state infomation via props
 *********************************************************************************************************/

import React from 'react';

import  { Router,
    Route,
    IndexRoute,
    IndexLink,
    hashHistory,
    Link } from 'react-router';

export default class MenuBar extends React.Component{
    constructor(props) {
        super(props);
    }

    render(){

        let menu =[];
        let loginMess;

        if(!this.props.loggedIn){
            menu.push(<li key={1}><Link to="/">Home</Link></li>);
            menu.push(<li key={2}><a href="#" onClick={this.props.onLoginClick}>Login</a></li>);
            menu.push(<li key={3}><a href="#" onClick={this.props.onAboutClick}>About</a></li>);
            loginMess = "Not Logged In"
        }else{
            menu.push(<li key={1}><Link to="/">Home</Link></li>);
            menu.push(<li key={2}><Link to="/YourPolls">Your Polls</Link></li>);
            menu.push(<li key={3}><Link to="/NewPoll">New Poll</Link></li>);
            menu.push(<li key={4}><a href="#" onClick={this.props.onLogoutClick}>Logout</a></li>);
            menu.push(<li key={5}><a href="#" onClick={this.props.onAboutClick}>About</a></li>);
            loginMess = "Logged In As " + sessionStorage.getItem("loginName");
        }

        return (<div>
            <nav className="navbar navbar-default">
                <div className="container-fluid">
                    <div className="navbar-header">
                        <a className="navbar-brand" href="#">{loginMess}</a>
                    </div>

                    <div>
                        <ul className="nav navbar-nav navbar-right">
                            {menu}
                        </ul>
                    </div>
                </div>
            </nav>
        </div>);
    }

}
