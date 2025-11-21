#!/usr/bin/env node

/**
 * PawSafe API Test Script
 * ใช้เพื่อทดสอบ API endpoints
 */

import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

async function testHealth() {
  try {
    console.log('\n📋 Testing Health Check...');
    const response = await axios.get('http://localhost:5000/api/health');
    console.log('✅ Health Check Passed:', response.data);
  } catch (error: unknown) {
    const err = error as any;
    console.error('❌ Health Check Failed:', err.message);
  }
}

async function testSignup() {
  try {
    console.log('\n📝 Testing Signup...');
    const userData = {
      username: `testuser_${Date.now()}`,
      email: `testuser_${Date.now()}@example.com`,
      password: 'TestPassword123!',
      phone: '0812345678',
      address: 'Bangkok, Thailand',
    };

    const response = await api.post('/auth/signup', userData);
    console.log('✅ Signup Successful:', {
      message: response.data.message,
      user: {
        username: response.data.user.username,
        email: response.data.user.email,
        role: response.data.user.role,
      },
    });

    return userData;
  } catch (error: any) {
    console.error('❌ Signup Failed:', error.response?.data || error.message);
    return null;
  }
}

async function testLogin(email: string, password: string) {
  try {
    console.log('\n🔐 Testing Login...');
    const response = await api.post('/auth/login', {
      email,
      password,
    });

    console.log('✅ Login Successful:', {
      message: response.data.message,
      user: {
        username: response.data.user.username,
        email: response.data.user.email,
        role: response.data.user.role,
        status: response.data.user.status,
      },
    });

    return response.data.user;
  } catch (error: any) {
    console.error('❌ Login Failed:', error.response?.data || error.message);
    return null;
  }
}

async function testInvalidLogin() {
  try {
    console.log('\n🔐 Testing Invalid Login...');
    await api.post('/auth/login', {
      email: 'nonexistent@example.com',
      password: 'wrongpassword',
    });
    console.log('❌ Invalid Login Should Have Failed!');
  } catch (error: any) {
    if (error.response?.status === 401) {
      console.log('✅ Invalid Login Correctly Rejected:', error.response.data);
    } else {
      console.error('❌ Unexpected Error:', error.response?.data || error.message);
    }
  }
}

async function runTests() {
  console.log('='.repeat(50));
  console.log('🚀 Starting PawSafe API Tests');
  console.log('='.repeat(50));

  await testHealth();
  
  const newUser = await testSignup();
  
  if (newUser) {
    await testLogin(newUser.email, newUser.password);
  }

  await testInvalidLogin();

  console.log('\n' + '='.repeat(50));
  console.log('✨ All Tests Completed!');
  console.log('='.repeat(50));
}

runTests().catch(console.error);
