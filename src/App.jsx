import React, { useState, useEffect, useContext } from 'react';
import { Canvas, Image, Line, Rect, Text } from '@bucky24/react-canvas';

import styles from './styles.module.css';
import LayoutContext from './context/LayoutContext';
import config from './config';

export default function App() {
	const [size, setSize] = useState({ width: 0, height: 0 });
	const { items, itemsById } = useContext(LayoutContext);

	const resize = () => {
		setSize({
			width: window.innerWidth,
			height: innerHeight,
		});
	}

	useEffect(() => {
		window.addEventListener("resize", resize);
		resize();

		return () => {
			window.removeEventListener("resize", resize);
		}
	}, []);

	return (<div className={styles.appRoot}>
		<Canvas width={size.width} height={size.height}>
			<Rect x={0} y={0} x2={size.width} y2={size.height} color="#fff" fill={true} />
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

						const toWire = connectsToData.input_wires[connection.input];
						const fromWire = componentData.output_wires[wire];

						allConnections.push(<Line
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
		</Canvas>
	</div>);
}