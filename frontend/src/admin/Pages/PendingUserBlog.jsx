import { useEffect, useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import axios from "axios";
import Swal from "sweetalert2";

const PendingBlogList = () => {
  const [pendingBlogs, setPendingBlogs] = useState([]);

  const fetchPendingBlogs = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/web/api/getPendingBlogs`);
      setPendingBlogs(res.data || []); // adjust if needed

    } catch (err) {
      console.error("Failed to fetch pending blogs:", err);
    }
  };

  useEffect(() => {
    fetchPendingBlogs();
  }, []);

  const handleApprove = async (id) => {
    try {
      const response = await axios.patch(`${import.meta.env.VITE_API_URL}/web/api/approveBlog/${id}`);

      if (response.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Approved!',
          text: 'Blog has been approved successfully.',
          timer: 1500,
          showConfirmButton: false,
        });

        // ✅ Remove blog from list
        setPendingBlogs((prev) => prev.filter((blog) => blog._id !== id));
      }
    } catch (error) {
      console.error("Approval failed:", error);
      Swal.fire({
        icon: 'error',
        title: 'Oops!',
        text: 'Failed to approve the blog.',
      });
    }
  };


const handleReject = async (id) => {
  try {
    const { value: rejectionReason } = await Swal.fire({
      title: "Reject Blog",
      input: "text",
      inputLabel: "Reason for rejection",
      inputPlaceholder: "Enter rejection reason",
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) return "You must enter a reason!";
      },
    });

    if (!rejectionReason) return;

    const response = await axios.put(
      `${import.meta.env.VITE_API_URL}/web/api/rejectedBlogs/${id}`,
      { rejectionReason }
    );

    if (response.data.success) {
      Swal.fire({
        icon: "success",
        title: "Rejected!",
        text: "Blog has been rejected successfully.",
        timer: 1500,
        showConfirmButton: false,
      });

      setPendingBlogs((prev) => prev.filter((blog) => blog._id !== id));
    }
  } catch (error) {
    console.error("Rejection failed:", error);
    Swal.fire({
      icon: "error",
      title: "Oops!",
      text: "Failed to reject the blog.",
    });
  }
};



  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center text-purple-700 mb-8">Pending Blogs for Approval</h1>

      {pendingBlogs.length === 0 ? (
        <p className="text-center text-gray-500">No pending blogs found.</p>
      ) : (
        pendingBlogs.map((blog) => (
          <div key={blog._id} className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl border border-gray-200 p-6 hover:shadow-2xl transition-all duration-300 mb-6">
            <div className="flex flex-col md:flex-row gap-6 items-start">

              {/* Blog Image */}
              <img
                src={`${import.meta.env.VITE_API_URL}/uploads/UserBlog/${blog.photo}`}
                alt="Blog Thumbnail"
                className="w-full md:w-72 h-48 md:h-44 object-cover rounded-xl border"
              />

              {/* Blog Details */}
              <div className="flex-1">
                <h2 className="text-2xl font-semibold text-gray-800 mb-1">{blog.title}</h2>
                <p className="text-sm text-gray-500 mb-3">
                  By <span className="font-medium">{blog.createdBy.username || "Unknown"}</span>
                </p>
                <p className="text-gray-700 text-base mb-5 line-clamp-4">{blog.description}</p>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={() => handleReject(blog._id)}
                    className="flex items-center gap-2 bg-red-100 text-red-600 hover:bg-red-200 px-4 py-2 rounded-lg transition-all"
                  >
                    <XCircle className="w-5 h-5" /> Reject
                  </button>

                  <button
                    onClick={() => handleApprove(blog._id)}
                    className="flex items-center gap-2 bg-green-100 text-green-700 hover:bg-green-200 px-4 py-2 rounded-lg transition-all"
                  >
                    <CheckCircle className="w-5 h-5" /> Approve
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default PendingBlogList;
