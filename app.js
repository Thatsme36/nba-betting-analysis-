const API_KEY = process.env.API_KEY;

// Add loading states
let isLoading = false;

async function loadGames() {
    try {
        isLoading = true;
        showLoading();
        
        const response = await fetch(
            `https://api.apilayer.com/odds/sports/basketball_nba/odds?regions=us&markets=spreads&oddsFormat=decimal&apiKey=${API_KEY}`,
            {
                headers: {
                    'apikey': API_KEY
                }
            }
        );
        
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        if (!data.data || !data.data.length) throw new Error('No games found');
        
        let html = '';
        data.data.forEach(game => {
            const bookmaker = game.bookmakers?.[0];
            const market = bookmaker?.markets?.[0];
            const outcome = market?.outcomes?.[0];
            
            html += `
                <div class="game" onclick="loadPlayerProps('${game.id}')">
                    <h3>${game.home_team} vs ${game.away_team}</h3>
                    ${outcome ? 
                        `<p>Spread: ${outcome.point} @ ${outcome.price}</p>` : 
                        `<p>No spread data available</p>`}
                </div>
            `;
        });
        
        document.getElementById('games').innerHTML = html;
    } catch (error) {
        console.error('Error loading games:', error);
        document.getElementById('games').innerHTML = `
            <div class="error">
                <p>⚠️ Failed to load games</p>
                <small>${error.message}</small>
            </div>
        `;
    } finally {
        isLoading = false;
        hideLoading();
    }
}

async function loadPlayerProps(gameId = 'all') {
    try {
        isLoading = true;
        showLoading();
        
        const url = gameId === 'all' 
            ? `https://api.apilayer.com/odds/sports/basketball_nba/odds?regions=us&markets=player_points&oddsFormat=decimal&apiKey=${API_KEY}`
            : `https://api.apilayer.com/odds/sports/basketball_nba/odds/${gameId}?regions=us&markets=player_points&oddsFormat=decimal&apiKey=${API_KEY}`;

        const response = await fetch(url, {
            headers: {
                'apikey': API_KEY
            }
        });
        
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        if (!data.data || !data.data.length) throw new Error('No player props found');
        
        let html = '<h2>Player Props</h2>';
        data.data.forEach(game => {
            game.bookmakers?.forEach(bookmaker => {
                bookmaker.markets?.forEach(market => {
                    market.outcomes?.forEach(outcome => {
                        html += `
                            <div class="player-prop">
                                <p><strong>${outcome.name || 'Unknown Player'}</strong><br>
                                ${outcome.point || 'N/A'} Points @ ${outcome.price || 'N/A'}</p>
                                <small>${bookmaker.title}</small>
                            </div>
                        `;
                    });
                });
            });
        });
        
        document.getElementById('games').innerHTML = html;
    } catch (error) {
        console.error('Error loading props:', error);
        document.getElementById('games').innerHTML = `
            <div class="error">
                <p>⚠️ Failed to load player props</p>
                <small>${error.message}</small>
            </div>
        `;
    } finally {
        isLoading = false;
        hideLoading();
    }
}

function showLoading() {
    document.getElementById('games').innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <p>Loading data...</p>
        </div>
    `;
}

function hideLoading() {
    const loading = document.querySelector('.loading');
    if (loading) loading.remove();
}

// Initialize
document.addEventListener('DOMContentLoaded', loadGames);