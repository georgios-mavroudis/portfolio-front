import { useTranslation } from 'react-i18next';

export const NotFound = () => {
  const { t } = useTranslation();
  return <div>{t('NOT_FOUND.NO_PAGE_FOUND')}</div>;
};
