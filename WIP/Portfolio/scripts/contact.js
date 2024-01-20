var sendButton = document.getElementById("send-button");
var consentCheckbox = document.getElementById("consent");
consentCheckbox.addEventListener("click", function(){
    if (consentCheckbox.checked){
        sendButton.disabled = false;
    } else {
        sendButton.disabled = true;
    }
});