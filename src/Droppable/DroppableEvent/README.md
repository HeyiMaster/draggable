## DroppableEvent

The base droppable event for all Droppable events that `Droppable` emits.

| | |
| --------------------- | ---------------------------------------------------------- |
| **Interface**         | `DroppableEvent`                                           |
| **Cancelable**        | false                                                      |
| **Cancel action**     | -                                                          |
| **type**              | `droppable`                                                |

### API

**`droppableEvent.dragEvent: DragEvent`**  
Read-only property for the original drag event that triggered the droppable event.

## DroppableStartEvent

`DroppableStartEvent` gets triggered by `Droppable` before dropping the draggable element into a droppable element.

| | |
| --------------------- | ---------------------------------------------------------- |
| **Specification**     | `DroppableEvent`                                           |
| **Interface**         | `DroppableStartEvent`                                      |
| **Cancelable**        | true                                                       |
| **Cancel action**     | Prevents drag                                              |
| **type**              | `droppable:start`                                          |

### API

**`droppableEvent.droppable: HTMLElement`**  
Read-only property for the initial droppable element of the currently dragging draggable element

## DroppableDroppedEvent

`DroppableDroppedEvent` gets triggered by `Droppable` before dropping the draggable element into a droppable element.

| | |
| --------------------- | ---------------------------------------------------------- |
| **Specification**     | `DroppableEvent`                                           |
| **Interface**         | `DroppableDroppedEvent`                                    |
| **Cancelable**        | true                                                       |
| **Cancel action**     | Prevents drop                                              |
| **type**              | `droppable:dropped`                                        |

### API

**`droppableEvent.droppable: HTMLElement`**  
Read-only property for the droppable element you dropped the draggable element into

## DroppableReleasedEvent

`DroppableReleasedEvent` gets triggered by `Droppable` before moving the draggable element to its original position.

| | |
| --------------------- | ---------------------------------------------------------- |
| **Specification**     | `DroppableEvent`                                           |
| **Interface**         | `DroppableReleasedEvent`                                   |
| **Cancelable**        | true                                                       |
| **Cancel action**     | Prevents release                                           |
| **type**              | `droppable:released`                                       |

### API

**`droppableEvent.droppable: HTMLElement`**  
Read-only property for the droppable element you released the draggable element from

## DroppableStopEvent

`DroppableStopEvent` gets triggered by `Droppable` before dropping the draggable element into a droppable element.

| | |
| --------------------- | ---------------------------------------------------------- |
| **Specification**     | `DroppableEvent`                                           |
| **Interface**         | `DroppableStopEvent`                                       |
| **Cancelable**        | false                                                      |
| **Cancel action**     | -                                                          |
| **type**              | `droppable:start`                                          |

### API

**`droppableEvent.droppable: HTMLElement`**  
Read-only property for the final droppable element of the draggable element
