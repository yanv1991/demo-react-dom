
import react from 'react';

import styles from './MyComponent.module.scss';
import OtherChild from './OtherChild';

function MyComponent (props) {
    return (
      <>
        <div className={styles.container}>I am a component</div>
        <OtherChild />
      </>
    );
  }

export default MyComponent;