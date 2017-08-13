/*******************************************************************************************************
 * This file contains the NewPoll class and it's supporting classes. This class is called from the App
 * class via the react router in response to the user selecting "New Poll" from the menu bar. Newpoll
 * stores it's own state.
 *
 * NewPoll is meant to be used only when the user is logged in. If a non-logged in user attempts to
 * access it via direct entry of the url, they will be re-directed to the app main page.
 */

import React from 'react';
import getBaseUrl from "./getBaseUrl";

/********************************************************************************************************
 * NewResponse respresents a single response line on the NewPoll page
 * It gets its state information via props from the NewPoll class and all of the
 * event handlers are in that class as well
 *********************************************************************************************************/

class NewResponse extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return (
            <div className={"form-group " + this.props.responseClass}>
                <label className="control-label" htmlFor={"response" + this.props.qNum}>
                    {"Response"  + this.props.qNum}</label>
                <input type="text" className="form-control" id={this.props.qNum}
                       placeholder={"Enter response "  + this.props.qNum}
                       onChange={this.props.onChange} value={this.props.value}>
                </input>
            </div>
        );
    }
}

/*************************************************************************************************
 *
 * the initialState class is used whenever it is necessary to set the NewPoll class to its
 * initial state
 *
 */

class intialState{
    constructor(){
        this.question = "";  /* the text of the question control */
        this.response = ["", ""]; /* text of the resonse lines -- initially 2 lines but can grow */
        this.saveState = "idle"; /* indicates the state of the "save poll" operation */
    }


}

export default class NewPoll extends React.Component {

    constructor(props) {
        super(props);

        this.onQuestionChange = this.onQuestionChange.bind(this);
        this.onResponseChange = this.onResponseChange.bind(this);
        this.onAddResponseClick = this.onAddResponseClick.bind(this);
        this.onDeleteResponseClick = this.onDeleteResponseClick.bind(this);
        this.onResetClick = this.onResetClick.bind(this);
        this.onSubmitClick = this.onSubmitClick.bind(this);
        this.alertContents = this.alertContents.bind(this);


        this.savePollURL = getBaseUrl() + "poll";
        this.httpRequest;

        this.state = new intialState();

    }

    componentWillMount(){
        if(!sessionStorage.getItem("loginName"))
            this.props.router.push('/');
    }

    initializeState(){
        this.setState(new intialState());

    }

    onQuestionChange(e){
        this.setState({question: e.target.value.trim() == "" ? "" : e.target.value});
        this.setState({saveState: "idle"});
    }

    onResponseChange(e){
        let responseVal = this.state.response;
        responseVal[e.target.id - 1] = e.target.value.trim() == "" ? "" : e.target.value;
        this.setState({response: responseVal});
        this.setState({saveState: "idle"});
    }

    onAddResponseClick(){
        let response = this.state.response;
        response.push("");
        this.setState({response: response});
    }

    onDeleteResponseClick(){
        let response = this.state.response;

        if(response.length == 2) return;

        response.pop();
        this.setState({response: response});

    }

    onResetClick(){
        this.initializeState();
    }

    onSubmitClick(){
        let response = [];

        for(let i = 0; i < this.state.response.length; i++){
            response.push({
                response: this.state.response[i],
                votes: 0
            });
        }

        let poll = {
            owner: sessionStorage.getItem("loginName"),
            question: this.state.question,
            response: response
        };

        this.httpRequest = new XMLHttpRequest();
        this.httpRequest.onreadystatechange = this.alertContents;
        this.httpRequest.open("PUT", this.savePollURL);
        this.httpRequest.setRequestHeader("Content-Type", "application/json");
        this.httpRequest.send(JSON.stringify(poll));

        this.setState({saveState: "waiting"});
    }

    alertContents() {
        try {
            if (this.httpRequest.readyState === XMLHttpRequest.DONE) {
                if (this.httpRequest.status === 200) {
                    this.initializeState();
                    this.setState({saveState: "saved"});
                } else {
                    this.setState({
                        saveState: "failed",
                        saveMess: "Save Request Failed -- Response Code = " + this.httpRequest.status
                    });
                }
            }
        }
        catch (e) {
            this.setState({
                saveState: "failed",
                saveMess: "Caught Exception: " + e.message
            });
        }
    }



    render() {
        let newResponses = [];
        let response = this.state.response;

        for(let i = 0; i < response.length; i++){
            let responseClass = response[i] != "" ? "has-success" : "has-error";
            newResponses.push(<NewResponse qNum={i + 1} onChange={this.onResponseChange}
                                           value={response[i]} key={i + 1}
                                           responseClass={responseClass}/>);
        }

        let submitState = this.state.question != "" ? "" : "Disabled";

        if(submitState == ""){
            let responses = this.state.response;

            for(let i = 0; i < responses.length; i++){
                if(responses[i] == ""){
                    submitState = "Disabled";
                    break;
                }
            }
        }

        let questionClass = this.state.question != "" ? "has-success" : "has-error";

        let deleteResponseState = this.state.response.length > 2 ?  "" : "Disabled";

        let alert;

        switch(this.state.saveState){
            case "waiting":
                alert = <div className="alert alert-info" role="alert">Saving Poll -- Please Wait</div>;
                break;
            case "saved":
                alert = <div className="alert alert-success" role="alert">Your Poll Was Saved</div>;
                break;
            case "failed":
                alert = <div className="alert alert-danger" role="alert">{this.state.saveMess}</div>;
                break;
            default:
                alert = null;
        }

        return (
            <div className="container">
                <h1>Create a New Poll</h1>
                {alert}
                <form>
                    <div className={"form-group " + questionClass}>
                        <label className="control-label" htmlFor="inputQuestion">Question</label>
                        <input type="text" className="form-control" id="inputQuestion" placeholder="Enter poll question"
                               onChange={this.onQuestionChange} value={this.state.question}></input>
                    </div>
                    {newResponses}
                    <div className="btn-group" role="group" aria-label="...">
                        <button type="button" className="btn btn-primary" disabled={submitState}
                                onClick={this.onSubmitClick}>Submit</button>
                        <button type="button" className="btn btn-info" onClick={this.onAddResponseClick}
                                disabled={submitState}> Add Response</button>
                        <button type="button" className="btn btn-warning" onClick={this.onDeleteResponseClick}
                                disabled={deleteResponseState}>Remove Last Response</button>
                        <button type="button" className="btn btn-danger" onClick={this.onResetClick}>
                            Reset</button>
                    </div>
                </form>
            </div>
        );
    }
}