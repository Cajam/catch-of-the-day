import React from "react";
import Header from "./Header";
import Order from "./Order";
import Inventory from "./Inventory";
import Fish from "./Fish";
import sampleFishes from "../sample-fishes";
import base from "../base";

class App extends React.Component {
  state = {
    fishes: {},
    order: {}
  };

  componentDidMount() {
    console.log("Component mounted successfully. App component is live!");
    const { params } = this.props.match;
    // Reinstate localStorage, check if it already exists
    const localStorageRef = localStorage.getItem(params.storeId);
    if (localStorageRef) {
      this.setState({ order: JSON.parse(localStorageRef) });
    }

    // Sync up to Firebase. It's that easy! We're using firebase for the store's fish inventory, and localStorage for the user's order
    this.ref = base.syncState(`${this.props.match.params.storeId}/fishes`, {
      context: this,
      state: 'fishes'
    });
  }

  componentDidUpdate() {
    console.log("Component updated.");
    localStorage.setItem(this.props.match.params.storeId, JSON.stringify(this.state.order));
  }

  componentWillUnmount() {
    console.log("Component unmounting! App component no longer showing.");
    // Unmount from Firebase so you don't have memory leaks once you're done with a store
    base.removeBinding(this.ref);
  }

  addFish = fish => {
    // 1. Take a copy of the existing state
    const fishes = { ...this.state.fishes };
    // 2. Add our new fish to that fishes variable
    fishes[`fish${Date.now()}`] = fish;
    // 3. Set the new fishes object to state
    this.setState({ fishes });
  };

  // Used by EditFishForm to update date "upstream" in React
  updateFish = (key, updatedFish) => {
    // Take a copy of the current state fish
    const fishes = { ...this.state.fishes };
    // Update state with new fishes
    fishes[key] = updatedFish;
    // Set that to the new state
    this.setState({ fishes });
  }

  deleteFish = (key) => {
    // Take a copy of state
    const fishes = { ...this.state.fishes };
    // Update the state by removing an item
    fishes[key] = null;
    // Update state
    this.setState({ fishes });
  }

  loadSampleFishes = () => {
    this.setState({ fishes: sampleFishes });
  }

  addToOrder = (key) => {
    // Take a copy of state
    const order = { ...this.state.order };
    // Update the order 
    order[key] = order[key] + 1 || 1;
    // Call setState to update the state object
    this.setState({ order });
  }

  removeFromOrder = (key) => {
    // Take a copy of the current order state
    const order = { ...this.state.order };
    // Delete the inventory item
    delete order[key];
    // Set state
    this.setState({ order });
  }

  render() {
    return (
      <div className="catch-of-the-day">
        <div className="menu">
          <Header tagline="Fresh Seafood Market" />
          <ul className="fishes">
            {Object.keys(this.state.fishes).map(key =>
              <Fish
                key={key}
                index={key}
                details={this.state.fishes[key]}
                addToOrder={this.addToOrder}
              />
            )}
          </ul>
        </div>
        <Order
          removeFromOrder={this.removeFromOrder}
          fishes={this.state.fishes}
          order={this.state.order}
        />
        <Inventory
          addFish={this.addFish}
          updateFish={this.updateFish}
          deleteFish={this.deleteFish}
          loadSampleFishes={this.loadSampleFishes}
          fishes={this.state.fishes}
        />
      </div>
    );
  }
}

export default App;
