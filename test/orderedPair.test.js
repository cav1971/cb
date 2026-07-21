import test from "node:test";
import assert from "node:assert/strict";
import { orderedPair } from "../src/orderedPair.js";

test("orderedPair sorts two numbers ascending", () => {
  assert.deepEqual(orderedPair(9, 2), [2, 9]);
});
