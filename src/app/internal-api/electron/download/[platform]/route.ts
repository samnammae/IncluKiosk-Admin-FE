import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";
import yaml from "js-yaml";

const s3Client = new S3Client({
  region: "ap-northeast-2",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

interface LatestYml {
  version: string;
  path: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ platform: string }> }
) {
  const { platform } = await params;

  // 플랫폼 검증
  if (platform !== "mac" && platform !== "linux") {
    return NextResponse.json(
      { error: "Invalid platform. Use 'mac' or 'linux'" },
      { status: 400 }
    );
  }

  try {
    // S3에서 latest.yml 파일 읽기
    const ymlKey = `releases/latest-${platform}.yml`;
    const command = new GetObjectCommand({
      Bucket: "inclukiosk-kiosk-fe",
      Key: ymlKey,
    });

    const response = await s3Client.send(command);
    const ymlContent = await response.Body?.transformToString();

    if (!ymlContent) {
      throw new Error("Failed to read yml file");
    }

    // YAML 파싱
    const data = yaml.load(ymlContent) as LatestYml;

    // 다운로드 URL 생성
    const downloadUrl = `https://inclukiosk-kiosk-fe.s3.ap-northeast-2.amazonaws.com/releases/${data.path}`;

    return NextResponse.json({
      platform,
      version: data.version,
      fileName: data.path,
      downloadUrl,
    });
  } catch (error) {
    console.error("Error fetching download info:", error);
    return NextResponse.json(
      { error: "Failed to fetch download information" },
      { status: 500 }
    );
  }
}
