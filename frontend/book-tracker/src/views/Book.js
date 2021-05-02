import React, { useState } from "react";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { getConfig } from "../config";
import Loading from "../components/Loading";

const BookComponent = ()=> {

    const { backend } = getConfig();
    const {user} = useAuth0();
    const userId = userId.sub;
    // const {selectedBook} = this.props.location.state;
    // const [book, setBook] = useState(selectedBook || {});
    const [book, setBook] = useState({});
    let bookId = this.props.location.pathname.split('/')[2];

    let getBookUrl = `${backend}/Book/${bookId}/${userId}`;

    fetch(getBookUrl).then(res => res.json())
    .then((result) => {
        setBook(result);
        console.log(result);
    });

    return(
        <>
            <h2>{book.title}</h2>
            <img src={book.coverImageUrl}/>
            <h2>Author:</h2><p>{book.author}</p>
            <h2>Publisher:</h2><p>{book.publisher}</p>
            <h2>Genre:</h2><p>{book.genre}</p>
            <h2>Year Published:</h2><p>{book.yearPublished}</p>
            <h2>Pages:</h2><p>{book.pages}</p>
        </>
    );

};

export default withAuthenticationRequired(BookComponent, {
    onRedirecting: () => <Loading />,
});