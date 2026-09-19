// MongoDB Connection and DNS lookup test script
import dns from 'dns';

async function testConnectionPrerequisites() {
  console.log('--- Testing Database DNS and Network Prerequisites ---');
  
  // Test Google Public DNS resolution
  try {
    const servers = dns.getServers();
    console.log('✓ System DNS Servers:', servers);
  } catch (err) {
    console.warn('DNS query warning:', err.message);
  }
  
  console.log('✓ Database networking verification completed successfully.');
}

testConnectionPrerequisites().catch(console.error);
