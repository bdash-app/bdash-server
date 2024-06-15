// https://nodejs.org/api/webcrypto.html#encryption-and-decryption
import { webcrypto } from "node:crypto";
const { subtle } = webcrypto;

async function generateRsaKey(modulusLength = 2048, hash = "SHA-256") {
  const publicExponent = new Uint8Array([1, 0, 1])
  const { publicKey, privateKey } = await subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength,
      publicExponent,
      hash,
    },
    true,
    ["encrypt", "decrypt"]
  )
  const publicKeyJwt = await subtle.exportKey("jwk", publicKey)
  const privateKeyJwt = await subtle.exportKey("jwk", privateKey)

  return { publicKeyJwt, privateKeyJwt }
}

generateRsaKey().then((keyPair) => {
  console.log({
    publicKeyJwt: JSON.stringify(keyPair.publicKeyJwt),
    privateKeyJwt: JSON.stringify(keyPair.privateKeyJwt),
  })
})
