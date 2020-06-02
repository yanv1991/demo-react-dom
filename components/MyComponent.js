
import react from 'react';

import styles from './MyComponent.scss';
import OtherChild from './OtherChild';

function MyComponent (props) {
    return (
      <>
        <div className={styles.myContainer}>I am a component</div>
        <OtherChild />
      </>
    );
  }

export default MyComponent;