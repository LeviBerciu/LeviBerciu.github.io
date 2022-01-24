var loopsGrid = document.querySelector('.loopsGrid')

loopsGrid.addEventListener('mouseover', function(e){
    if (e.target.tagName == 'VIDEO'){
        e.target.play()
        e.target.loop = true;
    }
});

loopsGrid.addEventListener('mouseout', function(e){
    if (e.target.tagName == 'VIDEO'){
        e.target.pause();
        e.target.currentTime = 0;
    }
});