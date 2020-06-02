import React from 'react';
import dynamic from 'next/dynamic';

// const Child = React.lazy(() => import('../components/Child'));
const Child = dynamic(() => import(/* webpackChunkName: "ssr-cpm-child" */ '../components/Child'));

function OtherComponent (props) {
  return (
    <>
      <div>I am other component</div>
      <Child />
    </>
  );
}

export default OtherComponent;