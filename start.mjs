// Set CWD to the server directory so dotenv.config() finds .env
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
process.chdir(dirname(fileURLToPath(import.meta.url)));

// Polyfill SlowBuffer for Node.js 25+ (removed from buffer module)
import buffer from 'node:buffer';
if (!buffer.SlowBuffer) {
  buffer.SlowBuffer = class SlowBuffer extends Uint8Array {
    constructor(length) {
      super(length);
    }
  };
  buffer.SlowBuffer.prototype.equal = function(other) {
    if (this.length !== other.length) return false;
    let result = 0;
    for (let i = 0; i < this.length; i++) {
      result |= this[i] ^ other[i];
    }
    return result === 0;
  };
}

// Now load the actual server
await import('./dist/index.js');
