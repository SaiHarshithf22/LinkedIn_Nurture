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
        animateRows={true}
        enableCellTextSelection={true}
        suppressScrollOnNewData={true}
      />
    </div>
  );
};

export default TableComponent;
