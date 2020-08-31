import React, { Component } from 'react';
import { compose } from 'recompose';
import { Link } from 'react-router-dom';

import { withFirebase } from '../Firebase';
import { withAuthorization } from '../Session';
import { ListGroup, ListGroupItem, Modal, Label, Input, Row, Col } from 'reactstrap';
import { PieChart } from 'react-minimal-pie-chart';
import CategoryForm from './categoryForm';

class CategoryListComponent extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      categories: [],
    };
  }

  componentDidMount() {
    this._isMounted = true;
    console.log("Component Mounted")
    this.setState({ loading: true });
    console.log("Props: ", this.props)
    this.props.firebase.categories(this.props.authUser.uid).on('value', snapshot => {
      const categoryObject = snapshot.val();

      if (categoryObject && this._isMounted) {
        const CategoryList = Object.keys(categoryObject).map(key => ({
          ...categoryObject[key],
          uid: key,
        }));
        this.setState({
          categories: CategoryList,
          loading: false,
        });
      }
    });

  }

  componentWillUnmount() {
    this._isMounted = false;

    console.log("COmponent Unmounted")
    this.props.firebase.categories().off();
    this.props.firebase.createCategory().off();
    this.setState({
      categories: [],
      loading: false,
    });
  }

  // createCategory = () => {
  //   this.props.firebase.createCategory(this.props.authUser.uid).push("hello").then(() => {
  //     console.log("Hello")
  //   })
  // }
  // redirect = (catId) => {
  //   this.props.firebase.editCategory(this.props.authUser.uid, this.state.categories).remove().then((e) => {
  //     console.log("e", e)
  //     console.log("Removed")
  //   })

 // }
  render() {
    const { categories, loading } = this.state;

    return (
      <div>

        <h1 style={{ textAlign: `center` }}>Categories</h1>
        <CategoryForm authUser={this.props.authUser} />
        {/* <button onClick={this.redirect()}>Delete</button>

        <button onClick={this.createCategory}>Create Category</button> */}
        {loading && <div>Loading ...</div>}
        <CategoryList categories={categories} />
      </div>
    );
  }
}

const CategoryList = ({ categories }) => (
  <div>
    <Row>
      <Col xs={6}>
        <Label>Sort:</Label>
        <Input type="select" name="theme" id="cars">
          <option value="success">Most Recent</option>
          <option value="info">Blue</option>
          <option value="warning">Yellow</option>
          <option value="danger">Red</option>
        </Input>
      </Col>
      <Col xs={6}>
        <Label>Filter:</Label>
        <Input type="select" name="theme" id="cars">
          <option value="success">today</option>
          <option value="info">This week</option>
          <option value="warning">This Month</option>
          <option value="danger">Year</option>
          <option value="danger">All Time</option>
        </Input>
      </Col>
    </Row>
    <ListGroup>
      {categories.map((category, index) => (
        <Link to={`/category/${category.uid}`} key={index}>
          <ListGroupItem key={category.uid} color={category.theme || "success"} className="p-4">
            {category.name}

          </ListGroupItem>
        </Link>
      ))}
    </ListGroup>
  </div>
);

const condition = authUser => !!authUser;


export default compose(
  withAuthorization(condition),
  withFirebase,
)(CategoryListComponent);;