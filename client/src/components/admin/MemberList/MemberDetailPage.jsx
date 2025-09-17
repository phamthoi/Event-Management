import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMemberById } from '../../../services/admin/member/memberService';

const MemberDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMemberDetail = async () => {
      try {
        setLoading(true);
        const response = await getMemberById(id);
        if (response.success) {
          setMember(response.member);
        } else {
          setError('Không thể tải thông tin member');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Có lỗi xảy ra khi tải thông tin member');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMemberDetail();
    }
  }, [id]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (isActive) => {
    return isActive ? (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        Active
      </span>
    ) : (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
        Locked
      </span>
    );
  };

  const getRoleBadge = (role) => {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        {role}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải thông tin member...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
          <button
            onClick={() => navigate('/admin/members/list')}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Không tìm thấy thông tin member</p>
          <button
            onClick={() => navigate('/admin/members/list')}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/admin/members/list')}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Quay lại danh sách member
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Thông tin chi tiết member</h1>
        </div>

        {/* Member Info Card */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-6 py-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {member.fullName ? member.fullName.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="ml-4">
                  <h2 className="text-2xl font-bold text-gray-900">{member.fullName || 'Chưa cập nhật'}</h2>
                  <p className="text-gray-600">{member.email}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                {getStatusBadge(member.isActive)}
                {getRoleBadge(member.role)}
              </div>
            </div>

            {/* Member Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ID</label>
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">{member.id}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">{member.email}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">{member.fullName || 'Chưa cập nhật'}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">{member.phoneNumber || 'Chưa cập nhật'}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vai trò</label>
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">{member.role}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                    {member.isActive ? 'Hoạt động' : 'Bị khóa'}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Organization ID</label>
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">{member.organizationId}</p>
                </div>
                
                {member.organization && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tên tổ chức</label>
                    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">{member.organization.name}</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Timestamps */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ngày tạo</label>
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">{formatDate(member.createdAt)}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cập nhật lần cuối</label>
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">{formatDate(member.updatedAt)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="mt-8 flex justify-center space-x-4">
          <button
            onClick={() => navigate('/admin/members/list')}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg transition duration-200"
          >
            Quay lại
          </button>
        </div>
      </div>
    </div>
  );
};

export default MemberDetailPage;