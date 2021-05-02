import React, { useState } from "react";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { getConfig } from "../config";
import Loading from "../components/Loading";
import { Button, Input } from "reactstrap";

const EditBookComponent = ()=> {

    const { backend } = getConfig();
    const {user} = useAuth0();
    const userId = userId.sub;
    // const {selectedBook} = this.props.location.state;
    // const [book, setBook] = useState(selectedBook || {});
    const [book, setBook] = useState({});
    let bookId = this.props.location.pathname.split('/')[2];

    const bookUrl = `${backend}/Book/${bookId}/${userId}`;

    useEffect(() => {
        fetch(bookUrl).then(res => res.json())
        .then((result) => {
            setBook(result);
            console.log(result);
        });
      }, []);
    

    const editBook = () => {
        fetch(bookUrl,{
            method: 'PUT',
            mode: 'CORS',
            body: JSON.stringify(book),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
        .then((result) => {
        setBook(result);
        console.log(result);
    });
    };

    return(
        <>
        <Form>
      <FormGroup>

            <Input value={book.title} onChange={(event) => {
                book.title = event.target.value;
                setBook(book)
            }}/>
            <img src={book.coverImageUrl}/>
            <Input value={book.coverImageUrl} onChange={(event) => {
                book.coverImageUrl = event.target.value;
                setBook(book)
            }}/>
            <Input value={book.author} onChange={(event) => {
                book.author = event.target.value;
                setBook(book)
            }}/>
            <Input value={book.publisher} onChange={(event) => {
                book.publisher = event.target.value;
                setBook(book)
            }}/>
            <Input value={book.genre} onChange={(event) => {
                book.genre = event.target.value;
                setBook(book)
            }}/>
            <Input value={book.yearPublished} onChange={(event) => {
                book.yearPublished = event.target.value;
                setBook(book)
            }}/>
            <Input value={book.pages} onChange={(event) => {
                book.pages = event.target.value;
                setBook(book)
            }}/>
            </FormGroup>
            <Button onSubmit={editBook}>Submit</Button>
            </Form>
        </>
    );

};

export default withAuthenticationRequired(EditBookComponent, {
    onRedirecting: () => <Loading />,
});