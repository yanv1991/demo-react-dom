
import react from 'react';

import styles from './Child.module.scss';

function Child (props) {
    return (
      <div className={styles.container}>I am a child</div>
    );
  }

export default Child;