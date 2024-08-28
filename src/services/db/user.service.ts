import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { UserDoc } from "../../models/User";
import { db } from "../firebase.service";

const DB_NAME = "users";
const PLAYLIST_SUB_COLLECTION = "playlists";

const getUserDoc = async (id: string): Promise<UserDoc> => {
  const d = doc(db, DB_NAME, id);
  const ss = await getDoc(d);
  const userDoc = { ...ss.data(), id: ss.id } as UserDoc;
  return userDoc;
};

const updateUserProfile = async (id: string, profileObj: any) => {
  const d = doc(db, DB_NAME, id);
  await updateDoc(d, profileObj);
};

const addToUserPlaylist = async (
  uid: string,
  playlistId: string,
  songObj: any
) => {
  const d = doc(db, DB_NAME, uid, PLAYLIST_SUB_COLLECTION, playlistId);
  await setDoc(d, songObj);
};

export { getUserDoc, updateUserProfile, addToUserPlaylist };
