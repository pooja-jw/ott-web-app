import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { object, string } from 'yup';
import { useTranslation } from 'react-i18next';

import { useAccountStore } from '../../../stores/AccountStore';
import ResetPasswordForm from '../../../components/ResetPasswordForm/ResetPasswordForm';
import useForm, { UseFormOnSubmitHandler } from '../../../hooks/useForm';
import ForgotPasswordForm from '../../../components/ForgotPasswordForm/ForgotPasswordForm';
import type { ForgotPasswordFormData } from '../../../../types/account';
import ConfirmationForm from '../../../components/ConfirmationForm/ConfirmationForm';
import LoadingOverlay from '../../../components/LoadingOverlay/LoadingOverlay';

import { addQueryParam, removeQueryParam } from '#src/utils/location';
import { addQueryParams } from '#src/utils/formatting';
import { logDev } from '#src/utils/common';
import { logout, resetPassword } from '#src/stores/AccountController';

type Prop = {
  type: 'confirmation' | 'forgot' | 'reset' | 'edit';
};

const ResetPassword: React.FC<Prop> = ({ type }: Prop) => {
  const { t } = useTranslation('account');
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAccountStore((state) => state.user);
  const [resetPasswordSubmitting, setResetPasswordSubmitting] = useState<boolean>(false);

  const cancelClickHandler = () => {
    navigate(removeQueryParam(location, 'u'));
  };

  const backToLoginClickHandler = async () => {
    if (user) {
      await logout();
    }
    navigate(addQueryParams('/', { u: 'login' }));
  };

  const resetPasswordClickHandler = async () => {
    const resetUrl = `${window.location.origin}/?u=edit-password`;

    try {
      if (!user?.email) throw new Error('invalid param email');

      setResetPasswordSubmitting(true);
      await resetPassword(user.email, resetUrl);

      setResetPasswordSubmitting(false);
      navigate(addQueryParam(location, 'u', 'send-confirmation'));
    } catch (error: unknown) {
      logDev(error instanceof Error ? error.message : error);
    }
  };

  const emailSubmitHandler: UseFormOnSubmitHandler<ForgotPasswordFormData> = async (formData, { setErrors, setSubmitting }) => {
    const resetUrl = `${window.location.origin}/?u=edit-password`;

    try {
      await resetPassword(formData.email, resetUrl);
      navigate(addQueryParam(location, 'u', 'send-confirmation'));
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message.toLowerCase().includes('invalid param email')) {
          setErrors({ email: t('reset.wrong_email') });
        }
      }
    }
    setSubmitting(false);
  };

  const emailForm = useForm(
    { email: '' },
    emailSubmitHandler,
    object().shape({
      email: string().email(t('login.field_is_not_valid_email')).required(t('login.field_required')),
    }),
    true,
  );

  return (
    <React.Fragment>
      {type === 'reset' && <ResetPasswordForm submitting={resetPasswordSubmitting} onCancel={cancelClickHandler} onReset={resetPasswordClickHandler} />}
      {type === 'forgot' && (
        <ForgotPasswordForm
          value={emailForm.values}
          submitting={emailForm.submitting}
          onChange={emailForm.handleChange}
          errors={emailForm.errors}
          onSubmit={emailForm.handleSubmit}
          onBlur={emailForm.handleBlur}
        />
      )}
      {type === 'confirmation' && <ConfirmationForm loggedIn={!!user} email={user?.email || emailForm.values.email} onBackToLogin={backToLoginClickHandler} />}
      {(emailForm.submitting || resetPasswordSubmitting) && <LoadingOverlay transparentBackground inline />}
    </React.Fragment>
  );
};

export default ResetPassword;
