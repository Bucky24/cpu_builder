export default function processOperation(operation, inputs) {
    console.log(operation, inputs);

    const charsOfInterest = ['&', '$'];
    const charsToIgnore = [' '];

    const tokens = [];
    let buffer = '';
    for (const char of operation) {
        if (charsToIgnore.includes(char)) {
            continue;
        }

        if (char === charsOfInterest) {
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

    
}