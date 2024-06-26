const getSubtle = async () => {
  return globalThis.crypto?.subtle ?? (await import("crypto")).subtle
}

export const decryptText = async (encryptedText: string, privateKeyJwk: JsonWebKey) => {
  const subtle = await getSubtle()
  const privateKey = await importRsaKey(subtle, privateKeyJwk, ["decrypt"])
  const decoder = new TextDecoder()
  const data = Buffer.from(encryptedText, "base64")
  const decrypted = await subtle.decrypt(
    {
      name: "RSA-OAEP",
    },
    privateKey,
    data
  )
  return decoder.decode(decrypted)
}

export const encryptText = async (text: string, publicKeyJwk: JsonWebKey) => {
  const subtle = await getSubtle()
  const publicKey = await importRsaKey(subtle, publicKeyJwk, ["encrypt"])
  const encoder = new TextEncoder()
  const data = encoder.encode(text)
  const encrypted = await subtle.encrypt(
    {
      name: "RSA-OAEP",
    },
    publicKey,
    data
  )
  return Buffer.from(encrypted).toString("base64")
}

const importRsaKey = async (
  subtle: SubtleCrypto,
  jwk: JsonWebKey,
  usage: KeyUsage[]
): Promise<CryptoKey> => {
  return subtle.importKey(
    "jwk",
    jwk,
    {
      name: "RSA-OAEP",
      hash: "SHA-256",
    },
    true,
    usage
  )
}
