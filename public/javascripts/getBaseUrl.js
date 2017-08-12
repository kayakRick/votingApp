export default function getBaseUrl(){

    let port = window.location.port == "" ? "" : ":" + window.location.port;
    return window.location.protocol + "//" + window.location.hostname + port +"/";
}