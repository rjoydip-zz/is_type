import is, { assert, AssertionTypeDescription, TypeName } from "./mod.ts";
import {
  assert as _assert,
  assertThrows,
  assertEquals,
} from "https://deno.land/std/testing/asserts.ts";

let { test } = Deno;

interface Test {
  assert: (...args: any[]) => void | never;
  fixtures: unknown[];
  typename?: TypeName;
  typeDescription?: AssertionTypeDescription | TypeName;
  is(value: unknown): boolean;
}

const types = new Map<string, Test>([
  [
    "undefined",
    {
      is: is.undefined,
      assert: assert.undefined,
      fixtures: [undefined],
      typename: TypeName.undefined,
    },
  ],
  [
    "null",
    {
      is: is.null_,
      assert: assert.null_,
      fixtures: [null],
      typename: TypeName.null,
    },
  ],
  [
    "string",
    {
      is: is.string,
      assert: assert.string,
      fixtures: ["🦄", "hello world", ""],
      typename: TypeName.string,
    },
  ],
  [
    "emptyString",
    {
      is: is.emptyString,
      assert: assert.emptyString,
      fixtures: ["", String()],
      typename: TypeName.string,
      typeDescription: AssertionTypeDescription.emptyString,
    },
  ],
  [
    "number",
    {
      is: is.number,
      assert: assert.number,
      fixtures: [6, 1.4, 0, -0, Infinity, -Infinity],
      typename: TypeName.number,
    },
  ],
  [
    "bigint",
    {
      is: is.bigint,
      assert: assert.bigint,
      fixtures: [
        // Disabled until TS supports it for an ESnnnn target.
        // 1n,
        // 0n,
        // -0n,
        BigInt("1234"),
      ],
      typename: TypeName.bigint,
    },
  ],
  [
    "boolean",
    {
      is: is.boolean,
      assert: assert.boolean,
      fixtures: [true, false],
      typename: TypeName.boolean,
    },
  ],
  [
    "symbol",
    {
      is: is.symbol,
      assert: assert.symbol,
      fixtures: [Symbol("🦄")],
      typename: TypeName.symbol,
    },
  ],
  [
    "numericString",
    {
      is: is.numericString,
      assert: assert.numericString,
      fixtures: ["5", "-3.2", "Infinity", "0x56"],
      typename: TypeName.string,
      typeDescription: AssertionTypeDescription.numericString,
    },
  ],
  [
    "array",
    {
      is: is.array,
      assert: assert.array,
      fixtures: [[1, 2], new Array(2)],
      typename: TypeName.Array,
    },
  ],
  [
    "emptyArray",
    {
      is: is.emptyArray,
      assert: assert.emptyArray,
      fixtures: [[], new Array()],
      typename: TypeName.Array,
      typeDescription: AssertionTypeDescription.emptyArray,
    },
  ],
  [
    "function",
    {
      is: is.function_,
      assert: assert.function_,
      fixtures: [
        function foo() {},
        function () {},
        () => {},
        async function () {},
        function* (): unknown {},
        async function* (): unknown {},
      ],
      typename: TypeName.Function,
    },
  ],
  [
    "object",
    {
      is: is.object,
      assert: assert.object,
      fixtures: [{ x: 1 }, Object.create({ x: 1 })],
      typename: TypeName.Object,
    },
  ],
  [
    "regExp",
    {
      is: is.regExp,
      assert: assert.regExp,
      fixtures: [/\w/, new RegExp("\\w")],
      typename: TypeName.RegExp,
    },
  ],
  [
    "date",
    {
      is: is.date,
      assert: assert.date,
      fixtures: [new Date()],
      typename: TypeName.Date,
    },
  ],
  [
    "error",
    {
      is: is.error,
      assert: assert.error,
      fixtures: [new Error("🦄")],
      typename: TypeName.Error,
    },
  ],
  [
    "nativePromise",
    {
      is: is.nativePromise,
      assert: assert.nativePromise,
      fixtures: [Promise.resolve()],
      typename: TypeName.Promise,
      typeDescription: AssertionTypeDescription.nativePromise,
    },
  ],
  [
    "promise",
    {
      is: is.promise,
      assert: assert.promise,
      fixtures: [{ then() {}, catch() {} }],
      typename: TypeName.Object,
      typeDescription: TypeName.Promise,
    },
  ],
  [
    "generator",
    {
      is: is.generator,
      assert: assert.generator,
      fixtures: [
        (function* () {
          yield 4;
        })(),
      ],
      typename: TypeName.Generator,
    },
  ],
  [
    "asyncGenerator",
    {
      is: is.asyncGenerator,
      assert: assert.asyncGenerator,
      fixtures: [
        (async function* () {
          yield 4;
        })(),
      ],
      typename: TypeName.AsyncGenerator,
    },
  ],
  [
    "generatorFunction",
    {
      is: is.generatorFunction,
      assert: assert.generatorFunction,
      fixtures: [
        function* () {
          yield 4;
        },
      ],
      typename: TypeName.Function,
      typeDescription: TypeName.GeneratorFunction,
    },
  ],
  [
    "asyncGeneratorFunction",
    {
      is: is.asyncGeneratorFunction,
      assert: assert.asyncGeneratorFunction,
      fixtures: [
        async function* () {
          yield 4;
        },
      ],
      typename: TypeName.Function,
      typeDescription: TypeName.AsyncGeneratorFunction,
    },
  ],
  [
    "asyncFunction",
    {
      is: is.asyncFunction,
      assert: assert.asyncFunction,
      fixtures: [async function () {}, async () => {}],
      typename: TypeName.Function,
      typeDescription: TypeName.AsyncFunction,
    },
  ],
  [
    "boundFunction",
    {
      is: is.boundFunction,
      assert: assert.boundFunction,
      fixtures: [() => {}, function () {}.bind(null)],
      typename: TypeName.Function,
    },
  ],
  [
    "map",
    {
      is: is.map,
      assert: assert.map,
      fixtures: [new Map([["one", "1"]])],
      typename: TypeName.Map,
    },
  ],
  [
    "emptyMap",
    {
      is: is.emptyMap,
      assert: assert.emptyMap,
      fixtures: [new Map()],
      typename: TypeName.Map,
      typeDescription: AssertionTypeDescription.emptyMap,
    },
  ],
  [
    "set",
    {
      is: is.set,
      assert: assert.set,
      fixtures: [new Set(["one"])],
      typename: TypeName.Set,
    },
  ],
  [
    "emptySet",
    {
      is: is.emptySet,
      assert: assert.emptySet,
      fixtures: [new Set()],
      typename: TypeName.Set,
      typeDescription: AssertionTypeDescription.emptySet,
    },
  ],
  [
    "weakSet",
    {
      is: is.weakSet,
      assert: assert.weakSet,
      fixtures: [new WeakSet()],
      typename: TypeName.WeakSet,
    },
  ],
  [
    "weakMap",
    {
      is: is.weakMap,
      assert: assert.weakMap,
      fixtures: [new WeakMap()],
      typename: TypeName.WeakMap,
    },
  ],
  [
    "int8Array",
    {
      is: is.int8Array,
      assert: assert.int8Array,
      fixtures: [new Int8Array()],
      typename: TypeName.Int8Array,
    },
  ],
  [
    "uint8Array",
    {
      is: is.uint8Array,
      assert: assert.uint8Array,
      fixtures: [new Uint8Array()],
      typename: TypeName.Uint8Array,
    },
  ],
  [
    "uint8ClampedArray",
    {
      is: is.uint8ClampedArray,
      assert: assert.uint8ClampedArray,
      fixtures: [new Uint8ClampedArray()],
      typename: TypeName.Uint8ClampedArray,
    },
  ],
  [
    "int16Array",
    {
      is: is.int16Array,
      assert: assert.int16Array,
      fixtures: [new Int16Array()],
      typename: TypeName.Int16Array,
    },
  ],
  [
    "uint16Array",
    {
      is: is.uint16Array,
      assert: assert.uint16Array,
      fixtures: [new Uint16Array()],
      typename: TypeName.Uint16Array,
    },
  ],
  [
    "int32Array",
    {
      is: is.int32Array,
      assert: assert.int32Array,
      fixtures: [new Int32Array()],
      typename: TypeName.Int32Array,
    },
  ],
  [
    "uint32Array",
    {
      is: is.uint32Array,
      assert: assert.uint32Array,
      fixtures: [new Uint32Array()],
      typename: TypeName.Uint32Array,
    },
  ],
  [
    "float32Array",
    {
      is: is.float32Array,
      assert: assert.float32Array,
      fixtures: [new Float32Array()],
      typename: TypeName.Float32Array,
    },
  ],
  [
    "float64Array",
    {
      is: is.float64Array,
      assert: assert.float64Array,
      fixtures: [new Float64Array()],
      typename: TypeName.Float64Array,
    },
  ],
  [
    "bigInt64Array",
    {
      is: is.bigInt64Array,
      assert: assert.bigInt64Array,
      fixtures: [new BigInt64Array()],
      typename: TypeName.BigInt64Array,
    },
  ],
  [
    "bigUint64Array",
    {
      is: is.bigUint64Array,
      assert: assert.bigUint64Array,
      fixtures: [new BigUint64Array()],
      typename: TypeName.BigUint64Array,
    },
  ],
  [
    "arrayBuffer",
    {
      is: is.arrayBuffer,
      assert: assert.arrayBuffer,
      fixtures: [new ArrayBuffer(10)],
      typename: TypeName.ArrayBuffer,
    },
  ],
  [
    "dataView",
    {
      is: is.dataView,
      assert: assert.dataView,
      fixtures: [new DataView(new ArrayBuffer(10))],
      typename: TypeName.DataView,
    },
  ],
  [
    "nan",
    {
      is: is.nan,
      assert: assert.nan,
      fixtures: [NaN, Number.NaN],
      typename: TypeName.number,
      typeDescription: AssertionTypeDescription.nan,
    },
  ],
  [
    "nullOrUndefined",
    {
      is: is.nullOrUndefined,
      assert: assert.nullOrUndefined,
      fixtures: [null, undefined],
      typeDescription: AssertionTypeDescription.nullOrUndefined,
    },
  ],
  [
    "plainObject",
    {
      is: is.plainObject,
      assert: assert.plainObject,
      fixtures: [{ x: 1 }, Object.create(null), new Object()],
      typename: TypeName.Object,
      typeDescription: AssertionTypeDescription.plainObject,
    },
  ],
  [
    "integer",
    {
      is: is.integer,
      assert: assert.integer,
      fixtures: [6],
      typename: TypeName.number,
      typeDescription: AssertionTypeDescription.integer,
    },
  ],
  [
    "safeInteger",
    {
      is: is.safeInteger,
      assert: assert.safeInteger,
      fixtures: [2 ** 53 - 1, -(2 ** 53) + 1],
      typename: TypeName.number,
      typeDescription: AssertionTypeDescription.safeInteger,
    },
  ],
  [
    "infinite",
    {
      is: is.infinite,
      assert: assert.infinite,
      fixtures: [Infinity, -Infinity],
      typename: TypeName.number,
      typeDescription: AssertionTypeDescription.infinite,
    },
  ],
]);

// This ensures a certain method matches only the types it's supposed to and none of the other methods' types
const testType = (type: string, exclude?: string[]) => {
  const testData = types.get(type);
  if (testData === undefined) {
    assertThrows(() => {
      throw new TypeError(`is.${type} not defined`);
    });
    return;
  }
  const { is: testIs, assert: testAssert, typename } = testData;
  for (const [key, { fixtures }] of types) {
    // TODO: Automatically exclude value types in other tests that we have in the current one.
    // Could reduce the use of `exclude`.
    if (exclude?.includes(key)) {
      continue;
    }
    const isTypeUnderTest = key === type;
    for (const fixture of fixtures) {
      if (isTypeUnderTest) {
        _assert(testIs(fixture));
      } else {
        assertThrows(() => testAssert(fixture), TypeError);
      }
      if (isTypeUnderTest && typename) {
        assertEquals(is(fixture), typename);
      }
    }
  }
};

const testUndefined = (val: any) => {
  assertEquals(val, undefined);
};

test("is.undefined", () => {
  testType("undefined", ["nullOrUndefined"]);
});

test("is.null", () => {
  testType("null", ["nullOrUndefined"]);
});

test("is.string", () => {
  testType("string", ["emptyString", "numericString"]);
});

test("is.number", () => {
  testType("number", ["integer", "safeInteger", "infinite"]);
});

test("is.bigint", () => {
  testType("bigint");
});

test("is.boolean", () => {
  testType("boolean");
});

test("is.symbol", () => {
  testType("symbol");
});

test("is.numericString", () => {
  testType("numericString");
  _assert(!is.numericString(""));
  _assert(!is.numericString(" "));
  _assert(!is.numericString(" \t\t\n"));
  _assert(!is.numericString(1));
  assertThrows(() => {
    assert.numericString("");
  });
  assertThrows(() => {
    assert.numericString(1);
  });
});

test("is.array", () => {
  testType("array", ["emptyArray"]);
});

test("is.function", () => {
  testType("function", [
    "generatorFunction",
    "asyncGeneratorFunction",
    "asyncFunction",
    "boundFunction",
  ]);
});

test("is.boundFunction", () => {
  _assert(!is.boundFunction(function () {}));
  assertThrows(() => {
    assert.boundFunction(function () {});
  });
});

test("is.object", () => {
  const testData = types.get("object");

  if (testData === undefined) {
    assertThrows(() => {
      throw new TypeError("is.object not defined");
    });
    return;
  }

  for (const el of testData.fixtures) {
    _assert(is.object(el));
    testUndefined(assert.object(el));
  }
});

test("is.regExp", () => {
  testType("regExp");
});

test("is.date", () => {
  testType("date");
});

test("is.error", () => {
  testType("error");
});

test("is.nativePromise", () => {
  testType("nativePromise");
});

test("is.promise", () => {
  testType("promise", ["nativePromise"]);
});

test("is.asyncFunction", () => {
  testType("asyncFunction", ["function"]);

  const fixture = async () => {};
  if (is.asyncFunction(fixture)) {
    _assert(is.function_(fixture().then));
    testUndefined(assert.function_(fixture().then));
  }
});

test("is.generator", () => {
  testType("generator");
});

test("is.asyncGenerator", () => {
  testType("asyncGenerator");
  const fixture = (async function* () {
    yield 4;
  })();
  if (is.asyncGenerator(fixture)) {
    _assert(is.function_(fixture.next));
  }
});

test("is.generatorFunction", () => {
  testType("generatorFunction", ["function"]);
});

test("is.asyncGeneratorFunction", () => {
  testType("asyncGeneratorFunction", ["function"]);

  const fixture = async function* () {
    yield 4;
  };

  if (is.asyncGeneratorFunction(fixture)) {
    _assert(is.function_(fixture().next));
  }
});

test("is.map", () => {
  testType("map", ["emptyMap"]);
});

test("is.set", () => {
  testType("set", ["emptySet"]);
});

test("is.weakMap", () => {
  testType("weakMap");
});

test("is.weakSet", () => {
  testType("weakSet");
});

test("is.int8Array", () => {
  testType("int8Array");
});

test("is.uint8Array", () => {
  testType("uint8Array");
});

test("is.uint8ClampedArray", () => {
  testType("uint8ClampedArray");
});

test("is.int16Array", () => {
  testType("int16Array");
});

test("is.uint16Array", () => {
  testType("uint16Array");
});

test("is.int32Array", () => {
  testType("int32Array");
});

test("is.uint32Array", () => {
  testType("uint32Array");
});

test("is.float32Array", () => {
  testType("float32Array");
});

test("is.float64Array", () => {
  testType("float64Array");
});

test("is.bigInt64Array", () => {
  testType("bigInt64Array");
});

test("is.bigUint64Array", () => {
  testType("bigUint64Array");
});

test("is.arrayBuffer", () => {
  testType("arrayBuffer");
});

test("is.dataView", () => {
  testType("dataView");
});

test("is.directInstanceOf", () => {
  const error = new Error();
  _assert(is.directInstanceOf(error, Error));
  testUndefined(assert.directInstanceOf(error, Error));
});

test("is.urlInstance", () => {
  const url = new URL("https://example.com");
  _assert(!is.urlInstance(url));
  _assert(!is.urlInstance({}));
  _assert(!is.urlInstance(undefined));
  _assert(!is.urlInstance(null));

  assertThrows(() => {
    assert.urlInstance({});
  });
  assertThrows(() => {
    assert.urlInstance(undefined);
  });
  assertThrows(() => {
    assert.urlInstance(null);
  });
  assertThrows(() => {
    assert.urlInstance(url);
  });
});

test("is.urlString", () => {
  const url = "https://example.com";
  _assert(is.urlString(url));
  _assert(!is.urlString(new URL(url)));
  _assert(!is.urlString({}));
  _assert(!is.urlString(undefined));
  _assert(!is.urlString(null));

  testUndefined(assert.urlString(url));
  assertThrows(() => {
    assert.urlString(new URL(url));
  });
  assertThrows(() => {
    assert.urlString({});
  });
  assertThrows(() => {
    assert.urlString(undefined);
  });
  assertThrows(() => {
    assert.urlString(null);
  });
});

test("is.truthy", () => {
  _assert(is.truthy("unicorn"));
  _assert(is.truthy("🦄"));
  _assert(is.truthy(new Set()));
  _assert(is.truthy(Symbol("🦄")));
  _assert(is.truthy(true));
  _assert(is.truthy(1));
  // Disabled until TS supports it for an ESnnnn target.
  // t.true(is.truthy(1n));
  _assert(is.truthy(BigInt(1)));

  testUndefined(assert.truthy("unicorn"));
  testUndefined(assert.truthy("🦄"));

  testUndefined(assert.truthy(new Set()));
  testUndefined(assert.truthy(Symbol("🦄")));
  testUndefined(assert.truthy(true));
  testUndefined(assert.truthy(1));
  testUndefined(assert.truthy(BigInt(1)));

  // TODO: Disabled until TS supports it for an ESnnnn target.
  // t.notThrows(() => assert.truthy(1n));
});

test("is.falsy", () => {
  _assert(is.falsy(false));
  _assert(is.falsy(0));
  _assert(is.falsy(""));
  _assert(is.falsy(null));
  _assert(is.falsy(undefined));
  _assert(is.falsy(NaN));
  // TODO: Disabled until TS supports it for an ESnnnn target.
  // t.true(is.falsy(0n));
  _assert(is.falsy(BigInt(0)));

  testUndefined(assert.falsy(false));
  testUndefined(assert.falsy(0));
  testUndefined(assert.falsy(""));
  testUndefined(assert.falsy(null));
  testUndefined(assert.falsy(undefined));
  testUndefined(assert.falsy(NaN));
  testUndefined(assert.falsy(BigInt(0)));

  // TODO: Disabled until TS supports it for an ESnnnn target.
  // t.notThrows(() => assert.falsy(0n));
});

test("is.nan", () => {
  testType("nan");
});

test("is.nullOrUndefined", () => {
  testType("nullOrUndefined", ["undefined", "null"]);
});

test("is.primitive", () => {
  const primitives = [
    undefined,
    null,
    "🦄",
    6,
    Infinity,
    -Infinity,
    true,
    false,
    Symbol("🦄"),
    // Disabled until TS supports it for an ESnnnn target.
    // 6n
  ];

  for (const element of primitives) {
    _assert(is.primitive(element));
    testUndefined(assert.primitive(element));
  }
});

test("is.integer", () => {
  testType("integer", ["number", "safeInteger"]);
  _assert(!is.integer(1.4));
  assertThrows(() => {
    assert.integer(1.4);
  });
});

test("is.safeInteger", () => {
  testType("safeInteger", ["number", "integer"]);
  _assert(!is.safeInteger(2 ** 53));
  _assert(!is.safeInteger(-(2 ** 53)));
  assertThrows(() => {
    assert.safeInteger(2 ** 53);
  });
  assertThrows(() => {
    assert.safeInteger(-(2 ** 53));
  });
});
test("is.plainObject", () => {
  testType("plainObject", ["object", "promise"]);
});

test("is.iterable", () => {
  _assert(is.iterable(""));
  _assert(is.iterable([]));
  _assert(is.iterable(new Map()));
  _assert(!is.iterable(null));
  _assert(!is.iterable(undefined));
  _assert(!is.iterable(0));
  _assert(!is.iterable(NaN));
  _assert(!is.iterable(Infinity));
  _assert(!is.iterable({}));

  testUndefined(assert.iterable(""));
  testUndefined(assert.iterable([]));
  testUndefined(assert.iterable(new Map()));
  assertThrows(() => {
    assert.iterable(null);
  });
  assertThrows(() => {
    assert.iterable(undefined);
  });
  assertThrows(() => {
    assert.iterable(0);
  });
  assertThrows(() => {
    assert.iterable(NaN);
  });
  assertThrows(() => {
    assert.iterable(Infinity);
  });
  assertThrows(() => {
    assert.iterable({});
  });
});

test("is.asyncIterable", () => {
  _assert(
    is.asyncIterable({
      [Symbol.asyncIterator]: () => {},
    })
  );

  _assert(!is.asyncIterable(null));
  _assert(!is.asyncIterable(undefined));
  _assert(!is.asyncIterable(0));
  _assert(!is.asyncIterable(NaN));
  _assert(!is.asyncIterable(Infinity));
  _assert(!is.asyncIterable({}));

  testUndefined(
    assert.asyncIterable({
      [Symbol.asyncIterator]: () => {},
    })
  );

  assertThrows(() => {
    assert.asyncIterable(null);
  });
  assertThrows(() => {
    assert.asyncIterable(undefined);
  });
  assertThrows(() => {
    assert.asyncIterable(0);
  });
  assertThrows(() => {
    assert.asyncIterable(NaN);
  });
  assertThrows(() => {
    assert.asyncIterable(Infinity);
  });
  assertThrows(() => {
    assert.asyncIterable({});
  });
});

test("is.class", () => {
  class Foo {}
  const classDeclarations = [Foo, class Bar extends Foo {}];

  for (const classDeclaration of classDeclarations) {
    _assert(is.class_(classDeclaration));
    testUndefined(assert.class_(classDeclaration));
  }
});

test("is.typedArray", () => {
  const typedArrays = [
    new Int8Array(),
    new Uint8Array(),
    new Uint8ClampedArray(),
    new Uint16Array(),
    new Int32Array(),
    new Uint32Array(),
    new Float32Array(),
    new Float64Array(),
    new BigInt64Array(),
    new BigUint64Array(),
  ];

  for (const item of typedArrays) {
    _assert(is.typedArray(item));
    testUndefined(assert.typedArray(item));
  }

  _assert(!is.typedArray(new ArrayBuffer(1)));
  _assert(!is.typedArray([]));
  _assert(!is.typedArray({}));

  assertThrows(() => {
    assert.typedArray(new ArrayBuffer(1));
  });
  assertThrows(() => {
    assert.typedArray([]);
  });
  assertThrows(() => {
    assert.typedArray({});
  });
});

test("is.arrayLike", () => {
  (function () {
    _assert(is.arrayLike(arguments));
  })();

  _assert(is.arrayLike([]));
  _assert(is.arrayLike("unicorn"));

  _assert(!is.arrayLike({}));
  _assert(!is.arrayLike(() => {}));
  _assert(!is.arrayLike(new Map()));

  (function () {
    testUndefined(assert.arrayLike(arguments));
  })();

  testUndefined(assert.arrayLike([]));
  testUndefined(assert.arrayLike("unicorn"));

  assertThrows(() => {
    assert.arrayLike({});
  });
  assertThrows(() => {
    assert.arrayLike(() => {});
  });
  assertThrows(() => {
    assert.arrayLike(new Map());
  });
});

test("is.inRange", () => {
  const x = 3;

  _assert(is.inRange(x, [0, 5]));
  _assert(is.inRange(x, [5, 0]));
  _assert(is.inRange(x, [-5, 5]));
  _assert(is.inRange(x, [5, -5]));
  _assert(!is.inRange(x, [4, 8]));
  _assert(is.inRange(-7, [-5, -10]));
  _assert(is.inRange(-5, [-5, -10]));
  _assert(is.inRange(-10, [-5, -10]));

  _assert(is.inRange(x, 10));
  _assert(is.inRange(0, 0));
  _assert(is.inRange(-2, -3));
  _assert(!is.inRange(x, 2));
  _assert(!is.inRange(-3, -2));

  assertThrows(() => {
    is.inRange(0, []);
  });
  assertThrows(() => {
    is.inRange(0, [5]);
  });
  assertThrows(() => {
    is.inRange(0, [1, 2, 3]);
  });

  testUndefined(assert.inRange(x, [0, 5]));
  testUndefined(assert.inRange(x, [5, 0]));
  testUndefined(assert.inRange(x, [-5, 5]));
  testUndefined(assert.inRange(x, [5, -5]));
  testUndefined(assert.inRange(-7, [-5, -10]));
  testUndefined(assert.inRange(-5, [-5, -10]));
  testUndefined(assert.inRange(-10, [-5, -10]));
  testUndefined(assert.inRange(x, 10));
  testUndefined(assert.inRange(0, 0));
  testUndefined(assert.inRange(-2, -3));

  assertThrows(() => {
    assert.inRange(x, [4, 8]);
  });
  assertThrows(() => {
    assert.inRange(x, 2);
  });
  assertThrows(() => {
    assert.inRange(-3, -2);
  });
  assertThrows(() => {
    assert.inRange(0, []);
  });
  assertThrows(() => {
    assert.inRange(0, [5]);
  });
  assertThrows(() => {
    assert.inRange(0, [1, 2, 3]);
  });
});

test("is.infinite", () => {
  testType("infinite", ["number"]);
});

test("is.evenInteger", () => {
  for (const el of [-6, 2, 4]) {
    _assert(is.evenInteger(el));
    testUndefined(assert.evenInteger(el));
  }

  for (const el of [-3, 1, 5]) {
    _assert(!is.evenInteger(el));
    assertThrows(() => {
      assert.evenInteger(el);
    });
  }
});

test("is.oddInteger", () => {
  for (const el of [-5, 7, 13]) {
    _assert(is.oddInteger(el));
    testUndefined(assert.oddInteger(el));
  }

  for (const el of [-8, 8, 10]) {
    _assert(!is.oddInteger(el));
    assertThrows(() => {
      assert.oddInteger(el);
    });
  }
});

test("is.emptyArray", () => {
  testType("emptyArray");
});

test("is.nonEmptyArray", () => {
  _assert(is.nonEmptyArray([1, 2, 3]));
  _assert(!is.nonEmptyArray([]));
  _assert(!is.nonEmptyArray(new Array()));

  testUndefined(assert.nonEmptyArray([1, 2, 3]));
  assertThrows(() => {
    assert.nonEmptyArray([]);
  });
  assertThrows(() => {
    assert.nonEmptyArray(new Array());
  });
});

test("is.emptyString", () => {
  testType("emptyString", ["string"]);
  _assert(!is.emptyString("🦄"));
  assertThrows(() => {
    assert.emptyString("🦄");
  });
});

test("is.nonEmptyString", () => {
  _assert(!is.nonEmptyString(""));
  _assert(!is.nonEmptyString(String()));
  _assert(is.nonEmptyString("🦄"));

  assertThrows(() => {
    assert.nonEmptyString("");
  });
  assertThrows(() => {
    assert.nonEmptyString(String());
  });
  testUndefined(assert.nonEmptyString("🦄"));
});

test("is.emptyStringOrWhitespace", () => {
  testType("emptyString", ["string"]);
  _assert(is.emptyStringOrWhitespace("  "));
  _assert(!is.emptyStringOrWhitespace("🦄"));
  _assert(!is.emptyStringOrWhitespace("unicorn"));

  testUndefined(assert.emptyStringOrWhitespace("  "));
  assertThrows(() => {
    assert.emptyStringOrWhitespace("🦄");
  });
  assertThrows(() => {
    assert.emptyStringOrWhitespace("unicorn");
  });
});

test("is.emptyObject", () => {
  _assert(is.emptyObject({}));
  _assert(is.emptyObject(new Object()));
  _assert(!is.emptyObject({ unicorn: "🦄" }));

  testUndefined(assert.emptyObject({}));
  testUndefined(assert.emptyObject(new Object()));
  assertThrows(() => {
    assert.emptyObject({ unicorn: "🦄" });
  });
});

test("is.nonEmptyObject", () => {
  const foo = {};
  is.nonEmptyObject(foo);

  _assert(!is.nonEmptyObject({}));
  _assert(!is.nonEmptyObject(new Object()));
  _assert(is.nonEmptyObject({ unicorn: "🦄" }));

  assertThrows(() => {
    assert.nonEmptyObject({});
  });
  assertThrows(() => {
    assert.nonEmptyObject(new Object());
  });
  testUndefined(assert.nonEmptyObject({ unicorn: "🦄" }));
});

test("is.emptySet", () => {
  testType("emptySet");
});

/* test("is.nonEmptySet", () => {
  const tempSet = new Set();
  _assert(!is.nonEmptySet(tempSet));
  assertThrows(() => {
    assert.nonEmptySet(tempSet);
  });

  tempSet.add(1);
  _assert(is.nonEmptySet(tempSet));
  testUndefined(assert.nonEmptySet(tempSet));
}); */

test("is.emptyMap", () => {
  testType("emptyMap");
});

/* test("is.nonEmptyMap", () => {
  const tempMap = new Map();
  _assert(!is.nonEmptyMap(tempMap));
  assertThrows(() => {
    assert.nonEmptyMap(tempMap);
  });

  tempMap.set("unicorn", "🦄");
  _assert(is.nonEmptyMap(tempMap));
  testUndefined(
    assert.nonEmptyMap(tempMap)
  );
}); */

test("is.any", () => {
  _assert(is.any(is.string, {}, true, "🦄"));
  _assert(is.any(is.object, false, {}, "unicorns"));
  _assert(!is.any(is.boolean, "🦄", [], 3));
  _assert(!is.any(is.integer, true, "lol", {}));
  _assert(is.any([is.string, is.number], {}, true, "🦄"));
  _assert(!is.any([is.boolean, is.number], "unicorns", [], new Map()));

  assertThrows(() => {
    is.any(null as any, true);
  });

  assertThrows(() => {
    is.any(is.string);
  });

  testUndefined(assert.any(is.string, {}, true, "🦄"));

  testUndefined(assert.any(is.object, false, {}, "unicorns"));

  assertThrows(() => {
    assert.any(is.boolean, "🦄", [], 3);
  });

  assertThrows(() => {
    assert.any(is.integer, true, "lol", {});
  });

  assertThrows(() => {
    assert.any(null as any, true);
  });

  assertThrows(() => {
    assert.any(is.string);
  });
});

test("is.all", () => {
  _assert(is.all(is.object, {}, new Set(), new Map()));
  _assert(is.all(is.boolean, true, false));
  _assert(!is.all(is.string, "🦄", []));
  _assert(!is.all(is.set, new Map(), {}));

  assertThrows(() => {
    is.all(null as any, true);
  });

  assertThrows(() => {
    is.all(is.string);
  });

  testUndefined(assert.all(is.object, {}, new Set(), new Map()));

  testUndefined(assert.all(is.boolean, true, false));

  assertThrows(() => {
    assert.all(is.string, "🦄", []);
  });

  assertThrows(() => {
    assert.all(is.set, new Map(), {});
  });

  assertThrows(() => {
    assert.all(null as any, true);
  });

  assertThrows(() => {
    assert.all(is.string);
  });
});

test('assert', () => {
	// Contrived test showing that TypeScript acknowledges the type assertion in `assert.number()`.
	// Real--world usage includes asserting user input, but here we use a random number/string generator.

	const getNumberOrStringRandomly = (): number | string => {
		const random = Math.random();

		if (random < 0.5) {
			return 'sometimes this function returns text';
		}

		return random;
	};

	const canUseOnlyNumber = (badlyTypedArgument: any): number => {
		// Narrow the type to number, or throw an error at runtime for non-numbers.
		assert.number(badlyTypedArgument);

		// Both the type and runtime value is number.
		return 1000 * badlyTypedArgument;
	};

	const badlyTypedVariable: any = getNumberOrStringRandomly();

	_assert(is.number(badlyTypedVariable) || is.string(badlyTypedVariable));

	// Using try/catch for test purposes only.
	try {
		const result = canUseOnlyNumber(badlyTypedVariable);

		// Got lucky, the input was a number yielding a good result.
		_assert(is.number(result));
	} catch {
		// Assertion was tripped.
		_assert(is.string(badlyTypedVariable));
	}
});