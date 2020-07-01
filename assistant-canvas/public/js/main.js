
'use strict';

interactiveCanvas.ready({
  onUpdate(data) {
    
    if(data.scene === 'tutorial') {
      
    }

    else if(data.scene === 'information') {

    }

    else if (data.scene === 'simulation') {
      var pageContent = document.getElementById('content');
      pageContent.innerHTML = "<h1>Simulation</h1>";
    }

    else if (data.scene === 'news') {

    }
  }
})