import React from "react";

class AppFooter extends React.Component {
  render() {
    return (
      <footer className="footer">
        <div className="container">
          <hr />
          <div className="row align-items-center justify-content-md-between">
            <div className="col-md-6">
              <div className="copyright">
                © 2026 <a href="" target="_blank" className="keychainify-checked">HivedScan</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    );
  }
}

export default AppFooter;