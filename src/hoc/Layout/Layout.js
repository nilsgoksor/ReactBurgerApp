import React, { useState } from "react";
import { connect } from "react-redux";

import Aux from "../Aux/Aux";
import classes from "./Layout.css";
import Toolbar from "../../components/Navigation/Toolbar/Toolbar";
import SideDrawer from "../../components/Navigation/SideDrawer/SideDrawer";

const layout = props => {
  const [showSideDrawerIsVisible, setShowSideDrawerIsVisible] = useState(false);

  const sideDrawerClosedHandler = () => {
    setShowSideDrawerIsVisible(false);
  };

  const sideDrawerToggleHandler = () => {
    setShowSideDrawerIsVisible(!setShowSideDrawerIsVisible);
  };

  return (
    <Aux>
      <Toolbar
        drawerToggleClicked={sideDrawerToggleHandler}
        isAuth={props.isAuthenticated}
      />
      <SideDrawer
        open={showSideDrawerIsVisible}
        closed={sideDrawerClosedHandler}
        isAuth={props.isAuthenticate}
      />
      <main className={classes.Content}>{props.children}</main>
    </Aux>
  );
};

const mapStateToProps = state => {
  return { isAuthenticated: state.auth.token !== null };
};

export default connect(mapStateToProps)(layout);
