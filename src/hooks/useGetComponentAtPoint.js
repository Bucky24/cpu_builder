import { useContext } from "react";
import { Polygon } from '@bucky24/toolbox';

import LayoutContext from "../context/LayoutContext";
import config from '../config';

export default function useGetComponentAtPoint() {
	const { items } = useContext(LayoutContext);

    return (x, y) => {
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

        return clickedElement;
    }
}