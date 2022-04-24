import { ExternalLinkIcon } from '@heroicons/react/solid';
import { useTranslation, Trans } from 'react-i18next';
import { MiniTopbar } from '../../../components/Layout/MiniTopbar';

type AboutLinkProps = {
  url: string;
  content: string;
};

const AboutLink = ({ url, content }: AboutLinkProps) => {
  return (
    <a href={url} target='_blank' rel='noreferrer' className='w-fit no-underline text-blue-700 hover:underline dark:text-blue-400'>
      {content}
      <ExternalLinkIcon className='inline h-4 w-4' />
    </a>
  );
};

export const About = () => {
  const { t } = useTranslation();

  return (
    <>
      <MiniTopbar title={t('about.about')} />
      <div className='flex items-center flex-col m-8'>
        <div className='max-w-prose text-lg dark:text-gray-200'>
          <h1 className='font-bold text-5xl mb-5'>{t('about.firstSection.title')}</h1>

          <p className='mb-4'>
            <Trans i18nKey="about.firstSection.p1" />
          </p>
          <p className='mb-4'>{t('about.firstSection.p2')}</p>
          <p className='mb-7'>
            <Trans i18nKey="about.firstSection.p3" />
          </p>

          <h2 className='font-semibold text-3xl mb-3'>{t('about.secondSection.title')}</h2>
          <p className='mb-4'>
            {t('about.secondSection.p1.beforeLinks')}
            <AboutLink url={'https://ethereum.org/'} content={'Ethereum'} />&nbsp;{t('common.and')}&nbsp;
            <AboutLink url={'https://www.hyperledger.org/use/fabric'} content={'Hyperledger Fabric'} />&nbsp;
            <Trans i18nKey="about.secondSection.p1.afterLinks" />
          </p>
          <p className='mb-4'>
            <Trans i18nKey="about.secondSection.p2" />
          </p>
          <p className='mb-8'>
            <Trans i18nKey="about.secondSection.p3" />
          </p>

        </div>
        <span className="mb-3 text-lg text-center dark:text-gray-200">&copy; 2020-2022 - MORELab</span>
      </div>
    </>
  );
};