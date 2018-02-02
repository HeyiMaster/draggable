import AbstractPlugin from 'shared/AbstractPlugin';

const onDragOver = Symbol('onDragOver');

/**
 * ResizeMirror default options
 * @property {Object} defaultOptions
 * @property {Number} defaultOptions.duration
 * @property {String} defaultOptions.easingFunction
 * @type {Object}
 */
export const defaultOptions = {
  duration: 150,
  easingFunction: 'ease-in-out',
};

/**
 * ResizeMirror plugin resizes the mirror element based on the draggable elements it's hovering over
 * @class ResizeMirror
 * @module ResizeMirror
 * @extends AbstractPlugin
 */
export default class ResizeMirror extends AbstractPlugin {

  /**
   * ResizeMirror constructor.
   * @constructs ResizeMirror
   * @param {Draggable} draggable - Draggable instance
   */
  constructor(draggable) {
    super(draggable);

    /**
     * ResizeMirror options
     * @property {Object} options
     * @property {Number} defaultOptions.duration
     * @property {String} defaultOptions.easingFunction
     * @type {Object}
     */
    this.options = {
      ...defaultOptions,
      ...this.getOptions(),
    };

    this[onDragOver] = this[onDragOver].bind(this);
  }

  /**
   * Attaches plugins event listeners
   */
  attach() {
    this.draggable
      .on('drag:over', this[onDragOver])
      .on('drag:over:container', this[onDragOver]);
  }

  /**
   * Detaches plugins event listeners
   */
  detach() {
    this.draggable
      .off('drag:over', this[onDragOver])
      .off('drag:over:container', this[onDragOver]);
  }

  /**
   * Returns options passed through draggable
   * @return {Object}
   */
  getOptions() {
    return this.draggable.options.resizeMirror || {};
  }

  /**
   * Drag over handler
   * @param {DragOverEvent} dragEvent
   * @private
   */
  [onDragOver](dragEvent) {
    requestAnimationFrame(animateResize({
      dragEvent,
      draggableSelector: this.draggable.options.draggable,
      originalSourceClassName: this.draggable.getClassNameFor('source:original'),
      options: this.options,
    }));
  }
}

function animateResize({dragEvent, draggableSelector, originalSourceClassName, options}) {
  return () => {
    const overElement = dragEvent.over || dragEvent.overContainer.querySelector(`${draggableSelector}:not(.${originalSourceClassName})`);

    if (overElement) {
      dragEvent.overContainer.appendChild(dragEvent.mirror);
      const overRect = overElement.getBoundingClientRect();

      dragEvent.mirror.style.width = `${overRect.width}px`;
      dragEvent.mirror.style.height = `${overRect.height}px`;
      dragEvent.mirror.style.transition = `width ${options.duration}ms ${options.easingFunction},` +
                                     `height ${options.duration}ms ${options.easingFunction}`;

      setTimeout(() => {
        dragEvent.mirror.style.transition = '';
      }, options.duration);
    } else {
      // Figure out how to compute dimensions when no over or container element has been found
    }
  };
}
