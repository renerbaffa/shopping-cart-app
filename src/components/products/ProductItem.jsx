import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import withProduct from '../../HOCs/withProduct';

import Image from '../shared/Image';
import Button from '../shared/Button';

import './ProductItem.css';

export const ProductItem = ({
  className,
  description,
  image,
  index,
  name,
  onAddProduct,
  unitPrice,
  unitsInStock,
  ...other
}) => (
  <div className={cx(
    className,
    'ProductItem-container',
    { 'ProductItem-container-odd' : index % 2 }
  )}>
    <Image
      className="ProductItem-image"
      alt={name}
      src={image}
    />
    <div className="ProductItem-description-container">
      <div className="ProductItem-name">{name}</div>
      <div className="ProductItem-description">{description}</div>
    </div>
    <div className="ProductItem-description-container2">
      <div>Price: <b>${unitPrice}</b></div>
      <div><b>{unitsInStock}</b> in stock</div>
    </div>
    <div className="ProductItem-bottom">
      {
        unitsInStock > 0 ?
            <Button
              className="ProductItem-button"
              onClick={onAddProduct}
            >
              +
            </Button> :
          null
        }
    </div>
  </div>
);

ProductItem.propTypes = {
  className: PropTypes.string,
  description: PropTypes.string,
  image: PropTypes.string,
  index: PropTypes.number,
  name: PropTypes.string,
  onAddProduct: PropTypes.func,
  unitPrice: PropTypes.number,
  unitsInStock: PropTypes.number,
}

ProductItem.defaultProps = {
  className: '',
  description: '',
  image: '',
  index: 0,
  name: '',
  onAddProduct: () => {},
  unitPrice: 0,
  unitsInStock: 0,
}

export default withProduct(ProductItem);
