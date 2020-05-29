import React, { Suspense } from 'react';

const Child = React.lazy(() => import('../components/Child'));

function MyComponent (props) {
  const isServer = typeof window === "undefined";
  const fallback = <div>loading...</div>;

  return (
    <>
      <div>I am other component</div>
        {
        isServer ? (
            fallback
        ) : (
            <Suspense fallback={fallback}>
             <Child />
            </Suspense>
        )
        }
    </>
  );
}

export default MyComponent;