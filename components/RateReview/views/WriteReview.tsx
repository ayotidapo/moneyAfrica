import Button from 'common/Button';
import Image from 'next/image';
import Icon from 'common/Icon';
import styles from '../ratereview.module.scss';

const WriteReview = () => {
  return (
    <section className={styles.write_rvw}>
      <h2 className="title">Write a review</h2>
      <textarea placeholder="Describe your experience (optional)"></textarea>

      <div className={styles.btns_div}>
        <Button bg="#C03E21" className={styles.rateBtn}>
          Submit
          <Icon id="arrow-right" />
        </Button>
      </div>
    </section>
  );
};
export default WriteReview;

export const Rated = () => {
  return (
    <div className={styles.rated}>
      <div
        style={{
          width: '200px',
          height: '200px',
          position: 'relative',
          visibility: 'hidden',
        }}
      >
        <Image
          src="/assets/rated.svg"
          layout="fill"
          alt="course successfully rated"
        />
      </div>
      <section>
        <h2 className="title">Course rated successfully</h2>
        <p>
          Thank you for taking the time to rate this course. Your rating will
          assist us in determining how we can better serve you.
        </p>

        <div className={styles.btns_div}>
          <Button bg="#C03E21">Dismiss</Button>
        </div>
      </section>
    </div>
  );
};
