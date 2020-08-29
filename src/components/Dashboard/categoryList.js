import React, { Component } from 'react';
import { compose } from 'recompose';
import { Link } from 'react-router-dom';

import { withFirebase } from '../Firebase';
import { withAuthorization } from '../Session';
import { ListGroup, ListGroupItem, Modal } from 'reactstrap';
import { PieChart } from 'react-minimal-pie-chart';
import CategoryModal from './categoryModal'

class CategoryListComponent extends Component {
  constructor(props) {
    super(props);
 
    this.state = {
      loading: false,
      categories: [],
    };
  }
 
  componentDidMount() {
    console.log("Props: ", this.props)
    this.setState({ loading: true });
 
    this.props.firebase.categories(this.props.authUser.uid).on('value', snapshot => {
      const categoryObject = snapshot.val();
 
     if (categoryObject) {
      const CategoryList = Object.keys(categoryObject).map(key => ({
        ...categoryObject[key],
        uid: key,
      }));
      this.setState({
        categories: CategoryList,
        loading: false,
      });
     }

     console.log("Category List: ", this.state.categories)
      
    });
  }

  componentWillUnmount() {
    this.props.firebase.categories().off();
  }
 
  render() {
    const { categories, loading } = this.state;
 
    return (
      <div>
          <PieChart
                data={[
                    { title: 'One', value: 10, color: '#E38627' },
                    { title: 'Two', value: 15, color: '#C13C37' },
                    { title: 'Three', value: 20, color: '#6A2135' },
                ]}
                label={({ dataEntry }) => dataEntry.title}
                style={{ padding: `30px 80px 15px` }}
            />
        <h1>Categories</h1>
    
        {loading && <div>Loading ...</div>}
 
        <CategoryList categories={categories} />
      </div>
    );
  }
}

const CategoryList = ({ categories }) => (
  <ListGroup>
    {categories.map(category => (
      <Link to={`/category/${category.uid}`}>
      <ListGroupItem key={category.uid} color={category.theme}>
        {category.name}
        <CategoryModal categoryUid={category.uid}/>
      </ListGroupItem>
      </Link>
    ))}
  </ListGroup>
);
 
const condition = authUser => !!authUser;

 
export default compose(
  withAuthorization(condition),
  withFirebase,
)(CategoryListComponent);;