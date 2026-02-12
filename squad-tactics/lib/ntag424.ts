// ============================================
// NTAG 424 DNA Verification Utility
// Mock implementation - replace with actual cryptographic verification
// ============================================

import type { NtagVerificationResult, NtagDecryptedData } from '@/types/game';

// AES keys would be stored securely in environment variables
// const NTAG_AES_KEY = process.env.NTAG_AES_KEY;

/**
 * Verifies NTAG 424 DNA signature
 * 
 * In production, this should:
 * 1. Decrypt the 'e' parameter using AES-128
 * 2. Verify the CMAC 'c' parameter
 * 3. Check the counter to prevent replay attacks
 * 4. Return the UID and validation status
 * 
 * @param e - Encrypted data from NFC tag
 * @param c - CMAC signature
 * @returns Verification result with UID if valid
 */
export async function verifyNtag424(
  e: string,
  c: string
): Promise<NtagVerificationResult> {
  // TODO: Implement actual NTAG 424 DNA verification
  // This is a mock implementation for development
  
  console.log('[NTAG424] Verifying signature:', { e: e.substring(0, 8) + '...', c: c.substring(0, 8) + '...' });
  
  // Mock: Extract UID from encrypted parameter
  // In reality, you would decrypt and verify cryptographically
  const mockUid = extractMockUid(e);
  
  if (!mockUid) {
    return {
      valid: false,
      uid: '',
      counter: 0,
    };
  }
  
  // Mock: Simulate counter (would be extracted from decrypted data)
  const mockCounter = Math.floor(Date.now() / 1000);
  
  return {
    valid: true,
    uid: mockUid,
    counter: mockCounter,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Mock UID extraction - for development only
 * 
 * Production implementation should use proper AES decryption:
 * - Key: 16-byte AES key programmed into the tag
 * - Algorithm: AES-128-CBC or AES-128-CTR
 * - Data format: UID (7 bytes) + Counter (3 bytes) + Random (variable)
 */
function extractMockUid(encryptedData: string): string | null {
  // For testing: if 'e' param starts with known test prefixes, return corresponding UID
  const testMappings: Record<string, string> = {
    'alpha': '04A1B2C3D4E5F6',
    'beta': '04B2C3D4E5F6A1',
    'gamma': '04C3D4E5F6A1B2',
    'delta': '04D4E5F6A1B2C3',
    'epsilon': '04E5F6A1B2C3D4',
  };
  
  for (const [prefix, uid] of Object.entries(testMappings)) {
    if (encryptedData.toLowerCase().startsWith(prefix)) {
      return uid;
    }
  }
  
  // For any other input, try to parse as hex UID directly (dev mode)
  if (/^[0-9A-Fa-f]{14}$/.test(encryptedData)) {
    return encryptedData.toUpperCase();
  }
  
  // Invalid format
  return null;
}

/**
 * Decrypts NTAG 424 DNA data
 * Mock implementation for development
 */
export async function decryptNtagData(
  e: string,
  _c: string
): Promise<NtagDecryptedData | null> {
  const uid = extractMockUid(e);
  
  if (!uid) {
    return null;
  }
  
  return {
    uid,
    counter: Math.floor(Date.now() / 1000),
    random: crypto.randomUUID().substring(0, 8),
  };
}

/**
 * Generates a mock NTAG 424 DNA URL for testing
 * 
 * @param uid - The tag UID
 * @returns Mock URL with e and c parameters
 */
export function generateMockNtagUrl(uid: string, baseUrl: string = 'https://app.example.com'): string {
  // Mock encryption (just base64 for testing)
  const mockE = Buffer.from(uid).toString('base64');
  const mockC = Buffer.from(`cmac-${uid}-${Date.now()}`).toString('base64').substring(0, 16);
  
  return `${baseUrl}/tap?e=${encodeURIComponent(mockE)}&c=${encodeURIComponent(mockC)}`;
}

