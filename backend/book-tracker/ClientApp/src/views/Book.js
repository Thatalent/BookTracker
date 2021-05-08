import React, { useState, useEffect } from "react";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { getConfig } from "../config";
import Loading from "../components/Loading";
import LinkButton from '../components/LinkButton';

const BookComponent = (props)=> {

    const { backend } = getConfig();
    const {getAccessTokenSilently} = useAuth0();
    // const {selectedBook} = this.props.location.state;
    // const [book, setBook] = useState(selectedBook || {});
    const [book, setBook] = useState({});
    let bookId = props.location.pathname.split('/')[2];

    let getBookUrl = `${backend}/Book/${bookId}`;
    useEffect(() => {
        getAccessTokenSilently().then((token)=>{
        fetch(getBookUrl,{
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then(res => res.json())
        .then((result) => {
            setBook(result);
            console.log(result);
        });
    });
    },[]);

    return(
        <>
        <LinkButton
          color="primary"
          className="mt-5"
          to={book.id+'/edit'}
        >
          Edit
        </LinkButton>
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