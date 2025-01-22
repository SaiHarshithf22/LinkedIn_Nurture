export const columnDefs = [
  {
    field: "profile.name",
    headerName: "Name",
    width: 200,
    flex: 1,
    filter: "agTextColumnFilter",
    cellRenderer: (params) => (
      <a
        href={params.data.profile.profile}
        target="_blank"
        rel="noopener noreferrer"
      >
        {params.data.profile.name}
      </a>
    ),
    headerComponent: CustomHeaderComponent,
    headerComponentParams: {
      displayName: "Name",
    },
  },
  {
    field: "url",
    headerName: "Post",
    flex: 2,
    cellRenderer: (params) => {
      return (
        <a href={params.value} target="_blank" rel="noopener noreferrer">
          {params?.data?.text
            ? params?.data?.text
            : params?.value?.split("com/")?.[1]}
        </a>
      );
    },
  },
  {
    field: "timestamp",
    headerName: "Timestamp",
    width: 200,
    flex: 1,
    valueGetter: (params) => new Date(params.data.timestamp).toLocaleString(), // Format timestamp
  },
];
