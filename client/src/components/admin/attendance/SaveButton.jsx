function SaveButton({ onClick, disabled = false }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`mt-4 px-4 py-2 rounded ${
        disabled 
          ? 'bg-gray-400 cursor-not-allowed' 
          : 'bg-blue-500 hover:bg-blue-600 text-white'
      }`}
    >
      {disabled ? 'Saving...' : 'Save Attendance'}
    </button>
  );
}

export default SaveButton;
