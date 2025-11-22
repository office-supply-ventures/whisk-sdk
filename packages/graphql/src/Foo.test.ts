import { foo } from './Foo.js'

describe('foo', () => {
  test('default', () => {
    expect(foo()).toBe('Hello, foo!')
  })
})
