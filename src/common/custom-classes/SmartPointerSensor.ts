import {PointerSensor} from '@dnd-kit/core';
import type {PointerEvent} from 'react';

export class SmartPointerSensor extends PointerSensor {
    static activators = [
        {
            eventName: 'onPointerDown' as any,
            handler: ({nativeEvent: event}: PointerEvent) => {
                return !(!event.isPrimary
                    || event.button !== 0
                    || isInteractiveElement(event.target as Element));
            },
        },
    ];
}

function isInteractiveElement(element: Element | null) {
    const interactiveElements = [
        'button',
        'input',
        'textarea',
        'select',
        'option',
    ];

    return !!(element?.tagName && interactiveElements.includes(element.tagName.toLowerCase()));
}