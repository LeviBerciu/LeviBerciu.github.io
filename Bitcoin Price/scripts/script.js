// On Startup
getData();

// Get Data
function getData(){
    fetch('https://api.coindesk.com/v1/bpi/currentprice.json').then(function(response){
    return response.json();
    }).then(function(data){

        const usdRate = data.bpi.USD.rate_float;
        const gbpRate = data.bpi.GBP.rate_float;
        const eurRate = data.bpi.EUR.rate_float;
        const updatedTime = data.time.updated;

        updateElements(usdRate, gbpRate, eurRate, updatedTime);

    }).catch(function(error){
        console.error(error);
    });
}

// Update UI
const usdEl = document.querySelector('.usd-data');
const gbpEl = document.querySelector('.gbp-data');
const eurEl = document.querySelector('.eur-data');
const timeEl = document.querySelector('.time-data');

function updateElements(usdRate, gbpRate, eurRate, updatedTime){
    usdEl.textContent = usdRate.toFixed(2);
    gbpEl.textContent = gbpRate.toFixed(2);
    eurEl.textContent = eurRate.toFixed(2);
    timeEl.textContent = updatedTime;
}

// Click & Toggle Tabs
const tabsEl = document.querySelector('.tabs');
const tabs = tabsEl.getElementsByTagName('LI');
const rateContainers = document.querySelectorAll('.rate-container')
tabsEl.addEventListener('click', function(e){
    if(e.target.tagName == 'LI'){
        const targetContainer = document.querySelector(e.target.dataset.target);
        Array.from(tabs).forEach(tab => {
            tab.classList.remove('active');
        });
        e.target.classList.add('active');
        rateContainers.forEach(container => {
            if(container == targetContainer){
                container.style.display = 'block';
            } else {
                container.style.display = 'none';
            }
        });
    }
});
tabsEl.firstElementChild.click();

// Refresh Data
const refreshEl = document.querySelector('.refresh');

refreshEl.addEventListener('click', function(){
    getData();
    rotateLogo()
});

// Rotate Logo
const logoEl = document.querySelector('.logo');
var rotateBy = 360;

function rotateLogo(){
    logoEl.style.transform = 'rotate(' + rotateBy + 'deg)'
    rotateBy += 360;
}


