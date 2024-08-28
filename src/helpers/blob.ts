// const getAccessToken = async () => {};

// async function uploadChunks(
//   mp3Url: string,
//   bucketName: string,
//   objectName: string
// ) {
//   const storageUrl = `https://www.googleapis.com/upload/storage/v1/b/${bucketName}/o?uploadType=resumable&name=${objectName}`;
//   const accessToken = await getAccessToken();

//   // Initiate the resumable upload
//   const initiateResponse = await fetch(storageUrl, {
//     method: "POST",
//     headers: {
//       Authorization: `Bearer ${accessToken}`,
//       "Content-Type": "application/json; charset=UTF-8",
//       "X-Upload-Content-Type": "audio/mp3",
//     },
//   });

//   if (!initiateResponse.ok) {
//     throw new Error(
//       `Failed to initiate resumable upload: ${initiateResponse.statusText}`
//     );
//   }

//   const uploadUrl = initiateResponse.headers.get("Location");

//   // Fetch the MP3 file in chunks
//   const response = await fetch(mp3Url);
//   if (!response.body) return;
//   const reader = response.body.getReader();

//   let chunkIndex = 0;
//   while (true) {
//     const { done, value } = await reader.read();
//     if (done) {
//       break;
//     }

//     if (!uploadUrl) return;

//     // Upload the chunk
//     const chunkResponse = await fetch(uploadUrl, {
//       method: "POST",
//       body: value,
//       headers: {
//         "Content-Range": `bytes ${chunkIndex * chunkSize}-${
//           (chunkIndex + 1) * chunkSize - 1
//         }/${fileSize}`,
//       },
//     });

//     if (!chunkResponse.ok) {
//       throw new Error(`Failed to upload chunk: ${chunkResponse.statusText}`);
//     }

//     chunkIndex++;
//   }
// }
// async function uploadBuffer(
//   buffer: ArrayBuffer,
//   bucketName: string,
//   objectName: string
// ) {
//   const storageUrl = `https://www.googleapis.com/upload/storage/v1/b/${bucketName}/o?uploadType=media&name=${objectName}`;
//   const accessToken = await getAccessToken();

//   const response = await fetch(storageUrl, {
//     method: "POST",
//     body: buffer.toString("base64"),
//     headers: {
//       Authorization: `Bearer ${accessToken}`,
//       "Content-Type": "application/octet-stream",
//     },
//   });

//   if (!response.ok) {
//     throw new Error(`Failed to upload buffer: ${response.statusText}`);
//   }
// }

// async function uploadBlob(blob: Blob, bucketName: string, objectName: string) {
//   const storageUrl = `https://www.googleapis.com/upload/storage/v1/b/${bucketName}/o?uploadType=media&name=${objectName}`;
//   const accessToken = await getAccessToken();

//   const response = await fetch(storageUrl, {
//     method: "POST",
//     body: blob,
//     headers: {
//       Authorization: `Bearer ${accessToken}`,
//       "Content-Type": "audio/mp3",
//     },
//   });

//   if (!response.ok) {
//     throw new Error(`Failed to upload blob: ${response.statusText}`);
//   }
// }

// const buffer = require("buffer");

// async function fetchBuffer(mp3Url: string) {
//   const response = await fetch(mp3Url);
//   const reader = response.body?.getReader();
//   if (reader) {
//     const chunks = [];
//     while (true) {
//       const { done, value } = await reader.read();
//       if (done) {
//         break;
//       }
//       chunks.push(value);
//     }

//     const arrayBuffer = buffer.Buffer.concat(chunks).buffer;
//     return buffer.Buffer.from(arrayBuffer);
//   }
// }

// async function fetchBlob(mp3Url: string) {
//   const response = await fetch(mp3Url);
//   const reader = response.body?.getReader();
//   if (reader) {
//     const chunks = [];
//     while (true) {
//       const { done, value } = await reader.read();
//       if (done) {
//         break;
//       }
//       chunks.push(value);
//     }

//     const blob = new Blob(chunks, { type: "audio/mp3" });
//     return blob;
//   }
// }

// const buffer = require("buffer");

// async function fetchBufferAtOnce(mp3Url: string) {
//   const response = await fetch(mp3Url);
//   const arrayBuffer = await response.arrayBuffer();
//   return buffer.Buffer.from(arrayBuffer);
// }

export const fetchBlobAtOnce = async (mp3Url: string) => {
  const response = await fetch(mp3Url);
  const blob = await response.blob();
  return blob;
};
