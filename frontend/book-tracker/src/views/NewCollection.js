import React, { useState, useEffect } from "react";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { getConfig } from "../config";
import Loading from "../components/Loading";
import { Button, Input, Form, FormGroup, Label } from "reactstrap";

const NewCollectionComponent = (props)=> {

    const { backend } = getConfig();
    const {getAccessTokenSilently, user} = useAuth0();
    const userId = user.sub;

    const [name, setName] = useState("");

    const collectionUrl = `${backend}/collection/`;

    const addCollection = () => {
        getAccessTokenSilently().then((token)=>{
        fetch(collectionUrl,{
            method: 'POST',
            body: JSON.stringify({
                userId, name
            }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
    });
    };

    return(
        <>
        <Form>
      <FormGroup>

            <Label>Name</Label>
            <Input type="value" value={name} onChange={(event) => {
                setName(event.target.value);
            }}/>
            </FormGroup>
            <Button onClick={addCollection}>Submit</Button>
            </Form>
        </>
    );

};

export default withAuthenticationRequired(NewCollectionComponent, {
    onRedirecting: () => <Loading />,
});