import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";

ModuleRegistry.registerModules([AllCommunityModule]);

const TableComponent = ({
  rowData,
  columnDefs,
  defaultColDef = {
    resizable: true,
    autoHeight: true,
    sortable: false,
  },
  onSortChanged,
  onGridReady,
}) => {
  return (
    <div
      style={{
        width: "100%",
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
        onGridReady={onGridReady}
        domLayout="autoHeight"
        suppressSorting={true}
      />
    </div>
  );
};

export default TableComponent;
