require('dotenv').config({ path: '.env.local' });
const fetch = require('node-fetch');

async function testPayload(payload) {
    const auth = 'Basic ' + Buffer.from(process.env.NEXT_PUBLIC_MARCHAPAY_KEY + ':' + process.env.MARCHAPAY_SECRET_KEY).toString('base64');
    const res = await fetch('https://api.marchabb.com/v1/transactions', {
        method: 'POST',
        headers: { 'Authorization': auth, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    const data = await res.json();
    console.log("PAYLOAD:", JSON.stringify(payload));
    console.log("STATUS:", res.status);
    console.log("RESPONSE:", data);
    console.log("----------------------");
}

(async () => {
    // Test 1: nested customer
    await testPayload({
        amount: 2490,
        paymentMethod: "pix",
        customer: { name: "Joao Teste", email: "teste@teste.com", document: "00442566204" }
    });
    // Test 2: flat names
    await testPayload({
        amount: 2490,
        paymentMethod: "pix",
        customerName: "Joao Teste",
        customerEmail: "teste@teste.com",
        customerDocument: "00442566204"
    });
    // Test 3: root customer + items
    await testPayload({
        amount: 2490,
        paymentMethod: "pix",
        customer: { name: "Joao Teste", email: "teste@teste.com", document: "00442566204" },
        items: [{ title: "Ebook", unitPrice: 2490, quantity: 1, tangible: false }]
    });
})();
