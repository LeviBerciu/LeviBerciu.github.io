// ---------- Navigation

var navMenuButton = document.querySelector('.navMenuButton')
var navCloseButton = document.querySelector('.navCloseButton')
var navList = document.querySelector('.navList')
var navUnderlay = document.querySelector('.navUnderlay')

navMenuButton.addEventListener('click', function(){
    navList.setAttribute('style', 'right: 0px');
    navUnderlay.setAttribute('style', 'visibility: visible; opacity: 0,75');
})

navCloseButton.addEventListener('click', function(){
    navUnderlay.setAttribute('style', 'visibility: hidden; opacity: 0');
    navList.setAttribute('style', 'right: -200px');
})

navUnderlay.addEventListener('click', function(){
    navUnderlay.setAttribute('style', 'visibility: hidden; opacity: 0');
    navList.setAttribute('style', 'right: -200px');
})

var mql = window.matchMedia('(max-width: 720px)');

function screenTest(e) {
    navUnderlay.setAttribute('style', 'visibility: hidden; opacity: 0');
    navList.setAttribute('style', 'right: -200px');
}

mql.addListener(screenTest);

// ---------- Loops Grid

var loopsGrid = document.querySelector('.loopsGrid')

loopsGrid.addEventListener('mouseover', function(e){
    if (e.target.tagName == 'VIDEO'){
        e.target.play()
        e.target.loop = true;
        console.log('play')
    }
});

loopsGrid.addEventListener('mouseout', function(e){
    if (e.target.tagName == 'VIDEO'){
        e.target.pause();
        e.target.currentTime = 0;
        console.log('pause')
    }
});