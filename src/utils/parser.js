function parseDecklist(raw) {
    if (!raw) return { raw: '', cards: [] };

    const lines = raw.split('\n');
    const cards = [];
    let currentType = '';

    for (let line of lines) {
        line = line.trim();
        if (!line) continue;

        // Detect section headers
        if (/^Pokémon:/i.test(line)) {
            currentType = 'Pokémon';
            continue;
        }
        if (/^Trainer:/i.test(line)) {
            currentType = 'Trainer';
            continue;
        }
        if (/^Energy:/i.test(line)) {
            currentType = 'Energy';
            continue;
        }
        if (/^--/.test(line)) continue; // skip separator

        // Match card lines: e.g. "2 Professor Turo's Scenario PAR 171"
        const match = line.match(/^(\d+)\s+(.+?)\s+([A-Z0-9]+)\s+(\d+)$/);
        if (match) {
            cards.push({
                count: parseInt(match[1], 10),
                name: match[2].trim(),
                set: match[3].trim(),
                number: match[4].trim(),
                type: currentType
            });
        }
    }

    return { raw, cards };
}

module.exports = { parseDecklist };