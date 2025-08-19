const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const parser = require('./utils/parser');
const compareDecklists = require('./compare').compareDecklists; // Keep this line
const fetch = require('node-fetch');
const cheerio = require('cheerio');

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

async function fetchLimitlessDecklist(url) {
    const resp = await fetch(url);
    const html = await resp.text();
    const $ = cheerio.load(html);

    let decklistText = "";

    // Find all decklist columns
    $('.decklist-column').each((i, col) => {
        let heading = $(col).find('.decklist-column-heading').text().replace(/(\w+)\s*\((\d+)\)/, "$1: $2");
        decklistText += heading + "\n";
        $(col).find('.decklist-card').each((j, card) => {
            const count = $(card).find('.card-count').text();
            const name = $(card).find('.card-name').text();
            const set = $(card).data('set');
            const number = $(card).data('number');
            const basicEnergy = $(card).data('basicenergy');
            // Use the G function logic from the browser code
            let setText = "";
            if (set && number) {
                setText = `${set} ${number}`;
            }
            decklistText += `${count} ${name} ${setText}\n`;
        });
        decklistText += "\n";
    });

    return decklistText.trim();
}

// In your /compare route:
app.post('/compare', async (req, res) => {
    let decklist1Raw = req.body.decklist1;
    let decklist2Raw = req.body.decklist2;

    if (req.body.decklist1url) {
        decklist1Raw = await fetchLimitlessDecklist(req.body.decklist1url);
    }
    if (req.body.decklist2url) {
        decklist2Raw = await fetchLimitlessDecklist(req.body.decklist2url);
    }

    const decklist1 = parser.parseDecklist(decklist1Raw);
    const decklist2 = parser.parseDecklist(decklist2Raw);
    const comparisonResult = compareDecklists(decklist1, decklist2);

    res.render('index', { 
        decklist1,
        decklist2,
        additions: comparisonResult.additions || [],
        removals: comparisonResult.removals || [],
        changes: comparisonResult.changes || []
    });
});

// Route: /compare/:id1/:id2
app.get('/compare/:id1/:id2', async (req, res) => {
    const { id1, id2 } = req.params;

    try {
        // Construct Limitless URLs
        const url1 = `https://limitlesstcg.com/decks/list/${id1}`;
        const url2 = `https://limitlesstcg.com/decks/list/${id2}`;

        // Fetch and parse both decklists
        const decklist1Raw = await fetchLimitlessDecklist(url1);
        const decklist2Raw = await fetchLimitlessDecklist(url2);

        const decklist1 = parser.parseDecklist(decklist1Raw);
        const decklist2 = parser.parseDecklist(decklist2Raw);

        const comparisonResult = compareDecklists(decklist1, decklist2);

        res.render('index', {
            decklist1,
            decklist2,
            additions: comparisonResult.additions || [],
            removals: comparisonResult.removals || [],
            changes: comparisonResult.changes || []
        });

    } catch (err) {
        console.error("Error comparing decklists:", err);
        res.status(500).send("Failed to fetch or compare decklists");
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});