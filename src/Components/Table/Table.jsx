import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";

ModuleRegistry.registerModules([AllCommunityModule]);

const TableComponent = ({
  rowData,
  columnDefs,
  defaultColDef = {
    resizable: true,
    autoHeight: true,
    sortable: true,
  },
  height = "800px",
  width = "1000px",
  onSortChanged,
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
        enableCellTextSelection={true}
        suppressScrollOnNewData={true}
        onSortChanged={onSortChanged}
      />
    </div>
  );
};

export default TableComponent;
