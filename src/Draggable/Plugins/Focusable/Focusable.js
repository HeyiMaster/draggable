const onInitialize = Symbol('onInitialize');
const onDestroy = Symbol('onDestroy');

const ARIA_GRABBED = 'aria-grabbed';
const ARIA_LABEL = 'aria-label';
const TABINDEX = 'tabindex';

/**
 * Focusable plugin
 * @class Focusable
 * @module Focusable
 */
export default class Focusable {

  /**
   * Focusable constructor.
   * @constructs Focusable
   * @param {Draggable} draggable - Draggable instance
   */
  constructor(draggable) {

    /**
     * Draggable instance
     * @property draggable
     * @type {Draggable}
     */
    this.draggable = draggable;

    /**
     * Draggable elements
     * @property draggableElements
     * @type {HTMLElement[]}
     */
    this.draggableElements = [];

    /**
     * Draggable container elements
     * @property containerElements
     * @type {HTMLElement[]}
     */
    this.containerElements = [...this.draggable.containers];

    this[onInitialize] = this[onInitialize].bind(this);
    this[onDestroy] = this[onDestroy].bind(this);
  }

  /**
   * Attaches listeners to draggable
   */
  attach() {
    this.draggable
      .on('draggable:initialize', this[onInitialize])
      .on('draggable:destroy', this[onDestroy])
      .on('drag:start', onDragStart)
      .on('drag:stop', onDragStop);
  }

  /**
   * Detaches listeners from draggable
   */
  detach() {
    this.draggable
      .off('draggable:initialize', this[onInitialize])
      .off('draggable:destroy', this[onDestroy])
      .off('drag:start', onDragStart)
      .off('drag:stop', onDragStop);
  }

  /**
   * Intialize handler
   * @private
   */
  [onInitialize]() {
    for (const container of this.containerElements) {
      const draggableSelector = this.draggable.options.handle || this.draggable.options.draggable;
      const draggableElements = container.querySelectorAll(draggableSelector);

      this.draggableElements = [
        ...this.draggableElements,
        ...draggableElements,
      ];
    }

    // Can wait until the next best frame is available
    requestAnimationFrame(() => {
      this.draggableElements.forEach(decorateDraggableElement);
      this.containerElements.forEach(decorateContainerElement);
    });
  }

  /**
   * Destroy handler
   * @private
   */
  [onDestroy]() {
    // Can wait until the next best frame is available
    requestAnimationFrame(() => {
      this.draggableElements.forEach(stripElement);
      this.containerElements.forEach(stripElement);
    });
  }
}

/**
 * Drag start handler sets aria-grabbed attribute and focuses on source
 */
function onDragStart({source}) {
  source.setAttribute(ARIA_GRABBED, true);
  setTimeout(() => {
    source.focus();
  }, 0);
}

/**
 * Drag stop handler sets aria-grabbed attribute and focuses on original source
 */
function onDragStop({source, originalSource}) {
  source.setAttribute(ARIA_GRABBED, false);
  setTimeout(() => {
    originalSource.focus();
  }, 0);
}

/**
 * Decorates element with aria and tabindex attribute
 */
function decorateDraggableElement(element) {
  const missingTabindex = !element.getAttribute(TABINDEX);
  const missingAriaLabel = !element.getAttribute(ARIA_LABEL);

  if (missingTabindex) {
    element.setAttribute(`${TABINDEX}-set`, true);
    element.setAttribute(TABINDEX, 0);
  }

  if (missingAriaLabel) {
    element.setAttribute(`${ARIA_LABEL}-set`, true);
    element.setAttribute(ARIA_LABEL, 'Draggable Item');
  }

  element.setAttribute(ARIA_GRABBED, false);
}

/**
 * Decorates container element with aria and tabindex attribute
 */
function decorateContainerElement(element) {
  const missingTabindex = !element.getAttribute(TABINDEX);
  const missingAriaLabel = !element.getAttribute(ARIA_LABEL);

  if (missingTabindex) {
    element.setAttribute(`${TABINDEX}-set`, true);
    element.setAttribute(TABINDEX, 0);
  }

  if (missingAriaLabel) {
    element.setAttribute(`${ARIA_LABEL}-set`, true);
    element.setAttribute(ARIA_LABEL, 'Container with draggable items');
  }
}

/**
 * Removes elements aria and tabindex attributes
 */
function stripElement(element) {
  const tabindexSet = Boolean(element.getAttribute(`${TABINDEX}-set`));
  const arialLabelSet = Boolean(element.getAttribute(`${ARIA_LABEL}-set`));

  if (arialLabelSet) {
    element.removeAttribute(ARIA_LABEL);
    element.removeAttribute(`${ARIA_LABEL}-set`);
  }

  if (tabindexSet) {
    element.removeAttribute(TABINDEX);
    element.removeAttribute(`${TABINDEX}-set`);
  }

  element.removeAttribute(ARIA_GRABBED);
}
