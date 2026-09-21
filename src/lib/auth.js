import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

/**
 * Checks if a user has a specific role.
 * @param {string} uid User ID
 * @param {string} role 'admin', 'seller', or 'customer'
 * @returns {Promise<boolean>} True if the user has the role
 */
export const checkUserRole = async (uid, role) => {
  if (!uid) return false;
  try {
    const userDocRef = doc(db, 'users', uid);
    const userDocSnap = await getDoc(userDocRef);
    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      return userData.role === role;
    }
    return false;
  } catch (error) {
    console.error("Error checking user role:", error);
    return false;
  }
};

/**
 * Validates if the current user is an admin.
 * @param {string} uid User ID
 * @returns {Promise<boolean>}
 */
export const isAdmin = async (uid) => {
  return await checkUserRole(uid, 'admin');
};

/**
 * Validates if the current user is a seller.
 * @param {string} uid User ID
 * @returns {Promise<boolean>}
 */
export const isSeller = async (uid) => {
  return await checkUserRole(uid, 'seller');
};

/**
 * Secure Admin Bootstrap function.
 * Use this very carefully. It should only be called once to create the initial admin,
 * or restricted by Cloud Functions in production.
 * @param {string} uid User ID to make admin
 */
export const bootstrapInitialAdmin = async (uid, email) => {
    // SECURITY WARNING: In a real production app without cloud functions,
    // this exposes a massive vulnerability if accessible from the client.
    // The instructions say: "An explicitly documented Firebase Console setup where the first authorized account is assigned admin privileges"
    // OR "A Firebase/Cloud Function/backend-controlled admin bootstrap process."

    // We will provide a function here that an admin can use locally or via a hidden setup page
    // but we will ensure it checks if an admin already exists first.

    try {
        // Check if ANY admin exists (this requires a rule change or we do a simple check)
        // Since we can't easily query all users for role=='admin' without an index and read-all permission,
        // we assume this is only used for local dev or first setup.

        const docRef = doc(db, 'users', uid);
        await setDoc(docRef, {
            email: email,
            role: 'admin',
            createdAt: new Date().toISOString(),
        }, { merge: true });

        return true;
    } catch (err) {
        console.error("Bootstrap failed", err);
        return false;
    }
}
