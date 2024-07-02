const express = require('express');
const admin = require('firebase-admin');
const serviceAccount = require('./hayyak-2025-firebase-adminsdk-i1dgm-e44bff5722.json');

// Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const app = express();

// Endpoint to check if phone number exists
app.get('/checkPhoneNumber/:phoneNumber', async (req, res) => {
    const phoneNumber = req.params.phoneNumber;

    try {
        const userRecord = await admin.auth().getUserByPhoneNumber(phoneNumber);
        res.json({ exists: true, uid: userRecord.uid });
    } catch (error) {
        if (error.code === 'auth/user-not-found') {
            res.json({ exists: false });
        } else {
            console.error('Error checking phone number:', error);
            res.status(500).json({ error: 'Internal server error', details: error.message });
        }
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
