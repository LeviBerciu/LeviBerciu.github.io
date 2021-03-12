var sendButton = document.getElementById('sendButton');
var consent = document.getElementById('consent');
consent.addEventListener('click', function(){
    if (consent.checked){
        console.log("consent")
        sendButton.disabled = false;
    } else {
        console.log("no consent")
        sendButton.disabled = true;
    }
});