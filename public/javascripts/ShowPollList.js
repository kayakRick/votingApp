import React from 'react';
import getBaseUrl from "./getBaseUrl";

import  { Router,
    Route,
    IndexRoute,
    IndexLink,
    hashHistory,
    Link } from 'react-router';

class Poll extends React.Component{
    constructor(props) {
        super(props);
    }

    render(){

        if(this.props.mode == "user")
            return(
                <tr>
                    <td><Link to={"/showPoll/" + this.props.pollId}>{this.props.pollName}</Link></td>
                    <td><button type="button" className="btn btn-primary"  value={this.props.pollId}
                                onClick={this.props.onDeleteClick}>Delete</button></td>
                </tr>
            );
        else
            return(
                <tr>
                    <td><Link to={"/showPoll/" + this.props.pollId}>{this.props.pollName}</Link></td>
                </tr>
            );

    }
}

export default class ShowPollList extends React.Component{
    constructor(props) {
        super(props);

        this.alertContents = this.alertContents.bind(this);
        this.alertContentsDelete = this.alertContentsDelete.bind(this);
        this.onDeleteClick = this.onDeleteClick.bind(this);
        this.getPollListURL = getBaseUrl() + "poll-list";
        this.deletePollURL = getBaseUrl() + "poll/";
        this.httpRequest = null;
        this.state = {polls: [],
            getStatus: "waiting"};
        this.getPollList();
    }

    onDeleteClick(e){
        this.httpRequest = new XMLHttpRequest();
        this.httpRequest.onreadystatechange = this.alertContentsDelete;
        this.httpRequest.open("DELETE", this.deletePollURL + e.target.value);
        this.httpRequest.send();
        this.setState({getStatus: "waitingForDelete"});
    }

    alertContentsDelete() {
        try {
            if (this.httpRequest.readyState === XMLHttpRequest.DONE) {
                if (this.httpRequest.status === 200) {
                    this.getPollList();
                    this.setState({getStatus: "waiting"});
                } else {
                    this.setState({
                        getStatus: "failed",
                        errorMess: "Request Failed -- Response Code = " + this.httpRequest.status
                    });
                }
            }
        }
        catch (e) {
            this.setState({
                saveState: "failed",
                errorMess: "Caught Exception: " + e.message
            });
        }
    }

    getPollList(){
        this.httpRequest = new XMLHttpRequest();
        this.httpRequest.onreadystatechange = this.alertContents;

        if(this.props.mode == "user")
            this.httpRequest.open("GET", this.getPollListURL + "/userList/" + sessionStorage.getItem("loginName"));
        else
            this.httpRequest.open("GET", this.getPollListURL);

        this.httpRequest.send();
    }

    alertContents() {
        try {
            if (this.httpRequest.readyState === XMLHttpRequest.DONE) {
                if (this.httpRequest.status === 200) {
                    this.setState({polls: JSON.parse(this.httpRequest.responseText),
                        getStatus: "success"});
                } else {
                    this.setState({
                        getStatus: "failed",
                        errorMess: "Request Failed -- Response Code = " + this.httpRequest.status
                    });
                }
            }
        }
        catch (e) {
            this.setState({
                saveState: "failed",
                errorMess: "Caught Exception: " + e.message
            });
        }
    }

    render(){
        let polls = this.state.polls;
        let pollList = [];

        for(let i = 0; i < polls.length; i++){
            pollList.push(<Poll pollName={polls[i].question} pollId={polls[i]._id} key={i}
                onDeleteClick={this.onDeleteClick} mode={this.props.mode}/>);
        }

        let alert;

        if(this.state.getStatus == "failed")
            alert = <div className="alert alert-danger" role="alert">{this.state.errorMess}</div>;
        else if(this.state.getStatus == "waitingForDelete")
            alert = <div className="alert alert-info" role="alert">Deleting Poll -- Please Wait</div>;
        else if(this.state.getStatus == "waitingForUpdate")
            alert = <div className="alert alert-info" role="alert">Updating Poll -- Please Wait</div>;
        else
            alert = null;

        return (
            <div className="container">
                <div className="text-center">
                    <h1>{this.props.mode == "user" ? "Your Polls" : "Polls"}</h1></div>
                <div className="row">
                    <div className="col-md-offset-1 col-md-10">
                        <table className="table table-bordered table-striped table-hover">
                            <tbody>
                                {pollList}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}