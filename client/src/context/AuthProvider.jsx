import {
  useEffect,
  useState,
} from "react";

import {
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

import { auth } from "../firebase";

import { AuthContext } from "./authContext";

export function AuthProvider({
  children,
}) {
  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const unsubscribe =
      onAuthStateChanged(
        auth,
        (currentUser) => {
          setUser(currentUser);

          setLoading(false);
        }
      );

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        logout,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}