import React, { useEffect, useState } from 'react';

import config from '../config';
import processOperation from '../../utils/processOperation';

const LayoutContext = React.createContext({});
export default LayoutContext;

export function LayoutProvider({ children }) {
    const [items, setItems] = useState([
        {
            id: 1,
            type: 'AND_2',
            x: 200,
            y: 200,
            connections: [{ id: 2, output: 0 }, null],
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
            variables: {
                on: 0,
            },
            inputs: [],
            outputs: [],
        }
    ]);

    const processItems = () => {
        // go through every single item and process them one at a time.
        // use the previous input value to calculate outputs.
        // then go through each item again and update the input values from the
        // connected outputs

        for (const item of items) {
            const componentData = config.components[item.type];

            if (!componentData) {
                continue;
            }

            // build input data
            const inputData = {};
            for (let i=0;i<componentData.input_wires.length;i++) {
                // if we have no input already for this wire, set it to 0
                if (item.inputs.length < i+1) {
                    inputData[i] = 0;
                } else {
                    inputData[i] = item.inputs[i];
                }
            }

            const allData = {
                ...item.variables,
                ...inputData,
            }

            // process operations and build outputs
            for (let i=0;i<componentData.operations.length;i++) {
                const result = processOperation(componentData.operations[i], allData);
                item.outputs[i] = result;
            }
        }

        const itemsById = items.reduce((obj, item) => {
            return {
                ...obj,
                [item.id]: item,
            };
        }, {});

        for (const item of items) {
            // pull input data from freshly computed items
            for (let i=0;i<item.connections.length;i++) {
                if (!item.connections[i]) {
                    continue;
                }
                const outputItem = itemsById[item.connections[i].id];
                let result = 0;
                if (outputItem) {
                    result = outputItem.outputs[item.connections[i].output];
                }

                item.inputs[i] = result;
            }
        }

        setItems([...items]);
    }

    useEffect(() => {
        processItems();
    }, []);

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