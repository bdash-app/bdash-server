import AWS from "aws-sdk"
import S3 from "aws-sdk/clients/s3"
import { readFileSync } from "fs"
import { env } from "./env"

AWS.config.logger = console

const s3 =
  process.env.NODE_ENV === "production"
    ? new S3()
    : new S3({
        accessKeyId: process.env.MINIO_ACCESS_KEY,
        secretAccessKey: process.env.MINIO_SECRET_KEY,
        endpoint: process.env.MINIO_URL,
        s3ForcePathStyle: true,
        signatureVersion: "v4",
      })

const S3_BUCKET = env("S3_BUCKET")

const uploadFile = (filePath: string, s3Prefix: string, contentType: string) => {
  const fileContents = readFileSync(filePath)

  const params: S3.Types.PutObjectRequest = {
    Bucket: S3_BUCKET,
    Key: s3Prefix,
    Body: fileContents,
    Metadata: {
      "Content-Type": contentType,
    },
  }
  return s3.putObject(params).promise()
}

const downloadFile = (s3Prefix: string) => {
  const params: S3.Types.GetObjectRequest = {
    Bucket: S3_BUCKET,
    Key: s3Prefix,
  }
  return s3.getObject(params).promise()
}

export const uploadResultTSV = (bdashQueryIdHash: string, tsvfilePath: string) =>
  uploadFile(tsvfilePath, `bdashQuery/${bdashQueryIdHash}/result.tsv`, "text/csv")

export const downloadResultTSV = (bdashQueryIdHash: string) =>
  downloadFile(`bdashQuery/${bdashQueryIdHash}/result.tsv`)
