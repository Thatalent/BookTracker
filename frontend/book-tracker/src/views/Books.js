import React, { useState } from "react";
import {  
    Input,
    InputGroup,
    InputGroupAddon,
    Button } from "reactstrap";
import { withAuthenticationRequired } from "@auth0/auth0-react";
import { getConfig } from "../config";
import Loading from "../components/Loading";
import {Column, Table, SortDirection } from 'react-virtualized';
//import {createTableMultiSort, Column, Table} from 'react-virtualized';


export class BooksComponent extends React.Component {

 constructor(props) {
    super(props);
    this.state = { input: "", books: [], sortedBooks: [], sortBy: "author_name, publish_year, subject" };
    this.headerRenderer = this.headerRenderer.bind(this);
    this.sort = this.sort.bind(this);
    /*this.getHeader = this.getHeader.bind(this);
    this.getRowsData = this.getRowsData.bind(this);
    this.getKeys = this.getKeys.bind(this);*/
  };

  coverPrepend = 'https://covers.openlibrary.org/b/olid/';
  coverAppend = '-M.jpg';

  ImageCell = ({cellData})=>(
    <img height='100px' src={this.coverPrepend+cellData+this.coverAppend}/>
  );

  search = () => {
    let searchText = this.state.input;
    searchText = searchText.replace(/\s+/g, '+');
    // this.setState({ input: "" });
    console.log(searchText);

    const searchUrl = `https://openlibrary.org/search.json?q=${encodeURIComponent(searchText)}&fields=key,title,author_name,cover_edition_key,publish_year,isbn,subject,publisher&mode=everything`;
    fetch(searchUrl).then(res => res.json())
    .then((result) => {
      this.setState({
        books: result.docs,
        sortedBooks: result.docs
      });
      console.log("there should be an update yo.");
      console.log(result.docs);
    });
  };
  
  handleKeyPress = (event) => {
  if(event.key === 'Enter'){
    console.log('enter press here! ')
    this.btn.click()
  }
}

  updateInput = (input) => {
    this.setState({ input });
  };

  selectBook = ({rowData}) => {
    console.log(rowData);
  };
 
 sort(sortBy, sortDirection) {
  let sortedBooks = this.state.books
    .sort((item1, item2) =>  {return item1[sortBy] > item2[sortBy] ? 1:-1});
    sortedBooks = sortDirection === SortDirection.DESC ? sortedBooks.reverse() : sortedBooks
  this.setState({ sortBy, sortDirection, sortedBooks });
}

  headerRenderer({
    label,
    dataKey,
    sortBy,
    sortDirection
  }) {
    return (
      <div onClick={()=>{this.sort(sortBy, sortDirection)}}>
        {label}
        {sortBy === dataKey }
      </div>
    );
  }

  render(){
    let emptyBooks = !this.state.sortedBooks || this.state.sortedBooks.length < 1;
  return (
    <>
      <div className="mb-5">
        <h1>User Library</h1>
        <p className="lead">
          Book Search
        </p>
        <p>
            Input a title and search for a Book.
        </p>

        <InputGroup>
            <Input 
              placeholder="Type Book Title"
              onChange={(e) => this.updateInput(e.target.value)}
              value={this.state.input}
            />
            <InputGroupAddon addonType="append">
                <Button color="primary" onClick={this.search} ref={node => (this.btn = node)} 
                onKeyPress={this.handleKeyPress}>Search</Button>
            </InputGroupAddon>
        </InputGroup>
      </div>
      <Table
        width={1000}
        height={500}
        headerHeight={20}
        rowHeight={100}
        rowCount={this.state.sortedBooks.length}
        rowGetter={({index}) => this.state.sortedBooks[index]}
        autoWidth={true}
        autoHeight={true}
        sort={this.state.sort}
        sortBy={this.state.sortBy}
        sortDirection={this.state.sortDirection}>
        <Column width={100} label="Select" dataKey="isbn" onClick={this.selectBook} >
          <Input type="checkbox" />
        </Column>
        <Column width={200} label="Title" dataKey="title"  />
        <Column width={200} label="Author" dataKey="author_name" headerRenderer={this.headerRenderer} />
        <Column width={200} label="Cover" dataKey="cover_edition_key" cellRenderer={this.ImageCell}  />
        <Column width={100} label="Genre" dataKey="subject"  />
        <Column width={300} label="Year Published" dataKey="publish_year" headerRenderer={this.headerRenderer} />
        <Column width={300} label="Publisher" dataKey="publisher" headerRenderer={this.headerRenderer} />
        <Column width={100} label="read" dataKey="read"  />
      </Table>
    </>
  );
  }
};

export default withAuthenticationRequired(BooksComponent, {
  onRedirecting: () => <Loading />,
});
