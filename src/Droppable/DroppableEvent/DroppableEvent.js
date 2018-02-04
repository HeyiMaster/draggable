import AbstractEvent from 'shared/AbstractEvent';

/**
 * Base droppable event
 * @class DroppableEvent
 * @module DroppableEvent
 * @extends AbstractEvent
 */
export class DroppableEvent extends AbstractEvent {
  static type = 'droppable';

  /**
   * Original drag event that triggered this droppable event
   * @property dragEvent
   * @type {DragEvent}
   * @readonly
   */
  get dragEvent() {
    return this.data.dragEvent;
  }
}

/**
 * Droppable start event
 * @class DroppableStartEvent
 * @module DroppableStartEvent
 * @extends DroppableEvent
 */
export class DroppableStartEvent extends DroppableEvent {
  static type = 'droppable:start';
  static cancelable = true;

  /**
   * The initial droppable element of the currently dragging draggable element
   * @property droppable
   * @type {HTMLElement}
   * @readonly
   */
  get droppable() {
    return this.data.droppable;
  }
}

/**
 * Droppable dropped event
 * @class DroppableDroppedEvent
 * @module DroppableDroppedEvent
 * @extends DroppableEvent
 */
export class DroppableDroppedEvent extends DroppableEvent {
  static type = 'droppable:dropped';
  static cancelable = true;

  /**
   * The droppable element you dropped the draggable element into
   * @property droppable
   * @type {HTMLElement}
   * @readonly
   */
  get droppable() {
    return this.data.droppable;
  }
}

/**
 * Droppable released event
 * @class DroppableReleasedEvent
 * @module DroppableReleasedEvent
 * @extends DroppableEvent
 */
export class DroppableReleasedEvent extends DroppableEvent {
  static type = 'droppable:released';
  static cancelable = true;

  /**
   * The droppable element you released the draggable element from
   * @property droppable
   * @type {HTMLElement}
   * @readonly
   */
  get droppable() {
    return this.data.droppable;
  }
}

/**
 * Droppable stop event
 * @class DroppableStopEvent
 * @module DroppableStopEvent
 * @extends DroppableEvent
 */
export class DroppableStopEvent extends DroppableEvent {
  static type = 'droppable:stop';
  static cancelable = true;

  /**
   * The final droppable element of the draggable element
   * @property droppable
   * @type {HTMLElement}
   * @readonly
   */
  get droppable() {
    return this.data.droppable;
  }
}
