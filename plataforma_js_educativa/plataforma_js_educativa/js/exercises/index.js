import { sequential } from "./sequential.js";
import { simpleIf } from "./simple-if.js";
import { nestedIf } from "./nested-if.js";
import { forLoop } from "./for-loop.js";
import { whileLoop } from "./while-loop.js";
import { asyncAwait } from "./async-await.js";
import { syncFunction } from "./sync-function.js";
import { syncAsyncCombined } from "./sync-async-combined.js";

export const exercises = [
  sequential, simpleIf, nestedIf, forLoop, whileLoop, asyncAwait, syncFunction, syncAsyncCombined
];
