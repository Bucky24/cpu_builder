import React, { useState, useEffect, useContext, useRef } from 'react';
import { Canvas, Rect } from '@bucky24/react-canvas';

import styles from './styles.module.css';
import CircuitBoard from './CircuitBoard';
import LayoutContext from './context/LayoutContext';
import useGetComponentAtPoint from './hooks/useGetComponentAtPoint';

export default function App() {
	const [size, setSize] = useState({ width: 0, height: 0 });
	const { takeAction, processItems, selectElement, unselectAll } = useContext(LayoutContext);
	const canvasHolderRef = useRef();
	const getComponentAtPoint = useGetComponentAtPoint();

	const resize = () => {
		if (!canvasHolderRef.current) {
			return;
		}

		const rect = canvasHolderRef.current.getBoundingClientRect();
		
		setSize({
			width: rect.width,
			height: rect.height,
		});
	}

	useEffect(() => {
		window.addEventListener("resize", resize);
		resize();

		return () => {
			window.removeEventListener("resize", resize);
		}
	}, []);

	useEffect(() => {
		resize();
	}, [canvasHolderRef.current]);

	return (<div className={styles.appRoot} style={{
		display: 'flex',
		flexDirection: 'column',
	}}>
		<div>
			<button onClick={processItems}>Step</button>
		</div>
		<div style={{
			flexGrow: 1,
			display: 'flex',
			flexDirection: 'row',
		}}>
			<div ref={canvasHolderRef} style={{
				flexGrow: 1,
			}}>
				<Canvas
					width={size.width}
					height={size.height}
					onMouseUp={({ x, y, button }) => {
						// try to find an element we are clicking on
						const clickedElement = getComponentAtPoint(x, y);

						if (clickedElement) {
							takeAction(clickedElement, "click");
						}
					}}
					onMouseMove={({ x, y }) => {
						const selectedElement = getComponentAtPoint(x, y);

						unselectAll();

						if (selectedElement) {
							selectElement(selectedElement);
						}
					}}
				>
					<Rect x={0} y={0} x2={size.width} y2={size.height} color="#fff" fill={true} />
					<CircuitBoard />
				</Canvas>
			</div>
			<div style={{
				flexShrink: 0,
				flexBasis: 200,
			}}>
				sidebar
			</div>
		</div>
	</div>);
}