const API_KEY = process.env.API_KEY;

async function makeAPICall(endpoint) {
    const url = `https://api.apilayer.com/odds/${endpoint}`;
    const response = await fetch(url, {
        headers: { 'apikey': API_KEY }
    });
    return response.json();
}

// Simplified loadGames function
async function loadGames() {
    try {
        showLoading();
        const data = await makeAPICall('sports/basketball_nba/odds?regions=us&markets=spreads');
        
        const html = data.data.map(game => `
            <div class="game" onclick="loadPlayerProps('${game.id}')">
                <h3>${game.home_team} vs ${game.away_team}</h3>
                ${game.bookmakers?.[0]?.markets?.[0]?.outcomes?.[0] ? 
                    `<p>Spread: ${game.bookmakers[0].markets[0].outcomes[0].point}</p>` : 
                    '<p>No odds available</p>'}
            </div>
        `).join('');
        
        document.getElementById('games').innerHTML = html;
    } catch (error) {
        document.getElementById('games').innerHTML = `
            <div class="error">
                <p>⚠️ Error: ${error.message}</p>
                <p>Check API key configuration</p>
            </div>
        `;
    } finally {
        hideLoading();
    }
}