'use client';
import { useEffect, useState } from 'react';
import { onAuthStateChanged, type Auth, type User } from 'firebase/auth';

export interface UserHookResult {
  user: User | null;
  isUserLoading: boolean;
  userError: Error | null;
}

/**
 * React hook to subscribe to Firebase user authentication state.
 *
 * @param {Auth} auth - The Firebase Auth instance.
 * @returns {UserHookResult} Object with user, isUserLoading, userError.
 */
export function useUser(auth: Auth): UserHookResult {
  const [userAuthState, setUserAuthState] = useState<UserHookResult>({
    user: null,
    isUserLoading: true,
    userError: null,
  });

  useEffect(() => {
    // Set initial state
    setUserAuthState({ user: null, isUserLoading: true, userError: null });

    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser) => {
        setUserAuthState({ user: firebaseUser, isUserLoading: false, userError: null });
      },
      (error) => {
        console.error("useUser: onAuthStateChanged error:", error);
        setUserAuthState({ user: null, isUserLoading: false, userError: error });
      }
    );

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, [auth]); // Rerun effect if auth instance changes

  return userAuthState;
}