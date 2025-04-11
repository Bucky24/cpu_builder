import React, { useEffect, useRef } from 'react';

import config from '../config';
import processOperation from '../../utils/processOperation';
import useRender from '../hooks/useRender';

const LayoutContext = React.createContext({});
export default LayoutContext;

export function LayoutProvider({ children }) {
    const render = useRender();
    const itemsRef = useRef([
        {
            id: 1,
            type: 'AND_2',
            x: 200,
            y: 200,
            connections: [{ id: 2, output: 0 }, {id: 3, output: 0}],
            variables: {},
            inputs: [0,0],
            outputs: [0],
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
            outputs: [0],
        },
        {
            id: 3,
            type: 'SWITCH',
            x: 100,
            y: 300,
            connections: [],
            variables: {
                on: 0,
            },
            inputs: [],
            outputs: [0],
        },
    ]);

    const processItems = () => {
        // go through every single item and process them one at a time.
        // use the previous input value to calculate outputs.
        // then go through each item again and update the input values from the
        // connected outputs

        for (const item of itemsRef.current) {
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

        const itemsById = itemsRef.current.reduce((obj, item) => {
            return {
                ...obj,
                [item.id]: item,
            };
        }, {});

        for (const item of itemsRef.current) {
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

                //console.log("setting input ", i, "to ", result);

                item.inputs[i] = result;
            }
        }

        render();
    }

    const selectItem = (itemId) => {
        for (const item of itemsRef.current) {
            item.selected = item.id == itemId;
        }
        render();
    }

    const takeAction = (item, action) => {
        const itemData = config.components[item.type];

        if (!itemData) {
            return;
        }

        const actionData = itemData.actions?.[action]
        if (!actionData) {
            return;
        }

        switch (actionData.type) {
            case "toggle_variable":
                const varName = actionData.variable;
                let value = item.variables[varName];
                if (!value) {
                    value = 0;
                }

                if (value == 0) value = 1;
                else value = 0;

                item.variables[varName] = value;
                break;
            default:
                console.error("Unknown action type " + actionData.type);
                return;
        }

        processItems();
    }

    useEffect(() => {
        processItems();
    }, []);

    const value = {
        items: itemsRef.current,
        itemsById: itemsRef.current.reduce((obj, item) => {
            return {
                ...obj,
                [item.id]: item,
            };
        }, {}),
        takeAction,
        processItems,
        selectItem: (item) => {
            selectItem(item);
            render();
        },
        unselectAll: () => {
            itemsRef.current.map((item) => {
                item.selected = false;
            });
            render();
        },
    };

    return <LayoutContext.Provider value={value}>
        {children}
    </LayoutContext.Provider>;
}