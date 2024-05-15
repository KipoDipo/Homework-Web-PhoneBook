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
    const formattedNumber = formatNumber(number);
    if (!formattedNumber) {
        res.status(400).send(`Number (${number}) is in wrong format...`);
        return;
    }

    contacts.push( {name, "number": formattedNumber} );
    res.status(200).send(`Contact ${name} (${formattedNumber}) added successfully`);
})

app.put('/edit-contact', (req, res) => {
    const {oldName, oldNumber, newName, newNumber} = req.body;
    if (!oldName || !oldNumber || !newName || !newNumber) {
        res.status(400).send(`oldName, oldNumber, newName and newNumber are required...`);
        return;   
    }

    const formattedOldNumber = formatNumber(oldNumber);
    if (!formattedOldNumber) {
        res.status(400).send(`Old number (${number}) is in wrong format...`);
        return;
    }

    const formattedNewNumber = formatNumber(newNumber);
    if (!formattedNewNumber) {
        res.status(400).send(`New number (${number}) is in wrong format...`);
        return;
    }

    for (let i = 0; i < contacts.length; i++) {
        if (contacts[i]["name"] === oldName && contacts[i]["number"] === formattedOldNumber) {
            contacts[i]["name"] = newName;
            contacts[i]["number"] = formattedNewNumber;
            res.status(200).send(`Updated contact ${oldName} (${formattedOldNumber}) to ${newName} (${formattedNewNumber})`)
            return;
        }
    }
    res.status(400).send(`No contact ${oldName} (${formattedOldNumber}) was found...`)
})

app.delete('/delete-contact', (req, res) => {
    const {name, number} = req.body;
    if (!name || !number) {
        res.status(400).send(`Name and number are required...`);
        return;
    }

    const formattedNumber = formatNumber(number);
    if (!formattedNumber) {
        res.status(400).send(`Number (${number}) is in wrong format...`);
        return;
    }

    contacts = contacts.filter(value => value["name"] != name && value["number"] != formattedNumber);
    res.status(200).send(`Contact ${name} (${formattedNumber}) deleted successfully`);
})

app.get('/contacts', (req, res) => {
    res.status(200).json(contacts);
})

app.listen(port, () => {
    console.log(`Phone Book app listening on port ${port}`);
})