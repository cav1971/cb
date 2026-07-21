import test from "node:test";
import assert from "node:assert/strict";
import { sum } from "../src/sum.js";

test("sum adds two numbers", () => {
  assert.equal(sum(2, 3), 5);
});

test("sum handles negative values", () => {
  assert.equal(sum(-2, 5), 3);
});
