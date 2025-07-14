import React from 'react';

const About = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 bg-white shadow-lg rounded-2xl">
      <h1 className="text-4xl font-extrabold text-center text-blue-700 mb-8">
        About This Blog
      </h1>

      <p className="text-lg text-gray-700 mb-6 text-center">
        Welcome to <span className="font-semibold text-blue-600">My Blog</span> – a space where ideas, stories, and knowledge meet web development.
      </p>

      {/* Who Am I Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2"> Who Am I?</h2>
        <p className="text-gray-700 leading-relaxed">
          I'm <strong>Abdullah Khan</strong>, a MERN Stack Developer who loves building modern web apps. I started this blog to document my journey, share learnings, and connect with like-minded coders.
        </p>
      </section>

      {/* What You'll Find */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2"> What You'll Find</h2>
        <ul className="list-disc pl-6 text-gray-700 space-y-1">
          <li>Step-by-step tutorials on React, Node, MongoDB</li>
          <li>Tips for beginners in web dev & DSA</li>
          <li>Real-world project breakdowns</li>
          <li>Tech thoughts, code snippets, and more!</li>
        </ul>
      </section>

      {/* Why This Blog */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">🎯 Why This Blog?</h2>
        <p className="text-gray-700 leading-relaxed">
          I believe in growing by sharing. This blog is my way to give back to the dev community and help others who are just starting or stuck somewhere in the coding world.
        </p>
      </section>

      {/* Connect */}
      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-2"> Let's Connect</h2>
        <p className="text-gray-700">
          Got questions, ideas, or want to collaborate? Hit me up on{' '}
          <a
            href="https://linkedin.com/in/abdullah-khan-90922624b"
            className="text-blue-500 hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn
          </a>{' '}
          or check out my work on{' '}
          <a
            href="https://github.com/abdullahkhan88"
            className="text-blue-500 hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>.
        </p>
      </section>

      <div className="text-center mt-10">
        <p className="text-gray-600 italic">Thanks for stopping by. Keep learning, keep building! 🚀</p>
      </div>
    </div>
  );
};

export default About;
