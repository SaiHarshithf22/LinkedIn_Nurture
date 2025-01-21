import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";

ModuleRegistry.registerModules([AllCommunityModule]);

const TableComponent = ({
  rowData,
  columnDefs,
  defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
    autoHeight: true,
  },
  pagination = true,
  paginationPageSize = 20,
  height = "800px",
  width = "1000px",
}) => {
  return (
    <div
      style={{
        height: height,
        minWidth: width,
      }}
    >
      <AgGridReact
        className="ag-theme-alpine"
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        pagination={pagination}
        paginationPageSize={paginationPageSize}
        animateRows={true}
        enableCellTextSelection={true}
        suppressRowTransform={true}
        suppressColumnVirtualisation={false}
        suppressScrollOnNewData={true}
      />
    </div>
  );
};

export default TableComponent;
