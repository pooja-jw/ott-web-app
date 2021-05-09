import React from 'react';

import { render } from '../../testUtils';
import MenuButton from '../MenuButton/MenuButton';

import Sidebar from './Sidebar';

describe('<SideBar />', () => {
  const playlistMenuItems = [<MenuButton key="key" label="Home" to="/" />];
  test('renders sideBar', () => {
    const { container } = render(<Sidebar isOpen={true} onClose={jest.fn()} playlistMenuItems={playlistMenuItems} />);

    expect(container).toMatchSnapshot();
  });
});
