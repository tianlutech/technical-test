import {
  signOut,
  onAuthStateChanged,
  User,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  AuthError,
} from 'firebase/auth';
import { auth } from './config';
import { AuthUser, mapFirebaseUser } from '../types/auth.types';

export class AuthService {
  /**
   * Sign in with Google using popup
   */
  static async signInWithGoogle(): Promise<AuthUser> {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      return mapFirebaseUser(userCredential.user);
    } catch (error) {
      const authError = error as AuthError;
      throw new Error(this.getErrorMessage(authError.code));
    }
  }

  /**
   * Sign in with Google using redirect
   */
  static async signInWithGoogleRedirect(): Promise<void> {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithRedirect(auth, provider);
    } catch (error) {
      const authError = error as AuthError;
      throw new Error(this.getErrorMessage(authError.code));
    }
  }

  /**
   * Get redirect result for Google sign-in
   */
  static async getRedirectResult(): Promise<AuthUser | null> {
    try {
      const result = await getRedirectResult(auth);
      if (result) {
        return mapFirebaseUser(result.user);
      }
      return null;
    } catch (error) {
      const authError = error as AuthError;
      throw new Error(this.getErrorMessage(authError.code));
    }
  }

  /**
   * Sign out the current user
   */
  static async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch {
      throw new Error('Failed to sign out');
    }
  }

  /**
   * Get current user
   */
  static getCurrentUser(): User | null {
    return auth.currentUser;
  }

  /**
   * Listen to authentication state changes
   */
  static onAuthStateChange(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, callback);
  }

  /**
   * Convert Firebase error codes to user-friendly messages
   */
  private static getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/popup-closed-by-user':
        return 'Sign-in was cancelled';
      case 'auth/popup-blocked':
        return 'Sign-in popup was blocked. Please allow popups for this site';
      case 'auth/account-exists-with-different-credential':
        return 'An account already exists with the same email address but different sign-in credentials';
      case 'auth/operation-not-allowed':
        return 'Google sign-in is not enabled. Please contact support';
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection';
      case 'auth/unauthorized-domain':
        return 'This domain is not authorized for OAuth operations';
      case 'auth/cancelled-popup-request':
        return 'Sign-in request was cancelled';
      case 'auth/internal-error':
        return 'An internal error occurred. Please try again';
      default:
        console.error('Unhandled auth error code:', errorCode);
        return `Authentication error: ${errorCode}`;
    }
  }
}
