import React from "react";
const { currentPage, maxPageLimit, minPageLimit } = props;
const totalPages = props.response.totalPages - 1;
const data = props.response.data;

// build page numbers list based on total number of pages
const pages = [];
for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
}

const pageNumbers = pages.map(page => {
    if (page <= maxPageLimit && page > minPageLimit) {
        return 
    }
})

const Pagination = (props) => {
  return <div></div>;
};
export default Pagination;
