import React, { Component } from "react";
import StripeSheckout from "react-stripe-checkout";
import { connect } from "react-redux";
import * as actions from "../actions";

class Payments extends Component {
  render() {
    return (
      <StripeSheckout
        name="Emaily"
        description="Buy credits"
        amount={500}
        token={token => this.props.handleToken(token)}
        stripeKey={process.env.REACT_APP_STRIPE_KEY}
      >
        <button className="btn">Add Credits</button>
      </StripeSheckout>
    );
  }
}

export default connect(null, actions)(Payments);
