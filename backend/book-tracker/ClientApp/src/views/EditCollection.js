import React, { useState, useEffect } from "react";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { getConfig } from "../config";
import Loading from "../components/Loading";
import { Button, Input, Form, FormGroup, Label } from "reactstrap";

const EditCollectionComponent = (props)=> {

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
        <Button onClick={deleteCollection} color='red'>Delete</Button>
        <Form>
      <FormGroup>

            <Label>Name</Label>
            <Input type="value" value={name} onChange={(event) => {
                setName(event.target.value);
            }}/>
            </FormGroup>
            <Button onClick={editCollection}>Submit</Button>
            </Form>
        </>
    );

};

export default withAuthenticationRequired(EditCollectionComponent, {
    onRedirecting: () => <Loading />,
});