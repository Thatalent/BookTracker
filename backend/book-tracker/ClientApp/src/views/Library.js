import React, { useState } from "react";
import { Button } from "reactstrap";
import { withAuthenticationRequired } from "@auth0/auth0-react";
import { getConfig } from "../config";
import Loading from "../components/Loading";
import {Column, Table} from 'react-virtualized';
import 'react-virtualized/styles.css'; // only needs to be imported once
import LinkButton from '../components/LinkButton';


export const LibraryComponent = () => {
  const { apiOrigin = "http://localhost:3001", audience } = getConfig();

  const [state, setState] = useState({
    showResult: false,
    apiMessage: "",
    error: null,
  });

  const Cell = ({ Book, Field, style }) => (
    <div style={style}>
      Book[Field] 
    </div>
  );

  const books = [
      { 
          title: "Random Book",
          authors: ['someone', 'wrote a book'],
          coverImageUrl: 'https://covers.openlibrary.org/b/id/5546156-S.jpg',
          genre: ['Books and reading', 'Reading'],
          yearPublished: "2009",
          publishers: ["Litwin Books"],
          read: false
       }, 
      { 
          title: "Test Book",
          authors: ['someone', 'wrote a book'],
          coverImageUrl: 'https://covers.openlibrary.org/b/id/5546156-S.jpg',
          genre: ['Books and reading', 'Reading'],
          yearPublished: "2009",
          publishers: ["Litwin Books"],
          read: false
       }, 
      { 
          title: "Some Book",
          authors: ['someone', 'wrote a book'],
          coverImageUrl: 'https://covers.openlibrary.org/b/id/5546156-S.jpg',
          genre: ['Books and reading', 'Reading'],
          yearPublished: "2009",
          publishers: ["Litwin Books"],
          read: false
       }, 
      { 
          title: "One Book",
          authors: ['someone', 'wrote a book'],
          coverImageUrl: 'https://covers.openlibrary.org/b/id/5546156-S.jpg',
          genre: ['Books and reading', 'Reading'],
          yearPublished: "2009",
          publishers: ["Litwin Books"],
          read: false
       }, 
      { 
          title: "Two Book",
          authors: ['someone', 'wrote a book'],
          coverImageUrl: 'https://covers.openlibrary.org/b/id/5546156-S.jpg',
          genre: ['Books and reading', 'Reading'],
          yearPublished: "2009",
          publishers: ["Litwin Books"],
          read: false
       }, 
      { 
          title: "5 Book",
          authors: ['someone', 'wrote a book'],
          coverImageUrl: 'https://covers.openlibrary.org/b/id/5546156-S.jpg',
          genre: ['Books and reading', 'Reading'],
          yearPublished: "2009",
          publishers: ["Litwin Books"],
          read: false
       }, 
      { 
          title: "No Book",
          authors: ['someone', 'wrote a book'],
          coverImageUrl: 'https://covers.openlibrary.org/b/id/5546156-S.jpg',
          genre: ['Books and reading', 'Reading'],
          yearPublished: "2009",
          publishers: ["Litwin Books"],
          read: false
       }
];

  const ImageCell = ({cellData})=>(
    <img src={cellData}/>
  );

  return (
    <>
      <div className="mb-5">
        <h1>User Library</h1>
        <p className="lead">
          View Books Added to your Library.
        </p>

        <p>
          Your library consist of any book added to a collection or marked as read. You can add books to your library by using the search option at the top. Once a book is added, you can mark it as read or add it to a collection for future use.
        </p>

        <LinkButton
          color="primary"
          className="mt-5"
          to='Books'
        >
          Add New Book
        </LinkButton>
      </div>

      <Table
        width={800}
        height={500}
        headerHeight={20}
        rowHeight={60}
        rowCount={books.length}
        rowGetter={({index}) => books[index]}
        autoWidth={true}
        autoHeight={true}>
        <Column label="Title" dataKey="title" width={100} />
        <Column width={200} label="Authors" dataKey="authors" />
        <Column width={100} label="Cover" dataKey="coverImageUrl" cellRenderer={ImageCell}/>
        <Column width={100} label="Genre" dataKey="genre" />
        <Column width={200} label="Year Published" dataKey="yearPublished" />
        <Column width={150} label="Publishers" dataKey="publishers" />
        <Column width={100} label="read" dataKey="read" />
      </Table>
    </>
  );
};

export default withAuthenticationRequired(LibraryComponent, {
  onRedirecting: () => <Loading />,
});
