import React from 'react';
import './SearchBar.css';

export class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.search = this.search.bind(this);
    this.handleTermChange = this.handleTermChange.bind(this);
    this.handleEnterSearch = this.handleEnterSearch.bind(this);
  }

  search() {
    this.props.onSearch(this.state.searchTerm);
  }

  handleEnterSearch = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    if (event.key === 'Enter') {
      event.preventDefault();
      event.stopPropagation();
      console.log('enter!');
      this.props.onEnterSearch(this.state.searchTerm);
    }
  }

  handleTermChange(e) {
    this.setState({searchTerm: e.target.value});
  }

  render() {    
    return (
      <div className="SearchBar">
        <input onKeyDown={this.handleEnterSearch} onChange={this.handleTermChange} placeholder="Enter A Song, Album, or Artist" />
        <a onClick={this.search}>SEARCH</a>
      </div>
    );
  }
}