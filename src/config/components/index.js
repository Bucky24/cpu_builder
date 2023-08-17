import and_2 from './and_2.json';
import Switch from './switch.json';

const components = [and_2, Switch];

const resultObj = components.reduce((obj, component) => {
    return {
        ...obj,
        [component.name]: component,
    };
}, {});

export default resultObj;