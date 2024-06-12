'use client';

import Image from 'next/image';
import { FaCog } from 'react-icons/fa';
import styles from './UserSettings.module.css';

const UserSettings = () => {
  return (
    <div className={styles.userSettings}>
      <Image src="/user.png" alt="User Picture" width={40} height={40} className={styles.userPicture} />
      <FaCog className={styles.settingsIcon} />
    </div>
  );
};

export default UserSettings;
