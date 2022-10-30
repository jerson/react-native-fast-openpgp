import {Button} from "react-native";
import React, {useState} from "react";
import OpenPGP, { Algorithm, Curve } from 'react-native-fast-openpgp';
import SectionContainer from "../components/SectionContainer";
import SectionTitle from "../components/SectionTitle";
import SectionResult from "../components/SectionResult";
import Container from "../components/Container";

interface Props {
    publicKey: string,
    privateKey: string,
    passphrase: string
}

export default function ({}: Props) {

    const [keyPair, setKeyPair] = useState({publicKey: '', privateKey: ''});

    return <Container  testID={'generate'}>
        <SectionContainer  testID={'generator'}>
            <SectionTitle>Generate</SectionTitle>

            <Button
                title={"Generate"}
                testID={'button'}
                onPress={async () => {
                    const output = await OpenPGP.generate({
                        name: 'test',
                        email: 'test@test.com',
                        passphrase: 'test',
                        keyOptions: {
                            algorithm:Algorithm.ECDSA,
                            curve:Curve.P256
                        },
                    });
                    setKeyPair(output);
                }}
            />
            {!!keyPair && !!keyPair.publicKey && <SectionResult testID={'publicKey'}>{keyPair.publicKey}</SectionResult>}
            {!!keyPair && !!keyPair.privateKey && <SectionResult testID={'privateKey'}>{keyPair.privateKey}</SectionResult>}
        </SectionContainer>

    </Container>;
}
