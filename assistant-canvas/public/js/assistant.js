/*
* wrapper class for interactive canvas class
* allows for callbacks (communicate changes between fulfillment and webapp)
*/

class Assistant {
  /**
  * @param  {Phaser.Scene} scene which serves as a container of all visual
  * and audio elements.
  */
  constructor(scene) {
    this.canvas = window.interactiveCanvas;
    this.gameScene = scene;
    const that = this;
    this.commands = {};
  }

  /**
  * Register all callbacks used by the Interactive Canvas Action
  * executed during game creation time.
  */
  setCallbacks() {
    const that = this;
    // Declare the Interactive Canvas action callbacks.
    const callbacks = {
      onUpdate(data) {
        //that.commands[data.state ? data.state.toUpperCase() : 'DEFAULT'](data);
      },
    };
    // Called by the Interactive Canvas web app once web app has loaded to
    // register callbacks.
    this.canvas.ready(callbacks);
  }
}