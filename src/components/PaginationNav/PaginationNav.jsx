import React from 'react';
import Pagination from 'react-bootstrap/Pagination';
import Form from 'react-bootstrap/Form';

function makePaginationItem(pageNumber, activePage, paginationSize, updateFunc) {
  return (
    <Pagination.Item
      key={pageNumber}
      active={activePage === pageNumber}
      onClick={() => updateFunc({ size: paginationSize, page: pageNumber })}
    >
      {pageNumber}
    </Pagination.Item>
  );
}

class PaginationNav {
  static PageSelector({ pagination, updateFunc, numberOfItems }) {
    const update = updateFunc;
    const numberOfPages = Math.floor(numberOfItems / pagination.size);
    const active = pagination.page;
    const items = [];

    if (numberOfPages < 8) {
      for (let number = 1; number <= 1 + numberOfPages; number += 1) {
        items.push(makePaginationItem(number, active, pagination.size, update));
      }
    } else {
      const activeForCalc = Math.min(Math.max(active, 4), numberOfPages - 3);
      let numbers = [1, activeForCalc - 1, activeForCalc, activeForCalc + 1, numberOfPages];
      numbers = numbers.slice(0, numbers.indexOf(numberOfPages) + 1);
      numbers = numbers.slice(numbers.lastIndexOf(1));
      numbers.forEach((number) => {
        if (number === numberOfPages) {
          if (activeForCalc < numberOfPages - 3) {
            items.push(
              <Pagination.Item key={-1} active={false}>...</Pagination.Item>,
            );
          } else {
            items.push(makePaginationItem(numberOfPages - 1, active, pagination.size, update));
          }
        }
        items.push(makePaginationItem(number, active, pagination.size, update));

        if (number === 1) {
          if (activeForCalc > 4) {
            items.push(
              <Pagination.Item key={2} active={false}>...</Pagination.Item>,
            );
          } else {
            items.push(makePaginationItem(2, active, pagination.size, update));
          }
        }
      });
    }

    return (
      <div className="paginationNavWrapper">
        <Pagination size="sm" className="paginationNav">{items}</Pagination>
      </div>
    );
  }

  static SizeSelector({ updateFunc }) {
    return (
      <span>
        <span>Afficher </span>
        <Form id="pageSizeSelector">
          <Form.Group controlId="exampleForm.SelectCustom">
            <Form.Control
              as="select"
              size="sm"
              custom
              onChange={(e) => updateFunc({ size: e.target.value, page: 1 })}
            >
              <option>5</option>
              <option>10</option>
              <option>20</option>
              <option>50</option>
            </Form.Control>
          </Form.Group>
        </Form>
        <span> éléments</span>
      </span>
    );
  }
}

export default PaginationNav;
