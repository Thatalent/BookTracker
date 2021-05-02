import React, { useState } from "react";
import {  
    Input,
    InputGroup,
    InputGroupAddon,
    Button } from "reactstrap";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { getConfig } from "../config";
import Loading from "../components/Loading";
import {Column, Table} from 'react-virtualized';

const BooksComponent = () =>{


  const {user} = useAuth0();
  console.log(user.sub);
    
  const [input, setInput]=  useState("");
  const [books, setBooks] =  useState([]);

  const coverPrepend = 'https://covers.openlibrary.org/b/olid/';
  const coverAppend = '-M.jpg';

  const ImageCell = ({cellData})=>{
    return <img height='100px' src={coverPrepend+cellData+coverAppend}/>
  };

  const search = () => {
    let searchText = input;
    searchText = searchText.replace(/\s+/g, '+');
    console.log(searchText);

    const searchUrl = `https://openlibrary.org/search.json?q=${encodeURIComponent(searchText)}&fields=key,title,author_name,cover_edition_key,publish_year,isbn,subject,publisher&mode=everything`;
    fetch(searchUrl).then(res => res.json())
    .then((result) => {
      setBooks(result.docs);
      console.log("there should be an update yo.");
      console.log(result.docs);
    });
  };

  const updateInput = (newInput) => {
    setInput(newInput);
  };

  const selectBook = ({rowData}) => {
    console.log(rowData);
  };
    // let emptyBooks = !this.state.books || this.state.books.length < 1;
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
              onChange={(e) => updateInput(e.target.value)}
              value={input}
            />
            <InputGroupAddon addonType="append">
                <Button color="primary" onClick={search}>Search</Button>
            </InputGroupAddon>
        </InputGroup>
      </div>

      <Table
        width={800}
        height={500}
        headerHeight={20}
        rowHeight={100}
        rowCount={books.length}
        rowGetter={({index}) => books[index]}
        autoWidth={true}
        autoHeight={true}>
        <Column width={100} label="Select" dataKey="isbn" onClick={selectBook}/>
        <Column label="Title" dataKey="title" width={200} />
        <Column width={200} label="Authors" dataKey="author_name" />
        <Column width={100} label="Cover" dataKey="cover_edition_key" cellRenderer={ImageCell}/>
        <Column width={100} label="Genre" dataKey="subject" />
        <Column width={200} label="Year Published" dataKey="publish_year" />
        <Column width={150} label="Publishers" dataKey="publishers" />
        <Column width={100} label="read" dataKey="read" />
      </Table>
    </>
  )
};

export default withAuthenticationRequired(BooksComponent, {
  onRedirecting: () => <Loading />,
});
