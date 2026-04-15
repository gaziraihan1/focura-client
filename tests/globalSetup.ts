// tests/globalSetup.ts
import { ReadableStream, TransformStream, WritableStream, TextEncoderStream, TextDecoderStream } from 'node:stream/web'
import { TextEncoder, TextDecoder } from 'node:util'

export default function setup() {
  Object.assign(globalThis, {
    ReadableStream,
    TransformStream,
    WritableStream,
    TextEncoderStream,
    TextDecoderStream,
    TextEncoder,
    TextDecoder,
  })
}