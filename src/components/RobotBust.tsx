import styles from "./RobotBust.module.css";

export default function RobotBust() {
  return (
    <div
      className={`robot-bust hidden opacity-0 sm:block ${styles.wrap}`}
      aria-hidden="true"
    >
      <div className={styles.orbit} />
      <div className={styles.scanRing} />
      <div className={styles.shadow} />
      <div className={styles.bot}>
        <div className={styles.backGlow} />
        <div className={styles.antenna}>
          <i />
        </div>
        <div className={`${styles.ear} ${styles.earLeft}`} />
        <div className={`${styles.ear} ${styles.earRight}`} />
        <div className={styles.head}>
          <div className={styles.headShine} />
          <div className={styles.faceplate}>
            <div className={styles.visor}>
              <span />
              <span />
            </div>
            <div className={styles.faceGrid} />
          </div>
        </div>
        <div className={styles.neck}>
          <i />
          <i />
          <i />
        </div>
        <div className={`${styles.shoulder} ${styles.shoulderLeft}`} />
        <div className={`${styles.shoulder} ${styles.shoulderRight}`} />
        <div className={`${styles.arm} ${styles.armLeft} wave-arm`}>
          <i />
          <span className={styles.hand}>
            <span className={styles.palm} />
            <i className={`${styles.finger} ${styles.fingerA}`} />
            <i className={`${styles.finger} ${styles.fingerB}`} />
            <i className={`${styles.finger} ${styles.fingerC}`} />
            <i className={`${styles.finger} ${styles.fingerD}`} />
            <i className={`${styles.finger} ${styles.fingerE}`} />
          </span>
        </div>
        <div className={`${styles.arm} ${styles.armRight}`}>
          <i />
          <span className={styles.hand}>
            <span className={styles.palm} />
            <i className={`${styles.finger} ${styles.fingerA}`} />
            <i className={`${styles.finger} ${styles.fingerB}`} />
            <i className={`${styles.finger} ${styles.fingerC}`} />
            <i className={`${styles.finger} ${styles.fingerD}`} />
            <i className={`${styles.finger} ${styles.fingerE}`} />
          </span>
        </div>
        <div className={styles.torso}>
          <div className={styles.chestPanel}>
            <span className={styles.core}>
              <i />
            </span>
            <span className={`${styles.coreLine} ${styles.lineA}`} />
            <span className={`${styles.coreLine} ${styles.lineB}`} />
            <span className={`${styles.coreLine} ${styles.lineC}`} />
          </div>
          <div className={styles.torsoHighlight} />
        </div>
        <div className={styles.waist}>
          <i />
          <i />
          <i />
        </div>
      </div>
    </div>
  );
}
