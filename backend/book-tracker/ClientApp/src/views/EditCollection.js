import React, { useState, useEffect } from "react";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { getConfig } from "../config";
import Loading from "../components/Loading";
import { Button, Input, Form, FormGroup, Label, Spinner } from "reactstrap";
import { Redirect } from "react-router";

const EditCollectionComponent = (props)=> {

    const [loading, setLoading]=  useState(false),
    [redirect, setRediect] = useState(null);
    const { backend } = getConfig();
    const {getAccessTokenSilently, user} = useAuth0();
    const userId = user.sub;
    // const {selectedBook} = this.props.location.state;
    // const [book, setBook] = useState(selectedBook || {});
    const [name, setName] = useState("");
    let collectionId = props.location.pathname.split('/')[2];

    const collectionUrl = `${backend}/collection/${collectionId}`;
    const putUrl =  `${backend}/collection/`;

    useEffect(() => {
        setLoading(true);
        getAccessTokenSilently().then((token)=>{
            fetch(collectionUrl,{
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
                }).then(res => res.json())
            .then((result) => {
                if (result) setName(result.name);
                console.log(result);
            }).finally(()=>{
                setLoading(false);
            });
        });
      }, []);
    

    const editCollection = () => {
        getAccessTokenSilently().then((token)=>{
        fetch(putUrl,{
            method: 'PUT',
            body: JSON.stringify({
                userId, id: collectionId, name
            }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then(() => setRediect('/library')).finally(()=>{
            setLoading(false);
        });
    });
    };

    const deleteCollection = () => {
        getAccessTokenSilently().then((token)=>{
            fetch(collectionUrl,{
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
        {redirect && (  
            <Redirect to={redirect} />
        )}
        <Button onClick={deleteCollection} color='red'>Delete</Button>
        <Form>
      <FormGroup>

            <Label>Name</Label>
            <Input type="value" value={name} onChange={(event) => {
                setName(event.target.value);
            }}/>
            </FormGroup>
            <div style={{display: 'flex'}}>
            <Button onClick={editCollection}>Submit</Button>
            {loading && (
                <Spinner type="grow" color="primary" />
            )}
            </div>
            </Form>
        </>
    );

};

export default withAuthenticationRequired(EditCollectionComponent, {
    onRedirecting: () => <Loading />,
});