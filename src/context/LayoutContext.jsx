import React, { useState } from 'react';

const LayoutContext = React.createContext({});
export default LayoutContext;

export function LayoutProvider({ children }) {
    const [items, setItems] = useState([
        {
            id: 1,
            type: 'AND_2',
            x: 200,
            y: 200,
            connections: [],
        },
        {
            id: 2,
            type: 'SWITCH',
            x: 100,
            y: 100,
            connections: [[
                { id: 1, input: 0 },
            ]],
        }
    ]);

    const value = {
        items,
        itemsById: items.reduce((obj, item) => {
            return {
                ...obj,
                [item.id]: item,
            };
        }, {}),
    };

    return <LayoutContext.Provider value={value}>
        {children}
    </LayoutContext.Provider>;
}