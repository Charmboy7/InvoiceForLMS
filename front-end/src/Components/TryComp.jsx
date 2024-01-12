import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const TryComp = () => {
  return (
    <div className="container">
      <div className="row">
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              {/* Content for First Card */}
              <h5 className="card-title">Card 1</h5>
              <p className="card-text">Content for Card 1.</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              {/* Content for Second Card */}
              <h5 className="card-title">Card 2</h5>
              <p className="card-text">Content for Card 2.</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              {/* Content for Third Card */}
              <h5 className="card-title">Card 3</h5>
              <p className="card-text">Content for Card 3.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TryComp;
