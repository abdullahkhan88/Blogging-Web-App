import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBlogs, likeBlog, dislikeBlog } from '../../features/blogs/blogSlice';
import { fetchComments, postComment, deleteComment } from '../../features/comment/commentSlice';
import { FaTrash, FaThumbsDown, FaThumbsUp } from 'react-icons/fa';

const BlogDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { blogs, status: blogStatus } = useSelector(state => state.blog);
  const { comments, status: commentStatus } = useSelector(state => state.comments);
  const username = useSelector(state => state.auth.username);
  const userId = useSelector(state => state.auth.userId);
  const token = useSelector(state => state.auth.token);

  const [text, setText] = useState('');
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [dislikesCount, setDislikesCount] = useState(0);

  useEffect(() => {
    if (blogs.length === 0) dispatch(fetchBlogs());
  }, [dispatch, blogs.length]);

  const blog = blogs.find(blog => blog._id === id);
  console.log(blog)
  useEffect(() => {
    dispatch(fetchComments(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (blog) {
      setLiked(blog.likes.includes(userId));
      setDisliked(blog.dislikes?.includes(userId));
      setLikesCount(blog.likes.length);
      setDislikesCount(blog.dislikes?.length || 0);
    }
  }, [blog, userId]);

  const handlePrivious = () => navigate('/');

  const handleSubmit = () => {
    if (!text.trim()) return;
    dispatch(postComment({ blogId: id, text, token }))
      .then((res) => {
        if (res.payload?.isApproved) {
          dispatch(fetchComments(id));
        }
      });
    setText('');
  };

  const handleDelete = (commentId, commentUsername) => {
    if (commentUsername !== username) return;
    dispatch(deleteComment({ commentId, token }));
  };

  const toggleLike = (usertype) => {
    
    if (!token) {
      alert("Please login to like the blog.");
      return;
    }

    dispatch(likeBlog({ blogId: id, token, usertype }))
      .then((res) => {
        const updatedBlog = res.payload;
        if (updatedBlog) {
          setLiked(updatedBlog.likes.includes(userId));
          setDisliked(updatedBlog.dislikes.includes(userId));
          setLikesCount(updatedBlog.likes.length);
          setDislikesCount(updatedBlog.dislikes.length);
        }
      });
  };

  const toggleDislike = (usertype) => {
    
    if (!token) {
      alert("Please login to dislike the blog.");
      return;
    }

    dispatch(dislikeBlog({ blogId: id, token,usertype }))
      .then((res) => {
        const updatedBlog = res.payload;
        let obj = updatedBlog.updatedBlog;
        if (obj) {
          setLiked(obj?.likes.includes(userId));
          setDisliked(obj?.dislikes.includes(userId));
          setLikesCount(obj?.likes.length);
          setDislikesCount(obj?.dislikes.length);
        }
      });
  };

  if (blogStatus === 'loading') {
    return <div className="text-center mt-20 text-lg font-semibold text-gray-700">Loading blog details...</div>;
  }

  if (!blog) {
    return <div className="text-center mt-20 text-xl text-gray-500 font-medium">Blog not found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 bg-gray-50 rounded-3xl shadow-lg mt-12 mb-20">
      <div className="overflow-hidden rounded-3xl shadow-lg">
        <img
          src={`${import.meta.env.VITE_API_URL}/uploads/${blog. createdByRole === 'User' ? 'UserBlog/' : ''}${blog.photo}`}
          alt={blog.title}
          className="w-full h-96 object-cover object-center transition-transform duration-500 hover:scale-105"
        />
      </div>

      <div className="mt-8">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">{blog.title || "Untitled Blog"}</h1>
        <p className="text-sm text-gray-500 mt-2">
          By {blog.createdBy?.name || blog.createdBy?.username || "Unknown"} •{" "}
          {new Date(blog.createdAt).toLocaleString('en-IN', {
            dateStyle: 'short',
            timeStyle: 'short'
          }) || "Unknown date"}
        </p>

        {/* Like & Dislike Buttons */}
        <div className="mt-4 flex items-center gap-6">
          <button
            onClick={()=>toggleLike(blog.createdByRole ? "user" : "admin")}
            className={`flex items-center gap-2 ${liked ? 'text-blue-600' : 'text-gray-500'} hover:text-blue-700 transition`}
          >
            <FaThumbsUp className="w-5 h-5" />
            <span>{likesCount}</span>
          </button>

          <button
            onClick={()=>toggleDislike(blog.createdByRole ? "user" : "admin")}
            className={`flex items-center gap-2 ${disliked ? 'text-red-600' : 'text-gray-500'} hover:text-red-700 transition`}
          >
            <FaThumbsDown className="w-5 h-5" />
            <span>{dislikesCount}</span>
          </button>
        </div>
      </div>

      <div className="mt-8 bg-white p-8 rounded-2xl shadow-inner prose prose-indigo max-w-none leading-relaxed text-gray-800 whitespace-pre-wrap">
        {blog.description || blog.content}
      </div>

      {/* Comments */}
      <div className="mt-12 bg-white p-4 rounded-2xl shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-blue-600">
          Comments ({comments.length})
        </h2>

        {commentStatus === 'loading' ? (
          <div>Loading comments...</div>
        ) : (
          <ul className="space-y-2">
            {comments
              .filter(comment =>
                comment.userId &&
                (comment.isApproved || comment.userId.username === username)
              )
              .map((comment) => (
                <li key={comment._id} className="bg-gray-100 p-3 rounded-xl shadow-sm">
                  <p className="text-gray-800">
                    {comment.text}
                    {!comment.isApproved && comment.userId.username === username && (
                      <span className="text-yellow-500 ml-2 text-sm">(Pending approval)</span>
                    )}
                  </p>
                  <div className="text-sm text-gray-500 flex justify-between items-center">
                    <span>
                      - {comment.userId.username || "Unknown"},{" "}
                      {new Date(comment.createdAt).toLocaleString('en-IN', {
                        dateStyle: 'short',
                        timeStyle: 'short'
                      })}
                    </span>
                    {comment.userId.username === username && (
                      <button
                        onClick={() => handleDelete(comment._id, comment.userId.username)}
                        className="text-red-500 text-sm hover:underline"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>
                </li>
              ))}
          </ul>
        )}
      </div>

      {/* Comment Form */}
      <div className="mt-12 bg-white p-8 rounded-2xl shadow-md">
        <h2 className="text-2xl font-semibold mb-6 text-gray-900">Leave a Comment</h2>
        <textarea
          className="w-full border border-gray-300 rounded-lg p-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
          rows="5"
          placeholder="Apna comment likhiye..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>
        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={handleSubmit}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow hover:bg-indigo-700 transition"
          >
            Submit
          </button>
          <button
            onClick={handlePrivious}
            className="bg-green-600 text-white px-6 py-3 rounded-lg shadow hover:bg-green-700 transition"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogDetails;
