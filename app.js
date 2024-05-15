const express = require('express');
const app = express();
const port = 3000;

contacts = [];

function formatNumber(number) {
    let plusFlag = false;
    let numberFlag = false;
    let formattedNumber = "";

    let validSymbols = " -0123456789";

    for (let i = 0; i < number.length; i++) {
        if (number.charAt(i) == '+') {
            if (plusFlag || numberFlag)
                return "";
            formattedNumber += "+";
            plusFlag = true;
        }
        else if (validSymbols.includes(number.charAt(i))) {
            if (+number.charAt(i)) {
                numberFlag = true;
                formattedNumber += number.charAt(i);
            }
        }
        else {
            return "";
        }
    }
    return formattedNumber;
}

app.use(express.json())

app.post('/save-contact', (req, res) => {
    const {name, number} = req.body;
    if (!name || !number) {
        res.status(400).send(`Name and number are required...`);
        return;
    }
    let formattedNumber = formatNumber(number);
    if (!formattedNumber) {
        res.status(400).send(`Number (${number}) is in wrong format...`);
        return;
    }

    contacts.push( {name, "number": formattedNumber} );
    res.status(200).send(`Contact ${name} (${formattedNumber}) added successfully`);
})

app.get('/contacts', (req, res) => {
    res.status(200).json(contacts);
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})