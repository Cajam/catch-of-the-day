import React from "react";
import { formatPrice } from "../helpers";
import { TransitionGroup, CSSTransition } from 'react-transition-group';

class Order extends React.Component {
  renderOrder = (key) => {
    const fish = this.props.fishes[key];
    const count = this.props.order[key];
    const isAvailable = fish && fish.status === "available";

    // if there's no fish loaded, show nothing in the order
    if (!fish) return null;

    if (!isAvailable) {
      return (
        <CSSTransition>
          <li key={key}>
            Sorry {fish ? fish.name : 'fish'} is no longer available
        <button onClick={this.handleClick}>Remove</button>
          </li>
        </CSSTransition>
      )
    }

    return (
      <CSSTransition classNames="order" key={key} timeout={{ enter: 1500, exit: 1500 }}>
        <li key={key}>
          {count} lbs {fish.name}
          {formatPrice(fish.price)}
          <button onClick={() => this.props.removeFromOrder(key)}>Remove</button>
        </li>
      </CSSTransition>
    )
  }

  render() {
    const orderIds = Object.keys(this.props.order);
    const total = orderIds.reduce((prevTotal, key) => {
      const fish = this.props.fishes[key];
      const count = this.props.order[key];
      const isAvailable = fish && fish.status === 'available';
      if (isAvailable) {
        return prevTotal + (count * fish.price);
      }
      return prevTotal;
    }, 0);

    return (
      <div className="order-wrap">
        <h2>Order</h2>
        <TransitionGroup component="ul" className="order">
          {orderIds.map(this.renderOrder)}
        </TransitionGroup>
        <div className="total">
          Total: <strong>{formatPrice(total)}</strong>
        </div>
      </div>
    )
  }
}

export default Order;
