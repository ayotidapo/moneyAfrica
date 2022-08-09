/* eslint-disable react-hooks/exhaustive-deps */
import Image from 'next/image';
import Input from 'common/Input';
import Icon from 'common/Icon';
import { LabelCheck } from 'common/LabelTag';
import Select from 'common/Select';
import Button from 'common/Button';
import fields from './fields';
import styles from './myprofile.module.scss';
import { useDispatch, useSelector } from 'store';
import { useEffect, useRef, useState } from 'react';
import useForm from 'hooks/useForm';
import { countries, getStates } from 'utils/country';
import axios from 'axios';
import { setUser } from 'reducers/user';

interface Props {}
const MyProfile: React.FC<Props> = () => {
  const { user } = useSelector((state) => state?.user?.user);
  const { inputs, onChangeInput, onBlurInput, getPayload, setInputs } =
    useForm(fields);
  console.log({ inputs });
  const [userState, setUserState] = useState(user?.residentState);
  const [userCountry, setUserCountry] = useState(user?.residentCountry);
  const [states, setStates] = useState([{ label: '', value: '' }]);
  const [submitting, setSubmitting] = useState(false);
  const today = new Date();
  const tenYrsAgo = today.setFullYear(today.getFullYear() - 10);
  const minVal = new Date(tenYrsAgo).toISOString().substr(0, 10);

  console.log({ user }, 9);
  const updateStates = (country: string) => {
    const states = getStates(country);

    if (states) setStates(states);
  };

  const onSelect = (e: any) => {
    const { name, value } = e.target;

    if (name === 'residentCountry') setUserCountry(value);
    if (name === 'residentState') setUserState(value);
  };

  const onSubmit = async () => {
    try {
      setSubmitting(true);
      const body = getPayload();
      body.residentCountry = userCountry;
      body.residentState = userState;
      delete body.nigeriaPhone;
      return console.log({ body });
      const { data } = await axios.patch(`/auth/profile`, body);
      setUser(data);
      setSubmitting(false);
    } catch (e) {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    updateStates(userCountry);
    const mInputs = { ...inputs };
    Object.keys(mInputs).forEach((field) => {
      if (field === 'dob') mInputs[field].value = user[field]?.substr(0, 10);
      else mInputs[field].value = user[field];
    });
    setInputs(mInputs);
  }, []);

  useEffect(() => {
    updateStates(userCountry);
  }, [userCountry]);

  return (
    <form className={styles.profile_wrapper}>
      <div className={styles.profile_imgr}>
        <div className={styles.lft}>
          <h3>Profile Image</h3>
          <p>Choose a new avatar to be used across your MoneyAfrica account.</p>
        </div>
        <div className={`${styles.ryt}  ${styles.dx_al}`}>
          <span className={styles.avatar_wrapper}>
            <span className={`avatar ${styles.avatar}`}>
              <Image
                src="/assets/girl.png"
                layout="fill"
                alt="profile-picture"
              />
            </span>
          </span>
          <Icon
            className="hand"
            id="img-logo"
            style={{ margin: '0px 7px 0px 15px', color: '#015351' }}
          />
          <h4 className="hand" style={{ fontSize: '1.4rem', color: '#015351' }}>
            Edit Profile
          </h4>
        </div>
      </div>

      <div className={styles.personal_info}>
        <div className={styles.lft}>
          <h3>Personal Info</h3>
          <p>Make edits and updates to your name</p>
        </div>
        <div className={`flx-dir-col ${styles.ryt}`}>
          <div className="split">
            <Input
              field={inputs.firstName}
              leftIcon={{ name: 'user' }}
              onChange={onChangeInput}
              onBlur={onBlurInput}
            />
            <Input
              field={inputs.lastName}
              leftIcon={{ name: 'user' }}
              onChange={onChangeInput}
              onBlur={onBlurInput}
            />
          </div>
          <Input
            field={inputs.email}
            leftIcon={{ name: 'envelope' }}
            onChange={onChangeInput}
            onBlur={onBlurInput}
          />
          <div className={styles.split_phone}>
            <Input
              field={inputs.nigeriaPhone}
              leftIcon={{ name: 'phone' }}
              rightIcon={{ name: 'caret-down', pos: [28, 72] }}
              onChange={onChangeInput}
              onBlur={onBlurInput}
            >
              <Icon
                id="nigeria"
                width={24}
                height={24}
                className={styles.nigeria}
              />
            </Input>
            <Input
              field={inputs.phone}
              inputClass={styles.phone}
              onChange={onChangeInput}
              onBlur={onBlurInput}
            >
              <span className={styles.number}>+234</span>
            </Input>
          </div>
          <div className={styles.radio_div}>
            <LabelCheck
              tag="female"
              rname="gender"
              value="female"
              type="radio"
              defaultChecked={user?.gender === 'female'}
              onChange={onChangeInput}
            />
            <Input
              field={inputs.gender}
              defaultChecked={user?.gender === 'male'}
              onChange={onChangeInput}
            />
          </div>
          <Input
            field={inputs.dob}
            leftIcon={{ name: 'dob' }}
            max={minVal}
            onChange={onChangeInput}
          />
        </div>
      </div>
      <div className={styles.contact_info}>
        <div className={styles.lft}>
          <h3>Contact Info</h3>
          <p>Make edits and updates to your contact details</p>
          <p>To change your email, reach out to admin@moneyafrica.com</p>
        </div>
        <div className={`flx-dir-col ${styles.ryt}`}>
          <Select
            name="residentCountry"
            options={countries}
            optionSelected={userCountry}
            onChange={onSelect}
          />
          <Select
            name="residentState"
            options={states}
            optionSelected={userState}
            onChange={onSelect}
          />
          <div className={styles.btn_con}>
            <Button onClick={onSubmit} loading={submitting}>
              {' '}
              Save changes
              <Icon id="arrow-right" width={20} height={20} />
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default MyProfile;
