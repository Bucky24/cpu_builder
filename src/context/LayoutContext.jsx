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
            connections: [[
                { id: 2, output: 0 },
            ], []],
            processed: false,
            variables: {},
            inputs: [],
            outputs: [],
        },
        {
            id: 2,
            type: 'SWITCH',
            x: 100,
            y: 100,
            connections: [],
            processed: false,
            variables: {},
            inputs: [],
            outputs: [],
        }
    ]);

    const processItem = () => {

    }

    const processItems = () => {

    }

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