import { foo } from "./Foo.js"

describe("foo", () => {
  test("default02", () => {
    expect(foo()).toBe("Hello, foo!")
  })
})
