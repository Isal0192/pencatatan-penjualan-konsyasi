import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const algorithm = "aes-256-cbc";

const key = crypto
  .createHash("sha256")
  .update(String(process.env.ENC_PASSPARSE))
  .digest(); 

export const encrypt = (text) => {
  const iv = crypto.randomBytes(16); 
  
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  
  // Gabungkan iv hex dengan data enkripsi
  return iv.toString('hex') + ":" + encrypted;
};

export const decrypt = (encryptedText) => {
  // Check for invalid or malformed input
  if (!encryptedText || typeof encryptedText !== 'string' || !encryptedText.includes(':')) {
    return '0'; 
  }

  const textParts = encryptedText.split(':');
  const ivHex = textParts.shift();
  const encrypted = textParts.join(':');

  // The IV for AES-256-CBC must be 16 bytes, which is 32 hex characters.
  if (!ivHex || ivHex.length !== 32) {
    console.error("Decryption failed: IV is malformed.", encryptedText);
    return '0';
  }

  try {
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    console.error("Decryption failed with error:", error);
    return '0'; // Return '0' if any part of the crypto process fails
  }
};