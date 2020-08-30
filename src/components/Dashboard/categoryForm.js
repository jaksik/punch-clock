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

    const [formData, setFormData] = useState({});

    const [modal, setModal] = useState(false);

    const toggle = () => {
        if (modal === false) {
            setFormData({ name: "", uid: "", theme: "" })
            setModal(true);
        } else {
            setFormData({ name: "", uid: "", theme: "" })
            setModal(false);
        }

    };

    const handleChange = e => {

        const { name, value } = e.target;

        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const createCategory = () => firebase.createCategory(authUser.uid).push({
        name: formData.name,
        userId: authUser.uid,
        theme: formData.theme,
    }).then((e) => {
        console.log("EEEE: ", e);
        setFormData({ name: "", uid: "", theme: "" })
        setModal(false);
    });

    return (
        <div>
            <Modal isOpen={modal}>
                <ModalBody>
                    <Label>Category Name:</Label>

                    <Input
                        value={formData.name}
                        type="text"
                        onChange={handleChange}
                        name="name"
                        placeholder="Category Name"
                    />
                    <Label>Them Color:</Label>
                    <Input type="select" name="theme" id="cars" value={formData.theme} onChange={handleChange}>
                        <option value="success">Green</option>
                        <option value="info">Blue</option>
                        <option value="warning">Yellow</option>
                        <option value="danger">Red</option>
                    </Input>
                    <Button onClick={createCategory} color="primary">Create Category</Button>
                    <Button color="secondary" onClick={toggle} className="m-3">Cancel</Button>{' '}
                </ModalBody>
            </Modal>
            <Button color="primary" onClick={toggle} className="m-3">+ Category</Button>{' '}
        </div>
    )
};

const condition = authUser => !!authUser;
const CategoryForm = withFirebase(Form);

export default withAuthorization(condition)(CategoryFormComponent);