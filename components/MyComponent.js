
import react from 'react';

import OtherChild from './OtherChild';

function MyComponent (props) {
    return (
      <>
        <div>I am a component</div>
        <OtherChild />
      </>
    );
  }

export default MyComponent;