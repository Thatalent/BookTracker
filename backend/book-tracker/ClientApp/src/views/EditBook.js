import React, { useState, useEffect } from "react";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { getConfig } from "../config";
import Loading from "../components/Loading";
import { Button, Input, Form, FormGroup, Label } from "reactstrap";

const EditBookComponent = (props)=> {

    const { backend } = getConfig();
    const {getAccessTokenSilently} = useAuth0();
    // const {selectedBook} = this.props.location.state;
    // const [book, setBook] = useState(selectedBook || {});
    const [title, setTitle] = useState(""),
    [author, setAuthor] = useState(""),
    [coverImageUrl, setCover] = useState(""),
    [publisher, setPublisher] = useState(""),
    [genre, setGenre] = useState(""),
    [yearPublished, setYear] = useState(""),
    [pages, setPages] = useState(0),
    [read, setRead] = useState(false),
    [collection, setCollection] = useState(null);
    let bookId = props.location.pathname.split('/')[2];

    const [collections, setCollections] = useState([]);

    const bookUrl = `${backend}/Book/${bookId}`;
    const putUrl =  `${backend}/Book/`;
    const collectionUrl =  `${backend}/Collection/`;

    useEffect(() => {
        getAccessTokenSilently().then((token)=>{
            fetch(bookUrl,{
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
                }).then(res => res.json())
            .then((result) => {
                if (result.title) setTitle(result.title);
                if (result.author) setAuthor(result.author);
                if (result.coverImageUrl) setCover(result.coverImageUrl);
                if (result.genre) setGenre(result.genre);
                if (result.publisher) setPublisher(result.publisher);
                if (result.yearPublished) setYear(result.yearPublished);
                if (result.pages) setPages(result.pages);
                if (result.read) setRead(result.read);
                if (result.collection) setCollection(result.collection);
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
      }, []);
    

    const editBook = () => {
        getAccessTokenSilently().then((token)=>{
        fetch(putUrl,{
            method: 'PUT',
            body: JSON.stringify({
                title, author, yearPublished, genre, coverImageUrl, pages, publisher, id: bookId, read, collection, collectionId: collection? collection.id : null
            }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then(res => res.json())
        .then((result) => {
            if (result.title) setTitle(result.title);
            if (result.author) setAuthor(result.author);
            if (result.coverImageUrl) setCover(result.coverImageUrl);
            if (result.genre) setGenre(result.genre);
            if (result.publisher) setPublisher(result.publisher);
            if (result.pages) setPages(result.pages);
            if (result.read) setPages(result.read);
            console.log(result);
        });
    });
    };

    const handleInputChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        setRead(value);
      };

    const onDropdownSelected = (e) => {           
        if (e.target.value !== '') {
            const collect = JSON.parse(e.target.value);
            setCollection(collect);
        }
    };

    const deleteBook = () => {
        getAccessTokenSilently().then((token)=>{
            fetch(bookUrl,{
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
        });
    }

    return(
        <>
        <Button onClick={deleteBook} color='red'>Delete</Button>
        <Form>
      <FormGroup>

            <Label>Title</Label>
            <Input type="value" value={title} onChange={(event) => {
                setTitle(event.target.value);
            }}/>
            </FormGroup>
            <FormGroup>
            <Label>
                <Input type="checkbox" checked={read} name="read" onChange={handleInputChange}/>
                Read
            </Label>
            </FormGroup>
            <FormGroup>
            <Label for="exampleSelect">Select</Label>
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

            <Label>Cover: </Label>

            <img src={coverImageUrl}/>
            <Input type="value"  value={coverImageUrl} onChange={(event) => {
                setCover(event.target.value)
            }}/>
            <Label>Author</Label>

            <Input type="value"  type="text" value={author} onChange={(event) => {
                setAuthor(event.target.value)
            }}/>

            <Label>Publisher</Label>

            <Input type="value"  value={publisher} onChange={(event) => {
                setPublisher(event.target.value)
            }}/>

            <Label>Genre</Label>
            <Input type="value"  value={genre} onChange={(event) => {
                setGenre(event.target.value);
            }}/>

            <Label>Year Published</Label>
            <Input type="value"  value={yearPublished} onChange={(event) => {
                setYear(event.target.value);
            }}/>
            <Label>Number of Pages</Label>
            <Input type="value"  value={pages} onChange={(event) => {
                setPages(event.target.value);
            }}/>
            </FormGroup>
            <Button onClick={editBook}>Submit</Button>
            </Form>
        </>
    );

};

export default withAuthenticationRequired(EditBookComponent, {
    onRedirecting: () => <Loading />,
});