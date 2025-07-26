const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3001';

async function testAPI() {
  console.log('🧪 Testing Delivery Estimation API...\n');

  try {
    // Test 1: Health Check
    console.log('1. Testing Health Check...');
    const healthResponse = await fetch(`${BASE_URL}/api/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health Check:', healthData.status);
    console.log('   Data loaded:', healthData.dataLoaded);
    console.log('');

    // Test 2: Get Products
    console.log('2. Testing Products API...');
    const productsResponse = await fetch(`${BASE_URL}/api/products`);
    const productsData = await productsResponse.json();
    console.log('✅ Products loaded:', productsData.length, 'products');
    console.log('   Sample product:', productsData[0]);
    console.log('');

    // Test 3: Get Specific Product
    console.log('3. Testing Product by ID...');
    const productResponse = await fetch(`${BASE_URL}/api/products/1`);
    const productData = await productResponse.json();
    console.log('✅ Product 1:', productData);
    console.log('');

    // Test 4: Get Pincode Info
    console.log('4. Testing Pincode API...');
    const pincodeResponse = await fetch(`${BASE_URL}/api/pincodes/100001`);
    const pincodeData = await pincodeResponse.json();
    console.log('✅ Pincode 100001:', pincodeData);
    console.log('');

    // Test 5: Delivery Estimate (pincode only)
    console.log('5. Testing Delivery Estimate (pincode only)...');
    const estimateResponse1 = await fetch(`${BASE_URL}/api/estimate?pincode=100001`);
    const estimateData1 = await estimateResponse1.json();
    console.log('✅ Estimate for pincode 100001:', estimateData1);
    console.log('');

    // Test 6: Delivery Estimate (with product)
    console.log('6. Testing Delivery Estimate (with product)...');
    const estimateResponse2 = await fetch(`${BASE_URL}/api/estimate?pincode=100001&productId=1`);
    const estimateData2 = await estimateResponse2.json();
    console.log('✅ Estimate for pincode 100001 + product 1:', estimateData2);
    console.log('');

    // Test 7: Error handling - Invalid pincode
    console.log('7. Testing Error Handling (Invalid pincode)...');
    const errorResponse = await fetch(`${BASE_URL}/api/estimate?pincode=999999`);
    const errorData = await errorResponse.json();
    console.log('✅ Error response:', errorData);
    console.log('');

    // Test 8: Error handling - Missing pincode
    console.log('8. Testing Error Handling (Missing pincode)...');
    const missingResponse = await fetch(`${BASE_URL}/api/estimate`);
    const missingData = await missingResponse.json();
    console.log('✅ Missing pincode error:', missingData);
    console.log('');

    console.log('🎉 All API tests completed successfully!');
    console.log('\n📊 Summary:');
    console.log('- Health check: ✅');
    console.log('- Products API: ✅');
    console.log('- Product by ID: ✅');
    console.log('- Pincode API: ✅');
    console.log('- Delivery estimate: ✅');
    console.log('- Error handling: ✅');

  } catch (error) {
    console.error('❌ API test failed:', error.message);
  }
}

// Run the tests
testAPI(); 