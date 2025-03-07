// Use Netlify environment variable
const API_KEY = process.env.API_KEY;

async function loadGames() {
    try {
        const response = await fetch(
            `https://api.apilayer.com/odds/sports/basketball_nba/odds?regions=us&markets=spreads&oddsFormat=decimal&apiKey=${API_KEY}`
        );
        const games = await response.json();
        
        let html = '';
        games.forEach(game => {
            html += `
                <div class="game" onclick="loadPlayerProps('${game.id}')">
                    <h3>${game.home_team} vs ${game.away_team}</h3>
                    <p>Spread: ${game.bookmakers[0]?.markets[0]?.outcomes[0]?.point || 'N/A'} @ ${game.bookmakers[0]?.markets[0]?.outcomes[0]?.price || 'N/A'}</p>
                </div>
            `;
        });
        
        document.getElementById('games').innerHTML = html;
    } catch (error) {
        console.error('Error loading games:', error);
        document.getElementById('games').innerHTML = '<p>Error loading games. Please try again later.</p>';
    }
}

async function loadPlayerProps(gameId = 'all') {
    try {
        const url = gameId === 'all' 
            ? `https://api.apilayer.com/odds/sports/basketball_nba/odds?regions=us&markets=player_points&oddsFormat=decimal&apiKey=${API_KEY}`
            : `https://api.apilayer.com/odds/sports/basketball_nba/odds/${gameId}?regions=us&markets=player_points&oddsFormat=decimal&apiKey=${API_KEY}`;
        
        const response = await fetch(url);
        const props = await response.json();
        
        let html = '<h2>Player Props</h2>';
        props.forEach(prop => {
            prop.bookmakers[0]?.markets?.forEach(market => {
                market.outcomes?.forEach(outcome => {
                    html += `
                        <div class="player-prop">
                            <p>${outcome.name || 'Unknown'}: ${outcome.point || 'N/A'} @ ${outcome.price || 'N/A'}</p>
                        </div>
                    `;
                });
            });
        });
        
        document.getElementById('games').innerHTML = html;
    } catch (error) {
        console.error('Error loading props:', error);
        document.getElementById('games').innerHTML = '<p>Error loading player props. Please try again later.</p>';
    }
}

// Load games when page loads
document.addEventListener('DOMContentLoaded', loadGames);