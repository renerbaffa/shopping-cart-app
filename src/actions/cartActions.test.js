import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import {
  ADD_TO_CART,
  addProductToCart,
  addToCart,
  decreaseProductQuantity,
  INITIAL_STATE,
  REMOVE_FROM_CART,
  removeFromCart,
  removeProductFromCart,
  sumProductQuantity,
} from './cartActions';

import PRODUCTS from '../mocks/Products';
import convertToIdsAndContent from '../normalizers/productsNormalize';
import ITEMIZED_CART from '../mocks/Cart';

const NORMALIZED_PRODUCTS = convertToIdsAndContent(PRODUCTS);
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
const CART = { ids: [], content: {} };
const INITIAL_STORE = {
  cart: CART,
  products: NORMALIZED_PRODUCTS,
};

describe('cartActions', () => {
  describe('addToCart', () => {
    it('should return correct payload', () => {
      const product = PRODUCTS[0];
      expect(addToCart(product)).toEqual({
        type: ADD_TO_CART,
        payload: {
          id: product.productID,
          data: product,
        },
      });
    });
  });

  describe('sumProductQuantity', () => {
    let product;

    beforeEach(() => {
      product = PRODUCTS[0];
    });

    it('should set quantity as 1 on first time product is in the cart', () => {
      expect(sumProductQuantity(product).quantity).toBe(1);
    });
    
    it('should increment quantity when in the cart already', () => {
      expect(
        sumProductQuantity({
          ...product,
          quantity: 5,
        }).quantity
      ).toBe(6);
    });
  });

  describe('addProductToCart', () => {
    it('should dispatch addToCart action with product as parameter', () => {
      const product = PRODUCTS[0];
      const store = mockStore(INITIAL_STORE);
  
      store.dispatch(addProductToCart(product.productID));
      expect(store.getActions()[0]).toEqual({
        type: ADD_TO_CART,
        payload: {
          id: product.productID,
          data: {
            ...product,
            quantity: 1,
          }
        }
      });
    });

    it('should sum up the amount of items when present in cart already', () => {
      const product = PRODUCTS[1];
      const store = mockStore({
        ...INITIAL_STORE,
        cart: ITEMIZED_CART,
      });
  
      store.dispatch(addProductToCart(product.productID));
      expect(store.getActions()[0]).toEqual({
        type: ADD_TO_CART,
        payload: {
          id: product.productID,
          data: {
            ...ITEMIZED_CART.content[product.productID],
            quantity: 5,
          }
        }
      });
    });
  });

  describe('decreaseProductQuantity', () => {
    let product;

    beforeEach(() => {
      product = {
        ...PRODUCTS[0],
        quantity: 3,
      };
    });

    it('should decrease product quantity by 1', () => {
      expect(decreaseProductQuantity(product).quantity).toBe(product.quantity - 1);
    });
    
    it('should not change quantity when it is 0', () => {
      product.quantity = 0;
      expect(decreaseProductQuantity(product).quantity).toBe(0);
    });
  });

  describe('removeFromCart', () => {
    it('should return correct payload', () => {
      const product = {
        ...PRODUCTS[0],
        quantity: 3,
      };
      expect(removeFromCart(product)).toEqual({
        type: REMOVE_FROM_CART,
        payload: {
          id: product.productID,
          data: product,
        },
      });
    });
  });

  describe('removeProductFromCart', () => {
    it('should dispatch removeFromCart action removing product from cart', () => {
      const product = ITEMIZED_CART.content[ITEMIZED_CART.ids[1]];
      const store = mockStore({
        ...INITIAL_STORE,
        cart: ITEMIZED_CART,
      });
  
      store.dispatch(removeProductFromCart(product.productID));
      expect(store.getActions()[0]).toEqual({
        type: REMOVE_FROM_CART,
        payload: {
          id: product.productID,
          data: {
            ...product,
            quantity: product.quantity - 1,
          }
        }
      });
    });
  });
});
