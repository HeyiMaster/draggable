import AbstractPlugin from 'shared/AbstractPlugin';

const onInitialize = Symbol('onInitialize');
const onDestroy = Symbol('onDestroy');
const decorateElements = Symbol('decorateElements');
const stripElements = Symbol('stripElements');

const ARIA_GRABBED = 'aria-grabbed';
const ARIA_LABEL = 'aria-label';
const ARIA_LABELLED_BY = 'aria-labelledby';
const TABINDEX = 'tabindex';
const ROLE = 'role';

/**
 * Focusable default options
 * @property {Object} defaultOptions
 * @property {String} defaultOptions.draggableRole
 * @property {String} defaultOptions.containerRole
 * @property {String} defaultOptions.logLevel
 * @type {Object}
 */
const defaultOptions = {
  draggableRole: 'gridcell',
  containerRole: 'grid',
  logLevel: 'warn',
};

/**
 * Focusable plugin
 * @class Focusable
 * @module Focusable
 * @extends AbstractPlugin
 */
export default class Focusable extends AbstractPlugin {

  /**
   * Focusable constructor.
   * @constructs Focusable
   * @param {Draggable} draggable - Draggable instance
   */
  constructor(draggable) {
    super(draggable);

    /**
     * Focusable options
     * @property {Object} options
     * @property {String} options.draggableRole
     * @property {String} options.containerRole
     * @property {String|null} options.logLevel
     * @type {Object}
     */
    this.options = {
      ...defaultOptions,
      ...this.getOptions(),
    };

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
    this[decorateElements] = this[decorateElements].bind(this);
    this[stripElements] = this[stripElements].bind(this);
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
   * Returns options passed through draggable
   * @return {Object}
   */
  getOptions() {
    return this.draggable.options.focusable || {};
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
    requestAnimationFrame(this[decorateElements]);
  }

  /**
   * Destroy handler
   * @private
   */
  [onDestroy]() {
    // Can wait until the next best frame is available
    requestAnimationFrame(this[stripElements]);
  }

  [decorateElements]() {
    const elements = [
      ...this.draggableElements.map((element) => decorateElement(element, {role: this.options.draggableRole})),
      ...this.containerElements.map((element) => decorateElement(element, {role: this.options.containerRole})),
    ];

    const elementsWithMissingAriaLabel = elements.filter((element) => element.hasMissingAriaLabel);
    const hasElementsWithMissingAriaLabel = (elementsWithMissingAriaLabel.length !== 0);
    const logger = console[this.options.logLevel]; // eslint-disable-line no-console

    if (hasElementsWithMissingAriaLabel && logger) {
      logger(
        '[Draggable] The following elements are missing an aria-label or aria-labelledby attribute.' +
        'This is just a reminder from draggable making sure you build an accessible' +
        'experience. To turn this message of, a',
        elementsWithMissingAriaLabel,
      );
    }
  }

  [stripElements]() {
    this.draggableElements.forEach((element) => stripElement(element));
    this.containerElements.forEach((element) => stripElement(element));
  }
}

/**
 * Drag start handler sets aria-grabbed attribute and focuses on source
 * @param {DragStartEvent} dragStartEvent
 */
function onDragStart({source}) {
  source.setAttribute(ARIA_GRABBED, true);
  setTimeout(() => source.focus(), 0);
}

/**
 * Drag stop handler sets aria-grabbed attribute and focuses on original source
 * @param {DragStopEvent} dragStopEvent
 */
function onDragStop({source, originalSource}) {
  source.setAttribute(ARIA_GRABBED, false);
  setTimeout(() => originalSource.focus(), 0);
}

/**
 * Keeps track of all the elements that are missing tabindex attributes
 * so they can be reset when draggable gets destroyed
 * @const {HTMLElement[]} elementsWithMissingTabIndex
 */
const elementsWithMissingTabIndex = [];

/**
 * Keeps track of all the elements that are missing role attributes
 * so they can be reset when draggable gets destroyed
 * @const {HTMLElement[]} elementsWithMissingRole
 */
const elementsWithMissingRole = [];

/**
 * Decorates element with tabindex and role attributes
 * @param {HTMLElement} element
 * @return {Object}
 * @private
 */
function decorateElement(element, {role}) {
  const hasMissingTabIndex = !element.getAttribute(TABINDEX);
  const hasMissingAriaLabel = !element.getAttribute(ARIA_LABEL) || !element.getAttribute(ARIA_LABELLED_BY);
  const hasMissingRole = !element.getAttribute(ROLE);

  if (hasMissingTabIndex) {
    elementsWithMissingTabIndex.push(element);
    element.setAttribute(TABINDEX, 0);
  }

  if (hasMissingRole) {
    elementsWithMissingRole.push(element);
    element.setAttribute(ROLE, role);
  }

  element.setAttribute(ARIA_GRABBED, false);

  return {
    hasMissingAriaLabel,
    element,
  };
}

/**
 * Removes elements aria, tabindex and role attributes
 * @param {HTMLElement} element
 * @private
 */
function stripElement(element) {
  const tabIndexElementPosition = elementsWithMissingTabIndex.indexOf(element);
  const roleElementPosition = elementsWithMissingRole.indexOf(element);

  if (tabIndexElementPosition !== -1) {
    element.removeAttribute(TABINDEX);
    elementsWithMissingTabIndex.splice(tabIndexElementPosition, 1);
  }

  if (roleElementPosition !== -1) {
    element.removeAttribute(ROLE);
    elementsWithMissingRole.splice(roleElementPosition, 1);
  }

  element.removeAttribute(ARIA_GRABBED);
}
