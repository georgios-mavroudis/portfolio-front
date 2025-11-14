import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDector)
  .use(initReactI18next)
  .init({
    debug: true,
    fallbackLng: 'en',
    resources: {
      en: {
        translation: {
          ABOUT_ME: {
            DESCRIPTION:
              'I am a software engineer with 9 years of experience. I have worked in a multitude of startups and high speed environments to understand how products get delivered fast and with high quality.One of my life changing experiences has been in the company Cardiologs where it was a success story and it got acquired by Philips.',
          },
        },
      },
      fr: {
        translation: {
          ABOUT_ME: {
            DESCRIPTION:
              "Je suis un ingénieur logiciel avec 9 ans d'expérience. J'ai travaillé dans une multitude de startups et d'environnements à grande vitesse pour comprendre comment les produits sont livrés rapidement et avec une haute qualité. L'une de mes expériences qui a changé ma vie a été dans la société Cardiologs, où ce fut une histoire à succès et elle a été acquise par Philips.",
          },
        },
      },
    },
  });

export default i18n;
