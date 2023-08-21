export default function processOperation(operation, inputs) {
    //console.log(operation, inputs);

    const charsOfInterest = ['&', '$'];
    const charsToIgnore = [' '];

    const tokens = [];
    let buffer = '';
    for (const char of operation) {
        if (charsToIgnore.includes(char)) {
            continue;
        }

        if (charsOfInterest.includes(char)) {
            tokens.push(buffer);
            tokens.push(char);
            buffer = '';
        } else {
            buffer += char;
        }
    }

    tokens.push(buffer);

    const fullTokens = tokens.filter((item) => {
        return item !== '';
    });

    let doOperation = null;
    const handleOperation = (value) => {
        if (doOperation === "and") {
            accumulator = accumulator && value;
        } else {
            throw new Error("Unknown operation " + doOperation);
        }
    }

    let state = 'initial';
    let accumulator = 0;
    for (const token of fullTokens) {
        if (state === 'initial') {
            switch (token) {
                case '$':
                    state = 'initial_variable';
                    continue;
            }
        } else if (state === 'initial_variable') {
            if (inputs[token] === undefined) {
                throw new Error("Expected variable " + token + ", got " + JSON.stringify(inputs));
            }

            accumulator = inputs[token];
            state = "accum_set";
            continue;
        } else if (state === "accum_set") {
            switch (token) {
                case '&':
                    state = 'operation';
                    doOperation = 'and';
                    continue;
            }
        } else if (state === 'operation') {
            switch (token) {
                case '$':
                    state = 'operation_variable';
                    continue;
                case '1':
                    handleOperation(1);
                    continue;
            }
        } else if (state === 'operation_variable') {
            if (inputs[token] === undefined) {
                throw new Error("Expected variable " + token);
            }

            handleOperation(inputs[token]);
            state = "accum_set";
            continue;
        }

        throw new Error("Unexpected token " + token + " (" + state + ")");
    }

    return accumulator;
}