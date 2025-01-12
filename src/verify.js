// verify.js
import { bytesToHex } from '@noble/hashes/utils';
import { p256 } from '@noble/curves/p256';
import { sha256 } from '@noble/hashes/sha256';

// Helper function to decode base64url to Uint8Array
export function base64UrlToBase64(base64url) {
    return base64url
          .replace(/-/g, '+')
          .replace(/_/g, '/')
          .padEnd(base64url.length + (4 - base64url.length % 4) % 4, '=');
}

export async function verifyECDSASignature(message, signature, publicKey) {
    try {
        const publicKeyBase64 = publicKey
            .replace('-----BEGIN PUBLIC KEY-----', '')
            .replace('-----END PUBLIC KEY-----', '')
            .replace(/\s+/g, '');

        const publicKeyDER = Uint8Array.from(
            atob(publicKeyBase64)
                .split('')
                .map(c => c.charCodeAt(0))
        );

        // Extract the actual public key point from the DER format
        // Skip the ASN.1 header (usually first 26 bytes for ECDSA public keys)
        const publicKeyPoint = publicKeyDER.slice(26);

        const signatureBytes = Uint8Array.from(
            atob(signature)
                .split('')
                .map(c => c.charCodeAt(0))
        );

        const messageHash = sha256(new TextEncoder().encode(message));

        // Verify the signature
        return await p256.verify(
	    signatureBytes,
            messageHash,
            publicKeyPoint
        );
    } catch (error) {
        console.error('Error verifying signature:', error);
        return false;
    }
}


