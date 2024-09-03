import { isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";
import { useEffect } from "react";
import { auth } from "../services/firebase.service";

export const useFirebaseAuth = () => {
  useEffect(() => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      // Additional state parameters can also be passed via URL.
      // This can be used to continue the user's intended action before triggering
      // the sign-in operation.
      // Get the email if available. This should be available if the user completes
      // the flow on the same device where they started it.
      let email = window.localStorage.getItem("emailForSignIn");
      if (!email) {
        // User opened the link on a different device. To prevent session fixation
        // attacks, ask the user to provide the associated email again. For example:
        email = window.prompt("Please provide your email for confirmation");
      }
      if (email)
        (async () => {
          try {
            // The client SDK will parse the code from the link for you.
            await signInWithEmailLink(auth, email, window.location.href);
            window.localStorage.removeItem("emailForSignIn");
            //   router.push("/", undefined, { shallow: true });
            window.localStorage.removeItem("email");
          } catch (e) {
            alert("Invalid Login, Please try again.");
            //   router.push("/", undefined, { shallow: true });
          }
        })();
    }
  }, []);

  return {};
};
