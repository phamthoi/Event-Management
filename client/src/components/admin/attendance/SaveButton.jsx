function SaveButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      Save
    </button>
  );
}

export default SaveButton;
