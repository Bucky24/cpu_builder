import { Image, Line, Rect } from "@bucky24/react-canvas";
import { useContext } from "react";

import LayoutContext from "./context/LayoutContext";
import config from './config';

export default function CircuitBoard() {
	const { items, itemsById } = useContext(LayoutContext);

    return <>
        {items.map((item, index) => {
            const componentData = config.components[item.type];
            if (!componentData) {
                return null;
            }
            return <Image
                key={`item_${index}`}
                src={componentData.image}
                width={componentData.width}
                height={componentData.height}
                x={item.x}
                y={item.y}
            />
        })}

        {items.map((item, index) => {
            const componentData = config.components[item.type];
            if (!componentData) {
                return null;
            }

            return componentData.input_wires.map(({ x, y }, index2) => {
                return <Rect
                    key={`item_${index}_input_${index2}`}
                    x={item.x + x - 5}
                    y={item.y + y - 5}
                    x2={item.x + x + 5}
                    y2={item.y + y + 5}
                    color="#f00"
                    fill={true}
                />;
            });
        })}

        {items.map((item, index) => {
            const componentData = config.components[item.type];
            if (!componentData) {
                return null;
            }

            return componentData.output_wires.map(({ x, y }, index2) => {
                return <Rect
                    key={`item_${index}_output_${index2}`}
                    x={item.x + x - 5}
                    y={item.y + y - 5}
                    x2={item.x + x + 5}
                    y2={item.y + y + 5}
                    color="#0f0"
                    fill={true}
                />;
            });
        })}

        {items.map((item, index) => {
            const componentData = config.components[item.type];
            if (!componentData) {
                return null;
            }

            const allConnections = [];

            for (let wire=0;wire<item.connections.length;wire++) {
                for (const connection of item.connections[wire]) {
                    const connectsTo = itemsById[connection.id];

                    if (!connectsTo) {
                        continue;
                    }

                    const connectsToData = config.components[connectsTo.type];

                    if (!connectsToData) {
                        continue;
                    }

                    const toWire = connectsToData.output_wires[connection.output];
                    const fromWire = componentData.input_wires[wire];

                    allConnections.push(<Line
                        key={`from_${index}_${wire}_to_${connection.id}_${connection.input}`}
                        x={fromWire.x + item.x}
                        y={fromWire.y + item.y}
                        x2={toWire.x + connectsTo.x}
                        y2={toWire.y + connectsTo.y}
                        color="#000"
                    />);
                }
            }

            return allConnections;
        })}
    </>;
}