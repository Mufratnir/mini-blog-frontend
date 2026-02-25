import React from 'react';
import { Link } from 'react-router';
import BasicForm from 'src/components/forms/BasicForm';

const Home = () => {
        return (
          <div>
            <Link to="/auth/register">
              <button className="bg-blue-500 text-white px-4 py-2 rounded">Click Me</button>
            </Link>
           <BasicForm/>
          </div>
        );
};

export default Home;