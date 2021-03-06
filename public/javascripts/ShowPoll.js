/*******************************************************************************************************
 * This file contains the ShowPoll class and it's supporting classes. This class is called from the App
 * class via the react router by default on the index page. It is also displayed on the "your polls"
 * page via the YourPolls.js script. If the user is loged in and the owner of the displayed poll, an "add
 * response" button will be displayed
 *
 */

import React from 'react';
import {Doughnut} from 'react-chartjs-2';
import getBaseUrl from "./getBaseUrl";

/*******************************************************************************************************
 * This class encapsolates the new response button. It is called from the ShowPoll Render function
 */

class NewRespButton extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let poll = this.props.poll;

        if(poll == null || sessionStorage.getItem("loggedIn") == false ||
            poll.owner != sessionStorage.getItem("loginName")) {
            return null;
        }

        let nextQuestionIdx = this.props.poll.response.length;

        return (
            <div className="row top-buffer">
                <div className="col-md-1 col-md-offset-3">
                <button type="button" className="btn btn-primary" value={nextQuestionIdx}
                            onClick={this.props.onNewResponseClick}>Add Response</button>
                </div>
            </div>
        )
    }
}

/***************************************************************************************************
 * dataClass is used by the Chart class
 */

class dataClass{
    constructor(){
        this.data = {
            labels: [],
            datasets: [{
                data: []  ,
                backgroundColor: [],
                hoverBackgroundColor: []
            }]

        };
    }
    getData(){
        return this.data;
    }
}

/*******************************************************************************************************
 * The Chart class is draws the dobut chart and is called in ShowPolls Render function.
 * It is a wrapper for react-chartjs-2
 */

class Chart extends React.Component{
    constructor(props) {
        super(props);
    }

    rgb(r, g, b){
        return "rgb("+r+","+g+","+b+")";
    }


    rand(min, max){
        max++;
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }


    render(){
        if(this.props.poll == null) return null; // on first use, the poll hasn't been populated yet

        let data = new dataClass().getData();
        let responses = this.props.poll.response;

        for(let i = 0; i < responses.length; i ++) {
            data.labels.push(responses[i].response);
            data.datasets[0].data.push(responses[i].votes);
            let color = this.rgb(this.rand(0, 255), this.rand(0, 255), this.rand(0, 255));
            data.datasets[0].backgroundColor.push(color);
            data.datasets[0].hoverBackgroundColor.push(color);
        }

        return (
            <div id="piechart">
                <Doughnut data={data} />
            </div>
        );
    }

}

/***************************************************************************************************
 * PollRow respresents a single poll response and is called from ShowPoll.Render()
 */

class PollRow extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <div className="row top-buffer">
                    <div className="col-md-1 col-md-offset-1">
                        {this.props.voteAllowed ?
                            <button type="button" className="btn btn-primary"
                                    value={this.props.keyProp} onClick={this.props.onButtonClick}>Vote</button> : null}
                    </div>
                    <div className="col-md-7 col-md-offset-1">
                        {this.props.response + " (" + this.props.votes + ")"};
                    </div>
                </div>
            </div>
        );
    }
}

export default class ShowPoll extends React.Component {
    constructor(props) {
        super(props);

        this.alertContents = this.alertContents.bind(this);
        this.onVoteButtonClick = this.onVoteButtonClick.bind(this);
        this.onNewResponseClick = this.onNewResponseClick.bind(this);
        this.getLoginURL = getBaseUrl() + "poll/";
        this.httpRequest = null;
        this.state = {
            poll: null,
            getStatus: "waiting",
            voteAllowed: localStorage.getItem(this.props.params.pollId) ? false : true
        };
        this.getPoll();
    }

    onNewResponseClick(e){
        let poll = this.state.poll;
        let self = this;
        let nextQuestionIdx = e.target.value;

        bootbox.prompt({
            title: "Enter New Response",
            inputType: 'text',
            callback: function (result) {

                if(result == null) return;

                poll.response.push({
                    response: result,
                    votes: 0
                });

                self.httpRequest = new XMLHttpRequest();
                self.httpRequest.onreadystatechange = self.alertContents;
                self.httpRequest.open
                    ("POST", self.getLoginURL + "newResp/" + poll._id + "/" + nextQuestionIdx +
                    "/" + result);
                self.httpRequest.setRequestHeader("Content-Type", "application/json");
                self.httpRequest.send(JSON.stringify(poll));
                self.setState({getStatus: "waitingForUpdateNewResponse"});
            }
        });
    }


    getPoll() {
        this.httpRequest = new XMLHttpRequest();
        this.httpRequest.onreadystatechange = this.alertContents;
        this.httpRequest.open("GET", this.getLoginURL + this.props.params.pollId);
        this.httpRequest.send();
    }

    alertContents() {
        try {
            if (this.httpRequest.readyState === XMLHttpRequest.DONE) {
                if (this.httpRequest.status === 200) {
                    let poll = JSON.parse(this.httpRequest.responseText);

                    if(this.state.getStatus == "waitingForVote")
                        localStorage.setItem(poll._id, true);

                    this.setState({
                        poll: poll,
                        getStatus: "success"
                    });

                    //console.log(JSON.parse(this.httpRequest.responseText));
                } else {

                    if(this.state.getStatus == "waitingForVote")
                        this.setState({voteAllowed: true});

                    this.setState({
                        getStatus: "failed",
                        errorMess: "Request Failed -- Response Code = " + this.httpRequest.status
                    });
;
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

    onVoteButtonClick(e) {
        this.httpRequest = new XMLHttpRequest();
        this.httpRequest.onreadystatechange = this.alertContents;
        this.httpRequest.open("POST", this.getLoginURL + this.props.params.pollId + "/" + e.target.value);
        this.httpRequest.send();

        this.setState({
            voteAllowed: false,
            getStatus: "waitingForVote"
        });
    }

    render() {

        let poll = this.state.poll;
        let question = null;
        let total = null;
        let pollRows = [];

        if (poll) {
            question = poll.question

            let pollTotal = poll.response.reduce((sum, value) => sum + value.votes, 0);
            total = "(" + pollTotal + " votes)";
            pollRows = poll.response.map((value, idx) =>
                <PollRow key={idx} keyProp={idx} response={value.response}
                         votes={value.votes} voteAllowed={this.state.voteAllowed}
                         onButtonClick={this.onVoteButtonClick}/>);
        }
        else {
            question = "";
            total = "";
        }


        switch (this.state.getStatus) {
            case "failed":
                alert = <div className="alert alert-danger" role="alert">{this.state.errorMess}</div>;
                break;
            case "waitingForVote":
                alert = <div className="alert alert-info" role="alert">Vote Submitted</div>;
                break;
            default:
                alert = null;
        }

        return (
            <div className="container">
                <div className="text-center"><h1>{question}</h1></div>
                <div className="text-center"><h2>{total}</h2></div>
                {alert}
                <div id="leftDiv">
                    {pollRows}
                    <NewRespButton poll={this.state.poll} onNewResponseClick={this.onNewResponseClick}/>
                </div>
                <Chart poll={this.state.poll}/>
            </div>
        );
    }
}
