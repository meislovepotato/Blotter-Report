const ENCRYPTION_KEY =
  process.env.ENCRYPTION_KEY || "12345678901234567890123456789012"; // Must be 32 bytes
const IV_LENGTH = 16;

// Sanity check at module load
if (new TextEncoder().encode(ENCRYPTION_KEY).length !== 32) {
  throw new Error("ENCRYPTION_KEY must be exactly 32 bytes");
}

// Reusable key importer
async function getKey() {
  const keyData = new TextEncoder().encode(ENCRYPTION_KEY);
  return crypto.subtle.importKey("raw", keyData, { name: "AES-CBC" }, false, [
    "encrypt",
    "decrypt",
  ]);
}

/**
 * Encrypts buffer using AES-CBC with random IV.
 * Returns a Buffer (Node-compatible) that starts with the IV.
 */
export async function encryptBuffer(buffer) {
  try {
    const key = await getKey();
    const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));

    let inputBuffer;

    if (buffer instanceof ArrayBuffer) {
      inputBuffer = buffer;
    } else if (buffer instanceof Uint8Array) {
      inputBuffer = buffer.buffer.slice(
        buffer.byteOffset,
        buffer.byteOffset + buffer.byteLength
      );
    } else if (Buffer.isBuffer(buffer)) {
      inputBuffer = buffer.buffer.slice(
        buffer.byteOffset,
        buffer.byteOffset + buffer.byteLength
      );
    } else {
      throw new Error("Buffer must be ArrayBuffer, Uint8Array, or Buffer");
    }

    const encrypted = await crypto.subtle.encrypt(
      { name: "AES-CBC", iv },
      key,
      inputBuffer
    );

    const combined = new Uint8Array(IV_LENGTH + encrypted.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(encrypted), IV_LENGTH);

    return Buffer.from(combined); // ✅ Compatible with Prisma/blob store
  } catch (err) {
    console.error("Buffer encryption error:", err);
    throw err;
  }
}

/**
 * Decrypts buffer produced by `encryptBuffer`
 * @param {ArrayBuffer | Uint8Array | Buffer | string} encryptedBuffer
 * @returns {Promise<Uint8Array>}
 */
export async function decryptBuffer(encryptedBuffer) {
  try {
    const key = await getKey();
    let inputArray;

    // Decode base64 string
    if (typeof encryptedBuffer === "string") {
      const binary = atob(encryptedBuffer);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      inputArray = bytes;
    } else if (encryptedBuffer instanceof ArrayBuffer) {
      inputArray = new Uint8Array(encryptedBuffer);
    } else if (encryptedBuffer instanceof Uint8Array) {
      inputArray = encryptedBuffer;
    } else if (Buffer.isBuffer(encryptedBuffer)) {
      inputArray = new Uint8Array(
        encryptedBuffer.buffer,
        encryptedBuffer.byteOffset,
        encryptedBuffer.byteLength
      );
    } else {
      throw new Error(
        "Invalid encryptedBuffer: must be a base64 string, ArrayBuffer, Uint8Array, or Buffer"
      );
    }

    if (inputArray.length <= IV_LENGTH) {
      throw new Error("Invalid encrypted buffer: too short to contain IV");
    }

    const iv = inputArray.slice(0, IV_LENGTH);
    const encrypted = inputArray.slice(IV_LENGTH);

    if (iv.length !== IV_LENGTH) {
      throw new Error(`The 'iv' has an unexpected length: ${iv.length}`);
    }

    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-CBC", iv },
      key,
      encrypted
    );

    return new Uint8Array(decrypted);
  } catch (err) {
    console.error("Buffer decryption error:", err);
    throw err;
  }
}
