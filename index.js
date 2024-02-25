const express = require('express');
const mongoose = require('mongoose');

const urlRoute = require('./routes/url');
const URL = require('./models/url');

const app = express();
const PORT = 3001;

mongoose.connect('mongodb://0.0.0.0:27017/short-url')
    .then(() => {
        console.log('Databae connected');
    })
    .catch(err => {
        console.log(err);
    });

app.use(express.json());
app.use("/url", urlRoute);

app.get('/:shortId', async (req, res) => {
    const shortId = req.params.shortId;

    const entry = await URL.findOneAndUpdate(
        {
            shortId,
        },
        {
            $push:{
                visitHistory: {
                    timestamp: Date.now()
                },
            },
        }
    );

    res.redirect(entry.originalURL);
});


app.listen(PORT, () => console.log(`Server running at PORT: ${PORT}`));