const clientID = '1d80c99810ef49118edb10bd634ebccb';
const client_secret = '2828767289464a06a98626514346370a';
// const redirectUri = 'http://jammming_ruanpetersen.surge.sh/';
const redirectUri = 'http://localhost:3000';
let accessToken = '';

export let Spotify = {
  getAccessToken() {
    if(accessToken){
      return accessToken;
    }
    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
    if (accessTokenMatch && expiresInMatch) {
      accessToken = accessTokenMatch[1];
      let expiresIn = Number(expiresInMatch[1]);
      window.setTimeout(() => accessToken = '', expiresIn * 1000);
      window.history.pushState('Access Token', null, '/'); // clears the parameters, allows to grab a new access token when expires
      return accessToken;
    } else {
      window.location = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}/`;
    }
  },

  search(term) {
    accessToken = this.getAccessToken();
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }).then(response => {
      return response.json();
    }).then(jsonResponse => {
      if (!jsonResponse.tracks) {
        return [];
      }
        return jsonResponse.tracks.items.map(track => ({
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          album: track.album.name,
          uri: track.uri
        }));
    });
  },

  savePlaylist(name, trackUris) {
    if (!name || !trackUris) return;
    const saveUrl = 'https://api.spotify.com/v1/me';
    const headers = {
      Authorization: `Bearer ${accessToken}`
    };
    let userID;
    let playlistID;
    fetch(saveUrl, {
      headers: headers
    })
    .then(response => response.json())
    .then(jsonResponse => userID = jsonResponse.id)
    .then(() => {
    const createPlaylist = `https://api.spotify.com/v1/users/${userID}/playlists`;
    fetch(createPlaylist, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
        name: name
        })
      })
      .then(response => response.json())
      .then(jsonResponse => playlistID = jsonResponse.id)
      .then(() => {
        const addTracksToPlaylist = `https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`;
        fetch(addTracksToPlaylist, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify({
          uris: trackUris
          })
        });
      })
    })
  }
};