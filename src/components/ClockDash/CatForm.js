import React, { useState, useEffect } from 'react';
import { Button, Input, Label, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Redirect } from 'react-router-dom'

const ModalExample = ({ categoryInfo, categoryId, firebase }) => {
    const [formData, setFormData] = useState({ name: "", uid: "", theme: "" });

    const [modal, setModal] = useState(false);

    const [nestedModal, setNestedModal] = useState(false);

    const [redirect, initiateRedirect] = useState(false);

    const toggle = () => {
        setFormData(categoryInfo)
        setModal(!modal);
    };

    const toggleNested = () => {
        setNestedModal(!nestedModal);
    }

    const handleChange = e => {

        const { name, value } = e.target;

        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const editCategory = () => {
        firebase.editCategory(categoryInfo.userId, categoryId).set(formData).then(() => {
            setModal(false);
        });
    }

    const deleteCategory = () => {
        firebase.editCategory(categoryInfo.userId, categoryId).remove().then(() => {
            initiateRedirect(true);
        });
    }

    return (
        <div>
            {redirect && <Redirect to="/dashboard" />}
            <Button color="secondary" size="sm" onClick={toggle}>Edit</Button>
            <Modal isOpen={modal}>
                <ModalBody>
                    <Label>Category Name:</Label>

                    <Input
                        value={formData.name}
                        type="text"
                        onChange={handleChange}
                        name="name"
                        placeholder="Category Name"
                        required
                    />
                    <Label>Them Color:</Label>
                    <Input type="select" name="theme" id="cars" value={formData.theme} onChange={handleChange}>
                        <option value="success">Green</option>
                        <option value="info">Blue</option>
                        <option value="warning">Yellow</option>
                        <option value="danger">Red</option>
                    </Input>

                    <Button color="danger" size="sm" onClick={toggleNested}>Delete Category</Button><br />
                    <Modal isOpen={nestedModal} toggle={toggleNested}>
                        <ModalHeader>Delete: {formData.name}</ModalHeader>
                        <ModalBody>Are you sure you want to delete {formData.name} and all data associated with this category? This action is permanent and can't be undone.</ModalBody>
                        <ModalFooter>
                            <Button color="danger" onClick={deleteCategory}>Delete</Button>{' '}
                            <Button color="secondary" onClick={toggleNested}>Cancel</Button>
                        </ModalFooter>
                    </Modal>

                    <Button onClick={editCategory} color="primary">Edit Category</Button>
                    <Button color="secondary" onClick={toggle} className="m-3">Cancel</Button>{' '}
                </ModalBody>
            </Modal>
        </div>
    );
}

export default ModalExample;