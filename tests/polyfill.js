// tests/polyfill.js  (plain JS, not TS)
import {ReadableStream, TransformStream, WritableStream} from 'stream/web';
import {TextDecoder, TextEncoder} from 'util'

globalThis.ReadableStream = ReadableStream
globalThis.TransformStream = TransformStream
globalThis.WritableStream = WritableStream
globalThis.TextEncoder = TextEncoder
globalThis.TextDecoder = TextDecoder