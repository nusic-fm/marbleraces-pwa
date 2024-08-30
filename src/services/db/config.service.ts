import { doc, increment, updateDoc } from "firebase/firestore";
import { db } from "../firebase.service";

const updateRemainingInvites = async () => {
  const d = doc(db, "marblerace_config", "wqAmu88xZ8VuFUQDQDFb");
  updateDoc(d, { remainingInvites: increment(-1) });
};

export { updateRemainingInvites };
