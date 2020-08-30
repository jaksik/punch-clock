import React, { useState } from 'react';

import { withAuthorization } from '../Session';
import { withFirebase } from '../Firebase';
import { Button, Input, Label, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const CategoryFormComponent = ({ authUser }) => {
    return (
        <div className="d-flex justify-content-end">
            <CategoryForm authUser={authUser} />
        </div>
    )
};

const Form = ({ authUser, firebase }) => {

    // console.log("Form Props: ", props)
    const [state, setState] = useState({ name: "", uid: "", theme: "success" });

    const [modal, setModal] = useState(false);

    const toggle = () => setModal(!modal);

    const handleChange = e => {

        const { name, value } = e.target;

        setState(prevState => ({
            ...prevState,
            [name]: value
        }));
        console.log("State: ", state)
    };

    const createCategory = () => firebase.createCategory(authUser.uid).push({
        name: state.name,
        userId: authUser.uid,
        theme: state.theme,
    });

    return (
        <div>
            <Modal isOpen={modal}>
                <ModalBody>
                <Label>Category Name:</Label>

                <Input
                value={state.name}
                type="text"
                onChange={handleChange}
                name="name"
                placeholder="Category Name"
            />
            <Label>Them Color:</Label>
            <Input type="select" name="theme" id="cars" value={state.theme} onChange={handleChange}>
                <option value="success">Green</option>
                <option value="info">Blue</option>
                <option value="warning">Yellow</option>
                <option value="danger">Red</option>
            </Input>
            <button onClick={createCategory}>Create Category</button>
       
                </ModalBody>
            </Modal>
        <Button color="primary" onClick={toggle} className="m-3">+ Category</Button>{' '}

        </div>
    )
};


const condition = authUser => !!authUser;
const CategoryForm = withFirebase(Form);

export default withAuthorization(condition)(CategoryFormComponent);