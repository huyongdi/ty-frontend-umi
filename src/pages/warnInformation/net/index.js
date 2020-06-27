import React, { useState, useEffect } from 'react';
import store from '../../../stores';
import { connect, useDispatch, useSelector } from 'react-redux';

@connect(
  state => ({
    home: state.home,
  }),
  ({ home }) => ({
    updateKey: home.updateKey,
  }),
)
export default class Home extends React.Component {
  componentDidMount() {
    console.log(222);
  }

  render() {
    const { status } = this.props.home;
    return (
      <div>
        <h1>Hello, world!</h1>
        <span>{status}</span>
        <button onClick={() => this.props.updateKey({ status: 10 })}>
          Click store
        </button>
      </div>
    );
  }
}
