import React, { useState, useEffect } from "react";
import {  
    Input,
    InputGroup,
    InputGroupAddon,
    Button,
    Spinner } from "reactstrap";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { getConfig } from "../config";
import Loading from "../components/Loading";
import {Column, Table, AutoSizer, CellMeasurerCache, CellMeasurer, SortDirection, tableSettings,  } from 'react-virtualized';import { Link } from "react-router-dom";
import _ from 'lodash';

const BooksComponent = () =>{

  const {user} = useAuth0();
    
  const [loading, setLoading]=  useState(false);
  const [input, setInput]=  useState("");
  const [books, setBooks] =  useState([]);
  const [sortedBooks, setSortedBooks] =  useState([]);
  const [sortBy, setSortBy] =  useState("author_name");
  const [sortDirection, setSortDirection] =  useState(SortDirection.ASC);

  const coverPrepend = 'https://covers.openlibrary.org/b/olid/';
  const coverAppend = '-M.jpg';

  const _cache = new CellMeasurerCache({
    fixedWidth: true,
    minHeight: 40
  });

  const _wrappingCellRenderer = ({...sortedBooks}) => {
    return (
      <CellMeasurer
        cache={_cache}
        columnIndex={sortedBooks.columnIndex}
        key={sortedBooks.dataKey}
        parent={sortedBooks.parent}
        rowIndex={sortedBooks.rowIndex}>
        <div
          className={"tableColumn"}
          style={{
            whiteSpace: 'normal',
          }}>
          {sortedBooks.cellData}
        </div>
      </CellMeasurer>
    );
  };

  const ImageCell = ({cellData, rowData})=>{
    rowData.coverUrl = coverPrepend+cellData+coverAppend;
    return <img height='100px' src={rowData.coverUrl}/>
  };

  const search = () => {
    setLoading(true);
    let searchText = input;
    searchText = searchText.replace(/\s+/g, '+');

    const searchUrl = `https://openlibrary.org/search.json?q=${encodeURIComponent(searchText)}&fields=key,title,author_name,cover_edition_key,publish_year,isbn,subject,publisher&mode=everything`;
    fetch(searchUrl).then(res => res.json())
    .then((result) => {
      setBooks(result.docs);
      setSortedBooks(result.docs);
    }).finally(()=>{
      setLoading(false);
    });
  };

  const updateInput = (newInput) => {
    setInput(newInput);
  };

  const handleKeyPress = (event) => {
    if(event.key === 'Enter'){ 
      search();
    }
  }

  const sort = ( sortBy, sortDirection ) => {
    let sortedBooks = 
    _.orderBy(books, sortBy,
      sortDirection === SortDirection.DESC ? 'desc' : 'asc');
  
    setSortBy(sortBy);
    setSortDirection(sortDirection);
    setSortedBooks(sortedBooks);
  }
  
    const headerRenderer = ({
      label,
      dataKey,
      rowData
    }) => {
      let direction = dataKey !== sortBy ? SortDirection.ASC : sortDirection === SortDirection.ASC ? SortDirection.DESC : SortDirection.ASC
      return <span className="ReactVirtualized__Table__headerTruncatedText" onClick={()=>sort(dataKey, direction)}>
          {label}
        </span>
    }

  const BookSelectorCell = ({rowData}) => {
    return <Link
          color="primary"
          className="mt-5"
          to={{
            pathname:'book/new',
            state: {
              title: rowData.title,
              author: rowData.author_name,
              coverImageUrl: coverPrepend+rowData.cover_edition_key+coverAppend,
              genre: rowData.subject,
              yearPublished: rowData.publish_year,
              publisher: rowData.publisher
            }
          }}>
          Add Book
        </Link>
  };

  return (
    <>
      <div className="mb-5">
        <h1>User Library</h1>
        <p className="lead">
          Book Search
        </p>
        <div style={{display: 'flex'}}>

        <p>
            Input a title and search for a Book.
        </p>
        {loading && (
          <Spinner type="grow" color="primary" />
        )}
        </div>


        <InputGroup>
            <Input 
              placeholder="Type Book Title"
              onChange={(e) => updateInput(e.target.value)}
              value={input}
              onKeyPress={(e) => handleKeyPress(e)}
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
        rowCount={sortedBooks.length}
        rowGetter={({index}) => sortedBooks[index]}
        autoWidth={true}
        autoHeight={false}>
        <Column width={200} label="Select" dataKey="isbn" cellRenderer={BookSelectorCell}/>
        <Column label="Title" dataKey="title" width={200} autoWidth={true} headerRenderer={headerRenderer}/>
        <Column width={200} label="Author" dataKey="author_name" disableSort={false} headerRenderer={headerRenderer}/>
        <Column width={200} label="Cover" dataKey="cover_edition_key" cellRenderer={ImageCell}/>
        <Column width={200} label="Genre" dataKey="subject" headerRenderer={headerRenderer}/>
        <Column width={400} label="Year Published" dataKey="publish_year" headerRenderer={headerRenderer}/>
        <Column width={300} label="Publishers" dataKey="publishers" headerRenderer={headerRenderer}/>
        <Column width={200} label="read" dataKey="read" />
      </Table>
    </>
  )
};

export default withAuthenticationRequired(BooksComponent, {
  onRedirecting: () => <Loading />,
});
