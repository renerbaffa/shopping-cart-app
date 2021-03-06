import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import ConnectedProductsContainer, { ProductsContainer } from './ProductsContainer';

import SearchForm from '../components/products/SearchForm';

import { GRID, LIST } from '../constants/ViewOptions';
import { RETRIEVING, RETRIEVED } from '../constants/loadingStatus';

jest.mock('../components/products/ProductsList', () => 'ProductsList');

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('<ProductsContainer />', () => {
  let defaultComponent;
  let onFetchProducts;
  let wrapper;

  beforeEach(() => {
    onFetchProducts = jest.fn();
    defaultComponent = (
      <ProductsContainer
        onFetchProducts={onFetchProducts}
      />
    );
    wrapper = shallow(defaultComponent);
  });

  it('should render correctly', () => {
    const switchViewOptions = renderer.create(defaultComponent).toJSON();
    expect(switchViewOptions).toMatchSnapshot();
  });

  it('should fetch projects when did mount', () => {
    onFetchProducts.mockReset();
    wrapper.instance().componentDidMount();
    expect(onFetchProducts).toHaveBeenCalled();
  });

  it('should update state with new view when handling change', () => {
    expect(wrapper.state().currentView).toBe(GRID);
    wrapper.instance().handleSwitchView(LIST);
    expect(wrapper.state().currentView).toBe(LIST);
  });

  it('should update filter state when clicking on Search button', () => {
    const newText = 'New text';
    expect(wrapper.state().filterText).toBe('');
    wrapper.find(SearchForm).props().onFilter(newText);
    expect(wrapper.state().filterText).toBe(newText);
  });

  it('should render empty div for size purpose when is loading', () => {
    wrapper.setProps({ isLoading: true });
    expect(wrapper.find('.ProductsContainer-empty')).toHaveLength(1);
  });

  describe('on component connect to redux isLoading flag', () => {
    it('should set isLoading as false when flag is not RETRIEVING', () => {
      const store = mockStore({
        communication: { areProjectsLoading: RETRIEVED },
      });

      wrapper = shallow(
        <ConnectedProductsContainer
          store={store}
          onFetchProducts={onFetchProducts}
        />
      );

      expect(wrapper.props().isLoading).toBeFalsy();
    });

    it('should set isLoading as true when flag is RETRIEVING', () => {
      const store = mockStore({
        communication: { areProjectsLoading: RETRIEVING },
      });

      wrapper = shallow(
        <ConnectedProductsContainer
          store={store}
          onFetchProducts={onFetchProducts}
        />
      );

      expect(wrapper.props().isLoading).toBeTruthy();
    });
  });
});
