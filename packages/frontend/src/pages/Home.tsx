import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC<{}> = () => {
  return (
    <div className="hero min-page-height bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">Build a Habit</h1>
          <p className="py-6">
            Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
            excepturi exercitationem quasi. In deleniti eaque aut repudiandae et
            a id nisi.
          </p>
          <Link to="/join">
            <button className="btn btn-secondary">Get Started</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
