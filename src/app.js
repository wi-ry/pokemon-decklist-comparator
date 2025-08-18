const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const parser = require('./utils/parser');
const compareDecklists = require('./compare').compareDecklists; // Keep this line

const app = express();
const PORT = process.env.PORT || 3333;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, '../public')));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('index', { 
        decklist1: null, 
        decklist2: null, 
        additions: [], 
        removals: [], 
        changes: [] 
    });
});

app.post('/compare', (req, res) => {
    const decklist1 = parser.parseDecklist(req.body.decklist1);
    const decklist2 = parser.parseDecklist(req.body.decklist2);
    const comparisonResult = compareDecklists(decklist1, decklist2);

    res.render('index', { 
        decklist1,
        decklist2,
        additions: comparisonResult.additions || [],
        removals: comparisonResult.removals || [],
        changes: comparisonResult.changes || []
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});