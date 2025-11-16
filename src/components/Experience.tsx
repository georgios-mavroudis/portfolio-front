import { HStack, Image, Link } from '@chakra-ui/react';
import tsuga from '@/assets/tsuga.png';
import cardiologs from '@/assets/cardiologs.png';
import maillance from '@/assets/maillance.png';
import akka from '@/assets/akka.png';
import econais from '@/assets/econais.png';

type Experience = {
  png: string;
  link: string;
};
const EXPERIENCES: Experience[] = [
  {
    png: tsuga,
    link: 'https://www.tsuga.com/',
  },
  {
    png: cardiologs,
    link: 'https://www.philips.co.uk/healthcare/ambulatory-monitoring-and-diagnostics/ecg-monitoring/cardiologs-ecg-analysis',
  },
  {
    png: maillance,
    link: 'https://oilfield.ai/',
  },
  {
    png: akka,
    link: 'https://www.akkodis.com/',
  },
  {
    png: econais,
    link: 'https://econais.com/',
  },
];
export const Experience = () => {
  return (
    <HStack width="70%" flexWrap="wrap" gap="lg">
      {EXPERIENCES.map(({ png, link }) => (
        <Link href={link} target="_blank" bgSize={50}>
          <Image src={png} rounded="md" border="md" borderColor="border.primary" />
        </Link>
      ))}
    </HStack>
  );
};
