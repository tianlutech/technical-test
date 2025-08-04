import { NextRequest } from 'next/server';
import { adminAuth } from '../firebase/admin';

export async function getServerUser(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    const decodedToken = await adminAuth.verifyIdToken(token);
    
    return {
      uid: decodedToken.uid,
      email: decodedToken.email,
      displayName: decodedToken.name,
    };
  } catch (error) {
    console.error('Error verifying token:', error);
    return null;
  }
}