const mongoose = require('mongoose');

const uri = "mongodb+srv://Aditya-Malik:Aadi%401147@bizzshort.l4c87om.mongodb.net/bizzshort?retryWrites=true&w=majority&appName=BizzShort";

mongoose.connect(uri)
    .then(() => {
        console.log('✅ Connected successfully!');
        process.exit(0);
    })
    .catch((err) => {
        console.error('❌ Connection Failed:');
        console.error(err);
        process.exit(1);
    });
