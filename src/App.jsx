import React, { useState, useEffect, useContext } from 'react';
import { Canvas, Rect } from '@bucky24/react-canvas';
import { Polygon } from '@bucky24/toolbox';

import styles from './styles.module.css';
import CircuitBoard from './CircuitBoard';
import LayoutContext from './context/LayoutContext';
import config from './config';

export default function App() {
	const [size, setSize] = useState({ width: 0, height: 0 });
	const { items, takeAction, processItems } = useContext(LayoutContext);

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
		<Canvas
			width={size.width}
			height={size.height}
			onMouseUp={(({ x, y, button }) => {
				// try to find an element we are clicking on
				let clickedElement = null;

				for (const item of items) {
					const itemConfig = config.components[item.type];

					if (!itemConfig) {
						continue;
					}

					const width = itemConfig.width;
					const height = itemConfig.height;
					const ix = item.x;
					const iy = item.y;

					const clicked = Polygon.pointInsidePolygon(
						{x,y},
						[
							{x:ix, y:iy},
							{x:ix+width, y:iy},
							{x:ix+width, y:iy+height},
							{x:ix, y:iy+height},
						],
					);

					if (clicked) {
						clickedElement = item;
						break;
					}
				}

				if (clickedElement) {
					takeAction(clickedElement, "click");
				}
			})}
		>
			<Rect x={0} y={0} x2={size.width} y2={size.height} color="#fff" fill={true} />
			<CircuitBoard />
		</Canvas>
		<div style={{ position: 'absolute', top: 0, left: 0 }}>
			<button onClick={processItems}>Step</button>
		</div>
	</div>);
}