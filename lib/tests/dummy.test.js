import { sum } from '../../client/dummy'
//const sum = require('../../client/dummy').default

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3)
})