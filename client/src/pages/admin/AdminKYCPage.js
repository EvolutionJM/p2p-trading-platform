import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye, 
  Search,
  Filter,
  Download,
  User,
  FileText,
  Calendar,
  MapPin
} from 'lucide-react';
import { adminAPI } from '../../services/api';

const AdminKYCPage = () => {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [filter, setFilter] = useState('all'); // all, pending, approved, rejected
  const [searchQuery, setSearchQuery] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setIsLoading(true);
    try {
      const response = await adminAPI.getKYCApplications();
      setApplications(response.data.applications);
    } catch (error) {
      toast.error('Failed to load KYC applications');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (userId) => {
    try {
      await adminAPI.approveKYC(userId);
      toast.success('KYC application approved!');
      fetchApplications();
      setSelectedApp(null);
    } catch (error) {
      toast.error(error.message || 'Failed to approve KYC');
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }

    try {
      await adminAPI.rejectKYC(selectedApp._id, { reason: rejectionReason });
      toast.success('KYC application rejected');
      fetchApplications();
      setSelectedApp(null);
      setShowRejectModal(false);
      setRejectionReason('');
    } catch (error) {
      toast.error(error.message || 'Failed to reject KYC');
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesFilter = filter === 'all' || app.kycStatus === filter;
    const matchesSearch = 
      app.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: applications.length,
    pending: applications.filter(a => a.kycStatus === 'pending').length,
    approved: applications.filter(a => a.kycStatus === 'approved').length,
    rejected: applications.filter(a => a.kycStatus === 'rejected').length,
  };

  return (
    <div className="container-custom py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">KYC Management</h1>
        <p className="text-gray-600">Review and manage user verification applications</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Applications"
          value={stats.total}
          icon={FileText}
          color="blue"
        />
        <StatCard
          title="Pending Review"
          value={stats.pending}
          icon={Clock}
          color="yellow"
        />
        <StatCard
          title="Approved"
          value={stats.approved}
          icon={CheckCircle}
          color="green"
        />
        <StatCard
          title="Rejected"
          value={stats.rejected}
          icon={XCircle}
          color="red"
        />
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by username or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10"
            />
          </div>

          {/* Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="input"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Applications List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="card text-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600">Loading applications...</p>
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="card text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No applications found</p>
            </div>
          ) : (
            filteredApplications.map((app) => (
              <ApplicationCard
                key={app._id}
                application={app}
                isSelected={selectedApp?._id === app._id}
                onClick={() => setSelectedApp(app)}
              />
            ))
          )}
        </div>

        {/* Details */}
        <div className="lg:sticky lg:top-24 h-fit">
          {selectedApp ? (
            <ApplicationDetails
              application={selectedApp}
              onApprove={() => handleApprove(selectedApp._id)}
              onReject={() => setShowRejectModal(true)}
            />
          ) : (
            <div className="card text-center py-12">
              <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Select an application to view details</p>
            </div>
          )}
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Reject Application</h3>
            <p className="text-gray-600 mb-4">
              Please provide a reason for rejecting this KYC application:
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason..."
              className="input min-h-[100px] mb-4"
              rows="4"
            />
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason('');
                }}
                className="btn btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="btn bg-red-600 hover:bg-red-700 text-white flex-1"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, icon: Icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    green: 'bg-green-50 text-green-600',
    red: 'bg-red-50 text-red-600',
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

// Application Card Component
const ApplicationCard = ({ application, isSelected, onClick }) => {
  const getStatusBadge = (status) => {
    const badges = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
      approved: { bg: 'bg-green-100', text: 'text-green-800', label: 'Approved' },
      rejected: { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejected' },
    };
    return badges[status] || badges.pending;
  };

  const statusBadge = getStatusBadge(application.kycStatus);

  return (
    <div
      onClick={onClick}
      className={`card cursor-pointer transition-all hover:shadow-lg ${
        isSelected ? 'ring-2 ring-primary-500' : ''
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{application.username}</h3>
            <p className="text-sm text-gray-500">{application.email}</p>
          </div>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusBadge.bg} ${statusBadge.text}`}>
          {statusBadge.label}
        </span>
      </div>

      {application.kycData && (
        <div className="space-y-2 text-sm">
          <div className="flex items-center text-gray-600">
            <FileText className="w-4 h-4 mr-2" />
            {application.kycData.documentType?.replace('_', ' ').toUpperCase()}
          </div>
          <div className="flex items-center text-gray-600">
            <Calendar className="w-4 h-4 mr-2" />
            {new Date(application.kycData.submittedAt).toLocaleDateString()}
          </div>
        </div>
      )}
    </div>
  );
};

// Application Details Component
const ApplicationDetails = ({ application, onApprove, onReject }) => {
  const { kycData } = application;

  return (
    <div className="card">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Application Details</h2>

      {/* Personal Info */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 mb-3">Personal Information</h3>
        <div className="space-y-2 text-sm">
          <InfoRow label="Full Name" value={`${kycData?.firstName || ''} ${kycData?.lastName || ''}`} />
          <InfoRow label="Email" value={application.email} />
          <InfoRow label="Username" value={application.username} />
          <InfoRow label="Date of Birth" value={kycData?.dateOfBirth ? new Date(kycData.dateOfBirth).toLocaleDateString() : 'N/A'} />
          <InfoRow label="Country" value={kycData?.country || 'N/A'} />
        </div>
      </div>

      {/* Document Info */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 mb-3">Document Information</h3>
        <div className="space-y-2 text-sm">
          <InfoRow label="Document Type" value={kycData?.documentType?.replace('_', ' ').toUpperCase() || 'N/A'} />
          <InfoRow label="Document Number" value={kycData?.documentNumber || 'N/A'} />
          <InfoRow label="Submitted At" value={kycData?.submittedAt ? new Date(kycData.submittedAt).toLocaleString() : 'N/A'} />
        </div>
      </div>

      {/* Documents */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 mb-3">Uploaded Documents</h3>
        <div className="space-y-3">
          {kycData?.documents?.documentFront && (
            <DocumentPreview
              label="Document Front"
              filename={kycData.documents.documentFront}
              userId={application._id}
            />
          )}
          {kycData?.documents?.documentBack && (
            <DocumentPreview
              label="Document Back"
              filename={kycData.documents.documentBack}
              userId={application._id}
            />
          )}
          {kycData?.documents?.selfie && (
            <DocumentPreview
              label="Selfie"
              filename={kycData.documents.selfie}
              userId={application._id}
            />
          )}
        </div>
      </div>

      {/* Rejection Reason (if rejected) */}
      {application.kycStatus === 'rejected' && kycData?.rejectionReason && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="font-semibold text-red-900 mb-2">Rejection Reason</h3>
          <p className="text-sm text-red-700">{kycData.rejectionReason}</p>
        </div>
      )}

      {/* Actions */}
      {application.kycStatus === 'pending' && (
        <div className="flex space-x-3">
          <button
            onClick={onReject}
            className="btn bg-red-600 hover:bg-red-700 text-white flex-1"
          >
            <XCircle className="w-4 h-4 mr-2" />
            Reject
          </button>
          <button
            onClick={onApprove}
            className="btn btn-primary flex-1"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Approve
          </button>
        </div>
      )}

      {application.kycStatus === 'approved' && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
          <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <p className="font-semibold text-green-900">Application Approved</p>
          <p className="text-sm text-green-700">
            {kycData?.approvedAt ? new Date(kycData.approvedAt).toLocaleString() : ''}
          </p>
        </div>
      )}
    </div>
  );
};

// Info Row Component
const InfoRow = ({ label, value }) => (
  <div className="flex justify-between py-2 border-b border-gray-100">
    <span className="text-gray-600">{label}:</span>
    <span className="font-medium text-gray-900">{value}</span>
  </div>
);

// Document Preview Component
const DocumentPreview = ({ label, filename, userId }) => {
  const imageUrl = `${process.env.REACT_APP_API_URL}/uploads/kyc/${userId}/${filename}`;

  return (
    <div className="border border-gray-200 rounded-lg p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-900">{label}</span>
        <a
          href={imageUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary-600 hover:text-primary-700 text-sm flex items-center"
        >
          <Download className="w-4 h-4 mr-1" />
          Download
        </a>
      </div>
      <img
        src={imageUrl}
        alt={label}
        className="w-full h-48 object-cover rounded-lg border border-gray-200"
        onError={(e) => {
          e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23f3f4f6" width="100" height="100"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="14" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
        }}
      />
    </div>
  );
};

export default AdminKYCPage;
