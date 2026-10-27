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

  const handleAccept = async (id) => {
    try {
      await requestService.acceptRequest(id);
      toast.success('Request accepted! You can now collaborate.');
      fetchRequests();
    } catch (err) {
      toast.error(err.message || 'Failed to accept request');
    }
  };

  const handleReject = async (id) => {
    try {
      await requestService.rejectRequest(id);
      toast.info('Request declined');
      fetchRequests();
    } catch (err) {
      toast.error(err.message || 'Failed to decline request');
    }
  };

  const handleCancel = async (id) => {
    try {
      await requestService.cancelRequest(id);
      toast.success('Request cancelled');
      fetchRequests();
    } catch (err) {
      toast.error(err.message || 'Failed to cancel request');
    }
  };

  const handleComplete = async (id) => {
    try {
      await requestService.completeRequest(id);
      toast.success('Exchange marked as completed! Congratulations!');
      fetchRequests();
    } catch (err) {
      toast.error(err.message || 'Failed to complete exchange');
    }
  };

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '2.2rem', marginBottom: 6 }}>Exchange Requests</h1>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          Manage your peer swap offers, responses, and collaborative project invites.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="tabs-neo">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`tab-neo-btn ${isActive ? 'active' : ''}`}
              style={{ display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>

              {tab.id === 'received' && pendingReceivedCount > 0 && (
                <span
                  className="badge-neo badge-neo-pink"
                  style={{
                    fontSize: '0.68rem',
                    padding: '1px 5px',
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
        <Loader text="Loading your exchange requests from database..." />
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 20 }}>
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
  );
};

export default Requests;
