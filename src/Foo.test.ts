import { Foo } from 'whisk-sdk'

describe('foo', () => {
  test('default', () => {
    expect(Foo.foo()).toBe('Hello, foo!')
  })
})
