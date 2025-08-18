function compareDecklists(decklist1, decklist2) {
    const cards1 = decklist1.cards || [];
    const cards2 = decklist2.cards || [];

    // Use a unique key for each card
    const key = card => `${card.name}|||${card.set}`;

    const map1 = new Map(cards1.map(card => [key(card), card]));
    const map2 = new Map(cards2.map(card => [key(card), card]));

    const additions = [];
    const removals = [];
    const changes = [];

    // Additions and changes
    for (const [k, card2] of map2.entries()) {
        if (!map1.has(k)) {
            additions.push(`${card2.count}x ${card2.name} ${card2.set}`);
        } else {
            const card1 = map1.get(k);
            if (card1.count !== card2.count) {
                changes.push(`${card2.name} ${card2.set}: ${card1.count} → ${card2.count}`);
            }
        }
    }

    // Removals
    for (const [k, card1] of map1.entries()) {
        if (!map2.has(k)) {
            removals.push(`${card1.count}x ${card1.name} ${card1.set}`);
        }
    }

    return { additions, removals, changes };
}

module.exports = { compareDecklists };