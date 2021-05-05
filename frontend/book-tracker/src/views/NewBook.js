import React, { useState, useEffect } from "react";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { getConfig } from "../config";
import Loading from "../components/Loading";
import { Button, Input, Form, FormGroup, Label } from "reactstrap";

const NewBookComponent = (props)=> {

    const { backend } = getConfig();
    const {user} = useAuth0();
    const userId = user.sub;
    // const {selectedBook} = this.props.location.state;
    // const [book, setBook] = useState(selectedBook || {});
    const [title, setTitle] = useState(""),
    [author, setAuthor] = useState(""),
    [coverImageUrl, setCover] = useState(""),
    [publisher, setPublisher] = useState(""),
    [genre, setGenre] = useState(""),
    [yearPublished, setYear] = useState(""),
    [pages, setPages] = useState(0);
    let bookId = props.location.pathname.split('/')[2];

    const bookUrl = `${backend}/Book/${userId}`;

    useEffect(() => {
        let result = props.location.state;
        if(result){
            if (result.title) setTitle(result.title);
            if (result.author) setAuthor(result.author);
            if (result.coverImageUrl) setCover(result.coverImageUrl);
            if (result.genre) setGenre(result.genre);
            if (result.publisher) setPublisher(result.publisher);
            if (result.yearPublished) setYear(result.yearPublished);
            if (result.pages) setPages(result.pages);
        }
        console.log(result);
    }, []);
    

    const editBook = () => {
        fetch(bookUrl,{
            method: 'PUT',
            body: JSON.stringify(title, author, yearPublished, genre, coverImageUrl, pages, publisher),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
            .then((result) => {
            if (result.title) setTitle(result.title);
            if (result.author) setAuthor(result.author);
            if (result.coverImageUrl) setCover(result.coverImageUrl);
            if (result.genre) setGenre(result.genre);
            if (result.publisher) setPublisher(result.publisher);
            if (result.pages) setPages(result.pages);
            console.log(result);
        });
    };

    return(
        <>
        <Form>
      <FormGroup>
            <Label>Title</Label>
            <Input type="value" value={title} onChange={(event) => {
                setTitle(event.target.value);
            }}/>
            <Label>Cover</Label>

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
            <Button onSubmit={editBook}>Submit</Button>
            </Form>
        </>
    );

};

export default withAuthenticationRequired(NewBookComponent, {
    onRedirecting: () => <Loading />,
});