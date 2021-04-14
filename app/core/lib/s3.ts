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

export const uploadResultTSV = (bdashQueryIdHash: string, tsvfilePath: string) => {
  const fileContents = readFileSync(tsvfilePath)

  const params: S3.Types.PutObjectRequest = {
    Bucket: S3_BUCKET,
    Key: `bdashQuery/${bdashQueryIdHash}/result.tsv`,
    Body: fileContents,
    Metadata: {
      "Content-Type": "text/csv",
    },
  }
  return s3.putObject(params).promise()
}

export const downloadResultTSV = (bdashQueryIdHash: string) => {
  const params: S3.Types.GetObjectRequest = {
    Bucket: S3_BUCKET,
    Key: `bdashQuery/${bdashQueryIdHash}/result.tsv`,
  }
  return s3.getObject(params).promise()
}
