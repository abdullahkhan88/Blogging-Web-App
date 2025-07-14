import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPendingComments,
  approveComment,
  fetchComments,
} from "../../features/comment/commentSlice";
import { CheckCircle, XCircle } from "lucide-react";

const PendingComments = () => {
  const dispatch = useDispatch();
  const { pendingComments, status } = useSelector((state) => state.comments);
  const [expandedId, setExpandedId] = useState(null);

  // Fetch pending comments on mount
  useEffect(() => {
    dispatch(fetchPendingComments());
  }, [dispatch]);

  // Expand/Collapse Logic
  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Approve handler
  const handleApprove = (commentId, blogId) => {
    const token = sessionStorage.getItem("token");

    dispatch(approveComment({ commentId, token }))
      .unwrap()
      .then(() => {
        //  Update comments on user side
        dispatch(fetchComments(blogId));

        //  Remove from pending list
        dispatch(fetchPendingComments());
      })
      .catch((err) => {
        console.error("Approve failed", err);
      });
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md overflow-auto">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Pending Comments</h2>

      {status === "loading" ? (
        <p>Loading comments...</p>
      ) : pendingComments.length === 0 ? (
        <p className="text-gray-600">No pending comments.</p>
      ) : (
        <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 font-medium text-gray-700">User</th>
              <th className="px-4 py-2 font-medium text-gray-700">Comment</th>
              <th className="px-4 py-2 font-medium text-gray-700">Blog Title</th>
              <th className="px-4 py-2 font-medium text-gray-700">Posted On</th>
              <th className="px-4 py-2 font-medium text-gray-700 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {pendingComments.map((comment) => (
              <tr key={comment._id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-800">{comment.userName}</td>
                <td className="px-4 py-3 text-gray-700 max-w-sm">
                  {comment.text.length > 80 && expandedId !== comment._id ? (
                    <>
                      {comment.text.substring(0, 80)}...
                      <button
                        onClick={() => toggleExpand(comment._id)}
                        className="text-blue-600 text-xs ml-1 underline"
                      >
                        Read more
                      </button>
                    </>
                  ) : (
                    <>
                      {comment.text}
                      {comment.text.length > 80 && (
                        <button
                          onClick={() => toggleExpand(comment._id)}
                          className="text-blue-600 text-xs ml-1 underline"
                        >
                          Show less
                        </button>
                      )}
                    </>
                  )}
                </td>
                <td className="px-4 py-3 text-blue-600 font-medium">{comment.blogTitle}</td>
                <td className="px-4 py-3 text-gray-500">
                  {new Date(comment.createdAt).toLocaleString('en-IN', {
                    dateStyle: 'short',
                    timeStyle: 'short'
                  })}
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => handleApprove(comment._id, comment.blogId)}
                      className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition-all"
                    >
                      <CheckCircle size={16} /> Approve
                    </button>
                    <button
                      disabled
                      className="flex items-center gap-1 bg-red-400 text-white px-3 py-1 rounded-lg cursor-not-allowed"
                    >
                      <XCircle size={16} /> Reject
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PendingComments;
