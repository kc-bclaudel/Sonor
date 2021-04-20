import React from 'react';
import Pagination from 'react-bootstrap/Pagination';
import Form from 'react-bootstrap/Form';
import D from '../../i18n';

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
    let numberOfPages = Math.floor((Math.max(numberOfItems, 1) - 1) / pagination.size);
    const active = pagination.page;
    const items = [];

    if (numberOfPages < 8) {
      for (let number = 1; number <= 1 + numberOfPages; number += 1) {
        items.push(makePaginationItem(number, active, pagination.size, update));
      }
    } else {
      if (!Number.isInteger((Math.max(numberOfItems, 1) - 1) / pagination.size)) {
        numberOfPages += 1;
      }
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
      <Pagination size="sm" className="paginationNav" data-testid="pagination-nav">{items}</Pagination>
    );
  }

  static SizeSelector({ updateFunc }) {
    return (
      <span>
        <span>
          {`${D.display} `}
        </span>
        <Form className="PageSizeSelector">
          <Form.Group controlId="exampleForm.SelectCustom">
            <Form.Control
              as="select"
              size="sm"
              custom
              data-testid="pagination-size-selector"
              onChange={(e) => updateFunc({ size: parseInt(e.target.value, 10), page: 1 })}
            >
              <option>10</option>
              <option>20</option>
              <option>50</option>
            </Form.Control>
          </Form.Group>
        </Form>
        <span>{` ${D.elements}`}</span>
      </span>
    );
  }
}

export default PaginationNav;
