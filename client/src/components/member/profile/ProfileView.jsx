//client/src/components/member/profile/ProfileView.jsx
const ProfileView = ({ profile, onEdit }) => {
  return (
    <div className="space-y-2">
      <p>
        <strong>Email:</strong> {profile.email}
      </p>
      <p>
        <strong>Name:</strong> {profile.fullName || "-"}
      </p>
      <p>
        <strong>Phone:</strong> {profile.phoneNumber || "-"}
      </p>
      <button
        onClick={onEdit}
        className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
      >
        Edit Profile
      </button>
    </div>
  );
};

export default ProfileView;