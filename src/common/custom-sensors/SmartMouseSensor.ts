import {MouseSensor} from '@dnd-kit/core';
import type {MouseEvent} from 'react';

export class SmartMouseSensor extends MouseSensor {
    static activators = [
        {
            eventName: 'onMouseDown' as const,
            handler: ({nativeEvent: event}: MouseEvent) => {
                return event.button !== 0 || shouldHandleEvent(event.target as HTMLElement);
            },
        },
    ];
}

export function shouldHandleEvent(element: HTMLElement | null) {
    let cur = element;

    while (cur) {
        if (cur.dataset && cur.dataset.noDnd) {
            return false;
        }
        cur = cur.parentElement;
    }

    return true;
}