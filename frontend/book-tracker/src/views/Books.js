import React, { useState } from "react";
import {  
    Input,
    InputGroup,
    InputGroupAddon,
    Button } from "reactstrap";
import { withAuthenticationRequired } from "@auth0/auth0-react";
import { getConfig } from "../config";
import Loading from "../components/Loading";
import {Column, Table, SortDirection, SortIndicator } from 'react-virtualized';
//import {createTableMultiSort, Column, Table} from 'react-virtualized';


export class BooksComponent extends React.Component {

 constructor(props) {
    super(props);
    this.state = { input: "", books: [], sortedBooks: [], sortBy: "author_name", sortDirection: SortDirection.ASC  };
    this.headerRenderer = this.headerRenderer.bind(this);
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

  updateInput = (input) => {
    this.setState({ input });
  };

  selectBook = ({rowData}) => {
    console.log(rowData);
  };
  
 
 sort({ sortBy, sortDirection }) {
  const sortedBooks = this.state.books
    .sortBy(item => item[sortBy])
    .update(
      list =>
        sortDirection === SortDirection.DESC ? list.reverse() : list
    );

  this.setState({ sortBy, sortDirection, sortedBooks });
}

  headerRenderer({
    label,
    dataKey,
    sortBy,
    sortDirection,
  }) {
    return (
      <div>
        {label}
        {sortBy === dataKey &&
          <SortIndicator sortDirection={sortDirection} />
        }
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
                <Button color="primary" onClick={this.search}>Search</Button>
            </InputGroupAddon>
        </InputGroup>
      </div>
   
      <Table
        width={800}
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
        <Column width={100} label="Select" dataKey="isbn" onClick={this.selectBook}>
          <Input type="checkbox" />
        </Column>
        <Column label="Title" dataKey="title" width={200} />
        <Column width={200} label="Author" dataKey="author_name" disableSort={false} headerRenderer={this.headerRenderer}/>
        <Column width={100} label="Cover" dataKey="cover_edition_key" cellRenderer={this.ImageCell}/>
        <Column width={100} label="Genre" dataKey="subject" />
        <Column width={200} label="Year Published" dataKey="publish_year" />
        <Column width={150} label="Publishers" dataKey="publishers" />
        <Column width={100} label="read" dataKey="read" />
      </Table>
    </>
  );
  }
};

const RenderRow = (props) =>{
 return props.keys.map((key, index)=>{
 return <td key={props.data[key]}>{props.data[key]}</td>
 })
}

export default withAuthenticationRequired(BooksComponent, {
  onRedirecting: () => <Loading />,
});
