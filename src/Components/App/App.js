import React, { Component } from 'react';
import './App.css';
import { Playlist } from '../Playlist/Playlist';
import { SearchBar } from '../SearchBar/SearchBar';
import { SearchResults } from '../SearchResults/SearchResults';
import { Spotify } from '../../util/Spotify';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchResults: [],
      playlistName: 'New Playlist',
      playlistTracks: []
    };

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.search = this.search.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
  }

  addTrack(track) {
    if (this.state.playlistTracks.filter(element => element.id === track.id).length > 0) {
      alert('This song has already been added to your playlist.');
    } else {
      var newPlaylistTrack = this.state.playlistTracks;
      newPlaylistTrack.push(track);
      this.setState({playlistTracks: newPlaylistTrack});
    }
  }

  removeTrack(track) {
    const tempPlaylist = this.state.playlistTracks;
    const trackPosition = tempPlaylist.indexOf(track);
    tempPlaylist.splice(trackPosition, 1);
    this.setState({playlistTracks: tempPlaylist});
  }

  updatePlaylistName(name) {
    this.setState({playlistName: name});
  }

  search(term) {
    if (Spotify.accessToken === null || Spotify.accessToken === '' ) {
      Spotify.getAccessToken();
    } else {
      console.log('Search term: ' + term);
      Spotify.search(term).then(response => {this.setState({searchResults: response})});
    }
  }

  savePlaylist() {
    let playlistArray = this.state.playlistTracks;
    let playlistName = this.state.playlistName;
    let trackURIs = playlistArray.map(track => track.uri);
    Spotify.savePlaylist(playlistName, trackURIs);
    this.setState({playlistTracks: [], playlistName: 'New Playlist'});
  }

  verify(term) {
    if (Spotify.accessToken === null || Spotify.accessToken === '' ) {
      Spotify.getAccessToken();
    } else {
      console.log('Already Verified');
      Spotify.search(term);
    }
  }

  render() {
    window.onload = this.verify();
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onEnterSearch={this.search} onSearch={this.search}/>
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack}/>
            <Playlist playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks} addTrack={this.addTrack} removeTrack={this.removeTrack} onNameChange={this.updatePlaylistName} onSave={this.savePlaylist}/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;