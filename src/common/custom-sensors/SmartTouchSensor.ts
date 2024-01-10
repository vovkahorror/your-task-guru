import {TouchSensor} from '@dnd-kit/core';
import type {TouchEvent} from 'react';
import {shouldHandleEvent} from './SmartMouseSensor';

export class SmartTouchSensor extends TouchSensor {
    static activators = [
        {
            eventName: 'onTouchStart' as const,
            handler: ({nativeEvent: event}: TouchEvent) => {
                return shouldHandleEvent(event.target as HTMLElement);
            },
        },
    ];
}