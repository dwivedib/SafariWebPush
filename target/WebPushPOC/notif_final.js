let subscriptionInfoSafari;
let safariToken;

const check = function () {
    if (!('serviceWorker' in navigator)) {
        throw new Error('No Service Worker support!')
    }
    if (!('PushManager' in window)) {
        throw new Error('No Push API Support!')
    }
};

const sending = function (subscription) {

    var xhttp = new XMLHttpRequest();
    var parameter;

    xhttp.open("POST", "http://localhost:8080/WebPushPOC_war_exploded/save");
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            document.getElementById("surprise").innerHTML = this.responseText;
        }
    };

    if ('safari' in window && 'pushNotification' in window.safari) {
        const permissionData =
            window.safari.pushNotification.permission('web.com.clevertap.safari');
        if(permissionData.permission !== 'granted') {
            throw new Error('Permission not granted for Notification in Safari. Cannot send one!');
        }
        parameter = encodeURI(JSON.stringify({token: safariToken}));
    }else{
        console.log(subscription.toJSON());
        parameter = encodeURI(JSON.stringify(subscription));
    }

    xhttp.send("data=" + parameter);
};


const pushNotification = function () {

    const xhttp = new XMLHttpRequest();
    let parameter;

    if ('safari' in window && 'pushNotification' in window.safari) {
        const permissionData =
            window.safari.pushNotification.permission('web.com.clevertap.safari');
        if(permissionData.permission !== 'granted') {
            throw new Error('Permission not granted for Notification in Safari. Cannot send one!');
        }
        xhttp.open("POST", "http://localhost:8080/WebPushPOC_war_exploded/push");
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        parameter = encodeURI(safariToken);

    }else{
        //For Chrome & Firefox
    }

    xhttp.send("data=" + parameter);
};

function registerSafariPush() {
    if ('safari' in window && 'pushNotification' in window.safari) {

        var permissionData =
            window.safari.pushNotification.permission('web.com.clevertap.safari');
        window.safari.pushNotification.requestPermission(
            'http://localhost:8080/WebPushPOC_war_exploded/',
            'web.com.clevertap.safari', {}, function(subscription) {
                console.log(subscription);
                if(subscription.permission === 'granted') {
                    subscriptionInfoSafari = subscription;
                    safariToken = subscription.deviceToken;
                    sending(safariToken);
                }
                else if(subscription.permission === 'denied') {
                    // Nothing
                }
            });

    } else {
        alert("Push notifications not supported.");
    }
}

function registerSafariPush(){
    if('safari' in window && 'pushNotification' in window.safari){
        var permissionData = window.safari.pushNotification.permission('web.com.clevertap.safari');
        window.safari.pushNotification.requestPermission(
            'https://localhost:8443/WebPushPOC_war_exploded/',
            'web.com.clevertap.safari', {}, function(subscription){
                if(subscription.permission === 'granted'){
                    subscriptionInfoSafari = subscription;
                    safariToken = subscription.deviceToken;
                    sending(safariToken)
                }
                else if(subscription.permission === 'denied'){
                    alert("User has not permitted push notifications!");
                }
            }
        );
    }
}
function callPushRequest(){
    if('safari' in window && 'pushNotification' in window.safari){
        registerSafariPush();
    }
    else{
        alert("This browser is not Safari!");
    }
}
const main = function () {
    if (!'safari' in window) {
        check();
    }
};
main();