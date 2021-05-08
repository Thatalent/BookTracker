import React, { useState, useEffect } from "react";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { getConfig } from "../config";
import Loading from "../components/Loading";
import {Column, Table} from 'react-virtualized';
import 'react-virtualized/styles.css'; // only needs to be imported once
import LinkButton from '../components/LinkButton';
import { Link } from "react-router-dom";
import { Input, Label } from "reactstrap";


export const LibraryComponent = () => {
  const { backend } = getConfig();
  const {getAccessTokenSilently} = useAuth0();
  const [collection, setCollection] = useState(null);
  const [bookList, setBookList] = useState([]);
  const [books, setBooks] = useState([])

  const [collections, setCollections] = useState([]);

  const collectionUrl =  `${backend}/Collection/`;

  let getBookUrl = `${backend}/Book/`;
  useEffect(() => {
      getAccessTokenSilently().then((token)=>{
        fetch(getBookUrl,{
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then(res => res.json())
        .then((result) => {
            setBooks(result);
            console.log(result);
        });
        fetch(collectionUrl,{
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
          }
          }).then(res => res.json())
          .then((result) => {
              if (result) setCollections(result);
              console.log(result);
          });
      });
  },[]);

  const Cell = ({ Book, Field, style }) => (
    <div style={style}>
      Book[Field] 
    </div>
  );

  const BookSelectorCell = ({rowData}) => {
    console.log(rowData);
    return <Link
          color="primary"
          className="mt-5"
          to={{
            pathname:'book/'+rowData.id,
            state: {
              title: rowData.title,
              author: rowData.author_name,
              coverImageUrl: rowData.coverUrl,
              genre: rowData.subject,
              yearPublished: rowData.publish_year,
              publisher: rowData.publisher
            }
          }}>
          {rowData.title}
        </Link>
  };

  const onDropdownSelected = (e) => {           
    if (e.target.value !== '') {
        const collect = JSON.parse(e.target.value);
        setCollection(collect);
    }
  };

  useEffect(()=> {
    if(collection){
      setBookList(books.filter(book => book.collectionId == collection.id));
    } else{
      setBookList(books);
    }
  }, [collection, books]);

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
        <LinkButton
          color="primary"
          className="mt-5"
          to='collection/new'
        >
          Add New Collection
        </LinkButton>

        { collection && (

          <LinkButton
          color="primary"
          className="mt-5"
          to={'collection/'+collection.id+'/edit'}
          >
          Edit Collection
          </LinkButton>
        )}

        <br/>
        <br/>
        <Label>Collection:</Label>
        <Input type="select" name="select" id="collectionSelect" onChange={onDropdownSelected}>
                <option
                    key="none"
                    name="none"
                    value="null">
                    None
                </option>
            {collections.map(collection => 
                <option
                    key={collection.id}
                    name={collection.id}
                    value={JSON.stringify(collection)}>
                    {collection.name}
                </option>
                )}
          </Input>
      </div>

      <Table
        width={800}
        height={500}
        headerHeight={20}
        rowHeight={60}
        rowCount={bookList.length}
        rowGetter={({index}) => bookList[index]}
        autoWidth={true}
        autoHeight={true}>
        <Column label="Title" dataKey="title" width={100} cellRenderer={BookSelectorCell}/>
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
