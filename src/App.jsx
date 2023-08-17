import React, { useState, useEffect } from 'react';
import { Canvas, Rect } from '@bucky24/react-canvas';

import styles from './styles.module.css';
import CircuitBoard from './CircuitBoard';

export default function App() {
	const [size, setSize] = useState({ width: 0, height: 0 });

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
			<CircuitBoard />
		</Canvas>
	</div>);
}