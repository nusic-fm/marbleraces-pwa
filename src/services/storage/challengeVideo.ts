import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase.service";

const uploadChallengeVideo = async (
  video: Blob,
  challengeId: string,
  uid: string
) => {
  const storageRef = ref(
    storage,
    `marble_race/challenges/${challengeId}/${uid}.webm`
  );
  await uploadBytes(storageRef, video, { contentType: "video/webm" });
  const url = await getDownloadURL(storageRef);

  return url;
};

export { uploadChallengeVideo };
