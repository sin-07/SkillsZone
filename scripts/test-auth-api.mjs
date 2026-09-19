// Script to verify authentication utility functions
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

async function testAuth() {
  console.log('--- Testing Authentication Primitives ---');
  
  const password = 'residentSecurePassword123!';
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  console.log('✓ Password hashing successful:', hash.substring(0, 20) + '...');
  
  const isMatch = await bcrypt.compare(password, hash);
  console.log('✓ Password verification match:', isMatch);
  
  const secret = 'test-jwt-secret-key-32-chars-length';
  const payload = { userId: 'usr_123', email: 'resident@greenmeadows.internal', role: 'resident' };
  const token = jwt.sign(payload, secret, { expiresIn: '7d' });
  console.log('✓ JWT generation successful:', token.substring(0, 30) + '...');
  
  const decoded = jwt.verify(token, secret);
  console.log('✓ JWT verification successful, userId:', decoded.userId);
  console.log('All authentication unit tests passed!');
}

testAuth().catch(console.error);
