import React from "react";
import { Group, Pagination } from "@mantine/core";

interface IDataTablePaginationProps {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  onNext: () => void;
  onBack: () => void;
}

const DataTablePagination: React.FC<IDataTablePaginationProps> = ({
  hasNextPage,
  hasPreviousPage,
  onNext,
  onBack
}) => {
  // Derive a virtual page number from what we know:
  // page 1 = no previous, page 2 = one back available, etc.
  // We don't know the true total, so total = currentPage when on the last
  // page, or currentPage + 1 when a next page exists.
  const currentPage = hasPreviousPage ? 2 : 1;
  const total = hasNextPage ? currentPage + 1 : currentPage;

  const handleChange = (page: number) => {
    if (page > currentPage) onNext();
    else if (page < currentPage) onBack();
  };

  return (
    <Group justify="center">
      <Pagination
        value={currentPage}
        total={total}
        onChange={handleChange}
        boundaries={0}
        siblings={0}
        withEdges={false}
      />
    </Group>
  );
};

export { DataTablePagination };
