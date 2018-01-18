import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { connect } from 'react-redux';

import SearchForm from '../components/products/SearchForm';
import SwitchViewOptions from '../components/products/SwitchViewOptions';
import ProductsList from '../components/products/ProductsList';

import { fetchProjects } from '../actions/productsActions';

import { GRID } from '../constants/ViewOptions';

import './ProductsContainer.css';

export class ProductsContainer extends Component {
  static propTypes = {
    onFetchProjects: PropTypes.func.isRequired,
  };

  state = {
    currentView: GRID,
  };
  
  componentDidMount() {
    this.props.onFetchProjects();
  }

  handleSwitchViewChange = newView => this.setState({ currentView: newView });

  render() {
    const { currentView } = this.state;

    return (
      <div className="ProductsContainer-container">
        <div className={cx('limited-width', 'ProductsContainer-border')}>
          <div className="space-between">
            <SearchForm />
            <SwitchViewOptions
              currentView={currentView}
              onSwitchView={this.handleSwitchViewChange}
            />
          </div>
          <div className="ProductsContainer-content">
            <ProductsList
              currentView={currentView}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  null,
  {
    onFetchProjects: fetchProjects,
  }
)(ProductsContainer);