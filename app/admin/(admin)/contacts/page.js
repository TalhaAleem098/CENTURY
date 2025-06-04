"use client";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Atom } from "react-loading-indicators";

const PAGE_SIZE = 8;

const ApplicationModal = ({ open, onClose, application }) => {
  if (!open || !application) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-2xl w-[95vw] max-w-lg sm:max-w-xl md:max-w-2xl p-6 relative">
        <button
          className="absolute top-4 right-4 text-3xl text-gray-400 hover:text-red-500 transition-colors"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">
          Application Details
        </h2>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <span className="font-semibold text-gray-600 min-w-20">Name:</span>
            <span className="text-gray-800">{application.name}</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <span className="font-semibold text-gray-600 min-w-20">Email:</span>
            <span className="text-gray-800">{application.email}</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <span className="font-semibold text-gray-600 min-w-20">Subject:</span>
            <span className="text-gray-800">{application.subject}</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <span className="font-semibold text-gray-600 min-w-20">Date:</span>
            <span className="text-gray-800">{new Date(application.createdAt).toLocaleString()}</span>
          </div>
          <div>
            <span className="font-semibold text-gray-600 block mb-2">Message:</span>
            <div className="bg-gray-50 rounded-lg p-4 text-gray-800 leading-relaxed border">
              {application.message}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminContactsPage = () => {
  const [contacts, setContacts] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalApp, setModalApp] = useState(null);
  const fetchContacts = async (pageNum = 1) => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/contact/admin?page=${pageNum}&limit=${PAGE_SIZE}`
      );
      const data = await res.json();
      if (data.success) {
        setContacts(data.data);
        setTotal(data.total);
        setPage(data.page);
        
        // Show success message only on first load or when explicitly needed
        if (pageNum === 1 && data.total > 0) {
          toast.success(`Loaded ${data.total} contact application${data.total > 1 ? 's' : ''}`);
        }
      } else {
        toast.error(data.error || "Failed to fetch applications");
      }
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error("Network error: Failed to fetch applications");
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchContacts(page);
  }, [page]);
  const handleDelete = async (ids) => {
    const count = Array.isArray(ids) ? ids.length : 1;
    const message = count === 1 
      ? "Are you sure you want to delete this application?" 
      : `Are you sure you want to delete ${count} applications?`;
    
    if (!window.confirm(message)) return;
    
    setLoading(true);
    try {
      const res = await fetch("/api/contact/admin", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });
      const data = await res.json();
      if (data.success) {
        const deletedCount = Array.isArray(ids) ? ids.length : 1;
        toast.success(`Successfully deleted ${deletedCount} application${deletedCount > 1 ? 's' : ''}`);
        setSelected([]);
        
        // If we deleted all items on current page and not on page 1, go to previous page
        const remainingItems = contacts.length - deletedCount;
        if (remainingItems === 0 && page > 1) {
          setPage(page - 1);
        } else {
          fetchContacts(page);
        }
      } else {
        toast.error(data.error || "Failed to delete applications");
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error("Network error: Failed to delete applications");
    }
    setLoading(false);
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (    <div className="p-2 sm:p-4 md:p-6 max-w-7xl mx-auto">

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Contact Applications
            </h1>
            <p className="text-gray-600">
              Manage customer inquiries and contact form submissions
            </p>
          </div>
          {!loading && total > 0 && (
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{total}</div>
              <div className="text-sm text-gray-500">Total Applications</div>
            </div>
          )}
        </div>
      </div><div className="mb-4 text-sm text-gray-700 bg-blue-50 rounded-lg p-3 border border-blue-200">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span className="font-medium text-blue-800">Admin Instructions</span>
        </div>
        <div className="text-blue-700 space-y-1 text-sm">
          <p>• Click on any message text to view full application details in a popup</p>
          <p>• Use checkboxes to select applications for bulk deletion</p>
          <p>• Navigate through pages using the pagination controls below</p>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <Atom color="#3b82f6" size="medium" text="Loading applications..." textColor="#3b82f6" />
        </div>
      )}

      {/* No Applications State */}
      {!loading && contacts.length === 0 && (
        <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-dashed border-gray-300">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2M4 13h2m13-5a2 2 0 00-2-2H9a2 2 0 00-2 2v2a2 2 0 002 2h8a2 2 0 002-2v-2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Contact Applications</h3>
          <p className="text-gray-500">No customer inquiries have been submitted yet.</p>
          <p className="text-sm text-gray-400 mt-2">Applications will appear here as customers submit contact forms.</p>
        </div>
      )}

      {/* Compact Applications List */}
      {!loading && contacts.length > 0 && (
        <div className="space-y-2 mb-6">
          {/* Select All Row */}
          <div className="bg-gray-50 rounded-lg p-3 border">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={selected.length === contacts.length && contacts.length > 0}
                onChange={(e) =>
                  setSelected(e.target.checked ? contacts.map((c) => c._id) : [])
                }
                className="w-4 h-4 text-blue-600"
              />
              <span className="text-sm font-medium text-gray-700">
                Select All Applications ({selected.length} of {contacts.length} selected)
              </span>
            </label>
          </div>

          {/* Applications */}
          {contacts.map((c) => (
            <div
              key={c._id}
              className={`bg-white border rounded-lg p-3 hover:shadow-md transition-all duration-200 ${
                selected.includes(c._id) ? 'ring-2 ring-blue-500 bg-blue-50' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Checkbox */}
                <input
                  type="checkbox"
                  checked={selected.includes(c._id)}
                  onChange={(e) =>
                    setSelected(
                      e.target.checked
                        ? [...selected, c._id]
                        : selected.filter((id) => id !== c._id)
                    )
                  }
                  className="w-4 h-4 text-blue-600 flex-shrink-0"
                />

                {/* Main Content - Single Row */}
                <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                  {/* Name & Email */}
                  <div className="sm:col-span-3 min-w-0">
                    <div className="font-medium text-gray-900 text-sm truncate" title={c.name}>
                      {c.name}
                    </div>
                    <div className="text-xs text-gray-500 truncate" title={c.email}>
                      {c.email}
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="sm:col-span-2 min-w-0">
                    <div className="text-sm text-gray-700 truncate" title={c.subject}>
                      <span className="text-xs text-gray-500 sm:hidden">Subject: </span>
                      {c.subject}
                    </div>
                  </div>

                  {/* Message Preview */}
                  <div className="sm:col-span-4 min-w-0">
                    <div
                      className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer hover:underline truncate"
                      title="Click to view full message"
                      onClick={() => {
                        setModalApp(c);
                        setModalOpen(true);
                      }}
                    >
                      <span className="text-xs text-gray-500 sm:hidden">Message: </span>
                      {c.message.length > 60 ? `${c.message.substring(0, 60)}...` : c.message}
                    </div>
                  </div>

                  {/* Date */}
                  <div className="sm:col-span-2 min-w-0">
                    <div className="text-xs text-gray-500">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="sm:col-span-1 flex justify-end">
                    <button
                      className="text-red-600 hover:text-red-800 text-sm font-medium px-2 py-1 rounded hover:bg-red-50 transition-colors"
                      onClick={() => handleDelete([c._id])}
                      disabled={loading}
                      title="Delete this application"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}      {/* Action Controls */}
      {!loading && contacts.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t">
          {/* Delete Selected Button */}
          <div className="flex items-center gap-3">
            <button
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              onClick={() => handleDelete(selected)}
              disabled={selected.length === 0 || loading}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete Selected ({selected.length})
            </button>
            {selected.length > 0 && (
              <span className="text-sm text-gray-500">
                {selected.length} application{selected.length > 1 ? 's' : ''} selected
              </span>
            )}
          </div>

          {/* Pagination */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">
              Showing {contacts.length} of {total} applications
            </span>
            <div className="flex items-center gap-1">
              <button
                className="px-3 py-1 rounded border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || loading}
              >
                Previous
              </button>
              <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded font-medium">
                {page}
              </span>
              <span className="text-gray-400">of {totalPages}</span>
              <button
                className="px-3 py-1 rounded border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || loading}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
      <ApplicationModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        application={modalApp}
      />
    </div>
  );
};

export default AdminContactsPage;
