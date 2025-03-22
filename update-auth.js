const readline = require('readline');
const fetch = require('node-fetch');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function checkAuth() {
  console.log('=== Authentication Status Check ===');
  
  try {
    // Check if a token is stored in localStorage (browser simulation)
    let token = null;
    
    rl.question('Do you have an authentication token? (yes/no): ', async (answer) => {
      if (answer.toLowerCase() === 'yes') {
        rl.question('Please paste your authentication token: ', async (inputToken) => {
          token = inputToken.trim();
          await testToken(token);
        });
      } else {
        console.log('\nNo token available. Let\'s generate a test token.');
        await generateTestToken();
      }
    });
  } catch (error) {
    console.error('Error checking authentication status:', error);
    rl.close();
  }
}

async function testToken(token) {
  try {
    console.log('\nTesting token with backend server...');
    
    const response = await fetch('http://localhost:3000/api/auth/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('\n✅ Authentication successful!');
      console.log('User info:', data);
      
      console.log('\nTrying to access a protected endpoint...');
      await testProtectedEndpoint(token);
    } else {
      console.log('\n❌ Authentication failed:', data.error);
      console.log('You may need to log in again to get a valid token.');
    }
    
    rl.close();
  } catch (error) {
    console.error('Error testing token:', error);
    rl.close();
  }
}

async function testProtectedEndpoint(token) {
  try {
    const response = await fetch('http://localhost:3000/api/rides/driver/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('\n✅ Protected endpoint access successful!');
      console.log('Response:', data);
    } else {
      console.log('\n❌ Protected endpoint access failed:', data.error);
    }
  } catch (error) {
    console.error('Error accessing protected endpoint:', error);
  }
}

async function generateTestToken() {
  try {
    rl.question('\nEnter an email for test login: ', (email) => {
      rl.question('Enter a password: ', async (password) => {
        console.log('\nAttempting to log in with provided credentials...');
        
        try {
          const response = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
          });
          
          const data = await response.json();
          
          if (response.ok && data.session && data.session.access_token) {
            console.log('\n✅ Login successful!');
            console.log('Authentication token:', data.session.access_token);
            console.log('\nAdd this token to localStorage in your browser:');
            console.log(`localStorage.setItem('token', '${data.session.access_token}');`);
            
            await testToken(data.session.access_token);
          } else {
            console.log('\n❌ Login failed:', data.error || 'Unknown error');
            console.log('You may need to create an account or reset your password.');
            rl.close();
          }
        } catch (error) {
          console.error('Error logging in:', error);
          rl.close();
        }
      });
    });
  } catch (error) {
    console.error('Error generating test token:', error);
    rl.close();
  }
}

// Run the check
checkAuth(); 