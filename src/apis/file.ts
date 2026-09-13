import { isAxiosError } from "axios";

import { apiClient } from "@/apis/client";

export type UploadPurpose = "PROFILE" | "MISSION" | "ARCHIVE";

type ApiEnvelope<T> = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
  errorDetail?: string | null;
};

type PresignedUploadResult = {
  objectKey: string;
  uploadUrl: string;
  requiredHeaders: Record<string, string>;
  expiresInSeconds: number;
};

export class FileUploadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FileUploadError";
  }
}

async function issuePresignedUploadUrl(file: File, purpose: UploadPurpose) {
  try {
    const { data } = await apiClient.post<ApiEnvelope<PresignedUploadResult>>(
      "/api/files/presigned-upload-url",
      {
        purpose,
        originalFilename: file.name,
        contentType: file.type || "application/octet-stream",
        fileSize: file.size,
      },
    );
    if (!data.isSuccess) throw new FileUploadError(data.message || "업로드 주소를 발급받지 못했습니다.");
    return data.result;
  } catch (error) {
    if (error instanceof FileUploadError) throw error;
    if (isAxiosError<ApiEnvelope<unknown>>(error)) {
      throw new FileUploadError(error.response?.data?.message || "업로드 주소를 발급받지 못했습니다.");
    }
    throw new FileUploadError("업로드 주소를 발급받지 못했습니다.");
  }
}

export async function uploadFile(file: File, purpose: UploadPurpose) {
  const presigned = await issuePresignedUploadUrl(file, purpose);
  let response: Response;
  try {
    response = await fetch(presigned.uploadUrl, {
      method: "PUT",
      headers: presigned.requiredHeaders,
      body: file,
    });
  } catch {
    throw new FileUploadError("파일 업로드에 실패했습니다. 네트워크 연결을 확인해주세요.");
  }
  if (!response.ok) {
    throw new FileUploadError("파일 업로드에 실패했습니다. 잠시 후 다시 시도해주세요.");
  }
  return presigned.objectKey;
}
