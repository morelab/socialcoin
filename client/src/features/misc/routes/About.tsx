import { ExternalLinkIcon } from '@heroicons/react/solid';
import { useTranslation } from 'react-i18next';
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

          <p className='mb-4'>{t('about.firstSection.p1')}</p>
          <p className='mb-4'>{t('about.firstSection.p2')}</p>
          <p className='mb-7'>{t('about.firstSection.p3')}</p>

          <h2 className='font-semibold text-3xl mb-3'>{t('about.secondSection.title')}</h2>
          <p className='mb-4'>
            Hay varios roles que conforman la plataforma de DeustoCoin, además de una criptomoneda compatible
            con <AboutLink url={'https://ethereum.org/'} content={'Ethereum'} />&nbsp;y&nbsp;
            <AboutLink url={'https://www.hyperledger.org/use/fabric'} content={'Hyperledger Fabric'} />&nbsp;<b>(UDCoin) </b>
            que será la moneda a canjear para las diferentes ofertas. Los roles en cuestión varían en función
            del usuario, y hay tres: <b>colaborador</b>, <b>promotor</b>, y un <b>administrador</b> que podrá realizar las
            tareas de los dos tipos de usuario anteriores.
          </p>
          <p className='mb-4'>
            El <b>colaborador</b> podrá realizar una serie de tareas como el envío de monedas a compañeros, consulta de
            campañas, canjeo de UDCoins en ofertas y registro y confirmación de una buena acción para así obtener su respectiva
            recompensa.
          </p>
          <p className='mb-8'>
            Los <b>promotores</b> podrán lanzar campañas y acciones, monitorizar los KPIs de las mismas, y observar en gráficas
            el progreso de las acciones correspondientes a las campañas.
          </p>

        </div>
        <span className="mb-3 text-lg text-center dark:text-gray-200">&copy; 2020-2022 - MORELab</span>
      </div>
    </>
  );
};