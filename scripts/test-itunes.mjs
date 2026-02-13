
const fetch = global.fetch;

async function search(term) {
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&entity=song&limit=1`;
    console.log('Fetching:', url);
    try {
        const res = await fetch(url);
        const data = await res.json();
        if (data.results && data.results.length > 0) {
            console.log('Result:', data.results[0].artworkUrl100);
            return data.results[0].artworkUrl100;
        } else {
            console.log('No results found.');
        }
    } catch (e) {
        console.error('Error:', e);
    }
}

search('周杰倫 七里香');
