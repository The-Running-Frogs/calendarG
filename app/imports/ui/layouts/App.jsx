/* Code written by Keanu Williams */

import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import 'semantic-ui-css/semantic.css';
import { Roles } from 'meteor/alanning:roles';
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import TopMenu from '../components/TopMenu';
import Footer from '../components/Footer';
import Landing from '../pages/Landing';
import VerifyEmail from '../pages/VerifyEmail';
import UserHome from '../pages/UserHome';
import AccountSettings from '../pages/AccountSettings';
import Signup from '../pages/Signup';
import NotFound from '../pages/NotFound';
import Signout from '../pages/Signout';
import ChangeEmail from "../pages/ChangeEmail";
import ChangePassword from "../pages/ChangePassword";

/** Top-level layout component for this application. Called in imports/startup/client/startup.jsx. */
class App extends React.Component {
  render() {
    return (
        <Router>
          <div className='Site'>
            <TopMenu/>
            <div className='Site-content'>
                <Switch>
                    <Route exact path="/" component={Landing}/>
                    <Route path="/register" component={Signup}/>
                    <Route exact path='/verify-email/:token' component={VerifyEmail}/>
                    <Route path="/home" component={(props) => {
                        const isLogged = Meteor.userId() !== null;
                        return isLogged ?
                            (<UserHome {...props} />) :
                            (<Redirect to={{ pathname: '/', state: { from: props.location } }}/>
                            );
                    }}/>
                    <Route path="/settings" component={(props) => {
                        const isLogged = Meteor.userId() !== null;
                        return isLogged ?
                            (<AccountSettings {...props} />) :
                            (<Redirect to={{ pathname: '/', state: { from: props.location } }}/>
                            );
                    }}/>
                    <Route path="/signout" component={(props) => {
                        const isLogged = Meteor.userId() !== null;
                        return isLogged ?
                            (<Signout {...props} />) :
                            (<Redirect to={{ pathname: '/', state: { from: props.location } }}/>
                            );
                    }}/>
                    <Route path="/changepw" component={ChangePassword}/>
                    <Route path="/changeem" component={ChangeEmail}/>
                    <Route component={NotFound}/>
                </Switch>
            </div>
            <Footer/>
          </div>
        </Router>
    );
  }
}

/**
 * ProtectedRoute (see React Router v4 sample)
 * Checks for Meteor login before routing to the requested page, otherwise goes to signin page.
 * @param {any} { component: Component, ...rest }
 */
const ProtectedRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      const isLogged = Meteor.userId() !== null;
      return isLogged ?
          (<Component {...props} />) :
          (<Redirect to={{ pathname: '/', state: { from: props.location } }}/>
      );
    }}
  />
);

/**
 * AdminProtectedRoute (see React Router v4 sample)
 * Checks for Meteor login and admin role before routing to the requested page, otherwise goes to signin page.
 * @param {any} { component: Component, ...rest }
 */
const AdminProtectedRoute = ({ component: Component, ...rest }) => (
    <Route
        {...rest}
        render={(props) => {
          const isLogged = Meteor.userId() !== null;
          const isAdmin = Roles.userIsInRole(Meteor.userId(), 'admin');
          return (isLogged && isAdmin) ?
              (<Component {...props} />) :
              (<Redirect to={{ pathname: '/', state: { from: props.location } }}/>
              );
        }}
    />
);

/** Require a component and location to be passed to each ProtectedRoute. */
ProtectedRoute.propTypes = {
  component: PropTypes.func.isRequired,
  location: PropTypes.object,
};

/** Require a component and location to be passed to each AdminProtectedRoute. */
AdminProtectedRoute.propTypes = {
  component: PropTypes.func.isRequired,
  location: PropTypes.object,
};

export default App;
