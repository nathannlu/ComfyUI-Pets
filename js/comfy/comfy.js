import { api as _api } from '../../../scripts/api.js';
import { app as _app } from '../../../scripts/app.js';
import { ComfyWidgets as _ComfyWidgets } from "../../../scripts/widgets.js";
import { ComfyDialog as _ComfyDialog, $el as _$el } from "../../../scripts/ui.js";

export const api          = _api;
export const app          = _app;
export const ComfyWidgets = _ComfyWidgets;
export const ComfyDialog  = _ComfyDialog;
export const $el          = _$el;
export const LGraphNode   = LiteGraph.LGraphNode;

/**
 * This class exposes an intuitive render engine API 
 * for game dev in a ComfyUI node
 */
export class ComfyNode extends LiteGraph.LGraphNode {
  constructor() {
    super()
    if (!this.properties) {
      this.properties = {};
    }
    this.widgets_start_y = 10;
    this.serialize_widgets = true;
    this.isVirtualNode = true;

    this.renderCount = 0;
  }

  /**
   * Implementation of LiteGraph.LGraphNode method
   * @private
   */
  onDrawForeground(ctx) {
    if(this.renderCount == 0) {
      this.renderOnce(ctx)
    }

    this.render(ctx)

    // This animation loop renders frames
    // continuously, not only when mouse moves.
    // It is disabled because after ~4mins it 
    // starts degrading the fps.
    /*
    // animation loop
    const render = () => {
      this.setDirtyCanvas(true, true)
      requestAnimationFrame(render)
    }
    render(ctx)
    */
    this.renderCount++;
  }


  /**
   * Add a button to the ComfyUI node
   */
  addButton(buttonText, callback) {
    this.addWidget("button", buttonText, "image", callback)
  }

  /**
   * Only renders when the user moves their mouse
   */
  render(ctx) {
    // This function renders a single frame. It is called
    // every time you move your mouse
  }

  /**
   * Renders on init
   */
  renderOnce(ctx) {
    // This function renders a single frame when the node 
    // is initialized
  }
}

