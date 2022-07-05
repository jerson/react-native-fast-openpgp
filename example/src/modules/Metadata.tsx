import { Colors } from 'react-native/Libraries/NewAppScreen';
import { Button, TextInput } from 'react-native';
import React, { useState } from 'react';
import OpenPGP from 'react-native-fast-openpgp';
import SectionContainer from '../components/SectionContainer';
import SectionTitle from '../components/SectionTitle';
import SectionResult from '../components/SectionResult';
import Container from '../components/Container';

interface Props {
  publicKey: string;
  privateKey: string;
}

export default function ({ publicKey, privateKey }: Props) {
  const [metadataPrivateKey, setMetadataPrivateKey] = useState('');
  const [metadataPublicKey, setMetadataPublicKey] = useState('');

  return (
    <Container testID={'metadata'}>
      <SectionContainer testID={'privatekey'}>
        <SectionTitle>Metadata PrivateKey</SectionTitle>
        <Button
          title={'getPrivateKeyMetadata'}
          testID={'button'}
          onPress={async () => {
            const output = await OpenPGP.getPrivateKeyMetadata(privateKey);
            setMetadataPrivateKey(JSON.stringify(output, null, 2));
          }}
        />
        {!!metadataPrivateKey && <SectionResult testID={'result'}>{metadataPrivateKey}</SectionResult>}
      </SectionContainer>
      <SectionContainer testID={'publikey'}>
        <SectionTitle>Metadata PrivateKey</SectionTitle>
        <Button
          title={'getPublicKeyMetadata'}
          testID={'button'}
          onPress={async () => {
            const output = await OpenPGP.getPublicKeyMetadata(publicKey);
            setMetadataPublicKey(JSON.stringify(output, null, 2));
          }}
        />
        {!!metadataPublicKey && <SectionResult testID={'result'}>{metadataPublicKey}</SectionResult>}
      </SectionContainer>
    </Container>
  );
}
