import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { fetchBlobAtOnce } from "../../helpers/blob";
import { storage } from "../firebase.service";

export const uploadFromUrl = async (url: string, name: string) => {
  const old = performance.now();
  const blob = await fetchBlobAtOnce(url);
  console.log("downloaded the file: ", performance.now() - old);

  const storageRef = ref(storage, name);
  const metadata = {
    contentType: "audio/mp3",
  };
  // 'file' comes from the Blob or File API
  const ss = await uploadBytes(storageRef, blob, metadata);
  const dUrl = await getDownloadURL(ss.ref);
  console.log("uploaded the file: ", performance.now() - old);
  return dUrl;
};

export const uploadFromFile = async (
  file: File,
  name: string,
  contentType: string
) => {
  const storageRef = ref(storage, name);
  const metadata = {
    contentType,
  };
  // 'file' comes from the Blob or File API
  await uploadBytes(storageRef, file, metadata);
  console.log("Uploaded");
};
