const assert = require('assert');
const { forEach, map } = require("./index");

// You can use the varible name multible times 
// You will be sure that all test runs and there will log the desc 
// to help you know where is the error occure and the test will continue run
// const test = (desc, fn) => {
//     console.log('-------', desc)
//     try {
//         fn()
//     } catch (err) {
//         console.log(err.message)
//     }

// };

it('the forEach function', () => {
    let sum = 0
    forEach([1, 2, 3], (value) => {
        sum += value;
    })

    assert.strictEqual(sum, 6, 'Expected forEach to sum the array');
})

it('the map function', () => {
    const result = map([1, 2, 3], value => {
        return value * 2;
    })

    assert.deepStrictEqual(result, [2, 4, 6]);
})

