import React, { useState, useEffect } from "react";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { getConfig } from "../config";
import Loading from "../components/Loading";
import { Button, Input, Form, FormGroup, Label, Spinner } from "reactstrap";
import { Redirect } from "react-router";

const NewCollectionComponent = (props)=> {

    const { backend } = getConfig();
    const {getAccessTokenSilently, user} = useAuth0();
    const userId = user.sub;
    const [loading, setLoading]=  useState(false);
    const [name, setName] = useState(""),
    [redirect, setRediect] = useState(null);

    const collectionUrl = `${backend}/collection/`;

    const addCollection = () => {
        setLoading(true);
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
        }).then(()=> setRediect('/library')).finally(()=> setLoading(false));
    });
    };

    return(
        <>
        {redirect && (  
            <Redirect to={redirect} />
        )}

        <Form>
      <FormGroup>

            <Label>Name</Label>
            <Input type="value" value={name} onChange={(event) => {
                setName(event.target.value);
            }}/>
            </FormGroup>
            <div style={{display: 'flex'}}>
            <Button onClick={addCollection}>Submit</Button>
            {loading && (
                <Spinner type="grow" color="primary" />
            )}
            </div>
            </Form>
        </>
    );

};

export default withAuthenticationRequired(NewCollectionComponent, {
    onRedirecting: () => <Loading />,
});