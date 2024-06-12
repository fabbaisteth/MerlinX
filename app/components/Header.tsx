'use client';

import Image from 'next/image';
import styles from './Header.module.css';
import UserSettings from './UserSettings';

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logoContainer}>
        <Image src="/logo.png" alt="Logo" width={100} height={50} className={styles.logo} />
      </div>
      <div className={styles.rightContainer}>
        <UserSettings />
        <div className={styles.buttonContainer}>
          <button className={styles.button}>LOGIN</button>
          <button className={`${styles.button} ${styles.signupButton}`}>SIGN UP</button>
        </div>
      </div>
    </header>
  );
};

export default Header;
