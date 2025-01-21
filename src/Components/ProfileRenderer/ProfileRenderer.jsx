const ProfileRenderer = (params) => {
  return (
    <div>
      <a href={params.value.url} target="_blank" rel="noopener noreferrer">
        {params.value.name}
      </a>
    </div>
  );
};

export default ProfileRenderer;
