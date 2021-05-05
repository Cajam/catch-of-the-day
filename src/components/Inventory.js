import React from "react";
import AddFishForm from "./AddFishForm";
import EditFishForm from "./EditFishForm";
import Login from "./Login";
import firebase from 'firebase';
import base, { firebaseApp } from "../base";

class Inventory extends React.Component {
  state = {
    uid: null,
    owner: null
  }

  authHandler = async (authData) => {
    console.log(authData);
    // Look up the current store
    const store = await base.fetch(this.props.storeId, { context: this })
    console.log("Current store: ", store);
    // Claim it if there is no owner
    if (!store.owner) {
      console.log("New store owner!");
      // save it as our own 
      await base.post(`${this.props.storeId}/owner`, {
        data: authData.user.uid
      });
    }
    // Set the state of the inventory component to reflect the current user
    this.setState({
      uid: authData.user.uid,
      owner: store.owner || authData.user.uid
    });
  }

  authenticate = (provider) => {
    console.log("Login");
    const authProvider = new firebase.auth.FacebookAuthProvider();
    firebaseApp
      .auth()
      .signInWithPopup(authProvider)
      .then(this.authHandler);
  }

  logout = async () => {
    console.log("Logging out");
    await firebase.auth().signOut();
    this.setState({ uid: null });
  }

  render() {
    const logout = <button onClick={this.logout}>Log Out</button>

    // check if they're logged in already
    if (!this.state.uid) {
      return (<Login authenticate={this.authenticate} />)
    }
    // check if they're not the owner of the store
    if (this.state.uid !== this.state.owner) {
      return (
        <div>
          <p>Sorry, you are not the owner of this store.</p>
          {logout}
        </div>
      )
    }
    // if they are the owner, render the inventory component
    return (
      <div className="inventory">
        <h2>Inventory</h2>
        {Object.keys(this.props.fishes).map(key =>
          <EditFishForm
            key={key}
            index={key}
            updateFish={this.props.updateFish}
            deleteFish={this.props.deleteFish}
            fish={this.props.fishes[key]}
          />)}
        <AddFishForm addFish={this.props.addFish} />
        <button onClick={this.props.loadSampleFishes}>Load Sample Fishes</button>
        {logout}
      </div>
    );
  }
}

export default Inventory;