import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { requestService } from '../services/requestService';
import RequestCard from '../components/RequestCard';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';

const TABS = [
  { id: 'received', label: 'Received Requests', icon: '📥' },
  { id: 'sent', label: 'Sent Requests', icon: '📤' },
  { id: 'accepted', label: 'Accepted', icon: '✅' },
  { id: 'rejected', label: 'Rejected', icon: '✕' },
  { id: 'completed', label: 'Completed', icon: '⭐' },
];

const Requests = () => {
  const { user } = useAuth();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState('received');
  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const [sentRes, receivedRes] = await Promise.all([
        requestService.getSentRequests(),
        requestService.getReceivedRequests(),
      ]);

      if (sentRes?.requests) setSentRequests(sentRes.requests);
      if (receivedRes?.requests) setReceivedRequests(receivedRes.requests);
    } catch (err) {
      toast.error('Failed to load exchange requests');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // Accept Request
  const handleAccept = async (id) => {
    try {
      await requestService.acceptRequest(id);
      toast.success('Request accepted! You can now collaborate.');
      fetchRequests();
    } catch (err) {
      toast.error(err.message || 'Failed to accept request');
    }
  };

  // Reject Request
  const handleReject = async (id) => {
    try {
      await requestService.rejectRequest(id);
      toast.info('Request declined');
      fetchRequests();
    } catch (err) {
      toast.error(err.message || 'Failed to decline request');
    }
  };

  // Cancel Request
  const handleCancel = async (id) => {
    try {
      await requestService.cancelRequest(id);
      toast.success('Request cancelled');
      fetchRequests();
    } catch (err) {
      toast.error(err.message || 'Failed to cancel request');
    }
  };

  // Mark Completed
  const handleComplete = async (id) => {
    try {
      await requestService.completeRequest(id);
      toast.success('Exchange marked as completed! Congratulations!');
      fetchRequests();
    } catch (err) {
      toast.error(err.message || 'Failed to complete exchange');
    }
  };

  // Delete Request
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this record?')) return;
    try {
      await requestService.deleteRequest(id);
      toast.success('Record removed');
      fetchRequests();
    } catch (err) {
      toast.error(err.message || 'Failed to delete record');
    }
  };

  // Combine and filter according to activeTab
  const getFilteredRequests = () => {
    const all = [...receivedRequests, ...sentRequests];

    switch (activeTab) {
      case 'received':
        return receivedRequests.filter((r) => r.status === 'pending');
      case 'sent':
        return sentRequests.filter((r) => r.status === 'pending');
      case 'accepted':
        return all.filter((r) => r.status === 'accepted');
      case 'rejected':
        return all.filter((r) => r.status === 'rejected' || r.status === 'cancelled');
      case 'completed':
        return all.filter((r) => r.status === 'completed');
      default:
        return [];
    }
  };

  const filteredRequests = getFilteredRequests();
  const pendingReceivedCount = receivedRequests.filter((r) => r.status === 'pending').length;

  return (
    <div className="page-container">
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 className="section-title">Skill & Project Exchange Requests</h1>
          <p className="section-subtitle">
            Manage your peer swap offers, responses, and project collaboration invites
          </p>
        </div>

        {/* Navigation Tabs */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            overflowX: 'auto',
            paddingBottom: 8,
            marginBottom: 32,
            borderBottom: '1px solid var(--border)',
          }}
        >
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`btn btn-sm ${isActive ? 'btn-primary' : 'btn-secondary'}`}
                style={{
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-full)',
                  position: 'relative',
                }}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>

                {/* Badge for Pending Received */}
                {tab.id === 'received' && pendingReceivedCount > 0 && (
                  <span
                    style={{
                      background: isActive ? '#ffffff' : 'var(--primary)',
                      color: isActive ? 'var(--primary)' : '#ffffff',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      padding: '2px 7px',
                      borderRadius: '999px',
                      marginLeft: 4,
                    }}
                  >
                    {pendingReceivedCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Requests List */}
        {loading ? (
          <Loader text="Loading your exchange requests from MongoDB..." />
        ) : filteredRequests.length === 0 ? (
          <EmptyState
            icon="📬"
            title={`No ${activeTab} requests`}
            description={
              activeTab === 'received'
                ? 'You have no pending requests from classmates. Offer new skills to get noticed!'
                : activeTab === 'sent'
                ? "You haven't sent any pending requests. Explore skills to find exchange partners!"
                : `No requests currently marked as ${activeTab}.`
            }
          />
        ) : (
          <div className="grid grid-cols-2" style={{ gap: 20 }}>
            {filteredRequests.map((req) => (
              <RequestCard
                key={req._id}
                request={req}
                onAccept={handleAccept}
                onReject={handleReject}
                onCancel={handleCancel}
                onComplete={handleComplete}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Requests;
