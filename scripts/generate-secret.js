// scripts/generate-secret.js
// Helper script to generate a secure JWT secret

const crypto = require('crypto');

const secret = crypto.randomBytes(32).toString('hex');

console.log('\n🔐 Generated JWT Secret:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(secret);
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('\n✅ Copy this value and use it as your JWT_SECRET environment variable');
console.log('⚠️  Keep this secret secure and never commit it to Git!\n');
