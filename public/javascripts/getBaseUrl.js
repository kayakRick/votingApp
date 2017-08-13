/********************************************************************************************************
 *
 * This function returns the base url of the app, including transport and port
 *
 *********************************************************************************************************/

export default function getBaseUrl(){

    let port = window.location.port == "" ? "" : ":" + window.location.port;
    return window.location.protocol + "//" + window.location.hostname + port +"/";
}