// Link.react.test.js
import React from 'react';
import {
  render, screen, cleanup,
} from '@testing-library/react';
import PaginationNav from './PaginationNav';

afterEach(cleanup);

const pagination = { size: 5, page: 1 };

const updateFunc = jest.fn();

it('Page selector display: 2 items / size = 5', async () => {
  const component = render(
    <PaginationNav.PageSelector
      pagination={pagination}
      updateFunc={updateFunc}
      numberOfItems={2}
    />,
  );
  // Should match snapshot (only one page)
  expect(component).toMatchSnapshot();
  expect(component.baseElement.querySelectorAll('.page-item').length).toEqual(1);
});

it('Page selector display: 8 items / size = 5', async () => {
  const component = render(
    <PaginationNav.PageSelector
      pagination={pagination}
      updateFunc={updateFunc}
      numberOfItems={8}
    />,
  );
  // Should match snapshot (2 page)
  expect(component.baseElement.querySelectorAll('.page-item').length).toEqual(2);
  expect(component).toMatchSnapshot();
});

it('Page selector display: 16 items / size = 5', async () => {
  const component = render(
    <PaginationNav.PageSelector
      pagination={pagination}
      updateFunc={updateFunc}
      numberOfItems={16}
    />,
  );
  // Should match snapshot (4 pages)
  expect(component.baseElement.querySelectorAll('.page-item').length).toEqual(4);
  expect(component).toMatchSnapshot();
});
it('Page selector display: 22 items / size = 5', async () => {
  const component = render(
    <PaginationNav.PageSelector
      pagination={pagination}
      updateFunc={updateFunc}
      numberOfItems={22}
    />,
  );
  // Should match snapshot (5 pages)
  expect(component).toMatchSnapshot();
});

it('Page selector display: 28 items / size = 5', async () => {
  const component = render(
    <PaginationNav.PageSelector
      pagination={pagination}
      updateFunc={updateFunc}
      numberOfItems={28}
    />,
  );
  // Should match snapshot (6 pages)
  expect(component.baseElement.querySelectorAll('.page-item').length).toEqual(6);
  expect(component).toMatchSnapshot();
});

it('Page selector display: 105 items / size = 5', async () => {
  const component = render(
    <PaginationNav.PageSelector
      pagination={pagination}
      updateFunc={updateFunc}
      numberOfItems={105}
    />,
  );
  // Should match snapshot (fist page, second, third, "...", last)
  expect(component.baseElement.querySelectorAll('.page-item').length).toEqual(7);
  expect(component).toMatchSnapshot();
});

it('Page selector display: 105 items / size = 5 on page 10', async () => {
  const component = render(
    <PaginationNav.PageSelector
      pagination={{ page: 10, size: 5 }}
      updateFunc={updateFunc}
      numberOfItems={105}
    />,
  );

  // Should match snapshot (fist page, "...", 9, 10, 11, "...", last)
  expect(component.baseElement.querySelectorAll('.page-item').length).toEqual(7);
  expect(component).toMatchSnapshot();
});

it('Page selector display: 105 items / size = 5 on page 20', async () => {
  const component = render(
    <PaginationNav.PageSelector
      pagination={{ page: 20, size: 5 }}
      updateFunc={updateFunc}
      numberOfItems={105}
    />,
  );

  // Should match snapshot (fist page, "...", 16, 17, 18, 19, 20)
  expect(component.baseElement.querySelectorAll('.page-item').length).toEqual(7);
  expect(component).toMatchSnapshot();
});
