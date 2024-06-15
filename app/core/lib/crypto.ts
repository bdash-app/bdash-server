export const decryptText = async (encryptedText: string, privateKeyJwk: JsonWebKey) => {
  // @ts-ignore
  const subtle = globalThis.crypto.subtle ?? globalThis.crypto.webcrypto.subtle

  const privateKey = await importRsaKey(privateKeyJwk, ["decrypt"])
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
  // @ts-ignore
  const subtle = globalThis.crypto.subtle ?? globalThis.crypto.webcrypto.subtle

  const publicKey = await importRsaKey(publicKeyJwk, ["encrypt"])
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

const importRsaKey = async (jwk: JsonWebKey, usage: KeyUsage[]): Promise<CryptoKey> => {
  // @ts-ignore
  const subtle = globalThis.crypto.subtle ?? globalThis.crypto.webcrypto.subtle

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
