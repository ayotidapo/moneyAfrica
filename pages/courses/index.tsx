import VideoPage from 'components/VideosListPage';
import Modal from 'common/Modal';
import { getToken } from 'helpers/getToken';
import axios from 'axios';
import Footer from 'common/Footer';
import Image from 'next/image';
import { GetServerSideProps } from 'next';
import { getCookie } from 'cookies-next';
import { setCourses } from 'reducers/courses';
import { useSelector, wrapper } from 'store';
import Button from 'common/Button';
import Icon from 'common/Icon';
import { useState } from 'react';

interface Props {
  totalCount: number;
  [key: string]: any;
}

const Videos: React.FC<Props> = ({ totalCount }) => {
  const courses: any = useSelector((state) => state.courses);
  const [isOpen, setIsOpen] = useState(false);
  const { user }: any = useSelector((state) => state.user?.user);
  console.log(user), 'CHECK';

  return (
    <>
      <VideoPage
        courses={courses?.courses}
        totalCount={totalCount}
        paginationUrl="/courses"
      />
      <Footer />
      <Modal openModal={isOpen} onClose={() => setIsOpen(false)}>
        <div className="updateInfo">
          <div className="imgDiv">
            <Image
              src="/assets/update-info.png"
              alt="update-user-info"
              layout="fill"
            />
          </div>
          <div className="complete-info">
            <h2 className="title">We need more information from you.</h2>
            <p>
              We require you to complete all your account information such as
              (date of birth, your state &amp; country etc..). This will help to
              keep your account more secure and protected.
            </p>
            <div style={{ textAlign: 'right' }}>
              <Button bg="#C03E21">
                Yes, Continue
                <Icon id="arrow-right" />
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Videos;

export const getServerSideProps: GetServerSideProps =
  wrapper.getServerSideProps((store) => async ({ req, query, res }) => {
    const c_token = getCookie('c_token', { req, res });
    const { s_token, userId } = getToken(c_token as string);
    const page = Number(query?.page) || 1;
    if (!userId) {
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
      };
    }
    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${s_token}`;
      const { data } = await axios.get(
        `/courses-user/?skip=${(page - 1) * 12}&take=12`,
      );

      store.dispatch(setCourses(data?.courses));

      if (page > 1 && data?.courses?.length < 1) {
        return {
          notFound: true,
        };
      }

      return {
        props: {
          totalCount: data.totalCount,
        },
      };
    } catch (e) {
      store.dispatch(setCourses(null));
      return {
        props: {
          error: 'call failed',
        },
      };
    }
  });

// export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
//   const c_token = getCookie('c_token', { req, res });
//   const { s_token, userId } = getToken(c_token as string);

//   if (!userId) {
//     return {
//       redirect: {
//         destination: '/login',
//         permanent: false,
//       },
//     };
//   }
//   try {
//     axios.defaults.headers.common['Authorization'] = `Bearer ${s_token}`;
//     const { data } = await axios.get('/courses-user/noauth?skip=0&take=20');
//     return {
//       props: {
//         data,
//       },
//     };
//   } catch (e) {
//     return {
//       props: {
//         error: 'call failed',
//       },
//     };
//   }
// };
