function HexGen(){
    var hexValues = ["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"];
    var hexCode = new Array(6);
    for (var i = 0; i < hexCode.length; i++){
        var RandHexValue = Math.floor(Math.random() * hexValues.length);
        hexCode[i] = hexValues[RandHexValue];
    }
    var newHex = "#" + hexCode[0] + hexCode[1] + hexCode[2] + hexCode[3] + hexCode[4] + hexCode[5];
    return newHex;
}

function NewGradient(){
    var hex1 = HexGen();
    var hex2 = HexGen();
    document.getElementById("body").style.background = "linear-gradient(45deg, " + hex1 + ", " + hex2 + ")";
    document.getElementById("hex1").textContent = hex1;
    document.getElementById("hex2").textContent = hex2;
}

NewGradient();