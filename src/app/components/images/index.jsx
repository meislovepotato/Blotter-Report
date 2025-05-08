import Image from 'next/image';

import logo from '../../assets/logo.png';
import background from '../../assets/background.jpg';

export const BarangayLogo = ({ width, height }) => (
  <Image src={logo} alt='logo' width={width} height={height} />
);

export const Background = ({ width, height }) => (
  <Image src={background} alt='background' width={width} height={height} />
);