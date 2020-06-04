# is_type ![ci](https://github.com/rjoydip/is_type/workflows/ci/badge.svg)

> Type check values

For example, `is.string('🦄') //=> true`

## Highlights

- Written in TypeScript
- [Extensive use of type guards](#type-guards)
- [Supports type assertions](#type-assertions)
- [Aware of generic type parameters](#generic-type-parameters) (use with caution)

## Usage

```ts
import is from "deno.land/x/is_type/mod.ts";

is('🦄');
//=> 'string'

is(new Map());
//=> 'Map'

is.number(6);
//=> true
```

[Assertions](#type-assertions) perform the same type checks, but throw an error if the type does not match.

```ts
import {assert} from "deno.land/x/is_type/mod.ts";

assert.string(2);
//=> Error: Expected value which is `string`, received value of type `number`.
```

And with TypeScript:

```ts
import {assert} from "deno.land/x/is_type/mod.ts";

assert.string(foo);
// `foo` is now typed as a `string`.
```

## API

### is(value)

Returns the type of `value`.

Primitives are lowercase and object types are camelcase.

Example:

- `'undefined'`
- `'null'`
- `'string'`
- `'symbol'`
- `'Array'`
- `'Function'`
- `'Object'`

Note: It will throw an error if you try to feed it object-wrapped primitives, as that's a bad practice. For example `new String('foo')`.

### is.{method}

All the below methods accept a value and returns a boolean for whether the value is of the desired type.

#### Primitives

##### .undefined(value)

##### .null(value)

##### .string(value)

##### .number(value)

Note: `is.number(NaN)` returns `false`. This intentionally deviates from `typeof` behavior to increase user-friendliness of `is` type checks.

##### .boolean(value)

##### .symbol(value)

##### .bigint(value)

#### Built-in types

##### .array(value)

##### .function(value)

##### .buffer(value) [`not yet support`]

##### .object(value)

Keep in mind that [functions are objects too](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions).

##### .numericString(value)

Returns `true` for a string that represents a number satisfying `is.number`, for example, `'42'` and `'-8.3'`.

Note: `'NaN'` returns `false`, but `'Infinity'` and `'-Infinity'` return `true`.

##### .regExp(value)

##### .date(value)

##### .error(value)

##### .nativePromise(value)

##### .promise(value)

Returns `true` for any object with a `.then()` and `.catch()` method. Prefer this one over `.nativePromise()` as you usually want to allow userland promise implementations too.

##### .generator(value)

Returns `true` for any object that implements its own `.next()` and `.throw()` methods and has a function definition for `Symbol.iterator`.

##### .generatorFunction(value)

##### .asyncFunction(value)

Returns `true` for any `async` function that can be called with the `await` operator.

```ts
is.asyncFunction(async () => {});
//=> true

is.asyncFunction(() => {});
//=> false
```

##### .asyncGenerator(value)

```ts
is.asyncGenerator(
 (async function * () {
  yield 4;
 })()
);
//=> true

is.asyncGenerator(
 (function * () {
  yield 4;
 })()
);
//=> false
```

##### .asyncGeneratorFunction(value)

```ts
is.asyncGeneratorFunction(async function * () {
 yield 4;
});
//=> true

is.asyncGeneratorFunction(function * () {
 yield 4;
});
//=> false
```

##### .boundFunction(value)

Returns `true` for any `bound` function.

```ts
is.boundFunction(() => {});
//=> true

is.boundFunction(function () {}.bind(null));
//=> true

is.boundFunction(function () {});
//=> false
```

##### .map(value)

##### .set(value)

##### .weakMap(value)

##### .weakSet(value)

#### Typed arrays

##### .int8Array(value)

##### .uint8Array(value)

##### .uint8ClampedArray(value)

##### .int16Array(value)

##### .uint16Array(value)

##### .int32Array(value)

##### .uint32Array(value)

##### .float32Array(value)

##### .float64Array(value)

##### .bigInt64Array(value)

##### .bigUint64Array(value)

#### Structured data

##### .arrayBuffer(value)

##### .sharedArrayBuffer(value)

##### .dataView(value)

#### Emptiness

##### .emptyString(value)

Returns `true` if the value is a `string` and the `.length` is 0.

##### .nonEmptyString(value)

Returns `true` if the value is a `string` and the `.length` is more than 0.

##### .emptyStringOrWhitespace(value)

Returns `true` if `is.emptyString(value)` or if it's a `string` that is all whitespace.

##### .emptyArray(value)

Returns `true` if the value is an `Array` and the `.length` is 0.

##### .nonEmptyArray(value)

Returns `true` if the value is an `Array` and the `.length` is more than 0.

##### .emptyObject(value)

Returns `true` if the value is an `Object` and `Object.keys(value).length` is 0.

Please note that `Object.keys` returns only own enumerable properties. Hence something like this can happen:

```ts
const object1 = {};

Object.defineProperty(object1, 'property1', {
 value: 42,
 writable: true,
 enumerable: false,
 configurable: true
});

is.emptyObject(object1);
//=> true
```

##### .nonEmptyObject(value)

Returns `true` if the value is an `Object` and `Object.keys(value).length` is more than 0.

##### .emptySet(value)

Returns `true` if the value is a `Set` and the `.size` is 0.

##### .nonEmptySet(Value)

Returns `true` if the value is a `Set` and the `.size` is more than 0.

##### .emptyMap(value)

Returns `true` if the value is a `Map` and the `.size` is 0.

##### .nonEmptyMap(value)

Returns `true` if the value is a `Map` and the `.size` is more than 0.

#### Miscellaneous

##### .directInstanceOf(value, class)

Returns `true` if `value` is a direct instance of `class`.

```ts
is.directInstanceOf(new Error(), Error);
//=> true

class UnicornError extends Error {}

is.directInstanceOf(new UnicornError(), Error);
//=> false
```

##### .urlInstance(value)

Returns `true` if `value` is an instance of the [`URL` class](https://developer.mozilla.org/en-US/docs/Web/API/URL).

```ts
const url = new URL('https://example.com');

is.urlInstance(url);
//=> true
```

##### .urlString(value)

Returns `true` if `value` is a URL string.

Note: this only does basic checking using the [`URL` class](https://developer.mozilla.org/en-US/docs/Web/API/URL) constructor.

```ts
const url = 'https://example.com';

is.urlString(url);
//=> true

is.urlString(new URL(url));
//=> false
```

##### .truthy(value)

Returns `true` for all values that evaluate to true in a boolean context:

```ts
is.truthy('🦄');
//=> true

is.truthy(undefined);
//=> false
```

##### .falsy(value)

Returns `true` if `value` is one of: `false`, `0`, `''`, `null`, `undefined`, `NaN`.

##### .nan(value)

##### .nullOrUndefined(value)

##### .primitive(value)

JavaScript primitives are as follows: `null`, `undefined`, `string`, `number`, `boolean`, `symbol`.

##### .integer(value)

##### .safeInteger(value)

Returns `true` if `value` is a [safe integer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isSafeInteger).

##### .plainObject(value)

An object is plain if it's created by either `{}`, `new Object()`, or `Object.create(null)`.

##### .iterable(value)

##### .asyncIterable(value)

##### .class(value)

Returns `true` for instances created by a class.

##### .typedArray(value)

##### .arrayLike(value)

A `value` is array-like if it is not a function and has a `value.length` that is a safe integer greater than or equal to 0.

```ts
is.arrayLike(document.forms);
//=> true

function foo() {
 is.arrayLike(arguments);
 //=> true
}
foo();
```

##### .inRange(value, range)

Check if `value` (number) is in the given `range`. The range is an array of two values, lower bound and upper bound, in no specific order.

```ts
is.inRange(3, [0, 5]);
is.inRange(3, [5, 0]);
is.inRange(0, [-2, 2]);
```

##### .inRange(value, upperBound)

Check if `value` (number) is in the range of `0` to `upperBound`.

```ts
is.inRange(3, 10);
```

##### .infinite(value)

Check if `value` is `Infinity` or `-Infinity`.

##### .evenInteger(value)

Returns `true` if `value` is an even integer.

##### .oddInteger(value)

Returns `true` if `value` is an odd integer.

##### .any(predicate | predicate[], ...values)

Using a single `predicate` argument, returns `true` if **any** of the input `values` returns true in the `predicate`:

```ts
is.any(is.string, {}, true, '🦄');
//=> true

is.any(is.boolean, 'unicorns', [], new Map());
//=> false
```

Using an array of `predicate[]`, returns `true` if **any** of the input `values` returns true for **any** of the `predicates` provided in an array:

```ts
is.any([is.string, is.number], {}, true, '🦄');
//=> true

is.any([is.boolean, is.number], 'unicorns', [], new Map());
//=> false
```

##### .all(predicate, ...values)

Returns `true` if **all** of the input `values` returns true in the `predicate`:

```ts
is.all(is.object, {}, new Map(), new Set());
//=> true

is.all(is.string, '🦄', [], 'unicorns');
//=> false
```

## Type guards

When using `is` together with TypeScript, [type guards](http://www.typescriptlang.org/docs/handbook/advanced-types.html#type-guards-and-differentiating-types) are being used extensively to infer the correct type inside if-else statements.

```ts
import is from "deno.land/x/is_type/mod.ts";

const padLeft = (value: string, padding: string | number) => {
 if (is.number(padding)) {
  // `padding` is typed as `number`
  return Array(padding + 1).join(' ') + value;
 }

 if (is.string(padding)) {
  // `padding` is typed as `string`
  return padding + value;
 }

 throw new TypeError(`Expected 'padding' to be of type 'string' or 'number', got '${is(padding)}'.`);
}

padLeft('🦄', 3);
//=> '   🦄'

padLeft('🦄', '🌈');
//=> '🌈🦄'
```

## Type assertions

The type guards are also available as [type assertions](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#assertion-functions), which throw an error for unexpected types. It is a convenient one-line version of the often repetitive "if-not-expected-type-throw" pattern.

```ts
import {assert} from "deno.land/x/is_type/mod.ts";

const handleMovieRatingApiResponse = (response: unknown) => {
 assert.plainObject(response);
 // `response` is now typed as a plain `object` with `unknown` properties.

 assert.number(response.rating);
 // `response.rating` is now typed as a `number`.

 assert.string(response.title);
 // `response.title` is now typed as a `string`.

 return `${response.title} (${response.rating * 10})`;
};

handleMovieRatingApiResponse({rating: 0.87, title: 'The Matrix'});
//=> 'The Matrix (8.7)'

// This throws an error.
handleMovieRatingApiResponse({rating: '🦄'});
```

## Generic type parameters

The type guards and type assertions are aware of [generic type parameters](https://www.typescriptlang.org/docs/handbook/generics.html), such as `Promise<T>` and `Map<Key, Value>`. The default is `unknown` for most cases, since `is` cannot check them at runtime. If the generic type is known at compile-time, either implicitly (inferred) or explicitly (provided), `is` propagates the type so it can be used later.

Use generic type parameters with caution. They are only checked by the TypeScript compiler, and not checked by `is` at runtime. This can lead to unexpected behavior, where the generic type is _assumed_ at compile-time, but actually is something completely different at runtime. It is best to use `unknown` (default) and type-check the value of the generic type parameter at runtime with `is` or `assert`.

```ts
import {assert} from "deno.land/x/is_type/mod.ts";

async function badNumberAssumption(input: unknown) {
 // Bad assumption about the generic type parameter fools the compile-time type system.
 assert.promise<number>(input);
 // `input` is a `Promise` but only assumed to be `Promise<number>`.

 const resolved = await input;
 // `resolved` is typed as `number` but was not actually checked at runtime.

 // Multiplication will return NaN if the input promise did not actually contain a number.
 return 2 * resolved;
}

async function goodNumberAssertion(input: unknown) {
 assert.promise(input);
 // `input` is typed as `Promise<unknown>`

 const resolved = await input;
 // `resolved` is typed as `unknown`

 assert.number(resolved);
 // `resolved` is typed as `number`

 // Uses runtime checks so only numbers will reach the multiplication.
 return 2 * resolved;
}

badNumberAssumption(Promise.resolve('An unexpected string'));
//=> NaN

// This correctly throws an error because of the unexpected string value.
goodNumberAssertion(Promise.resolve('An unexpected string'));
```

## Inspired

Inspired by [is](https://github.com/sindresorhus/is) - Type check values for node.js
