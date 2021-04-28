import React, { useState } from "react";
import {  
    Input,
    InputGroup,
    InputGroupAddon,
    Button } from "reactstrap";
import { withAuthenticationRequired } from "@auth0/auth0-react";
import { getConfig } from "../config";
import Loading from "../components/Loading";
import {Column, Table} from 'react-virtualized';


export class BooksComponent extends React.Component {

 constructor(props) {
    super(props);
    this.state = { input: "", books: [] };
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
        books: result.docs
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

  render(){
    let emptyBooks = !this.state.books || this.state.books.length < 1;
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
        rowCount={this.state.books.length}
        rowGetter={({index}) => this.state.books[index]}
        autoWidth={true}
        autoHeight={true}>
        <Column width={100} label="Select" dataKey="isbn" onClick={this.selectBook}>
          <Input type="checkbox" />
        </Column>
        <Column label="Title" dataKey="title" width={200} />
        <Column width={200} label="Authors" dataKey="author_name" />
        <Column width={100} label="Cover" dataKey="cover_edition_key" cellRenderer={this.ImageCell}/>
        <Column width={100} label="Genre" dataKey="subject" />
        <Column width={200} label="Year Published" dataKey="publish_year" />
        <Column width={150} label="Publishers" dataKey="publishers" />
        <Column width={100} label="read" dataKey="read" />
      </Table>
    </>
  )}
};

export default withAuthenticationRequired(BooksComponent, {
  onRedirecting: () => <Loading />,
});
